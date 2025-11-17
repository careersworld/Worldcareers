-- Insert sample admin user (you'll manage auth separately)
-- This is just reference data for the admin section

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE jobs, blogs, career_insights RESTART IDENTITY CASCADE;

-- Insert sample jobs for Rwanda (using ON CONFLICT to avoid duplicates)
INSERT INTO jobs (title, company, description, location, job_type, location_type, application_link, is_sponsored, created_at) VALUES
('Software Developer', 'Irembo', 'Build and maintain Rwanda''s leading e-government platform. Work with modern web technologies to serve millions of citizens.', 'Kigali, Rwanda', 'full-time', 'hybrid', 'https://irembo.gov.rw/careers', false, NOW() - INTERVAL '1 day'),
('Digital Marketing Manager', 'Zipline', 'Lead digital marketing campaigns for our innovative drone delivery service across Rwanda and Africa.', 'Kigali, Rwanda', 'full-time', 'onsite', 'https://www.flyzipline.com/careers', false, NOW() - INTERVAL '2 days'),
('Data Analyst', 'Bank of Kigali', 'Analyze financial data and provide insights to drive business decisions. Work with modern analytics tools.', 'Kigali, Rwanda', 'full-time', 'onsite', 'https://bk.rw/careers', false, NOW() - INTERVAL '2 days'),
('Hotel Manager', 'Virunga Lodge', 'Manage luxury lodge operations near Volcanoes National Park. Lead staff and ensure exceptional guest experiences.', 'Musanze, Rwanda', 'full-time', 'onsite', 'https://virungas.com/careers', false, NOW() - INTERVAL '3 days'),
('Accountant', 'MTN Rwanda', 'Manage financial records and reporting for Rwanda''s leading telecommunications provider.', 'Kigali, Rwanda', 'full-time', 'onsite', 'https://www.mtn.co.rw/careers', true, NOW() - INTERVAL '3 days'),
('Nurse', 'King Faisal Hospital', 'Provide quality healthcare services in one of Rwanda''s premier medical facilities.', 'Kigali, Rwanda', 'full-time', 'onsite', 'https://www.kfh.rw/careers', false, NOW() - INTERVAL '4 days'),
('Tour Guide', 'Rwanda Development Board', 'Lead tourism initiatives and guide international visitors through Rwanda''s attractions and culture.', 'Rubavu, Rwanda', 'contract', 'onsite', 'https://www.rdb.rw/careers', false, NOW() - INTERVAL '4 days'),
('Teacher - Mathematics', 'Lycée de Kigali', 'Teach secondary school mathematics. Help students prepare for national examinations.', 'Kigali, Rwanda', 'full-time', 'onsite', 'https://www.mineduc.gov.rw/careers', false, NOW() - INTERVAL '5 days'),
('Civil Engineer', 'Rwanda Housing Authority', 'Design and oversee construction projects contributing to Rwanda''s urban development.', 'Kigali, Rwanda', 'full-time', 'onsite', 'https://rha.gov.rw/careers', false, NOW() - INTERVAL '6 days'),
('Sales Representative', 'Skol Brewery', 'Drive sales and distribution of beverages across Kigali and surrounding areas.', 'Kigali, Rwanda', 'full-time', 'onsite', 'https://bralirwa.com/careers', false, NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- Insert sample career insights (using ON CONFLICT to avoid duplicates)
INSERT INTO career_insights (title, slug, content, category, image_url, created_at) VALUES
('10 Skills Every Tech Professional Should Have in 2025', '10-skills-tech-2025', 'In this comprehensive guide, we explore the top 10 skills that will define the tech industry in 2025. From AI and machine learning to soft skills, discover what employers are looking for.', 'Technology', 'https://images.unsplash.com/photo-1516321318423-f06f70504d90?w=800&q=80', NOW()),
('Remote Work Best Practices for Distributed Teams', 'remote-work-best-practices', 'Discover the strategies and tools that successful remote teams use to stay connected and productive. Learn about communication, time zones, and culture building.', 'Work Culture', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', NOW() - INTERVAL '7 days'),
('Career Transitions: How to Switch Careers Successfully', 'career-transitions-guide', 'Making a career change can be daunting. Learn proven strategies for assessing your skills, identifying new opportunities, and making a smooth transition.', 'Career Growth', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', NOW() - INTERVAL '14 days'),
('Negotiating Your Tech Salary: A Complete Guide', 'negotiating-tech-salary', 'Don''t leave money on the table. Learn how to research market rates, prepare for negotiations, and advocate for yourself.', 'Salary & Compensation', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', NOW() - INTERVAL '21 days'),
('Building Your Personal Brand as a Developer', 'personal-brand-developer', 'Your personal brand matters more than ever. Explore how to build your presence on social media, create a portfolio, and establish yourself as a thought leader.', 'Personal Branding', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', NOW() - INTERVAL '28 days')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blogs (using ON CONFLICT to avoid duplicates)
INSERT INTO blogs (title, slug, author, content, excerpt, image_url, created_at) VALUES
('The Future of AI in Recruitment', 'future-ai-recruitment', 'Sarah Chen', 'Artificial intelligence is transforming how companies recruit talent. From resume screening to predictive analytics, AI is making hiring more efficient and equitable.', 'Discover how AI is revolutionizing the recruitment process and what it means for job seekers.', 'https://images.unsplash.com/photo-1677442d019cecf8e1556a63fee518c55a8b50060?w=800&q=80', NOW()),
('Why Job Hopping is the New Career Strategy', 'job-hopping-strategy', 'Marcus Johnson', 'The old advice to stay at one company for 20 years is outdated. Learn why strategic job changes can accelerate your career growth and increase your earning potential.', 'Strategic career moves can lead to faster growth and better compensation.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', NOW() - INTERVAL '3 days'),
('Imposter Syndrome in Tech: How to Overcome It', 'imposter-syndrome-tech', 'Emma Rodriguez', 'Feeling like a fraud in your tech role? You''re not alone. Explore practical strategies to overcome imposter syndrome and build genuine confidence.', 'Learn how to recognize and overcome imposter syndrome in your tech career.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', NOW() - INTERVAL '7 days'),
('The Best Remote Work Tools for 2025', 'remote-work-tools-2025', 'Alex Kim', 'Technology enables remote work. Discover the essential tools and platforms that remote teams use to collaborate effectively.', 'A curated guide to the best tools for remote teams.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', NOW() - INTERVAL '10 days'),
('Building a Strong Engineering Culture', 'engineering-culture', 'Lisa Wang', 'Company culture starts with engineering leadership. Learn how to foster innovation, collaboration, and continuous learning in your engineering team.', 'Creating a culture of excellence and innovation in engineering teams.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', NOW() - INTERVAL '14 days')
ON CONFLICT (slug) DO NOTHING;
