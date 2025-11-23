# 🚨 FIXING "Failed to fetch (api.supabase.com)" ERROR

## ⚡ Quick Fix (Most Common Solution)

The error **"Failed to fetch (api.supabase.com)"** means your app is trying to connect to `api.supabase.com` instead of YOUR specific project URL.

### ✅ Solution:

1. **Open `.env.local`** in your project root
2. **Check your Supabase URL** - it should look like:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   ```
   **NOT** like this:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.com  ❌ WRONG!
   ```

3. **Get the correct URL:**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your project
   - Go to **Settings** → **API**
   - Copy **Project URL** (it will be unique to your project)

4. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key
   ```

5. **Restart your dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

6. **Clear browser cache** and reload

---

## 📋 Complete Diagnostic Steps

If the quick fix didn't work, follow these steps:

### Step 1: Validate Environment Variables

Run this in your terminal:

```bash
# Windows PowerShell
Get-Content .env.local
```

**Check for:**
- ✅ File exists in project root
- ✅ Contains `NEXT_PUBLIC_SUPABASE_URL`
- ✅ Contains `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ No extra spaces or quotes
- ✅ URL is YOUR project URL (not api.supabase.com)

### Step 2: Verify Supabase Project Status

1. Go to [app.supabase.com](https://app.supabase.com)
2. Check your project status
3. If it says "Paused" → Click "Restore"
4. Wait for project to become active

### Step 3: Test Database Connection

**Run the validation script:**

1. Go to Supabase Dashboard → **SQL Editor**
2. Create new query
3. Copy contents of `database/validate-schema.sql`
4. Run it
5. Check the output for any ❌ errors

### Step 4: Run Schema (If Not Created)

If validation shows missing tables:

1. In SQL Editor, create new query
2. Copy **ALL** of `database/complete-schema.sql`
3. Paste and run
4. Wait for completion (30-60 seconds)
5. Check for any error messages

### Step 5: Verify Schema Was Created

Run this query:

```sql
SELECT 
    'Tables' as type, 
    COUNT(*)::text as count 
FROM information_schema.tables 
WHERE table_schema = 'public'
UNION ALL
SELECT 
    'Functions', 
    COUNT(*)::text 
FROM information_schema.routines 
WHERE routine_schema = 'public'
UNION ALL
SELECT 
    'Policies', 
    COUNT(*)::text 
FROM pg_policies 
WHERE schemaname = 'public';
```

**Expected output:**
```
Tables    | 11
Functions | 5
Policies  | 40+
```

---

## 🔍 Understanding the Error

### What "Failed to fetch" Means

This error occurs when:

1. **Wrong URL** - Trying to connect to wrong Supabase endpoint
2. **Network Issue** - Can't reach Supabase servers
3. **Project Paused** - Your Supabase project is not active
4. **Firewall/VPN** - Network blocking the connection
5. **Invalid Credentials** - Wrong API key

### It's NOT a SQL Syntax Error

The SQL schema in `complete-schema.sql` is **syntactically correct**. The error is about **connecting** to Supabase, not about the SQL code itself.

---

## 🛠️ Troubleshooting by Error Location

### Error in Browser Console

If you see the error in browser DevTools (F12):

```javascript
Failed to fetch
```

**This means:** Your frontend can't connect to Supabase

**Fix:**
1. Check `.env.local` has correct values
2. Restart dev server
3. Clear browser cache
4. Check network tab for the actual request URL

### Error in SQL Editor

If you see the error when running SQL:

```
Failed to fetch (api.supabase.com)
```

**This means:** SQL Editor can't execute the query

**Fix:**
1. Check your internet connection
2. Try refreshing the page
3. Check Supabase status page
4. Try running a simpler query first: `SELECT 1;`

---

## 📝 Step-by-Step Setup (From Scratch)

If nothing works, start fresh:

### 1. Create Supabase Project

```
1. Go to app.supabase.com
2. Click "New Project"
3. Enter:
   - Name: WorldCareers
   - Database Password: (save this!)
   - Region: (closest to you)
4. Click "Create new project"
5. Wait 2-3 minutes for setup
```

### 2. Get Credentials

```
1. Go to Settings → API
2. Copy:
   - Project URL
   - anon public key
3. Save these somewhere safe
```

### 3. Update .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Schema

```
1. Go to SQL Editor
2. New Query
3. Copy complete-schema.sql
4. Run
5. Wait for success message
```

### 5. Validate Setup

```
1. Run validate-schema.sql
2. Check all tests pass ✅
3. If any fail, check error messages
```

### 6. Test Connection

```
1. Restart dev server
2. Open app in browser
3. Check browser console (F12)
4. Should see no errors
```

---

## ✅ Success Checklist

You'll know it's working when:

- [ ] `.env.local` has correct project URL (not api.supabase.com)
- [ ] `.env.local` has correct anon key
- [ ] Supabase project is active (not paused)
- [ ] SQL Editor can run queries
- [ ] `validate-schema.sql` shows all ✅
- [ ] Browser console shows no Supabase errors
- [ ] App loads without "Failed to fetch" error

---

## 🆘 Still Not Working?

### Check These Common Issues:

1. **Typo in .env.local**
   - No spaces around `=`
   - No quotes around values
   - Correct variable names with `NEXT_PUBLIC_` prefix

2. **Old cache**
   - Clear browser cache completely
   - Restart dev server
   - Try incognito/private window

3. **VPN/Firewall**
   - Disable VPN temporarily
   - Check firewall settings
   - Try different network

4. **Project Region**
   - Some regions may have connectivity issues
   - Check Supabase status page

5. **Browser Extensions**
   - Disable ad blockers
   - Disable privacy extensions
   - Try different browser

---

## 📞 Get More Help

1. **Run validation script** - `validate-schema.sql`
2. **Check validation checklist** - `VALIDATION_CHECKLIST.md`
3. **Review troubleshooting guide** - `TROUBLESHOOTING.md`
4. **Check Supabase docs** - [supabase.com/docs](https://supabase.com/docs)

---

## 🎯 TL;DR (Too Long; Didn't Read)

**The error is almost always because:**

1. ❌ Wrong URL in `.env.local` (using `api.supabase.com` instead of your project URL)
2. ❌ Missing or wrong environment variables
3. ❌ Supabase project is paused
4. ❌ Network/firewall blocking connection

**Quick fix:**

```bash
# 1. Get correct credentials from Supabase Dashboard → Settings → API
# 2. Update .env.local with YOUR project URL
# 3. Restart dev server
npm run dev
```

**The SQL schema is fine!** The error is about connection, not SQL syntax.

---

**Need immediate help?** Run `validate-schema.sql` in SQL Editor and share the output!
