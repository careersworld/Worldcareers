# 🔧 FIX: "Failed to fetch" Login Error

## 🎯 The Problem

You're getting **"Failed to fetch"** when trying to login. This means your `.env.local` file is either:
- ❌ Missing
- ❌ Has incorrect Supabase credentials
- ❌ Not loaded by the dev server

## ✅ Solution: Fix Environment Variables

### Step 1: Check if `.env.local` Exists

Open your project folder: `c:\Users\maxim\OneDrive\Desktop\Worldcareer`

Look for a file named **`.env.local`** (note the dot at the beginning)

**If it doesn't exist:** Create it!

### Step 2: Get Your Supabase Credentials

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your WorldCareers project
3. Click **Settings** (gear icon) → **API**
4. You'll see two important values:

   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

**Copy both of these!**

### Step 3: Create/Update `.env.local`

Open (or create) the file: `c:\Users\maxim\OneDrive\Desktop\Worldcareer\.env.local`

Add these two lines (replace with YOUR actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

**Example (with fake values):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjc1NjQwMCwiZXhwIjoxOTQ4MzMyNDAwfQ.1234567890abcdefghijklmnopqrstuvwxyz
```

### Step 4: Save and Restart Dev Server

1. **Save** the `.env.local` file
2. Go to your terminal where `npm run dev` is running
3. **Stop the server**: Press `Ctrl+C`
4. **Start it again**: 
   ```bash
   npm run dev
   ```
5. Wait for it to start (should say "Ready in X ms")

### Step 5: Clear Browser Cache

1. Open your browser
2. Press `F12` to open DevTools
3. Right-click the **Refresh** button
4. Select **"Empty Cache and Hard Reload"**

Or:
- Press `Ctrl+Shift+Delete`
- Select "Cached images and files"
- Click "Clear data"

### Step 6: Try Login Again

1. Go to `http://localhost:3000/login`
2. Try logging in
3. ✅ Should work now!

---

## 🔍 Verify Your Setup

Run this in PowerShell to check if `.env.local` exists:

```powershell
cd C:\Users\maxim\OneDrive\Desktop\Worldcareer
Get-Content .env.local
```

You should see your two environment variables.

---

## ⚠️ Common Mistakes

### ❌ Wrong URL Format
```env
# WRONG - Don't use api.supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://api.supabase.com

# CORRECT - Use YOUR project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
```

### ❌ Using Service Role Key
```env
# WRONG - Don't use service_role key (it's secret!)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...service_role_key...

# CORRECT - Use anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...anon_key...
```

### ❌ Missing NEXT_PUBLIC_ Prefix
```env
# WRONG - Missing prefix
SUPABASE_URL=https://...

# CORRECT - Must have NEXT_PUBLIC_ prefix
NEXT_PUBLIC_SUPABASE_URL=https://...
```

### ❌ Extra Spaces or Quotes
```env
# WRONG - Don't add quotes or spaces
NEXT_PUBLIC_SUPABASE_URL = "https://..."

# CORRECT - No quotes, no spaces around =
NEXT_PUBLIC_SUPABASE_URL=https://...
```

---

## 🆘 Still Not Working?

### Check 1: Verify Environment Variables are Loaded

Add this to your login page temporarily to debug:

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

Open browser console (F12) and check the output:
- ✅ Should show your project URL
- ✅ Should show `true` for anon key

If you see `undefined`:
- `.env.local` is not being loaded
- Restart dev server
- Make sure file is in project root

### Check 2: Verify Supabase Project is Active

1. Go to Supabase Dashboard
2. Check project status
3. If paused, click "Restore"

### Check 3: Test Direct Connection

Open browser console (F12) and run:

```javascript
fetch('https://your-project.supabase.co/rest/v1/')
  .then(r => r.json())
  .then(d => console.log('Connection OK:', d))
  .catch(e => console.error('Connection Failed:', e))
```

Replace `your-project` with your actual project URL.

---

## 📋 Quick Checklist

- [ ] `.env.local` file exists in project root
- [ ] File contains `NEXT_PUBLIC_SUPABASE_URL`
- [ ] File contains `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] URL is YOUR project URL (not api.supabase.com)
- [ ] Using anon key (not service_role key)
- [ ] No quotes around values
- [ ] No spaces around `=`
- [ ] Dev server restarted after creating/editing file
- [ ] Browser cache cleared
- [ ] Supabase project is active (not paused)

---

## 🎯 Expected `.env.local` Content

Your file should look EXACTLY like this (with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjMyNzU2NDAwLCJleHAiOjE5NDgzMzI0MDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**That's it! Just two lines!**

---

## 🚀 After Fixing

Once you've:
1. ✅ Created/updated `.env.local` with correct values
2. ✅ Restarted dev server
3. ✅ Cleared browser cache

Try logging in again with:
- Email: `admin@worldcareers.rw`
- Password: `Admin123!`

(But first make sure you created the auth user in Supabase Authentication!)

---

**The database is ready. You just need to fix the environment variables!** 🔑
