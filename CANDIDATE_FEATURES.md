# Candidate Dashboard Features - Implementation Summary

## Overview
This document outlines all the new features implemented for the candidate dashboard, job management with companies, and social sharing capabilities.

## Recent Updates (Job Posting & Sharing Features)

### 1. Company Management System
- **Database Table**: `companies`
  - Columns: `id`, `name`, `logo_url`, `description`, `website`, `created_at`, `updated_at`
  - Each company has a logo, name, and short description
  - Jobs can be linked to companies via `company_id`

### 2. Enhanced Job Creation Page (`/admin/jobs/new`)
- **User-Friendly Company Selection**:
  - Dropdown to select existing companies
  - Preview company logo and description when selected
  - "Add New Company" button to create companies on-the-fly
  - New company form with fields:
    - Company Name (required)
    - Logo URL with live preview
    - Short Description (textarea)
    - Website (optional)
  - Toggle between selecting existing or creating new

### 3. Social Media Sharing
- **Share Buttons Component** (`components/job-share-buttons.tsx`):
  - WhatsApp sharing with preview
  - LinkedIn sharing
  - X (Twitter) sharing
  - Facebook sharing
  - Copy link to clipboard
- **Integration**:
  - Added to job cards
  - Added to job detail page
  - Proper Open Graph meta tags for rich previews

### 4. Meta Tags for WhatsApp/Social Sharing
- **Job Detail Page** (`app/job/[id]/page.tsx`):
  - Open Graph tags with company logo
  - Twitter Card tags
  - WhatsApp-specific meta tags (og:image:secure_url, dimensions)
  - JobPosting structured data includes company logo
  - Dynamic page title and description

### 5. Migration Script
- **File**: `scripts/05-companies.sql`
- Creates companies table
- Adds company_id to jobs table
- Includes sample companies
- Sets up indexes for performance

## 1. Separate Admin & Candidate Dashboards

### Role-Based Routing
- **File**: `components/header.tsx`
- **Implementation**: 
  - Added `checkAuthAndRole()` function to fetch user role from `user_profiles` table
  - Added `getDashboardLink()` function that returns:
    - `/admin` for users with `role = 'admin'`
    - `/candidate/dashboard` for all other users
  - Updated both desktop and mobile navigation menus

### Candidate Dashboard
- **File**: `app/candidate/dashboard/page.tsx`
- **Features**:
  - Stats cards showing:
    - Applied jobs count
    - Saved jobs count
    - Profile views
  - Tabbed interface with:
    - **Applications tab**: Shows all jobs user has applied to with status badges (pending, reviewing, accepted, rejected)
    - **Saved Jobs tab**: Shows all bookmarked jobs
  - Quick actions grid:
    - View CV
    - Upload CV
    - Write Blog
    - Browse Jobs

## 2. Job Applications

### Job Application Tracking
- **Database Table**: `job_applications`
  - Columns: `id`, `user_id`, `job_id`, `status`, `applied_at`
  - Status options: pending, reviewing, accepted, rejected
  - Unique constraint on (user_id, job_id) to prevent duplicate applications

### Apply & Save Buttons
- **File**: `components/job-actions.tsx`
- **Features**:
  - **Save Button**: Bookmark jobs for later viewing
    - Shows filled bookmark icon when saved
    - Toggles save/unsave
  - **Apply Button**: Submit application to job
    - Disabled once applied
    - Shows "Applied" status
  - Both buttons check authentication and redirect to login if needed
  - Real-time status checking on load

### Job Card Integration
- **File**: `components/job-card.tsx`
- **Update**: Added `JobActions` component to every job card
- **Result**: Users can save and apply directly from job listings

## 3. Saved Jobs

### Saved Jobs Table
- **Database Table**: `saved_jobs`
  - Columns: `id`, `user_id`, `job_id`, `saved_at`
  - Unique constraint on (user_id, job_id)

### Display
- **Location**: Candidate Dashboard > Saved Jobs tab
- **Features**:
  - Shows job title, company, location, job type
  - Includes posting date
  - Displays "No saved jobs yet" when empty

## 4. CV Upload & Management

### CV Upload Page
- **File**: `app/candidate/cv/upload/page.tsx`
- **Features**:
  - File upload with validation:
    - Accepted formats: PDF, DOC, DOCX
    - Maximum size: 5MB
  - Upload to Supabase Storage:
    - Bucket: `documents`
    - Path: `cvs/{userId}/{filename}`
  - Updates `user_profiles` table with:
    - `cv_url`: Storage URL
    - `cv_filename`: Original filename
  - Download button to retrieve uploaded CV
  - Delete button to remove CV
  - Shows current CV status

### Storage Setup Required
- Create Supabase Storage bucket named `documents`
- Set appropriate access policies for authenticated users

## 5. Blog Posting for Candidates

### Blog Creation Page
- **File**: `app/candidate/blog/new/page.tsx`
- **Features**:
  - Rich text editor for content
  - Fields: Title, Author, Excerpt, Content
  - Auto-generates slug from title
  - Sets `status = 'pending'` for admin approval
  - Records `created_by` user ID

### Blog Type Updates
- **File**: `lib/types.ts`
- **Added fields**:
  - `status?: 'published' | 'pending' | 'draft'`
  - `created_by?: string`

