-- ============================================================================
-- WorldCareers Complete Database Schema
-- ============================================================================
-- This script creates a complete, production-ready database schema for the
-- WorldCareers platform. It includes:
-- - User management (admin, candidate, company profiles)
-- - Content management (jobs, blogs, career insights)
-- - Engagement tracking (views, applications, saved jobs)
-- - Analytics and reporting
-- - Row Level Security (RLS) policies
-- - Database functions and triggers
-- - Indexes for performance
-- ============================================================================

-- ============================================================================
-- SECTION 1: EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for better text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- SECTION 2: ENUMS
-- ============================================================================

-- User roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'candidate', 'company');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Job types
DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'internship', 'volunteer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Location types
DO $$ BEGIN
    CREATE TYPE location_type AS ENUM ('remote', 'onsite', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Content status
DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('draft', 'pending', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Application status
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- SECTION 3: CORE USER TABLES
-- ============================================================================

-- Admin Profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Candidate Profiles
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    headline TEXT,
    bio TEXT,
    location TEXT,
    phone TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    skills TEXT[],
    experience_years INTEGER,
    education TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Company Profiles
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    industry TEXT,
    company_size TEXT,
    location TEXT,
    founded_year INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Company Invites (for admin to invite companies)
CREATE TABLE IF NOT EXISTS company_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 4: CONTENT TABLES
-- ============================================================================

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_id UUID REFERENCES company_profiles(id) ON DELETE SET NULL,
    company_logo_url TEXT,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type job_type NOT NULL DEFAULT 'full-time',
    location_type location_type NOT NULL DEFAULT 'onsite',
    category TEXT,
    application_link TEXT NOT NULL,
    deadline TIMESTAMPTZ,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'RWF',
    responsibilities TEXT[],
    requirements TEXT[],
    benefits TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    image_url TEXT,
    status content_status DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Career Insights Table
CREATE TABLE IF NOT EXISTS career_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    views_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 5: ENGAGEMENT TABLES
-- ============================================================================

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    cover_letter TEXT,
    resume_url TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Saved Jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Content Views (unified tracking for all content types)
CREATE TABLE IF NOT EXISTS content_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type TEXT NOT NULL, -- 'job', 'blog', 'career_insight'
    content_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address TEXT,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 6: ANALYTICS TABLES
-- ============================================================================

-- Web Analytics (for tracking page views, visitors, etc.)
CREATE TABLE IF NOT EXISTS web_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SECTION 7: VIEWS
-- ============================================================================

-- Unified view of all users across different profile types
CREATE OR REPLACE VIEW all_users AS
SELECT 
    id,
    email,
    'admin' as role,
    first_name,
    last_name,
    NULL as company_name,
    created_at,
    updated_at
FROM admin_profiles
UNION ALL
SELECT 
    id,
    email,
    'candidate' as role,
    first_name,
    last_name,
    NULL as company_name,
    created_at,
    updated_at
FROM candidate_profiles
UNION ALL
SELECT 
    id,
    email,
    'company' as role,
    NULL as first_name,
    NULL as last_name,
    company_name,
    created_at,
    updated_at
FROM company_profiles;

-- Dashboard statistics view (for admin dashboard)
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM jobs WHERE is_active = TRUE AND (deadline IS NULL OR deadline >= NOW())) as active_jobs,
    (SELECT COUNT(*) FROM blogs) as total_blogs,
    (SELECT COUNT(*) FROM career_insights) as total_insights,
    (SELECT COUNT(*) FROM company_profiles) as total_companies,
    (SELECT COALESCE(SUM(views_count), 0) FROM jobs) as total_job_views,
    (SELECT COALESCE(SUM(views_count), 0) FROM blogs) as total_blog_views,
    (SELECT COALESCE(SUM(views_count), 0) FROM career_insights) as total_insight_views,
    (SELECT COUNT(*) FROM job_applications) as total_applications,
    (SELECT COUNT(*) FROM candidate_profiles) as total_candidates;

-- ============================================================================
-- SECTION 8: FUNCTIONS
-- ============================================================================

-- Drop existing functions first to avoid conflicts
-- Use CASCADE to drop dependent triggers automatically
DROP FUNCTION IF EXISTS track_content_view(TEXT, UUID, UUID, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS increment_application_count() CASCADE;
DROP FUNCTION IF EXISTS decrement_application_count() CASCADE;
DROP FUNCTION IF EXISTS get_user_role(UUID) CASCADE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to track content views and update view counts
CREATE OR REPLACE FUNCTION track_content_view(
    p_content_type TEXT,
    p_content_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_table_name TEXT;
BEGIN
    -- Insert view record
    INSERT INTO content_views (content_type, content_id, user_id, ip_address, user_agent)
    VALUES (p_content_type, p_content_id, p_user_id, p_ip_address, p_user_agent);
    
    -- Determine table name and update view count
    CASE p_content_type
        WHEN 'job' THEN
            UPDATE jobs SET views_count = views_count + 1 WHERE id = p_content_id;
        WHEN 'blog' THEN
            UPDATE blogs SET views_count = views_count + 1 WHERE id = p_content_id;
        WHEN 'career_insight' THEN
            UPDATE career_insights SET views_count = views_count + 1 WHERE id = p_content_id;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment application count when a job application is created
CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs 
    SET applications_count = applications_count + 1 
    WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement application count when a job application is deleted
CREATE OR REPLACE FUNCTION decrement_application_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs 
    SET applications_count = applications_count - 1 
    WHERE id = OLD.job_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function to get user role from auth.users metadata
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT 
        CASE 
            WHEN EXISTS (SELECT 1 FROM admin_profiles WHERE id = user_id) THEN 'admin'
            WHEN EXISTS (SELECT 1 FROM company_profiles WHERE id = user_id) THEN 'company'
            WHEN EXISTS (SELECT 1 FROM candidate_profiles WHERE id = user_id) THEN 'candidate'
            ELSE NULL
        END INTO user_role;
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SECTION 9: TRIGGERS
-- ============================================================================

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS update_admin_profiles_updated_at ON admin_profiles;
CREATE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidate_profiles_updated_at ON candidate_profiles;
CREATE TRIGGER update_candidate_profiles_updated_at
    BEFORE UPDATE ON candidate_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_company_profiles_updated_at ON company_profiles;
CREATE TRIGGER update_company_profiles_updated_at
    BEFORE UPDATE ON company_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_career_insights_updated_at ON career_insights;
CREATE TRIGGER update_career_insights_updated_at
    BEFORE UPDATE ON career_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for application count
DROP TRIGGER IF EXISTS increment_application_count_trigger ON job_applications;
CREATE TRIGGER increment_application_count_trigger
    AFTER INSERT ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION increment_application_count();

DROP TRIGGER IF EXISTS decrement_application_count_trigger ON job_applications;
CREATE TRIGGER decrement_application_count_trigger
    AFTER DELETE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION decrement_application_count();

-- ============================================================================
-- SECTION 10: INDEXES
-- ============================================================================

-- User profile indexes
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_email ON candidate_profiles(email);
CREATE INDEX IF NOT EXISTS idx_company_profiles_email ON company_profiles(email);
CREATE INDEX IF NOT EXISTS idx_company_profiles_company_name ON company_profiles(company_name);

-- Job indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_location_type ON jobs(location_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm ON jobs USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_company_name_trgm ON jobs USING gin(company_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_location_trgm ON jobs USING gin(location gin_trgm_ops);

-- Blog indexes
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_created_by ON blogs(created_by);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_title_trgm ON blogs USING gin(title gin_trgm_ops);

-- Career Insights indexes
CREATE INDEX IF NOT EXISTS idx_career_insights_slug ON career_insights(slug);
CREATE INDEX IF NOT EXISTS idx_career_insights_category ON career_insights(category);
CREATE INDEX IF NOT EXISTS idx_career_insights_created_by ON career_insights(created_by);
CREATE INDEX IF NOT EXISTS idx_career_insights_created_at ON career_insights(created_at DESC);

-- Engagement indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);

-- Content views indexes
CREATE INDEX IF NOT EXISTS idx_content_views_content_type_id ON content_views(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_user_id ON content_views(user_id);
CREATE INDEX IF NOT EXISTS idx_content_views_viewed_at ON content_views(viewed_at DESC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_web_analytics_page_path ON web_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_web_analytics_user_id ON web_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_web_analytics_visited_at ON web_analytics(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_analytics_country ON web_analytics(country);
CREATE INDEX IF NOT EXISTS idx_web_analytics_device_type ON web_analytics(device_type);
CREATE INDEX IF NOT EXISTS idx_web_analytics_browser ON web_analytics(browser);

-- ============================================================================
-- SECTION 11: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Admin Profiles Policies
-- ============================================================================

DROP POLICY IF EXISTS "Admin profiles are viewable by authenticated users" ON admin_profiles;
CREATE POLICY "Admin profiles are viewable by authenticated users"
    ON admin_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update own profile" ON admin_profiles;
CREATE POLICY "Admins can update own profile"
    ON admin_profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can insert own profile" ON admin_profiles;
CREATE POLICY "Admins can insert own profile"
    ON admin_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Candidate Profiles Policies
-- ============================================================================

DROP POLICY IF EXISTS "Candidate profiles are viewable by authenticated users" ON candidate_profiles;
CREATE POLICY "Candidate profiles are viewable by authenticated users"
    ON candidate_profiles FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Candidates can update own profile" ON candidate_profiles;
CREATE POLICY "Candidates can update own profile"
    ON candidate_profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Candidates can insert own profile" ON candidate_profiles;
CREATE POLICY "Candidates can insert own profile"
    ON candidate_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Company Profiles Policies
-- ============================================================================

DROP POLICY IF EXISTS "Company profiles are viewable by everyone" ON company_profiles;
CREATE POLICY "Company profiles are viewable by everyone"
    ON company_profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Companies can update own profile" ON company_profiles;
CREATE POLICY "Companies can update own profile"
    ON company_profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Companies can insert own profile" ON company_profiles;
CREATE POLICY "Companies can insert own profile"
    ON company_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Company Invites Policies
-- ============================================================================

DROP POLICY IF EXISTS "Company invites viewable by admins" ON company_invites;
CREATE POLICY "Company invites viewable by admins"
    ON company_invites FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can create company invites" ON company_invites;
CREATE POLICY "Admins can create company invites"
    ON company_invites FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can update company invites" ON company_invites;
CREATE POLICY "Admins can update company invites"
    ON company_invites FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ============================================================================
-- Jobs Policies
-- ============================================================================

DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
CREATE POLICY "Jobs are viewable by everyone"
    ON jobs FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert jobs" ON jobs;
CREATE POLICY "Admins can insert jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Companies can insert own jobs" ON jobs;
CREATE POLICY "Companies can insert own jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM company_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can update all jobs" ON jobs;
CREATE POLICY "Admins can update all jobs"
    ON jobs FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Companies can update own jobs" ON jobs;
CREATE POLICY "Companies can update own jobs"
    ON jobs FOR UPDATE
    USING (
        company_id = auth.uid() OR created_by = auth.uid()
    );

DROP POLICY IF EXISTS "Admins can delete jobs" ON jobs;
CREATE POLICY "Admins can delete jobs"
    ON jobs FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ============================================================================
-- Blogs Policies
-- ============================================================================

DROP POLICY IF EXISTS "Published blogs are viewable by everyone" ON blogs;
CREATE POLICY "Published blogs are viewable by everyone"
    ON blogs FOR SELECT
    USING (status = 'published' OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert blogs" ON blogs;
CREATE POLICY "Authenticated users can insert blogs"
    ON blogs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own blogs" ON blogs;
CREATE POLICY "Users can update own blogs"
    ON blogs FOR UPDATE
    USING (
        created_by = auth.uid() OR 
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can delete blogs" ON blogs;
CREATE POLICY "Admins can delete blogs"
    ON blogs FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ============================================================================
-- Career Insights Policies
-- ============================================================================

DROP POLICY IF EXISTS "Career insights are viewable by everyone" ON career_insights;
CREATE POLICY "Career insights are viewable by everyone"
    ON career_insights FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert career insights" ON career_insights;
CREATE POLICY "Admins can insert career insights"
    ON career_insights FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can update career insights" ON career_insights;
CREATE POLICY "Admins can update career insights"
    ON career_insights FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Admins can delete career insights" ON career_insights;
CREATE POLICY "Admins can delete career insights"
    ON career_insights FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ============================================================================
-- Job Applications Policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own applications" ON job_applications;
CREATE POLICY "Users can view own applications"
    ON job_applications FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()) OR
        EXISTS (
            SELECT 1 FROM jobs j 
            WHERE j.id = job_applications.job_id 
            AND (j.company_id = auth.uid() OR j.created_by = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Candidates can create applications" ON job_applications;
CREATE POLICY "Candidates can create applications"
    ON job_applications FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (SELECT 1 FROM candidate_profiles WHERE id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update own applications" ON job_applications;
CREATE POLICY "Users can update own applications"
    ON job_applications FOR UPDATE
    USING (
        user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()) OR
        EXISTS (
            SELECT 1 FROM jobs j 
            WHERE j.id = job_applications.job_id 
            AND (j.company_id = auth.uid() OR j.created_by = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can delete own applications" ON job_applications;
CREATE POLICY "Users can delete own applications"
    ON job_applications FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- Saved Jobs Policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own saved jobs" ON saved_jobs;
CREATE POLICY "Users can view own saved jobs"
    ON saved_jobs FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can save jobs" ON saved_jobs;
CREATE POLICY "Users can save jobs"
    ON saved_jobs FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can unsave jobs" ON saved_jobs;
CREATE POLICY "Users can unsave jobs"
    ON saved_jobs FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- Content Views Policies
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can insert content views" ON content_views;
CREATE POLICY "Anyone can insert content views"
    ON content_views FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all content views" ON content_views;
CREATE POLICY "Admins can view all content views"
    ON content_views FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ============================================================================
-- Web Analytics Policies
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can insert web analytics" ON web_analytics;
CREATE POLICY "Anyone can insert web analytics"
    ON web_analytics FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view web analytics" ON web_analytics;
CREATE POLICY "Admins can view web analytics"
    ON web_analytics FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );

-- ============================================================================
-- SECTION 12: GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant permissions on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION track_content_view TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;

-- ============================================================================
-- SECTION 13: SAMPLE DATA (OPTIONAL - COMMENT OUT FOR PRODUCTION)
-- ============================================================================

-- This section can be uncommented to insert sample data for testing

/*
-- Sample Admin (requires auth.users entry first)
-- INSERT INTO admin_profiles (id, email, first_name, last_name)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'admin@worldcareers.rw', 'Admin', 'User');

-- Sample Company
-- INSERT INTO company_profiles (id, email, company_name, description, website_url)
-- VALUES ('00000000-0000-0000-0000-000000000002', 'company@example.com', 'Tech Corp', 'Leading technology company', 'https://techcorp.com');

-- Sample Jobs
INSERT INTO jobs (title, company_name, description, location, job_type, location_type, category, application_link)
VALUES 
    ('Software Engineer', 'Tech Corp', 'We are looking for a talented software engineer...', 'Kigali, Rwanda', 'full-time', 'hybrid', 'technology', 'https://apply.example.com/1'),
    ('Marketing Manager', 'Marketing Pro', 'Join our marketing team...', 'Kigali, Rwanda', 'full-time', 'onsite', 'marketing', 'https://apply.example.com/2'),
    ('Data Analyst Intern', 'Data Insights', 'Great opportunity for students...', 'Remote', 'internship', 'remote', 'data-science', 'https://apply.example.com/3');

-- Sample Blogs
INSERT INTO blogs (title, slug, excerpt, content, author, status)
VALUES 
    ('How to Write a Great Resume', 'how-to-write-great-resume', 'Tips for creating an outstanding resume', 'Full content here...', 'Career Expert', 'published'),
    ('Top 10 Interview Tips', 'top-10-interview-tips', 'Ace your next interview with these tips', 'Full content here...', 'HR Professional', 'published');

-- Sample Career Insights
INSERT INTO career_insights (title, slug, content, category)
VALUES 
    ('Career Growth in Tech', 'career-growth-in-tech', 'Explore opportunities in the tech industry...', 'Technology'),
    ('Networking for Success', 'networking-for-success', 'Build your professional network...', 'Career Development');
*/

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Display success message
DO $$
BEGIN
    RAISE NOTICE '✅ WorldCareers database schema created successfully!';
    RAISE NOTICE '📊 Tables created: 11';
    RAISE NOTICE '👁️  Views created: 2';
    RAISE NOTICE '⚡ Functions created: 5';
    RAISE NOTICE '🔒 RLS policies enabled on all tables';
    RAISE NOTICE '📈 Indexes created for optimal performance';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Your database is ready to use!';
END $$;
