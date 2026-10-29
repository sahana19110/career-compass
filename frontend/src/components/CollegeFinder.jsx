import React, { useState, useEffect } from 'react';
import { Search, MapPin, GraduationCap, ExternalLink, CheckCircle, Star, Calculator, Award, Sparkles, Filter, CheckCircle2, AlertCircle, TrendingUp, ShieldCheck, ArrowUpDown } from 'lucide-react';
import axios from 'axios';

const ALL_38_DISTRICTS = [
  "All Districts (38 Districts)",
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
  "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

const GRADIENT_VARIANTS = [
  "from-indigo-900 via-slate-900 to-indigo-950",
  "from-cyan-900 via-slate-900 to-cyan-950",
  "from-purple-900 via-slate-900 to-purple-950",
  "from-rose-900 via-slate-900 to-rose-950",
  "from-emerald-900 via-slate-900 to-emerald-950",
  "from-amber-900 via-slate-900 to-amber-950",
  "from-blue-900 via-slate-900 to-blue-950"
];

const getCollegeRating = (col, idx) => {
  if (col.rating) return col.rating;
  const baseRatings = [4.9, 4.8, 4.7, 4.6, 4.9, 4.5, 4.8, 4.7, 4.6, 4.4];
  return baseRatings[idx % baseRatings.length];
};

const getCollegeInitials = (name) => {
  if (!name) return 'TN';
  const match = name.match(/\(([^)]+)\)/);
  if (match && match[1].length <= 6) {
    return match[1];
  }
  const noise = ['of', 'and', '&', 'for', 'the', 'in', 'at'];
  const words = name.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => !noise.includes(w.toLowerCase()));
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').substring(0, 4).toUpperCase();
};

