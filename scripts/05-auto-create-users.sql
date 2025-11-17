-- ============================================
-- AUTOMATIC USER CREATION SCRIPT
-- ============================================
-- This script creates users directly in the database
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- First, we need to create the auth users and get their IDs
-- We'll use a DO block to handle this programmatically

DO $$
DECLARE
  admin_user_id uuid;
  candidate1_user_id uuid;
  candidate2_user_id uuid;
  admin_exists uuid;
  candidate1_exists uuid;
  candidate2_exists uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_exists FROM auth.users WHERE email = 'admin@worldcareers.com' LIMIT 1;
  
  IF admin_exists IS NULL THEN
    -- Create Admin User
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@worldcareers.com',
      crypt('Admin@123456', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO admin_user_id;
    RAISE NOTICE 'Created new admin user';
  ELSE
    admin_user_id := admin_exists;
    RAISE NOTICE 'Admin user already exists, using existing ID';
  END IF;

  -- Create admin profile
  INSERT INTO user_profiles (
    id,
    email,
    role,
    first_name,
    last_name,
    headline,
    bio,
    is_profile_public
  ) VALUES (
    admin_user_id,
    'admin@worldcareers.com',
    'admin',
    'Admin',
    'User',
    'Platform Administrator',
    'Managing WorldCareers platform and helping job seekers find their dream careers.',
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin', 
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name;

  -- Check if candidate 1 user already exists
  SELECT id INTO candidate1_exists FROM auth.users WHERE email = 'john.smith@example.com' LIMIT 1;
  
  IF candidate1_exists IS NULL THEN
    -- Create Candidate User 1
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'john.smith@example.com',
      crypt('Candidate@123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO candidate1_user_id;
    RAISE NOTICE 'Created new candidate 1 user';
  ELSE
    candidate1_user_id := candidate1_exists;
    RAISE NOTICE 'Candidate 1 user already exists, using existing ID';
  END IF;

  -- Create candidate 1 profile
  INSERT INTO user_profiles (
    id,
    email,
    role,
    first_name,
    last_name,
    headline,
    bio,
    location,
    linkedin_url,
    github_url,
    desired_job_types,
    desired_salary_min,
    desired_salary_max,
    remote_preference,
    is_open_to_opportunities,
    is_profile_public
  ) VALUES (
    candidate1_user_id,
    'john.smith@example.com',
    'candidate',
    'John',
    'Smith',
    'Full Stack Developer | React & Node.js Expert',
    'Passionate software engineer with 5+ years of experience building scalable web applications. Specializing in React, Node.js, TypeScript, and cloud technologies.',
    'San Francisco, CA',
    'https://linkedin.com/in/johnsmith',
    'https://github.com/johnsmith',
    ARRAY['full-time', 'contract'],
    100000,
    150000,
    'remote',
    true,
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'candidate',
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name;

  -- Check if candidate 2 user already exists
  SELECT id INTO candidate2_exists FROM auth.users WHERE email = 'sarah.jones@example.com' LIMIT 1;
  
  IF candidate2_exists IS NULL THEN
    -- Create Candidate User 2
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'sarah.jones@example.com',
      crypt('Candidate@123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO candidate2_user_id;
    RAISE NOTICE 'Created new candidate 2 user';
  ELSE
    candidate2_user_id := candidate2_exists;
    RAISE NOTICE 'Candidate 2 user already exists, using existing ID';
  END IF;

  -- Create candidate 2 profile
  INSERT INTO user_profiles (
    id,
    email,
    role,
    first_name,
    last_name,
    headline,
    bio,
    location,
    linkedin_url,
    desired_job_types,
    desired_salary_min,
    desired_salary_max,
    remote_preference,
    is_open_to_opportunities,
    is_profile_public
  ) VALUES (
    candidate2_user_id,
    'sarah.jones@example.com',
    'candidate',
    'Sarah',
    'Jones',
    'UX/UI Designer | Product Design Specialist',
    'Creative UX/UI designer with a passion for creating beautiful, intuitive digital experiences. 4 years of experience working with startups and enterprises.',
    'New York, NY',
    'https://linkedin.com/in/sarahjones',
    ARRAY['full-time', 'part-time'],
    80000,
    120000,
    'hybrid',
    true,
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'candidate',
      email = EXCLUDED.email,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name;

  RAISE NOTICE 'Users created successfully!';
  RAISE NOTICE 'Admin ID: %', admin_user_id;
  RAISE NOTICE 'Candidate 1 ID: %', candidate1_user_id;
  RAISE NOTICE 'Candidate 2 ID: %', candidate2_user_id;

END $$;

-- Verify users were created
SELECT 
  'auth.users' as table_name,
  email,
  created_at
FROM auth.users
WHERE email IN ('admin@worldcareers.com', 'john.smith@example.com', 'sarah.jones@example.com')
UNION ALL
SELECT 
  'user_profiles' as table_name,
  email,
  created_at
FROM user_profiles
WHERE email IN ('admin@worldcareers.com', 'john.smith@example.com', 'sarah.jones@example.com')
ORDER BY table_name, email;

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
/*

🔐 ADMIN ACCOUNT
Email: admin@worldcareers.com
Password: Admin@123456
Access: Full admin dashboard at /admin

👤 CANDIDATE 1
Email: john.smith@example.com
Password: Candidate@123
Access: Browse jobs, apply, edit profile

👤 CANDIDATE 2
Email: sarah.jones@example.com
Password: Candidate@123
Access: Browse jobs, apply, edit profile

📝 Login URL: http://localhost:3000/login

*/
