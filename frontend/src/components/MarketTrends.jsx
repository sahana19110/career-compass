import React, { useState, useEffect } from 'react';
import { TrendingUp, Briefcase, DollarSign, Building2, CheckCircle2, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import axios from 'axios';

const MarketTrends = ({ activeCareer }) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/market-trends');
      setTrends(res.data.market_trends);
    } catch (err) {
      console.error('Error fetching trends:', err);
      // Fallback seed covering multi-sector fields
      setTrends([
        {
          id: 1,
          domain: "Artificial Intelligence & ML",
          demand_score: 96,
          growth_rate: "+34% YoY",
          top_skills: ["Python", "TensorFlow", "FastAPI", "Data Modeling", "Prompt Engineering"],
          avg_entry_salary: "₹4.5 - ₹7.5 LPA",
          avg_mid_salary: "₹12.0 - ₹24.0 LPA",
          hiring_companies: ["TCS", "Zoho", "Cognizant", "Microsoft", "Freshworks"]
        },
        {
          id: 2,
          domain: "Clinical Medicine & Healthcare",
          demand_score: 95,
          growth_rate: "+24% YoY",
          top_skills: ["Patient Care", "Diagnostic Reasoning", "Pharmacology", "Clinical Research"],
          avg_entry_salary: "₹7.0 - ₹12.0 LPA",
          avg_mid_salary: "₹18.0 - ₹35.0 LPA",
          hiring_companies: ["Apollo Hospitals", "Fortis", "Kauvery Hospital", "Govt Health Services"]
        },
        {
          id: 3,
          domain: "Data Science & Big Data Analytics",
          demand_score: 94,
          growth_rate: "+32% YoY",
          top_skills: ["Python & Pandas", "SQL", "Power BI / Tableau", "Machine Learning"],
          avg_entry_salary: "₹4.2 - ₹7.0 LPA",
          avg_mid_salary: "₹11.0 - ₹22.0 LPA",
          hiring_companies: ["LatentView", "Mu Sigma", "Tiger Analytics", "Zoho"]
        },
        {
          id: 4,
          domain: "Full Stack & Cloud",
          demand_score: 92,
          growth_rate: "+28% YoY",
          top_skills: ["React.js", "FastAPI", "PostgreSQL", "Docker", "AWS"],
          avg_entry_salary: "₹3.8 - ₹6.5 LPA",
          avg_mid_salary: "₹9.0 - ₹18.0 LPA",
          hiring_companies: ["Accenture", "Wipro", "Infosys", "PayPal", "LTI Mindtree"]
        },
        {
          id: 5,
          domain: "Civil Infrastructure & Smart Cities",
          demand_score: 86,
          growth_rate: "+22% YoY",
          top_skills: ["BIM (Revit)", "AutoCAD", "STAAD.Pro", "Concrete Tech"],
          avg_entry_salary: "₹3.5 - ₹5.5 LPA",
          avg_mid_salary: "₹8.0 - ₹16.0 LPA",
          hiring_companies: ["Larsen & Toubro (L&T)", "Shapoorji Pallonji", "Tata Projects", "PWD TN"]
        },
        {
          id: 6,
          domain: "Corporate Law & Legal Advisory",
          demand_score: 88,
          growth_rate: "+20% YoY",
          top_skills: ["Contract Drafting", "Corporate Compliance", "Litigation", "Arbitration"],
          avg_entry_salary: "₹4.5 - ₹8.0 LPA",
          avg_mid_salary: "₹12.0 - ₹28.0 LPA",
          hiring_companies: ["Shardul Amarchand", "AZB & Partners", "Cyril Amarchand", "Corporate In-House"]
        },
        {
          id: 7,
          domain: "Education, Pedagogy & EdTech",
          demand_score: 84,
          growth_rate: "+18% YoY",
          top_skills: ["Curriculum Design", "Smart Pedagogy", "Child Psychology", "EdTech LMS"],
          avg_entry_salary: "₹3.0 - ₹5.0 LPA",
          avg_mid_salary: "₹6.5 - ₹12.0 LPA",
          hiring_companies: ["Kendriya Vidyalaya", "Matriculation Schools", "BYJU'S/Aakash", "Teach For India"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const chartData = trends.map((t) => ({
    name: t.domain.split('&')[0].trim(),
    score: t.demand_score
  }));

  const colors = ['#0284c7', '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Industry Demand Estimates 2026</h2>
            <p className="text-xs text-slate-400">Projected hiring demand, top skill requirements, and entry/mid-level salary insights</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 md:p-8">
        <h3 className="text-base font-bold text-white mb-6 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>Industry Skill Demand Index (out of 100) — 2026 Projections</span>
        </h3>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold">Loading Demand Index Data...</span>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#38bdf8', fontSize: 12, fontWeight: 'bold' }}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detailed Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.map((item, idx) => {
          const isUserMatch = activeCareer && (
            (activeCareer.toLowerCase().includes('doctor') && item.domain.includes('Medicine')) ||
            (activeCareer.toLowerCase().includes('civil') && item.domain.includes('Civil')) ||
            (activeCareer.toLowerCase().includes('law') && item.domain.includes('Law')) ||
            (activeCareer.toLowerCase().includes('teach') && item.domain.includes('Education')) ||
            (activeCareer.toLowerCase().includes('data') && item.domain.includes('Data Science')) ||
            (activeCareer.toLowerCase().includes('software') && item.domain.includes('Full Stack')) ||
            (activeCareer.toLowerCase().includes('ai') && item.domain.includes('Artificial Intelligence')) ||
            (activeCareer.toLowerCase().includes('account') && item.domain.includes('Accounting')) ||
            (activeCareer.toLowerCase().includes('ev') && item.domain.includes('EV'))
          );

          return (
            <div
              key={item.id}
              className={`border rounded-2xl p-6 transition-all shadow-lg ${
                isUserMatch
                  ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/30 shadow-cyan-500/10'
                  : 'bg-slate-800/60 border-slate-700/60 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-bold text-white">{item.domain}</h4>
                  {isUserMatch && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-extrabold">
                      🎯 Your Selected Goal
                    </span>
                  )}
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {item.growth_rate}
                </span>
              </div>

            {/* Salary Expectations */}
            <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-900/80 rounded-xl p-3 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Entry Level Salary:</span>
                <span className="text-xs font-bold text-cyan-400">{item.avg_entry_salary}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Mid-Senior Salary:</span>
                <span className="text-xs font-bold text-emerald-400">{item.avg_mid_salary}</span>
              </div>
            </div>

            {/* Top In-Demand Skills */}
            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Most Demanded Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {item.top_skills.map((sk, sidx) => (
                  <span key={sidx} className="text-xs px-2.5 py-0.5 bg-slate-900 text-slate-200 rounded border border-slate-700">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Hiring Companies */}
            <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Top Employers:</span>
              </div>
              <span className="text-slate-200 font-medium">{item.hiring_companies.join(', ')}</span>
            </div>

          </div>
          );
        })}
      </div>

    </div>
  );
};

export default MarketTrends;
