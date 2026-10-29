from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict
import re
import difflib
from ai_engine import detect_domain

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # 'en', 'ta', 'hi'
    user_name: Optional[str] = None
    education: Optional[str] = None
    target_career: Optional[str] = None
    skills: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = []

GREETING_WORDS = [
    "hi", "hy", "hey", "hai", "hello", "helo", "hlo", 
    "vanakkam", "good morning", "good afternoon", "good evening"
]

def collapse_repeated_chars(text: str) -> str:
    return re.sub(r'(.)\1+', r'\1', text)

def normalize_text(text: str) -> str:
    text_clean = re.sub(r'[^\w\s]', '', text.lower()).strip()
    words = text_clean.split()
    collapsed_words = [collapse_repeated_chars(w) for w in words]
    return " ".join(collapsed_words)

NORMALIZED_GREETINGS = [normalize_text(g) for g in GREETING_WORDS]

def is_greeting(msg: str) -> bool:
    words_orig = re.sub(r'[^\w\s]', '', msg).strip().split()
    if not (1 <= len(words_orig) <= 3):
        return False

    norm_msg = normalize_text(msg)
    if norm_msg in NORMALIZED_GREETINGS:
        return True

    norm_words = norm_msg.split()
    for g in NORMALIZED_GREETINGS:
        if norm_msg == g:
            return True
        if len(norm_msg) >= 4 and difflib.SequenceMatcher(None, norm_msg, g).ratio() >= 0.75:
            return True
        for w in norm_words:
            if w == g:
                return True
            if len(w) >= 3 and len(g) >= 3 and difflib.SequenceMatcher(None, w, g).ratio() >= 0.8:
                return True

    return False

def contains_whole_word(text: str, target: str) -> bool:
    pattern = r'\b' + re.escape(target) + r'\b'
    return bool(re.search(pattern, text, re.IGNORECASE))

def extract_and_calculate_cutoff(msg: str):
    msg_lower = msg.lower()

    maths_match = re.search(r'(?:maths?|mat|m)\s*[:=\-]?\s*(\d{1,3}(?:\.\d+)?)', msg_lower)
    phys_match = re.search(r'(?:physics?|phys|phy|p)\s*[:=\-]?\s*(\d{1,3}(?:\.\d+)?)', msg_lower)
    chem_match = re.search(r'(?:chemistry?|chem|che|c)\s*[:=\-]?\s*(\d{1,3}(?:\.\d+)?)', msg_lower)

    m, p, c = None, None, None

    if maths_match and phys_match and chem_match:
        m = float(maths_match.group(1))
        p = float(phys_match.group(1))
        c = float(chem_match.group(1))
    else:
        numbers = [float(n) for n in re.findall(r'\b\d{1,3}(?:\.\d+)?\b', msg_lower)]
        valid_marks = [num for num in numbers if 0 <= num <= 100]
        if len(valid_marks) >= 3:
            m, p, c = valid_marks[0], valid_marks[1], valid_marks[2]

    if m is not None and p is not None and c is not None:
        if m <= 100 and p <= 100 and c <= 100:
            phys_half = p / 2.0
            chem_half = c / 2.0
            cutoff = m + phys_half + chem_half
            return {
                "calculated": True,
                "maths": m,
                "physics": p,
                "chemistry": c,
                "phys_half": phys_half,
                "chem_half": chem_half,
                "cutoff": round(cutoff, 2)
            }
    return {"calculated": False}

