# Advanced Database Schema Setup Guide

## Overview

This advanced schema includes:
- ✅ User profiles with role-based access (admin, candidate, employer)
- ✅ Complete CV/Resume management
- ✅ Work experience tracking
- ✅ Education history
- ✅ Skills with proficiency levels
- ✅ Certifications and licenses
- ✅ Language proficiency
- ✅ Job applications tracking
- ✅ Saved jobs (bookmarks)
- ✅ Enhanced job listings with salary, requirements, benefits
- ✅ Row Level Security (RLS) for data protection

---

## Setup Instructions

### Step 1: Run the New Schema

Go to your Supabase dashboard → SQL Editor and run these scripts **in order**:

#### 1. Create Advanced Schema
```sql
-- Copy and paste the entire contents of:
scripts/01-create-advanced-schema.sql
```
This creates all tables with advanced features.

#### 2. Setup Row Level Security
```sql
-- Copy and paste the entire contents of:
scripts/02-setup-advanced-rls.sql
```
This sets up security policies for all tables.

#### 3. Add Sample Data
```sql
-- Copy and paste the entire contents of:
scripts/03-seed-advanced-data.sql
```
This adds sample jobs, blogs, and career insights.

---

### Step 2: Create User Accounts

Go to Supabase dashboard → **Authentication** → **Users**

#### Create Admin Account
1. Click **Add user** → **Create new user**
2. Fill in:
   - **Email**: `admin@worldcareers.com`
   - **Password**: `Admin@123456`
   - **Auto Confirm User**: ✅ YES
