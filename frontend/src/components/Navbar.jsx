import React, { useState } from 'react';
import { Compass, GraduationCap, TrendingUp, Bot, Award, Sparkles, User, LogOut, ChevronDown, Shield } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tabs = [
    { id: 'navigator', label: 'AI Skilling Navigator', icon: Compass },
    { id: 'colleges', label: 'Colleges & Cutoffs', icon: GraduationCap },
    { id: 'trends', label: 'Labor Market Intelligence', icon: TrendingUp },
    { id: 'scholarships', label: 'Scholarships & Grants', icon: Award },
    { id: 'chatbot', label: 'Ascentia AI Counselor', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('navigator')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400">
                  CAREER COMPASS
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-700/60 font-bold uppercase tracking-wider">
                  ASCENTIA AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Next-Gen Skilling & Career Guidance Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Auth Profile Area */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl px-3 py-1.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md ring-2 ring-cyan-500/50 uppercase shrink-0">
                    {user?.name ? user.name.trim().charAt(0) : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-white block leading-tight">{user.name}</span>
                    <span className="text-[10px] text-cyan-400 block font-medium">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-slate-800 flex items-center space-x-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Nav Bar */}
        <div className="md:hidden flex overflow-x-auto py-2.5 border-t border-slate-800 space-x-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-400 bg-slate-900/60 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
