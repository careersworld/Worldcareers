# 🤖 Automated Auth User Creation

## 📋 What This Does

The script **`scripts/create-auth-users.ts`** automatically creates 3 test auth users:
- ✅ Admin user
- ✅ Company user  
- ✅ Candidate user

**No manual clicking in Supabase Dashboard needed!**

## 🚀 How to Use

### Step 1: Get Your Service Role Key

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Find **service_role** key (the secret one)
5. Click **Copy**

⚠️ **Important:** This key is secret! Never commit it to git!

### Step 2: Add Service Role Key to `.env.local`

Open `c:\Users\maxim\OneDrive\Desktop\Worldcareer\.env.local`

Add this line (with your actual service_role key):

```env
NEXT_PUBLIC_SUPABASE_URL=https://vezggxsfnebpomxrigbj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlemdneHNmbmVicG9teHJpZ2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzg2NDAsImV4cCI6MjA3ODc1NDY0MH0.KlUaa2PL68-mbsGqq8H7dssCE19DFBjwlFWTZs3cIY8
SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here
```

**Save the file!**

### Step 3: Install tsx (if not installed)

```bash
npm install -D tsx
```

### Step 4: Run the Script

```bash
npx tsx scripts/create-auth-users.ts
```

### Step 5: Done!

The script will:
1. ✅ Create 3 auth users
2. ✅ Auto-confirm their emails
3. ✅ Add role metadata
4. ✅ Show you the credentials

## 📊 What Gets Created

### Admin User
```
Email: admin@worldcareers.rw
Password: Admin123!
Role: admin
Metadata: { "role": "admin", "first_name": "Admin", "last_name": "User" }
```

### Company User
```
Email: company@techcorp.rw
Password: Company123!
Role: company
Metadata: { "role": "company", "company_name": "Tech Corp Rwanda" }
```

### Candidate User
```
Email: candidate@example.com
Password: Candidate123!
Role: candidate
Metadata: { "role": "candidate", "first_name": "John", "last_name": "Doe" }
```

## 🎯 After Running

You can immediately login at `http://localhost:3000/login` with any of the credentials above!

## 🔄 To Recreate Users

If you want to delete and recreate users:

### Option 1: Manual (Supabase Dashboard)
1. Go to Authentication → Users
2. Delete all users
3. Run the script again

### Option 2: Script (Coming soon)
I can create a delete script too if you want!

## ⚠️ Important Notes

### Security
- ✅ **Service role key** should ONLY be in `.env.local`
- ✅ **Never commit** `.env.local` to git (it's already in `.gitignore`)
- ✅ **Only use** service role key in server-side scripts

### When to Use
- ✅ Development and testing
- ✅ Setting up new environments
- ✅ Resetting test data
- ❌ NOT for production user creation (use signup flow instead)

## 🆘 Troubleshooting

### "Missing environment variables"
- Make sure `.env.local` has all 3 variables
- Make sure you saved the file
- Try running from project root directory

### "User already exists"
- Users with these emails already exist
- Delete them in Supabase Dashboard first
- Or change the emails in the script

### "Invalid service role key"
- Make sure you copied the **service_role** key, not the anon key
- Check for extra spaces or missing characters

## 📝 Customizing Users

To change the test users, edit `scripts/create-auth-users.ts`:

```typescript
const testUsers = [
  {
    email: 'your-email@example.com',  // Change this
    password: 'YourPassword123!',      // Change this
    role: 'admin',                     // Change this
    metadata: {
      first_name: 'Your Name'          // Change this
    }
  },
  // Add more users...
]
```

## ✅ Complete Workflow

```bash
# 1. Add service role key to .env.local
# 2. Install tsx
npm install -D tsx

# 3. Run the script
npx tsx scripts/create-auth-users.ts

# 4. Login!
# Go to http://localhost:3000/login
# Use: admin@worldcareers.rw / Admin123!
```

---

**This is much faster than creating users manually in the dashboard!** 🚀