const CollegeFinder = ({ activeCareer }) => {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts (38 Districts)');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStream, setSelectedStream] = useState('All');
  const [onlyNirf, setOnlyNirf] = useState(false);
  const [sortBy, setSortBy] = useState('cutoff'); // 'cutoff', 'rating', 'fees'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeCareer) {
      const cLower = activeCareer.toLowerCase();
      if (cLower.includes('doctor') || cLower.includes('medic')) setSelectedStream('Medical');
      else if (cLower.includes('law') || cLower.includes('advocat')) setSelectedStream('Law');
      else if (cLower.includes('teach') || cLower.includes('educat')) setSelectedStream('Education');
      else if (cLower.includes('account') || cLower.includes('commerce') || cLower.includes('finance')) setSelectedStream('Commerce/Arts');
      else if (cLower.includes('agri') || cLower.includes('farm')) setSelectedStream('Agriculture');
      else if (cLower.includes('design') || cLower.includes('fashion') || cLower.includes('ui/ux')) setSelectedStream('Design');
      else if (cLower.includes('pharma') || cLower.includes('drug')) setSelectedStream('Pharmacy');
      else if (cLower.includes('pilot') || cLower.includes('aviat')) setSelectedStream('Aviation');
      else if (cLower.includes('software') || cLower.includes('civil') || cLower.includes('engineer') || cLower.includes('data') || cLower.includes('robot')) setSelectedStream('Engineering');
    }
  }, [activeCareer]);

  const [isWakingUp, setIsWakingUp] = useState(false);
  const [isError, setIsError] = useState(false);
  const [failedImages, setFailedImages] = useState({});

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
    setIsWakingUp(false);
    setIsError(false);

    const wakeTimer = setTimeout(() => {
      setIsWakingUp(true);
    }, 5000);

    try {
      const res = await axios.get('/api/colleges', {
        params: {
          district: selectedDistrict,
          type: selectedType,
          stream_type: selectedStream,
          search: search
        }
      });
      setColleges(res.data.colleges);
    } catch (err) {
      console.error('Error fetching colleges:', err);
      setIsError(true);
    } finally {
      clearTimeout(wakeTimer);
      setLoading(false);
      setIsWakingUp(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [selectedDistrict, selectedType, selectedStream, search]);

  // Combined Filter & Sort Pipeline
  let processedColleges = colleges.filter((col) => {
    // Cutoff Eligibility Filter (Only applies to Engineering colleges)
    if (filterByCutoff) {
      const isEng = col.stream_type === 'Engineering';
      if (isEng) {
        const benchmark = col.cutoff_marks[selectedCommunity] || col.cutoff_marks.BC || col.cutoff_marks.OC || 160;
        if (typeof benchmark === 'number' && parseFloat(computedCutoff) < benchmark) {
          return false;
        }
      }
    }
    // NIRF Top Ranked Filter
    if (onlyNirf) {
      if (!col.nirf_rank || col.nirf_rank.includes('State Govt') || col.nirf_rank.includes('Autonomous')) {
        return false;
      }
    }
    return true;
  });

  // Sorting Logic
  processedColleges.sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 4.8) - (a.rating || 4.8);
    }
    if (sortBy === 'fees') {
      const parseFees = (fStr) => {
        if (!fStr) return 999999;
        const num = fStr.replace(/[^0-9]/g, '');
        return parseInt(num, 10) || 999999;
      };
      return parseFees(a.fees_per_year) - parseFees(b.fees_per_year);
    }
    // Default Cutoff Benchmark (High to Low)
    const cutA = a.cutoff_marks[selectedCommunity] || a.cutoff_marks.BC || a.cutoff_marks.OC || 160;
    const cutB = b.cutoff_marks[selectedCommunity] || b.cutoff_marks.BC || b.cutoff_marks.OC || 160;
    return (typeof cutB === 'number' ? cutB : 0) - (typeof cutA === 'number' ? cutA : 0);
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/80 border border-slate-700/60 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-7 h-7 text-cyan-400" />
              <span>Tamil Nadu Colleges & TNEA Admission Allocation Predictor</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Filter institutions across all 38 districts with NIRF ranks, verified placement metrics, and admission cutoffs.
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
          <div className="mt-6 bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 sm:p-5 animate-fade-in shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                <Calculator className="w-4 h-4 shrink-0" />
                <span>TNEA Engineering Cutoff Calculator & Admission Predictor</span>
              </h4>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-slate-300 shrink-0">Quota:</span>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold focus:outline-none w-full sm:w-auto"
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

        {/* Filter & Sorting Toolbar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          <div className="relative lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search college..."
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
              <option value="All">All Streams</option>
              <option value="Engineering">Engineering (B.E / B.Tech)</option>
              <option value="Medical">Medical & Healthcare (M.B.B.S., Allied)</option>
              <option value="Agriculture">Agriculture & Bio-Systems (TNAU)</option>
              <option value="Design">Design & Fashion (NIFT)</option>
              <option value="Pharmacy">Pharmacy & Healthcare (B.Pharm)</option>
              <option value="Aviation">Aviation & Flight Training (CPL)</option>
              <option value="Law">Law (B.A. LL.B., LL.M.)</option>
              <option value="Education">Education & Teaching (B.Ed)</option>
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
              <option value="All">All Types</option>
              <option value="Government Autonomous">Government Autonomous</option>
              <option value="Government Aided">Government Aided</option>
              <option value="Private Autonomous">Private Autonomous</option>
              <option value="Polytechnic">Polytechnic</option>
            </select>
          </div>

          <div className="relative flex items-center space-x-2">
            <button
              onClick={() => setOnlyNirf(!onlyNirf)}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center space-x-1.5 transition-all ${
                onlyNirf
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950 text-slate-400 border-slate-700/80 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{onlyNirf ? '🏆 NIRF Top Ranked Only' : 'Filter Top NIRF'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Server Waking Up Notice Banner */}
      {isWakingUp && (
        <div className="p-4 bg-amber-950/80 border border-amber-500/50 rounded-2xl text-amber-300 text-xs font-bold flex items-center space-x-3 animate-pulse shadow-xl">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>Render free server waking up from sleep mode. Please wait 10-15 seconds for real-time college dataset...</span>
        </div>
      )}

      {/* Loading & Error States */}
      {loading ? (
        <div className="p-16 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-slate-200 text-sm">Fetching Colleges & TNEA Benchmarks across Tamil Nadu...</p>
        </div>
      ) : isError ? (
        <div className="p-12 text-center bg-rose-950/40 border border-rose-800/60 rounded-3xl space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h4 className="text-base font-bold text-white">Temporary Network Error</h4>
          <p className="text-xs text-slate-400">Could not fetch college data from backend service.</p>
          <button
            onClick={fetchColleges}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
          >
            🔄 Retry Fetching Colleges
          </button>
        </div>
      ) : processedColleges.length === 0 ? (
        <div className="mt-8 p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-base font-bold text-white">No Colleges Found Matching Criteria</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your filters or cutoff eligibility setting to view all institutions.
          </p>
          <button
            onClick={() => {
              setFilterByCutoff(false);
              setOnlyNirf(false);
              setSearch('');
            }}
            className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters & Show All Colleges
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processedColleges.map((col, idx) => {
            const isMedical = col.stream_type === 'Medical' || col.name.toLowerCase().includes('medical');
            const isLaw = col.stream_type === 'Law' || col.name.toLowerCase().includes('law');
            const isEducation = col.stream_type === 'Education' || col.courses_offered.some(c => c.toLowerCase().includes('b.ed'));
            const isPolytechnic = col.stream_type === 'Polytechnic' || col.type === 'Polytechnic' || col.name.toLowerCase().includes('polytechnic');
            const isArtsScience = col.stream_type === 'Commerce/Arts' || col.name.toLowerCase().includes('arts') || col.name.toLowerCase().includes('loyola') || col.name.toLowerCase().includes('mcc') || col.name.toLowerCase().includes('presidency');
            const isAgriculture = col.stream_type === 'Agriculture' || col.name.toLowerCase().includes('agricultural') || col.name.toLowerCase().includes('tnau');
            const isDesign = col.stream_type === 'Design' || col.name.toLowerCase().includes('fashion') || col.name.toLowerCase().includes('nift');
            const isPharmacy = col.stream_type === 'Pharmacy' || col.name.toLowerCase().includes('pharmacy');
            const isAviation = col.stream_type === 'Aviation' || col.name.toLowerCase().includes('flying') || col.name.toLowerCase().includes('aviation');
            const isEngineering = !isMedical && !isLaw && !isEducation && !isPolytechnic && !isArtsScience && !isAgriculture && !isDesign && !isPharmacy && !isAviation;

            const benchmark = col.cutoff_marks[selectedCommunity] || col.cutoff_marks.BC || col.cutoff_marks.OC || 160;
            const userScore = parseFloat(computedCutoff);
            const isDirectEligible = typeof benchmark === 'number' ? userScore >= benchmark : true;
            const isCoreEligible = typeof benchmark === 'number' ? (userScore >= benchmark - 20 && userScore < benchmark) : false;

            const hasPhoto = col.image_url && col.image_url.trim() !== '' && !failedImages[col.id];
            const gradientBg = GRADIENT_VARIANTS[idx % GRADIENT_VARIANTS.length];
            const initials = getCollegeInitials(col.name);

            return (
              <div key={col.id} className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl overflow-hidden transition-all shadow-xl flex flex-col justify-between group">
                
                {/* Photo & Header Overlay */}
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${gradientBg} flex items-center justify-center`}>
                  {hasPhoto ? (
                    <img
                      src={col.image_url}
                      alt={col.name}
                      onError={() => {
                        setFailedImages((prev) => ({ ...prev, [col.id]: true }));
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center select-none">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                        <span className="text-2xl font-black text-amber-300 tracking-widest">{initials}</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none"></div>
                  
                  {/* Top Left Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[75%]">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-700/60 font-extrabold backdrop-blur-md">
                      📍 {col.district}
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-extrabold backdrop-blur-md">
                      {col.type}
                    </span>
                    {col.nirf_rank && (
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-950/90 text-amber-300 border border-amber-600/70 font-extrabold backdrop-blur-md flex items-center space-x-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        <span>{col.nirf_rank}</span>
                      </span>
                    )}
                  </div>

                  {/* Admission Eligibility Badge */}
                  <div className="absolute bottom-3 left-3">
                    {isMedical ? (
                      <span className="text-[10px] px-3 py-1 bg-rose-950/90 text-rose-300 border border-rose-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>NEET-UG Medical Admission (Eligibility: 50%+ in PCB)</span>
                      </span>
                    ) : isAgriculture ? (
                      <span className="text-[10px] px-3 py-1 bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>ICAR / TNAU Single-Window Agriculture Counselling</span>
                      </span>
                    ) : isDesign ? (
                      <span className="text-[10px] px-3 py-1 bg-pink-950/90 text-pink-300 border border-pink-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                        <span>NIFT National Entrance Examination (CAT & GAT)</span>
                      </span>
                    ) : isPharmacy ? (
                      <span className="text-[10px] px-3 py-1 bg-teal-950/90 text-teal-300 border border-teal-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                        <span>TN Health Paramedical Single-Window Counselling</span>
                      </span>
                    ) : isAviation ? (
                      <span className="text-[10px] px-3 py-1 bg-sky-950/90 text-sky-300 border border-sky-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                        <span>DGCA Class 1 & 2 Medical + 12th PCM 50%+</span>
                      </span>
                    ) : isLaw ? (
                      <span className="text-[10px] px-3 py-1 bg-amber-950/90 text-amber-300 border border-amber-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>BCI / TNDALU State Law Merit Admission</span>
                      </span>
                    ) : isEducation ? (
                      <span className="text-[10px] px-3 py-1 bg-blue-950/90 text-blue-300 border border-blue-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>NCTE Approved B.Ed Teacher Admission</span>
                      </span>
                    ) : isPolytechnic ? (
                      <span className="text-[10px] px-3 py-1 bg-indigo-950/90 text-indigo-300 border border-indigo-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>SSLC 10th / 12th Merit Diploma Admission</span>
                      </span>
                    ) : isArtsScience ? (
                      <span className="text-[10px] px-3 py-1 bg-purple-950/90 text-purple-300 border border-purple-700/80 rounded-full font-extrabold flex items-center space-x-1 backdrop-blur-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>12th HSC Marks Based Merit Allocation</span>
                      </span>
                    ) : isDirectEligible ? (
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

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-amber-950/90 text-amber-300 border border-amber-800/80 px-2.5 py-0.5 rounded-lg text-xs font-bold backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{getCollegeRating(col, idx)}</span>
                  </div>

                  {/* Photo Credit */}
                  {hasPhoto && col.photo_attribution && (
                    <div className="absolute bottom-1 right-2 text-[8px] text-slate-300/80 bg-slate-950/75 px-1.5 py-0.5 rounded backdrop-blur-xs max-w-[160px] truncate pointer-events-none">
                      📷 {col.photo_attribution}
                    </div>
                  )}
                </div>

                {/* Card Main Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors leading-snug">
                      {col.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{col.location}, {col.district} District, {col.state}</span>
                    </p>

                    {/* Placement Stats & NAAC Accreditation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {col.placement_stats && (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 flex items-center space-x-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{col.placement_stats}</span>
                        </div>
                      )}
                      {col.accreditation && (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300 flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">{col.accreditation}</span>
                        </div>
                      )}
                    </div>

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
                      {isMedical ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NEET-UG Cutoff Score:</span>
                          <span className="text-xs font-bold text-rose-400">
                            BC: {col.cutoff_marks.NEET_BC || 635} | OC: {col.cutoff_marks.NEET_OC || 655} / 720
                          </span>
                        </>
                      ) : isAgriculture ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TNAU Merit Cutoff:</span>
                          <span className="text-xs font-bold text-emerald-400">
                            BC: {col.cutoff_marks.BC || 186} | OC: {col.cutoff_marks.OC || 191} / 200
                          </span>
                        </>
                      ) : isDesign ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NIFT National Entrance Merit:</span>
                          <span className="text-xs font-bold text-pink-400">
                            Rank: {col.cutoff_marks.NIFT_Rank || '< 1200'} | Score: {col.cutoff_marks.CAT_GAT_Score || '> 65'}
                          </span>
                        </>
                      ) : isPharmacy ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paramedical Cutoff (TN Health):</span>
                          <span className="text-xs font-bold text-teal-400">
                            BC: {col.cutoff_marks.BC || 188.5} | OC: {col.cutoff_marks.OC || 194} / 200
                          </span>
                        </>
                      ) : isAviation ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">DGCA Commercial Pilot Eligibility:</span>
                          <span className="text-xs font-bold text-sky-400">
                            Class 1 Medical | Min 12th PCM: {col.cutoff_marks.Min_12th_PCM || '55%'}
                          </span>
                        </>
                      ) : isLaw ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">12th HSC / CLAT Merit:</span>
                          <span className="text-xs font-bold text-amber-400">
                            BC: {col.cutoff_marks.BC || 85}% | OC: {col.cutoff_marks.OC || 90}%
                          </span>
                        </>
                      ) : isEducation ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">B.Ed Teacher Degree Merit:</span>
                          <span className="text-xs font-bold text-blue-400">
                            BC: {col.cutoff_marks.BC || 82}% | OC: {col.cutoff_marks.OC || 86}%
                          </span>
                        </>
                      ) : isPolytechnic ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SSLC 10th Marks Cutoff:</span>
                          <span className="text-xs font-bold text-indigo-400">
                            BC: {col.cutoff_marks.BC || 80}% | OC: {col.cutoff_marks.OC || 85}%
                          </span>
                        </>
                      ) : isArtsScience ? (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">12th HSC Board Cutoff:</span>
                          <span className="text-xs font-bold text-purple-400">
                            BC: {col.cutoff_marks.BC || 90}% | OC: {col.cutoff_marks.OC || 95}%
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TNEA Cutoff Benchmark ({selectedCommunity}):</span>
                          <span className="text-xs font-bold text-amber-400">
                            {selectedCommunity}: {benchmark} | OC: {col.cutoff_marks.OC || benchmark} / 200
                          </span>
                        </>
                      )}
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
