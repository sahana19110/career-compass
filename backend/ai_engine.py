import json
import re
import difflib
from database import get_db

CAREER_DOMAIN_DEFINITIONS = {
    "medicine": {
        "keywords": ["doctor", "physician", "surgeon", "mbbs", "medical", "medicine", "clinical medicine",
                     "cardiologist", "neurologist", "pediatrician", "dentist", "bds", "radiologist", "general practitioner"],
        "sector": "Healthcare & Medicine",
        "primary_qualification": "Bachelor of Medicine & Surgery (MBBS) Foundation & Clinical Internship",
        "nsqf_level": 8,
        "duration_months": 66,
        "certifying_body": "National Medical Commission (NMC) / TN MGR Medical University",
        "skills": ["Human Anatomy", "Physiology", "Clinical Diagnostics", "Pharmacology", "Patient Care", "Medical Ethics", "Emergency Triage"],
        "next_job_roles": ["Junior Resident Doctor", "Medical Officer", "Clinical Researcher", "Healthcare Specialist"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Eligibility & Entrance Qualifying",
                "title": "NEET-UG Foundation & Higher Secondary (PCB 50%+)",
                "description": "Master Physics, Chemistry, and Biology (Botany/Zoology) to achieve a competitive score in NEET-UG (benchmark: 600+ for TN Govt Medical Colleges).",
                "duration": "1-2 Years",
                "nsqf_level": 4,
                "type": "National Entrance & Regulatory Eligibility"
            },
            {
                "step": 2,
                "stage": "2. Professional Medical Degree",
                "title": "M.B.B.S. Academic Curriculum (4.5 Years)",
                "description": "Rigorous academic study in Pre-Clinical (Anatomy, Physiology), Para-Clinical (Pathology, Microbiology, Pharmacology), and Clinical disciplines (Medicine, Surgery, OBG, Pediatrics).",
                "duration": "54 Months",
                "nsqf_level": 8,
                "certifying_body": "National Medical Commission (NMC)",
                "type": "Undergraduate Medical Degree"
            },
            {
                "step": 3,
                "stage": "3. Compulsory Rotatory Clinical Internship",
                "title": "CRRI Rotatory Internship (12 Months)",
                "description": "Mandatory hands-on hospital rotations across Casualty/Emergency, General Medicine, Surgery, Community Health Centers, and Labor Rooms.",
                "duration": "12 Months",
                "nsqf_level": 8,
                "certifying_body": "Tamil Nadu Medical Council (TNMC)",
                "type": "Clinical Hospital Residency"
            },
            {
                "step": 4,
                "stage": "4. Licensure, NExT & Medical Specialization",
                "title": "State Medical Council Registration & Post-Graduate (MD/MS)",
                "description": "Obtain permanent registration number from Tamil Nadu Medical Council (TNMC) to practice as a licensed Medical Practitioner, and qualify NExT for MD/MS residency.",
                "duration": "Career Milestone",
                "nsqf_level": 9,
                "certifying_body": "National Board of Examinations / NMC",
                "type": "Professional Licensure & Super-Specialty"
            }
        ],
        "guidance": "In Tamil Nadu, government medical college admissions are conducted through DME single-window counseling based exclusively on NEET-UG scores. Students must have studied Physics, Chemistry, and Biology/Biotechnology in Class 12."
    },

    "software": {
        "keywords": ["software", "developer", "programmer", "coding", "full stack", "fullstack", "frontend",
                     "backend", "web developer", "app developer", "mobile developer", "devops", "software engineer",
                     "computer science", "cse", "it engineer", "coder"],
        "sector": "Software & IT",
        "primary_qualification": "B.E. Computer Science & NSQF Full-Stack Cloud Engineering",
        "nsqf_level": 6,
        "duration_months": 48,
        "certifying_body": "NASSCOM FutureSkills / Anna University",
        "skills": ["Data Structures & Algorithms", "Python", "React.js", "FastAPI", "SQL & Database Design", "Git & CI/CD", "Docker"],
        "next_job_roles": ["Software Engineer", "Full-Stack Developer", "Backend Engineer", "Cloud Solutions Associate"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Foundation & Algorithmic Thinking",
                "title": "Programming Baseline & Data Structures (Python / C++)",
                "description": "Master core computational logic, arrays, trees, hashing, and version control (Git & GitHub).",
                "duration": "2-3 Months",
                "nsqf_level": 5,
                "type": "Foundational Micro-credentials"
            },
            {
                "step": 2,
                "stage": "2. Core Degree / NSQF Qualification",
                "title": "B.E. Computer Science & Engineering / Full-Stack Track",
                "description": "Comprehensive studies in Operating Systems, Database Management Systems, Computer Networks, and Modern Web Architecture (React & FastAPI).",
                "duration": "36-48 Months",
                "nsqf_level": 6,
                "certifying_body": "Anna University / AICTE",
                "type": "Professional Degree / Vocational Specialization"
            },
            {
                "step": 3,
                "stage": "3. Cloud & Systems Architecture",
                "title": "Microservices, Docker Containers & Cloud Deployment",
                "description": "Build high-throughput RESTful microservices, integrate PostgreSQL databases, and deploy onto AWS/GCP with automated CI/CD pipelines.",
                "duration": "4-6 Months",
                "nsqf_level": 6,
                "certifying_body": "NASSCOM / Linux Foundation",
                "type": "Stackable Micro-Credential"
            },
            {
                "step": 4,
                "stage": "4. Industry Internship & Product Engineering",
                "title": "Software Engineering Apprenticeship / Production Capstone",
                "description": "Participate in agile sprints, code reviews, open-source contributions, and secure placements at tech leaders like Zoho, Freshworks, Microsoft, or TCS Digital.",
                "duration": "6 Months",
                "nsqf_level": 7,
                "certifying_body": "Industry Partner / NASSCOM",
                "type": "On-the-Job Training & Placement"
            }
        ],
        "guidance": "In Tamil Nadu, engineering admissions take place via TNEA Single Window Counseling based on 12th Maths, Physics, and Chemistry (out of 200). Premier campuses include CEG, MIT Anna University, and PSG Tech."
    },

    "civil": {
        "keywords": ["civil", "civil engineer", "structural", "construction", "bim", "autocad", "staad",
                     "surveyor", "architect", "architecture", "infrastructure", "urban planner", "building", "bridge"],
        "sector": "Civil & Infrastructure",
        "primary_qualification": "B.E. Civil Infrastructure & NSQF BIM Technology Specialist",
        "nsqf_level": 6,
        "duration_months": 48,
        "certifying_body": "Construction Skill Development Council (CSDCI) / Anna University",
        "skills": ["Building Information Modeling (BIM)", "AutoCAD & Revit", "STAAD.Pro Structural Analysis", "Surveying & GIS", "Concrete Technology", "LEED Green Building"],
        "next_job_roles": ["Site Civil Engineer", "Structural Design Engineer", "BIM Coordinator", "Project Estimation Engineer"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Foundational Engineering & CAD Drafting",
                "title": "Engineering Mechanics & 2D/3D CAD Modeling",
                "description": "Master engineering mathematics, structural statics, building materials, and 2D CAD drafting standards.",
                "duration": "3-6 Months",
                "nsqf_level": 5,
                "type": "Foundational Certification"
            },
            {
                "step": 2,
                "stage": "2. Core Degree / Professional Qualification",
                "title": "B.E. Civil Engineering / Smart Infrastructure",
                "description": "In-depth study of Structural Analysis, Soil Mechanics, Reinforced Concrete Design, Highway Engineering, and Environmental Engineering.",
                "duration": "48 Months",
                "nsqf_level": 6,
                "certifying_body": "Anna University / AICTE",
                "type": "Engineering Degree"
            },
            {
                "step": 3,
                "stage": "3. Advanced BIM & Computational Analysis",
                "title": "Building Information Modeling (Revit) & STAAD.Pro / ETABS",
                "description": "Parametric 3D structural modeling, clash detection, dynamic load simulations, and LEED green building certification standards.",
                "duration": "4-6 Months",
                "nsqf_level": 6,
                "certifying_body": "CSDCI / Autodesk Certified",
                "type": "Specialization Micro-credential"
            },
            {
                "step": 4,
                "stage": "4. On-Site Apprenticeship & PWD / L&T Placement",
                "title": "Site Engineering Apprenticeship & Quality Control",
                "description": "Real-world site supervision, concrete batch inspection, project scheduling (Primavera/MS Project), and placement with top infrastructure firms.",
                "duration": "6 Months",
                "nsqf_level": 7,
                "certifying_body": "Larsen & Toubro / PWD TN",
                "type": "On-the-Job Training (OJT)"
            }
        ],
        "guidance": "Tamil Nadu has massive ongoing infrastructure projects (Chennai Metro Phase 2, Smart Cities Mission). Leading institutions for Civil Engineering include CEG Anna University, PSG Tech, and TCE Madurai."
    },

    "data_science": {
        "keywords": ["data scientist", "data science", "data analyst", "machine learning", "ai engineer",
                     "artificial intelligence", "ml engineer", "business intelligence", "big data", "nlp",
                     "deep learning", "predictive"],
        "sector": "Analytics & AI",
        "primary_qualification": "B.Tech Data Science & NSQF Level 6 Applied AI Specialist",
        "nsqf_level": 6,
        "duration_months": 48,
        "certifying_body": "NASSCOM / MeitY / Anna University",
        "skills": ["Python Data Science", "Pandas & NumPy", "Machine Learning", "Power BI / Tableau", "SQL Analytics", "Deep Learning", "MLOps"],
        "next_job_roles": ["Data Scientist", "Machine Learning Engineer", "BI Lead", "Data Analyst"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Mathematical & Statistical Foundations",
                "title": "Applied Linear Algebra, Probability & Python Analytics",
                "description": "Master statistical hypothesis testing, calculus for optimization, NumPy, and Pandas data wrangling.",
                "duration": "2-3 Months",
                "nsqf_level": 5,
                "type": "Foundational Micro-credential"
            },
            {
                "step": 2,
                "stage": "2. Core Degree / Professional Qualification",
                "title": "B.Tech / B.Sc in Data Science & Machine Learning",
                "description": "Supervised & unsupervised learning, regression, classification, random forests, feature engineering, and relational SQL data warehouses.",
                "duration": "36-48 Months",
                "nsqf_level": 6,
                "certifying_body": "Anna University / NASSCOM",
                "type": "Professional Qualification"
            },
            {
                "step": 3,
                "stage": "3. Advanced Deep Learning & MLOps Pipelines",
                "title": "PyTorch Transformers, NLP & Production MLOps",
                "description": "Build transformer models, implement Retrieval-Augmented Generation (RAG), and deploy scalable model APIs with FastAPI & Docker.",
                "duration": "4-6 Months",
                "nsqf_level": 6,
                "certifying_body": "NASSCOM / CDAC",
                "type": "Specialization Certificate"
            },
            {
                "step": 4,
                "stage": "4. Industry Capstone & Data Labs Placement",
                "title": "Enterprise Analytics Apprenticeship",
                "description": "Deploy end-to-end predictive pipelines on live industry datasets with mentoring from Tiger Analytics, LatentView, Mu Sigma, or Zoho.",
                "duration": "6 Months",
                "nsqf_level": 7,
                "certifying_body": "Industry Analytics Council",
                "type": "On-the-Job Training & Placement"
            }
        ],
        "guidance": "Data Science is one of the highest paying disciplines in Tamil Nadu's tech corridor. Premier courses are offered by CEG, SSN, REC, and Madras Christian College."
    },

    "law": {
        "keywords": ["lawyer", "advocate", "attorney", "legal", "law", "llb", "clat", "judge",
                     "judiciary", "litigation", "corporate law", "bar council", "court", "prosecutor"],
        "sector": "Law & Legal Studies",
        "primary_qualification": "5-Year Integrated B.A. LL.B. & Legal Advocacy Certification",
        "nsqf_level": 7,
        "duration_months": 60,
        "certifying_body": "Bar Council of India (BCI) / TNDALU",
        "skills": ["Constitutional Law", "Criminal & Civil Procedure (BNS)", "Legal Drafting & Conveyancing", "Moot Court Advocacy", "Corporate Compliance", "Arbitration"],
        "next_job_roles": ["Legal Advocate", "Corporate Counsel", "Legal Analyst", "Judicial Services Aspirant"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Legal Aptitude & Entrance Qualification",
                "title": "CLAT / TNDALU Entrance & 12th Board Merit Preparation",
                "description": "Strengthen constitutional awareness, critical comprehension, legal reasoning, and current affairs for law school admission.",
                "duration": "6-12 Months",
                "nsqf_level": 4,
                "type": "Entrance Preparation & Eligibility"
            },
            {
                "step": 2,
                "stage": "2. Professional Integrated Law Degree",
                "title": "5-Year Integrated B.A. LL.B. (Hons) / B.B.A. LL.B.",
                "description": "In-depth education in Constitutional Law, Law of Torts, Contracts, Bharatiya Nyaya Sanhita (BNS), Civil Procedure, and Evidence Law.",
                "duration": "60 Months",
                "nsqf_level": 7,
                "certifying_body": "Bar Council of India / TNDALU",
                "type": "Professional Legal Degree"
            },
            {
                "step": 3,
                "stage": "3. Moot Courts, Legal Aid & Chamber Internships",
                "title": "High Court / District Court Advocate Chamber Practice",
                "description": "Participate in national moot courts, draft legal notices, conduct case law research on SCC Online/Manupatra, and assist senior advocates.",
                "duration": "12-18 Months (Concurrent)",
                "nsqf_level": 7,
                "certifying_body": "State Legal Services Authority",
                "type": "Practical Legal Apprenticeship"
            },
            {
                "step": 4,
                "stage": "4. All India Bar Exam (AIBE) & Bar Council Enrollment",
                "title": "Bar Council of Tamil Nadu & Puducherry Enrollment",
                "description": "Clear the All India Bar Examination (AIBE), obtain the Certificate of Practice (COP), and begin independent advocacy or corporate legal advisory.",
                "duration": "Career Milestone",
                "nsqf_level": 8,
                "certifying_body": "Bar Council of India (BCI)",
                "type": "Professional Licensure"
            }
        ],
        "guidance": "In Tamil Nadu, premier legal education is anchored by The Tamil Nadu Dr. Ambedkar Law University (SOEL) and Government Law Colleges in Chennai, Madurai, and Coimbatore."
    },

    "teaching": {
        "keywords": ["teacher", "teaching", "educator", "professor", "lecturer", "b.ed", "bed",
                     "pedagogy", "school teacher", "tntet", "trb", "faculty", "instructor"],
        "sector": "Education & Teaching",
        "primary_qualification": "Bachelor of Education (B.Ed) & Modern Pedagogy Specialist",
        "nsqf_level": 6,
        "duration_months": 24,
        "certifying_body": "NCTE / Tamil Nadu Teachers Education University (TNTEU)",
        "skills": ["Child Psychology & Pedagogy", "Curriculum Planning", "Smart Classroom EdTech", "Classroom Management", "Inclusive Education", "Educational Assessment"],
        "next_job_roles": ["Graduate Teacher (BT Assistant)", "Post-Graduate Teacher (PG Assistant)", "Curriculum Specialist", "EdTech Pedagogist"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Subject Graduation Mastery",
                "title": "Undergraduate Degree in Subject Area (B.A. / B.Sc / B.Com with 50%+)",
                "description": "Build deep subject mastery in Mathematics, Physics, Chemistry, English, Tamil, or Social Sciences.",
                "duration": "36 Months",
                "nsqf_level": 5,
                "type": "Subject Degree Foundation"
            },
            {
                "step": 2,
                "stage": "2. Professional Teacher Education Degree",
                "title": "Bachelor of Education (B.Ed Program - 2 Years)",
                "description": "Comprehensive pedagogical training: child development, learning theories, educational philosophy, lesson planning, and modern evaluation methods.",
                "duration": "24 Months",
                "nsqf_level": 6,
                "certifying_body": "NCTE / TNTEU",
                "type": "Professional Teaching Degree"
            },
            {
                "step": 3,
                "stage": "3. School Teaching Internship",
                "title": "16-Week Guided School Teaching Practice",
                "description": "Supervised classroom teaching in recognized government or matriculation schools, student mentorship, and continuous comprehensive evaluation.",
                "duration": "4 Months",
                "nsqf_level": 6,
                "certifying_body": "TNTEU Recognized Partner Schools",
                "type": "Classroom Internship"
            },
            {
                "step": 4,
                "stage": "4. Teacher Eligibility Test (TNTET / TRB)",
                "title": "TNTET Paper 1/2 or Teachers Recruitment Board (TRB) Selection",
                "description": "Clear the Tamil Nadu Teacher Eligibility Test (TNTET) or state TRB competitive examination for permanent appointment in government and aided schools.",
                "duration": "Career Milestone",
                "nsqf_level": 7,
                "certifying_body": "Teachers Recruitment Board (TRB) Tamil Nadu",
                "type": "State Teacher Certification"
            }
        ],
        "guidance": "In Tamil Nadu, school teacher recruitment is governed by TRB (Teachers Recruitment Board). Historic colleges like IASE Saidapet and Lady Willingdon provide premier B.Ed programs."
    },

    "ev_automotive": {
        "keywords": ["ev", "electric vehicle", "automotive", "automobile", "battery", "bms", "powertrain", "motor"],
        "sector": "Automotive & Green Energy",
        "primary_qualification": "NSQF Level 6: Electric Vehicle Technology & Battery Management",
        "nsqf_level": 6,
        "duration_months": 12,
        "certifying_body": "Automotive Skills Development Council (ASDC)",
        "skills": ["EV Powertrain", "Battery Diagnostics", "CAN Bus", "Embedded C", "Safety Protocols"],
        "next_job_roles": ["EV System Engineer", "Battery Testing Specialist", "Green Tech Consultant"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Electrical & Electronics Baseline",
                "title": "Power Electronics & Circuit Diagnostics",
                "description": "Strengthen DC-DC converters, motor controls, microcontrollers, and electrical safety standards.",
                "duration": "2 Months",
                "nsqf_level": 5,
                "type": "Foundational Qualification"
            },
            {
                "step": 2,
                "stage": "2. Core NSQF EV Technology Qualification",
                "title": "Electric Vehicle Technology & Battery Management Systems",
                "description": "In-depth study of Lithium-Ion chemistry, cell balancing, thermal runaway prevention, CAN protocol, and motor controllers.",
                "duration": "12 Months",
                "nsqf_level": 6,
                "certifying_body": "ASDC / NCVET",
                "type": "Core Vocational Certification"
            },
            {
                "step": 3,
                "stage": "3. Diagnostics & Embedded Validation",
                "title": "MATLAB Simulink EV Modeling & Hardware-in-the-Loop Testing",
                "description": "Simulate regenerative braking, optimize BMS state-of-charge algorithms, and test charging station interoperability.",
                "duration": "3 Months",
                "nsqf_level": 6,
                "certifying_body": "ASDC",
                "type": "Specialization Micro-credential"
            },
            {
                "step": 4,
                "stage": "4. EV OEM Apprenticeship",
                "title": "Powertrain Integration Apprenticeship (Ather / TVS / Ola)",
                "description": "Hands-on assembly line testing, dyno testing, battery pack validation, and placement in Tamil Nadu's EV corridor (Hosur/Chennai).",
                "duration": "6 Months",
                "nsqf_level": 7,
                "certifying_body": "Automotive OEM Partner",
                "type": "On-the-Job Training & Placement"
            }
        ],
        "guidance": "Tamil Nadu is the EV manufacturing hub of India ('EV Capital'). Major EV clusters are located in Hosur, Sriperumbudur, and Coimbatore."
    },

    "finance_accounting": {
        "keywords": ["accountant", "accounting", "accounts", "tally", "gst", "tax", "taxation", "ca",
                     "chartered accountant", "finance", "banking", "auditing", "bfsi", "commerce"],
        "sector": "BFSI & Accounting",
        "primary_qualification": "Certificate in Junior Accounts Executive & Tally Operations",
        "nsqf_level": 3,
        "duration_months": 6,
        "certifying_body": "BFSI Sector Skill Council",
        "skills": ["Tally Prime", "GST Filing", "Bank Reconciliation", "Excel Financials", "Voucher Entry"],
        "next_job_roles": ["Junior Accountant", "Tally Operator", "Accounts Assistant"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Accounting Baseline & Bookkeeping",
                "title": "Double Entry Bookkeeping & Financial Statements",
                "description": "Master ledger accounts, journal entries, trial balance, and profit & loss statements.",
                "duration": "1-2 Months",
                "nsqf_level": 3,
                "type": "Foundational Certification"
            },
            {
                "step": 2,
                "stage": "2. NSQF Aligned Accounting Qualification",
                "title": "Tally Prime & Goods and Services Tax (GST) Compliance",
                "description": "Voucher entry, inventory management, e-way bill generation, GSTR-1 & GSTR-3B monthly filing on the GST portal.",
                "duration": "6 Months",
                "nsqf_level": 4,
                "certifying_body": "BFSI Sector Skill Council",
                "type": "Core Vocational Certification"
            },
            {
                "step": 3,
                "stage": "3. Advanced Corporate Taxation & Excel Modeling",
                "title": "TDS, Corporate Tax & Financial Modeling with Advanced Excel",
                "description": "TDS calculations, payroll processing, pivot tables, VLOOKUP/XLOOKUP, and cash flow projections.",
                "duration": "3 Months",
                "nsqf_level": 5,
                "certifying_body": "BFSI SSC / ICAI",
                "type": "Specialization Micro-credential"
            },
            {
                "step": 4,
                "stage": "4. Audit Firm Apprenticeship & Placement",
                "title": "Corporate Accounts & Tax Apprenticeship",
                "description": "Work with Chartered Accountant firms, Big 4 (Deloitte/EY/PwC/KPMG), or Zoho Books accounting partners.",
                "duration": "6 Months",
                "nsqf_level": 6,
                "certifying_body": "ICAI / Corporate Partner",
                "type": "On-the-Job Training & Placement"
            }
        ],
        "guidance": "In Tamil Nadu, commerce colleges such as Loyola College, MCC, and Presidency College have top placement rates with national audit and banking corporations."
    },

    "aviation": {
        "keywords": ["pilot", "aviation", "aircraft", "flight", "aerospace", "aeronautical", "commercial pilot", "cpl", "flying", "air hostess", "cabin crew"],
        "sector": "Aviation & Aerospace Operations",
        "primary_qualification": "Commercial Pilot License (CPL) & B.Sc Aviation Operations",
        "nsqf_level": 7,
        "duration_months": 24,
        "certifying_body": "Directorate General of Civil Aviation (DGCA) / Ministry of Civil Aviation",
        "skills": ["Air Navigation", "Aviation Meteorology", "Air Regulations", "Cockpit Resource Management", "Instrument Flying", "Aerodynamics"],
        "next_job_roles": ["Commercial Airline Pilot", "First Officer", "Flight Instructor", "Aviation Safety Officer"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Eligibility & Medical Clearance",
                "title": "12th PCM 50%+ & DGCA Class 2 & Class 1 Medical Clearance",
                "description": "Qualify Higher Secondary with Physics & Mathematics, and clear rigorous DGCA Class 2 and Class 1 medical fitness examinations.",
                "duration": "3-6 Months",
                "nsqf_level": 4,
                "type": "Regulatory Medical Clearance"
            },
            {
                "step": 2,
                "stage": "2. Ground School Theory Examinations",
                "title": "DGCA Ground School Module Examinations",
                "description": "Clear DGCA theoretical written exams in Air Navigation, Aviation Meteorology, Air Regulations, Technical General, and RTR (Aero).",
                "duration": "6-9 Months",
                "nsqf_level": 6,
                "certifying_body": "DGCA India",
                "type": "Aviation Theory Licensure"
            },
            {
                "step": 3,
                "stage": "3. Flight Training Simulator & 200 Flying Hours",
                "title": "Flight Training & Multi-Engine Instrument Rating",
                "description": "Complete 200 hours of certified flying training including solo flights, night cross-country flights, and multi-engine simulator rating at a DGCA approved flying school.",
                "duration": "12-15 Months",
                "nsqf_level": 7,
                "certifying_body": "DGCA Approved Flying Training Organization (FTO)",
                "type": "Practical Flight Training"
            },
            {
                "step": 4,
                "stage": "4. CPL Issuance & Airline Type Rating",
                "title": "Commercial Pilot License (CPL) & Airline Fleet Type Rating (A320/B737)",
                "description": "Receive official DGCA CPL license, complete jet aircraft type rating, and join airlines like IndiGo, Air India, or international carriers as First Officer.",
                "duration": "Career Milestone",
                "nsqf_level": 8,
                "certifying_body": "DGCA / Commercial Airlines",
                "type": "Airline Professional Placement"
            }
        ],
        "guidance": "In India, commercial pilot licensure is administered by the DGCA. Tamil Nadu has historic flight training institutions including the Madras Flying Club."
    },

    "design": {
        "keywords": ["fashion", "fashion designer", "textile", "garment", "interior designer", "graphic designer", "ui/ux", "animator", "animation", "product designer", "creative", "apparel"],
        "sector": "Design, Fashion & Creative Arts",
        "primary_qualification": "Bachelor of Design (B.Des) & Apparel Tech Certification",
        "nsqf_level": 6,
        "duration_months": 48,
        "certifying_body": "National Institute of Fashion Technology (NIFT) / NCVET",
        "skills": ["Fashion Illustration", "Pattern Making", "Textile Science", "CLO 3D CAD", "Design Systems", "Garment Manufacturing"],
        "next_job_roles": ["Fashion Designer", "Apparel Product Developer", "Textile Stylist", "Creative Director"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Creative Aptitude & Foundation",
                "title": "NIFT / NID Entrance Preparation (CAT & GAT)",
                "description": "Master visual spatial reasoning, design aesthetics, sketching fundamentals, and material exploration.",
                "duration": "6-12 Months",
                "nsqf_level": 4,
                "type": "Entrance Preparation & Aptitude"
            },
            {
                "step": 2,
                "stage": "2. Professional Design Degree",
                "title": "Bachelor of Design (B.Des) in Fashion & Textile Technology",
                "description": "Comprehensive 4-year degree in textile science, draping, pattern engineering, garment construction, and fashion forecast analytics.",
                "duration": "48 Months",
                "nsqf_level": 6,
                "certifying_body": "NIFT / Recognized University",
                "type": "Professional Design Degree"
            },
            {
                "step": 3,
                "stage": "3. 3D Digital Fashion & Portfolio Mastery",
                "title": "Digital Apparel 3D Prototyping (CLO 3D & Browzwear)",
                "description": "Build high-end parametric virtual garment models, sustainable fabric simulations, and a signature fashion portfolio.",
                "duration": "4-6 Months",
                "nsqf_level": 6,
                "certifying_body": "Apparel Sector Skill Council (AMHSSC)",
                "type": "Specialization Micro-credential"
            },
            {
                "step": 4,
                "stage": "4. Fashion House & Garment Export Apprenticeship",
                "title": "Industry Apprenticeship in Tamil Nadu Textile Corridor",
                "description": "Work directly with export apparel houses, luxury designers, or international retail brands in Tiruppur, Coimbatore, and Chennai.",
                "duration": "6 Months",
                "nsqf_level": 7,
                "certifying_body": "Fashion & Garment Export Council",
                "type": "On-the-Job Training & Placement"
            }
        ],
        "guidance": "Tamil Nadu is India's leading textile and apparel manufacturing hub ('Knitwear Capital' of Tiruppur). NIFT Chennai is one of the premier design campuses in the country."
    },

    "pharmacy": {
        "keywords": ["pharmacist", "pharmacy", "b.pharm", "drug", "pharmacology", "formulation", "chemist", "medicinal", "clinical trial"],
        "sector": "Pharmaceutical & Healthcare Sciences",
        "primary_qualification": "Bachelor of Pharmacy (B.Pharm) & Drug Regulatory Certification",
        "nsqf_level": 6,
        "duration_months": 48,
        "certifying_body": "Pharmacy Council of India (PCI) / TN MGR Medical University",
        "skills": ["Pharmaceutics", "Medicinal Chemistry", "Pharmacology", "Quality Control (HPLC)", "Drug Regulatory Affairs", "Clinical Trials"],
        "next_job_roles": ["Registered Pharmacist", "Quality Control Analyst", "Drug Regulatory Executive", "Clinical Research Associate"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Higher Secondary Science Foundation",
                "title": "12th Science (PCB / PCM with 50%+)",
                "description": "Build strong scientific grounding in Organic Chemistry, Biology, and Physical Chemistry for pharmaceutical admission.",
                "duration": "12 Months",
                "nsqf_level": 4,
                "type": "Academic Eligibility"
            },
            {
                "step": 2,
                "stage": "2. Professional Pharmacy Degree",
                "title": "Bachelor of Pharmacy (B.Pharm - 4 Years)",
                "description": "In-depth training in Pharmaceutics, Pharmaceutical Biotechnology, Pharmacokinetics, Medicinal Chemistry, and Hospital Pharmacy.",
                "duration": "48 Months",
                "nsqf_level": 6,
                "certifying_body": "Pharmacy Council of India (PCI)",
                "type": "Professional Pharmacy Degree"
            },
            {
                "step": 3,
                "stage": "3. Advanced Formulations & Analytical Instrumentation",
                "title": "HPLC Analysis, GLP & Industrial Drug Formulation",
                "description": "Operate high-performance liquid chromatography, spectroscopy, validation protocols, and WHO-GMP compliance.",
                "duration": "4-6 Months",
                "nsqf_level": 6,
                "certifying_body": "Life Sciences Sector Skill Development Council",
                "type": "Specialization Certification"
            },
            {
                "step": 4,
                "stage": "4. State Pharmacy Council Registration & Industry Placement",
                "title": "Tamil Nadu State Pharmacy Council (TNPC) Licensure & Placement",
                "description": "Obtain registered pharmacist license, work in clinical research, drug discovery, or formulation with top pharma corporations.",
                "duration": "Career Milestone",
                "nsqf_level": 7,
                "certifying_body": "TN State Pharmacy Council",
                "type": "Professional Licensure & Placement"
            }
        ],
        "guidance": "Tamil Nadu is a major drug formulation and healthcare hub. Premier programs are offered by Madras Medical College (College of Pharmacy) and PSG College of Pharmacy."
    },

    "agriculture": {
        "keywords": ["agriculture", "agritech", "farmer", "agronomist", "farming", "horticulture", "soil", "crop", "agricultural engineer", "botany"],
        "sector": "Agriculture & Bio-Systems",
        "primary_qualification": "B.Sc (Hons) Agriculture & Smart Agritech Operations",
        "nsqf_level": 6,
        "duration_months": 48,
        "certifying_body": "Indian Council of Agricultural Research (ICAR) / TNAU",
        "skills": ["Agronomy & Crop Physiology", "Soil Science & Fertility", "Precision Drone Technology", "Organic Pest Management", "Horticulture", "Agri-Business Management"],
        "next_job_roles": ["Agricultural Officer (AO)", "Agritech Consultant", "Farm Management Specialist", "Research Scientist"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Agricultural Science Eligibility",
                "title": "12th Science (PCB / PCM) Qualifying Merit",
                "description": "Achieve strong academic standing in Biology/Mathematics, Physics, and Chemistry for single-window TNAU counseling.",
                "duration": "12 Months",
                "nsqf_level": 4,
                "type": "Higher Secondary Foundation"
            },
            {
                "step": 2,
                "stage": "2. Professional Agricultural Degree",
                "title": "B.Sc (Hons) Agriculture (4 Years)",
                "description": "Comprehensive curriculum in Crop Production, Soil Chemistry, Plant Breeding, Agricultural Economics, Entomology, and Water Management.",
                "duration": "48 Months",
                "nsqf_level": 6,
                "certifying_body": "Tamil Nadu Agricultural University (TNAU) / ICAR",
                "type": "Agricultural Science Degree"
            },
            {
                "step": 3,
                "stage": "3. Precision Agritech & Smart Farming",
                "title": "Agricultural Drone Operations, IoT Sensors & GIS Mapping",
                "description": "Learn drone crop health surveying, automated drip fertigation, multi-spectral imaging, and climate-resilient farming techniques.",
                "duration": "4-6 Months",
                "nsqf_level": 6,
                "certifying_body": "Agriculture Skill Council of India (ASCI)",
                "type": "Smart Agritech Certification"
            },
            {
                "step": 4,
                "stage": "4. Rural Agricultural Work Experience (RAWE) & Placement",
                "title": "RAWE Field Internship & Government / Corporate Placement",
                "description": "Complete intensive village stay, hands-on extension teaching with farmers, and secure recruitment with TN Agricultural Dept, NABARD, or agritech leaders.",
                "duration": "6 Months",
                "nsqf_level": 7,
                "certifying_body": "TNAU / Directorate of Agriculture TN",
                "type": "Field Residency & Placement"
            }
        ],
        "guidance": "Tamil Nadu Agricultural University (TNAU Coimbatore) is one of India's premier agricultural universities. State admissions take place through centralized TNAU counseling."
    },

    "robotics": {
        "keywords": ["robotics", "robot", "mechatronics", "automation", "plc", "scada", "ros", "industrial automation", "kinematics"],
        "sector": "Robotics & Industrial Automation",
        "primary_qualification": "B.E. Robotics & Industrial Automation Systems",
        "nsqf_level": 6,
        "duration_months": 48,
        "certifying_body": "Capital Goods Skill Council / Anna University",
        "skills": ["Robot Operating System (ROS)", "PLC & SCADA Programming", "Microcontrollers & STM32", "Computer Vision OpenCV", "Hydraulics & Pneumatics", "Kinematics"],
        "next_job_roles": ["Robotics Systems Engineer", "Automation Lead", "Mechatronics Specialist", "Embedded Robotics Developer"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Engineering Mathematics & Embedded Logic",
                "title": "C++ Programming, Electronics & Microcontrollers",
                "description": "Master algorithmic logic, circuit design, sensor interfacing, and microcontroller programming (Arduino / STM32).",
                "duration": "3-6 Months",
                "nsqf_level": 5,
                "type": "Foundational Qualification"
            },
            {
                "step": 2,
                "stage": "2. Core Robotics & Mechatronics Degree",
                "title": "B.E. Robotics & Automation / Mechatronics Engineering",
                "description": "Study kinematics, dynamic control systems, industrial drives, PLC programming, and mechanical actuators.",
                "duration": "48 Months",
                "nsqf_level": 6,
                "certifying_body": "Anna University / AICTE",
                "type": "Engineering Degree"
            },
            {
                "step": 3,
                "stage": "3. Advanced ROS & Vision-Guided Robotics",
                "title": "Robot Operating System (ROS2) & Computer Vision (OpenCV)",
                "description": "Build autonomous mobile robots (AMR), simultaneous localization and mapping (SLAM), and AI vision-guided robotic arms.",
                "duration": "4-6 Months",
                "nsqf_level": 6,
                "certifying_body": "Capital Goods Skill Council",
                "type": "Specialization Certification"
            },
            {
                "step": 4,
                "stage": "4. Manufacturing OEM Apprenticeship",
                "title": "Industrial Automation Apprenticeship (Automotive & Electronics)",
                "description": "Deploy automated assembly lines and robotic pick-and-place systems in Tamil Nadu's industrial hubs (Hyundai, Foxconn, TVS Motor, Schneider).",
                "duration": "6 Months",
                "nsqf_level": 7,
                "certifying_body": "Industrial OEM Partner",
                "type": "On-the-Job Training & Placement"
            }
        ],
        "guidance": "Tamil Nadu has a premier concentration of automotive and electronics robotics factories in Sriperumbudur and Coimbatore."
    },

    "psychology": {
        "keywords": ["psychologist", "counselor", "psychology", "mental health", "clinical psychologist", "therapist", "psychiatry", "cognitive"],
        "sector": "Psychology & Behavioral Health",
        "primary_qualification": "B.Sc / M.Sc Clinical Psychology & RCI Licensing",
        "nsqf_level": 7,
        "duration_months": 60,
        "certifying_body": "Rehabilitation Council of India (RCI) / University of Madras",
        "skills": ["Psychological Assessment", "Cognitive Behavioral Therapy (CBT)", "Counseling Techniques", "Developmental Psychology", "Research Methodology", "Mental Health Triage"],
        "next_job_roles": ["Clinical Psychologist", "Child & School Counselor", "Corporate Wellness Consultant", "Behavioral Researcher"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Foundational Psychology & Behavioral Sciences",
                "title": "Higher Secondary Foundation in Psychology / Humanities",
                "description": "Study human behavior fundamentals, biological bases of behavior, and social perception.",
                "duration": "12 Months",
                "nsqf_level": 4,
                "type": "Foundational Eligibility"
            },
            {
                "step": 2,
                "stage": "2. Undergraduate Psychology Degree",
                "title": "B.Sc Psychology (3 Years)",
                "description": "In-depth study of Cognitive Psychology, Abnormal Psychology, Developmental Milestones, and Experimental Psychological Testing.",
                "duration": "36 Months",
                "nsqf_level": 5,
                "certifying_body": "University of Madras / Central Universities",
                "type": "Undergraduate Science Degree"
            },
            {
                "step": 3,
                "stage": "3. Postgraduate Clinical Specialization",
                "title": "M.Sc Applied / Clinical Psychology",
                "description": "Master diagnostic psychopathology, psychometric evaluation, clinical interviewing, and evidence-based psychotherapy.",
                "duration": "24 Months",
                "nsqf_level": 7,
                "certifying_body": "UGC Recognized University",
                "type": "Master of Science Degree"
            },
            {
                "step": 4,
                "stage": "4. RCI M.Phil & Registered Clinical Licensure",
                "title": "M.Phil Clinical Psychology (RCI) & Hospital Residency",
                "description": "Complete 2-year hospital clinical training, obtain RCI registration number, and establish independent clinical practice or hospital consultancy.",
                "duration": "24 Months",
                "nsqf_level": 8,
                "certifying_body": "Rehabilitation Council of India (RCI)",
                "type": "Professional Licensure"
            }
        ],
        "guidance": "In India, practicing as a licensed Clinical Psychologist requires an RCI-recognized M.Phil or Professional Diploma in Clinical Psychology."
    }
}

