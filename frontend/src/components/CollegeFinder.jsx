import React, { useState, useEffect } from 'react';
import { Search, MapPin, GraduationCap, ExternalLink, CheckCircle, Star, Calculator, Award, Sparkles, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ALL_38_DISTRICTS = [
  "All Districts (38 Districts)",
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar"
];

const COLLEGE_IMAGES = [
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=600&q=80"
];

const CollegeFinder = () => {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts (38 Districts)');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStream, setSelectedStream] = useState('All');
  const [loading, setLoading] = useState(false);

  // TNEA Cutoff Calculator & Prediction State
  const [mathsMarks, setMathsMarks] = useState(65);
  const [physicsMarks, setPhysicsMarks] = useState(69);
  const [chemistryMarks, setChemistryMarks] = useState(81);
  const [showCalculator, setShowCalculator] = useState(true);
  const [filterByCutoff, setFilterByCutoff] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState('BC');

  const computedCutoff = (
    parseFloat(mathsMarks || 0) +
    (parseFloat(physicsMarks || 0) / 2) +
    (parseFloat(chemistryMarks || 0) / 2)
  ).toFixed(2);

  const fetchColleges = async () => {
    setLoading(true);
    const cleanDistrict = selectedDistrict.includes("All Districts") ? undefined : selectedDistrict;
    try {
      const res = await axios.get('/api/colleges', {
        params: {
          search: search || undefined,
          district: cleanDistrict,
          type: selectedType !== 'All' ? selectedType : undefined,
          stream_type: selectedStream !== 'All' ? selectedStream : undefined
        }
      });
      setColleges(res.data.colleges);
    } catch (err) {
      console.error('Error fetching colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [search, selectedDistrict, selectedType, selectedStream]);

  // Cutoff Predictor Filter: Show colleges eligible for direct or core branch admission for student's score
  const displayedColleges = filterByCutoff
    ? colleges.filter((col) => {
        const benchmark = col.cutoff_marks[selectedCommunity] || col.cutoff_marks.BC || col.cutoff_marks.OC || 160;
        if (typeof benchmark === 'number') {
          return parseFloat(computedCutoff) >= (benchmark - 20);
        }
        return true;
      })
    : colleges;

  return (
    <div className="space-y-6">
      
      {/* Header Banner with TNEA Calculator Toggle */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-7 h-7 text-cyan-400" />
              <span>Tamil Nadu Colleges & TNEA Admission Allocation Predictor</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Filter institutions across all 38 districts and predict your admission eligibility based on previous years' TNEA cutoffs.
            </p>
          </div>

          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all shrink-0"
          >
            <Calculator className="w-4 h-4" />
            <span>{showCalculator ? 'Hide Predictor' : '🧮 TNEA Cutoff Predictor'}</span>
          </button>
        </div>

        {/* Interactive TNEA Cutoff Calculator Widget */}
        {showCalculator && (
          <div className="mt-6 bg-slate-950/90 border border-amber-500/40 rounded-2xl p-5 animate-fade-in shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                <Calculator className="w-4 h-4" />
                <span>TNEA Engineering Cutoff Calculator & Admission Predictor</span>
              </h4>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-300">Quota:</span>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold focus:outline-none"
                >
                  <option value="BC">BC (Backward Class)</option>
                  <option value="OC">OC (Open Competition)</option>
                  <option value="MBC">MBC (Most Backward Class)</option>
                  <option value="SC/ST">SC / ST</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Maths Marks (out of 100)</label>
                <input
                  type="number"
                  max="100"
                  min="0"
                  value={mathsMarks}
                  onChange={(e) => setMathsMarks(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Physics Marks (out of 100)</label>
                <input
                  type="number"
                  max="100"
                  min="0"
                  value={physicsMarks}
                  onChange={(e) => setPhysicsMarks(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Chemistry Marks (out of 100)</label>
                <input
                  type="number"
                  max="100"
                  min="0"
                  value={chemistryMarks}
                  onChange={(e) => setChemistryMarks(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block">TNEA Formula: Maths (100) + Phys/2 (50) + Chem/2 (50)</span>
                <span className="text-xl font-black text-amber-400 mt-0.5 block">Your Cutoff: {computedCutoff} / 200 ({selectedCommunity})</span>
              </div>

              <button
                type="button"
                onClick={() => setFilterByCutoff(!filterByCutoff)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-lg transition-all ${
                  filterByCutoff
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{filterByCutoff ? '✓ Showing ONLY Eligible Colleges' : `🎯 Filter Eligible Colleges for ${computedCutoff} Cutoff`}</span>
              </button>
            </div>
          </div>
        )}

        {/* 38 District Filter Controls */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by college name (e.g. Rajalakshmi, SVCE, Sairam, PSG)..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/50 rounded-2xl px-3.5 py-2.5 text-xs text-cyan-300 focus:outline-none font-bold cursor-pointer"
            >
              {ALL_38_DISTRICTS.map((dist) => (
                <option key={dist} value={dist} className="bg-slate-900 text-white">{dist}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="All">All Streams (Engineering, Poly, Arts)</option>
              <option value="Engineering">Engineering (B.E / B.Tech)</option>
              <option value="Commerce/Arts">Commerce & Arts (B.Com, BBA)</option>
              <option value="Polytechnic">Polytechnic Diploma</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="All">All Management Types</option>
              <option value="Government">Government / Autonomous</option>
              <option value="Polytechnic">Polytechnic</option>
              <option value="Private">Private Autonomous</option>
            </select>
          </div>

        </div>
      </div>

      {/* Filter Status Subheader */}
      {filterByCutoff && (
        <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center space-x-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Showing colleges matching cutoff score ({computedCutoff}) for {selectedCommunity} quota!</span>
          </div>
          <button
            onClick={() => setFilterByCutoff(false)}
            className="text-[11px] underline font-bold hover:text-white"
          >
            Show All Colleges
          </button>
        </div>
      )}

      {/* College Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Fetching Colleges across Tamil Nadu...
        </div>
      ) : displayedColleges.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="text-base font-bold text-white">No Colleges Found Matching Cutoff ({computedCutoff})</h4>
          <p className="text-xs text-slate-400">Click below to view all colleges or check core branch allocations.</p>
          <button
            onClick={() => setFilterByCutoff(false)}
            className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
          >
            Disable Cutoff Filter & Show All Colleges
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedColleges.map((col, idx) => {
            const benchmark = col.cutoff_marks[selectedCommunity] || col.cutoff_marks.BC || col.cutoff_marks.OC || 160;
            const userScore = parseFloat(computedCutoff);
            const isDirectEligible = typeof benchmark === 'number' ? userScore >= benchmark : true;
            const isCoreEligible = typeof benchmark === 'number' ? (userScore >= benchmark - 20 && userScore < benchmark) : false;

            return (
              <div key={col.id} className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl overflow-hidden transition-all shadow-xl flex flex-col justify-between group">
                
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={COLLEGE_IMAGES[idx % COLLEGE_IMAGES.length]}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-700/60 font-extrabold backdrop-blur-md">
                      📍 {col.district} District
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-extrabold backdrop-blur-md">
                      {col.type}
                    </span>
                  </div>

                  {typeof benchmark === 'number' && (
                    <div className="absolute bottom-3 left-3">
                      {isDirectEligible ? (
                        <span className="text-[10px] px-3 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Direct Admission Eligible ({computedCutoff} ≥ {benchmark})</span>
                        </span>
                      ) : isCoreEligible ? (
                        <span className="text-[10px] px-3 py-1 bg-cyan-950/90 text-cyan-300 border border-cyan-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Eligible for Core Branches / EEE / Mech / Civil</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-3 py-1 bg-amber-950/90 text-amber-300 border border-amber-800/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>High Cutoff Benchmark ({benchmark})</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-amber-950/90 text-amber-300 border border-amber-800/80 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>4.8</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors leading-snug">
                      {col.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{col.location}, {col.district} District, {col.state}</span>
                    </p>

                    <div className="mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Key Degrees & Programs Offered:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {col.courses_offered.map((crs, cidx) => (
                          <span key={cidx} className="text-xs px-2.5 py-1 bg-slate-950 text-slate-300 rounded-lg border border-slate-800">
                            {crs}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cutoff Benchmark ({selectedCommunity}):</span>
                      <span className="text-xs font-bold text-amber-400">
                        {selectedCommunity}: {benchmark} | OC: {col.cutoff_marks.OC}
                      </span>
                    </div>

                    <a
                      href={col.website}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition-colors"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CollegeFinder;
