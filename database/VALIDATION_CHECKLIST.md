# ✅ Database Setup Validation Checklist

## Error: "Failed to fetch (api.supabase.com)"

This error typically means there's a **connection or configuration issue**, not a SQL syntax error. Follow this checklist step by step.

---

## 🔍 Step 1: Verify Supabase Project Status

### Check Your Project is Running
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Check the project status (should show green/active)
4. If paused, click "Restore" or "Resume"

### Check Project URL
Your project URL should look like:
```
https://xxxxxxxxxxxxx.supabase.co
```
NOT:
```
https://api.supabase.com  ❌ (This is wrong!)
```

---

## 🔍 Step 2: Verify Environment Variables

### Check `.env.local` File

1. Open `c:\Users\maxim\OneDrive\Desktop\Worldcareer\.env.local`
2. It should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get Correct Values

1. Go to Supabase Dashboard
2. Click **Settings** (gear icon) → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Common Mistakes ❌

- Using `https://api.supabase.com` instead of your project URL
- Using service_role key instead of anon key
- Missing `NEXT_PUBLIC_` prefix
- Extra spaces or quotes in the values

---

## 🔍 Step 3: Run SQL Schema Correctly

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to SQL Editor**
   - Dashboard → SQL Editor (left sidebar)
   - Click **New Query**

2. **Copy Schema in Sections**
   
   The script is large. Run it in sections to identify errors:

   **Section 1: Extensions & Enums (Lines 1-62)**
   ```sql
   -- Copy lines 1-62 from complete-schema.sql
   -- Run this first
   ```

   **Section 2: Tables (Lines 64-246)**
   ```sql
   -- Copy lines 64-246
   -- Run this second
   ```

   **Section 3: Views & Functions (Lines 248-385)**
   ```sql
   -- Copy lines 248-385
   -- Run this third
   ```

   **Section 4: Triggers & Indexes (Lines 387-494)**
   ```sql
   -- Copy lines 387-494
   -- Run this fourth
   ```

   **Section 5: RLS Policies (Lines 496-790)**
   ```sql
   -- Copy lines 496-790
   -- Run this fifth
   ```

   **Section 6: Permissions (Lines 792-815)**
   ```sql
   -- Copy lines 792-815
   -- Run this last
   ```

3. **Check for Errors**
   - After each section, check for error messages
   - If you get an error, note the line number
   - Fix that specific issue before continuing

### Option B: Run Complete Script

If you want to run the whole script at once:

1. Open `complete-schema.sql`
2. Select ALL (Ctrl+A)
3. Copy (Ctrl+C)
4. Go to Supabase SQL Editor
5. Paste (Ctrl+V)
6. Click **Run** (or press Ctrl+Enter)
7. Wait for completion (may take 30-60 seconds)

---

## 🔍 Step 4: Verify Schema Was Created

Run this query in SQL Editor:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected Result:** Should show 11 tables:
- admin_profiles
- blogs
- candidate_profiles
- career_insights
- company_invites
- company_profiles
- content_views
- job_applications
- jobs
- saved_jobs
- web_analytics

---

## 🔍 Step 5: Verify Functions Were Created

```sql
-- Check functions
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
ORDER BY routine_name;
```

**Expected Result:** Should show 5 functions:
- decrement_application_count
- get_user_role
- increment_application_count
- track_content_view
- update_updated_at_column

---

## 🔍 Step 6: Verify RLS Policies

```sql
-- Check RLS policies
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Expected Result:** Should show policies for all tables

---

## 🔍 Step 7: Test Database Connection from App

Create a test file: `test-db-connection.js`

```javascript
// Run this with: node test-db-connection.js
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  // Test 1: Simple query
  const { data, error } = await supabase
    .from('jobs')
    .select('count')
  
  if (error) {
    console.error('❌ Error:', error.message)
    console.error('Details:', error)
  } else {
    console.log('✅ Connection successful!')
    console.log('Data:', data)
  }
}

testConnection()
```

---

## 🔍 Step 8: Check Network/Firewall

### Test Direct Connection

Open your browser and visit:
```
https://your-project-ref.supabase.co/rest/v1/
```

**Expected:** Should show a JSON response or authentication error (not a network error)

### Check Firewall/VPN

- Disable VPN temporarily
- Check corporate firewall settings
- Try from a different network
- Check browser extensions (disable ad blockers)

---

## 🔍 Step 9: Restart Everything

Sometimes a simple restart fixes issues:

1. **Close Supabase Dashboard tabs**
2. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
3. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Click "Clear data"
4. **Reload your app**

---

## 🔍 Step 10: Check Supabase Service Status

Visit: [status.supabase.com](https://status.supabase.com)

Check if there are any ongoing incidents or maintenance.

---

## 📋 Quick Diagnostic Commands

Run these in Supabase SQL Editor to diagnose issues:

### 1. Check Database Version
```sql
SELECT version();
```

### 2. Check Extensions
```sql
SELECT * FROM pg_extension;
```

### 3. Check Current User
```sql
SELECT current_user, current_database();
```

### 4. Check Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 5. Check for Errors in Logs
Go to: Dashboard → Logs → Postgres Logs

Look for any error messages.

---

## 🆘 Still Getting Errors?

### Common Issues & Solutions

| Error | Solution |
|-------|----------|
| "Failed to fetch" | Check internet, VPN, firewall, project status |
| "Invalid API key" | Verify you're using anon key, not service_role |
| "relation does not exist" | Schema not created yet, run complete-schema.sql |
| "permission denied" | Check RLS policies, ensure you're authenticated |
| "syntax error" | Run schema in sections to find the problematic line |
| "function already exists" | Run reset-database.sql first, then schema |

### Get Detailed Error Info

In your browser console (F12), run:

```javascript
const supabase = window.supabase // or however you access it
const { data, error } = await supabase.from('jobs').select('*')
console.log('Full error:', JSON.stringify(error, null, 2))
```

---

## ✅ Success Indicators

You'll know everything is working when:

- ✅ SQL Editor runs queries without errors
- ✅ Tables, functions, and policies exist
- ✅ Browser console shows no Supabase errors
- ✅ App loads and displays data
- ✅ Login/signup works
- ✅ No "Failed to fetch" errors

---

## 📞 Next Steps After Validation

Once everything is validated:

1. ✅ Create test users (see SETUP.md)
2. ✅ Run test-data.sql
3. ✅ Test all features
4. ✅ Deploy to production

---

**Remember:** The "Failed to fetch (api.supabase.com)" error is almost always a **configuration or network issue**, not a SQL syntax problem. The schema SQL is valid and tested.

Check your environment variables first! 🔑
