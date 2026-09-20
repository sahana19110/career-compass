import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "career_compass.db")

ALL_TN_DISTRICTS = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
    "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
]

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Drop existing tables to refresh with full dataset
    cursor.execute("DROP TABLE IF EXISTS nsqf_courses")
    cursor.execute("DROP TABLE IF EXISTS colleges")
    cursor.execute("DROP TABLE IF EXISTS scholarships")
    cursor.execute("DROP TABLE IF EXISTS labor_market_trends")

    # Create Tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS nsqf_courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nsqf_level INTEGER NOT NULL,
        qualification_name TEXT NOT NULL,
        sector TEXT NOT NULL,
        target_stream TEXT NOT NULL,
        description TEXT,
        skills_covered TEXT,
        certifying_body TEXT,
        duration_months INTEGER,
        next_job_roles TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS colleges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        district TEXT NOT NULL,
        location TEXT NOT NULL,
        state TEXT NOT NULL,
        type TEXT NOT NULL,
        stream_type TEXT NOT NULL,
        nsqf_aligned BOOLEAN DEFAULT 1,
        courses_offered TEXT,
        cutoff_marks TEXT,
        fees_per_year TEXT,
        website TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scholarships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        offered_by TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        amount_per_year TEXT NOT NULL,
        deadline TEXT,
        application_url TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS labor_market_trends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        demand_score INTEGER NOT NULL,
        domain TEXT NOT NULL,
        growth_rate TEXT NOT NULL,
        top_skills TEXT NOT NULL,
        avg_entry_salary TEXT NOT NULL,
        avg_mid_salary TEXT NOT NULL,
        hiring_companies TEXT
    )
    """)

    seed_data(cursor)
    conn.commit()
    conn.close()

def seed_data(cursor):
    # 1. Multi-Sector NSQF Courses Seed
    nsqf_courses_data = [
        # BFSI & Accounting
        (3, "Certificate in Junior Accounts Executive & Tally Operations", "BFSI & Accounting", "10th",
         "Practical foundation in double-entry bookkeeping, Tally Prime, GST registration, and Excel accounting spreadsheets.",
         json.dumps(["Tally Prime", "Bookkeeping Basics", "GST Filing", "Excel Accounting", "Voucher Entry"]),
         "BFSI Sector Skill Council / NCVET", 6, json.dumps(["Junior Accounts Assistant", "Tally Data Operator", "Billing Executive"])),

        (4, "Certificate in Commercial Accounting, Taxation & Audit Support", "BFSI & Accounting", "10th",
         "Comprehensive course covering direct & indirect taxes, TDS calculation, bank reconciliation, and corporate payroll.",
         json.dumps(["Corporate Taxation", "TDS Compliance", "Bank Reconciliation", "Payroll Management", "Financial Statements"]),
         "ICA Edu Skills / NCVET", 6, json.dumps(["Accounts Executive", "Taxation Assistant", "Audit Support Executive"])),

        (5, "NSQF Level 5: Diploma in Banking, Financial Services & Tally Analytics", "BFSI & Finance", "12th_Commerce",
         "Advanced diploma in commercial banking, credit analysis, financial modeling in Excel, and GST portal management.",
         json.dumps(["Financial Modeling", "GST Portal Operations", "Credit Risk Analysis", "MIS Reporting", "Auditing Basics"]),
         "BFSI Sector Skill Council", 12, json.dumps(["Assistant Accountant", "Banking Operations Officer", "Financial Data Analyst"])),

        (6, "NSQF Level 6: Advanced Executive Certificate in Corporate Finance & Chartered Auditing", "BFSI & Finance", "UG",
         "Specialized certification in corporate finance management, SAP FICO basics, internal auditing, and equity analysis.",
         json.dumps(["SAP FICO", "Corporate Finance", "Internal Audit", "IFRS Standards", "Equity Research"]),
         "ICAI / NASSCOM", 12, json.dumps(["Senior Accountant", "Corporate Financial Analyst", "Internal Auditor"])),

        # IT & Software
        (3, "Certificate in Junior Software Developer & Web Basics", "IT/ITeS", "10th",
         "Foundation course covering HTML5, CSS3, JavaScript basics, and computer fundamentals.",
         json.dumps(["HTML/CSS", "JavaScript Basics", "Git Commands", "Computer Hardware"]),
         "NASSCOM / NCVET", 6, json.dumps(["Junior Frontend Assistant", "Web Design Intern", "Technical Support Executive"])),

        (4, "Certificate in Python & Data Entry Operations", "IT/ITeS", "10th",
         "Practical programming in Python, data automation, spreadsheet analysis, and office tools.",
         json.dumps(["Python Programming", "Excel Data Analysis", "Database Querying", "Office Automation"]),
         "NIELIT / NCVET", 6, json.dumps(["Data Associate", "Junior Python Developer", "Lab Technician"])),

        (5, "NSQF Level 5: Full Stack Web Development & Cloud Applications", "IT/ITeS", "12th_PCM",
         "Comprehensive web development covering modern JavaScript frameworks, FastAPI backends, and cloud deployment.",
         json.dumps(["React.js", "FastAPI", "PostgreSQL/Supabase", "REST APIs", "Git/GitHub"]),
         "NASSCOM FutureSkills Prime", 6, json.dumps(["Full Stack Web Developer", "Backend Developer", "Frontend Engineer"])),

        (6, "NSQF Level 6: Advanced Artificial Intelligence & Machine Learning Specialist", "AI & Emerging Tech", "12th_PCM",
         "In-depth training in machine learning models, natural language processing, neural networks, and model deployment.",
         json.dumps(["Python ML", "TensorFlow/PyTorch", "NLP & Transformers", "Data Pipeline Engineering", "FastAPI ML Services"]),
         "NASSCOM / CDAC", 12, json.dumps(["AI/ML Engineer", "Data Scientist", "NLP Specialist", "AI Solutions Consultant"])),

        # Digital Marketing
        (4, "Certificate in Digital Marketing & Social Media Operations", "Media & Business", "10th",
         "Practical training in SEO, Google Ads, Meta Ad Manager, content strategy, and website analytics.",
         json.dumps(["SEO Basics", "Google Ads", "Social Media Marketing", "Canva Design", "Google Analytics"]),
         "MEPSC / NCVET", 6, json.dumps(["Digital Marketing Assistant", "Social Media Executive", "SEO Associate"])),

        # Healthcare
        (4, "Certificate in General Duty Medical Assistant & Pharmacy Operations", "Healthcare", "10th",
         "Basic nursing assistance, patient care, vital monitoring, medical inventory, and pharmacy billing.",
         json.dumps(["Patient Care", "Vital Monitoring", "Pharmacy Billing", "First Aid", "Medical Terminology"]),
         "Healthcare Sector Skill Council (HSSC)", 6, json.dumps(["Medical Assistant", "Pharmacy Executive", "Lab Support Staff"])),

        # EV Tech
        (6, "NSQF Level 6: Electric Vehicle Technology & Battery Management", "Automotive & Green Energy", "12th_PCM",
         "Specialized diploma covering EV powertrains, battery thermal management, BMS diagnostics, and solar charging.",
         json.dumps(["EV Powertrain", "Battery Diagnostics", "CAN Bus", "Embedded C", "Safety Protocols"]),
         "Automotive Skills Development Council (ASDC)", 12, json.dumps(["EV System Engineer", "Battery Testing Specialist", "Green Tech Consultant"]))
    ]

    cursor.executemany("""
    INSERT INTO nsqf_courses (nsqf_level, qualification_name, sector, target_stream, description, skills_covered, certifying_body, duration_months, next_job_roles)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, nsqf_courses_data)

    # 2. Comprehensive Seed Data covering Top & Average Cutoff Institutions across Tamil Nadu
    colleges_data = [
        # CHENNAI & TIRUVALLUR & KANCHIPURAM (High, Medium & Moderate Cutoff Spectrum)
        ("Prince Shri Venkateshwara Padmavathy Engineering College", "Chennai", "Ponmar, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science & Engg", "B.Tech Information Technology", "B.E. ECE", "B.E. Cyber Security"]),
         json.dumps({"OC": 145.0, "BC": 135.0, "MBC": 125.0, "SC/ST": 110.0}), "₹85,000 / year", "https://psvpec.in"),

        ("Central Polytechnic College", "Chennai", "Taramani, Chennai", "Tamil Nadu", "Polytechnic", "Polytechnic", 1,
         json.dumps(["Diploma in Computer Engineering", "Diploma in Electrical & Electronics", "Diploma in Mechanical"]),
         json.dumps({"OC": 88.0, "BC": 82.0, "MBC": 78.0, "SC/ST": 65.0}), "₹2,500 / year", "https://cpttaramani.in"),

        ("Sri Sairam Institute of Technology", "Kanchipuram", "West Tambaram, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech AI & Data Science", "B.E. Mechanical"]),
         json.dumps({"OC": 168.0, "BC": 158.0, "MBC": 145.0, "SC/ST": 125.0}), "₹95,000 / year", "https://sairamgroup.in"),

        ("St. Joseph's Institute of Technology", "Chennai", "OMR, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech Information Tech", "B.E. EEE"]),
         json.dumps({"OC": 165.0, "BC": 152.0, "MBC": 140.0, "SC/ST": 120.0}), "₹95,000 / year", "https://stjosephstechnology.ac.in"),

        ("Dhanalakshmi Srinivasan College of Engineering", "Chennai", "Manimangalam, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech Cyber Security", "B.E. Biomedical"]),
         json.dumps({"OC": 142.0, "BC": 132.0, "MBC": 120.0, "SC/ST": 105.0}), "₹75,000 / year", "https://dsce.ac.in"),

        ("Rajalakshmi Institute of Technology (RIT)", "Tiruvallur", "Kuthambakkam, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech AI & ML", "B.E. Mechanical"]),
         json.dumps({"OC": 172.0, "BC": 162.0, "MBC": 150.0, "SC/ST": 128.0}), "₹98,000 / year", "https://ritchennai.org"),

        ("Rajalakshmi Engineering College (REC)", "Tiruvallur", "Thandalam, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech Artificial Intelligence & Data Science", "B.Tech Cyber Security", "B.E. ECE"]),
         json.dumps({"OC": 191.0, "BC": 185.5, "MBC": 178.0, "SC/ST": 155.0}), "₹1,15,000 / year", "https://rajalakshmi.org"),

        ("Sri Venkateswara College of Engineering (SVCE)", "Kanchipuram", "Sriperumbudur, Kanchipuram", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science & Engg", "B.Tech Information Technology", "B.E. Chemical", "B.E. ECE"]),
         json.dumps({"OC": 192.5, "BC": 187.0, "MBC": 180.0, "SC/ST": 158.0}), "₹1,20,000 / year", "https://svce.ac.in"),

        ("Sri Sairam Engineering College", "Kanchipuram", "West Tambaram, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech AI & Data Science", "B.E. EEE", "B.Tech Mechanical"]),
         json.dumps({"OC": 188.0, "BC": 181.5, "MBC": 173.0, "SC/ST": 148.0}), "₹1,10,000 / year", "https://sairam.edu.in"),

        ("Panimalar Engineering College", "Tiruvallur", "Poonamallee, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech IT", "B.E. Artificial Intelligence", "B.E. ECE"]),
         json.dumps({"OC": 186.5, "BC": 179.0, "MBC": 170.0, "SC/ST": 145.0}), "₹1,05,000 / year", "https://panimalar.ac.in"),

        ("Easwari Engineering College (SRM Group)", "Chennai", "Ramapuram, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech Cyber Security", "B.E. ECE", "B.Tech Information Tech"]),
         json.dumps({"OC": 189.5, "BC": 183.0, "MBC": 175.0, "SC/ST": 150.0}), "₹1,15,000 / year", "https://srmeaswari.ac.in"),

        ("Saveetha Engineering College", "Tiruvallur", "Thandalam, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech AI & ML", "B.E. Biomedical", "B.E. Mechanical"]),
         json.dumps({"OC": 184.0, "BC": 176.0, "MBC": 166.0, "SC/ST": 140.0}), "₹1,00,000 / year", "https://saveetha.ac.in"),

        ("College of Engineering Guindy (CEG), Anna University", "Chennai", "Guindy, Chennai", "Tamil Nadu", "Government Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.E. Artificial Intelligence & Data Science", "B.Tech IT", "B.E. ECE"]),
         json.dumps({"OC": 198.5, "BC": 196.0, "MBC": 194.0, "SC/ST": 182.5}), "₹25,000 / year", "https://ceg.annauniv.edu"),

        ("Madras Institute of Technology (MIT Campus)", "Chennai", "Chromepet, Chennai", "Tamil Nadu", "Government Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Technology", "B.E. Aeronautical Engineering", "B.E. Robotics & Automation"]),
         json.dumps({"OC": 196.0, "BC": 193.5, "MBC": 190.0, "SC/ST": 178.0}), "₹25,000 / year", "https://mitindia.edu"),

        ("Loyola College", "Chennai", "Nungambakkam, Chennai", "Tamil Nadu", "Autonomous", "Commerce/Arts", 1,
         json.dumps(["B.Com General", "B.Com Accounting & Taxation", "B.A. Economics", "BBA Business Analytics"]),
         json.dumps({"OC": 97.5, "BC": 94.5, "MBC": 91.0, "SC/ST": 85.0}), "₹40,000 / year", "https://loyolacollege.edu"),

        ("Madras Christian College (MCC)", "Chennai", "Tambaram, Chennai", "Tamil Nadu", "Autonomous", "Commerce/Arts", 1,
         json.dumps(["B.Com Accounting & Finance", "B.Com Corporate Secretaryship", "BBA", "B.Sc Data Science"]),
         json.dumps({"OC": 96.5, "BC": 93.0, "MBC": 89.0, "SC/ST": 82.0}), "₹35,000 / year", "https://mcc.edu.in"),

        ("SSN College of Engineering", "Chennai", "Kalavakkam, Chennai", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science & Engg", "B.Tech IT", "B.E. Biomedical Engineering"]),
         json.dumps({"OC": 194.0, "BC": 191.0, "MBC": 186.0, "SC/ST": 168.0}), "₹1,25,000 / year", "https://ssn.edu.in"),

        # COIMBATORE
        ("Government Polytechnic College (Coimbatore)", "Coimbatore", "Aerodrome Post, Coimbatore", "Tamil Nadu", "Polytechnic", "Polytechnic", 1,
         json.dumps(["Diploma in Automobile Engineering", "Diploma in Computer Tech", "Diploma in ECE"]),
         json.dumps({"OC": 85.0, "BC": 80.0, "MBC": 75.0, "SC/ST": 62.0}), "₹2,200 / year", "https://gptccbe.ac.in"),

        ("Hindusthan College of Engineering and Technology", "Coimbatore", "Othakalmandapam, Coimbatore", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech Aeronautical", "B.E. EEE"]),
         json.dumps({"OC": 162.0, "BC": 148.0, "MBC": 135.0, "SC/ST": 115.0}), "₹80,000 / year", "https://hindusthan.ac.in"),

        ("PSG College of Technology", "Coimbatore", "Peelamedu, Coimbatore", "Tamil Nadu", "Government Aided", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech Information Technology", "B.E. Robotics", "B.E. ECE"]),
         json.dumps({"OC": 197.0, "BC": 194.5, "MBC": 191.0, "SC/ST": 175.0}), "₹45,000 / year", "https://psgtech.edu"),

        ("Sri Krishna College of Engineering and Technology (SKCET)", "Coimbatore", "Kuniamuthur, Coimbatore", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech M.Tech Integrated CS", "B.E. Mechatronics"]),
         json.dumps({"OC": 190.0, "BC": 184.0, "MBC": 176.0, "SC/ST": 152.0}), "₹1,05,000 / year", "https://skcet.ac.in"),

        ("Coimbatore Institute of Technology (CIT)", "Coimbatore", "Civil Aerodrome, Coimbatore", "Tamil Nadu", "Government Aided", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.E. Mechanical Engineering", "B.Tech Artificial Intelligence"]),
         json.dumps({"OC": 194.5, "BC": 191.0, "MBC": 187.0, "SC/ST": 169.0}), "₹30,000 / year", "https://cit.edu.in"),

        # TRICHY & MADURAI & TIRUNELVELI
        ("Saranathan College of Engineering", "Tiruchirappalli", "Panjappur, Trichy", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech AI & Data Science", "B.E. Mechanical"]),
         json.dumps({"OC": 160.0, "BC": 145.0, "MBC": 132.0, "SC/ST": 110.0}), "₹75,000 / year", "https://saranathan.ac.in"),

        ("Francis Xavier Engineering College", "Tirunelveli", "Vannarpettai, Tirunelveli", "Tamil Nadu", "Private Autonomous", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.Tech AI & ML", "B.E. Cyber Security"]),
         json.dumps({"OC": 155.0, "BC": 140.0, "MBC": 128.0, "SC/ST": 105.0}), "₹70,000 / year", "https://francisxavier.ac.in"),

        ("Thiagarajar College of Engineering (TCE)", "Madurai", "Thiruparankundram, Madurai", "Tamil Nadu", "Government Aided", "Engineering", 1,
         json.dumps(["B.E. Computer Science", "B.E. ECE", "B.Tech Data Science", "B.E. Civil"]),
         json.dumps({"OC": 193.0, "BC": 189.5, "MBC": 184.0, "SC/ST": 165.0}), "₹32,000 / year", "https://tce.edu"),

        ("National Institute of Technology (NIT Trichy)", "Tiruchirappalli", "Thuvakudi, Trichy", "Tamil Nadu", "Institute of National Importance", "Engineering", 1,
         json.dumps(["B.Tech Computer Science", "B.Tech Electrical & Electronics", "B.Tech Metallurgical"]),
         json.dumps({"JEE Main Rank": "< 4500", "State Quota Percentile": "99.2%"}), "₹1,45,000 / year", "https://nitt.edu")
    ]

    # Generate Fallback Government & Autonomous Colleges for ALL 38 districts with 130-140 Cutoff Benchmarks
    existing_districts = set(c[1] for c in colleges_data)
    for dist in ALL_TN_DISTRICTS:
        if dist not in existing_districts:
            colleges_data.append((
                f"Government Engineering & Polytechnic College, {dist}",
                dist,
                f"Main Campus, {dist}",
                "Tamil Nadu",
                "Government",
                "Engineering",
                1,
                json.dumps(["B.E. Computer Science", "B.E. Electronics & Comm", "Diploma in Computer Tech", "B.Com Accounting"]),
                json.dumps({"OC": 150.0, "BC": 135.0, "MBC": 125.0, "SC/ST": 105.0}),
                "₹18,000 / year",
                f"https://tn.gov.in/highereducation/{dist.lower()}"
            ))

    cursor.executemany("""
    INSERT INTO colleges (name, district, location, state, type, stream_type, nsqf_aligned, courses_offered, cutoff_marks, fees_per_year, website)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, colleges_data)

    # 3. Scholarships Seed
    scholarships_data = [
        ("Tamil Nadu First Graduate Scholarship", "Government of Tamil Nadu",
         "Students pursuing professional courses who are the first in their family to graduate.",
         "100% Tuition Fee Waiver (Up to ₹50,000/year)", "During Single Window Admission", "https://tneaonline.org"),

        ("Pudhumai Penn Scheme (Moovalur Ramamirtham Ammaiyar)", "Department of Higher Education, Govt of Tamil Nadu",
         "Female students who studied 6th to 12th grade in Tamil Nadu Government Schools pursuing Degree/Diploma/ITIC.",
         "₹1,000 per month (₹12,000/year directly to bank account)", "31st October", "https://penkalvi.tn.gov.in"),

        ("Tamizh Pudhalvan Scheme for Boys", "Government of Tamil Nadu",
         "Male students who studied 6th to 12th grade in Tamil Nadu Government Schools pursuing Higher Education.",
         "₹1,000 per month (₹12,000/year stipend)", "31st October", "https://tn.gov.in"),

        ("TN 7.5% Special Reservation Financial Assistance", "Government of Tamil Nadu",
         "Students admitted under the 7.5% quota for TN Government School students into professional colleges.",
         "100% Tuition, Hostel, Mess & Transport Fee Covered", "During Admission", "https://tneaonline.org"),

        ("Post-Matric Scholarship Scheme for SC/ST/SCC", "Ministry of Social Justice & Empowerment / TN Govt",
         "SC/ST/Converted Christian SC candidates with annual family income < ₹2.5 Lakh pursuing Higher Secondary, Diploma, Degree, or PG.",
         "100% Maintenance Allowance + Full Tuition Fee Waiver", "30th November", "https://scholarships.gov.in"),

        ("BC / MBC / DNC Post-Matric Scholarship", "Backward Classes & Minorities Welfare Dept, TN",
         "BC/MBC/DNC students pursuing diploma or degree programs with family income < ₹2.5 Lakh/annum.",
         "Full Tuition Fee Reimbursement + Special Stipend", "30th November", "https://bcmbcw.tn.gov.in"),

        ("AICTE Pragati Scholarship for Girl Students", "Ministry of Education / AICTE",
         "Female students admitted to 1st year Degree/Diploma programs with annual family income < ₹8 Lakh.",
         "₹50,000 per annum (College Fees + Contingency)", "31st October", "https://scholarships.gov.in"),

        ("Reliance Foundation Undergraduate Scholarship", "Reliance Foundation",
         "Students enrolled in 1st year full-time UG degree with annual family income < ₹15 Lakh.",
         "Up to ₹2,00,000 over the duration of degree", "31st October", "https://scholarships.reliancefoundation.org")
    ]

    cursor.executemany("""
    INSERT INTO scholarships (title, offered_by, eligibility, amount_per_year, deadline, application_url)
    VALUES (?, ?, ?, ?, ?, ?)
    """, scholarships_data)

    # 4. Labor Market Trends Seed
    trends_data = [
        (94, "Accounting, Tally & Corporate Finance", "+26% YoY",
         json.dumps(["Tally Prime", "GST Compliance", "Excel Financial Modeling", "Corporate Tax", "Payroll Management"]),
         "₹3.2 - ₹5.5 LPA", "₹7.5 - ₹15.0 LPA", json.dumps(["Deloitte", "EY", "PwC", "KPMG", "Zoho Books"])),

        (96, "Artificial Intelligence & ML", "+34% YoY",
         json.dumps(["Python", "TensorFlow", "FastAPI", "Data Modeling", "Prompt Engineering"]),
         "₹4.5 - ₹7.5 LPA", "₹12.0 - ₹24.0 LPA", json.dumps(["TCS", "Zoho", "Cognizant", "Microsoft", "Freshworks"])),

        (92, "Full Stack Web & Cloud Development", "+28% YoY",
         json.dumps(["React.js", "FastAPI", "PostgreSQL", "Docker", "AWS"]),
         "₹3.8 - ₹6.5 LPA", "₹9.0 - ₹18.0 LPA", json.dumps(["Accenture", "Wipro", "Infosys", "PayPal", "LTI Mindtree"])),

        (88, "Cyber Security & Network Defense", "+30% YoY",
         json.dumps(["Network Security", "Ethical Hacking", "SIEM Tools", "Linux Admin"]),
         "₹4.0 - ₹6.8 LPA", "₹10.0 - ₹20.0 LPA", json.dumps(["Cisco", "PwC", "Deloitte", "Trend Micro", "HCL Tech"]))
    ]

    cursor.executemany("""
    INSERT INTO labor_market_trends (demand_score, domain, growth_rate, top_skills, avg_entry_salary, avg_mid_salary, hiring_companies)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, trends_data)

if __name__ == "__main__":
    init_db()
    print("Database populated with moderate & high cutoff spectrum colleges covering cutoffs 70-198!")
