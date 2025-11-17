-- Clear existing sample jobs and reseed with Rwanda-based jobs

-- Delete old sample jobs (be careful - this will delete ALL jobs)
DELETE FROM jobs;

-- Insert Rwanda-based sample jobs with deadlines, logos, and detailed descriptions
INSERT INTO jobs (title, company, company_logo_url, description, location, job_type, location_type, category, application_link, deadline, is_sponsored, created_at) VALUES
('Software Developer', 'Irembo', 'https://irembo.gov.rw/rolportal/assets/img/logos/logo.png', 
'Join Irembo, Rwanda''s leading e-government platform, as we build technology that serves millions of citizens daily.

Key Responsibilities:
• Develop and maintain web applications using modern frameworks (React, Node.js)
• Collaborate with cross-functional teams to design and implement new features
• Write clean, maintainable, and efficient code
• Participate in code reviews and technical discussions
• Debug and resolve technical issues

Requirements:
• Bachelor''s degree in Computer Science or related field
• 2+ years of experience in software development
• Strong knowledge of JavaScript, TypeScript, and web technologies
• Experience with REST APIs and database systems
• Excellent problem-solving and communication skills

Benefits:
• Competitive salary
• Health insurance
• Professional development opportunities
• Work on impactful projects serving Rwanda', 
'Kigali, Rwanda', 'full-time', 'hybrid', 'technology', 'https://irembo.gov.rw/careers', NOW() + INTERVAL '30 days', false, NOW() - INTERVAL '1 day'),

('Digital Marketing Manager', 'Zipline', 'https://www.flyzipline.com/wp-content/uploads/2023/01/zipline-logo.svg', 
'Lead digital marketing initiatives for Zipline, the world''s largest autonomous delivery network operating in Rwanda and beyond.

Key Responsibilities:
• Develop and execute comprehensive digital marketing strategies
• Manage social media channels and content creation
• Analyze campaign performance and optimize ROI
• Collaborate with PR and communications teams
• Lead brand awareness initiatives across Africa

Requirements:
• Bachelor''s degree in Marketing, Communications, or related field
• 5+ years of digital marketing experience
• Proven track record in campaign management
• Strong analytical and creative skills
• Experience with marketing automation tools

Benefits:
• Competitive compensation package
• International exposure and travel opportunities
• Health and wellness benefits
• Professional growth in innovative tech company', 
'Kigali, Rwanda', 'full-time', 'onsite', 'marketing', 'https://www.flyzipline.com/careers', NOW() + INTERVAL '25 days', false, NOW() - INTERVAL '2 days'),

('Data Analyst', 'Bank of Kigali', 'https://bk.rw/media/images/logo.png', 
'Join Rwanda''s largest commercial bank as a Data Analyst and help drive data-driven decision making.

Key Responsibilities:
• Analyze financial data and generate actionable insights
• Create dashboards and reports for stakeholders
• Identify trends and patterns in customer behavior
• Support business units with data analysis
• Maintain data quality and integrity

Requirements:
• Bachelor''s degree in Statistics, Mathematics, or related field
• 3+ years of experience in data analysis
• Proficiency in SQL, Python, and visualization tools (Tableau/Power BI)
• Strong analytical and problem-solving skills
• Knowledge of banking operations is a plus

Benefits:
• Competitive salary and bonuses
• Comprehensive health insurance
• Retirement savings plan
• Professional certification support', 
'Kigali, Rwanda', 'full-time', 'onsite', 'finance', 'https://bk.rw/careers', NOW() + INTERVAL '20 days', false, NOW() - INTERVAL '2 days'),

('Hotel Manager', 'Virunga Lodge', 'https://via.placeholder.com/200x200/4a5568/ffffff?text=Virunga+Lodge', 
'Manage luxury lodge operations near Volcanoes National Park with breathtaking views of the Virunga Volcanoes.

Key Responsibilities:
• Oversee all lodge operations and guest services
• Manage staff hiring, training, and performance
• Ensure exceptional guest experiences
• Monitor budgets and financial performance
• Coordinate with tour operators and tourism partners

Requirements:
• Bachelor''s degree in Hospitality Management or related field
• 5+ years of hotel/lodge management experience
• Excellent leadership and communication skills
• Knowledge of luxury hospitality standards
• Passion for conservation and sustainable tourism

Benefits:
• Competitive salary
• Accommodation provided
• Work in stunning natural environment
• Career growth opportunities', 
'Musanze, Rwanda', 'full-time', 'onsite', 'management', 'https://virungas.com/careers', NOW() + INTERVAL '15 days', false, NOW() - INTERVAL '3 days'),

