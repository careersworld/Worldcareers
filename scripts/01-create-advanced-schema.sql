-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS user_work_experience CASCADE;
DROP TABLE IF EXISTS user_education CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS user_certifications CASCADE;
DROP TABLE IF EXISTS user_languages CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS career_insights CASCADE;

-- Users table (extends Supabase auth.users)
-- This stores additional profile information for both candidates and admins
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'candidate', -- 'candidate', 'admin', 'employer'
  
  -- Basic Info
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(20),
  
  -- Profile
  avatar_url TEXT,
  headline VARCHAR(255), -- Professional headline/title
  bio TEXT, -- About me/summary
  location VARCHAR(255),
  website_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  
  -- CV/Resume
  cv_url TEXT, -- Link to uploaded CV/Resume PDF
  cv_uploaded_at TIMESTAMP,
  
  -- Preferences (for candidates)
  desired_job_types TEXT[], -- ['full-time', 'part-time', 'contract']
  desired_locations TEXT[], -- Preferred work locations
  desired_salary_min INTEGER,
  desired_salary_max INTEGER,
  willing_to_relocate BOOLEAN DEFAULT FALSE,
  remote_preference VARCHAR(50), -- 'remote', 'hybrid', 'onsite', 'flexible'
  
  -- Settings
  is_profile_public BOOLEAN DEFAULT TRUE,
  is_open_to_opportunities BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP
);

-- Work Experience
CREATE TABLE user_work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  company_name VARCHAR(255) NOT NULL,
  position_title VARCHAR(255) NOT NULL,
  employment_type VARCHAR(50), -- 'full-time', 'part-time', 'contract', 'freelance', 'internship'
  location VARCHAR(255),
  is_remote BOOLEAN DEFAULT FALSE,
  
  start_date DATE NOT NULL,
  end_date DATE, -- NULL if current position
  is_current BOOLEAN DEFAULT FALSE,
  
  description TEXT,
  achievements TEXT[], -- Array of achievement bullets
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education
CREATE TABLE user_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  institution_name VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL, -- 'Bachelor', 'Master', 'PhD', 'Certificate', etc.
  field_of_study VARCHAR(255),
  location VARCHAR(255),
  
  start_date DATE NOT NULL,
  end_date DATE, -- NULL if currently studying
  is_current BOOLEAN DEFAULT FALSE,
  
  grade VARCHAR(50), -- GPA, percentage, or grade
  description TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  skill_name VARCHAR(100) NOT NULL,
  skill_category VARCHAR(100), -- 'Programming', 'Design', 'Marketing', etc.
  proficiency_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced', 'expert'
  years_of_experience INTEGER,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, skill_name)
);

-- Certifications & Licenses
CREATE TABLE user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  certification_name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255) NOT NULL,
  credential_id VARCHAR(255),
  credential_url TEXT,
  
  issue_date DATE NOT NULL,
  expiration_date DATE, -- NULL if doesn't expire
  does_not_expire BOOLEAN DEFAULT FALSE,
  
  description TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Languages
CREATE TABLE user_languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  language_name VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(50) NOT NULL, -- 'elementary', 'limited-working', 'professional-working', 'full-professional', 'native'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, language_name)
);

-- Jobs table (enhanced)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- Admin/employer who posted
  
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_logo_url TEXT,
  description TEXT NOT NULL,
  responsibilities TEXT[],
  requirements TEXT[],
  benefits TEXT[],
  
  location VARCHAR(255) NOT NULL,
  job_type VARCHAR(50) NOT NULL, -- 'full-time', 'part-time', 'internship', 'contract', 'volunteer'
  location_type VARCHAR(50) NOT NULL, -- 'remote', 'onsite', 'hybrid'
  
  experience_level VARCHAR(50), -- 'entry', 'mid', 'senior', 'lead', 'executive'
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'USD',
  
  application_link VARCHAR(500) NOT NULL,
  application_email VARCHAR(255),
  
  deadline TIMESTAMP,
  is_sponsored BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved Jobs (bookmarks)
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  
  notes TEXT, -- Personal notes about the job
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, job_id)
);

-- Job Applications (track applications)
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  
  status VARCHAR(50) DEFAULT 'applied', -- 'applied', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn'
  cover_letter TEXT,
  cv_url TEXT, -- Specific CV used for this application
  
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Admin notes (visible only to admins)
  admin_notes TEXT,
  
  UNIQUE(user_id, job_id)
);

-- Blogs table (unchanged but included for completeness)
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL, -- Display name
  image_url VARCHAR(500),
  
  is_published BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career Insights table (unchanged but included for completeness)
CREATE TABLE career_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  
  is_published BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_work_experience_user ON user_work_experience(user_id);
CREATE INDEX idx_education_user ON user_education(user_id);
CREATE INDEX idx_skills_user ON user_skills(user_id);
CREATE INDEX idx_certifications_user ON user_certifications(user_id);
CREATE INDEX idx_languages_user ON user_languages(user_id);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_location_type ON jobs(location_type);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX idx_job_applications_user ON job_applications(user_id);
CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_is_published ON blogs(is_published);
CREATE INDEX idx_career_insights_slug ON career_insights(slug);
CREATE INDEX idx_career_insights_is_published ON career_insights(is_published);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_experience_updated_at BEFORE UPDATE ON user_work_experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON user_education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON user_certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_insights_updated_at BEFORE UPDATE ON career_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
