# 🚀 Quick Start: Create Users in Supabase

## Problem
You ran the database schema but have no users yet. Users must be created through **Supabase Authentication** first, then linked to the `user_profiles` table.

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create Admin in Supabase Dashboard

1. **Go to**: https://supabase.com/dashboard (your project)
2. **Click**: Authentication (left sidebar) → Users
3. **Click**: "Add user" button (top right)
4. **Click**: "Create new user" tab
5. **Fill in**:
   ```
   Email: admin@worldcareers.com
   Password: Admin@123456
   ✅ Auto Confirm User (CHECK THIS BOX!)
   ```
6. **Click**: "Create user"
7. **📋 COPY** the User ID (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 2: Link Admin to Profile

1. **Go to**: SQL Editor in Supabase
2. **Paste this** (replace YOUR-USER-ID with the ID you copied):

```sql
INSERT INTO user_profiles (
  id, 
  email, 
  role, 
  first_name, 
  last_name,
  headline,
  bio
) VALUES (
  'YOUR-USER-ID'::uuid,  -- ⚠️ REPLACE WITH ACTUAL USER ID!
  'admin@worldcareers.com',
  'admin',
  'Admin',
  'User',
  'Platform Administrator',
  'Managing WorldCareers platform'
);
```

3. **Click**: Run (or Ctrl+Enter)

### Step 3: Create Test Candidate (Optional)

Repeat Step 1 with these credentials:
```
Email: candidate@test.com
Password: Candidate@123
✅ Auto Confirm User
```

Then run this SQL (with the new user's ID):
```sql
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
  remote_preference
) VALUES (
  'YOUR-CANDIDATE-USER-ID'::uuid,  -- ⚠️ REPLACE!
  'candidate@test.com',
  'candidate',
  'Test',
  'Candidate',
  'Software Developer',
  'Looking for exciting opportunities',
  'Remote',
  ARRAY['full-time'],
  'remote'
);
```

---

## ✅ Verify Setup

Run this query in SQL Editor:
```sql
SELECT email, role, first_name, last_name FROM user_profiles;
```

You should see your admin and candidate users listed.

---

## 🔐 Login Credentials

### Admin
- **URL**: http://localhost:3000/login
- **Email**: `admin@worldcareers.com`
- **Password**: `Admin@123456`
- **Access**: Full admin dashboard, manage all content

### Candidate
- **URL**: http://localhost:3000/login
- **Email**: `candidate@test.com`
- **Password**: `Candidate@123`
- **Access**: Browse jobs, apply, edit profile

---

## 🎯 What Each User Can Do

### Admin User (`role = 'admin'`)
✅ View `/admin` dashboard
✅ Create, edit, delete jobs
✅ Create, edit, delete blogs
✅ Create, edit, delete career insights
✅ View all user profiles
✅ View all job applications

### Candidate User (`role = 'candidate'`)
✅ Browse and search jobs
✅ View job details
✅ Save jobs (bookmark)
✅ Apply to jobs
✅ Edit own profile
✅ Add work experience, education, skills
✅ Upload CV/resume

---

## 🐛 Troubleshooting

### "User already exists" error
The email is already in Supabase Auth. Either:
- Use a different email
- Delete the user and try again

### "Cannot read properties of undefined"
Make sure you:
1. Created the user in **Supabase Auth** first
2. Copied the correct UUID
3. Ran the INSERT query successfully

### "Row Level Security policy violation"
Your user_profiles INSERT failed. Check:
1. The UUID matches the auth user ID exactly
2. You included all required fields (id, email, role)

### Admin can't access `/admin` page
1. Make sure `role = 'admin'` in user_profiles
2. Verify the user ID matches between auth.users and user_profiles:
   ```sql
   SELECT 
     up.email, 
     up.role, 
     up.id as profile_id,
     au.id as auth_id
   FROM user_profiles up
   LEFT JOIN auth.users au ON au.id = up.id
   WHERE up.email = 'admin@worldcareers.com';
   ```

---

## 📝 Complete User List Template

Here's a template for creating multiple users:

| Email | Password | Role | First Name | Last Name |
|-------|----------|------|------------|-----------|
| admin@worldcareers.com | Admin@123456 | admin | Admin | User |
| john.dev@test.com | Test@123 | candidate | John | Developer |
| sarah.design@test.com | Test@123 | candidate | Sarah | Designer |

Create each in Supabase Auth, then run INSERT queries with their UUIDs.

---

## 🎉 Next Steps

Once you have users created:

1. **Test Login**: Go to http://localhost:3000/login
2. **Admin Dashboard**: Login as admin → visit `/admin`
3. **Browse Jobs**: Login as candidate → browse jobs on home page
4. **Test Features**: Try creating jobs, applying, saving jobs

Need help? Check `scripts/04-create-users.sql` for detailed SQL commands!