KNOWLEDGE_BASE = {
    "10th": (
        "After 10th grade, you can choose:\n\n"
        "• Higher Secondary (11th/12th PCM, PCB, Commerce, Arts)\n"
        "• 3-Year Polytechnic Diploma (Computer, ECE, Mech, Civil)\n"
        "• NSQF Level 3 & 4 Vocational Skill Certifications."
    ),
    "12th": (
        "After 12th grade options across streams:\n\n"
        "• 🧬 PCB / Biology: MBBS (via NEET-UG), BDS, Pharmacy, Allied Health Sciences, Nursing\n"
        "• ⚡ PCM / Maths: B.E./B.Tech (CSE, AI/ML, Civil, ECE) via TNEA, or B.Sc Data Science\n"
        "• ⚖️ Commerce / Arts: 5-Year Integrated B.A./B.B.A. LL.B. Law, B.Com, BBA, Chartered Accountancy (CA)\n"
        "• 🎓 Vocational / Skilling: NSQF Level 5-6 Advanced Industry Certifications."
    ),
    "cutoff": (
        "Tamil Nadu (TNEA) cutoffs are calculated out of 200 (Maths 100 + Physics 50 + Chemistry 50).\n\n"
        "• Top colleges like CEG, MIT, PSG require 190+ cutoffs for CS/AI branches.\n"
        "• Medical admissions (MBBS/BDS) are based exclusively on NEET-UG scores (out of 720), where top TN Govt medical colleges require 630+.\n\n"
        "*(Note: Cutoffs are approximate, change every year based on merit, and vary by community category).*"
    ),
    "nsqf": (
        "NSQF (National Skills Qualifications Framework) organizes qualifications from Level 1 to Level 10:\n\n"
        "• Level 3-4: Foundational Certificates (10th pass)\n"
        "• Level 5-6: Advanced Industry Diplomas & Specialist Certifications\n"
        "• Level 7-10: Professional Degrees, Master Credentials & Applied Research\n\n"
        "It provides stackable micro-credentials and seamless credit transfer across institutions."
    ),
    "scholarship": (
        "Key scholarships available in Tamil Nadu:\n\n"
        "• 🌸 Pudhumai Penn Scheme (₹1,000/month for TN Govt school girls)\n"
        "• 👦 Tamizh Pudhalvan Scheme (₹1,000/month for TN Govt school boys)\n"
        "• 🎓 TN First Graduate Scholarship (Full tuition fee waiver for first degree in family)\n"
        "• 🏥 TN 7.5% Special Quota Financial Assistance (100% fees for Govt school students in Medical/Engg)\n"
        "• 👩‍💻 AICTE Pragati Scholarship for Girls (₹50,000/year)\n"
        "• 📜 Post-Matric SC/ST/SCC Scholarship (Full tuition & maintenance allowance)\n"
        "• 🏛️ BC / MBC / DNC Post-Matric Scholarship (Full tuition reimbursement)"
    ),
    "job": (
        "Top high-demand career domains right now:\n\n"
        "• 🩺 Clinical Medicine & Healthcare (+24% growth, high stability)\n"
        "• 🤖 Artificial Intelligence & Machine Learning (+34% YoY)\n"
        "• 💻 Full-Stack Web & Cloud Development (+28%)\n"
        "• 📊 Data Science & Big Data Analytics (+32%)\n"
        "• ⚡ EV Powertrain & Green Energy (+42%)\n"
        "• 🏗️ Civil Infrastructure & BIM Smart Cities (+22%)\n"
        "• ⚖️ Corporate Law & Regulatory Compliance (+20%)."
    )
}

