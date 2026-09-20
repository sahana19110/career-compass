import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar, CheckCircle2, DollarSign, Search } from 'lucide-react';
import axios from 'axios';

const ScholarshipFinder = () => {
  const [scholarships, setScholarships] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/scholarships', {
        params: { search: search || undefined }
      });
      setScholarships(res.data.scholarships);
    } catch (err) {
      console.error('Error fetching scholarships:', err);
      // Fallback seed
      setScholarships([
        {
          id: 1,
          title: "AICTE Pragati Scholarship for Girl Students",
          offered_by: "Ministry of Education / AICTE",
          eligibility: "Female students admitted to 1st year Degree/Diploma program with family income < ₹8 Lakh/annum.",
          amount_per_year: "₹50,000 per annum",
          deadline: "31st Oct 2026",
          application_url: "https://scholarships.gov.in"
        },
        {
          id: 2,
          title: "Tamil Nadu First Graduate Scholarship",
          offered_by: "Government of Tamil Nadu",
          eligibility: "Students pursuing professional courses who are the first in their family to attend college.",
          amount_per_year: "Tuition fee waiver (Up to ₹20,000 - ₹50,000/year)",
          deadline: "Check portal for 2026 dates",
          application_url: "https://tneaonline.org"
        },
        {
          id: 3,
          title: "Post-Matric Scholarship Scheme for SC/ST/SCC",
          offered_by: "Ministry of Social Justice & Empowerment",
          eligibility: "SC/ST students pursuing Higher Secondary, Diploma, Degree, or PG programs.",
          amount_per_year: "100% Maintenance allowance + Full tuition fee coverage",
          deadline: "30th Nov 2026",
          application_url: "https://scholarships.gov.in"
        },
        {
          id: 4,
          title: "PM-USP Central Sector Scheme for College & University Students",
          offered_by: "Department of Higher Education",
          eligibility: "Top 20th percentile students of Class 12 board exams with annual family income < ₹4.5 Lakh.",
          amount_per_year: "₹12,000 per annum for Graduation",
          deadline: "31st Dec 2026",
          application_url: "https://scholarships.gov.in"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [search]);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>National & State Scholarship Portal</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Financial support, fee waivers, and merit-based stipends for school graduates, polytechnic, and degree candidates.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scholarship by title or criteria..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Grid of Scholarships */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholarships.map((sch) => (
          <div key={sch.id} className="bg-slate-800/60 border border-slate-700/60 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-lg">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 font-semibold">
                  {sch.offered_by}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deadline: <strong className="text-white">{sch.deadline}</strong></span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{sch.title}</h3>
              
              <div className="mb-4 bg-slate-900/70 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Eligibility Criteria:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{sch.eligibility}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium uppercase">Financial Assistance:</span>
                <span className="text-sm font-extrabold text-emerald-400">{sch.amount_per_year}</span>
              </div>

              <a
                href={sch.application_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ScholarshipFinder;
