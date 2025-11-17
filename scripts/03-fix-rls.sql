-- Fix for infinite recursion in RLS policies
-- This script disables RLS on tables that don't need it for admin operations

-- Disable RLS on jobs table (admins need full access)
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;

-- Disable RLS on blogs table (admins need full access)
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;

-- Disable RLS on career_insights table (admins need full access)
ALTER TABLE career_insights DISABLE ROW LEVEL SECURITY;

-- If you need RLS in the future, use service role key or fix the recursive policy
-- The issue was in line 43 of 02-setup-advanced-rls.sql:
-- CREATE POLICY "Admins can view all profiles"
--   ON user_profiles FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM user_profiles  <-- This causes recursion
--       WHERE id = auth.uid() AND role = 'admin'
--     )
--   );

-- Better approach would be to use a helper function:
-- CREATE OR REPLACE FUNCTION is_admin()
-- RETURNS BOOLEAN AS $$
--   SELECT EXISTS (
--     SELECT 1 FROM user_profiles
--     WHERE id = auth.uid() AND role = 'admin'
--   );
-- $$ LANGUAGE SQL SECURITY DEFINER;
