-- Clear all existing jobs and companies, then add new comprehensive data
-- Execute this script in your Supabase SQL Editor

-- Step 1: Delete all existing jobs and companies
DELETE FROM jobs;
DELETE FROM companies;

-- Step 2: Insert new companies with logos and descriptions
INSERT INTO companies (name, logo_url, description, website) VALUES
  (
    'MTN Rwanda',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    'MTN Rwanda is a leading telecommunications company providing mobile voice, data, and digital financial services to millions of Rwandans. Part of the MTN Group, we are committed to delivering innovative solutions and connecting communities across Rwanda.',
    'https://www.mtn.co.rw'
  ),
  (
    'Bank of Kigali',
    'https://bk.rw/wp-content/uploads/2023/01/BK-Logo.png',
    'Bank of Kigali is Rwanda''s largest commercial bank, offering comprehensive banking and financial services. We drive economic growth through innovative products, digital banking solutions, and a commitment to financial inclusion.',
    'https://bk.rw'
  ),
  (
    'Irembo',
    'https://irembo.gov.rw/rolportal/assets/img/logos/logo.png',
    'Irembo is Rwanda''s e-government platform, digitizing public services to make them accessible, efficient, and citizen-centric. We empower millions of citizens to access government services online, contributing to Rwanda''s digital transformation.',
    'https://irembo.gov.rw'
  ),
  (
    'Zipline',
    'https://www.flyzipline.com/wp-content/uploads/2023/01/zipline-logo.svg',
    'Zipline operates the world''s largest autonomous drone delivery network, revolutionizing healthcare logistics in Rwanda and beyond. We deliver critical medical supplies including blood, vaccines, and medications to remote health facilities.',
    'https://www.flyzipline.com'
  ),
  (
    'Rwanda Development Board',
    'https://rdb.rw/wp-content/uploads/2022/12/RDB-Logo.png',
    'The Rwanda Development Board (RDB) is the investment promotion and export development agency of Rwanda. We promote tourism, trade, and investment opportunities while showcasing Rwanda''s potential as a business and tourism destination.',
    'https://www.rdb.rw'
  ),
  (
    'King Faisal Hospital',
    'https://www.kfh.rw/wp-content/uploads/2023/01/kfh-logo.png',
    'King Faisal Hospital Rwanda is a premier tertiary referral hospital providing world-class healthcare services. With state-of-the-art facilities and expert medical professionals, we deliver comprehensive medical care across multiple specialties.',
    'https://www.kfh.rw'
  ),
  (
    'Virunga Lodge',
    'https://volcanoes-safaris.com/wp-content/uploads/2023/01/virunga-lodge-logo.png',
    'Virunga Lodge is a luxury eco-lodge located near Volcanoes National Park, offering breathtaking views and exceptional hospitality. We provide unique experiences for guests visiting Rwanda''s mountain gorillas while supporting conservation and local communities.',
    'https://virungas.com'
  ),
  (
    'BRALIRWA (Skol Brewery)',
    'https://bralirwa.com/wp-content/uploads/2023/01/bralirwa-logo.png',
    'BRALIRWA is Rwanda''s leading beverage company, part of the Heineken Group. We produce and distribute premium beverages including Skol, Primus, and Heineken, while contributing to Rwanda''s economy and supporting local communities.',
    'https://bralirwa.com'
  ),
  (
    'Rwanda Housing Authority',
    'https://rha.gov.rw/wp-content/uploads/2023/01/rha-logo.png',
    'The Rwanda Housing Authority (RHA) leads the development and implementation of housing policies and programs. We facilitate access to affordable housing, promote sustainable urban development, and transform Rwanda''s built environment.',
    'https://rha.gov.rw'
  ),
  (
    'Ministry of Education (MINEDUC)',
    'https://www.mineduc.gov.rw/wp-content/uploads/2023/01/mineduc-logo.png',
    'The Ministry of Education (MINEDUC) oversees Rwanda''s education system from primary to higher learning. We are committed to providing quality, accessible education that empowers Rwandans and drives national development.',
    'https://www.mineduc.gov.rw'
  ),
  (
    'Andela Rwanda',
    'https://andela.com/wp-content/uploads/2023/01/andela-logo.svg',
    'Andela connects companies with talented software developers across Africa. Our Rwanda hub trains and deploys world-class engineers, contributing to Africa''s tech ecosystem and providing global opportunities for local talent.',
    'https://andela.com'
  ),
  (
    'Carnegie Mellon University Africa',
    'https://www.africa.cmu.edu/wp-content/uploads/2023/01/cmu-africa-logo.png',
    'CMU-Africa is a premier graduate institution offering master''s programs in Information Technology, Electrical & Computer Engineering, and Engineering AI. We combine world-class education with African context to develop technology leaders.',
    'https://www.africa.cmu.edu'
  ),
  (
    'Positivo BGH Rwanda',
    'https://positivobgh.rw/wp-content/uploads/2023/01/positivo-logo.png',
    'Positivo BGH Rwanda manufactures laptops, tablets, and smartphones for African markets. Our Kigali factory demonstrates Rwanda''s manufacturing capabilities and contributes to technology accessibility across the continent.',
    'https://positivobgh.rw'
  ),
  (
    'AC Group',
    'https://www.ac-group.rw/wp-content/uploads/2023/01/ac-group-logo.png',
    'AC Group is a leading supplier and distributor of consumer goods, industrial equipment, and technology solutions in Rwanda. We represent global brands and support businesses with quality products and services.',
    'https://www.ac-group.rw'
  ),
  (
    'Radiant Insurance',
    'https://radiant.rw/wp-content/uploads/2023/01/radiant-logo.png',
    'Radiant Insurance offers comprehensive insurance solutions including life, health, motor, and property insurance. We protect individuals and businesses with reliable coverage and exceptional customer service.',
    'https://radiant.rw'
  );

