-- ============================================
-- DATABASE PERFORMANCE OPTIMIZATION
-- ============================================
-- This script adds indexes and optimizations to speed up database queries

-- ============================================
-- 1. ADD INDEXES FOR FASTER QUERIES
-- ============================================

-- User profiles - frequently queried fields
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Jobs - most common queries
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_views_count ON jobs(views_count DESC);

-- Composite index for job filtering (common query pattern)
CREATE INDEX IF NOT EXISTS idx_jobs_status_type_location ON jobs(status, job_type, location);

-- Full-text search index for jobs
CREATE INDEX IF NOT EXISTS idx_jobs_title_search ON jobs USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_description_search ON jobs USING GIN(to_tsvector('english', description));

-- Blogs
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_views_count ON blogs(views_count DESC);

-- Career insights
CREATE INDEX IF NOT EXISTS idx_career_insights_slug ON career_insights(slug);
CREATE INDEX IF NOT EXISTS idx_career_insights_category ON career_insights(category);
CREATE INDEX IF NOT EXISTS idx_career_insights_published_at ON career_insights(published_at DESC);

-- Companies
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);

-- Job applications (if table exists)
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON job_applications(applied_at DESC);

-- Saved jobs (if table exists)
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_saved_at ON saved_jobs(saved_at DESC);

-- ============================================
-- 2. ANALYZE TABLES FOR QUERY OPTIMIZATION
-- ============================================
ANALYZE user_profiles;
ANALYZE jobs;
ANALYZE blogs;
ANALYZE career_insights;
ANALYZE companies;

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY POLICIES (if not already enabled)
-- ============================================
-- Note: Only enable if you want RLS, otherwise skip this section

-- ============================================
-- 4. CREATE MATERIALIZED VIEW FOR DASHBOARD STATS (OPTIONAL)
-- ============================================
-- This pre-calculates common statistics for faster dashboard loading

CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM jobs WHERE status = 'active') as active_jobs,
  (SELECT COUNT(*) FROM blogs) as total_blogs,
  (SELECT COUNT(*) FROM career_insights) as total_insights,
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COALESCE(SUM(views_count), 0) FROM jobs) as total_job_views,
  (SELECT COALESCE(SUM(views_count), 0) FROM blogs) as total_blog_views,
  (SELECT COALESCE(SUM(views_count), 0) FROM career_insights) as total_insight_views,
  NOW() as last_updated;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_updated ON dashboard_stats(last_updated);

-- Function to refresh stats (call this periodically or on data changes)
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. OPTIMIZE COMMON QUERIES
-- ============================================

-- Create a function for faster job search
CREATE OR REPLACE FUNCTION search_jobs(
  search_term TEXT DEFAULT NULL,
  job_status TEXT DEFAULT 'active',
  job_location TEXT DEFAULT NULL,
  job_type_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  company TEXT,
  location TEXT,
  job_type TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  created_at TIMESTAMPTZ,
  views_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.title,
    j.company,
    j.location,
    j.job_type,
    j.salary_min,
    j.salary_max,
    j.created_at,
    j.views_count
  FROM jobs j
  WHERE 
    (job_status IS NULL OR j.status = job_status)
    AND (job_location IS NULL OR j.location ILIKE '%' || job_location || '%')
    AND (job_type_filter IS NULL OR j.job_type = job_type_filter)
    AND (
      search_term IS NULL 
      OR j.title ILIKE '%' || search_term || '%'
      OR j.description ILIKE '%' || search_term || '%'
      OR j.company ILIKE '%' || search_term || '%'
    )
  ORDER BY j.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 6. VACUUM AND ANALYZE
-- ============================================
-- Run this to clean up and optimize tables
VACUUM ANALYZE user_profiles;
VACUUM ANALYZE jobs;
VACUUM ANALYZE blogs;
VACUUM ANALYZE career_insights;
VACUUM ANALYZE companies;

-- ============================================
-- 7. VERIFY INDEXES
-- ============================================
-- Check all indexes on important tables
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'jobs', 'blogs', 'career_insights', 'companies')
ORDER BY tablename, indexname;

-- ============================================
-- 8. CHECK TABLE SIZES
-- ============================================
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
