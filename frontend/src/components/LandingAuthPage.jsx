import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User, Compass, 
  CheckCircle2, Award, GraduationCap, TrendingUp, Zap, Globe, Star,
  BookOpen, Calculator, DollarSign, ChevronRight, Play, Check
} from 'lucide-react';
import { TRANSLATIONS } from '../translations';

const LandingAuthPage = ({ onLoginSuccess, currentLang, setCurrentLang }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('sahana@ascentia.ai');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Computer Science Student');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    let userEmail = (email && typeof email === 'string') ? email.trim() : 'sahana@ascentia.ai';
    if (!userEmail) userEmail = 'sahana@ascentia.ai';

    let userName = (name && typeof name === 'string') ? name.trim() : '';
    if (!userName) {
      if (userEmail.includes('@')) {
        const parts = userEmail.split('@');
        if (parts[0]) {
          userName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        }
      }
    }
    if (!userName) {
      userName = isSignUp ? 'New Learner' : 'Sahana Balaji';
    }

    const userData = {
      name: userName,
      email: userEmail,
      role: role || 'Computer Science Student'
    };

    onLoginSuccess(userData);
  };

  const handleDemoLogin = () => {
    const userData = {
      name: 'Sahana Balaji',
      email: 'sahana@ascentia.ai',
      role: 'Computer Science Student'
    };
    onLoginSuccess(userData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-900">
      
      {/* Dynamic Background Mesh & Glowing Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-cyan-500/15 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-indigo-500/15 rounded-full blur-[160px]"></div>
        
        {/* Grid Line Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar - Mobile Optimized */}
        <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
          
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  {t.brand_title}
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80 text-[9px] sm:text-[10px] font-bold">
                  v2.0
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Language Selector Dropdown */}
            <div className="flex items-center space-x-1 bg-slate-900/90 border border-slate-800 px-2.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold hover:border-slate-700 transition-all">
              <Globe className="w-3 h-3 text-cyan-400" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-white">English</option>
                <option value="ta" className="bg-slate-900 text-white">தமிழ்</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
                <option value="te" className="bg-slate-900 text-white">తెలుగు</option>
                <option value="ml" className="bg-slate-900 text-white">മലയാളം</option>
              </select>
            </div>

            <button
              onClick={handleDemoLogin}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-[11px] sm:text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span>Explore</span>
            </button>

          </div>
        </header>

        {/* Hero & Auth Section - Compact Mobile Spacing */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Compact Announcement Badge */}
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-bold shadow-xl">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>TN Career Navigator • 38 Districts & Cutoffs</span>
            </div>

            {/* Title & Tagline Callout */}
            <div className="space-y-2.5 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                From Aspiration <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  To Achievement.
                </span>
              </h1>
              
              {/* Highlight Quote Box */}
              <div className="inline-block relative group max-w-full">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-blue-600 opacity-30 blur group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-slate-900/90 border border-cyan-500/40 px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-xl shadow-2xl backdrop-blur-xl">
                  <p className="text-xs sm:text-base lg:text-xl font-extrabold text-cyan-300 tracking-wide italic">
                    {t.quote}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              ASCENTIA AI maps your education to NSQF Levels 1–10, calculates TNEA engineering cutoffs out of 200 across 38 TN districts, finds government scholarships, and analyzes live hiring demand.
            </p>

            {/* Statistics Counters Grid - Mobile Compact 2x2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1">
              <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-cyan-400">38</h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-300">TN Districts</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-indigo-400">200</h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-300">TNEA Cutoff</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-amber-400">1-10</h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-300">NSQF Levels</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-black text-emerald-400">15+</h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-300">Scholarships</p>
              </div>
            </div>

          </div>

          {/* Right Side: Ultra-Sleek Mobile Compact Auth Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Glowing Border Aura */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-teal-400 opacity-40 blur-xl"></div>

            <div className="relative bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-2xl">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {isSignUp ? 'Create Free Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    {isSignUp ? 'Join ASCENTIA AI Platform' : 'Sign in to access your navigator'}
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${!isSignUp ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all ${isSignUp ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Instant 1-Click Demo Login Highlight Banner */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-3 px-3.5 mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-cyan-500/25 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all shadow-lg"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-300 fill-current" />
                <span>⚡ Instant 1-Click Demo Login</span>
              </button>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                
                {isSignUp && (
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sahana Balaji"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sahana@ascentia.ai"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">Status / Stream</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Computer Science Student">Computer Science Student</option>
                      <option value="School Student (12th PCM/PCB)">School Student (12th PCM/PCB)</option>
                      <option value="Diploma Student">Diploma Student</option>
                      <option value="Undergraduate Learner">Undergraduate Learner</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all mt-2 cursor-pointer active:scale-95"
                >
                  <span>{isSignUp ? 'Complete Registration' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>

            </div>
          </div>

        </main>

        {/* Compact Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-3 text-center text-[11px] text-slate-500">
          <p>© 2026 ASCENTIA AI — Smart Skilling Navigator. Built for Higher Education.</p>
        </footer>

      </div>

    </div>
  );
};

export default LandingAuthPage;
