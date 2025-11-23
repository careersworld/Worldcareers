# 🗺️ Database Schema Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION LAYER                         │
│                         (Supabase Auth)                              │
│                         auth.users table                             │
└────────────┬────────────────────────────────────────────────────────┘
             │
             │ (Foreign Key: id)
             │
    ┌────────┴────────┬─────────────────┬──────────────────┐
    │                 │                 │                  │
    ▼                 ▼                 ▼                  ▼
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
│  admin_ │    │candidate_│    │ company_ │    │   company_   │
│profiles │    │ profiles │    │ profiles │    │   invites    │
└─────────┘    └──────────┘    └────┬─────┘    └──────────────┘
                                    │
                                    │ (company_id)
                                    │
                               ┌────▼─────┐
                               │   jobs   │◄─────────┐
                               └────┬─────┘          │
                                    │                │
                ┌───────────────────┼────────────┐   │
                │                   │            │   │
                ▼                   ▼            ▼   │
         ┌──────────┐        ┌──────────┐  ┌────────┴───┐
         │   job_   │        │  saved_  │  │  content_  │
         │applications       │   jobs   │  │   views    │
         └──────────┘        └──────────┘  └────────────┘
                                                  ▲
                                                  │
                                                  │
                          ┌───────────────────────┼──────────────┐
                          │                       │              │
                     ┌────▼────┐          ┌───────▼──────┐  ┌───▼────┐
                     │  blogs  │          │   career_    │  │  web_  │
                     │         │          │   insights   │  │analytics
                     └─────────┘          └──────────────┘  └────────┘
```

## Table Relationships

### User Management
```
auth.users (Supabase)
    ├── admin_profiles (1:1)
    ├── candidate_profiles (1:1)
    └── company_profiles (1:1)
```

### Content Management
```
company_profiles
    └── jobs (1:many)
        ├── job_applications (1:many)
        ├── saved_jobs (1:many)
        └── content_views (1:many)

blogs
    └── content_views (1:many)

career_insights
    └── content_views (1:many)
```

## Data Flow Diagram

```
┌──────────────┐
│   Frontend   │
│  (Next.js)   │
└──────┬───────┘
       │
       │ HTTP/WebSocket
       │
       ▼
┌──────────────────┐
│  Supabase API    │
│  (Auto-generated)│
└──────┬───────────┘
       │
       │ SQL Queries
       │
       ▼
┌──────────────────┐
│  Row Level       │
│  Security (RLS)  │◄──── Checks user permissions
└──────┬───────────┘
       │
       │ Authorized queries only
       │
       ▼
┌──────────────────┐
│  PostgreSQL      │
│  Database        │
│  (11 tables)     │
└──────┬───────────┘
       │
       │ Triggers & Functions
       │
       ▼
