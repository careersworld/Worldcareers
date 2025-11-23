# 📋 Database Quick Reference

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 Table Reference

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `admin_profiles` | Admin users | id, email, first_name, last_name |
| `candidate_profiles` | Job seekers | id, email, skills, resume_url |
| `company_profiles` | Employers | id, company_name, logo_url |
| `jobs` | Job postings | id, title, company_name, category |
| `blogs` | Blog posts | id, title, slug, status |
| `career_insights` | Career content | id, title, slug, category |
| `job_applications` | Applications | id, job_id, user_id, status |
| `saved_jobs` | Bookmarks | id, job_id, user_id |
| `content_views` | View tracking | content_type, content_id |
| `web_analytics` | Page analytics | page_path, user_id, country |

## 🎯 Common Queries

### Get Active Jobs
```sql
SELECT * FROM jobs 
WHERE is_active = TRUE 
  AND (deadline IS NULL OR deadline >= NOW())
ORDER BY created_at DESC;
```

### Get Published Blogs
```sql
SELECT * FROM blogs 
WHERE status = 'published'
ORDER BY created_at DESC;
```

### Get User Applications
```sql
SELECT ja.*, j.title, j.company_name
FROM job_applications ja
JOIN jobs j ON ja.job_id = j.id
WHERE ja.user_id = 'user-uuid'
ORDER BY ja.applied_at DESC;
```

### Get Dashboard Stats
```sql
SELECT * FROM dashboard_stats;
```

### Search Jobs
```sql
SELECT * FROM jobs 
WHERE title ILIKE '%keyword%' 
   OR company_name ILIKE '%keyword%'
   OR description ILIKE '%keyword%';
```

## 💻 TypeScript Examples

### Fetch Jobs
```typescript
const supabase = createClient()
const { data, error } = await supabase
  .from('jobs')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false })
```

### Create Job Application
```typescript
const { data, error } = await supabase
  .from('job_applications')
  .insert({
    job_id: jobId,
    user_id: userId,
    status: 'pending',
    cover_letter: 'My cover letter...'
  })
```

### Save a Job
```typescript
const { data, error } = await supabase
  .from('saved_jobs')
  .insert({
    job_id: jobId,
    user_id: userId
  })
```

### Track View
```typescript
await supabase.rpc('track_content_view', {
  p_content_type: 'job',
  p_content_id: jobId,
  p_user_id: userId || null,
  p_ip_address: '127.0.0.1',
  p_user_agent: navigator.userAgent
})
```

### Real-Time Subscription
```typescript
const channel = supabase
  .channel('jobs-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'jobs' },
    (payload) => {
      console.log('Job changed:', payload)
    }
  )
  .subscribe()

// Cleanup
channel.unsubscribe()
```

## 🔐 Authentication Examples

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      role: 'candidate' // or 'company', 'admin'
    }
  }
})
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
const role = user?.user_metadata?.role
```

### Sign Out
```typescript
await supabase.auth.signOut()
```

## 🎨 Enums & Types

### User Roles
- `admin` - Platform administrator
- `candidate` - Job seeker
- `company` - Employer

### Job Types
- `full-time`
- `part-time`
- `internship`
- `volunteer`

### Location Types
- `remote`
- `onsite`
- `hybrid`

### Content Status
- `draft`
- `pending`
- `published`
- `archived`

### Application Status
- `pending`
- `reviewing`
- `shortlisted`
- `rejected`
- `accepted`

## 🔧 Useful Functions

### `track_content_view()`
Tracks views and increments counters
```sql
SELECT track_content_view('job', 'job-uuid', 'user-uuid', '127.0.0.1', 'user-agent');
```

### `get_user_role()`
Gets user role from profile tables
```sql
SELECT get_user_role('user-uuid');
```

## 📈 Performance Tips

1. **Use indexes** - All key columns are indexed
2. **Limit results** - Use `.limit()` for pagination
3. **Select specific columns** - Don't use `SELECT *` in production
4. **Use views** - `all_users` and `dashboard_stats` are optimized
5. **Cache results** - Use React Query or SWR for client-side caching

## 🛡️ Security Best Practices

1. **Never expose service key** - Only use anon key in client
2. **Trust RLS policies** - They protect your data
3. **Validate on server** - Don't trust client input
4. **Use prepared statements** - Supabase does this automatically
5. **Check user roles** - Verify permissions in your code

## 🔄 Migration Commands

### Reset Database (Development Only!)
```sql
-- Run reset-database.sql first
-- Then run complete-schema.sql
```

### Add Test Data
```sql
-- Run test-data.sql after schema is created
```

## 📞 Quick Links

- **Supabase Dashboard**: https://app.supabase.com
- **SQL Editor**: Dashboard → SQL Editor
- **Table Editor**: Dashboard → Table Editor
- **Authentication**: Dashboard → Authentication
- **API Docs**: Dashboard → API Docs

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| No data showing | Check RLS policies, verify you're authenticated |
| Permission denied | Ensure user has correct role in metadata |
| Slow queries | Check indexes are being used (EXPLAIN ANALYZE) |
| Connection error | Verify environment variables are correct |
| RLS blocking query | Check if user is authenticated and has permission |

## 📝 Notes

- All timestamps are in UTC
- UUIDs are generated automatically
- View counts update in real-time
- Application counts are maintained by triggers
- RLS is enabled on all tables

---

**Quick Start**: See `SETUP.md`  
**Full Docs**: See `README.md`  
**Summary**: See `IMPLEMENTATION_SUMMARY.md`
