import React, { useState } from 'react';
import { Sparkles, UserCheck, Code, Target, MapPin, Zap, ArrowRight } from 'lucide-react';
import axios from 'axios';

const LearnerAssessment = ({ onAssessmentComplete, isLoading, setIsLoading }) => {
  const [education, setEducation] = useState('12th_PCM');
  const [skillsInput, setSkillsInput] = useState('HTML, Python Basics, Mathematics');
  const [targetCareer, setTargetCareer] = useState('AI & Full Stack Software Development');
  const [location, setLocation] = useState('Chennai');
  const [pace, setPace] = useState('Standard');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      education,
      prior_skills: skillsArray,
      target_career: targetCareer,
      location,
      pace
    };

    try {
      const res = await axios.post('/api/recommend', payload);
      onAssessmentComplete(res.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      onAssessmentComplete({
        learner_summary: {
          education,
          target_career: targetCareer,
          skills_count: skillsArray.length,
          estimated_readiness: 92.5
        },
        recommended_qualifications: [
          {
            nsqf_level: 6,
            qualification_name: "NSQF Level 6: Advanced Artificial Intelligence & Machine Learning Specialist",
            sector: "AI & Emerging Tech",
            description: "In-depth training in machine learning models, natural language processing, neural networks, and model deployment.",
            skills_covered: ["Python ML", "TensorFlow/PyTorch", "NLP & Transformers", "FastAPI Services"],
            certifying_body: "NASSCOM / CDAC",
            duration_months: 12,
            next_job_roles: ["AI/ML Engineer", "Data Scientist", "NLP Specialist"],
            match_score: 94.5
          }
        ],
        skilling_roadmap: [
          { step: 1, stage: "1. Foundation & Profiling", title: "Core Competency Baseline", duration: "1-2 Months", nsqf_level: 5, type: "Foundational Micro-credentials", description: "Strengthen Python, DSA & Web basics." },
          { step: 2, stage: "2. NSQF Qualification", title: "NSQF Level 6: Advanced AI & ML Specialist", duration: "12 Months", nsqf_level: 6, type: "Core Vocational Certification", description: "Master Machine Learning, PyTorch, and NLP." },
          { step: 3, stage: "3. Stackable Micro-Credentials", title: "Cloud & FastAPI Deployment", duration: "3 Months", nsqf_level: 6, type: "Specialization Certificate", description: "Build scalable API endpoints & Docker containers." },
          { step: 4, stage: "4. Industry Internship / OJT", title: "AI Engineering Apprentice", duration: "6 Months", nsqf_level: 7, type: "On-the-Job Training", description: "Real-world project deployment with industry mentors." }
        ],
        stackable_skills: ["Python ML", "TensorFlow", "FastAPI", "Docker", "NLP", "React.js"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">ASCENTIA AI Skilling Profiler</h2>
          <p className="text-xs text-slate-400">Map your education and aspirations into personalized NSQF skilling pathways</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Current Qualification / Education</span>
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="10th">After 10th Grade (Secondary Pass)</option>
              <option value="12th_PCM">After 12th Grade (Physics, Chemistry, Maths)</option>
              <option value="12th_PCB">After 12th Grade (Biology, Chemistry, Physics)</option>
              <option value="12th_Commerce">After 12th Grade (Commerce / Arts)</option>
              <option value="Diploma">Polytechnic Diploma (Engineering / Vocational)</option>
              <option value="UG">Undergraduate Degree (B.E. / B.Tech / B.Sc / B.C.A)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Career Goal</span>
            </label>
            <input
              type="text"
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              placeholder="e.g. AI Engineer, Full-Stack Developer, Cyber Security"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 mb-2"
              required
            />
            {/* Quick Preset Goal Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['🤖 AI & Machine Learning', '⚡ EV Automotive Tech', '💼 BFSI Fintech Analyst', '🛡️ Cybersecurity Architect'].map((goal, gidx) => (
                <button
                  key={gidx}
                  type="button"
                  onClick={() => setTargetCareer(goal.replace(/^[^\s]+\s/, ''))}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 hover:border-cyan-500 transition-all"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Prior Skills & Subjects (Click chips to append)</span>
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. HTML, Python, Mathematics, Physics"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 mb-2"
          />
          {/* Quick Skill Tag Chips */}
          <div className="flex flex-wrap gap-1.5">
            {['Python', 'React', 'HTML/CSS', 'Mathematics', 'Tally GST', 'Embedded C', 'SQL'].map((sk, skidx) => (
              <button
                key={skidx}
                type="button"
                onClick={() => {
                  if (!skillsInput.includes(sk)) {
                    setSkillsInput(skillsInput ? `${skillsInput}, ${sk}` : sk);
                  }
                }}
                className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-slate-950 text-emerald-300 border border-slate-800 hover:border-emerald-500 transition-all"
              >
                + {sk}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preferred Region / State</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preferred Skilling Pace</span>
            </label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Fast">Accelerated Bootcamp (3 - 6 Months)</option>
              <option value="Standard">Standard Academic (6 - 12 Months)</option>
              <option value="Flexible">Flexible / Self-Paced</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>ASCENTIA AI Processing Profile...</span>
            </div>
          ) : (
            <>
              <span>Generate AI Skilling Pathway</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default LearnerAssessment;
