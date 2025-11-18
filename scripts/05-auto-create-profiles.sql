-- ============================================
-- AUTO-CREATE USER PROFILE TRIGGER
-- ============================================
-- This trigger automatically creates a user_profile entry
-- whenever a new user signs up via Supabase Auth
-- Username format: [username][number][6-digit-id]
-- Example: johnsmith1234567

-- Create the function that will be triggered
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  user_number INTEGER;
  user_id_6digit TEXT;
  final_username TEXT;
BEGIN
  -- Extract base username from email (part before @)
  base_username := LOWER(REGEXP_REPLACE(split_part(NEW.email, '@', 1), '[^a-z0-9]', '', 'g'));
  
  -- Count existing users with similar username to get the number
  SELECT COUNT(*) + 1 INTO user_number
  FROM user_profiles
  WHERE LOWER(first_name) = base_username OR email LIKE base_username || '%';
  
  -- Get first 6 digits from UUID (convert to number)
  user_id_6digit := LPAD(
    (ABS(('x' || SUBSTRING(REPLACE(NEW.id::TEXT, '-', ''), 1, 8))::BIT(32)::BIGINT) % 1000000)::TEXT,
    6,
    '0'
  );
  
  -- Combine to create final username: username + number + 6digits
  final_username := base_username || user_number || user_id_6digit;
  
  -- Insert the user profile
  INSERT INTO public.user_profiles (
    id, 
    email, 
    role, 
    first_name, 
    last_name,
    headline
  )
  VALUES (
    NEW.id,
    NEW.email,
    'candidate', -- Default role is candidate
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    final_username -- Store the generated username in headline field temporarily
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- CREATE PROFILES FOR EXISTING USERS
-- ============================================
-- This will create profiles for any existing auth users who don't have them

DO $$
DECLARE
  user_record RECORD;
  base_username TEXT;
  user_number INTEGER;
  user_id_6digit TEXT;
  final_username TEXT;
BEGIN
  FOR user_record IN 
    SELECT au.id, au.email
    FROM auth.users au
    LEFT JOIN user_profiles up ON au.id = up.id
    WHERE up.id IS NULL
  LOOP
    -- Extract base username from email
    base_username := LOWER(REGEXP_REPLACE(split_part(user_record.email, '@', 1), '[^a-z0-9]', '', 'g'));
    
    -- Count existing users
    SELECT COUNT(*) + 1 INTO user_number
    FROM user_profiles
    WHERE LOWER(first_name) = base_username OR email LIKE base_username || '%';
    
    -- Get 6 digits from UUID
    user_id_6digit := LPAD(
      (ABS(('x' || SUBSTRING(REPLACE(user_record.id::TEXT, '-', ''), 1, 8))::BIT(32)::BIGINT) % 1000000)::TEXT,
      6,
      '0'
    );
    
    -- Create username
    final_username := base_username || user_number || user_id_6digit;
    
    -- Insert profile
    INSERT INTO user_profiles (id, email, role, first_name, last_name, headline)
    VALUES (
      user_record.id,
      user_record.email,
      'candidate',
      split_part(user_record.email, '@', 1),
      '',
      final_username
    );
    
    RAISE NOTICE 'Created profile for % with username: %', user_record.email, final_username;
  END LOOP;
END $$;

-- ============================================
-- VERIFY PROFILES
-- ============================================
-- Check all users and their generated usernames
SELECT 
  au.id,
  au.email,
  up.role,
  up.first_name,
  up.last_name,
  up.headline as generated_username,
  au.created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id
ORDER BY au.created_at DESC;
