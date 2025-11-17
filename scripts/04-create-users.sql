-- ============================================
-- STEP-BY-STEP USER CREATION GUIDE
-- ============================================

-- IMPORTANT: Before running this script, you MUST create users in Supabase Auth first!

-- STEP 1: Go to Supabase Dashboard → Authentication → Users
-- Click "Add user" → "Create new user" for each user below

-- ============================================
-- CREATE ADMIN USER
-- ============================================
-- In Supabase Auth Dashboard:
-- Email: admin@worldcareers.com
-- Password: Admin@123456
-- Auto Confirm User: YES (check this box)
-- After creating, COPY THE USER ID (it will be a UUID like: 12345678-1234-1234-1234-123456789abc)

-- Then run this SQL (replace YOUR-ADMIN-USER-ID with the actual UUID):
-- REPLACE 'YOUR-ADMIN-USER-ID' WITH THE ACTUAL USER ID FROM SUPABASE AUTH!

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
  'YOUR-ADMIN-USER-ID'::uuid,  -- ⚠️ REPLACE THIS!
  'admin@worldcareers.com',
  'admin',
  'Admin',
  'User',
  'Platform Administrator',
  'Managing WorldCareers platform and helping job seekers find their dream careers.',
  true
);

-- ============================================
-- CREATE CANDIDATE USER 1
-- ============================================
-- In Supabase Auth Dashboard:
-- Email: john.smith@example.com
-- Password: Candidate@123
-- Auto Confirm User: YES
-- Copy the User ID after creation

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
  'YOUR-CANDIDATE-1-USER-ID'::uuid,  -- ⚠️ REPLACE THIS!
  'john.smith@example.com',
  'candidate',
  'John',
  'Smith',
  'Full Stack Developer | React & Node.js Expert',
  'Passionate software engineer with 5+ years of experience building scalable web applications. Specializing in React, Node.js, TypeScript, and cloud technologies. Strong focus on clean code and user experience.',
  'San Francisco, CA',
  'https://linkedin.com/in/johnsmith',
  'https://github.com/johnsmith',
  ARRAY['full-time', 'contract'],
  100000,
  150000,
  'remote',
  true,
  true
);

-- ============================================
-- CREATE CANDIDATE USER 2
-- ============================================
-- In Supabase Auth Dashboard:
-- Email: sarah.jones@example.com
-- Password: Candidate@123
-- Auto Confirm User: YES
-- Copy the User ID after creation

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
  'YOUR-CANDIDATE-2-USER-ID'::uuid,  -- ⚠️ REPLACE THIS!
  'sarah.jones@example.com',
  'candidate',
  'Sarah',
  'Jones',
  'UX/UI Designer | Product Design Specialist',
  'Creative UX/UI designer with a passion for creating beautiful, intuitive digital experiences. 4 years of experience working with startups and enterprises to deliver user-centered design solutions.',
  'New York, NY',
  'https://linkedin.com/in/sarahjones',
  ARRAY['full-time', 'part-time'],
  80000,
  120000,
  'hybrid',
  true,
  true
);

-- ============================================
-- ALTERNATIVE: QUICK SETUP WITH PLACEHOLDER IDs
-- ============================================
-- If you want to test the schema first without real auth users,
-- you can create placeholder profiles (but login won't work until you create real auth users)

-- Uncomment these lines ONLY for testing the schema:
/*
INSERT INTO user_profiles (id, email, role, first_name, last_name, headline) VALUES 
  (gen_random_uuid(), 'admin@test.com', 'admin', 'Admin', 'Test', 'Test Admin'),
  (gen_random_uuid(), 'candidate1@test.com', 'candidate', 'Test', 'Candidate1', 'Test Candidate'),
  (gen_random_uuid(), 'candidate2@test.com', 'candidate', 'Test', 'Candidate2', 'Test Candidate');
*/

-- ============================================
-- VERIFY YOUR USERS
-- ============================================
-- Run this query to check if profiles were created successfully:

SELECT 
  id,
  email,
  role,
  first_name,
  last_name,
  headline,
  created_at
FROM user_profiles
ORDER BY created_at DESC;

-- ============================================
-- QUICK REFERENCE - CREDENTIALS
-- ============================================

-- Admin Login:
--   Email: admin@worldcareers.com
--   Password: Admin@123456

-- Candidate 1 Login:
--   Email: john.smith@example.com
--   Password: Candidate@123

-- Candidate 2 Login:
--   Email: sarah.jones@example.com
--   Password: Candidate@123