('Accountant', 'MTN Rwanda', 'https://www.mtn.co.rw/media/images/mtn-logo.png', 
'Join MTN Rwanda, the country''s leading telecommunications provider, as an Accountant managing financial operations.

Key Responsibilities:
• Prepare and analyze financial statements
• Manage accounts payable and receivable
• Ensure compliance with accounting standards
• Support budget preparation and forecasting
• Conduct financial audits and reconciliations

Requirements:
• Bachelor''s degree in Accounting or Finance
• CPA certification preferred
• 3+ years of accounting experience
• Proficiency in accounting software (SAP, QuickBooks)
• Strong attention to detail and accuracy

Benefits:
• Competitive salary and performance bonuses
• Health insurance for employee and family
• Mobile and data allowances
• Professional development programs', 
'Kigali, Rwanda', 'full-time', 'onsite', 'finance', 'https://www.mtn.co.rw/careers', NOW() + INTERVAL '28 days', true, NOW() - INTERVAL '3 days'),

('Nurse', 'King Faisal Hospital', 'https://via.placeholder.com/200x200/dc2626/ffffff?text=KFH', 
'Provide quality healthcare services at King Faisal Hospital, one of Rwanda''s premier referral hospitals.

Key Responsibilities:
• Provide direct patient care and nursing services
• Administer medications and treatments
• Monitor patient vital signs and conditions
• Collaborate with doctors and medical staff
• Maintain accurate medical records

Requirements:
• Bachelor''s degree in Nursing (A0 or A1 level)
• Valid nursing license from Rwanda Medical Council
• 2+ years of clinical experience
• Strong clinical and interpersonal skills
• Ability to work in fast-paced environment

Benefits:
• Competitive salary
• Medical insurance
• Continuing education opportunities
• Modern working environment', 
'Kigali, Rwanda', 'full-time', 'onsite', 'healthcare', 'https://www.kfh.rw/careers', NOW() + INTERVAL '35 days', false, NOW() - INTERVAL '4 days'),

('Tour Guide', 'Rwanda Development Board', 'https://www.rdb.rw/media/images/rdb-logo.png', 
'Lead tourism initiatives as a Tour Guide with Rwanda Development Board and showcase Rwanda''s beauty to international visitors.

Key Responsibilities:
• Guide tourists through Rwanda''s attractions
• Share knowledge of Rwandan culture, history, and wildlife
• Ensure tourist safety and satisfaction
• Coordinate with hotels and transport providers
• Promote sustainable tourism practices

Requirements:
• Diploma or Bachelor''s degree in Tourism or related field
• Tour guide license from RDB
• Fluency in English and French (Kinyarwanda required)
• Excellent communication and interpersonal skills
• Knowledge of Rwanda''s history, culture, and attractions

Benefits:
• Attractive compensation
• Travel opportunities
• Professional development
• Work with international tourists', 
'Rubavu, Rwanda', 'contract', 'onsite', 'other', 'https://www.rdb.rw/careers', NOW() + INTERVAL '22 days', false, NOW() - INTERVAL '4 days'),

('Mathematics Teacher', 'Lycée de Kigali', 'https://via.placeholder.com/200x200/059669/ffffff?text=LDK', 
'Teach secondary school mathematics at Lycée de Kigali and help students prepare for national examinations.

Key Responsibilities:
• Teach mathematics to secondary school students
• Prepare lesson plans and teaching materials
• Assess student progress and provide feedback
• Prepare students for national examinations
• Participate in school activities and meetings

Requirements:
• Bachelor''s degree in Mathematics or Education
• Teaching license from REB
• 2+ years of teaching experience
• Strong subject knowledge and teaching skills
• Passion for education and student development

Benefits:
• Government salary scale
• School holidays
• Professional development opportunities
• Pension scheme', 
'Kigali, Rwanda', 'full-time', 'onsite', 'education', 'https://www.mineduc.gov.rw/careers', NOW() + INTERVAL '18 days', false, NOW() - INTERVAL '5 days'),

('Civil Engineer', 'Rwanda Housing Authority', 'https://via.placeholder.com/200x200/7c3aed/ffffff?text=RHA', 
'Design and oversee construction projects contributing to Rwanda''s urban development and affordable housing initiatives.

Key Responsibilities:
• Design civil engineering projects (roads, housing, infrastructure)
• Oversee construction site activities
• Review technical drawings and specifications
• Ensure compliance with building codes and standards
• Manage project budgets and timelines

Requirements:
• Bachelor''s degree in Civil Engineering
• Professional engineering license
• 4+ years of experience in construction/infrastructure
• Proficiency in AutoCAD and engineering software
• Strong project management skills

Benefits:
• Competitive salary
• Health insurance
• Transportation allowance
• Work on nation-building projects', 
'Kigali, Rwanda', 'full-time', 'onsite', 'engineering', 'https://rha.gov.rw/careers', NOW() + INTERVAL '40 days', false, NOW() - INTERVAL '6 days'),