def detect_domain(target_career: str, skills: list) -> str:
    target_clean = target_career.strip().lower()
    
    # Collect all keywords with their domain, and sort by length descending
    all_kws = []
    for domain_key, data in CAREER_DOMAIN_DEFINITIONS.items():
        for kw in data["keywords"]:
            all_kws.append((kw.lower(), domain_key))
            
    all_kws.sort(key=lambda x: len(x[0]), reverse=True)

    # 1. First priority: Check against target_career directly (whole word regex, longest keyword first)
    for kw, domain_key in all_kws:
        pattern = r'\b' + re.escape(kw) + r'\b'
        if re.search(pattern, target_clean):
            return domain_key

    # 2. Second priority: Check combined target_career + skills
    combined_text = f"{target_clean} {' '.join(skills).lower()}"
    for kw, domain_key in all_kws:
        pattern = r'\b' + re.escape(kw) + r'\b'
        if re.search(pattern, combined_text):
            return domain_key

    # 3. Third priority: Fuzzy token similarity match on target_career
    tokens = re.sub(r'[^\w\s]', ' ', target_clean).split()
    for kw, domain_key in all_kws:
        for t in tokens:
            if len(t) >= 4 and len(kw) >= 4:
                ratio = difflib.SequenceMatcher(None, t, kw).ratio()
                if ratio >= 0.85:
                    return domain_key

    return "custom"

