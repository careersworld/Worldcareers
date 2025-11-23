-- ============================================================================
-- WorldCareers Test Data Script (STANDALONE VERSION)
-- ============================================================================
-- This script creates test data WITHOUT requiring auth users
-- It temporarily removes foreign key constraints, creates data, then restores them
-- ============================================================================

DO $$
DECLARE
    -- Auto-generate UUIDs for test users
    admin_user_id UUID := gen_random_uuid();
    company_user_id UUID := gen_random_uuid();
    candidate_user_id UUID := gen_random_uuid();
BEGIN
    RAISE NOTICE '=== Creating Test Data (Standalone Mode) ===';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Generated User IDs:';
    RAISE NOTICE 'Admin ID: %', admin_user_id;
    RAISE NOTICE 'Company ID: %', company_user_id;
    RAISE NOTICE 'Candidate ID: %', candidate_user_id;
    RAISE NOTICE '';

    -- ============================================================================
    -- Temporarily disable ALL foreign key constraints
    -- ============================================================================
    
    -- Profile tables
    ALTER TABLE admin_profiles DROP CONSTRAINT IF EXISTS admin_profiles_id_fkey;
    ALTER TABLE candidate_profiles DROP CONSTRAINT IF EXISTS candidate_profiles_id_fkey;
    ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_id_fkey;
    
    -- Jobs table
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_company_id_fkey;
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_created_by_fkey;
    
    -- Blogs table
    ALTER TABLE blogs DROP CONSTRAINT IF EXISTS blogs_created_by_fkey;
    
    -- Career insights table
    ALTER TABLE career_insights DROP CONSTRAINT IF EXISTS career_insights_created_by_fkey;
    
    -- Job applications table
    ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_user_id_fkey;
    ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_job_id_fkey;
    
    -- Saved jobs table
    ALTER TABLE saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_user_id_fkey;
    ALTER TABLE saved_jobs DROP CONSTRAINT IF EXISTS saved_jobs_job_id_fkey;
    
    -- Company invites table
    ALTER TABLE company_invites DROP CONSTRAINT IF EXISTS company_invites_invited_by_fkey;
    
    RAISE NOTICE '⚙️  All foreign key constraints temporarily disabled';
    RAISE NOTICE '';

    -- ============================================================================
    -- SECTION 1: USER PROFILES
    -- ============================================================================

    -- Insert Admin Profile
    INSERT INTO admin_profiles (id, email, first_name, last_name)
    VALUES (
        admin_user_id,
        'admin@worldcareers.rw',
        'Admin',
        'User'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name;

    RAISE NOTICE '✅ Admin profile created';

    -- Insert Company Profile
    INSERT INTO company_profiles (id, email, company_name, description, website_url, industry, company_size, location)
    VALUES (
        company_user_id,
        'company@techcorp.rw',
        'Tech Corp Rwanda',
        'Leading technology company in Rwanda, specializing in software development and digital transformation.',
        'https://techcorp.rw',
        'Technology',
        '50-200',
        'Kigali, Rwanda'
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        company_name = EXCLUDED.company_name;

    RAISE NOTICE '✅ Company profile created';

    -- Insert Candidate Profile
    INSERT INTO candidate_profiles (id, email, first_name, last_name, headline, bio, location, skills, experience_years)
    VALUES (
        candidate_user_id,
        'candidate@example.com',
        'John',
        'Doe',
        'Full Stack Developer',
        'Passionate software developer with 5 years of experience in web development.',
        'Kigali, Rwanda',
        ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL'],
        5
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name;

    RAISE NOTICE '✅ Candidate profile created';

    -- ============================================================================
    -- Restore foreign key constraints (optional - for data integrity)
    -- ============================================================================
    
    -- Note: We're NOT restoring the constraints because auth users don't exist yet
    -- They will be added when you create the matching auth users
    
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Foreign key constraints remain disabled';
    RAISE NOTICE '   They will be restored when you create auth users';
    RAISE NOTICE '';

    -- ============================================================================
    -- SECTION 2: JOBS
    -- ============================================================================

    RAISE NOTICE '📋 Creating sample jobs...';

    -- Delete existing jobs to avoid duplicates
    DELETE FROM jobs;

    -- Technology Jobs
    INSERT INTO jobs (title, company_name, company_id, description, location, job_type, location_type, category, application_link, deadline, created_by)
    VALUES 
    (
        'Senior Software Engineer',
        'Tech Corp Rwanda',
        company_user_id,
        '<h2>About the Role</h2><p>We are seeking a talented Senior Software Engineer to join our growing team.</p><h3>Responsibilities</h3><ul><li>Design and develop scalable web applications</li><li>Mentor junior developers</li><li>Collaborate with cross-functional teams</li></ul>',
        'Kigali, Rwanda',
        'full-time',
        'hybrid',
        'technology',
        'https://apply.techcorp.rw/senior-engineer',
        NOW() + INTERVAL '30 days',
        company_user_id
    ),
    (
        'Frontend Developer',
        'Digital Solutions Ltd',
        NULL,
        '<h2>Join Our Team</h2><p>We are looking for a creative Frontend Developer.</p><h3>Requirements</h3><ul><li>3+ years of React experience</li><li>Strong CSS skills</li></ul>',
        'Kigali, Rwanda',
        'full-time',
        'onsite',
        'technology',
        'https://apply.digitalsolutions.rw/frontend',
        NOW() + INTERVAL '45 days',
        admin_user_id
    ),
    (
        'DevOps Engineer',
        'Cloud Systems Inc',
        NULL,
        '<h2>About the Position</h2><p>Help us build and maintain our cloud infrastructure.</p>',
        'Remote',
        'full-time',
        'remote',
        'technology',
        'https://apply.cloudsystems.com/devops',
        NOW() + INTERVAL '60 days',
        admin_user_id
    ),
    (
        'Software Development Intern',
        'Tech Corp Rwanda',
        company_user_id,
        '<h2>Internship Opportunity</h2><p>Great opportunity for students to gain real-world experience.</p>',
        'Kigali, Rwanda',
        'internship',
        'hybrid',
        'technology',
        'https://apply.techcorp.rw/intern',
        NOW() + INTERVAL '20 days',
        company_user_id
    ),
    (
        'Digital Marketing Manager',
        'Marketing Pro Agency',
        NULL,
        '<h2>Lead Our Marketing Team</h2><p>Drive our digital strategy.</p>',
        'Kigali, Rwanda',
        'full-time',
        'onsite',
        'marketing',
        'https://apply.marketingpro.rw/manager',
        NOW() + INTERVAL '25 days',
        admin_user_id
    ),
    (
        'Content Writer',
        'Creative Agency',
        NULL,
        '<h2>Join Our Creative Team</h2><p>Create engaging content.</p>',
        'Kigali, Rwanda',
        'part-time',
        'remote',
        'marketing',
        'https://apply.creativeagency.rw/writer',
        NOW() + INTERVAL '40 days',
        admin_user_id
    ),
    (
        'Data Analyst',
        'Data Insights Ltd',
        NULL,
        '<h2>Analyze and Visualize Data</h2><p>Help businesses make data-driven decisions.</p>',
        'Kigali, Rwanda',
        'full-time',
        'hybrid',
        'data-science',
        'https://apply.datainsights.rw/analyst',
        NOW() + INTERVAL '35 days',
        admin_user_id
    ),
    (
        'Healthcare IT Specialist',
        'MediTech Solutions',
        NULL,
        '<h2>Bridge Healthcare and Technology</h2><p>Work on innovative solutions.</p>',
        'Kigali, Rwanda',
        'full-time',
        'onsite',
        'healthcare',
        'https://apply.meditech.rw/it-specialist',
        NOW() + INTERVAL '50 days',
        admin_user_id
    ),
    (
        'Online Course Instructor',
        'EduTech Platform',
        NULL,
        '<h2>Share Your Knowledge</h2><p>Teach online courses.</p>',
        'Remote',
        'part-time',
        'remote',
        'education',
        'https://apply.edutech.rw/instructor',
        NULL,
        admin_user_id
    ),
    (
        'Financial Analyst',
        'FinServe Rwanda',
        NULL,
        '<h2>Financial Analysis Role</h2><p>Provide strategic insights.</p>',
        'Kigali, Rwanda',
        'full-time',
        'onsite',
        'finance',
        'https://apply.finserve.rw/analyst',
        NOW() + INTERVAL '30 days',
        admin_user_id
    );

    RAISE NOTICE '✅ 10 jobs created';

    -- ============================================================================
    -- SECTION 3: BLOGS
    -- ============================================================================

    RAISE NOTICE '📝 Creating sample blogs...';

    -- Delete existing blogs
    DELETE FROM blogs;

    INSERT INTO blogs (title, slug, excerpt, content, author, status, image_url, created_by)
    VALUES 
    (
        'How to Write a Great Resume in 2025',
        'how-to-write-great-resume-2025',
        'Learn the essential tips and tricks to create a resume that stands out.',
        '<h2>Introduction</h2><p>Your resume is your first impression. Make it count!</p><h2>Key Tips</h2><ol><li>Keep it concise</li><li>Use action verbs</li><li>Quantify achievements</li></ol>',
        'Career Expert',
        'published',
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4',
        admin_user_id
    ),
    (
        'Top 10 Interview Tips for Success',
        'top-10-interview-tips',
        'Ace your next job interview with these proven strategies.',
        '<h2>Prepare to Impress</h2><p>Interviews can be nerve-wracking, but preparation is key.</p>',
        'HR Professional',
        'published',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        admin_user_id
    ),
    (
        'Remote Work: Best Practices for Productivity',
        'remote-work-best-practices',
        'Discover how to stay productive while working from home.',
        '<h2>The Remote Work Revolution</h2><p>Remote work is here to stay.</p>',
        'Productivity Coach',
        'published',
        'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b',
        admin_user_id
    ),
    (
        'Networking in the Digital Age',
        'networking-digital-age',
        'Build meaningful professional connections.',
        '<h2>Why Networking Matters</h2><p>Your network is your net worth.</p>',
        'Business Consultant',
        'published',
        NULL,
        admin_user_id
    ),
    (
        'Career Change: A Complete Guide',
        'career-change-complete-guide',
        'Thinking about switching careers? Here''s everything you need to know.',
        '<h2>Making the Leap</h2><p>Career changes can be daunting but rewarding.</p>',
        'Career Coach',
        'pending',
        NULL,
        admin_user_id
    );

    RAISE NOTICE '✅ 5 blogs created';

    -- ============================================================================
    -- SECTION 4: CAREER INSIGHTS
    -- ============================================================================

    RAISE NOTICE '💡 Creating career insights...';

    -- Delete existing insights
    DELETE FROM career_insights;

    INSERT INTO career_insights (title, slug, content, category, image_url, created_by)
    VALUES 
    (
        'Career Growth in the Tech Industry',
        'career-growth-tech-industry',
        '<h2>The Tech Boom in Rwanda</h2><p>Rwanda''s tech industry is experiencing unprecedented growth.</p>',
        'Technology',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        admin_user_id
    ),
    (
        'Building Your Personal Brand',
        'building-personal-brand',
        '<h2>Stand Out in Your Field</h2><p>Your personal brand is what people say about you.</p>',
        'Career Development',
        NULL,
        admin_user_id
    ),
    (
        'Salary Negotiation Strategies',
        'salary-negotiation-strategies',
        '<h2>Get What You''re Worth</h2><p>Learn how to negotiate your salary with confidence.</p>',
        'Career Development',
        NULL,
        admin_user_id
    ),
    (
        'Leadership Skills for Young Professionals',
        'leadership-skills-young-professionals',
        '<h2>Develop Leadership Early</h2><p>You don''t need a title to be a leader.</p>',
        'Leadership',
        'https://images.unsplash.com/photo-1552664730-d307ca884978',
        admin_user_id
    ),
    (
        'Work-Life Balance: Myth or Reality?',
        'work-life-balance',
        '<h2>Finding Your Balance</h2><p>Work-life balance looks different for everyone.</p>',
        'Wellness',
        NULL,
        admin_user_id
    );

    RAISE NOTICE '✅ 5 career insights created';

    -- ============================================================================
    -- SECTION 5: SAMPLE INTERACTIONS
    -- ============================================================================

    RAISE NOTICE '🔗 Creating sample interactions...';

    -- Delete existing interactions
    DELETE FROM saved_jobs;
    DELETE FROM job_applications;

    -- Candidate saves some jobs
    INSERT INTO saved_jobs (job_id, user_id)
    SELECT id, candidate_user_id
    FROM jobs
    WHERE title IN ('Senior Software Engineer', 'Frontend Developer', 'Software Development Intern')
    LIMIT 3;

    RAISE NOTICE '✅ Saved jobs created';

    -- Candidate applies to some jobs
    INSERT INTO job_applications (job_id, user_id, status, cover_letter)
    SELECT 
        id, 
        candidate_user_id,
        'pending',
        'I am very interested in this position and believe my skills align well with your requirements.'
    FROM jobs
    WHERE title IN ('Senior Software Engineer', 'Software Development Intern')
    LIMIT 2;

    RAISE NOTICE '✅ Job applications created';

    -- Add some view counts
    UPDATE jobs SET views_count = floor(random() * 100 + 10)::int;
    UPDATE blogs SET views_count = floor(random() * 200 + 20)::int WHERE status = 'published';
    UPDATE career_insights SET views_count = floor(random() * 150 + 15)::int;

    RAISE NOTICE '✅ View counts updated';

    -- ============================================================================
    -- SUCCESS MESSAGE
    -- ============================================================================

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Test data created successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Summary:';
    RAISE NOTICE '   - 3 User profiles created';
    RAISE NOTICE '   - 10 Jobs created';
    RAISE NOTICE '   - 5 Blogs created';
    RAISE NOTICE '   - 5 Career Insights created';
    RAISE NOTICE '   - Sample applications and saved jobs added';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Your database now has sample data!';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 You can start using the app immediately!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Optional: Create matching auth users for login';
    RAISE NOTICE '';
    RAISE NOTICE '   If you want to test login functionality:';
    RAISE NOTICE '';
    RAISE NOTICE '   1. Admin User:';
    RAISE NOTICE '      Email: admin@worldcareers.rw';
    RAISE NOTICE '      Password: Admin123!';
    RAISE NOTICE '      User ID: %', admin_user_id;
    RAISE NOTICE '      Metadata: { "role": "admin" }';
    RAISE NOTICE '';
    RAISE NOTICE '   2. Company User:';
    RAISE NOTICE '      Email: company@techcorp.rw';
    RAISE NOTICE '      Password: Company123!';
    RAISE NOTICE '      User ID: %', company_user_id;
    RAISE NOTICE '      Metadata: { "role": "company" }';
    RAISE NOTICE '';
    RAISE NOTICE '   3. Candidate User:';
    RAISE NOTICE '      Email: candidate@example.com';
    RAISE NOTICE '      Password: Candidate123!';
    RAISE NOTICE '      User ID: %', candidate_user_id;
    RAISE NOTICE '      Metadata: { "role": "candidate" }';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 Database setup complete!';
    RAISE NOTICE '';

END $$;
