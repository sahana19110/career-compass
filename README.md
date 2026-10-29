# 🚀 ASCENTIA AI — Smart Skilling Navigator

> **"From Aspiration to Achievement: Your Smart Skilling Navigator"**

ASCENTIA AI is an intelligent full-stack career navigation and education guidance platform built for students in Tamil Nadu and across India. It provides personalized career roadmaps, college discovery, scholarship matching, AI-powered counseling, and NSQF-aligned skill pathways — supporting **18+ career domains** from Medicine to Aviation to Robotics.

---

## 🌐 Live Demo

- 🎨 **Live Application**: [https://career-compass-rho-tawny.vercel.app](https://career-compass-rho-tawny.vercel.app)
- ⚙️ **Backend API**: [https://career-compass-1mil.onrender.com](https://career-compass-1mil.onrender.com)
- 📖 **API Documentation**: [https://career-compass-1mil.onrender.com/docs](https://career-compass-1mil.onrender.com/docs)

---

## 🌟 Key Features

### 🤖 AI-Powered Career Counselor
- Intelligent chatbot powered by **Groq AI (Llama 3.3 70B)** that responds to ANY user message
- Handles casual conversation, career questions, education queries in **English, Tamil & Hindi**
- Smart conversational handlers: greetings, identity, gratitude, farewell, help requests
- Context-aware responses using student profile (name, education, target career)
- Multi-turn conversation support with chat history

### 🎯 Universal Career Recommendation Engine
- Supports **18+ career pathways**: Medicine, Engineering, Law, Teaching, Data Science, Aviation, Fashion Design, Pharmacy, Agriculture, Robotics, Psychology, Finance, EV/Automotive & more
- Scikit-Learn TF-IDF cosine similarity vectorizer mapping learner profiles to NSQF qualification standards
- Domain-specific roadmaps with step-by-step progression from education to career
- Accepts ANY custom career input — not limited to presets

### 🎓 Tamil Nadu College Explorer
- Directory of **60+ colleges** across all 38 Tamil Nadu districts
- Streams: Engineering, Medical, Agriculture, Design, Pharmacy, Aviation & more
- Filters by stream, district, community quota (OC/BC/BCM/MBC/SC/ST)
- College cards with Wikipedia images, admission badges, and official links
- Specialized colleges: TNAU, NIFT Chennai, MMC Pharmacy, Madras Flying Club

### 🧮 TNEA & NEET Cutoff Calculator
- TNEA engineering cutoff: `Maths + Physics/2 + Chemistry/2` (out of 200)
- Community-wise cutoff benchmarks (OC, BC, MBC, SC/ST)
- BC community cutoff explanation with historical data
- NEET-UG score guidance for medical admissions

### 📊 Career Discovery Assessment
- Interactive assessment with 12 questions exploring interests, aptitudes & preferences
- **6 career category tabs**: Technology, Healthcare, Creative, Business, Science, Service
- Personalized career suggestions based on assessment results
- "Type any career" universal input banner

### ⚡ Upskilling Hub & Skill Gap Analyzer
- 10+ target industry paths with technical micro-quizzes
- Skill gap analysis comparing current skills vs. career requirements
- Interactive quiz center with explanations and next steps
- Career matching for Robotics, UI/UX Design, Renewable Energy, Biotech & more

### 💰 Scholarships & Grants Directory
- 15+ scholarship schemes: Pudhumai Penn, First Graduate, 7.5% Govt School Quota
- Central & TN State government schemes with eligibility details
- BC/MBC/SC/ST specific schemes
- National Scholarship Portal (NSP) integration guidance

### 📈 Labor Market Intelligence
- Job & salary trends across AI, Medical, Civil, Law sectors
- Industry-wise hiring demand data
- Career progression routes and typical job roles

### 📄 Skilling Passport
- NSQF Levels 1–10 aligned qualification pathways
- Printable PDF credential summary for resumes
- Stackable micro-credentials tracking

### 🌐 Multilingual Support
- Built-in language switcher: **English, தமிழ் (Tamil), हिंदी (Hindi)**
- AI chatbot responds in the user's preferred language

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js 18, Vite, Tailwind CSS |
| **Backend** | Python , FastAPI, Uvicorn, Pydantic |
| **Database** | SQLite, Pandas, NumPy |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **UI Design** | Glassmorphism, Dark Theme (Slate-950), Cyan/Indigo Accents |

---

## 💻 Local Setup

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm
- Groq API Key (free from [console.groq.com](https://console.groq.com))

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs at `http://127.0.0.1:8000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### Environment Variables
Create a `.env` file or set these environment variables:
```
GROQ_API_KEY=your_groq_api_key_here
```

---

## 📁 Project Structure

```
career-compass/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── ai_engine.py            # Career domain detection & recommendation engine
│   ├── database.py             # SQLite database with colleges, courses & schemes
│   ├── requirements.txt        # Python dependencies
│   └── routes/
│       ├── chatbot.py          # AI chatbot with Groq integration
│       ├── colleges.py         # College finder API
│       ├── recommendations.py  # Career recommendation API
│       └── market_trends.py    # Labor market data API
├── frontend/
│   ├── src/
│   │   └── components/
│   │       ├── LearnerAssessment.jsx  # Career discovery & assessment
│   │       ├── CollegeFinder.jsx      # College search & filters
│   │       ├── UpskillingHub.jsx      # Skill gap analyzer & quizzes
│   │       └── ...
│   ├── vercel.json             # Vercel deployment config
│   └── package.json
└── README.md
```

---

## 🚀 Deployment

- **Frontend**: Auto-deploys to Vercel on `git push origin main`
- **Backend**: Auto-deploys to Render on `git push origin main`
- **CI/CD**: GitHub → Vercel + Render (automatic)

---

## 👤 Author

**Sahana **
*Full-Stack & AI Developer*

- **GitHub**: [sahana19110](https://github.com/sahana19110)

---

