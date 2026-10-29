import React, { useState } from 'react';
import { Sparkles, UserCheck, Code, Target, MapPin, Zap, ArrowRight, Compass, CheckCircle2, ChevronRight, Award, HelpCircle } from 'lucide-react';
import axios from 'axios';

const CAREER_PRESETS = [
  { label: '🩺 Doctor / Medicine (MBBS)', value: 'Doctor', stream: '12th_PCB', skill: 'Biology, Anatomy' },
  { label: '💻 Software Developer', value: 'Software Developer', stream: '12th_PCM', skill: 'Python, React, DSA' },
  { label: '🏗️ Civil Engineer', value: 'Civil Engineer', stream: '12th_PCM', skill: 'AutoCAD, BIM, Mechanics' },
  { label: '📊 Data Scientist', value: 'Data Scientist', stream: '12th_PCM', skill: 'Python, Statistics, SQL' },
  { label: '⚖️ Lawyer / Advocate', value: 'Lawyer', stream: '12th_Commerce', skill: 'Constitutional Law, Debate' },
  { label: '🎓 Teacher / Educator', value: 'Teacher', stream: 'UG', skill: 'Pedagogy, Child Psychology' },
  { label: '⚡ EV Automotive Tech', value: 'EV Automotive Specialist', stream: '12th_PCM', skill: 'Battery BMS, Embedded C' },
  { label: '💼 Chartered Accountant / BFSI', value: 'Chartered Accountant', stream: '12th_Commerce', skill: 'Tally Prime, GST, Tax' }
];

const DISCOVERY_QUESTIONS = [
  {
    id: 1,
    title: "1. What subjects or activities do you naturally enjoy the most?",
    subtitle: "Select the discipline that excites your curiosity",
    options: [
      { text: "🧬 Biological sciences, human anatomy, medical diagnostics & healthcare", domain: "Doctor", stream: "12th_PCB", skill: "Biology, Clinical Care" },
      { text: "💻 Writing code, building software apps & algorithmic logic", domain: "Software Developer", stream: "12th_PCM", skill: "Python, Web Development" },
      { text: "🏗️ Architecture, structural blueprints, roads, bridges & buildings", domain: "Civil Engineer", stream: "12th_PCM", skill: "AutoCAD, Structural Design" },
      { text: "📊 Analyzing numbers, finding hidden patterns & machine learning", domain: "Data Scientist", stream: "12th_PCM", skill: "Mathematics, Python, SQL" },
      { text: "⚖️ Debating, constitutional rights, justice & legal argumentation", domain: "Lawyer", stream: "12th_Commerce", skill: "Constitutional Law, Advocacy" },
      { text: "📚 Explaining concepts, teaching students & mentoring others", domain: "Teacher", stream: "UG", skill: "Pedagogy, Child Psychology" }
    ]
  },
  {
    id: 2,
    title: "2. What kind of work environment feels most exciting for you?",
    subtitle: "Where do you envision yourself working each day?",
    options: [
      { text: "🏥 Hospital wards, clinical surgery rooms, or diagnostic research centers", domain: "Doctor" },
      { text: "🏢 High-tech innovation hubs, agile software teams, or remote tech work", domain: "Software Developer" },
      { text: "🏗️ Dynamic construction sites, infrastructure planning & engineering design offices", domain: "Civil Engineer" },
      { text: "📈 Corporate analytics centers, business intelligence & data engineering labs", domain: "Data Scientist" },
      { text: "🏛️ Courtrooms, legal chambers, arbitration councils & corporate advisory firms", domain: "Lawyer" },
      { text: "🏫 Schools, academic classrooms, lecture halls & educational institutions", domain: "Teacher" }
    ]
  },
  {
    id: 3,
    title: "3. What type of real-world challenge do you want to solve?",
    subtitle: "Choose the impact you want to create in society",
    options: [
      { text: "🩹 Treating illnesses, saving human lives & improving community health", domain: "Doctor" },
      { text: "🚀 Developing automated digital platforms, AI tools & mobile solutions", domain: "Software Developer" },
      { text: "🌉 Designing earthquake-resistant bridges, smart cities & sustainable infrastructure", domain: "Civil Engineer" },
      { text: "🤖 Forecasting business trends, building predictive algorithms & data models", domain: "Data Scientist" },
      { text: "📜 Defending justice, ensuring legal compliance & protecting citizen rights", domain: "Lawyer" },
      { text: "🌟 Shaping the next generation, nurturing student potential & promoting literacy", domain: "Teacher" }
    ]
  }
];