-- Step 3: Insert new jobs with company references, detailed descriptions, and deadlines
-- Get company IDs for foreign key references
DO $$
DECLARE
  mtn_id UUID;
  bk_id UUID;
  irembo_id UUID;
  zipline_id UUID;
  rdb_id UUID;
  kfh_id UUID;
  virunga_id UUID;
  bralirwa_id UUID;
  rha_id UUID;
  mineduc_id UUID;
  andela_id UUID;
  cmu_id UUID;
  positivo_id UUID;
  ac_id UUID;
  radiant_id UUID;
BEGIN
  -- Get company IDs
  SELECT id INTO mtn_id FROM companies WHERE name = 'MTN Rwanda';
  SELECT id INTO bk_id FROM companies WHERE name = 'Bank of Kigali';
  SELECT id INTO irembo_id FROM companies WHERE name = 'Irembo';
  SELECT id INTO zipline_id FROM companies WHERE name = 'Zipline';
  SELECT id INTO rdb_id FROM companies WHERE name = 'Rwanda Development Board';
  SELECT id INTO kfh_id FROM companies WHERE name = 'King Faisal Hospital';
  SELECT id INTO virunga_id FROM companies WHERE name = 'Virunga Lodge';
  SELECT id INTO bralirwa_id FROM companies WHERE name = 'BRALIRWA (Skol Brewery)';
  SELECT id INTO rha_id FROM companies WHERE name = 'Rwanda Housing Authority';
  SELECT id INTO mineduc_id FROM companies WHERE name = 'Ministry of Education (MINEDUC)';
  SELECT id INTO andela_id FROM companies WHERE name = 'Andela Rwanda';
  SELECT id INTO cmu_id FROM companies WHERE name = 'Carnegie Mellon University Africa';
  SELECT id INTO positivo_id FROM companies WHERE name = 'Positivo BGH Rwanda';
  SELECT id INTO ac_id FROM companies WHERE name = 'AC Group';
  SELECT id INTO radiant_id FROM companies WHERE name = 'Radiant Insurance';

  -- Insert jobs
  INSERT INTO jobs (title, company, company_id, company_logo_url, description, location, job_type, location_type, category, application_link, deadline, is_sponsored, views_count, applications_count, created_at) VALUES
  (
    'Senior Software Engineer - Backend',
    'Irembo',
    irembo_id,
    'https://irembo.gov.rw/rolportal/assets/img/logos/logo.png',
    'Join Irembo, Rwanda''s leading e-government platform, as we build technology that serves millions of citizens daily.

Key Responsibilities:
• Design and develop scalable backend systems using Node.js, Python, or Java
• Build and maintain REST and GraphQL APIs
• Optimize database performance and ensure data integrity
• Collaborate with frontend teams to deliver seamless user experiences
• Implement security best practices and ensure system reliability
• Mentor junior developers and participate in code reviews

Requirements:
• Bachelor''s degree in Computer Science or related field
• 5+ years of experience in backend software development
• Strong knowledge of Node.js, Python, or Java
• Experience with PostgreSQL, MongoDB, or similar databases
• Proficiency in cloud platforms (AWS, Azure, or GCP)
• Understanding of microservices architecture
• Excellent problem-solving and communication skills

Benefits:
• Competitive salary (RWF 8M - 15M annually)
• Health insurance for you and your family
• Professional development budget
• Flexible hybrid work arrangement
• Work on impactful projects serving Rwanda',
    'Kigali, Rwanda',
    'full-time',
    'hybrid',
    'Technology',
    'https://irembo.gov.rw/careers',
    NOW() + INTERVAL '45 days',
    true,
    1847,
    142,
    NOW() - INTERVAL '1 day'
  ),
  (
    'Digital Marketing Manager',
    'Zipline',
    zipline_id,
    'https://www.flyzipline.com/wp-content/uploads/2023/01/zipline-logo.svg',
    'Lead digital marketing initiatives for Zipline, the world''s largest autonomous delivery network operating in Rwanda and beyond.

Key Responsibilities:
• Develop and execute comprehensive digital marketing strategies across Africa
• Manage social media channels (LinkedIn, Twitter, Instagram, Facebook)
• Create engaging content including videos, blogs, and infographics
• Analyze campaign performance and optimize ROI
• Collaborate with PR and communications teams
• Lead brand awareness initiatives and community engagement
• Manage marketing budget and vendor relationships

Requirements:
• Bachelor''s degree in Marketing, Communications, or related field
• 5+ years of digital marketing experience, preferably in tech or healthcare
• Proven track record in campaign management and content creation
• Strong analytical skills with experience in Google Analytics, SEMrush, etc.
• Experience with marketing automation tools (HubSpot, Mailchimp)
• Excellent written and verbal communication skills
• Creative mindset with attention to detail

Benefits:
• Competitive salary (RWF 7M - 12M annually)
• Health and dental insurance
• Professional development opportunities
• International travel opportunities
• Stock options',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Marketing',
    'https://www.flyzipline.com/careers',
    NOW() + INTERVAL '30 days',
    true,
    2156,
    189,
    NOW() - INTERVAL '2 days'
  ),
  (
    'Senior Financial Analyst',
    'Bank of Kigali',
    bk_id,
    'https://bk.rw/wp-content/uploads/2023/01/BK-Logo.png',
    'Join Rwanda''s largest commercial bank as a Senior Financial Analyst to drive data-driven business decisions.

Key Responsibilities:
• Analyze financial data and provide insights to senior management
• Develop financial models and forecasts
• Prepare monthly, quarterly, and annual financial reports
• Monitor key performance indicators and identify trends
• Support budgeting and strategic planning processes
• Conduct variance analysis and recommend corrective actions
• Collaborate with cross-functional teams on financial projects

Requirements:
• Bachelor''s degree in Finance, Accounting, Economics, or related field
• CPA or CFA certification preferred
• 4+ years of experience in financial analysis, preferably in banking
• Advanced Excel skills and experience with financial software
• Strong analytical and problem-solving abilities
• Excellent presentation and communication skills
• Knowledge of banking regulations and compliance

Benefits:
• Competitive salary (RWF 6M - 10M annually)
• Performance bonuses
• Comprehensive health insurance
• Pension scheme
• Professional certification support
• Career advancement opportunities',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Finance',
    'https://bk.rw/careers',
    NOW() + INTERVAL '35 days',
    false,
    1523,
    98,
    NOW() - INTERVAL '3 days'
  ),
  (
    'Customer Service Manager',
    'MTN Rwanda',
    mtn_id,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    'Lead customer service operations for Rwanda''s leading telecommunications provider.

Key Responsibilities:
• Manage customer service team of 20+ staff members
• Develop and implement customer service policies and procedures
• Monitor customer satisfaction metrics and implement improvements
• Handle escalated customer complaints and resolve issues
• Train and mentor customer service representatives
• Collaborate with technical and sales teams to enhance customer experience
• Prepare reports on customer service performance

Requirements:
• Bachelor''s degree in Business Administration or related field
• 5+ years of customer service experience, with 2+ years in management
• Strong leadership and team management skills
• Excellent communication and interpersonal abilities
• Experience with CRM systems (Salesforce, Zendesk)
• Problem-solving mindset with customer-first approach
• Fluency in English, French, and Kinyarwanda

Benefits:
• Competitive salary (RWF 5M - 9M annually)
• MTN mobile and data benefits
• Health insurance
• Performance bonuses
• Training and development programs',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Customer Service',
    'https://www.mtn.co.rw/careers',
    NOW() + INTERVAL '25 days',
    false,
    1789,
    134,
    NOW() - INTERVAL '4 days'
  ),
  (
    'Registered Nurse - Emergency Department',
    'King Faisal Hospital',
    kfh_id,
    'https://www.kfh.rw/wp-content/uploads/2023/01/kfh-logo.png',
    'Provide exceptional emergency care at Rwanda''s premier tertiary hospital.

Key Responsibilities:
• Assess and triage patients in emergency situations
• Administer medications and treatments as prescribed
• Monitor patient vital signs and respond to changes
• Collaborate with physicians and healthcare team
• Maintain accurate patient records and documentation
• Educate patients and families on care plans
• Follow infection control protocols and safety procedures

Requirements:
• Bachelor''s degree in Nursing (A0 or A1 level)
• Valid nursing license from Rwanda Medical Council
• 2+ years of emergency nursing experience
• BLS and ACLS certification
• Strong clinical assessment skills
• Ability to work under pressure in fast-paced environment
• Compassionate patient care approach
• Fluency in English and Kinyarwanda

Benefits:
• Competitive salary (RWF 4M - 7M annually)
• Health insurance coverage
• Continuing education opportunities
• Professional development support
• Shift allowances',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Healthcare',
    'https://www.kfh.rw/careers',
    NOW() + INTERVAL '40 days',
    false,
    2034,
    176,
    NOW() - INTERVAL '5 days'
  ),
  (
    'Tourism and Hospitality Manager',
    'Virunga Lodge',
    virunga_id,
    'https://volcanoes-safaris.com/wp-content/uploads/2023/01/virunga-lodge-logo.png',
    'Manage luxury lodge operations near Volcanoes National Park and deliver exceptional guest experiences.

Key Responsibilities:
• Oversee daily lodge operations and staff management
• Ensure exceptional guest service and satisfaction
• Manage reservations, bookings, and guest communications
• Coordinate with tour operators and local partners
• Implement sustainability and conservation initiatives
• Maintain high standards of cleanliness and presentation
• Handle guest feedback and resolve issues promptly
• Manage budgets and financial reporting

Requirements:
• Bachelor''s degree in Hospitality Management, Tourism, or related field
• 5+ years of hospitality management experience
• Strong leadership and team management skills
• Excellent customer service orientation
• Knowledge of eco-tourism and conservation practices
• Budget management and financial acumen
• Fluency in English and French; Kinyarwanda is a plus
• Passion for wildlife and sustainable tourism

Benefits:
• Competitive salary (RWF 6M - 10M annually)
• Accommodation provided
• Meals included
• Travel opportunities
• Work in stunning natural environment',
    'Musanze, Rwanda',
    'full-time',
    'onsite',
    'Hospitality',
    'https://virungas.com/careers',
    NOW() + INTERVAL '30 days',
    false,
    987,
    67,
    NOW() - INTERVAL '6 days'
  ),
  (
    'Mathematics Teacher - Secondary School',
    'Ministry of Education (MINEDUC)',
    mineduc_id,
    'https://www.mineduc.gov.rw/wp-content/uploads/2023/01/mineduc-logo.png',
    'Teach secondary school mathematics and help students prepare for national examinations.

Key Responsibilities:
• Teach mathematics to S4, S5, and S6 students
• Prepare lesson plans and instructional materials
• Assess student progress through tests and assignments
• Provide additional support to struggling students
• Participate in staff meetings and professional development
• Prepare students for national examinations
• Maintain classroom discipline and positive learning environment
• Collaborate with other teachers on curriculum development

Requirements:
• Bachelor''s degree in Mathematics Education or related field
• Valid teaching license from REB
• 2+ years of teaching experience preferred
• Strong knowledge of Rwandan curriculum
• Excellent communication and presentation skills
• Patience and dedication to student success
• Fluency in English and Kinyarwanda
• Computer literacy

Benefits:
• Government salary scale (RWF 3M - 5M annually)
• Job security
• Pension scheme
• School holidays
• Professional development opportunities',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Education',
    'https://www.mineduc.gov.rw/careers',
    NOW() + INTERVAL '50 days',
    false,
    2341,
    203,
    NOW() - INTERVAL '7 days'
  ),
  (
    'Civil Engineer - Infrastructure Projects',
    'Rwanda Housing Authority',
    rha_id,
    'https://rha.gov.rw/wp-content/uploads/2023/01/rha-logo.png',
    'Design and oversee construction projects contributing to Rwanda''s urban development.

Key Responsibilities:
• Design infrastructure and housing projects
• Conduct site inspections and quality assessments
• Review construction plans and specifications
• Ensure compliance with building codes and regulations
• Manage project timelines and budgets
• Coordinate with contractors, architects, and stakeholders
• Prepare technical reports and documentation
• Support urban planning and development initiatives

Requirements:
• Bachelor''s degree in Civil Engineering
• Valid engineering license from IECB
• 3+ years of experience in construction or infrastructure
• Proficiency in AutoCAD, Civil 3D, or similar software
• Knowledge of building codes and standards
• Strong project management skills
• Excellent problem-solving abilities
• Fluency in English and Kinyarwanda

Benefits:
• Competitive salary (RWF 5M - 8M annually)
• Health insurance
• Professional development support
• Pension scheme
• Work on impactful national projects',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Engineering',
    'https://rha.gov.rw/careers',
    NOW() + INTERVAL '35 days',
    false,
    1456,
    87,
    NOW() - INTERVAL '8 days'
  ),
  (
    'Sales Representative - FMCG',
    'BRALIRWA (Skol Brewery)',
    bralirwa_id,
    'https://bralirwa.com/wp-content/uploads/2023/01/bralirwa-logo.png',
    'Drive sales and distribution of premium beverages across Kigali and surrounding areas.

Key Responsibilities:
• Develop and maintain relationships with retailers and distributors
• Achieve monthly and quarterly sales targets
• Conduct market research and competitor analysis
• Implement promotional campaigns and product launches
• Manage inventory and ensure product availability
• Provide excellent customer service and support
• Prepare sales reports and forecasts
• Represent brand at events and activations

Requirements:
• Bachelor''s degree in Business, Marketing, or related field
• 2+ years of sales experience, preferably in FMCG
• Proven track record of meeting sales targets
• Strong negotiation and communication skills
• Valid driver''s license
• Self-motivated and results-oriented
• Knowledge of Kigali market and distribution networks
• Fluency in English, French, and Kinyarwanda

Benefits:
• Competitive salary plus commission (RWF 4M - 7M annually)
• Company vehicle or transport allowance
• Health insurance
• Performance bonuses
• Career growth opportunities',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Sales',
    'https://bralirwa.com/careers',
    NOW() + INTERVAL '20 days',
    false,
    1678,
    123,
    NOW() - INTERVAL '9 days'
  ),
  (
    'Tourism Development Officer',
    'Rwanda Development Board',
    rdb_id,
    'https://rdb.rw/wp-content/uploads/2022/12/RDB-Logo.png',
    'Promote Rwanda as a premier tourism destination and support tourism sector development.

Key Responsibilities:
• Develop tourism promotion strategies and campaigns
• Coordinate with tour operators, hotels, and attractions
• Organize tourism events and trade shows
• Conduct market research on tourism trends
• Support tourism businesses with capacity building
• Promote sustainable and community-based tourism
• Prepare tourism reports and statistics
• Engage with international tourism partners

Requirements:
• Bachelor''s degree in Tourism, Hospitality, Business, or related field
• 3+ years of experience in tourism or hospitality sector
• Knowledge of Rwanda''s tourism attractions and offerings
• Strong communication and networking skills
• Event planning and project management experience
• Marketing and promotion skills
• Fluency in English and French; other languages a plus
• Passion for tourism and Rwanda''s culture

Benefits:
• Competitive salary (RWF 5M - 8M annually)
• Health insurance
• Travel opportunities within and outside Rwanda
• Professional development
• Work on exciting tourism initiatives',
    'Rubavu, Rwanda',
    'full-time',
    'onsite',
    'Tourism',
    'https://www.rdb.rw/careers',
    NOW() + INTERVAL '30 days',
    false,
    1234,
    92,
    NOW() - INTERVAL '10 days'
  ),
  (
    'Full Stack Developer',
    'Andela Rwanda',
    andela_id,
    'https://andela.com/wp-content/uploads/2023/01/andela-logo.svg',
    'Build innovative web applications as part of Andela''s global network of talented developers.

Key Responsibilities:
• Develop full-stack web applications using modern frameworks
• Build responsive user interfaces with React, Vue.js, or Angular
• Design and implement RESTful APIs and backend services
• Write clean, testable, and maintainable code
• Collaborate with distributed teams across time zones
• Participate in agile development processes
• Continuously learn new technologies and best practices

Requirements:
• Bachelor''s degree in Computer Science or related field (or equivalent experience)
• 3+ years of full-stack development experience
• Strong proficiency in JavaScript/TypeScript
• Experience with React, Node.js, and modern web technologies
• Knowledge of databases (PostgreSQL, MongoDB)
• Understanding of Git, CI/CD, and DevOps practices
• Excellent problem-solving and communication skills
• Ability to work independently in remote environment

Benefits:
• Competitive salary (RWF 10M - 18M annually)
• Fully remote work flexibility
• Health insurance
• Learning and development budget
• Work with global clients
• Access to Andela Learning Community',
    'Kigali, Rwanda',
    'full-time',
    'remote',
    'Technology',
    'https://andela.com/careers',
    NOW() + INTERVAL '30 days',
    true,
    2567,
    215,
    NOW() - INTERVAL '2 days'
  ),
  (
    'Graduate Teaching Assistant - Engineering',
    'Carnegie Mellon University Africa',
    cmu_id,
    'https://www.africa.cmu.edu/wp-content/uploads/2023/01/cmu-africa-logo.png',
    'Support graduate education in Engineering AI or Electrical & Computer Engineering at CMU-Africa.

Key Responsibilities:
• Assist professors with course preparation and delivery
• Conduct tutorial sessions and lab demonstrations
• Grade assignments, projects, and examinations
• Provide academic support to graduate students
• Participate in research projects and initiatives
• Contribute to curriculum development
• Support student events and activities

Requirements:
• Master''s degree in Engineering, Computer Science, or related field (or enrolled)
• Strong academic record with relevant coursework
• Teaching or tutoring experience preferred
• Excellent communication and presentation skills
• Proficiency in programming and technical tools
• Passion for education and mentoring
• Fluency in English
• Commitment to academic excellence

Benefits:
• Competitive stipend (RWF 2M - 4M annually)
• Tuition waiver for degree program (if applicable)
• Access to world-class facilities and resources
• Professional development opportunities
• Networking with international faculty',
    'Kigali, Rwanda',
    'part-time',
    'onsite',
    'Education',
    'https://www.africa.cmu.edu/careers',
    NOW() + INTERVAL '45 days',
    false,
    845,
    54,
    NOW() - INTERVAL '5 days'
  ),
  (
    'Production Supervisor - Electronics Manufacturing',
    'Positivo BGH Rwanda',
    positivo_id,
    'https://positivobgh.rw/wp-content/uploads/2023/01/positivo-logo.png',
    'Supervise electronics manufacturing operations at Rwanda''s laptop and tablet factory.

Key Responsibilities:
• Oversee daily production line operations
• Ensure production targets and quality standards are met
• Train and supervise production staff
• Implement quality control procedures
• Monitor equipment maintenance and troubleshooting
• Optimize production processes for efficiency
• Maintain health and safety standards
• Prepare production reports and documentation

Requirements:
• Bachelor''s degree in Engineering, Manufacturing, or related field
• 3+ years of manufacturing supervision experience
• Knowledge of electronics assembly and testing
• Understanding of lean manufacturing and quality systems
• Strong leadership and team management skills
• Problem-solving and analytical abilities
• Computer literacy (MS Office, production software)
• Fluency in English and Kinyarwanda

Benefits:
• Competitive salary (RWF 4M - 7M annually)
• Health insurance
• Transport allowance
• Performance bonuses
• Skills development opportunities',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Manufacturing',
    'https://positivobgh.rw/careers',
    NOW() + INTERVAL '30 days',
    false,
    1123,
    76,
    NOW() - INTERVAL '6 days'
  ),
  (
    'Supply Chain Coordinator',
    'AC Group',
    ac_id,
    'https://www.ac-group.rw/wp-content/uploads/2023/01/ac-group-logo.png',
    'Coordinate supply chain operations for Rwanda''s leading distributor of consumer goods and industrial equipment.

Key Responsibilities:
• Manage inventory levels and stock replenishment
• Coordinate with suppliers and logistics partners
• Process purchase orders and track deliveries
• Optimize warehouse operations and distribution
• Monitor supply chain KPIs and prepare reports
• Resolve supply chain issues and delays
• Maintain supplier relationships
• Support demand forecasting and planning

Requirements:
• Bachelor''s degree in Supply Chain, Logistics, Business, or related field
• 2+ years of supply chain or logistics experience
• Knowledge of inventory management systems
• Strong organizational and analytical skills
• Proficiency in MS Excel and ERP systems
• Excellent communication and negotiation skills
• Attention to detail and problem-solving ability
• Fluency in English and Kinyarwanda

Benefits:
• Competitive salary (RWF 3M - 6M annually)
• Health insurance
• Professional development
• Performance bonuses
• Dynamic work environment',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Logistics',
    'https://www.ac-group.rw/careers',
    NOW() + INTERVAL '25 days',
    false,
    956,
    63,
    NOW() - INTERVAL '7 days'
  ),
  (
    'Insurance Agent - Life & Health',
    'Radiant Insurance',
    radiant_id,
    'https://radiant.rw/wp-content/uploads/2023/01/radiant-logo.png',
    'Sell life and health insurance products and provide excellent customer service to policyholders.

Key Responsibilities:
• Sell life, health, and medical insurance products
• Identify and develop new client relationships
• Assess client insurance needs and recommend solutions
• Process insurance applications and renewals
• Provide ongoing customer service and support
• Handle claims assistance and inquiries
• Meet monthly sales targets
• Participate in training and product knowledge sessions

Requirements:
• Bachelor''s degree in Business, Finance, or related field
• Insurance license or willingness to obtain certification
• 1+ years of sales or customer service experience
• Strong interpersonal and communication skills
• Self-motivated and target-driven
• Knowledge of insurance products (preferred)
• Valid driver''s license
• Fluency in English, French, and Kinyarwanda

Benefits:
• Base salary plus commission (RWF 3M - 8M annually)
• Health insurance coverage
• Transport allowance
• Performance incentives
• Career advancement opportunities
• Comprehensive training program',
    'Kigali, Rwanda',
    'full-time',
    'onsite',
    'Insurance',
    'https://radiant.rw/careers',
    NOW() + INTERVAL '30 days',
    false,
    1389,
    104,
    NOW() - INTERVAL '8 days'
  );
END $$;

-- Step 4: Verify the data
SELECT 'Companies Created:' as message, COUNT(*) as count FROM companies
UNION ALL
SELECT 'Jobs Created:' as message, COUNT(*) as count FROM jobs;

-- Display sample of created companies
SELECT name, LEFT(description, 100) || '...' as description_preview FROM companies LIMIT 5;

-- Display sample of created jobs
SELECT title, company, location, job_type FROM jobs LIMIT 5;
