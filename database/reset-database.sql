-- ============================================================================
-- Migration Helper: Reset Database
-- ============================================================================
-- WARNING: This script will DROP ALL TABLES and recreate them from scratch.
-- Only use this in development or when you want to completely reset your database.
-- ============================================================================

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- ============================================================================
-- DROP ALL EXISTING OBJECTS
-- ============================================================================

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS all_users CASCADE;
DROP VIEW IF EXISTS dashboard_stats CASCADE;

-- Drop tables (CASCADE will drop dependent objects)
DROP TABLE IF EXISTS web_analytics CASCADE;
DROP TABLE IF EXISTS content_views CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS career_insights CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS company_invites CASCADE;
DROP TABLE IF EXISTS company_profiles CASCADE;
DROP TABLE IF EXISTS candidate_profiles CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;

-- Drop functions (CASCADE will drop dependent triggers)
DROP FUNCTION IF EXISTS track_content_view(TEXT, UUID, UUID, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_user_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS increment_application_count() CASCADE;
DROP FUNCTION IF EXISTS decrement_application_count() CASCADE;

-- Drop types/enums
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS location_type CASCADE;
DROP TYPE IF EXISTS content_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database reset complete!';
    RAISE NOTICE '📝 All tables, views, functions, and types have been dropped.';
    RAISE NOTICE '🔄 You can now run complete-schema.sql to recreate the database.';
END $$;