┌──────────────────┐
│  Automatic       │
│  Updates         │
│  - Timestamps    │
│  - View counts   │
│  - App counts    │
└──────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC ACCESS                         │
│  - Published blogs                                       │
│  - Career insights                                       │
│  - Active jobs                                           │
│  - Company profiles                                      │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 AUTHENTICATED ACCESS                     │
│  - User profiles (read)                                  │
│  - Job applications (own)                                │
│  - Saved jobs (own)                                      │
│  - Draft blogs (own)                                     │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   ROLE-BASED ACCESS                      │
│                                                          │
│  ADMIN:                                                  │
│  - All CRUD operations                                   │
│  - User management                                       │
│  - Content approval                                      │
│  - Analytics access                                      │
│                                                          │
│  COMPANY:                                                │
│  - Create/edit own jobs                                  │
│  - View applications to own jobs                         │
│  - Update own profile                                    │
│                                                          │
│  CANDIDATE:                                              │
│  - Apply to jobs                                         │
│  - Save jobs                                             │
│  - Update own profile                                    │
│  - Create blog drafts                                    │
└─────────────────────────────────────────────────────────┘
```

## Database Schema Statistics

```
┌─────────────────────────────────────────────────────────┐
│                    SCHEMA METRICS                        │
├─────────────────────────────────────────────────────────┤
│  Tables:              11                                 │
│  Views:               2                                  │
│  Functions:           5                                  │
│  Triggers:            8                                  │
│  Indexes:             30+                                │
│  RLS Policies:        40+                                │
│  Enums:               5                                  │
│  Total Lines:         900+                               │
└─────────────────────────────────────────────────────────┘
```

## Feature Coverage

```
┌────────────────────┬──────────────────────────────────────┐
│     FEATURE        │              STATUS                  │
├────────────────────┼──────────────────────────────────────┤
│ User Management    │ ✅ Complete (3 profile types)        │
│ Job Posting        │ ✅ Complete (full CRUD)              │
│ Job Applications   │ ✅ Complete (with status tracking)   │
│ Saved Jobs         │ ✅ Complete (bookmarking)            │
│ Blog System        │ ✅ Complete (with approval flow)     │
│ Career Insights    │ ✅ Complete (admin-managed)          │
│ View Tracking      │ ✅ Complete (unified system)         │
│ Analytics          │ ✅ Complete (web + content)          │
│ Search             │ ✅ Complete (full-text indexes)      │
│ Real-time Updates  │ ✅ Complete (Supabase subscriptions) │
│ Security (RLS)     │ ✅ Complete (comprehensive policies) │
│ Performance        │ ✅ Complete (optimized indexes)      │
└────────────────────┴──────────────────────────────────────┘
```

## File Structure

```
database/
├── complete-schema.sql          (33 KB) - Main database schema
├── test-data.sql                (17 KB) - Sample data for testing
├── reset-database.sql           (2 KB)  - Development reset script
├── README.md                    (10 KB) - Full documentation
├── SETUP.md                     (6 KB)  - Quick start guide
├── IMPLEMENTATION_SUMMARY.md    (8 KB)  - Implementation overview
├── QUICK_REFERENCE.md           (6 KB)  - Common queries & examples
└── SCHEMA_DIAGRAM.md            (This file)

lib/supabase/
├── client.ts                    - Browser Supabase client
└── server.ts                    - Server Supabase client
```

## Workflow Examples

### Job Application Flow
```
1. User browses jobs
   └─→ SELECT * FROM jobs WHERE is_active = TRUE

2. User views job details
   └─→ track_content_view('job', job_id, user_id)
   └─→ Trigger: increment views_count

3. User applies to job
   └─→ INSERT INTO job_applications (...)
   └─→ Trigger: increment applications_count

4. Company reviews application
   └─→ UPDATE job_applications SET status = 'reviewing'

5. User checks application status
   └─→ SELECT * FROM job_applications WHERE user_id = ?
```

### Blog Publishing Flow
```
1. User creates blog draft
   └─→ INSERT INTO blogs (status = 'draft')

2. User submits for review
   └─→ UPDATE blogs SET status = 'pending'

3. Admin reviews and approves
   └─→ UPDATE blogs SET status = 'published'

4. Blog appears on public page
   └─→ SELECT * FROM blogs WHERE status = 'published'

5. Users view blog
   └─→ track_content_view('blog', blog_id, user_id)
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────┐
│                  OPTIMIZATION STRATEGIES                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. INDEXES                                              │
│     ✓ B-tree indexes on foreign keys                    │
│     ✓ Trigram indexes for full-text search              │
│     ✓ Composite indexes for common queries              │
│                                                          │
│  2. VIEWS                                                │
│     ✓ Pre-computed dashboard_stats                      │
│     ✓ Unified all_users view                            │
│                                                          │
│  3. TRIGGERS                                             │
│     ✓ Automatic timestamp updates                       │
│     ✓ Counter maintenance (no manual updates)           │
│                                                          │
│  4. FUNCTIONS                                            │
│     ✓ SECURITY DEFINER for safe operations              │
│     ✓ Optimized view tracking                           │
│                                                          │
│  5. RLS POLICIES                                         │
│     ✓ Efficient policy checks                           │
│     ✓ Index-friendly conditions                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Next Steps

1. ✅ Schema created → `complete-schema.sql`
2. ✅ Documentation written → Multiple MD files
3. ✅ Client updated → Real Supabase connection
4. ⏳ **Your turn**: Follow `SETUP.md` to deploy
5. ⏳ Test with sample data → `test-data.sql`
6. ⏳ Verify all features work
7. 🚀 Go to production!

---

**Legend:**
- ✅ Complete
- ⏳ Pending (your action needed)
- 🚀 Ready for deployment
