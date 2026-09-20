import json
import sqlite3
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from database import get_db

DOMAIN_KEYWORDS = {
    "accounting": ["accounts", "accounting", "tally", "gst", "taxation", "auditing", "finance", "commerce", "ca", "bookkeeping", "payroll", "billing", "bank", "bfsi"],
    "software": ["software", "developer", "web", "frontend", "backend", "python", "javascript", "react", "fastapi", "code", "programming", "it"],
    "ai": ["ai", "machine learning", "data science", "nlp", "tensorflow", "pytorch", "deep learning", "neural"],
    "marketing": ["marketing", "seo", "digital marketing", "social media", "e-commerce", "shopify", "ads", "growth"],
    "healthcare": ["healthcare", "medical", "nursing", "pharmacy", "doctor", "clinical", "hospital", "lab"],
    "ev": ["ev", "electric vehicle", "battery", "automobile", "embedded", "mechanical", "electrical", "hardware", "iot"]
}

def detect_domain(text: str) -> str:
    text_lower = text.lower()
    for domain, keywords in DOMAIN_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            return domain
    return "general"

def recommend_pathway(learner_profile: dict):
    """
    Learner Profile Dict:
    {
        "education": "10th",
        "prior_skills": ["maths"],
        "target_career": "accounts",
        "location": "Chennai",
        "pace": "Standard"
    }
    """
    education = learner_profile.get("education", "10th")
    prior_skills = learner_profile.get("prior_skills", [])
    target_career = learner_profile.get("target_career", "Accounts")
    
    user_query = f"{target_career} {' '.join(prior_skills)}"
    domain = detect_domain(user_query)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM nsqf_courses")
    rows = cursor.fetchall()
    conn.close()

    courses = [dict(r) for r in rows]

    if not courses:
        return {"error": "No courses found"}

    # Compute similarity and domain relevance boost
    corpus = []
    for c in courses:
        skills = " ".join(json.loads(c["skills_covered"]))
        roles = " ".join(json.loads(c["next_job_roles"]))
        course_text = f"{c['qualification_name']} {c['sector']} {c['description']} {skills} {roles}"
        corpus.append(course_text)

    vectorizer = TfidfVectorizer(stop_words='english')
    all_texts = [user_query] + corpus
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    user_vec = tfidf_matrix[0]
    course_vecs = tfidf_matrix[1:]

    similarities = cosine_similarity(user_vec, course_vecs).flatten()

    ranked_courses = []
    for idx, score in enumerate(similarities):
        c = courses[idx]
        parsed_skills = json.loads(c["skills_covered"])
        parsed_roles = json.loads(c["next_job_roles"])

        # Domain boost logic
        domain_boost = 0.0
        c_sector = c["sector"].lower()
        c_name = c["qualification_name"].lower()
        
        if domain == "accounting" and ("bfsi" in c_sector or "account" in c_sector or "account" in c_name or "tally" in c_name):
            domain_boost = 0.60
        elif domain == "software" and ("it" in c_sector or "web" in c_name or "software" in c_name):
            domain_boost = 0.50
        elif domain == "ai" and ("ai" in c_sector or "machine" in c_name):
            domain_boost = 0.50
        elif domain == "marketing" and ("media" in c_sector or "marketing" in c_name or "e-commerce" in c_name):
            domain_boost = 0.50
        elif domain == "healthcare" and ("healthcare" in c_sector or "medical" in c_name):
            domain_boost = 0.50
        elif domain == "ev" and ("auto" in c_sector or "hardware" in c_sector or "ev" in c_name):
            domain_boost = 0.50

        # Skill overlap
        matched_skills = [s for s in prior_skills if any(s.lower() in ps.lower() for ps in parsed_skills)]
        skill_bonus = len(matched_skills) * 0.15

        total_score = float(score) + domain_boost + skill_bonus
        final_match_score = min(round(total_score * 100, 1), 98.5)
        if final_match_score < 50 and domain_boost > 0:
            final_match_score = round(82.0 + float(score) * 15, 1)
        elif final_match_score < 40:
            final_match_score = round(55.0 + float(score) * 35, 1)

        c["match_score"] = final_match_score
        c["skills_covered"] = parsed_skills
        c["next_job_roles"] = parsed_roles
        c["matched_prior_skills"] = matched_skills
        ranked_courses.append(c)

    ranked_courses.sort(key=lambda x: x["match_score"], reverse=True)

    top_recommendations = ranked_courses[:4]
    primary = top_recommendations[0]

    # Dynamic Skilling Roadmap Steps matching exact target career
    roadmap_steps = [
        {
            "step": 1,
            "stage": "1. Foundation & Profiling",
            "title": f"Core Competency Baseline ({target_career.capitalize()})",
            "description": f"Strengthen foundational concepts in {', '.join(prior_skills) if prior_skills else 'core problem solving'} & entry-level {domain} literacy.",
            "duration": "1-2 Months",
            "nsqf_level": primary["nsqf_level"] - 1 if primary["nsqf_level"] > 1 else 1,
            "type": "Assessment & Foundational Micro-credentials"
        },
        {
            "step": 2,
            "stage": "2. NSQF Aligned Qualification",
            "title": primary["qualification_name"],
            "description": primary["description"],
            "duration": f"{primary['duration_months']} Months",
            "nsqf_level": primary["nsqf_level"],
            "certifying_body": primary["certifying_body"],
            "type": "Core Vocational / Certification Program"
        },
        {
            "step": 3,
            "stage": "3. Stackable Micro-Credentials",
            "title": f"Specialization in {primary['sector']}",
            "description": f"Earn stackable certifications: {', '.join(primary['skills_covered'][:4])}.",
            "duration": "3-6 Months",
            "nsqf_level": primary["nsqf_level"] + 1 if primary["nsqf_level"] < 10 else 10,
            "certifying_body": primary["certifying_body"],
            "type": "Micro-credential Certification"
        },
        {
            "step": 4,
            "stage": "4. On-the-Job Training (OJT) & Career Entry",
            "title": f"Industry Apprenticeship as {primary['next_job_roles'][0]}",
            "description": f"Apply practical skills with top employers. Target job roles: {', '.join(primary['next_job_roles'])}.",
            "duration": "6 Months",
            "nsqf_level": primary["nsqf_level"] + 1 if primary["nsqf_level"] < 10 else 10,
            "type": "Apprenticeship / OJT Placement"
        }
    ]

    return {
        "learner_summary": {
            "education": education,
            "target_career": target_career,
            "domain": domain.capitalize(),
            "skills_count": len(prior_skills),
            "estimated_readiness": primary["match_score"]
        },
        "recommended_qualifications": top_recommendations,
        "skilling_roadmap": roadmap_steps,
        "stackable_skills": list(set([s for r in top_recommendations for s in r["skills_covered"]]))
    }