('Sales Representative', 'Skol Brewery', 'https://via.placeholder.com/200x200/eab308/ffffff?text=SKOL', 
'Drive sales and distribution of beverages for Bralirwa (part of Heineken Group) across Kigali and surrounding areas.

Key Responsibilities:
• Achieve sales targets and grow market share
• Build relationships with distributors and retailers
• Conduct market research and competitor analysis
• Execute promotional campaigns
• Maintain accurate sales records and reports

Requirements:
• Bachelor''s degree in Business, Marketing, or related field
• 2+ years of sales experience (FMCG preferred)
• Valid driver''s license
• Excellent negotiation and communication skills
• Self-motivated and results-oriented

Benefits:
• Base salary plus commission
• Company vehicle or transport allowance
• Health insurance
• Performance bonuses', 
'Kigali, Rwanda', 'full-time', 'onsite', 'sales', 'https://bralirwa.com/careers', NOW() + INTERVAL '21 days', false, NOW() - INTERVAL '7 days'),

('IT Support Specialist', 'Rwanda ICT Chamber', 'https://via.placeholder.com/200x200/0891b2/ffffff?text=ICT+Chamber', 
'Provide technical support for member organizations of Rwanda ICT Chamber and help grow Rwanda''s technology sector.

Key Responsibilities:
• Provide technical support to chamber members
• Troubleshoot hardware and software issues
• Install and configure computer systems
• Maintain network infrastructure
• Train users on technology tools

Requirements:
• Bachelor''s degree in IT or related field
• 2+ years of IT support experience
• Strong knowledge of Windows/Linux systems
• Experience with networking and security
• Excellent problem-solving and customer service skills

Benefits:
• Competitive salary
• Health insurance
• Professional certifications support
• Networking opportunities in tech sector', 
'Kigali, Rwanda', 'full-time', 'onsite', 'technology', 'https://www.ictchamber.rw/careers', NOW() + INTERVAL '27 days', false, NOW() - INTERVAL '8 days'),

('Restaurant Manager', 'Heaven Restaurant', 'https://via.placeholder.com/200x200/ec4899/ffffff?text=Heaven', 
'Manage operations of Heaven Restaurant, one of Kigali''s most popular dining destinations known for excellent food and social impact.

Key Responsibilities:
• Oversee daily restaurant operations
• Manage staff scheduling, training, and performance
• Ensure food quality and customer satisfaction
• Control costs and inventory
• Implement health and safety standards

Requirements:
• Diploma or degree in Hospitality Management
• 3+ years of restaurant management experience
• Strong leadership and organizational skills
• Knowledge of food safety regulations
• Customer service excellence

Benefits:
• Competitive salary
• Staff meals
• Tips and bonuses
• Work in socially conscious business', 
'Kigali, Rwanda', 'full-time', 'onsite', 'management', 'https://heavenrwanda.com/careers', NOW() + INTERVAL '19 days', false, NOW() - INTERVAL '9 days'),

('Receptionist', 'Kigali Marriott Hotel', 'https://via.placeholder.com/200x200/991b1b/ffffff?text=Marriott', 
'Welcome guests at Kigali Marriott Hotel and provide exceptional customer service in a 5-star environment.

Key Responsibilities:
• Welcome guests and manage check-in/check-out
• Handle reservations and guest inquiries
• Process payments and maintain records
• Coordinate with other departments
• Resolve guest concerns professionally

Requirements:
• Diploma in Hospitality or related field
• 1+ years of front desk experience
• Excellent communication skills (English, French, Kinyarwanda)
• Professional appearance and demeanor
• Computer literacy (hotel management systems)

Benefits:
• Competitive salary
• Health insurance
• Staff meals and uniform
• International training opportunities', 
'Kigali, Rwanda', 'full-time', 'onsite', 'customer-service', 'https://www.marriott.com/careers', NOW() + INTERVAL '24 days', false, NOW() - INTERVAL '10 days'),

('Agricultural Extension Officer', 'Ministry of Agriculture', 'https://via.placeholder.com/200x200/65a30d/ffffff?text=MINAGRI', 
'Support smallholder farmers with modern farming techniques and contribute to Rwanda''s agricultural transformation.

Key Responsibilities:
• Provide technical advice to farmers
• Demonstrate modern farming techniques
• Organize farmer training sessions
• Monitor crop performance and issues
• Distribute agricultural inputs

Requirements:
• Bachelor''s degree in Agriculture or related field
• 2+ years of field experience
• Knowledge of modern farming practices
• Fluency in Kinyarwanda (English is a plus)
• Ability to work in rural areas and travel

Benefits:
• Government salary
• Transport and field allowances
• Health insurance
• Pension benefits', 
'Huye, Rwanda', 'full-time', 'onsite', 'other', 'https://www.minagri.gov.rw/careers', NOW() + INTERVAL '32 days', false, NOW() - INTERVAL '11 days'),

