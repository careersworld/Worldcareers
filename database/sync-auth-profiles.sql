-- ============================================================================
-- Sync Auth Users with Database Profiles
-- ============================================================================
-- This script updates the database profiles to match the auth user IDs
-- Run this after creating auth users with the script
-- ============================================================================

DO $$
DECLARE
    -- These are the User IDs from the create-auth-users script output
    -- REPLACE THESE with the actual UUIDs from your script output!
    admin_auth_id UUID := '335471cd-2597-441b-998d-2d5772483700';
    company_auth_id UUID := '8ca3ebca-1c40-46c3-9159-a407f2011fef';
    candidate_auth_id UUID := '85d70fc3-bd75-440c-b57a-18d75c004625';
    
    -- Get the old profile IDs
    old_admin_id UUID;
    old_company_id UUID;
    old_candidate_id UUID;
BEGIN
    RAISE NOTICE '🔄 Syncing auth users with database profiles...';
    RAISE NOTICE '';
    
    -- Get old IDs
    SELECT id INTO old_admin_id FROM admin_profiles WHERE email = 'admin@worldcareers.rw';
    SELECT id INTO old_company_id FROM company_profiles WHERE email = 'company@techcorp.rw';
    SELECT id INTO old_candidate_id FROM candidate_profiles WHERE email = 'candidate@example.com';
    
    -- Temporarily disable foreign key constraints
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_created_by_fkey;
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_company_id_fkey;
    ALTER TABLE blogs DROP CONSTRAINT IF EXISTS blogs_created_by_fkey;
    ALTER TABLE career_insights DROP CONSTRAINT IF EXISTS career_insights_created_by_fkey;
    ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_user_id_fkey;
    ALTER TABLE saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_user_id_fkey;
    
    -- Update admin profile
    IF old_admin_id IS NOT NULL THEN
        -- Update related records first
        UPDATE jobs SET created_by = admin_auth_id WHERE created_by = old_admin_id;
        UPDATE blogs SET created_by = admin_auth_id WHERE created_by = old_admin_id;
        UPDATE career_insights SET created_by = admin_auth_id WHERE created_by = old_admin_id;
        
        -- Delete old profile
        DELETE FROM admin_profiles WHERE id = old_admin_id;
        
        RAISE NOTICE '✅ Updated admin profile references';
    END IF;
    
    -- Insert new admin profile
    INSERT INTO admin_profiles (id, email, first_name, last_name)
    VALUES (admin_auth_id, 'admin@worldcareers.rw', 'Admin', 'User')
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name;
    
    RAISE NOTICE '✅ Admin profile synced';
    
    -- Update company profile
    IF old_company_id IS NOT NULL THEN
        -- Update related records
        UPDATE jobs SET company_id = company_auth_id WHERE company_id = old_company_id;
        UPDATE jobs SET created_by = company_auth_id WHERE created_by = old_company_id;
        
        -- Delete old profile
        DELETE FROM company_profiles WHERE id = old_company_id;
        
        RAISE NOTICE '✅ Updated company profile references';
    END IF;
    
    -- Insert new company profile
    INSERT INTO company_profiles (id, email, company_name, description, website_url, industry, company_size, location)
    VALUES (
        company_auth_id,
        'company@techcorp.rw',
        'Tech Corp Rwanda',
        'Leading technology company in Rwanda, specializing in software development and digital transformation.',
        'https://techcorp.rw',
        'Technology',
        '50-200',
        'Kigali, Rwanda'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        company_name = EXCLUDED.company_name;
    
    RAISE NOTICE '✅ Company profile synced';
    
    -- Update candidate profile
    IF old_candidate_id IS NOT NULL THEN
        -- Update related records
        UPDATE job_applications SET user_id = candidate_auth_id WHERE user_id = old_candidate_id;
        UPDATE saved_jobs SET user_id = candidate_auth_id WHERE user_id = old_candidate_id;
        
        -- Delete old profile
        DELETE FROM candidate_profiles WHERE id = old_candidate_id;
        
        RAISE NOTICE '✅ Updated candidate profile references';
    END IF;
    
    -- Insert new candidate profile
    INSERT INTO candidate_profiles (id, email, first_name, last_name, headline, bio, location, skills, experience_years)
    VALUES (
        candidate_auth_id,
        'candidate@example.com',
        'John',
        'Doe',
        'Full Stack Developer',
        'Passionate software developer with 5 years of experience in web development.',
        'Kigali, Rwanda',
        ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL'],
        5
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name;
    
    RAISE NOTICE '✅ Candidate profile synced';
    
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ All profiles synced successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 You can now use the app with full functionality!';
    RAISE NOTICE '';
    
END $$;
