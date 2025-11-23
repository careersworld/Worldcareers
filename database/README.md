# WorldCareers Database Documentation

## 📋 Overview

This directory contains the complete database schema for the WorldCareers platform. The schema is designed to be production-ready, scalable, and secure.

## 🗂️ Database Structure

### Core Tables

#### User Management
- **`admin_profiles`** - Administrator user profiles
- **`candidate_profiles`** - Job seeker profiles with resume, skills, and experience
- **`company_profiles`** - Company/employer profiles
- **`company_invites`** - Admin-managed company invitation system

#### Content Management
- **`jobs`** - Job postings with full details, categories, and tracking
- **`blogs`** - Blog posts with status workflow (draft → pending → published)
- **`career_insights`** - Career advice and guidance content

#### Engagement & Tracking
- **`job_applications`** - Job application submissions with status tracking
- **`saved_jobs`** - User-saved job bookmarks
- **`content_views`** - Unified view tracking for all content types
- **`web_analytics`** - Page view and visitor analytics

### Views

- **`all_users`** - Unified view of all users across profile types
- **`dashboard_stats`** - Real-time statistics for admin dashboard

### Functions

- **`track_content_view()`** - Track views and increment counters
- **`get_user_role()`** - Get user role from profile tables
- **`update_updated_at_column()`** - Auto-update timestamps
- **`increment_application_count()`** - Auto-increment job application counts
- **`decrement_application_count()`** - Auto-decrement job application counts

## 🚀 Installation

### Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. Supabase CLI installed (optional, for local development)

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire contents of `complete-schema.sql`
5. Paste into the SQL editor
6. Click **Run** to execute

### Method 2: Using Supabase CLI

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref

# Run the migration
npx supabase db push

# Or execute the SQL file directly
psql -h db.your-project-ref.supabase.co -U postgres -d postgres -f database/complete-schema.sql
```

### Method 3: Using psql (Direct Connection)

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f database/complete-schema.sql
```

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with comprehensive policies:

- **Public Access**: Jobs, blogs (published), career insights, company profiles
- **Authenticated Access**: User profiles, applications, saved jobs
- **Role-Based Access**: Admin-only operations for management tasks
- **Owner Access**: Users can only modify their own data

### Key Security Policies

```sql
-- Example: Users can only update their own profile
CREATE POLICY "Candidates can update own profile"
    ON candidate_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Example: Only admins can create career insights
CREATE POLICY "Admins can insert career insights"
    ON career_insights FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
    );
```

## 📊 Database Schema Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase Auth)
└────────┬────────┘
         │
    ┌────┴────┬────────────┬──────────────┐
    │         │            │              │
┌───▼────┐ ┌─▼──────┐ ┌──▼────────┐ ┌───▼─────────┐
│ admin_ │ │candidate│ │ company_  │ │  company_   │
│profiles│ │profiles │ │ profiles  │ │  invites    │
└────────┘ └─────────┘ └─────┬─────┘ └─────────────┘
                             │
                        ┌────▼────┐
                        │  jobs   │
                        └────┬────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
      ┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
      │     job_     │ │  saved_  │ │  content_  │
      │applications  │ │   jobs   │ │   views    │
      └──────────────┘ └──────────┘ └────────────┘

┌──────────┐  ┌────────────────┐  ┌──────────────┐
│  blogs   │  │career_insights │  │web_analytics │
└──────────┘  └────────────────┘  └──────────────┘
```

## 🎯 Key Features

### 1. Automatic Timestamps
All tables automatically update `updated_at` on modifications via triggers.

### 2. View Tracking
Unified view tracking system:
```sql
-- Track a job view
SELECT track_content_view('job', 'job-uuid', 'user-uuid', '127.0.0.1', 'user-agent');

-- Track a blog view
SELECT track_content_view('blog', 'blog-uuid', 'user-uuid', '127.0.0.1', 'user-agent');
```

### 3. Application Counting
Job application counts are automatically maintained via triggers.

### 4. Full-Text Search
Optimized for search with trigram indexes:
```sql
-- Search jobs by title or company
SELECT * FROM jobs 
WHERE title ILIKE '%software%' 
   OR company_name ILIKE '%tech%';