('Graphic Designer', 'Inkomoko', 'https://via.placeholder.com/200x200/f97316/ffffff?text=Inkomoko', 
'Create impactful visual content for Inkomoko, a social enterprise supporting refugee entrepreneurs across East Africa.

Key Responsibilities:
• Design marketing materials, social media graphics, and brand assets
• Create visual content for campaigns and programs
• Collaborate with marketing and program teams
• Maintain brand consistency across platforms
• Produce videos and multimedia content

Requirements:
• Bachelor''s degree in Graphic Design or related field
• 3+ years of design experience
• Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)
• Video editing skills (Premiere Pro, After Effects)
• Strong portfolio demonstrating creative work

Benefits:
• Competitive salary
• Flexible work arrangements
• Work with purpose-driven organization
• International team collaboration', 
'Kigali, Rwanda', 'contract', 'hybrid', 'technology', 'https://inkomoko.com/careers', NOW() + INTERVAL '26 days', false, NOW() - INTERVAL '12 days'),

('Project Manager', 'Rwanda Biomedical Center', 'https://via.placeholder.com/200x200/be123c/ffffff?text=RBC', 
'Manage public health programs at Rwanda Biomedical Center and coordinate with international health partners.

Key Responsibilities:
• Manage public health projects and programs
• Coordinate with stakeholders and partners
• Monitor project implementation and budgets
• Prepare reports and presentations
• Ensure compliance with regulations and guidelines

Requirements:
• Master''s degree in Public Health or related field
• 5+ years of project management experience
• Strong understanding of health systems
• Excellent communication and coordination skills
• Experience with donor-funded projects

Benefits:
• Competitive salary
• Health insurance
• Professional development opportunities
• Work on impactful health programs', 
'Kigali, Rwanda', 'full-time', 'onsite', 'management', 'https://rbc.gov.rw/careers', NOW() + INTERVAL '38 days', false, NOW() - INTERVAL '13 days'),

('Customer Service Agent', 'RwandAir', 'https://via.placeholder.com/200x200/1e40af/ffffff?text=RwandAir', 
'Provide excellent customer service at RwandAir, Rwanda''s national carrier, connecting Rwanda to the world.

Key Responsibilities:
• Assist passengers at check-in and boarding
• Handle ticket reservations and changes
• Resolve customer inquiries and complaints
• Process baggage and maintain records
• Ensure compliance with aviation regulations

Requirements:
• Diploma or Bachelor''s degree in any field
• 1+ years of customer service experience
• Excellent communication skills (English, French, Kinyarwanda)
• Professional appearance and attitude
• Ability to work shifts including weekends

Benefits:
• Competitive salary
• Flight benefits for employee and family
• Health insurance
• Uniform provided', 
'Kigali, Rwanda', 'full-time', 'onsite', 'customer-service', 'https://www.rwandair.com/careers', NOW() + INTERVAL '16 days', false, NOW() - INTERVAL '14 days'),

('Business Analyst', 'Andela Rwanda', 'https://andela.com/wp-content/uploads/2023/05/andela-logo.svg', 
'Join Andela Rwanda as a Business Analyst and help bridge the gap between technology and business needs.

Key Responsibilities:
• Gather and analyze business requirements
• Create functional specifications and user stories
• Facilitate communication between stakeholders and dev teams
• Conduct data analysis and create reports
• Support UAT and project implementation

Requirements:
• Bachelor''s degree in Business, IT, or related field
• 3+ years of business analysis experience
• Strong analytical and problem-solving skills
• Experience with Agile methodologies
• Proficiency in documentation and analysis tools

Benefits:
• Competitive salary
• Health insurance
• Flexible hybrid work
• Learning and development budget
• Global tech community access', 
'Kigali, Rwanda', 'full-time', 'hybrid', 'technology', 'https://andela.com/careers', NOW() + INTERVAL '33 days', false, NOW() - INTERVAL '15 days'),

-- Add some expired jobs to test filtering
('Expired Position - Software Engineer', 'Tech Company', 'https://via.placeholder.com/200x200/6b7280/ffffff?text=Tech+Co', 'This position has expired for testing purposes.', 'Kigali, Rwanda', 'full-time', 'remote', 'technology', 'https://example.com', NOW() - INTERVAL '5 days', false, NOW() - INTERVAL '60 days'),
('Expired Position - Marketing Lead', 'Marketing Firm', 'https://via.placeholder.com/200x200/6b7280/ffffff?text=Marketing', 'This position has expired for testing purposes.', 'Kigali, Rwanda', 'full-time', 'onsite', 'marketing', 'https://example.com', NOW() - INTERVAL '10 days', false, NOW() - INTERVAL '70 days');
