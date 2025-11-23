# 🔧 Database Troubleshooting Guide

## Common Errors and Solutions

### Error: "cannot change return type of existing function"

**Full Error:**
```
ERROR: 42P13: cannot change return type of existing function
HINT: Use DROP FUNCTION function_name first.
```

**Cause:** You're trying to run the schema on a database that already has these functions.

**Solution 1: Use the Updated Schema (Recommended)**
The `complete-schema.sql` file has been updated to automatically drop existing functions. Just run it again:
1. Go to Supabase SQL Editor
2. Run `complete-schema.sql` again
3. It should now work without errors

**Solution 2: Manual Reset**
If you want to start completely fresh:
1. Run `reset-database.sql` first
2. Then run `complete-schema.sql`

**Solution 3: Drop Functions Manually**
Run this in SQL Editor before running the schema:
```sql
DROP FUNCTION IF EXISTS track_content_view(TEXT, UUID, UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS increment_application_count();
DROP FUNCTION IF EXISTS decrement_application_count();
DROP FUNCTION IF EXISTS get_user_role(UUID);
```

---

### Error: "relation already exists"

**Full Error:**
```
ERROR: relation "table_name" already exists
```

**Cause:** Tables already exist in your database.

**Solution:** The schema uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen. If it does:
1. Run `reset-database.sql` to drop all tables
2. Then run `complete-schema.sql`

---

### Error: "permission denied for schema public"

**Full Error:**
```
ERROR: permission denied for schema public
```

**Cause:** Insufficient permissions.

**Solution:**
1. Make sure you're running the SQL as the database owner
2. In Supabase, you should be automatically authenticated as the owner
3. If using psql, ensure you're using the postgres user

---

### Error: "type already exists"

**Full Error:**
```
ERROR: type "type_name" already exists
```

**Cause:** Enum types already exist.

**Solution:** The schema handles this with `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$;`
This error should not occur. If it does, the schema will ignore it automatically.

---

### Error: "relation does not exist" when running test-data.sql

**Full Error:**
```
ERROR: relation "jobs" does not exist
```

**Cause:** You're trying to insert test data before creating the schema.

**Solution:**
1. Run `complete-schema.sql` FIRST
2. Then run `test-data.sql`

---

### Error: "insert or update on table violates foreign key constraint"

**Full Error:**
```
ERROR: insert or update on table "table_name" violates foreign key constraint
```

**Cause:** Trying to insert data with invalid foreign key references.

**Solution for test-data.sql:**
1. Make sure you've created test users in Supabase Authentication first
2. Copy their actual UUIDs
3. Replace the placeholder UUIDs in `test-data.sql`:
```sql
DECLARE
    admin_user_id UUID := 'paste-real-uuid-here';
    company_user_id UUID := 'paste-real-uuid-here';
    candidate_user_id UUID := 'paste-real-uuid-here';
```

---

### Error: "could not serialize access due to concurrent update"

**Full Error:**
```
ERROR: could not serialize access due to concurrent update
```

**Cause:** Multiple processes trying to update the same row.

**Solution:**
1. This is rare and usually temporary
2. Simply retry the operation
3. If persistent, check for infinite loops in your code

---

### Error: "row-level security policy" blocking queries

**Full Error:**
```
No rows returned (but you expect data)
```

**Cause:** RLS policies are blocking your query.

**Solution:**
1. Make sure you're authenticated: `const { data: { user } } = await supabase.auth.getUser()`
2. Check the user has the correct role in their metadata
3. For testing, you can temporarily disable RLS:
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```
**⚠️ WARNING:** Never disable RLS in production!

---

### Error: "syntax error at or near"

**Full Error:**
```
ERROR: syntax error at or near "..."
```

**Cause:** SQL syntax error in your query.

**Solution:**
1. Check for missing commas, parentheses, or quotes
2. Ensure you're copying the entire SQL file
3. Don't copy line numbers if viewing the file with line numbers

---

### Error: Missing environment variables

**Error in Browser Console:**
```
Missing Supabase environment variables!
```

**Cause:** `.env.local` is not configured or not loaded.

**Solution:**
1. Create/update `.env.local` in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
2. Restart your dev server:
```bash
npm run dev
```
3. Clear browser cache and reload

---

### Error: "Failed to fetch" or "Network error"

**Error in Browser:**
```
Error fetching jobs: Failed to fetch
```

**Cause:** Can't connect to Supabase.

**Solution:**
1. Check your internet connection
2. Verify Supabase project is running (check dashboard)
3. Verify environment variables are correct
4. Check browser console for CORS errors
5. Ensure your Supabase project URL is correct

---

### Error: "Invalid API key"

**Full Error:**
```
Invalid API key
```

**Cause:** Wrong or expired anon key.

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **anon/public** key (not the service role key!)
3. Update `.env.local`
4. Restart dev server

---

### Error: No data showing in application

**Symptoms:** Application loads but shows no jobs, blogs, etc.

**Debugging Steps:**

1. **Check if schema is created:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```
Should show 11 tables.

