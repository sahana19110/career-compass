import React from 'react';
import { Compass, GraduationCap, TrendingUp, Bot, Award, Globe, LogOut, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

const Sidebar = ({ activeTab, setActiveTab, user, onLogout, currentLang, setCurrentLang }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const navItems = [
    { id: 'navigator', label: t.nav_skilling, icon: Compass },
    { id: 'upskill', label: t.nav_upskill, icon: Zap },
    { id: 'colleges', label: t.nav_colleges, icon: GraduationCap },
    { id: 'trends', label: t.nav_trends, icon: TrendingUp },
    { id: 'scholarships', label: t.nav_scholarships, icon: Award },
    { id: 'chatbot', label: t.nav_chatbot, icon: Bot },
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen backdrop-blur-xl shadow-2xl">
      
      <div>
        {/* Top Header & Title */}
        <div className="p-6 border-b border-slate-800/80 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-white flex items-center space-x-1">
                <span>{t.brand_title}</span>
              </h1>
              <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider block">
                {t.smart_navigator}
              </span>
            </div>
          </div>

          {/* Highlighted Quote Callout Box */}
          <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-indigo-950/90 border border-cyan-500/40 rounded-2xl p-4 shadow-xl">
            <p className="text-xs font-extrabold text-cyan-300 italic leading-snug">
              {t.quote}
            </p>
          </div>

          {/* Language Selector Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-950/90 border border-slate-800 px-3.5 py-2 rounded-2xl shadow-inner">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none font-bold cursor-pointer w-full"
            >
              <option value="en" className="bg-slate-900 text-white">🇬🇧 English</option>
              <option value="ta" className="bg-slate-900 text-white">🇮🇳 தமிழ் (Tamil)</option>
              <option value="hi" className="bg-slate-900 text-white">🇮🇳 हिंदी (Hindi)</option>
              <option value="te" className="bg-slate-900 text-white">🇮🇳 తెలుగు (Telugu)</option>
              <option value="ml" className="bg-slate-900 text-white">🇮🇳 മലയാളം (Malayalam)</option>
            </select>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="p-4 space-y-2">
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-3 mb-1 block">
            Navigation Menu
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-xs transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/25 border border-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400 transition-colors'}`} />
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white/50 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer in Sidebar */}
      {user && (
        <div className="p-4 m-4 bg-slate-950/90 border border-slate-800 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center space-x-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md ring-2 ring-cyan-500/50 uppercase">
                {user?.name ? user.name.trim().charAt(0) : 'U'}
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
              <p className="text-[10px] text-cyan-400 truncate">{user.role}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 text-xs font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.sign_out}</span>
          </button>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;