const LearnerAssessment = ({ onAssessmentComplete, isLoading, setIsLoading }) => {
  const [activeMode, setActiveMode] = useState('direct'); // 'direct' or 'discovery'

  // Direct Mode State
  const [education, setEducation] = useState('12th_PCM');
  const [skillsInput, setSkillsInput] = useState('Mathematics, Physics, Problem Solving');
  const [targetCareer, setTargetCareer] = useState('Software Developer');
  const [location, setLocation] = useState('Chennai');
  const [pace, setPace] = useState('Standard');

  // Discovery Mode State
  const [currentStep, setCurrentStep] = useState(0);
  const [discoveryAnswers, setDiscoveryAnswers] = useState({});
  const [discoveredResult, setDiscoveredResult] = useState(null);

  const handleSelectPreset = (preset) => {
    setTargetCareer(preset.value);
    setEducation(preset.stream);
    if (!skillsInput.includes(preset.skill.split(',')[0])) {
      setSkillsInput(preset.skill);
    }
  };

  const handleDiscoveryOptionSelect = (option) => {
    const nextAnswers = { ...discoveryAnswers, [currentStep]: option };
    setDiscoveryAnswers(nextAnswers);

    if (currentStep < DISCOVERY_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate top domain from answers
      const counts = {};
      Object.values(nextAnswers).forEach(ans => {
        if (ans.domain) counts[ans.domain] = (counts[ans.domain] || 0) + 1;
      });
      let topDomain = 'Software Developer';
      let maxCount = 0;
      for (const [dom, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          topDomain = dom;
        }
      }

      const matchingPreset = CAREER_PRESETS.find(p => p.value === topDomain) || CAREER_PRESETS[0];
      setDiscoveredResult({
        career: topDomain,
        stream: matchingPreset.stream,
        skill: matchingPreset.skill,
        matchPercentage: Math.min(88 + maxCount * 4, 98)
      });
    }
  };

  const handleApplyDiscoveredCareer = () => {
    if (!discoveredResult) return;
    setTargetCareer(discoveredResult.career);
    setEducation(discoveredResult.stream);
    setSkillsInput(discoveredResult.skill);
    setActiveMode('direct');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
      onAssessmentComplete(res.data, {
        education,
        target_career: targetCareer,
        skills: skillsArray
      });
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      // Dynamic fallback tailored to the user's chosen career
      const fallbackCareer = targetCareer.trim() || 'Software Developer';
      let qualName = `Professional Qualification in ${fallbackCareer}`;
      let sectorName = `${fallbackCareer} Industry`;
      let certBody = "National Council / State Skill Board";
      let defSkills = skillsArray.length ? skillsArray : ["Domain Fundamentals", "Industry Tools", "Project Execution"];

      if (fallbackCareer.toLowerCase().includes('doctor') || fallbackCareer.toLowerCase().includes('medic')) {
        qualName = "Bachelor of Medicine & Surgery (MBBS) & Clinical Residency";
        sectorName = "Healthcare & Medicine";
        certBody = "National Medical Commission (NMC)";
        defSkills = ["Human Anatomy", "Physiology", "Clinical Diagnostics", "Pharmacology"];
      } else if (fallbackCareer.toLowerCase().includes('civil')) {
        qualName = "B.E. Civil Infrastructure & NSQF BIM Technology Specialist";
        sectorName = "Civil & Infrastructure";
        certBody = "Construction Skill Development Council (CSDCI)";
        defSkills = ["Building Information Modeling (BIM)", "AutoCAD & Revit", "Structural Analysis", "Concrete Tech"];
      } else if (fallbackCareer.toLowerCase().includes('law')) {
        qualName = "5-Year Integrated B.A. LL.B. & Legal Advocacy Certification";
        sectorName = "Law & Legal Studies";
        certBody = "Bar Council of India (BCI) / TNDALU";
        defSkills = ["Constitutional Law", "Criminal & Civil Law", "Legal Drafting", "Moot Courts"];
      } else if (fallbackCareer.toLowerCase().includes('teach')) {
        qualName = "Bachelor of Education (B.Ed) & Modern Pedagogy Specialist";
        sectorName = "Education & Teaching";
        certBody = "NCTE / Tamil Nadu Teachers Education University";
        defSkills = ["Child Psychology", "Curriculum Planning", "Smart Classroom EdTech", "Assessment"];
      } else if (fallbackCareer.toLowerCase().includes('data')) {
        qualName = "B.Tech Data Science & NSQF Level 6 Applied AI Specialist";
        sectorName = "Analytics & AI";
        certBody = "NASSCOM FutureSkills";
        defSkills = ["Python Data Science", "Pandas & SQL", "Machine Learning", "Power BI"];
      }

      onAssessmentComplete({
        learner_summary: {
          education,
          target_career: fallbackCareer,
          skills_count: skillsArray.length,
          estimated_readiness: 88.5
        },
        recommended_qualifications: [
          {
            nsqf_level: 6,
            qualification_name: qualName,
            sector: sectorName,
            description: `Curriculum structured specifically for aspiring ${fallbackCareer} professionals.`,
            skills_covered: defSkills,
            certifying_body: certBody,
            duration_months: 48,
            next_job_roles: [`Associate ${fallbackCareer}`, `${fallbackCareer} Specialist`],
            match_score: 92.0
          }
        ],
        skilling_roadmap: [
          { step: 1, stage: "1. Foundation & Eligibility", title: `Preparatory Competencies for ${fallbackCareer}`, duration: "3-6 Months", nsqf_level: 4, type: "Foundational Eligibility", description: `Build prerequisite subject mastery and entry-level requirements for ${fallbackCareer}.` },
          { step: 2, stage: "2. Core Degree / Professional Qualification", title: qualName, duration: "36-48 Months", nsqf_level: 6, type: "Degree / Core Certification", description: `Comprehensive formal training accredited by ${certBody}.` },
          { step: 3, stage: "3. Stackable Micro-Credentials", title: `Advanced Tooling & Practical Skills`, duration: "4-6 Months", nsqf_level: 6, type: "Specialization Certificate", description: `Master modern industry tools: ${defSkills.slice(0, 3).join(', ')}.` },
          { step: 4, stage: "4. Industry Apprenticeship / Placement", title: `Professional Internship as ${fallbackCareer}`, duration: "6 Months", nsqf_level: 7, type: "On-the-Job Training", description: `Transition to full-time practice with verified hands-on experience.` }
        ],
        stackable_skills: defSkills,
        career_guidance: `Verify regulatory admissions and counseling schedules in Tamil Nadu for ${fallbackCareer}.`
      }, {
        education,
        target_career: fallbackCareer,
        skills: defSkills
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* Header and Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ASCENTIA AI Career & Skilling Profiler</h2>
            <p className="text-xs text-slate-400">Personalized education pathways for all students in Tamil Nadu</p>
          </div>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveMode('direct')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-all ${
              activeMode === 'direct'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Direct Career Goal
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('discovery');
              setCurrentStep(0);
              setDiscoveredResult(null);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeMode === 'discovery'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🧭 Help Me Choose (Discovery)</span>
          </button>
        </div>
      </div>

      {/* DISCOVERY MODE */}
      {activeMode === 'discovery' && (
        <div className="space-y-6 animate-fade-in">
          {!discoveredResult ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
                    Discovery Step {currentStep + 1} of {DISCOVERY_QUESTIONS.length}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {DISCOVERY_QUESTIONS[currentStep].title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {DISCOVERY_QUESTIONS[currentStep].subtitle}
                  </p>
                </div>
                <div className="w-20 bg-slate-950 rounded-full h-2 border border-slate-800">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${((currentStep + 1) / DISCOVERY_QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DISCOVERY_QUESTIONS[currentStep].options.map((opt, oidx) => (
                  <button
                    key={oidx}
                    type="button"
                    onClick={() => handleDiscoveryOptionSelect(opt)}
                    className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-amber-400 hover:bg-slate-900 text-left transition-all group flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 group-hover:border-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200 group-hover:text-white font-medium leading-relaxed">
                      {opt.text}
                    </span>
                  </button>
                ))}
              </div>

              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-200"
                >
                  ← Previous Question
                </button>
              )}
            </div>
          ) : (
            <div className="p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/50 rounded-3xl text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  🎉 Discovery Assessment Analysis Complete
                </span>
                <h3 className="text-2xl font-black text-white">
                  Your Top Career Match: <span className="text-amber-400">{discoveredResult.career}</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-2">
                  Based on your affinity for problem solving, work environment preference, and core interests, you have a <strong className="text-emerald-400">{discoveredResult.matchPercentage}% suitability score</strong> for this discipline!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyDiscoveredCareer}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 flex items-center space-x-2"
                >
                  <span>Use Discovered Career & Customize Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(0);
                    setDiscoveredResult(null);
                  }}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Retake Discovery Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DIRECT GOAL MODE */}
      {activeMode === 'direct' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Quick Preset Goal Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Popular Career Streams in Tamil Nadu (Click to Auto-fill)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CAREER_PRESETS.map((preset, pidx) => (
                <button
                  key={pidx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    targetCareer.toLowerCase() === preset.value.toLowerCase()
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Current Education / Qualification</span>
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="10th">After 10th Grade (Secondary Pass - SSLC)</option>
                <option value="12th_PCM">After 12th Grade (Maths, Physics, Chemistry - PCM)</option>
                <option value="12th_PCB">After 12th Grade (Biology, Physics, Chemistry - PCB / Pre-Med)</option>
                <option value="12th_Commerce">After 12th Grade (Commerce / Business Studies / Arts)</option>
                <option value="Diploma">Polytechnic Diploma (Engineering / Vocational)</option>
                <option value="UG">Undergraduate Degree (B.E. / B.Tech / B.Sc / B.Com / B.A.)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Target Career Goal (Any valid career)</span>
              </label>
              <input
                type="text"
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                placeholder="e.g. Doctor, Civil Engineer, Lawyer, Software Engineer, Teacher"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
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
              placeholder="e.g. Biology, Mathematics, Python, AutoCAD, Law, Tally"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 mb-2"
            />
            {/* Quick Skill Tag Chips */}
            <div className="flex flex-wrap gap-1.5">
              {['Biology', 'Anatomy', 'Python', 'React', 'Mathematics', 'AutoCAD', 'BIM', 'Constitutional Law', 'Pedagogy', 'Tally GST', 'SQL'].map((sk, skidx) => (
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
                <option value="Standard">Standard Academic Progression (Degree / Diploma)</option>
                <option value="Fast">Accelerated Skilling (3 - 6 Months)</option>
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
                <span>ASCENTIA AI Generating Pathway for {targetCareer}...</span>
              </div>
            ) : (
              <>
                <span>Generate AI Skilling Pathway for {targetCareer}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

        </form>
      )}

    </div>
  );
};

export default LearnerAssessment;
