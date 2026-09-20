import React, { useState } from 'react';
import { Award, CheckCircle, Clock, BookOpen, Briefcase, Download, Sparkles, Layers, CheckSquare, Square, Printer, FileText } from 'lucide-react';

const PathwayVisualizer = ({ recommendation }) => {
  const [completedSkills, setCompletedSkills] = useState([]);
  const [showPassportModal, setShowPassportModal] = useState(false);

  if (!recommendation) return null;

  const { learner_summary, recommended_qualifications, skilling_roadmap, stackable_skills } = recommendation;

  const toggleSkill = (skill) => {
    if (completedSkills.includes(skill)) {
      setCompletedSkills(completedSkills.filter((s) => s !== skill));
    } else {
      setCompletedSkills([...completedSkills, skill]);
    }
  };

  const progressPercentage = Math.round(
    ((completedSkills.length) / (stackable_skills.length || 1)) * 100
  );

  const handlePrintPassport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Match Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-700/60 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASCENTIA AI Pathway Generated</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Personalized Skilling Pathway: <span className="text-cyan-400">{learner_summary.target_career}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
            Mapped from <strong className="text-white">{learner_summary.education}</strong> qualification level with alignment to NSQF Level Standards & NCVET skilling guidelines.
          </p>

          {/* Interactive Progress Bar */}
          <div className="mt-4 max-w-md">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-semibold">Interactive Skill Completion Tracker:</span>
              <span className="text-cyan-400 font-bold">{completedSkills.length} / {stackable_skills.length} Completed ({progressPercentage}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800 rounded-2xl p-5 min-w-[200px] text-center shadow-xl shrink-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Career Match Score</span>
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {learner_summary.estimated_readiness}%
          </span>
          <span className="text-[10px] text-emerald-400 font-bold mt-1">High Employer Demand</span>

          <button
            onClick={() => setShowPassportModal(true)}
            className="mt-3 w-full py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Skilling Passport</span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Skilling Roadmap */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Interactive NSQF Skilling Roadmap</span>
            </h3>
            <p className="text-xs text-slate-400">Sequential progression from entry level to job deployment</p>
          </div>
          <span className="text-xs px-3 py-1 bg-slate-950 rounded-lg text-slate-300 border border-slate-800 font-bold">
            {skilling_roadmap.length} Progression Steps
          </span>
        </div>

        {/* Roadmap Steps */}
        <div className="relative pl-6 md:pl-8 border-l-2 border-slate-800 space-y-8">
          {skilling_roadmap.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-8 h-8 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center text-xs font-bold shadow-md shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                {step.step}
              </div>

              <div className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-cyan-400 tracking-wide uppercase">
                    {step.stage}
                  </span>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80 font-bold">
                      NSQF Level {step.nsqf_level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 flex items-center space-x-1 font-semibold">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{step.duration}</span>
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{step.description}</p>

                <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-slate-900 text-slate-400">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Type: <strong className="text-slate-200">{step.type}</strong></span>
                  </div>
                  {step.certifying_body && (
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Certifying Body: <strong className="text-white">{step.certifying_body}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Qualifications Cards */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Recommended NSQF Qualifications & Diplomas</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommended_qualifications.map((qual, idx) => (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                    {qual.sector}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/80">
                    {qual.match_score}% Match
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">{qual.qualification_name}</h4>
                <p className="text-xs text-slate-300 mb-4">{qual.description}</p>
                
                <div className="mb-4">
                  <span className="text-[10px] text-slate-400 block font-bold mb-1.5 uppercase">Skills Covered:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {qual.skills_covered.map((sk, sidx) => (
                      <span key={sidx} className="text-xs px-2.5 py-0.5 bg-slate-950 text-cyan-300 rounded border border-slate-800 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target Role: <strong className="text-slate-200">{qual.next_job_roles[0]}</strong></span>
                </div>
                <span className="text-amber-400 font-bold">{qual.certifying_body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Micro-credential Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Interactive Skill Tracker (Click to check off acquired competencies)</span>
        </h4>
        <p className="text-xs text-slate-400 mb-4">Click any skill badge to update your live completion progress bar</p>

        <div className="flex flex-wrap gap-2">
          {stackable_skills.map((skill, idx) => {
            const isDone = completedSkills.includes(skill);
            return (
              <button
                key={idx}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  isDone
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80 shadow-md'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {isDone ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                <span>{skill}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skilling Passport Printable Modal */}
      {showPassportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>ASCENTIA Official Skilling Passport Summary</span>
                </h3>
                <p className="text-xs text-slate-400">Verified NSQF Qualification Credential Summary</p>
              </div>
              <button
                onClick={() => setShowPassportModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-slate-400 block">Learner Qualification:</span>
                  <strong className="text-white text-sm">{learner_summary.education}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Target Career Path:</span>
                  <strong className="text-cyan-400 text-sm">{learner_summary.target_career}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-bold mb-1">Primary NSQF Qualification:</span>
                <p className="text-slate-200 font-semibold">{recommended_qualifications[0]?.qualification_name}</p>
                <p className="text-slate-400">Certified by: {recommended_qualifications[0]?.certifying_body}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold mb-1">Stackable Competencies ({completedSkills.length}/{stackable_skills.length}):</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stackable_skills.map((sk, sidx) => (
                    <span key={sidx} className={`px-2 py-0.5 rounded text-[11px] ${completedSkills.includes(sk) ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold' : 'bg-slate-900 text-slate-400'}`}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handlePrintPassport}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PathwayVisualizer;
