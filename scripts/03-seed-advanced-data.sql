-- Sample data for the advanced schema

-- Note: You'll need to create users through Supabase Auth first
-- Then use their IDs here. For now, we'll create sample job data.

-- Insert sample jobs with enhanced fields
INSERT INTO jobs (
  title, 
  company, 
  description, 
  responsibilities,
  requirements,
  benefits,
  location, 
  job_type, 
  location_type, 
  experience_level,
  salary_min,
  salary_max,
  application_link, 
  is_sponsored, 
  is_active,
  created_at
) VALUES
(
  'Senior Full Stack Developer',
  'Tech Corp',
  'We are looking for an experienced Full Stack Developer to join our growing engineering team. You will be responsible for building and maintaining scalable web applications.',
  ARRAY['Design and develop web applications', 'Write clean, maintainable code', 'Collaborate with cross-functional teams', 'Mentor junior developers'],
  ARRAY['5+ years of experience with React and Node.js', 'Strong understanding of database design', 'Experience with cloud platforms (AWS/GCP)', 'Excellent communication skills'],
  ARRAY['Competitive salary', 'Health insurance', 'Remote work options', '401(k) matching', 'Professional development budget'],
  'San Francisco, CA',
  'full-time',
  'hybrid',
  'senior',
  120000,
  180000,
  'https://techcorp.com/careers',
  false,
  true,
  NOW() - INTERVAL '2 days'
),
(
  'UI/UX Designer',
  'Design Studio',
  'Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.',
  ARRAY['Create wireframes and prototypes', 'Conduct user research', 'Design pixel-perfect interfaces', 'Work closely with developers'],
  ARRAY['3+ years of UI/UX design experience', 'Proficiency in Figma and Adobe Creative Suite', 'Strong portfolio demonstrating design skills', 'Understanding of design systems'],
  ARRAY['Flexible hours', 'Health & dental insurance', 'Creative work environment', 'Latest design tools provided'],
  'New York, NY',
  'full-time',
  'onsite',
  'mid',
  80000,
  110000,
  'https://designstudio.com/jobs',
  false,
  true,
  NOW() - INTERVAL '3 days'
),
(
  'Product Manager',
  'StartupX',
  'We are seeking a strategic Product Manager to drive product development and go-to-market strategies.',
  ARRAY['Define product vision and strategy', 'Manage product roadmap', 'Collaborate with engineering and design teams', 'Analyze market trends and user feedback'],
  ARRAY['4+ years of product management experience', 'Strong analytical and problem-solving skills', 'Experience with agile methodologies', 'Excellent stakeholder management'],
  ARRAY['Equity options', 'Unlimited PTO', 'Remote-first culture', 'Learning & development stipend'],
  'Remote',
  'full-time',
  'remote',
  'senior',
  100000,
  140000,
  'https://startupx.com/careers',
  true,
  true,
  NOW() - INTERVAL '1 day'
),
(
  'Marketing Intern',
  'Marketing Agency',
  'Gain hands-on experience in digital marketing, social media management, and content creation.',
  ARRAY['Assist with social media campaigns', 'Create marketing content', 'Conduct market research', 'Support the marketing team with various projects'],
  ARRAY['Currently enrolled in Marketing or related degree', 'Strong writing skills', 'Basic understanding of social media platforms', 'Creative mindset'],
  ARRAY['Mentorship from experienced marketers', 'Real project experience', 'Potential for full-time offer', 'Flexible schedule'],
  'Chicago, IL',
  'internship',
  'hybrid',
  'entry',
  15000,
  25000,
  'https://marketingagency.com/intern',
  false,
  true,
  NOW() - INTERVAL '5 days'
),
(
  'DevOps Engineer',
  'Cloud Solutions Inc',
  'Join our infrastructure team to build and maintain scalable, reliable cloud infrastructure.',
  ARRAY['Manage AWS/GCP infrastructure', 'Implement CI/CD pipelines', 'Monitor system performance', 'Automate deployment processes'],
  ARRAY['3+ years of DevOps experience', 'Strong knowledge of Docker and Kubernetes', 'Experience with Terraform or CloudFormation', 'Scripting skills (Python, Bash)'],
  ARRAY['Competitive salary', 'Remote work', 'Latest tech stack', 'Conference attendance budget'],
  'Austin, TX',
  'full-time',
  'remote',
  'mid',
  110000,
  150000,
  'https://cloudsolutions.com/careers',
  false,
  true,
  NOW() - INTERVAL '4 days'
),
(
  'Data Scientist',
  'Analytics Hub',
  'Use machine learning and data analysis to drive business insights and product improvements.',
  ARRAY['Build predictive models', 'Analyze large datasets', 'Present findings to stakeholders', 'Collaborate with product teams'],
  ARRAY['MS/PhD in Computer Science or related field', 'Strong Python and SQL skills', 'Experience with ML frameworks (TensorFlow, PyTorch)', 'Statistical analysis expertise'],
  ARRAY['Top-tier salary', 'Stock options', 'Flexible work schedule', 'Research time allocation'],
  'Seattle, WA',
  'full-time',
  'hybrid',
  'senior',
  130000,
  180000,
  'https://analyticshub.com/jobs',
  true,
  true,
  NOW() - INTERVAL '1 day'
),
(
  'Content Writer',
  'Media Company',
  'Create engaging content for our blog, social media, and marketing materials.',
  ARRAY['Write blog posts and articles', 'Develop content strategy', 'Edit and proofread content', 'Optimize content for SEO'],
  ARRAY['2+ years of professional writing experience', 'Excellent grammar and writing skills', 'SEO knowledge', 'Ability to write in multiple styles'],
  ARRAY['Remote work', 'Flexible hours', 'Creative freedom', 'Professional development'],
  'Remote',
  'full-time',
  'remote',
  'mid',
  50000,
  70000,
  'https://mediacompany.com/careers',
  false,
  true,
  NOW() - INTERVAL '6 days'
),
(
  'Customer Success Manager',
  'SaaS Startup',
  'Help our customers succeed by providing excellent support and building strong relationships.',
  ARRAY['Onboard new customers', 'Provide product training', 'Resolve customer issues', 'Identify upsell opportunities'],
  ARRAY['2+ years in customer success or account management', 'Excellent communication skills', 'SaaS experience preferred', 'Problem-solving mindset'],
  ARRAY['Base salary + commission', 'Health benefits', 'Career growth opportunities', 'Fun team culture'],
  'Boston, MA',
  'full-time',
  'hybrid',
  'mid',
  60000,
  85000,
  'https://saasstartup.com/jobs',
  false,
  true,
  NOW() - INTERVAL '7 days'
)
ON CONFLICT DO NOTHING;

