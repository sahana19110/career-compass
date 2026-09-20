import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LandingAuthPage from './components/LandingAuthPage';
import LearnerAssessment from './components/LearnerAssessment';
import PathwayVisualizer from './components/PathwayVisualizer';
import UpskillingHub from './components/UpskillingHub';
import CollegeFinder from './components/CollegeFinder';
import MarketTrends from './components/MarketTrends';
import ScholarshipFinder from './components/ScholarshipFinder';
import AIChatbot from './components/AIChatbot';
import { TRANSLATIONS } from './translations';
import { Sparkles, CheckCircle2, Menu, X } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null); // Defaults to null -> Shows Login / Sign Up first!
  const [activeTab, setActiveTab] = useState('navigator');
  const [currentLang, setCurrentLang] = useState('en');
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // If user is not logged in, show Auth / Sign Up Landing page FIRST
  if (!user) {
    return <LandingAuthPage onLoginSuccess={(userData) => setUser(userData)} currentLang={currentLang} setCurrentLang={setCurrentLang} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500 selection:text-white">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <span className="font-black text-lg text-white">{t.brand_title}</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 bg-slate-800 rounded-xl text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setMobileSidebarOpen(false);
            }}
            user={user}
            onLogout={() => setUser(null)}
            currentLang={currentLang}
            setCurrentLang={setCurrentLang}
          />
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={() => setUser(null)}
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 overflow-y-auto">
        
        {/* Top Welcome Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ASCENTIA AI Engine Active</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {t.welcome}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{user.name}</span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 italic font-semibold">
                {t.quote}
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950/90 border border-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-200">
                {recommendation
                  ? `🎯 Target: ${recommendation.learner_summary.target_career}`
                  : `🎓 Learner Profile: ${user.role || 'Computer Science Student'}`}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Components */}
        {activeTab === 'navigator' && (
          <div className="space-y-8">
            <LearnerAssessment
              onAssessmentComplete={(data) => setRecommendation(data)}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {recommendation && <PathwayVisualizer recommendation={recommendation} />}
          </div>
        )}

        {activeTab === 'upskill' && <UpskillingHub />}

        {activeTab === 'colleges' && <CollegeFinder />}

        {activeTab === 'trends' && <MarketTrends />}

        {activeTab === 'scholarships' && <ScholarshipFinder />}

        {activeTab === 'chatbot' && <AIChatbot />}

      </main>

    </div>
  );
}

export default App;
