# 🚀 Quick Setup Guide

## Step-by-Step Database Setup

### 1️⃣ Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: WorldCareers
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to Rwanda (e.g., Frankfurt)
4. Wait for project to be created (~2 minutes)

### 2️⃣ Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3️⃣ Update Environment Variables

1. Open `.env.local` in your project root
2. Update with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4️⃣ Run the Database Schema

**Option A: Using Supabase Dashboard (Easiest)**

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `database/complete-schema.sql`
4. Paste into the editor
5. Click **Run** (bottom right)
6. Wait for success message ✅

**Option B: Using Command Line**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project ref from dashboard URL)
supabase link --project-ref your-project-ref

# Run the schema
supabase db push
```

### 5️⃣ Create Test Users

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Create these three users:

**Admin User:**
- Email: `admin@worldcareers.rw`
- Password: `Admin123!`
- Auto Confirm User: ✅ Yes
- Click **Create User**
- After creation, click on the user
- Scroll to **User Metadata** section
- Click **Edit**
- Add: `{ "role": "admin" }`
- Save

**Company User:**
- Email: `company@techcorp.rw`
- Password: `Company123!`
- Auto Confirm User: ✅ Yes
- User Metadata: `{ "role": "company" }`

**Candidate User:**
- Email: `candidate@example.com`
- Password: `Candidate123!`
- Auto Confirm User: ✅ Yes
- User Metadata: `{ "role": "candidate" }`

### 6️⃣ Copy User IDs

1. For each user you created, copy their UUID (User UID)
2. Open `database/test-data.sql`
3. Replace the placeholder UUIDs at the top:

```sql
DECLARE
    admin_user_id UUID := 'paste-admin-uuid-here';
    company_user_id UUID := 'paste-company-uuid-here';
    candidate_user_id UUID := 'paste-candidate-uuid-here';
```

### 7️⃣ Load Test Data

1. Go back to **SQL Editor**
2. Create a **New Query**
3. Copy the entire contents of `database/test-data.sql` (with your UUIDs)
4. Paste and **Run**
5. You should see success message with summary ✅

### 8️⃣ Update Supabase Client

Replace the mock client with the real one:

1. Open `lib/supabase/client.ts`
2. Replace entire contents with:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 9️⃣ Test Your Setup

1. Restart your development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:3000`

3. You should now see:
   - ✅ Real jobs loading on homepage
   - ✅ Blogs page with content
   - ✅ Career insights page with content

4. Test login with any of the test accounts:
   - Admin: `admin@worldcareers.rw` / `Admin123!`
   - Company: `company@techcorp.rw` / `Company123!`
   - Candidate: `candidate@example.com` / `Candidate123!`

### 🔟 Verify Everything Works

**Check Jobs:**
- Go to homepage
- You should see 10 jobs listed
- Click on a job to view details
- View count should increment

**Check Admin Dashboard:**
- Login as admin
- Go to `/admin`
- You should see statistics and management panels

**Check Applications:**
- Login as candidate
- Apply to a job
- Check that application count increases

## 🎉 You're Done!

Your database is now fully set up and ready for production use!

## 📊 What Was Created

- ✅ **11 Tables** with proper relationships
- ✅ **2 Views** for unified data access
- ✅ **5 Functions** for automation
- ✅ **Multiple Triggers** for data integrity
- ✅ **RLS Policies** for security
- ✅ **Indexes** for performance
- ✅ **Test Data** for immediate testing

## 🔧 Troubleshooting

### Issue: "relation does not exist"
**Solution**: Make sure you ran `complete-schema.sql` first before `test-data.sql`

### Issue: "permission denied"
**Solution**: Check that RLS policies are enabled and you're logged in with correct role

### Issue: No data showing
**Solution**: 
1. Check browser console for errors
2. Verify `.env.local` has correct credentials
3. Restart dev server after changing `.env.local`

### Issue: Test data script fails
**Solution**: Make sure you replaced the UUIDs with actual user IDs from Supabase Auth

## 🆘 Need Help?

Check the main `README.md` in the database folder for:
- Detailed schema documentation
- Common queries
- Security information
- Performance tips

## 🔄 Next Steps

1. **Customize**: Modify the schema to fit your specific needs
2. **Deploy**: Your database is production-ready!
3. **Monitor**: Use Supabase dashboard to monitor performance
4. **Backup**: Set up automated backups in Supabase settings

---

**Happy Building! 🚀**
