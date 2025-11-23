-- ============================================================================
-- WorldCareers Test Data Script (AUTOMATED VERSION)
-- ============================================================================
-- This script automatically creates test users and populates sample data
-- NO MANUAL UUID COPYING REQUIRED!
-- ============================================================================

-- ============================================================================
-- IMPORTANT: How to Use This Script
-- ============================================================================
-- This script will create sample data WITHOUT requiring auth users first.
-- The profiles will be created with generated UUIDs.
-- You can create matching auth users later using the credentials below.
-- ============================================================================

DO $$
DECLARE
    -- Auto-generate UUIDs for test users
    admin_user_id UUID := gen_random_uuid();
    company_user_id UUID := gen_random_uuid();
    candidate_user_id UUID := gen_random_uuid();
BEGIN
    RAISE NOTICE '=== Creating Test Data ===';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Generated User IDs:';
    RAISE NOTICE 'Admin ID: %', admin_user_id;
    RAISE NOTICE 'Company ID: %', company_user_id;
    RAISE NOTICE 'Candidate ID: %', candidate_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Save these IDs to create matching auth users!';
    RAISE NOTICE '';

    -- ============================================================================
    -- SECTION 1: USER PROFILES (with auto-generated IDs)
    -- ============================================================================

    -- Insert Admin Profile
    INSERT INTO admin_profiles (id, email, first_name, last_name)
    VALUES (
        admin_user_id,
        'admin@worldcareers.rw',
        'Admin',
        'User'
    )
    ON CONFLICT (id) DO NOTHING;

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
    ON CONFLICT (id) DO NOTHING;

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
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE '✅ Candidate profile created';

    -- ============================================================================
    -- SECTION 2: JOBS
    -- ============================================================================

    RAISE NOTICE '';
    RAISE NOTICE '📋 Creating sample jobs...';

    -- Technology Jobs
    INSERT INTO jobs (title, company_name, company_id, description, location, job_type, location_type, category, application_link, deadline, created_by)
    VALUES 
    (
        'Senior Software Engineer',
        'Tech Corp Rwanda',
        company_user_id,
        '<h2>About the Role</h2><p>We are seeking a talented Senior Software Engineer to join our growing team. You will work on cutting-edge projects and help shape the future of technology in Rwanda.</p><h3>Responsibilities</h3><ul><li>Design and develop scalable web applications</li><li>Mentor junior developers</li><li>Collaborate with cross-functional teams</li><li>Write clean, maintainable code</li></ul>',
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
        '<h2>Join Our Team</h2><p>We are looking for a creative Frontend Developer to build beautiful user interfaces.</p><h3>Requirements</h3><ul><li>3+ years of React experience</li><li>Strong CSS skills</li><li>Experience with TypeScript</li></ul>',
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
        '<h2>About the Position</h2><p>Help us build and maintain our cloud infrastructure.</p><h3>Skills Required</h3><ul><li>AWS/Azure experience</li><li>Docker & Kubernetes</li><li>CI/CD pipelines</li></ul>',
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
        '<h2>Internship Opportunity</h2><p>Great opportunity for students to gain real-world experience in software development.</p><h3>What You''ll Learn</h3><ul><li>Modern web development</li><li>Agile methodologies</li><li>Professional coding practices</li></ul>',
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
        '<h2>Lead Our Marketing Team</h2><p>We need an experienced marketing professional to drive our digital strategy.</p><h3>Responsibilities</h3><ul><li>Develop marketing campaigns</li><li>Manage social media</li><li>Analyze marketing metrics</li></ul>',
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
        '<h2>Join Our Creative Team</h2><p>We are looking for a talented content writer to create engaging content.</p>',
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
        '<h2>Analyze and Visualize Data</h2><p>Help businesses make data-driven decisions.</p><h3>Requirements</h3><ul><li>SQL expertise</li><li>Python/R knowledge</li><li>Data visualization skills</li></ul>',
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
        '<h2>Bridge Healthcare and Technology</h2><p>Work on innovative healthcare technology solutions.</p>',
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
        '<h2>Share Your Knowledge</h2><p>Teach online courses in technology and business.</p>',
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
        '<h2>Financial Analysis Role</h2><p>Join our finance team to provide strategic insights.</p>',
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

    RAISE NOTICE '';
    RAISE NOTICE '📝 Creating sample blogs...';

    INSERT INTO blogs (title, slug, excerpt, content, author, status, image_url, created_by)
    VALUES 
    (
        'How to Write a Great Resume in 2025',
        'how-to-write-great-resume-2025',
        'Learn the essential tips and tricks to create a resume that stands out to employers in today''s competitive job market.',
        '<h2>Introduction</h2><p>Your resume is your first impression. Make it count!</p><h2>Key Tips</h2><ol><li>Keep it concise (1-2 pages)</li><li>Use action verbs</li><li>Quantify achievements</li><li>Tailor to each job</li><li>Proofread carefully</li></ol><h2>Common Mistakes to Avoid</h2><ul><li>Typos and grammatical errors</li><li>Generic objectives</li><li>Irrelevant information</li><li>Poor formatting</li></ul>',
        'Career Expert',
        'published',
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4',
        admin_user_id
    ),
    (
        'Top 10 Interview Tips for Success',
        'top-10-interview-tips',
        'Ace your next job interview with these proven strategies from HR professionals.',
        '<h2>Prepare to Impress</h2><p>Interviews can be nerve-wracking, but preparation is key.</p><h2>Top Tips</h2><ol><li>Research the company thoroughly</li><li>Practice common questions</li><li>Dress appropriately</li><li>Arrive early</li><li>Bring extra copies of your resume</li><li>Prepare questions to ask</li><li>Follow up with a thank-you email</li><li>Be authentic</li><li>Show enthusiasm</li><li>Listen carefully</li></ol>',
        'HR Professional',
        'published',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        admin_user_id
    ),
    (
        'Remote Work: Best Practices for Productivity',
        'remote-work-best-practices',
        'Discover how to stay productive and maintain work-life balance while working from home.',
        '<h2>The Remote Work Revolution</h2><p>Remote work is here to stay. Learn how to make the most of it.</p><h2>Best Practices</h2><ul><li>Create a dedicated workspace</li><li>Set clear boundaries</li><li>Use productivity tools</li><li>Take regular breaks</li><li>Stay connected with your team</li></ul>',
        'Productivity Coach',
        'published',
        'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b',
        admin_user_id
    ),
    (
        'Networking in the Digital Age',
        'networking-digital-age',
        'Build meaningful professional connections online and offline.',
        '<h2>Why Networking Matters</h2><p>Your network is your net worth in the professional world.</p><h2>Networking Strategies</h2><ul><li>Leverage LinkedIn effectively</li><li>Attend industry events</li><li>Join professional groups</li><li>Offer value first</li><li>Follow up consistently</li></ul>',
        'Business Consultant',
        'published',
        NULL,
        admin_user_id
    ),
    (
        'Career Change: A Complete Guide',
        'career-change-complete-guide',
        'Thinking about switching careers? Here''s everything you need to know.',
        '<h2>Making the Leap</h2><p>Career changes can be daunting but rewarding.</p><h2>Steps to Success</h2><ol><li>Assess your skills and interests</li><li>Research new fields</li><li>Get relevant training</li><li>Network in your target industry</li><li>Start with side projects</li><li>Update your resume</li></ol>',
        'Career Coach',
        'pending',
        NULL,
        admin_user_id
    );

    RAISE NOTICE '✅ 5 blogs created';

    -- ============================================================================
    -- SECTION 4: CAREER INSIGHTS
    -- ============================================================================

    RAISE NOTICE '';
    RAISE NOTICE '💡 Creating career insights...';

    INSERT INTO career_insights (title, slug, content, category, image_url, created_by)
    VALUES 
    (
        'Career Growth in the Tech Industry',
        'career-growth-tech-industry',
        '<h2>The Tech Boom in Rwanda</h2><p>Rwanda''s tech industry is experiencing unprecedented growth. Here''s how to position yourself for success.</p><h2>Key Skills in Demand</h2><ul><li>Cloud Computing</li><li>Artificial Intelligence</li><li>Cybersecurity</li><li>Mobile Development</li><li>Data Science</li></ul><h2>Career Paths</h2><p>From junior developer to CTO, the possibilities are endless in tech.</p>',
        'Technology',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        admin_user_id
    ),
    (
        'Building Your Personal Brand',
        'building-personal-brand',
        '<h2>Stand Out in Your Field</h2><p>Your personal brand is what people say about you when you''re not in the room.</p><h2>Brand Building Steps</h2><ol><li>Define your unique value proposition</li><li>Create consistent online presence</li><li>Share valuable content</li><li>Engage with your community</li><li>Be authentic</li></ol>',
        'Career Development',
        NULL,
        admin_user_id
    ),
    (
        'Salary Negotiation Strategies',
        'salary-negotiation-strategies',
        '<h2>Get What You''re Worth</h2><p>Learn how to negotiate your salary with confidence.</p><h2>Negotiation Tips</h2><ul><li>Research market rates</li><li>Know your worth</li><li>Practice your pitch</li><li>Consider the full package</li><li>Be prepared to walk away</li></ul>',
        'Career Development',
        NULL,
        admin_user_id
    ),
    (
        'Leadership Skills for Young Professionals',
        'leadership-skills-young-professionals',
        '<h2>Develop Leadership Early</h2><p>You don''t need a title to be a leader.</p><h2>Essential Leadership Skills</h2><ul><li>Communication</li><li>Emotional intelligence</li><li>Decision making</li><li>Delegation</li><li>Conflict resolution</li></ul>',
        'Leadership',
        'https://images.unsplash.com/photo-1552664730-d307ca884978',
        admin_user_id
    ),
    (
        'Work-Life Balance: Myth or Reality?',
        'work-life-balance',
        '<h2>Finding Your Balance</h2><p>Work-life balance looks different for everyone.</p><h2>Balance Strategies</h2><ul><li>Set boundaries</li><li>Prioritize self-care</li><li>Learn to say no</li><li>Schedule downtime</li><li>Unplug regularly</li></ul>',
        'Wellness',
        NULL,
        admin_user_id
    );

    RAISE NOTICE '✅ 5 career insights created';

    -- ============================================================================
    -- SECTION 5: SAMPLE INTERACTIONS
    -- ============================================================================

    RAISE NOTICE '';
    RAISE NOTICE '🔗 Creating sample interactions...';

    -- Candidate saves some jobs
    INSERT INTO saved_jobs (job_id, user_id)
    SELECT id, candidate_user_id
    FROM jobs
    WHERE title IN ('Senior Software Engineer', 'Frontend Developer', 'Software Development Intern')
    ON CONFLICT DO NOTHING;

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
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ Job applications created';

    -- Add some view counts to jobs
    UPDATE jobs SET views_count = floor(random() * 100 + 10)::int;
    
    -- Add some view counts to blogs
    UPDATE blogs SET views_count = floor(random() * 200 + 20)::int WHERE status = 'published';
    
    -- Add some view counts to career insights
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
    RAISE NOTICE '⚠️  IMPORTANT: Create matching auth users';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Use these credentials in Supabase Authentication:';
    RAISE NOTICE '';
    RAISE NOTICE '1. Admin User:';
    RAISE NOTICE '   Email: admin@worldcareers.rw';
    RAISE NOTICE '   Password: Admin123!';
    RAISE NOTICE '   User ID: %', admin_user_id;
    RAISE NOTICE '   Metadata: { "role": "admin" }';
    RAISE NOTICE '';
    RAISE NOTICE '2. Company User:';
    RAISE NOTICE '   Email: company@techcorp.rw';
    RAISE NOTICE '   Password: Company123!';
    RAISE NOTICE '   User ID: %', company_user_id;
    RAISE NOTICE '   Metadata: { "role": "company" }';
    RAISE NOTICE '';
    RAISE NOTICE '3. Candidate User:';
    RAISE NOTICE '   Email: candidate@example.com';
    RAISE NOTICE '   Password: Candidate123!';
    RAISE NOTICE '   User ID: %', candidate_user_id;
    RAISE NOTICE '';
    RAISE NOTICE '📝 To create auth users:';
    RAISE NOTICE '   1. Go to Authentication → Users';
    RAISE NOTICE '   2. Click "Add User" → "Create new user"';
    RAISE NOTICE '   3. Use the email and password above';
    RAISE NOTICE '   4. IMPORTANT: In "User UID" field, paste the ID shown above';
    RAISE NOTICE '   5. Check "Auto Confirm User"';
    RAISE NOTICE '   6. After creation, add the metadata (role)';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Your database is ready to use!';
    RAISE NOTICE '';

END $$;
