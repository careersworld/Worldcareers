-- ============================================================================
-- SQL Syntax Validation Script
-- ============================================================================
-- Run this script FIRST to validate your database setup
-- This will check if the schema can be created without errors
-- ============================================================================

-- Test 1: Check PostgreSQL version
DO $$
BEGIN
    RAISE NOTICE '=== Test 1: PostgreSQL Version ===';
    RAISE NOTICE 'Version: %', version();
END $$;

-- Test 2: Check required extensions
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 2: Extensions ===';
    
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        RAISE NOTICE '✅ uuid-ossp extension is installed';
    ELSE
        RAISE NOTICE '❌ uuid-ossp extension is NOT installed';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        RAISE NOTICE '✅ pg_trgm extension is installed';
    ELSE
        RAISE NOTICE '❌ pg_trgm extension is NOT installed';
    END IF;
END $$;

-- Test 3: Check if tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 3: Tables ===';
    
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'admin_profiles', 'candidate_profiles', 'company_profiles',
        'company_invites', 'jobs', 'blogs', 'career_insights',
        'job_applications', 'saved_jobs', 'content_views', 'web_analytics'
    );
    
    RAISE NOTICE 'Tables found: % out of 11', table_count;
    
    IF table_count = 11 THEN
        RAISE NOTICE '✅ All tables exist';
    ELSIF table_count > 0 THEN
        RAISE NOTICE '⚠️  Some tables exist, some are missing';
    ELSE
        RAISE NOTICE '❌ No tables found - run complete-schema.sql';
    END IF;
END $$;

-- Test 4: Check if functions exist
DO $$
DECLARE
    function_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 4: Functions ===';
    
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name IN (
        'track_content_view', 'update_updated_at_column',
        'increment_application_count', 'decrement_application_count',
        'get_user_role'
    );
    
    RAISE NOTICE 'Functions found: % out of 5', function_count;
    
    IF function_count = 5 THEN
        RAISE NOTICE '✅ All functions exist';
    ELSIF function_count > 0 THEN
        RAISE NOTICE '⚠️  Some functions exist, some are missing';
    ELSE
        RAISE NOTICE '❌ No functions found - run complete-schema.sql';
    END IF;
END $$;

-- Test 5: Check if views exist
DO $$
DECLARE
    view_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 5: Views ===';
    
    SELECT COUNT(*) INTO view_count
    FROM information_schema.views
    WHERE table_schema = 'public'
    AND table_name IN ('all_users', 'dashboard_stats');
    
    RAISE NOTICE 'Views found: % out of 2', view_count;
    
    IF view_count = 2 THEN
        RAISE NOTICE '✅ All views exist';
    ELSIF view_count > 0 THEN
        RAISE NOTICE '⚠️  Some views exist, some are missing';
    ELSE
        RAISE NOTICE '❌ No views found - run complete-schema.sql';
    END IF;
END $$;

-- Test 6: Check RLS status
DO $$
DECLARE
    rls_enabled_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 6: Row Level Security ===';
    
    SELECT COUNT(*) INTO rls_enabled_count
    FROM pg_tables
    WHERE schemaname = 'public'
    AND rowsecurity = true;
    
    RAISE NOTICE 'Tables with RLS enabled: %', rls_enabled_count;
    
    IF rls_enabled_count >= 11 THEN
        RAISE NOTICE '✅ RLS is enabled on all tables';
    ELSIF rls_enabled_count > 0 THEN
        RAISE NOTICE '⚠️  RLS is enabled on some tables';
    ELSE
        RAISE NOTICE '❌ RLS is not enabled - run complete-schema.sql';
    END IF;
END $$;

-- Test 7: Check RLS policies
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 7: RLS Policies ===';
    
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public';
    
    RAISE NOTICE 'Policies found: %', policy_count;
    
    IF policy_count >= 40 THEN
        RAISE NOTICE '✅ All policies exist';
    ELSIF policy_count > 0 THEN
        RAISE NOTICE '⚠️  Some policies exist, some are missing';
    ELSE
        RAISE NOTICE '❌ No policies found - run complete-schema.sql';
    END IF;
END $$;

-- Test 8: Check indexes
DO $$
DECLARE
    index_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 8: Indexes ===';
    
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE schemaname = 'public';
    
    RAISE NOTICE 'Indexes found: %', index_count;
    
    IF index_count >= 30 THEN
        RAISE NOTICE '✅ Indexes are created';
    ELSIF index_count > 0 THEN
        RAISE NOTICE '⚠️  Some indexes exist';
    ELSE
        RAISE NOTICE '❌ No indexes found - run complete-schema.sql';
    END IF;
END $$;

-- Test 9: Check enum types
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 9: Enum Types ===';
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        RAISE NOTICE '✅ user_role enum exists';
    ELSE
        RAISE NOTICE '❌ user_role enum missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
        RAISE NOTICE '✅ job_type enum exists';
    ELSE
        RAISE NOTICE '❌ job_type enum missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_type') THEN
        RAISE NOTICE '✅ location_type enum exists';
    ELSE
        RAISE NOTICE '❌ location_type enum missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
        RAISE NOTICE '✅ content_status enum exists';
    ELSE
        RAISE NOTICE '❌ content_status enum missing';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        RAISE NOTICE '✅ application_status enum exists';
    ELSE
        RAISE NOTICE '❌ application_status enum missing';
    END IF;
END $$;

-- Test 10: Test a simple query on each table
DO $$
DECLARE
    test_result BOOLEAN;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== Test 10: Table Access ===';
    
    -- Test each table
    BEGIN
        PERFORM 1 FROM admin_profiles LIMIT 1;
        RAISE NOTICE '✅ admin_profiles is accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ admin_profiles error: %', SQLERRM;
    END;
    
    BEGIN
        PERFORM 1 FROM candidate_profiles LIMIT 1;
        RAISE NOTICE '✅ candidate_profiles is accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ candidate_profiles error: %', SQLERRM;
    END;
    
    BEGIN
        PERFORM 1 FROM company_profiles LIMIT 1;
        RAISE NOTICE '✅ company_profiles is accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ company_profiles error: %', SQLERRM;
    END;
    
    BEGIN
        PERFORM 1 FROM jobs LIMIT 1;
        RAISE NOTICE '✅ jobs is accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ jobs error: %', SQLERRM;
    END;
    
    BEGIN
        PERFORM 1 FROM blogs LIMIT 1;
        RAISE NOTICE '✅ blogs is accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ blogs error: %', SQLERRM;
    END;
    
    BEGIN
        PERFORM 1 FROM career_insights LIMIT 1;
        RAISE NOTICE '✅ career_insights is accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ career_insights error: %', SQLERRM;
    END;
END $$;

-- Final Summary
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== VALIDATION COMPLETE ===';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. If all tests passed ✅ - Your database is ready!';
    RAISE NOTICE '2. If some tests failed ❌ - Run complete-schema.sql';
    RAISE NOTICE '3. After schema is created - Run test-data.sql';
    RAISE NOTICE '4. Check VALIDATION_CHECKLIST.md for detailed troubleshooting';
    RAISE NOTICE '';
END $$;
