# 🚀 ASCENTIA AI — Smart Skilling & TNEA Admission Platform

> **“From Aspiration to Achievement: Your Smart Skilling Navigator”**

ASCENTIA AI is an intelligent full-stack career navigation and admission allocation platform designed to empower students across Tamil Nadu and nationwide. It dynamically maps academic qualifications to **NSQF Levels 1–10**, calculates **TNEA engineering cutoffs**, indexes **60+ top colleges across all 38 Tamil Nadu districts**, and bridges skill gaps through interactive technical micro-credentials.

---

## 🌟 Key Features

* **🤖 AI Skilling Recommendation Engine**: Scikit-Learn TF-IDF cosine similarity vectorizer mapping learner profiles (10th, 12th PCM/PCB/Commerce, Diploma, UG) to aligned NSQF qualification standards and stackable micro-credentials.
* **🎓 Tamil Nadu College Explorer**: Directory of 60+ top colleges across **all 38 Tamil Nadu districts** filtered by streams, community quotas (`OC, BC, BCM, MBC, SC, ST`), and autonomous/government status.
* **🧮 TNEA Engineering Cutoff Predictor**: Calculates engineering cutoff score out of 200 (`Maths + Phys/2 + Chem/2`) and predicts admission eligibility based on historical allocation benchmarks.
* **⚡ Interactive Upskilling Hub & Micro-Quiz Center**: 10+ target industry career paths (*Full-Stack AI*, *EV Powertrain*, *BFSI Fintech*, *Cybersecurity*, *Robotics*, etc.) with interactive technical micro-quizzes, skill gap checklist, and verified badge certificates.
* **📄 Printable Skilling Passport PDF Exporter**: Official printable credential summary for student resumes and job applications.
* **💰 Scholarships & Grants Directory**: Directory of 15+ Central, TN State (Pudhumai Penn, 7.5% Govt School Waiver), and Corporate scholarship schemes.
* **🌐 Multilingual Localization**: Built-in 5-language switcher (**English, தமிழ், हिंदी, తెలుగు, മലയാളം**).
* **💬 Ascentia AI Counselor**: Multilingual virtual career assistant.

---

## 🛠️ Tech Stack

* **Backend**: Python 3.10+, FastAPI, Uvicorn, Scikit-Learn (TF-IDF & Cosine Similarity), SQLite, Pydantic, Pandas, NumPy.
* **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide Icons, Recharts Analytics, Glassmorphism UI.
* **Deployment**: Vercel (Frontend), Render (FastAPI Backend).

---

## 💻 Local Setup Instructions

### Prerequisites
- Python 3.10 or higher
- Node.js (v18+) & npm

### 1. One-Click Launcher (Windows)
```powershell
cd "D:\projects\career compass"
.\start.bat
```

### 2. Manual Terminal Setup

#### Backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Backend runs live at `http://127.0.0.1:8000`*

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs live at `http://localhost:5173`*

---

## 🌐 Live Demo & Deployment
- **Live Frontend**: `https://ascentia-ai.vercel.app`
- **Backend API Docs**: `http://127.0.0.1:8000/docs`

---

## 👤 Author
**Sahana Balaji**  
*Full-Stack & AI Developer*  
- **GitHub**: [sahana19110](https://github.com/sahana19110)
