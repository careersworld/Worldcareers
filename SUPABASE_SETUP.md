# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub (or create an account)
4. Click "New Project"
5. Fill in:
   - **Name**: `job-portal` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
6. Click "Create new project" and wait 1-2 minutes

## Step 2: Get Your Credentials

Once your project is created:

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Create .env.local File

In your project root, create a file named `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

## Step 4: Set Up Database Tables

1. In Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **New query**
3. Copy the contents of `scripts/01-create-tables.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

## Step 5: Add Sample Data (Optional)

1. In SQL Editor, click **New query** again
2. Copy the contents of `scripts/02-seed-data.sql`
3. Paste into the SQL editor
4. Click **Run**
5. You should see rows inserted successfully

## Step 6: Configure Row Level Security (RLS)

For public read access and admin write access:

1. In SQL Editor, run this query:

```sql
-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_insights ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on career_insights" ON career_insights FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (for admin panel)
CREATE POLICY "Allow authenticated insert on jobs" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on jobs" ON jobs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on jobs" ON jobs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on blogs" ON blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on blogs" ON blogs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on blogs" ON blogs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on career_insights" ON career_insights FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on career_insights" ON career_insights FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on career_insights" ON career_insights FOR DELETE USING (auth.role() = 'authenticated');
```

## Step 7: Set Up Authentication (For Admin Panel)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider (it's enabled by default)
3. Go to **Authentication** → **Users**
4. Click **Add user** → **Create new user**
5. Enter email and password for your admin account
6. Click **Create user**

## Step 8: Test Connection

Run the check script:

```powershell
node scripts/check-supabase.js
```

You should see:
```
Found SUPABASE_URL and ANON_KEY in environment
Successfully connected to Supabase storage. Buckets: 0
```

## Step 9: Start Development Server

```powershell
npm run dev
```

Visit http://localhost:3000 to see your site!

## Troubleshooting

**"Missing env vars"**
- Make sure `.env.local` exists in project root
- Restart your terminal/IDE after creating `.env.local`
- Make sure there are no spaces around the `=` sign

**"Client created but request returned error"**
- Check that your anon key is correct
- Verify your project URL is correct

**"Cannot connect to Supabase"**
- Check your internet connection
- Verify the project is active in Supabase dashboard

## Next Steps

- Visit `/login` to sign in as admin
- Visit `/admin` to manage jobs, blogs, and insights
- Check `/jobs`, `/blogs`, `/career-insights` for public pages
