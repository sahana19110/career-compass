from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # 'en', 'ta', 'hi'

KNOWLEDGE_BASE = {
    "10th": "After 10th grade, you can choose: 1) Higher Secondary (11th/12th PCM, PCB, Commerce, Arts), 2) 3-Year Polytechnic Diploma (Computer, ECE, Mech, Civil), or 3) NSQF Level 3 & 4 Skill Certifications (Junior Software Dev, IoT Technician, Web Basics).",
    "12th": "After 12th grade: PCM students can pursue B.E./B.Tech (CS, AI/ML, ECE), B.Sc CS/Data Science, or NSQF Level 5 Full-Stack/Cloud pathways. PCB students can pursue Medicine, Biotech, Healthcare Data Analytics, or Nursing. Commerce students can opt for B.Com, BBA, CA, or Digital Marketing.",
    "cutoff": "College cutoffs in Tamil Nadu (TNEA) are calculated out of 200 (Maths 100 + Physics 50 + Chemistry 50). Top colleges like CEG, MIT, PSG require 190+ cutoffs for CS/AI branches.",
    "nsqf": "NSQF (National Skills Qualifications Framework) organizes qualifications according to a series of levels (Level 1 to Level 10) based on knowledge, skills, and aptitude. It enables stackable micro-credentials and seamless credit transfer.",
    "scholarship": "Key scholarships available include: 1) AICTE Pragati for Girls (₹50k/yr), 2) TN First Graduate Scholarship (Full tuition waiver), 3) Post-Matric SC/ST Scholarship, 4) PM-USP Central Sector Scheme.",
    "job": "Top high-demand domains right now are: 1) Artificial Intelligence & ML (+34% growth), 2) Full-Stack Web & Cloud Development (+28%), 3) Cyber Security (+30%), and 4) Electric Vehicle & Green Energy (+42%)."
}

TAMIL_RESPONSES = {
    "10th": "10-ஆம் வகுப்பிற்குப் பிறகு நீங்கள் 11/12-ஆம் வகுப்பு, 3 ஆண்டு பாலிடெக்னிக் டிப்ளமோ அல்லது NSQF தொழில் நுட்ப பயிற்சி சான்றிதழ் படிப்புகளைத் தேர்ந்தெடுக்கலாம்.",
    "12th": "12-ஆம் வகுப்பிற்குப் பிறகு B.E/B.Tech (CS, AI/ML), B.Sc டேட்டா சயின்ஸ், அல்லது NSQF லெவல் 5 பட்டயப் படிப்புகளில் சேரலாம்.",
    "cutoff": "தமிழ்நாட்டில் TNEA கட் ஆஃப் 200 மதிப்பெண்களுக்குக் கணக்கிடப்படுகிறது (கணிதம் 100 + இயற்பியல் 50 + வேதியியல் 50). CEG, MIT கல்லூரிகளுக்கு 190+ கட் ஆஃப் தேவை.",
    "default": "வணக்கம்! நான் ASCENTIA AI வழிகாட்டி. உங்கள் படிப்பு, கட் ஆஃப், உதவித்தொகை மற்றும் வேலைவாய்ப்பு சந்தேகங்களைக் கேட்கலாம்."
}

@router.post("")
def chat_with_ai(req: ChatRequest):
    msg = req.message.lower()
    lang = req.language.lower()

    # Determine response logic
    response_text = ""
    
    if lang == "ta":
        if "10" in msg or "பத்தாம்" in msg:
            response_text = TAMIL_RESPONSES["10th"]
        elif "12" in msg or "பன்னிரண்டாம்" in msg:
            response_text = TAMIL_RESPONSES["12th"]
        elif "cut" in msg or "கட்" in msg:
            response_text = TAMIL_RESPONSES["cutoff"]
        else:
            response_text = TAMIL_RESPONSES["default"]
    else:
        # English / Hindi search
        matched_keys = []
        for key in KNOWLEDGE_BASE:
            if key in msg:
                matched_keys.append(KNOWLEDGE_BASE[key])

        if matched_keys:
            response_text = " ".join(matched_keys)
        elif "hi" in msg or "hello" in msg or "hey" in msg:
            response_text = "Hello! I am Ascentia AI, your Career & Education Navigator. Ask me about career options after 10th/12th, college cutoffs, NSQF skill levels, or scholarships!"
        elif "ai" in msg or "python" in msg or "software" in msg:
            response_text = "For AI and Software engineering, we recommend starting with NSQF Level 5 (Web & FastAPI) and escalating to NSQF Level 6 (Advanced AI/ML & PyTorch). Average starting salary ranges from ₹4.5L to ₹7.5L PA."
        else:
            response_text = f"Ascentia AI Recommendation: Based on your question regarding '{req.message}', we suggest exploring our NSQF Aligned Pathways, College Cutoff Finder, and Skill Assessment modules!"

    return {
        "reply": response_text,
        "suggested_actions": [
            "Explore NSQF Pathways",
            "Check Tamil Nadu TNEA Cutoffs",
            "View Top Scholarships",
            "See AI Industry Trends"
        ]
    }