```

### 5. Real-Time Updates
All tables support Supabase real-time subscriptions:
```typescript
// Subscribe to job updates
supabase
  .channel('jobs')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'jobs' },
    (payload) => console.log(payload)
  )
  .subscribe()
```

## 📝 Common Queries

### Get Active Jobs
```sql
SELECT * FROM jobs 
WHERE is_active = TRUE 
  AND (deadline IS NULL OR deadline >= NOW())
ORDER BY created_at DESC;
```

### Get Dashboard Statistics
```sql
SELECT * FROM dashboard_stats;
```

### Get User's Applications
```sql
SELECT ja.*, j.title, j.company_name
FROM job_applications ja
JOIN jobs j ON ja.job_id = j.id
WHERE ja.user_id = 'user-uuid'
ORDER BY ja.applied_at DESC;
```

### Get Popular Jobs (Most Viewed)
```sql
SELECT * FROM jobs 
WHERE is_active = TRUE
ORDER BY views_count DESC
LIMIT 10;
```

### Get All Users (Unified View)
```sql
SELECT * FROM all_users
ORDER BY created_at DESC;
```

## 🔄 Data Types & Enums

### User Roles
- `admin` - Platform administrators
- `candidate` - Job seekers
- `company` - Employers

### Job Types
- `full-time` - Full-time positions
- `part-time` - Part-time positions
- `internship` - Internship opportunities
- `volunteer` - Volunteer positions

### Location Types
- `remote` - Work from anywhere
- `onsite` - Office-based
- `hybrid` - Mix of remote and onsite

### Content Status
- `draft` - Not yet submitted
- `pending` - Awaiting approval
- `published` - Live and visible
- `archived` - No longer active

### Application Status
- `pending` - Submitted, not yet reviewed
- `reviewing` - Under review
- `shortlisted` - Selected for interview
- `rejected` - Not selected
- `accepted` - Offer accepted

## 🧪 Testing

### Create Test Data

```sql
-- Insert test job
INSERT INTO jobs (title, company_name, description, location, job_type, location_type, category, application_link)
VALUES (
  'Software Engineer',
  'Tech Corp',
  'We are looking for a talented software engineer...',
  'Kigali, Rwanda',
  'full-time',
  'hybrid',
  'technology',
  'https://apply.example.com/1'
);

-- Insert test blog
INSERT INTO blogs (title, slug, excerpt, content, author, status)
VALUES (
  'How to Write a Great Resume',
  'how-to-write-great-resume',
  'Tips for creating an outstanding resume',
  'Full content here...',
  'Career Expert',
  'published'
);
```

## 🔧 Maintenance

### Refresh Materialized Views (if added in future)
```sql
-- Currently using regular views, but if you add materialized views:
-- REFRESH MATERIALIZED VIEW view_name;
```

### Analyze Tables for Performance
```sql
ANALYZE admin_profiles;
ANALYZE candidate_profiles;
ANALYZE company_profiles;
ANALYZE jobs;
ANALYZE blogs;
ANALYZE career_insights;
```

### Check Index Usage
```sql
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## 🐛 Troubleshooting

### Issue: RLS Blocking Queries

**Solution**: Ensure you're authenticated and have the correct role:
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('User role:', user?.user_metadata?.role)
```

### Issue: View Tracking Not Working

**Solution**: Check function permissions:
```sql
GRANT EXECUTE ON FUNCTION track_content_view TO anon, authenticated;
```

### Issue: Slow Queries

**Solution**: Check if indexes are being used:
```sql
EXPLAIN ANALYZE SELECT * FROM jobs WHERE title ILIKE '%software%';
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Contributing

When making schema changes:

1. Create a new migration file
2. Test thoroughly in development
3. Update this documentation
4. Apply to production with caution

## 📄 License

This database schema is part of the WorldCareers platform.

---

**Last Updated**: 2025-11-23  
**Schema Version**: 1.0.0  
**Compatibility**: Supabase PostgreSQL 15+
