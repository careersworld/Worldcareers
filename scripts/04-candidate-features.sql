-- Create job_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Create saved_jobs table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Add status column to blogs table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blogs' AND column_name = 'status'
  ) THEN
    ALTER TABLE blogs ADD COLUMN status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'pending', 'draft'));
  END IF;
END $$;

-- Add created_by column to blogs table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blogs' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE blogs ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);

-- Disable RLS on these tables for easier admin management
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE job_applications IS 'Tracks user job applications';
COMMENT ON TABLE saved_jobs IS 'Tracks jobs saved by users for later viewing';
