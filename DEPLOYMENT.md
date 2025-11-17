# WorldCareers Rwanda - Deployment Guide

## Vercel Deployment

### Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Your Supabase project credentials

### Required Environment Variables

Add these environment variables in your Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### How to Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy the following:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository: `careersworld/Worldcareers`
3. Configure your project:
   - Framework Preset: **Next.js**
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
4. Add environment variables (see above)
5. Click **Deploy**

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Setting Environment Variables via CLI

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

### Database Setup

After deployment, run the database scripts in your Supabase SQL Editor:

1. `scripts/01-create-advanced-schema.sql` - Create tables
2. `scripts/02-setup-advanced-rls.sql` - Setup Row Level Security
3. `scripts/08-clear-and-add-new-jobs-companies.sql` - Seed data

### Post-Deployment Checklist

- [ ] Environment variables are set in Vercel
- [ ] Database tables are created in Supabase
- [ ] Sample data is seeded
- [ ] Test the deployed site
- [ ] Verify job listings are showing
- [ ] Test authentication flows

### Troubleshooting

**Build fails with "Missing Supabase environment variables"**
- Make sure you've added both environment variables in Vercel project settings
- Environment variables should start with `NEXT_PUBLIC_` for client-side access

**Jobs not showing after deployment**
- Check if you've run the database seed scripts
- Verify Supabase connection by checking Network tab in browser DevTools

**Authentication not working**
- Verify your Supabase URL is correct
- Check that the anon key matches your Supabase project
- Ensure Supabase authentication is enabled in your project

### Production URL

Your site will be available at:
- `https://worldcareers.vercel.app` (or your custom domain)

### Custom Domain

To add a custom domain:
1. Go to your Vercel project → Settings → Domains
2. Add your domain
3. Update your DNS records as instructed

---

For more information, visit:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
