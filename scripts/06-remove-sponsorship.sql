-- Remove sponsorship feature from jobs table
ALTER TABLE jobs DROP COLUMN IF EXISTS is_sponsored;