2. **Check if data exists:**
```sql
SELECT COUNT(*) FROM jobs;
SELECT COUNT(*) FROM blogs;
SELECT COUNT(*) FROM career_insights;
```

3. **Check RLS policies:**
```sql
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';
```
Should show 40+ policies.

4. **Check browser console:**
- Open DevTools (F12)
- Look for errors in Console tab
- Check Network tab for failed requests

5. **Test direct query:**
```typescript
const { data, error } = await supabase.from('jobs').select('*')
console.log('Data:', data)
console.log('Error:', error)
```

---

### Error: "duplicate key value violates unique constraint"

**Full Error:**
```
ERROR: duplicate key value violates unique constraint "unique_constraint_name"
```

**Cause:** Trying to insert duplicate data.

**Solution:**
1. For test data, run `reset-database.sql` first
2. Or manually delete conflicting rows:
```sql
DELETE FROM table_name WHERE condition;
```
3. Check your insert logic for duplicates

---

### Performance Issues: Slow queries

**Symptoms:** Queries taking too long.

**Debugging:**

1. **Check if indexes exist:**
```sql
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'jobs';
```

2. **Analyze query performance:**
```sql
EXPLAIN ANALYZE SELECT * FROM jobs WHERE title ILIKE '%software%';
```

3. **Update table statistics:**
```sql
ANALYZE jobs;
ANALYZE blogs;
ANALYZE career_insights;
```

---

### Error: "too many connections"

**Full Error:**
```
ERROR: sorry, too many clients already
```

**Cause:** Connection pool exhausted.

**Solution:**
1. Check for connection leaks in your code
2. Ensure you're reusing the Supabase client
3. Don't create new clients in loops
4. Use connection pooling (Supabase does this automatically)

---

## Quick Fixes Checklist

When something goes wrong, try these in order:

- [ ] Check browser console for errors
- [ ] Verify `.env.local` has correct values
- [ ] Restart dev server (`npm run dev`)
- [ ] Clear browser cache
- [ ] Check Supabase dashboard for project status
- [ ] Verify you're authenticated (if needed)
- [ ] Check RLS policies aren't blocking
- [ ] Run schema again if tables are missing
- [ ] Check test user UUIDs are correct

---

## Getting Help

If you're still stuck:

1. **Check the error message carefully** - It usually tells you what's wrong
2. **Search Supabase docs** - https://supabase.com/docs
3. **Check PostgreSQL docs** - https://www.postgresql.org/docs/
4. **Review the schema** - Look at `complete-schema.sql` comments
5. **Check examples** - See `QUICK_REFERENCE.md` for working examples

---

## Useful SQL Queries for Debugging

### Check what tables exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### Check what functions exist
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;
```

### Check RLS status
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Check all policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Count rows in all tables
```sql
SELECT 
    'admin_profiles' as table_name, COUNT(*) as row_count FROM admin_profiles
UNION ALL SELECT 'candidate_profiles', COUNT(*) FROM candidate_profiles
UNION ALL SELECT 'company_profiles', COUNT(*) FROM company_profiles
UNION ALL SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL SELECT 'blogs', COUNT(*) FROM blogs
UNION ALL SELECT 'career_insights', COUNT(*) FROM career_insights
UNION ALL SELECT 'job_applications', COUNT(*) FROM job_applications
UNION ALL SELECT 'saved_jobs', COUNT(*) FROM saved_jobs
UNION ALL SELECT 'content_views', COUNT(*) FROM content_views
UNION ALL SELECT 'web_analytics', COUNT(*) FROM web_analytics;
```

---

**Remember:** Most errors are due to:
1. Missing environment variables
2. Schema not run yet
3. RLS policies blocking access
4. Wrong user UUIDs in test data

Check these first! 🔍