def generate_custom_pathway(target_career: str, education: str, prior_skills: list):
    """
    Dynamically generates a realistic, highly personalized 4-step pathway
    for any custom career not in the predefined ontology (e.g. Fashion Designer, Chef, Pilot, Marine Engineer).
    """
    clean_career = target_career.strip().title()
    skills_list = prior_skills if prior_skills else ["Core Problem Solving", "Analytical Thinking", "Professional Communication"]
    domain_skills = [f"{clean_career} Fundamentals", "Industry Tools & Techniques", "Professional Ethics & Standards", "Project Management", "Digital Collaboration"]

    return {
        "domain": "custom",
        "primary_qualification": f"Professional Diploma & Certification in {clean_career}",
        "sector": f"{clean_career} Industry",
        "nsqf_level": 6,
        "duration_months": 36,
        "certifying_body": f"National Skill Development Corporation (NSDC) / Relevant Sector Skill Council",
        "skills": domain_skills,
        "next_job_roles": [f"Associate {clean_career}", f"{clean_career} Specialist", f"Lead {clean_career}", f"Independent Consultant"],
        "roadmap": [
            {
                "step": 1,
                "stage": "1. Foundational Aptitude & Baseline",
                "title": f"Core Competencies in {clean_career}",
                "description": f"Strengthen entry-level domain literacy, basic terminology, and foundational tools for {clean_career}.",
                "duration": "2-3 Months",
                "nsqf_level": 4,
                "type": "Foundational Preparation"
            },
            {
                "step": 2,
                "stage": "2. Core Degree / Professional Qualification",
                "title": f"Professional Degree / Advanced Certification in {clean_career}",
                "description": f"Comprehensive formal curriculum covering theoretical frameworks, applied workflows, and regulatory standards in {clean_career}.",
                "duration": "24-36 Months",
                "nsqf_level": 6,
                "certifying_body": "NCVET / NSDC / Recognized University",
                "type": "Professional Vocational Qualification"
            },
            {
                "step": 3,
                "stage": "3. Specialized Tooling & Portfolio Mastery",
                "title": f"Specialized Credentials & Practical Portfolio",
                "description": f"Master modern industry software, hands-on techniques, and develop a verified portfolio of real-world projects in {clean_career}.",
                "duration": "4-6 Months",
                "nsqf_level": 6,
                "certifying_body": "Sector Skill Council",
                "type": "Stackable Micro-Credential"
            },
            {
                "step": 4,
                "stage": "4. Industry Apprenticeship & Placement",
                "title": f"Professional Apprenticeship as {clean_career}",
                "description": f"Complete hands-on field experience, work alongside experienced practitioners, and transition into full-time employment.",
                "duration": "6 Months",
                "nsqf_level": 7,
                "certifying_body": "Industry Partner Network",
                "type": "On-the-Job Training & Placement"
            }
        ],
        "guidance": f"Ensure you meet the academic eligibility criteria for {clean_career}. Research verified universities and skill academies recognized by national regulatory bodies."
    }

