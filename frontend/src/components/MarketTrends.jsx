import React, { useState, useEffect } from 'react';
import { TrendingUp, Briefcase, DollarSign, Building2, CheckCircle2, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import axios from 'axios';

const MarketTrends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/market-trends');
      setTrends(res.data.market_trends);
    } catch (err) {
      console.error('Error fetching trends:', err);
      // Fallback seed
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
          domain: "Full Stack & Cloud",
          demand_score: 82,
          growth_rate: "+28% YoY",
          top_skills: ["React.js", "FastAPI", "PostgreSQL", "Docker", "AWS"],
          avg_entry_salary: "₹3.8 - ₹6.5 LPA",
          avg_mid_salary: "₹9.0 - ₹18.0 LPA",
          hiring_companies: ["Accenture", "Wipro", "Infosys", "PayPal", "LTI Mindtree"]
        },
        {
          id: 3,
          domain: "Cyber Security",
          demand_score: 89,
          growth_rate: "+30% YoY",
          top_skills: ["Network Security", "Ethical Hacking", "SIEM Tools", "Linux Admin"],
          avg_entry_salary: "₹4.0 - ₹6.8 LPA",
          avg_mid_salary: "₹10.0 - ₹20.0 LPA",
          hiring_companies: ["Cisco", "PwC", "Deloitte", "Trend Micro", "HCL Tech"]
        },
        {
          id: 4,
          domain: "EV & Green Tech",
          demand_score: 74,
          growth_rate: "+42% YoY",
          top_skills: ["Battery Management", "Embedded Systems", "MATLAB", "CAN Protocol"],
          avg_entry_salary: "₹3.5 - ₹5.5 LPA",
          avg_mid_salary: "₹8.0 - ₹15.0 LPA",
          hiring_companies: ["Ather Energy", "TVS Motor", "Ola Electric", "Bosch"]
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
    name: t.domain.split('&')[0],
    score: t.demand_score
  }));

  const colors = ['#0284c7', '#10b981', '#6366f1', '#f59e0b'];

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
        {trends.map((item, idx) => (
          <div key={item.id} className="bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 rounded-2xl p-6 transition-all shadow-lg">
            
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-white">{item.domain}</h4>
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
        ))}
      </div>

    </div>
  );
};

export default MarketTrends;
