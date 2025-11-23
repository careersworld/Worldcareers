# 🎯 Creating Test Users - Step by Step Guide

## ✅ Good News!

The error you're seeing means:
- ✅ **The schema ran successfully!** (complete-schema.sql worked!)
- ✅ **Tables are created correctly**
- ❌ **Test users don't exist yet** (that's what we'll fix now)

## 📋 The Error Explained

```
Key (id)=(00000000-0000-0000-0000-000000000001) is not present in table "users"
```

This means `test-data.sql` is trying to insert profiles for users that don't exist in Supabase Authentication yet. You need to **create the users first**, then run the test data.

---

## 🚀 Step-by-Step: Create Test Users

### Step 1: Go to Authentication

1. Open your Supabase Dashboard
2. Click **Authentication** in the left sidebar
3. Click **Users** tab

### Step 2: Create Admin User

1. Click **Add User** → **Create new user**
2. Fill in:
   ```
   Email: admin@worldcareers.rw
   Password: Admin123!
   Auto Confirm User: ✅ YES (check this box!)
   ```
3. Click **Create User**
4. **IMPORTANT:** After user is created, click on the user row
5. Scroll down to **User Metadata** section
6. Click **Edit** (pencil icon)
7. Add this JSON:
   ```json
   {
     "role": "admin"
   }
   ```
8. Click **Save**
9. **Copy the User UID** (it's a UUID like `a1b2c3d4-...`)

### Step 3: Create Company User

1. Click **Add User** → **Create new user**
2. Fill in:
   ```
   Email: company@techcorp.rw
   Password: Company123!
   Auto Confirm User: ✅ YES
   ```
3. Click **Create User**
4. Click on the user, edit **User Metadata**:
   ```json
   {
     "role": "company"
   }
   ```
5. **Copy the User UID**

### Step 4: Create Candidate User

1. Click **Add User** → **Create new user**
2. Fill in:
   ```
   Email: candidate@example.com
   Password: Candidate123!
   Auto Confirm User: ✅ YES
   ```
3. Click **Create User**
4. Click on the user, edit **User Metadata**:
   ```json
   {
     "role": "candidate"
   }
   ```
5. **Copy the User UID**

---

## 📝 Step 5: Update test-data.sql with Real UUIDs

1. Open `database/test-data.sql`
2. Find lines 26-28 (the DECLARE section)
3. Replace the placeholder UUIDs with the real ones you copied:

```sql
DO $$
DECLARE
    -- Replace these with ACTUAL UUIDs from Supabase Authentication!
    admin_user_id UUID := 'paste-admin-uuid-here';      -- ← Paste admin UUID
    company_user_id UUID := 'paste-company-uuid-here';  -- ← Paste company UUID
    candidate_user_id UUID := 'paste-candidate-uuid-here'; -- ← Paste candidate UUID
BEGIN
```

**Example (with real UUIDs):**
```sql
DO $$
DECLARE
    admin_user_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    company_user_id UUID := 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
    candidate_user_id UUID := 'c3d4e5f6-a7b8-9012-cdef-123456789012';
BEGIN
```

4. **Save the file**

---

## 🚀 Step 6: Run test-data.sql

1. Go back to Supabase **SQL Editor**
2. Create **New Query**
3. Copy **ALL** of the updated `test-data.sql`
4. Click **Run**
5. ✅ Should complete successfully!

---

## ✅ Verify Everything Worked

Run this query to check:

```sql
-- Check if test data was inserted
SELECT 
    'Admin Profiles' as table_name, 
    COUNT(*)::text as count 
FROM admin_profiles
UNION ALL
SELECT 'Company Profiles', COUNT(*)::text FROM company_profiles
UNION ALL
SELECT 'Candidate Profiles', COUNT(*)::text FROM candidate_profiles
UNION ALL
SELECT 'Jobs', COUNT(*)::text FROM jobs
UNION ALL
SELECT 'Blogs', COUNT(*)::text FROM blogs
UNION ALL
SELECT 'Career Insights', COUNT(*)::text FROM career_insights;
```

**Expected output:**
```
Admin Profiles      | 1
Company Profiles    | 1
Candidate Profiles  | 1
Jobs                | 10
Blogs               | 5
Career Insights     | 5
```

---

## 🎯 Quick Visual Guide

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Create Users in Supabase Authentication        │
│                                                         │
│  1. Admin User                                          │
│     Email: admin@worldcareers.rw                        │
│     Password: Admin123!                                 │
│     Metadata: { "role": "admin" }                       │
│     → Copy UUID                                         │
│                                                         │
│  2. Company User                                        │
│     Email: company@techcorp.rw                          │
│     Password: Company123!                               │
│     Metadata: { "role": "company" }                     │
│     → Copy UUID                                         │
│                                                         │
│  3. Candidate User                                      │
│     Email: candidate@example.com                        │
│     Password: Candidate123!                             │
│     Metadata: { "role": "candidate" }                   │
│     → Copy UUID                                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Update test-data.sql                            │
│                                                         │
│  Replace placeholder UUIDs with real ones:              │
│                                                         │
│  admin_user_id := 'real-admin-uuid';                    │
│  company_user_id := 'real-company-uuid';                │
│  candidate_user_id := 'real-candidate-uuid';            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Run test-data.sql in SQL Editor                │
│                                                         │
│  ✅ Success! Test data inserted                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Test User Credentials

After setup, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@worldcareers.rw | Admin123! |
| Company | company@techcorp.rw | Company123! |
| Candidate | candidate@example.com | Candidate123! |

---

## 🆘 Common Issues

### Issue: "Can't find User Metadata section"

**Solution:**
1. Click on the user in the list
2. Look for **Raw User Meta Data** section
3. Click the **Edit** icon (pencil)
4. Paste the JSON with role

### Issue: "UUID format is wrong"

**Solution:**
- UUID should look like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- Copy it exactly as shown in Supabase (including dashes)
- Don't add quotes when pasting in SQL

### Issue: "Still getting foreign key error"

**Solution:**
1. Make sure you copied the **User UID**, not the email
2. Verify the UUID is pasted correctly in test-data.sql
3. Check there are no extra spaces
4. Make sure you saved the file after editing

---

## 📸 Screenshot Guide

### Where to find User UID:

```
Authentication → Users → Click on user row
┌────────────────────────────────────────────┐
│ User Details                               │
├────────────────────────────────────────────┤
│ User UID: a1b2c3d4-e5f6-7890-abcd-...     │ ← Copy this!
│ Email: admin@worldcareers.rw               │
│ Created: 2025-11-23                        │
│                                            │
│ Raw User Meta Data:                        │
│ {                                          │
│   "role": "admin"                          │ ← Add this!
│ }                                          │
└────────────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Created 3 users in Supabase Authentication
- [ ] Set "Auto Confirm User" to YES for all
- [ ] Added role metadata to each user
- [ ] Copied all 3 UUIDs
- [ ] Updated test-data.sql with real UUIDs
- [ ] Saved test-data.sql
- [ ] Ran test-data.sql in SQL Editor
- [ ] No errors!
- [ ] Verified data with SELECT query

---

## 🎉 Next Steps After Test Data is Loaded

1. ✅ Update `.env.local` with Supabase credentials
2. ✅ Restart dev server: `npm run dev`
3. ✅ Open app in browser
4. ✅ Try logging in with test credentials
5. ✅ Browse jobs, blogs, career insights
6. ✅ Test admin dashboard
7. ✅ Test job applications

---

**Remember:** You MUST create users in Authentication BEFORE running test-data.sql!

The error you got is normal and expected - it just means you need to create the users first. 🚀
