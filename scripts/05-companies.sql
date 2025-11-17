-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add company_id to jobs table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE jobs ADD COLUMN company_id UUID REFERENCES companies(id);
  END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- Disable RLS for easier management
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- Insert some sample companies
INSERT INTO companies (name, logo_url, description) VALUES
  ('Tech Solutions Rwanda', 'https://via.placeholder.com/150/0066cc/ffffff?text=TS', 'Leading technology company providing innovative solutions across Africa'),
  ('Healthcare Plus', 'https://via.placeholder.com/150/00cc66/ffffff?text=HP', 'Premier healthcare provider with modern facilities'),
  ('EduCare Institute', 'https://via.placeholder.com/150/cc6600/ffffff?text=EI', 'Educational excellence and career development')
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE companies IS 'Companies posting jobs on the platform';
