-- Enable Row Level Security on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_work_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_insights ENABLE ROW LEVEL SECURITY;

-- ========================================
-- USER PROFILES POLICIES
-- ========================================

-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (is_profile_public = true);

-- Users can view their own profile (even if private)
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- WORK EXPERIENCE POLICIES
-- ========================================

-- Users can view own work experience
CREATE POLICY "Users can view own work experience"
  ON user_work_experience FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can view work experience of public profiles
CREATE POLICY "Public work experience is viewable"
  ON user_work_experience FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = user_work_experience.user_id AND is_profile_public = true
    )
  );

-- Users can manage their own work experience
CREATE POLICY "Users can insert own work experience"
  ON user_work_experience FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own work experience"
  ON user_work_experience FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own work experience"
  ON user_work_experience FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- EDUCATION POLICIES
-- ========================================

CREATE POLICY "Users can view own education"
  ON user_education FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public education is viewable"
  ON user_education FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = user_education.user_id AND is_profile_public = true
    )
  );

CREATE POLICY "Users can insert own education"
  ON user_education FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education"
  ON user_education FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own education"
  ON user_education FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- SKILLS POLICIES
-- ========================================

CREATE POLICY "Users can view own skills"
  ON user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public skills are viewable"
  ON user_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = user_skills.user_id AND is_profile_public = true
    )
  );

CREATE POLICY "Users can manage own skills"
  ON user_skills FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- CERTIFICATIONS POLICIES
-- ========================================

CREATE POLICY "Users can view own certifications"
  ON user_certifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public certifications are viewable"
  ON user_certifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = user_certifications.user_id AND is_profile_public = true
    )
  );

CREATE POLICY "Users can manage own certifications"
  ON user_certifications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- LANGUAGES POLICIES
-- ========================================

CREATE POLICY "Users can view own languages"
  ON user_languages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public languages are viewable"
  ON user_languages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = user_languages.user_id AND is_profile_public = true
    )
  );

CREATE POLICY "Users can manage own languages"
  ON user_languages FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- JOBS POLICIES
-- ========================================

-- Everyone can view active jobs
CREATE POLICY "Active jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (is_active = true);

-- Authenticated users can view all jobs (including inactive)
CREATE POLICY "Authenticated users can view all jobs"
  ON jobs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can insert jobs
CREATE POLICY "Admins can insert jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update jobs
CREATE POLICY "Admins can update jobs"
  ON jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete jobs
CREATE POLICY "Admins can delete jobs"
  ON jobs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- SAVED JOBS POLICIES
-- ========================================

CREATE POLICY "Users can view own saved jobs"
  ON saved_jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved jobs"
  ON saved_jobs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- JOB APPLICATIONS POLICIES
-- ========================================

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
  ON job_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON job_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can insert their own applications
CREATE POLICY "Users can create applications"
  ON job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own applications
CREATE POLICY "Users can update own applications"
  ON job_applications FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can update any application
CREATE POLICY "Admins can update applications"
  ON job_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- BLOGS POLICIES
-- ========================================

-- Everyone can view published blogs
CREATE POLICY "Published blogs are viewable by everyone"
  ON blogs FOR SELECT
  USING (is_published = true);

-- Authenticated users can view all blogs
CREATE POLICY "Authenticated users can view all blogs"
  ON blogs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can manage blogs
CREATE POLICY "Admins can insert blogs"
  ON blogs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update blogs"
  ON blogs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete blogs"
  ON blogs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========================================
-- CAREER INSIGHTS POLICIES
-- ========================================

-- Everyone can view published insights
CREATE POLICY "Published insights are viewable by everyone"
  ON career_insights FOR SELECT
  USING (is_published = true);

-- Authenticated users can view all insights
CREATE POLICY "Authenticated users can view all insights"
  ON career_insights FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can manage insights
CREATE POLICY "Admins can insert insights"
  ON career_insights FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update insights"
  ON career_insights FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete insights"
  ON career_insights FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