-- Insert sample blogs
INSERT INTO blogs (title, slug, author, content, excerpt, image_url, is_published, created_at) VALUES
(
  'How to Build an Impressive Developer Portfolio',
  'developer-portfolio-guide',
  'Sarah Johnson',
  'Your portfolio is your professional calling card. In this comprehensive guide, we''ll walk through the essential elements of a standout developer portfolio. First, showcase your best projects with live demos and code repositories. Include detailed case studies explaining your problem-solving approach. Make sure your portfolio is itself well-designed and responsive. Add your technical skills, but focus on depth over breadth. Include testimonials from clients or colleagues if available. Finally, make it easy for potential employers to contact you.',
  'Learn how to create a developer portfolio that gets you noticed by top companies.',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'Remote Work: Best Practices for 2025',
  'remote-work-2025',
  'Michael Chen',
  'Remote work has become the norm for many professionals. Here are the top strategies for staying productive and maintaining work-life balance in 2025. Establish a dedicated workspace, even if it''s just a corner of your room. Stick to a consistent schedule to maintain routine. Use video calls strategically - not every meeting needs to be on camera. Take regular breaks and practice the Pomodoro technique. Communicate proactively with your team. Invest in quality equipment including a good chair, monitor, and noise-canceling headphones. Finally, set clear boundaries between work and personal time.',
  'Essential tips for thriving in a remote work environment.',
  'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&q=80',
  true,
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample career insights
INSERT INTO career_insights (title, slug, content, category, image_url, is_published, created_at) VALUES
(
  'Negotiating Your First Tech Job Offer',
  'first-tech-job-negotiation',
  'Landing your first tech job is exciting, but don''t forget to negotiate! Research salary ranges for your role and location using sites like Glassdoor and Levels.fyi. Consider the entire compensation package, not just base salary - stock options, bonuses, and benefits matter. Wait for the written offer before negotiating. Express enthusiasm for the role, then professionally present your case. Be prepared to justify your ask with market data and your unique value. Don''t be afraid to ask for time to consider the offer. Remember, most companies expect negotiation and have room to move on their initial offer.',
  'Career Development',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  true,
  NOW() - INTERVAL '2 days'
),
(
  'Skills That Will Matter in 2025',
  'future-skills-2025',
  'The tech landscape is constantly evolving. Here are the skills that will be most valuable in 2025 and beyond. AI and machine learning literacy - even if you''re not building models, understanding AI is crucial. Cloud architecture and DevOps skills remain in high demand. Cybersecurity knowledge is essential across all roles. Data analysis and visualization skills help you make data-driven decisions. Soft skills like communication, leadership, and adaptability are more important than ever. Finally, the ability to learn quickly and adapt to new technologies will always be your most valuable skill.',
  'Skills Development',
  'https://images.unsplash.com/photo-1516321318423-f06f70504d90?w=800&q=80',
  true,
  NOW() - INTERVAL '4 days'
)
ON CONFLICT (slug) DO NOTHING;
