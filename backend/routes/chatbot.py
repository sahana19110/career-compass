from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import re

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # 'en', 'ta', 'hi'
    user_name: Optional[str] = None
    education: Optional[str] = None
    target_career: Optional[str] = None
    skills: Optional[str] = None

def contains_whole_word(text: str, word: str) -> bool:
    pattern = r'\b' + re.escape(word) + r'\b'
    return bool(re.search(pattern, text, re.IGNORECASE))

def extract_and_calculate_cutoff(msg: str):
    msg_lower = msg.lower()

    # Pattern A: Explicit subject names with numbers
    maths_match = re.search(r'(?:maths?|mat|m)\s*[:=\-]?\s*(\d{1,3}(?:\.\d+)?)', msg_lower)
    phys_match = re.search(r'(?:physics?|phys|phy|p)\s*[:=\-]?\s*(\d{1,3}(?:\.\d+)?)', msg_lower)
    chem_match = re.search(r'(?:chemistry?|chem|che|c)\s*[:=\-]?\s*(\d{1,3}(?:\.\d+)?)', msg_lower)

    m, p, c = None, None, None

    if maths_match and phys_match and chem_match:
        m = float(maths_match.group(1))
        p = float(phys_match.group(1))
        c = float(chem_match.group(1))
    else:
        # Pattern B: 3 numbers in a row, e.g. "99, 69, 81" or "99 69 81"
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
    "10th": "After 10th grade, you can choose:\n1) Higher Secondary (11th/12th PCM, PCB, Commerce, Arts)\n2) 3-Year Polytechnic Diploma (Computer, ECE, Mech, Civil)\n3) NSQF Level 3 & 4 Skill Certifications (Junior Software Dev, Web Basics).",
    "12th": "After 12th grade:\n• PCM students: B.E./B.Tech (CS, AI/ML, ECE), B.Sc Data Science, or NSQF Level 5 Full-Stack pathways.\n• PCB students: Medicine, Biotech, Healthcare Analytics, or Nursing.\n• Commerce: B.Com, BBA, CA, or Digital Marketing.",
    "cutoff": "Tamil Nadu (TNEA) cutoffs are calculated out of 200 (Maths 100 + Physics 50 + Chemistry 50). Top colleges like CEG, MIT, PSG require 190+ cutoffs for CS/AI branches.\n*(Note: Cutoffs are approximate historical benchmarks and vary each academic year).*",
    "nsqf": "NSQF (National Skills Qualifications Framework) organizes qualifications from Level 1 to Level 10 based on knowledge, skills, and aptitude. It enables stackable micro-credentials and seamless credit transfers.",
    "scholarship": "Key scholarships available:\n1) AICTE Pragati for Girls (₹50,000/year)\n2) TN First Graduate Scholarship (Full tuition waiver)\n3) Pudhumai Penn Scheme (₹1,000/month for TN Govt school girls)\n4) Post-Matric SC/ST Scholarship.",
    "job": "Top high-demand domains right now:\n1) Artificial Intelligence & ML (+34% growth)\n2) Full-Stack Web & Cloud Development (+28%)\n3) Cyber Security (+30%)\n4) EV Powertrain & Green Energy (+42%)."
}

TAMIL_RESPONSES = {
    "10th": "10-ஆம் வகுப்பிற்குப் பிறகு நீங்கள் 11/12-ஆம் வகுப்பு, 3 ஆண்டு பாலிடெக்னிக் டிப்ளமோ அல்லது NSQF தொழில் நுட்ப பயிற்சி சான்றிதழ் படிப்புகளைத் தேர்ந்தெடுக்கலாம்.",
    "12th": "12-ஆம் வகுப்பிற்குப் பிறகு B.E/B.Tech (CS, AI/ML), B.Sc டேட்டா சயின்ஸ், அல்லது NSQF லெவல் 5 பட்டயப் படிப்புகளில் சேரலாம்.",
    "cutoff": "தமிழ்நாட்டில் TNEA கட் ஆஃப் 200 மதிப்பெண்களுக்குக் கணக்கிடப்படுகிறது (கணிதம் 100 + இயற்பியல் 50 + வேதியியல் 50). CEG, MIT கல்லூரிகளுக்கு 190+ கட் ஆஃப் தேவை.\n*(குறிப்பு: கட் ஆஃப் மதிப்பெண்கள் தோராயமானவை).*",
    "scholarship": "முக்கிய உதவித்தொகைகள்:\n1) புதுமைப் பெண் திட்டம் (அரசுப் பள்ளி மாணவிகளுக்கு ₹1,000/மாதம்)\n2) முதல் பட்டதாரி உதவித்தொகை (முழு கல்விக் கட்டண விலக்கு)\n3) AICTE பிரகதி திட்டம் (மாணவிகளுக்கு ₹50,000/ஆண்டு).",
    "job": "தற்போது அதிக வாய்ப்புள்ள துறைகள்:\n1) செயற்கை நுண்ணறிவு (AI/ML)\n2) ஃபுல்-ஸ்டாக் வெப் டெவலப்மென்ட்\n3) சைபர் செக்யூரிட்டி\n4) மின்சார வாகனத் தொழில் நுட்பம் (EV).",
    "nsqf": "NSQF (தேசிய திறன் தகுதிகள் கட்டமைப்பு) நிலைகள் 1 முதல் 10 வரை தொழிற்கல்வி சான்றிதழ்களையும் வேலைவாய்ப்பு திறன்களையும் வழங்குகிறது."
}

@router.post("")
def chat_with_ai(req: ChatRequest):
    msg = req.message.strip()
    msg_lower = msg.lower()
    lang = (req.language or "en").lower()

    # Step 2: Check for Marks & Calculate TNEA Cutoff
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
            f"With a cutoff score of {co:.2f}, you can check your eligibility across 60+ colleges in Tamil Nadu. "
            f"Go to the 'Colleges & Cutoffs' page in the navigation menu to filter eligible institutions!\n"
            f"*(Note: TNEA cutoffs are approximate historical benchmarks and vary each academic year).* "
        )

        return {
            "reply": response_text,
            "suggested_actions": [
                "Check Colleges & Cutoffs Page",
                "View Scholarships",
                "See AI Industry Trends"
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
                "மன்னித்துக்கொள்ளுங்கள், உங்கள் கேள்வி தெளிவாக இல்லை. "
                "நான் TNEA கட் ஆஃப், உதவித்தொகை, NSQF நிலைகள் மற்றும் 10/12-ஆம் வகுப்பிற்குப் பிந்தைய வேலைவாய்ப்புகள் பற்றி உதவ முடியும்!"
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

    # Step 1: English Response Engine with Whole-Word Matching
    if contains_whole_word(msg_lower, "hi") or contains_whole_word(msg_lower, "hello") or contains_whole_word(msg_lower, "hey"):
        greeting_name = f", {req.user_name}" if req.user_name else ""
        response_text = (
            f"Hello{greeting_name}! I am Ascentia AI, your Career & Education Navigator. "
            f"Ask me about TNEA cutoffs, career options after 10th/12th, NSQF skill levels, or scholarships!"
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
        # Step 3: Honest Fallback Message (Never repeats greeting)
        response_text = (
            "I'm not sure about that specific query yet. I can help you with:\n\n"
            "• 🧮 TNEA Cutoff Calculations (e.g., '99 in Maths, 69 in Physics, 81 in Chemistry')\n"
            "• 🎓 Career Options after 10th & 12th\n"
            "• 💰 Scholarships & Grants\n"
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