3. Click **Create user**
4. Copy the **User ID** (you'll need this)

#### Create Admin Profile
Go to **SQL Editor** and run:
```sql
-- Replace 'YOUR-ADMIN-USER-ID' with the actual ID from step above
INSERT INTO user_profiles (
  id, 
  email, 
  role, 
  first_name, 
  last_name,
  headline,
  bio
) VALUES (
  'YOUR-ADMIN-USER-ID'::uuid,
  'admin@worldcareers.com',
  'admin',
  'Admin',
  'User',
  'Platform Administrator',
  'Managing WorldCareers platform and helping job seekers find their dream careers.'
);
```

#### Create Test Candidate Account
1. Click **Add user** → **Create new user**
2. Fill in:
   - **Email**: `candidate@test.com`
   - **Password**: `Candidate@123`
   - **Auto Confirm User**: ✅ YES
3. Click **Create user**
4. Copy the **User ID**

#### Create Candidate Profile
Go to **SQL Editor** and run:
```sql
-- Replace 'YOUR-CANDIDATE-USER-ID' with the actual ID
INSERT INTO user_profiles (
  id, 
  email, 
  role, 
  first_name, 
  last_name,
  headline,
  bio,
  location,
  desired_job_types,
  desired_salary_min,
  desired_salary_max,
  remote_preference,
  is_open_to_opportunities
) VALUES (
  'YOUR-CANDIDATE-USER-ID'::uuid,
  'candidate@test.com',
  'candidate',
  'John',
  'Smith',
  'Full Stack Developer',
  'Passionate software engineer with 5 years of experience building scalable web applications. Specializing in React, Node.js, and cloud technologies.',
  'San Francisco, CA',
  ARRAY['full-time', 'contract'],
  100000,
  150000,
  'remote',
  true
);
```

---

## Credentials

### Admin Account
- **Email**: `admin@worldcareers.com`
- **Password**: `Admin@123456`
- **Role**: Administrator
- **Access**: Full control of platform, can manage jobs, blogs, insights, and view all applications

### Test Candidate Account
- **Email**: `candidate@test.com`
- **Password**: `Candidate@123`
- **Role**: Candidate
- **Access**: Can browse jobs, apply, save jobs, edit profile, upload CV

---

## Database Schema Features

### User Profiles (`user_profiles`)
- Basic info (name, email, phone, DOB, gender)
- Professional info (headline, bio, avatar)
- Social links (LinkedIn, GitHub, portfolio, website)
- CV upload (URL to PDF file)
- Job preferences (types, locations, salary range, remote preference)
- Privacy settings (public/private profile)

### Work Experience (`user_work_experience`)
- Company name and position
- Employment type (full-time, part-time, contract, etc.)
- Dates and location
- Description and achievements array
- Current position flag

### Education (`user_education`)
- Institution and degree
- Field of study
- Dates and location
- Grade/GPA
- Currently studying flag

### Skills (`user_skills`)
- Skill name and category
- Proficiency level (beginner to expert)
- Years of experience

### Certifications (`user_certifications`)
- Certification name
- Issuing organization
- Credential ID and URL
- Issue and expiration dates

### Languages (`user_languages`)
- Language name
- Proficiency level (elementary to native)

### Jobs (`jobs`)
- Enhanced with responsibilities, requirements, benefits arrays
- Salary range (min/max)
- Experience level (entry, mid, senior, lead, executive)
- Application tracking (views count, applications count)
- Posted by admin tracking

### Job Applications (`job_applications`)
- Track user applications
- Status tracking (applied, reviewing, interview, offer, rejected)
- Cover letter and CV
- Admin notes

### Saved Jobs (`saved_jobs`)
- Bookmark jobs for later
- Personal notes

---

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies:

1. **Public Access**:
   - Published jobs, blogs, career insights
   - Public user profiles

2. **User Access**:
   - Users can view/edit their own data
   - Users can apply to jobs
   - Users can save jobs

3. **Admin Access**:
   - Admins can view all profiles
   - Admins can manage jobs, blogs, insights
   - Admins can view all applications and update status

---

## Testing the Setup

### As Admin:
1. Login at `/login` with admin credentials
2. Go to `/admin` dashboard
3. You should see job management, blog management, insights management
4. Try creating a new job posting

### As Candidate:
1. Login at `/login` with candidate credentials
2. Browse jobs on home page
3. Click on a job → "View Details"
4. Try saving a job (you'll need to build this feature)
5. Go to profile page (you'll need to build this)

---

## Next Steps for Development

### Profile Page (`/profile`)
- Display user information
- Edit profile form
- Upload CV/resume
- Add work experience
- Add education
- Add skills, certifications, languages

### Applications Tracking (`/my-applications`)
- View all applications
- Track application status
- Withdraw applications

### Saved Jobs (`/saved-jobs`)
- View bookmarked jobs
- Add/remove notes
- Quick apply

### Admin Dashboard Enhancements
- View all user profiles
- View all applications
- Update application status
- Analytics dashboard

---

## Storage Setup (for CV uploads)

### Create Storage Bucket in Supabase:
1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name: `cvs` or `resumes`
4. **Public bucket**: NO (keep private)
5. Click **Create bucket**

### Set Storage Policies:
```sql
-- Allow users to upload their own CVs
CREATE POLICY "Users can upload own CV"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cvs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own CVs
CREATE POLICY "Users can view own CV"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cvs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own CVs
CREATE POLICY "Users can delete own CV"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'cvs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to view all CVs
CREATE POLICY "Admins can view all CVs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cvs' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## Schema Diagram

```
user_profiles (main user table)
├── user_work_experience (1-to-many)
├── user_education (1-to-many)
├── user_skills (1-to-many)
├── user_certifications (1-to-many)
├── user_languages (1-to-many)
├── saved_jobs (1-to-many)
├── job_applications (1-to-many)
└── jobs (posted_by reference)

jobs (job listings)
├── saved_jobs (1-to-many)
└── job_applications (1-to-many)
```

---

## Important Notes

1. **User IDs**: Supabase Auth manages user authentication. The `user_profiles` table references `auth.users(id)`

2. **Automatic Timestamps**: The `updated_at` column automatically updates on any change

3. **Data Validation**: Add validation in your frontend before submitting to database

4. **File Uploads**: Use Supabase Storage for CV/resume files, store URLs in database

5. **Email Verification**: Enable email confirmation in Supabase Auth settings

6. **Rate Limiting**: Consider implementing rate limiting for job applications

---

## Support

If you encounter any issues:
1. Check the Supabase logs in dashboard
2. Verify RLS policies are correctly set up
3. Ensure user IDs match between auth.users and user_profiles
4. Check that all SQL scripts ran without errors

Your advanced job portal database is now ready! 🚀