TAMIL_RESPONSES = {
    "10th": (
        "10-ஆம் வகுப்பிற்குப் பிறகு நீங்கள் தேர்வு செய்யக்கூடிய வாய்ப்புகள்:\n\n"
        "• 11/12-ஆம் வகுப்பு (அறிவியல், கணிதம், வணிகவியல்)\n"
        "• 3 ஆண்டு பாலிடெக்னிக் டிப்ளமோ (கம்ப்யூட்டர், சிவில், மெக்கானிக்கல்)\n"
        "• NSQF தொழிற்கல்வி சான்றிதழ் படிப்புகள்."
    ),
    "12th": (
        "12-ஆம் வகுப்பிற்குப் பிறகு:\n\n"
        "• உயிரியல் மாணவர்கள்: நீட் தேர்வு மூலம் MBBS, BDS மற்றும் மருத்துவ துணைப் படிப்புகள்\n"
        "• கணித மாணவர்கள்: TNEA மூலம் B.E/B.Tech பொறியியல் படிப்புகள்\n"
        "• வணிகவியல் மாணவர்கள்: B.A. LL.B. சட்டம், B.Com, BBA, பட்டயக் கணக்காளர் (CA)\n"
        "• கலை & அறிவியல்: B.Sc, B.A. மற்றும் ஆசிரியர் பட்டயப் படிப்பு (B.Ed)."
    ),
    "cutoff": (
        "தமிழ்நாட்டில் கட் ஆஃப் விவரங்கள்:\n\n"
        "• பொறியியல் (TNEA): 200 மதிப்பெண்களுக்கு கணக்கிடப்படுகிறது (கணிதம் 100 + இயற்பியல் 50 + வேதியியல் 50). CEG, PSG கல்லூரிகளுக்கு 190+ தேவை.\n"
        "• மருத்துவம் (NEET): 720 மதிப்பெண்களுக்கு கணக்கிடப்படுகிறது. அரசு மருத்துவக் கல்லூரிகளுக்கு 630+ தேவை.\n\n"
        "*(குறிப்பு: கட் ஆஃப் மதிப்பெண்கள் தோராயமானவை, ஆண்டுதோறும் மாறும்).*"
    ),
    "scholarship": (
        "தமிழ்நாடு அரசு வழங்கும் முக்கிய உதவித்தொகைகள்:\n\n"
        "• புதுமைப் பெண் திட்டம் (அரசுப் பள்ளி மாணவிகளுக்கு ₹1,000/மாதம்)\n"
        "• தமிழ்ப் புதல்வன் திட்டம் (அரசுப் பள்ளி மாணவர்களுக்கு ₹1,000/மாதம்)\n"
        "• முதல் பட்டதாரி உதவித்தொகை (முழு கல்விக் கட்டண விலக்கு)\n"
        "• அரசுப் பள்ளி 7.5% இடஒதுக்கீடு மாணவர்களுக்கான முழு கல்விக் கட்டண உதவி\n"
        "• ஆதிதிராவிடர் & பழங்குடியினர் போஸ்ட் மெட்ரிக் உதவித்தொகை\n"
        "• பிற்படுத்தப்பட்டோர் (BC/MBC) நல உதவித்தொகை."
    ),
    "job": (
        "தற்போது அதிக வாய்ப்புள்ள வேலைவாய்ப்பு துறைகள்:\n\n"
        "• மருத்துவம் & சுகாதாரத்துறை\n"
        "• செயற்கை நுண்ணறிவு (AI/ML) & டேட்டா சயின்ஸ்\n"
        "• மென்பொருள் & கிளவுட் டெவலப்மென்ட்\n"
        "• சிவில் & ஸ்மார்ட் சிட்டி கட்டமைப்பு\n"
        "• மின்சார வாகனத் தொழில் நுட்பம் (EV)\n"
        "• வணிக சட்டம் & கார்ப்பரேட் ஆலோசனைகள்."
    ),
    "nsqf": (
        "NSQF (தேசிய திறன் தகுதிகள் கட்டமைப்பு) நிலைகள் 1 முதல் 10 வரை தொழிற்கல்வி மற்றும் தேசிய சான்றிதழ்களை வழங்குகிறது. இது தங்களுக்குத் தேவையான தொழில்துறை திறன்களை வளர்க்க உதவுகிறது."
    )
}