### Admin Approval System
- **File**: `components/admin/blog-management.tsx`
- **Features**:
  - Status badge column showing:
    - Yellow "Pending" for submitted blogs
    - Green "Published" for approved blogs
  - "Approve" button for pending blogs
  - Updates status to 'published' when approved

### Public Blog Filtering
- **File**: `app/blogs/page.tsx`
- **Update**: Only shows blogs with `status = 'published'` or `status IS NULL` (legacy blogs)
- **Result**: Pending blogs hidden from public view

## 6. Database Migration

### Migration Script
- **File**: `scripts/04-candidate-features.sql`
- **Creates**:
  - `job_applications` table with status tracking
  - `saved_jobs` table for bookmarking
  - Adds `status` and `created_by` columns to `blogs` table
  - Creates performance indexes
  - Disables RLS on new tables for easier management

### How to Run
```bash
# Run this SQL in Supabase SQL Editor or via CLI
psql -U postgres -d your_database -f scripts/04-candidate-features.sql
```

## 7. Quick Actions in Dashboard

All quick actions link to:
1. **View CV** → `/candidate/cv/upload` (shows current CV)
2. **Upload CV** → `/candidate/cv/upload` (file upload)
3. **Write Blog** → `/candidate/blog/new` (blog editor)
4. **Browse Jobs** → `/jobs` (job listings)

## Testing Checklist

### Authentication & Routing
- [ ] Admin users are routed to `/admin`
- [ ] Candidate users are routed to `/candidate/dashboard`
- [ ] Dashboard link in header works correctly
- [ ] Unauthenticated users are redirected to `/login`

### Job Applications
- [ ] Apply button works on job cards
- [ ] Applied jobs show in dashboard Applications tab
- [ ] Status badges display correctly (pending, reviewing, accepted, rejected)
- [ ] Cannot apply to same job twice
- [ ] Application count updates in stats

### Saved Jobs
- [ ] Save button works on job cards
- [ ] Saved jobs show in dashboard Saved Jobs tab
- [ ] Bookmark icon fills when saved
- [ ] Can unsave jobs
- [ ] Saved count updates in stats

### CV Management
- [ ] Can upload PDF, DOC, DOCX files (max 5MB)
- [ ] Larger files are rejected
- [ ] Invalid file types are rejected
- [ ] CV URL is saved to user profile
- [ ] Can download uploaded CV
- [ ] Can delete uploaded CV
- [ ] Shows current CV status

### Blog Posting
- [ ] Can create new blog post
- [ ] Rich text editor works
- [ ] Blog is submitted with 'pending' status
- [ ] Pending blogs show in admin dashboard
- [ ] Admin can approve blogs
- [ ] Approved blogs appear in public blog page
- [ ] Pending blogs are hidden from public

### Storage Setup
- [ ] Create `documents` bucket in Supabase Storage
- [ ] Set appropriate access policies
- [ ] Test file upload/download/delete

## Important Notes

1. **Storage Bucket**: You MUST create the "documents" bucket in Supabase Storage before CV uploads will work.

2. **RLS Policies**: The tables `job_applications` and `saved_jobs` have RLS disabled. If you need to enable RLS, create appropriate policies:
   ```sql
   -- Allow users to manage their own applications
   CREATE POLICY "Users can insert own applications" 
   ON job_applications FOR INSERT 
   WITH CHECK (auth.uid() = user_id);
   
   -- Allow users to view their own applications
   CREATE POLICY "Users can view own applications" 
   ON job_applications FOR SELECT 
   USING (auth.uid() = user_id);
   ```

3. **Blog Approval Workflow**: 
   - Candidates submit blogs with status = 'pending'
   - Only admins can see pending blogs
   - Admins approve by changing status to 'published'
   - Public blog page only shows published blogs

4. **Future Enhancements**:
   - CV editor/builder (to create CVs within the platform)
   - Email notifications for application status changes
   - Job application status tracking from employer side
   - Analytics for candidate activity
   - Resume parsing and auto-fill

## Files Modified/Created

### New Files
- `app/candidate/dashboard/page.tsx` - Candidate dashboard
- `app/candidate/cv/upload/page.tsx` - CV upload page
- `app/candidate/blog/new/page.tsx` - Blog creation page
- `components/job-actions.tsx` - Apply & Save buttons
- `scripts/04-candidate-features.sql` - Database migration

### Modified Files
- `components/header.tsx` - Role-based routing
- `components/job-card.tsx` - Added job actions
- `components/admin/blog-management.tsx` - Added approval system
- `lib/types.ts` - Updated Blog type
- `app/blogs/page.tsx` - Filter published blogs only

## Database Schema

### job_applications
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES auth.users(id)
job_id          UUID REFERENCES jobs(id)
status          VARCHAR(50) CHECK (pending, reviewing, accepted, rejected)
applied_at      TIMESTAMP WITH TIME ZONE
UNIQUE(user_id, job_id)
```

### saved_jobs
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES auth.users(id)
job_id          UUID REFERENCES jobs(id)
saved_at        TIMESTAMP WITH TIME ZONE
UNIQUE(user_id, job_id)
```

### blogs (updated)
```sql
-- Existing columns...
status          VARCHAR(50) CHECK (published, pending, draft)
created_by      UUID REFERENCES auth.users(id)
```
