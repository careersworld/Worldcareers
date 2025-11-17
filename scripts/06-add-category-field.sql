-- Add category field to jobs table
-- This migration adds a category column for job categorization

-- Add category column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- Create index for category field
CREATE INDEX IF NOT EXISTS jobs_category_idx ON jobs(category);

-- Update existing jobs with default category (optional - can be done manually)
-- UPDATE jobs SET category = 'other' WHERE category IS NULL;

-- Sample update to set categories based on keywords in title/description
-- These are examples - you may want to categorize existing jobs manually
UPDATE jobs 
SET category = 'technology' 
WHERE category IS NULL 
  AND (
    title ILIKE '%developer%' 
    OR title ILIKE '%engineer%' 
    OR title ILIKE '%programmer%'
    OR title ILIKE '%IT%'
    OR title ILIKE '%software%'
  );

UPDATE jobs 
SET category = 'healthcare' 
WHERE category IS NULL 
  AND (
    title ILIKE '%doctor%' 
    OR title ILIKE '%nurse%' 
    OR title ILIKE '%medical%'
    OR title ILIKE '%health%'
  );

UPDATE jobs 
SET category = 'finance' 
WHERE category IS NULL 
  AND (
    title ILIKE '%accountant%' 
    OR title ILIKE '%finance%' 
    OR title ILIKE '%banking%'
  );

UPDATE jobs 
SET category = 'education' 
WHERE category IS NULL 
  AND (
    title ILIKE '%teacher%' 
    OR title ILIKE '%professor%' 
    OR title ILIKE '%instructor%'
  );

UPDATE jobs 
SET category = 'engineering' 
WHERE category IS NULL 
  AND (
    title ILIKE '%civil engineer%' 
    OR title ILIKE '%mechanical engineer%' 
    OR title ILIKE '%electrical engineer%'
  );

UPDATE jobs 
SET category = 'marketing' 
WHERE category IS NULL 
  AND (
    title ILIKE '%marketing%' 
    OR title ILIKE '%communications%' 
    OR title ILIKE '%brand%'
  );

UPDATE jobs 
SET category = 'sales' 
WHERE category IS NULL 
  AND (
    title ILIKE '%sales%' 
    OR title ILIKE '%business development%'
  );

UPDATE jobs 
SET category = 'customer-service' 
WHERE category IS NULL 
  AND (
    title ILIKE '%customer service%' 
    OR title ILIKE '%support%' 
    OR title ILIKE '%call center%'
  );

UPDATE jobs 
SET category = 'administration' 
WHERE category IS NULL 
  AND (
    title ILIKE '%admin%' 
    OR title ILIKE '%secretary%' 
    OR title ILIKE '%coordinator%'
  );

UPDATE jobs 
SET category = 'management' 
WHERE category IS NULL 
  AND (
    title ILIKE '%manager%' 
    OR title ILIKE '%director%' 
    OR title ILIKE '%head%'
    OR title ILIKE '%chief%'
  );

-- Set remaining uncategorized jobs to 'other'
UPDATE jobs SET category = 'other' WHERE category IS NULL;