@router.post("")
def chat_with_ai(req: ChatRequest):
    msg = req.message.strip()
    msg_lower = msg.lower()
    lang = (req.language or "en").lower()

    prev_context = ""
    prev_cutoff_score = None

    if req.history:
        for past_msg in reversed(req.history[-5:]):
            text = past_msg.get("text", "")
            text_lower = text.lower()

            if not prev_cutoff_score:
                m_score = re.search(r'Score:\s*(\d{2,3}(?:\.\d+)?)', text) or re.search(r'cutoff\s*(?:is|score)?\s*[:=]?\s*(\d{2,3}(?:\.\d+)?)', text, re.IGNORECASE)
                if m_score:
                    prev_cutoff_score = m_score.group(1)

            if not prev_context:
                if "scholarship" in text_lower or "fee" in text_lower:
                    prev_context = "scholarship"
                elif "cutoff" in text_lower or "tnea" in text_lower or "maths" in text_lower or "physics" in text_lower:
                    prev_context = "cutoff"
                elif "job" in text_lower or "career" in text_lower:
                    prev_context = "job"
                elif "nsqf" in text_lower or "skill" in text_lower:
                    prev_context = "nsqf"

    # Step 1: Check for Marks & Calculate TNEA Cutoff directly
    cutoff_result = extract_and_calculate_cutoff(msg)
    if cutoff_result["calculated"]:
        m = cutoff_result["maths"]
        p = cutoff_result["physics"]
        c = cutoff_result["chemistry"]
        ph = cutoff_result["phys_half"]
        ch = cutoff_result["chem_half"]
        co = cutoff_result["cutoff"]

        response_text = (
            f"🧮 TNEA Cutoff Calculation Breakdown:\n\n"
            f"• Maths Marks: {m:.1f} / 100\n"
            f"• Physics Marks: {p:.1f} / 100 (Physics ÷ 2 = {ph:.1f})\n"
            f"• Chemistry Marks: {c:.1f} / 100 (Chemistry ÷ 2 = {ch:.1f})\n\n"
            f"🎯 Your Calculated TNEA Cutoff Score: {co:.2f} / 200\n\n"
            f"With a cutoff score of {co:.2f}, you can check your eligibility across colleges in Tamil Nadu.\n"
            f"Go to the 'Colleges & Cutoffs' page in the navigation menu to filter eligible institutions!\n\n"
            f"*(Note: TNEA cutoffs are approximate, change every year, and vary by community category).*"
        )

        return {
            "reply": response_text,
            "suggested_actions": [
                "Check Colleges & Cutoffs Page",
                "View Scholarships",
                "See Industry Trends"
            ]
        }

    # Step 2: Specialized BC / Community Cutoff Follow-up Answer
    if contains_whole_word(msg_lower, "bc") or "backward class" in msg_lower or (prev_context == "cutoff" and ("category" in msg_lower or "community" in msg_lower)):
        score_text = f"Your calculated cutoff score is {prev_cutoff_score} / 200.\n\n" if prev_cutoff_score else ""
        response_text = (
            f"🏛️ Community Cutoffs for BC (Backward Class) Students:\n\n"
            f"{score_text}"
            f"• Colleges in Tamil Nadu publish separate cutoff benchmarks for each community category (OC, BC, BCM, MBC, SC, ST).\n"
            f"• The BC cutoff benchmark is usually lower than the OC (Open Competition) cutoff.\n"
            f"• On each college card in the 'Colleges & Cutoffs' page, compare your cutoff score directly with the 'BC' cutoff number shown (e.g., BC: 158 | OC: 168).\n\n"
            f"*(Note: Cutoffs are approximate, change every year based on applicant merit, and vary by community category).*"
        )
        return {
            "reply": response_text,
            "suggested_actions": [
                "Check Colleges & Cutoffs Page",
                "Options after 12th",
                "View Scholarships"
            ]
        }

    # Tamil Language Response Engine
    if lang == "ta":
        if "10" in msg_lower or "பத்தாம்" in msg_lower:
            response_text = TAMIL_RESPONSES["10th"]
        elif "12" in msg_lower or "பன்னிரண்டாம்" in msg_lower:
            response_text = TAMIL_RESPONSES["12th"]
        elif "cut" in msg_lower or "கட்" in msg_lower or "மதிப்பெண்" in msg_lower:
            response_text = TAMIL_RESPONSES["cutoff"]
        elif "scholarship" in msg_lower or "உதவித்" in msg_lower or "பரிசில்" in msg_lower:
            response_text = TAMIL_RESPONSES["scholarship"]
        elif "job" in msg_lower or "வேலை" in msg_lower or "வாய்ப்பு" in msg_lower:
            response_text = TAMIL_RESPONSES["job"]
        elif "nsqf" in msg_lower or "திறன்" in msg_lower:
            response_text = TAMIL_RESPONSES["nsqf"]
        else:
            response_text = (
                "மன்னித்துக்கொள்ளுங்கள், உங்கள் கேள்வி தெளிவாக இல்லை.\n\n"
                "நான் உதவக்கூடிய பகுதிகள்:\n\n"
                "• TNEA & NEET கட் ஆஃப் கணக்கீடு\n"
                "• தமிழ்நாடு அரசு உதவித்தொகை திட்டங்கள்\n"
                "• NSQF தொழில் நுட்ப பயிற்சி நிலைகள்\n"
                "• 10/12-ஆம் வகுப்பிற்குப் பிந்தைய படிப்புகள் & வேலைவாய்ப்புகள்!"
            )
        return {
            "reply": response_text,
            "suggested_actions": [
                "10/12த் பற்றிய சந்தேகங்கள்",
                "TNEA கட் ஆஃப் விபரம்",
                "உதவித்தொகை திட்டங்கள்",
                "வேலைவாய்ப்பு தகவல்கள்"
            ]
        }

    # Personalized Recommendation based on Student Profile
    if (
        "best for me" in msg_lower or 
        "recommend" in msg_lower or 
        "profile" in msg_lower or 
        "suggest" in msg_lower or 
        "which course" in msg_lower or 
        "what course" in msg_lower or
        "suitable for me" in msg_lower
    ):
        student_name = req.user_name or "Sahana Balaji"
        edu = req.education or "Student"
        career = (req.target_career or "Software Developer").strip()
        sk = req.skills or "Core Problem Solving"

        detected_dom = detect_domain(career, [sk])

        if detected_dom == "medicine":
            steps_text = (
                "1) Prepare rigorously for NEET-UG with 50%+ in 12th PCB (aim for 620+ for premier TN Government Medical Colleges like Madras Medical College or Stanley).\n"
                "2) Complete the 4.5-Year M.B.B.S. degree program with extensive clinical hospital rotations.\n"
                "3) Complete 1-Year Compulsory Rotatory Residential Internship (CRRI) and register with Tamil Nadu Medical Council."
            )
        elif detected_dom == "civil":
            steps_text = (
                "1) Target high TNEA cutoffs (190+) for premier colleges like CEG Anna University, PSG Tech, and TCE Madurai.\n"
                "2) Master Building Information Modeling (BIM - Revit) and Structural Analysis (STAAD.Pro / ETABS).\n"
                "3) Pursue on-site construction internships with top infrastructure employers like L&T, Shapoorji Pallonji, and PWD."
            )
        elif detected_dom == "law":
            steps_text = (
                "1) Prepare for CLAT or apply through 12th Board Merit for TNDALU (School of Excellence in Law).\n"
                "2) Pursue a 5-Year Integrated B.A. LL.B. (Hons) or B.B.A. LL.B. degree.\n"
                "3) Complete court chamber practice, moot court competitions, and clear the All India Bar Examination (AIBE)."
            )
        elif detected_dom == "teaching":
            steps_text = (
                "1) Complete Undergraduate subject graduation (B.A. / B.Sc) with 50%+ marks in your core subject.\n"
                "2) Pursue a 2-Year Bachelor of Education (B.Ed) at NCTE-approved institutions like IASE Saidapet.\n"
                "3) Complete 16 weeks of school teaching practice and qualify TNTET Paper 1/2 or TRB for government appointment."
            )
        elif detected_dom == "data_science":
            steps_text = (
                "1) Master Applied Mathematics, Linear Algebra, and Python (NumPy, Pandas, Scikit-learn).\n"
                "2) Specialize in SQL Database analytics, Power BI dashboards, and Machine Learning algorithms.\n"
                "3) Target enterprise data science roles at Tiger Analytics, LatentView, Mu Sigma, or Zoho."
            )
        elif detected_dom == "ev_automotive":
            steps_text = (
                "1) Master Power Electronics, embedded microcontrollers, and electrical safety fundamentals.\n"
                "2) Complete NSQF Level 6 Electric Vehicle Technology & Battery Management Systems (BMS).\n"
                "3) Gain hands-on powertrain calibration experience in Tamil Nadu's EV manufacturing corridor (Hosur/Chennai)."
            )
        elif detected_dom == "finance_accounting":
            steps_text = (
                "1) Master Tally Prime with GST e-Way bills, bank reconciliations, and voucher entries.\n"
                "2) Advance to Corporate Tax compliance, TDS filing, and Advanced Excel financial modeling.\n"
                "3) Target audit firms, Big 4 accounting practices (Deloitte/EY/PwC), or prepare for ICAI CA Foundation."
            )
        elif detected_dom == "software":
            steps_text = (
                "1) Master Data Structures & Algorithms, Python/Java, and Modern Web (React & FastAPI).\n"
                "2) Build production-grade cloud microservices, SQL databases, and containerize with Docker.\n"
                "3) Target software product engineering placements at Zoho, Freshworks, Microsoft, and TCS Digital."
            )
        elif detected_dom == "aviation":
            steps_text = (
                "1) Pass 12th PCM with 50%+ and clear DGCA Class 2 & Class 1 Medical examinations.\n"
                "2) Clear DGCA Ground School modules (Air Navigation, Aviation Meteorology, Air Regulations, Technical General).\n"
                "3) Complete 200 hours flying training at a DGCA-approved Flying Club (e.g. Madras Flying Club) to earn your Commercial Pilot License (CPL)."
            )
        elif detected_dom == "design":
            steps_text = (
                "1) Prepare for design aptitude exams (NIFT CAT/GAT, UCEED, or NID DAT) focusing on sketching, visualization, and creative problem solving.\n"
                "2) Pursue a Bachelor of Design (B.Des in Fashion, Communication, or UI/UX Design).\n"
                "3) Build an industry-ready design portfolio in Figma/Adobe CC and complete fashion atelier or digital product design internships."
            )
        elif detected_dom == "pharmacy":
            steps_text = (
                "1) Complete 12th PCB/PCM and apply through TN Health Paramedical Single Window Counselling for B.Pharm.\n"
                "2) Complete the 4-year Bachelor of Pharmacy (B.Pharm) or 6-year Pharm.D curriculum accredited by Pharmacy Council of India (PCI).\n"
                "3) Obtain State Pharmacy Council registration and target formulation R&D, clinical trials, or hospital pharmacotherapy roles."
            )
        elif detected_dom == "agriculture":
            steps_text = (
                "1) Apply through TNAU Single Window Online Counselling with 12th PCB/PCM marks (aim for 185+ cutoff for main Coimbatore campus).\n"
                "2) Pursue 4-year B.Sc (Hons) Agriculture or B.Tech Agricultural Engineering covering soil science, precision agronomy, and drone tech.\n"
                "3) Target Agricultural Officer (AO) roles through TNPSC, ICAR research fellowships, or Agritech leadership positions."
            )
        elif detected_dom == "robotics":
            steps_text = (
                "1) Master C++, Python, Linear Algebra, and electronics circuit design with STM32 / Arduino microcontrollers.\n"
                "2) Pursue B.E. Robotics & Automation or Mechatronics at top institutions like PSG Tech or Anna University MIT Campus.\n"
                "3) Master ROS2 (Robot Operating System), Computer Vision (OpenCV), and industrial PLC automation for smart manufacturing."
            )
        elif detected_dom == "psychology":
            steps_text = (
                "1) Complete 12th Higher Secondary and enroll in B.Sc Psychology covering developmental and cognitive psychology.\n"
                "2) Complete M.Sc Applied or Clinical Psychology with hospital clinical postings and diagnostic assessments.\n"
                "3) Pursue an RCI-recognized M.Phil or Professional Diploma in Clinical Psychology to obtain official license for independent clinical practice."
            )
        else:
            steps_text = (
                f"1) Strengthen foundational domain literacy and entry requirements in {career}.\n"
                f"2) Pursue a recognized Degree, Diploma, or NSQF certification aligned with {career}.\n"
                f"3) Complete an industry apprenticeship and build a verified portfolio of hands-on work in {career}."
            )

        response_text = (
            f"Hi {student_name}! Based on your profile:\n\n"
            f"• Current Status: {edu}\n"
            f"• Target Goal: {career}\n"
            f"• Key Skills: {sk}\n\n"
            f"🎯 Recommended Personalized Pathway:\n"
            f"{steps_text}\n\n"
            f"Explore the 'AI Skilling Navigator' tab for your full interactive roadmap!"
        )
        return {
            "reply": response_text,
            "suggested_actions": [
                "View AI Skilling Navigator",
                "Explore Upskilling Hub",
                "Check Colleges & Cutoffs"
            ]
        }

    # Greeting Matching (1-3 words, typo tolerant)
    if is_greeting(msg):
        greeting_name = f", {req.user_name}" if req.user_name else ""
        response_text = (
            f"Hello{greeting_name}! I am Ascentia AI, your Career & Education Navigator.\n\n"
            f"Ask me about cutoffs, career options after 10th/12th, NSQF skill levels, or scholarships!"
        )
    elif contains_whole_word(msg_lower, "cutoff") or contains_whole_word(msg_lower, "cutoffs") or contains_whole_word(msg_lower, "tnea") or contains_whole_word(msg_lower, "mark") or contains_whole_word(msg_lower, "marks"):
        response_text = KNOWLEDGE_BASE["cutoff"]
    elif contains_whole_word(msg_lower, "10th") or contains_whole_word(msg_lower, "10"):
        response_text = KNOWLEDGE_BASE["10th"]
    elif contains_whole_word(msg_lower, "12th") or contains_whole_word(msg_lower, "12"):
        response_text = KNOWLEDGE_BASE["12th"]
    elif contains_whole_word(msg_lower, "nsqf") or contains_whole_word(msg_lower, "skill") or contains_whole_word(msg_lower, "skills"):
        response_text = KNOWLEDGE_BASE["nsqf"]
    elif contains_whole_word(msg_lower, "scholarship") or contains_whole_word(msg_lower, "scholarships") or contains_whole_word(msg_lower, "grant") or contains_whole_word(msg_lower, "grants") or contains_whole_word(msg_lower, "fee"):
        response_text = KNOWLEDGE_BASE["scholarship"]
    elif contains_whole_word(msg_lower, "job") or contains_whole_word(msg_lower, "jobs") or contains_whole_word(msg_lower, "career") or contains_whole_word(msg_lower, "trend") or contains_whole_word(msg_lower, "trends") or contains_whole_word(msg_lower, "salary"):
        response_text = KNOWLEDGE_BASE["job"]
    elif contains_whole_word(msg_lower, "ai") or contains_whole_word(msg_lower, "python") or contains_whole_word(msg_lower, "software") or contains_whole_word(msg_lower, "coding"):
        response_text = (
            "For AI and Software engineering, we recommend starting with NSQF Level 5 (Web & FastAPI) "
            "and escalating to NSQF Level 6 (Advanced AI/ML & PyTorch). Average starting salary ranges from ₹4.5L to ₹7.5L PA."
        )
    else:
        # Honest Fallback Message
        response_text = (
            "I'm not sure about that specific query yet. I can help you with:\n\n"
            "• 🧮 TNEA & NEET Cutoff Calculations (e.g., '99 in Maths, 69 in Physics, 81 in Chemistry')\n"
            "• 🎓 Career Options after 10th & 12th (Medicine, Engineering, Law, Teaching, Commerce)\n"
            "• 💰 Tamil Nadu Scholarships & Grants\n"
            "• 📜 NSQF Skill Levels 1–10\n"
            "• 📈 Job & Hiring Salary Trends\n\n"
            "Feel free to ask about any of these!"
        )

    return {
        "reply": response_text,
        "suggested_actions": [
            "Calculate TNEA Cutoff",
            "Options after 12th",
            "View Scholarships",
            "NSQF Skill Levels"
        ]
    }