def recommend_pathway(learner_profile: dict):
    education = learner_profile.get("education", "12th_PCM")
    prior_skills = learner_profile.get("prior_skills", [])
    target_career = learner_profile.get("target_career", "Software Developer").strip()
    location = learner_profile.get("location", "Chennai")
    pace = learner_profile.get("pace", "Standard")

    domain = detect_domain(target_career, prior_skills)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM nsqf_courses")
    all_courses = [dict(r) for r in cursor.fetchall()]
    conn.close()

    # Parse course json fields
    for c in all_courses:
        try:
            c["skills_covered"] = json.loads(c["skills_covered"])
        except Exception:
            c["skills_covered"] = []
        try:
            c["next_job_roles"] = json.loads(c["next_job_roles"])
        except Exception:
            c["next_job_roles"] = []

    if domain in CAREER_DOMAIN_DEFINITIONS:
        domain_info = CAREER_DOMAIN_DEFINITIONS[domain]
        roadmap = domain_info["roadmap"]
        primary_title = domain_info["primary_qualification"]
        primary_sector = domain_info["sector"]
        guidance = domain_info["guidance"]

        # Match relevant courses from the database
        matched_courses = []
        for c in all_courses:
            c_name = c["qualification_name"].lower()
            c_sec = c["sector"].lower()
            
            # Direct qualification name match or partial match
            is_exact_primary = (primary_title.lower() in c_name) or (c_name in primary_title.lower())
            
            # Sector or domain match
            is_sector_match = (primary_sector.lower() in c_sec) or (c_sec in primary_sector.lower()) or (domain in c_sec) or (domain in c_name)
            
            # Keyword match from domain keywords
            kw_matches = sum(1 for kw in domain_info.get("keywords", []) if kw in c_name or kw in c_sec)

            if not (is_exact_primary or is_sector_match or kw_matches > 0):
                continue # Skip courses that belong to completely unrelated domains!

            score = 75.0
            if is_exact_primary:
                score += 20.0
            elif is_sector_match:
                score += 15.0
                
            score += min(kw_matches * 3.0, 6.0)

            # Prior skill overlap bonus
            matched_skills = [s for s in prior_skills if any(s.lower() in ps.lower() for ps in c["skills_covered"])]
            score += min(len(matched_skills) * 2.5, 5.0)

            c_copy = dict(c)
            c_copy["match_score"] = min(round(score, 1), 98.5)
            c_copy["matched_prior_skills"] = matched_skills
            matched_courses.append(c_copy)

        matched_courses.sort(key=lambda x: x["match_score"], reverse=True)

        # If no database courses matched the domain, synthesize the primary qualification
        if not matched_courses:
            matched_courses = [{
                "id": 999,
                "nsqf_level": domain_info["nsqf_level"],
                "qualification_name": domain_info["primary_qualification"],
                "sector": domain_info["sector"],
                "target_stream": education,
                "description": f"Official formal qualification accredited by {domain_info['certifying_body']}.",
                "skills_covered": domain_info["skills"],
                "certifying_body": domain_info["certifying_body"],
                "duration_months": domain_info["duration_months"],
                "next_job_roles": domain_info["next_job_roles"],
                "match_score": 96.0,
                "matched_prior_skills": prior_skills
            }]

        recommended_qualifications = matched_courses[:3]
        stackable_skills = domain_info["skills"]
        
    else:
        # Dynamic custom pathway for user-defined career
        custom_info = generate_custom_pathway(target_career, education, prior_skills)
        roadmap = custom_info["roadmap"]
        primary_title = custom_info["primary_qualification"]
        primary_sector = custom_info["sector"]
        guidance = custom_info["guidance"]
        stackable_skills = custom_info["skills"]

        # Synthetic primary course aligned with user's target career
        custom_primary = {
            "id": 999,
            "nsqf_level": custom_info["nsqf_level"],
            "qualification_name": custom_info["primary_qualification"],
            "sector": custom_info["sector"],
            "target_stream": education,
            "description": f"Specialized curriculum tailored specifically for aspiring {target_career.title()} professionals.",
            "skills_covered": custom_info["skills"],
            "certifying_body": custom_info["certifying_body"],
            "duration_months": custom_info["duration_months"],
            "next_job_roles": custom_info["next_job_roles"],
            "match_score": 95.0,
            "matched_prior_skills": prior_skills
        }
        recommended_qualifications = [custom_primary]

    readiness = min(round(80.0 + len(prior_skills) * 4.5, 1), 97.5)

    return {
        "learner_summary": {
            "education": education,
            "target_career": target_career,
            "domain": domain,
            "sector": primary_sector,
            "location": location,
            "pace": pace,
            "skills_count": len(prior_skills),
            "estimated_readiness": readiness
        },
        "recommended_qualifications": recommended_qualifications,
        "skilling_roadmap": roadmap,
        "stackable_skills": stackable_skills,
        "career_guidance": guidance
    }
