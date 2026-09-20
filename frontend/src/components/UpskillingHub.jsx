import React, { useState } from 'react';
import { 
  Zap, Award, CheckCircle, ArrowRight, BookOpen, Sparkles, Target, 
  Brain, ShieldCheck, PlayCircle, Star, Trophy, RefreshCw, ExternalLink,
  ChevronRight, CheckSquare, Square, X, AlertCircle, HelpCircle, Filter, Search
} from 'lucide-react';

const TARGET_CAREERS = [
  {
    id: 'ai_engineer',
    title: 'Full-Stack AI & RAG Engineer',
    category: 'Software & Artificial Intelligence',
    demand: 'Extreme (+45% YoY)',
    salary: '₹8.5L - ₹24L / yr',
    nsqf_level: 'Level 7-8',
    requiredSkills: ['Python', 'FastAPI', 'PyTorch & Transformers', 'React & Tailwind', 'RAG & Vector DBs', 'Docker & Deployment', 'Git & CI/CD'],
    initialUserSkills: ['Python', 'React & Tailwind', 'Git & CI/CD'],
    courses: [
      { name: 'NPTEL: Deep Learning & Natural Language Processing', provider: 'IIT Madras (NPTEL)', link: 'https://nptel.ac.in', duration: '12 Weeks' },
      { name: 'Skill India Digital: Artificial Intelligence Professional', provider: 'NCVET / NSDC', link: 'https://www.skillindiadigital.gov.in', duration: '8 Weeks' },
      { name: 'SWAYAM: Full Stack Web Development with Python', provider: 'IIT Roorkee', link: 'https://swayam.gov.in', duration: '10 Weeks' }
    ],
    quiz: [
      {
        question: 'Which vector database indexing technique is most commonly used in Retrieval-Augmented Generation (RAG)?',
        options: [
          'Cosine Similarity Indexing on Dense Embeddings',
          'B-Tree Indexing on Relational Keys',
          'Primary Key Hash Table Lookup',
          'Sequential File Access Array'
        ],
        correct: 0,
        explanation: 'Cosine Similarity on dense vector embeddings calculates semantic similarity between target queries and chunked documents.'
      },
      {
        question: 'What is the primary architectural advantage of FastAPI for Python AI microservices?',
        options: [
          'High-throughput asynchronous REST routing with automatic OpenAPI docs',
          'Relational database schema migration management',
          'Client-side HTML layout DOM rendering',
          'Native iOS & Android mobile app compilation'
        ],
        correct: 0,
        explanation: 'FastAPI leverages Starlette and Pydantic for high-performance async Python APIs with built-in Swagger documentation.'
      }
    ]
  },
  {
    id: 'ev_tech',
    title: 'EV Automotive Powertrain Specialist',
    category: 'Electric Vehicle & Hardware Tech',
    demand: 'Very High (+38% YoY)',
    salary: '₹6.0L - ₹18L / yr',
    nsqf_level: 'Level 6-7',
    requiredSkills: ['EV Battery Management (BMS)', 'Power Electronics', 'MATLAB & Simulink', 'Embedded C', 'CAN Bus Protocol', 'Motor Drive Controls'],
    initialUserSkills: ['Power Electronics', 'Embedded C'],
    courses: [
      { name: 'NPTEL: Electric Vehicles & Battery Management', provider: 'IIT Kharagpur', link: 'https://nptel.ac.in', duration: '8 Weeks' },
      { name: 'Skill India Digital: EV Powertrain Technician', provider: 'Automotive Skills Development Council', link: 'https://www.skillindiadigital.gov.in', duration: '6 Weeks' }
    ],
    quiz: [
      {
        question: 'What is the primary function of a Battery Management System (BMS) in Electric Vehicles?',
        options: [
          'Monitoring individual cell voltages, SOC, SOH, and thermal balance',
          'Regulating cabin air conditioning temperature',
          'Controlling electronic steering wheel tilt angle',
          'Generating FM radio audio frequencies'
        ],
        correct: 0,
        explanation: 'A BMS ensures pack safety and longevity by monitoring State of Charge (SOC), State of Health (SOH), cell balancing, and temperature.'
      },
      {
        question: 'Which communication protocol is universally standard for real-time inter-module EV communication?',
        options: [
          'CAN Bus Protocol (Controller Area Network)',
          'HTTP/1.1 REST Protocol',
          'Simple Mail Transfer Protocol (SMTP)',
          'FTP File Transfer Protocol'
        ],
        correct: 0,
        explanation: 'CAN Bus is the vehicle bus standard designed to allow microcontrollers and devices to communicate without a host computer.'
      }
    ]
  },
  {
    id: 'fintech_analyst',
    title: 'BFSI Fintech & Tax Analyst',
    category: 'Finance, Banking & Accounting',
    demand: 'High (+28% YoY)',
    salary: '₹5.5L - ₹15L / yr',
    nsqf_level: 'Level 5-6',
    requiredSkills: ['Tally Prime with GST', 'Financial Modeling', 'Corporate Taxation', 'Python for Finance', 'Advanced Excel & SQL', 'Regulatory Compliance'],
    initialUserSkills: ['Tally Prime with GST', 'Advanced Excel & SQL'],
    courses: [
      { name: 'SWAYAM: Financial Accounting & Taxation', provider: 'IIM Bangalore', link: 'https://swayam.gov.in', duration: '12 Weeks' },
      { name: 'NPTEL: Python for Financial Analytics', provider: 'IIT Kanpur', link: 'https://nptel.ac.in', duration: '8 Weeks' }
    ],
    quiz: [
      {
        question: 'Under Indian GST regulations, what electronic document is mandatory for transporting goods valued over ₹50,000?',
        options: [
          'E-Way Bill generated on the GST Portal',
          'Proforma Invoice Copy',
          'Bank Credit Note',
          'Supplier Purchase Order'
        ],
        correct: 0,
        explanation: 'An E-Way Bill is mandatory for inter-state and intra-state movement of goods valued above ₹50,000.'
      },
      {
        question: 'Which financial ratio measures a company’s capacity to cover short-term obligations with liquid assets?',
        options: [
          'Current Ratio / Quick Ratio',
          'Debt-to-Equity Ratio',
          'Price-to-Earnings Ratio',
          'Return on Capital Employed (ROCE)'
        ],
        correct: 0,
        explanation: 'The Current & Quick ratios analyze short-term liquidity by comparing current assets against current liabilities.'
      }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Cloud Security Architect',
    category: 'Information Security & Infrastructure',
    demand: 'Extreme (+42% YoY)',
    salary: '₹8.0L - ₹22L / yr',
    nsqf_level: 'Level 7-8',
    requiredSkills: ['Network Security & Firewalls', 'Ethical Hacking & VAPT', 'AWS & Cloud Security', 'SIEM & SOC Operations', 'Linux System Admin', 'Zero Trust Architecture'],
    initialUserSkills: ['Linux System Admin', 'Network Security & Firewalls'],
    courses: [
      { name: 'NPTEL: Information Security & Cybersecurity', provider: 'IIT Madras', link: 'https://nptel.ac.in', duration: '12 Weeks' },
      { name: 'Skill India Digital: Cyber Defense Certified Expert', provider: 'MeitY / NCVET', link: 'https://www.skillindiadigital.gov.in', duration: '10 Weeks' }
    ],
    quiz: [
      {
        question: 'What is the core principle of Zero Trust Cybersecurity Architecture?',
        options: [
          'Never Trust, Always Verify all identities & requests',
          'Trust all requests within internal office LAN',
          'Verify only external guest WiFi connections',
          'Allow passwordless SSH for admin users'
        ],
        correct: 0,
        explanation: 'Zero Trust assumes no implicit trust granted to assets or users based solely on physical or network location.'
      }
    ]
  },
  {
    id: 'data_science',
    title: 'Data Science & BI Lead',
    category: 'Analytics & Big Data',
    demand: 'Very High (+35% YoY)',
    salary: '₹7.5L - ₹20L / yr',
    nsqf_level: 'Level 7-8',
    requiredSkills: ['Python & Pandas', 'PowerBI & Tableau', 'SQL Database Analytics', 'Machine Learning Algorithms', 'Big Data Spark', 'A/B Testing'],
    initialUserSkills: ['Python & Pandas', 'SQL Database Analytics'],
    courses: [
      { name: 'NPTEL: Data Science & Machine Learning', provider: 'IIT Kharagpur', link: 'https://nptel.ac.in', duration: '12 Weeks' },
      { name: 'SWAYAM: Business Analytics & Decision Making', provider: 'IIM Ahmedabad', link: 'https://swayam.gov.in', duration: '8 Weeks' }
    ],
    quiz: [
      {
        question: 'Which machine learning algorithm is supervised and suited for classification & regression decision trees?',
        options: [
          'Random Forest Classifier',
          'K-Means Clustering',
          'Principal Component Analysis (PCA)',
          'Apriori Association Mining'
        ],
        correct: 0,
        explanation: 'Random Forest is an ensemble supervised learning method combining multiple decision trees.'
      }
    ]
  },
  {
    id: 'health_tech',
    title: 'Bio-Medical & Health Tech Specialist',
    category: 'Healthcare Devices & Bio-Informatics',
    demand: 'High (+30% YoY)',
    salary: '₹5.5L - ₹16L / yr',
    nsqf_level: 'Level 6-7',
    requiredSkills: ['Medical Signal Processing (ECG/EEG)', 'DICOM Imaging Standards', 'Embedded Bio-Sensors', 'Regulatory Med-Device ISO 13485', 'Python Bio-Python', 'Clinical Data Analytics'],
    initialUserSkills: ['Embedded Bio-Sensors', 'Python Bio-Python'],
    courses: [
      { name: 'NPTEL: Biomedical Instrumentation & Sensors', provider: 'IIT Roorkee', link: 'https://nptel.ac.in', duration: '8 Weeks' },
      { name: 'Skill India Digital: Healthcare Technology Specialist', provider: 'Healthcare Sector Skill Council', link: 'https://www.skillindiadigital.gov.in', duration: '6 Weeks' }
    ],
    quiz: [
      {
        question: 'Which international medical standard defines quality management systems for medical device design?',
        options: [
          'ISO 13485',
          'ISO 9001',
          'IEEE 802.11',
          'ISO 14001'
        ],
        correct: 0,
        explanation: 'ISO 13485 sets comprehensive requirements for a Quality Management System specific to medical devices.'
      }
    ]
  },
  {
    id: 'civil_smartcity',
    title: 'Smart City & BIM Civil Infrastructure Lead',
    category: 'Civil & Structural Engineering',
    demand: 'High (+25% YoY)',
    salary: '₹5.0L - ₹14L / yr',
    nsqf_level: 'Level 6-7',
    requiredSkills: ['Building Information Modeling (BIM)', 'AutoCAD & Revit', 'GIS Urban Mapping', 'Structural Concrete Analysis', 'Project Estimation (STAAD.Pro)', 'Green Building LEED'],
    initialUserSkills: ['AutoCAD & Revit', 'Structural Concrete Analysis'],
    courses: [
      { name: 'NPTEL: Building Information Modeling & Smart Infrastructure', provider: 'IIT Madras', link: 'https://nptel.ac.in', duration: '12 Weeks' },
      { name: 'SWAYAM: Urban Transportation & Smart Cities', provider: 'IIT Bombay', link: 'https://swayam.gov.in', duration: '8 Weeks' }
    ],
    quiz: [
      {
        question: 'What is the main advantage of BIM (Building Information Modeling) over 2D CAD drafting?',
        options: [
          '3D parametric geometry combined with time, cost, and lifecycle data',
          'Slower rendering speed for static blue prints',
          'Manual paper printing format compatibility',
          'Single user offline access restriction'
        ],
        correct: 0,
        explanation: 'BIM integrates multi-dimensional physical & functional characteristics of a facility into a shared digital model.'
      }
    ]
  },
  {
    id: 'robotics_automation',
    title: 'Robotics & Industrial Automation Lead',
    category: 'Mechanical & Mechatronics',
    demand: 'Very High (+36% YoY)',
    salary: '₹6.5L - ₹17L / yr',
    nsqf_level: 'Level 6-7',
    requiredSkills: ['PLC & SCADA Programming', 'ROS (Robot Operating System)', 'Industrial Kinematics', 'Hydraulics & Pneumatics', 'Computer Vision OpenCV', 'Microcontrollers STM32'],
    initialUserSkills: ['PLC & SCADA Programming', 'Microcontrollers STM32'],
    courses: [
      { name: 'NPTEL: Robotics & Industrial Automation', provider: 'IIT Delhi', link: 'https://nptel.ac.in', duration: '12 Weeks' },
      { name: 'Skill India Digital: Industrial Automation Engineer', provider: 'Capital Goods Skill Council', link: 'https://www.skillindiadigital.gov.in', duration: '8 Weeks' }
    ],
    quiz: [
      {
        question: 'What does ROS (Robot Operating System) primarily provide for robotic software developers?',
        options: [
          'Middleware framework offering hardware abstraction, device drivers, and message-passing',
          'A proprietary desktop operating system replacing Windows',
          'A physical battery charging circuit board',
          'An offline CAD drafting tool'
        ],
        correct: 0,
        explanation: 'ROS is an open-source robotics middleware suite providing services designed for heterogeneous computer clusters.'
      }
    ]
  },
  {
    id: 'ui_ux_design',
    title: 'UI/UX Product Designer & AR/VR Developer',
    category: 'Design, Media & Interactive Tech',
    demand: 'High (+32% YoY)',
    salary: '₹5.5L - ₹16L / yr',
    nsqf_level: 'Level 6-7',
    requiredSkills: ['Figma & Prototyping', 'User Research & Wireframing', 'Unity 3D / Unreal Engine', 'AR Foundation & WebXR', 'Design Systems', 'Micro-Interactions'],
    initialUserSkills: ['Figma & Prototyping', 'Design Systems'],
    courses: [
      { name: 'NPTEL: Human-Computer Interaction & UI Design', provider: 'IIT Guwahati', link: 'https://nptel.ac.in', duration: '8 Weeks' },
      { name: 'SWAYAM: User Experience Design Fundamentals', provider: 'NID Ahmedabad', link: 'https://swayam.gov.in', duration: '8 Weeks' }
    ],
    quiz: [
      {
        question: 'What is the primary goal of conducting Usability Testing in UI/UX Product Design?',
        options: [
          'Evaluating how real users interact with a product to identify friction points',
          'Testing server database query execution times',
          'Compiling CSS stylesheets for production',
          'Generating invoice billing reports'
        ],
        correct: 0,
        explanation: 'Usability testing observes representative users completing tasks to measure efficiency, satisfaction, and usability errors.'
      }
    ]
  },
  {
    id: 'renewable_energy',
    title: 'Renewable Solar & Smart Grid Engineer',
    category: 'Green Energy & Sustainability',
    demand: 'High (+34% YoY)',
    salary: '₹5.0L - ₹15L / yr',
    nsqf_level: 'Level 6-7',
    requiredSkills: ['Solar PV Design & PVSyst', 'Smart Grid Inverters', 'Wind Energy Turbines', 'Energy Storage & Microgrids', 'Grid Code Compliance', 'Carbon Footprint Audit'],
    initialUserSkills: ['Solar PV Design & PVSyst', 'Smart Grid Inverters'],
    courses: [
      { name: 'NPTEL: Renewable Energy Engineering & Solar PV', provider: 'IIT Bombay', link: 'https://nptel.ac.in', duration: '12 Weeks' },
      { name: 'Skill India Digital: Solar Power Installation Engineer', provider: 'Green Jobs Skill Council', link: 'https://www.skillindiadigital.gov.in', duration: '6 Weeks' }
    ],
    quiz: [
      {
        question: 'In a Solar Photovoltaic system, what is the role of a MPPT (Maximum Power Point Tracker) Solar Inverter?',
        options: [
          'Optimizing power output from PV panels by continuously sampling voltage & current',
          'Cooling solar panel glass surfaces with water',
          'Converting DC solar energy directly to mechanical wind rotation',
          'Measuring physical wind direction angles'
        ],
        correct: 0,
        explanation: 'MPPT ensures solar arrays extract maximum power under varying sunlight and temperature conditions.'
      }
    ]
  }
];

const UpskillingHub = () => {
  const [selectedCareer, setSelectedCareer] = useState(TARGET_CAREERS[0]);
  const [userSkills, setUserSkills] = useState(TARGET_CAREERS[0].initialUserSkills);
  const [earnedBadges, setEarnedBadges] = useState(['Python Fundamentals', 'React UI Essentials']);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  
  // Full-Screen Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Extract unique categories for filter pills
  const categories = ['All', ...new Set(TARGET_CAREERS.map(c => c.category))];

  const filteredCareers = selectedCategoryFilter === 'All'
    ? TARGET_CAREERS
    : TARGET_CAREERS.filter(c => c.category === selectedCategoryFilter);

  const totalRequired = selectedCareer.requiredSkills.length;
  const matchCount = selectedCareer.requiredSkills.filter(s => userSkills.includes(s)).length;
  const matchPercentage = Math.round((matchCount / totalRequired) * 100);

  const missingSkills = selectedCareer.requiredSkills.filter(s => !userSkills.includes(s));

  const toggleSkill = (skill) => {
    if (userSkills.includes(skill)) {
      setUserSkills(userSkills.filter(s => s !== skill));
    } else {
      setUserSkills([...userSkills, skill]);
    }
  };

  const handleCareerChange = (career) => {
    setSelectedCareer(career);
    setUserSkills(career.initialUserSkills);
    setShowQuizModal(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
  };

  const startQuizModal = () => {
    setShowQuizModal(true);
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
  };

  const closeQuizModal = () => {
    setShowQuizModal(false);
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
  };

  const handleSelectOption = (qIdx, optionIdx) => {
    setQuizAnswers({ ...quizAnswers, [qIdx]: optionIdx });
  };

  const handleEvaluateQuiz = () => {
    let correctCount = 0;
    selectedCareer.quiz.forEach((q, qidx) => {
      if (quizAnswers[qidx] === q.correct) {
        correctCount++;
      }
    });

    setQuizSubmitted(true);

    if (correctCount === selectedCareer.quiz.length) {
      setQuizPassed(true);
      const newBadge = `${selectedCareer.title} Micro-Credential`;
      if (!earnedBadges.includes(newBadge)) {
        setEarnedBadges([...earnedBadges, newBadge]);
      }
      if (missingSkills.length > 0) {
        setUserSkills([...userSkills, missingSkills[0]]);
      }
    } else {
      setQuizPassed(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-['Plus_Jakarta_Sans',sans-serif] relative">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-800/80 text-xs font-bold mb-3 shadow-lg">
              <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
              <span>ASCENTIA Interactive Upskilling & Skill Gap Analyzer</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Skill Gap Analyzer & Micro-Credential Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Explore 10+ high-growth career paths across Software, EV, Finance, Healthcare, Civil, Robotics, Design, and Renewable Energy. Compare your competencies, bridge gaps via full-screen quizzes, and earn NSQF micro-credentials.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800 rounded-2xl p-5 min-w-[200px] text-center shadow-xl shrink-0">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Target Role Match</span>
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400">
              {matchPercentage}%
            </span>
            <span className="text-[10px] font-bold text-emerald-400 mt-1">
              {matchPercentage >= 70 ? 'Ready for Job Deployment' : 'Upskilling Needed'}
            </span>
          </div>
        </div>
      </div>

      {/* Target Career Selection Header & Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>1. Select Target High-Growth Career Path ({TARGET_CAREERS.length} Industry Domains Available)</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Showing {filteredCareers.length} Paths</span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pb-1">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of 10+ Career Paths with Scroll container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredCareers.map((c) => {
            const isSelected = c.id === selectedCareer.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCareerChange(c)}
                className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 mb-2 inline-block">
                    {c.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-white mb-1">{c.title}</h4>
                  <p className="text-[11px] text-emerald-400 font-bold mb-3">{c.demand}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{c.nsqf_level}</span>
                  <span className="text-slate-200 font-bold">{c.salary}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Skill Gap Breakdown & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Required Skills Matrix */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span>2. Interactive Skill Matrix & Gap Checklist for {selectedCareer.title}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Click skills to toggle acquired state and observe live match updates</p>
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-800">
              {matchCount} / {totalRequired} Skills Acquired
            </span>
          </div>

          {/* Skill Items */}
          <div className="space-y-2.5">
            {selectedCareer.requiredSkills.map((skill, idx) => {
              const isAcquired = userSkills.includes(skill);
              return (
                <div
                  key={idx}
                  onClick={() => toggleSkill(skill)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isAcquired
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-950 border-slate-800/90 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isAcquired ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isAcquired ? <CheckCircle className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold">{skill}</span>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    isAcquired
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                  }`}>
                    {isAcquired ? '✓ Acquired Skill' : '⚠️ Missing Gap'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Badges & Quiz Trigger Banner */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Verified Micro-Credential Badges Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Earned Micro-Credentials ({earnedBadges.length})</span>
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((badge, bidx) => (
                <div key={bidx} className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-md">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Micro-Quiz Trigger Box */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider bg-indigo-950 px-2.5 py-0.5 rounded-full border border-indigo-800">
                Interactive Skill Verification
              </span>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>

            <h4 className="text-base font-extrabold text-white">Bridge Missing Gaps via Micro-Quiz</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open the full-screen assessment center to take interactive technical quizzes, test your knowledge, and earn NSQF micro-credentials.
            </p>

            <button
              onClick={startQuizModal}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 group"
            >
              <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>🚀 Launch Full-Screen Technical Assessment</span>
            </button>

          </div>

        </div>

      </div>

      {/* Free Curated Learning Courses Directory */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h3 className="text-lg font-black text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>3. Free Upskilling Courses for {selectedCareer.title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Recommended free government & university courses to bridge missing technical competencies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedCareer.courses.map((crs, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 mb-3 inline-block">
                  {crs.provider}
                </span>
                <h4 className="text-sm font-bold text-white mb-2">{crs.name}</h4>
                <p className="text-xs text-slate-400">Duration: <strong className="text-slate-200">{crs.duration}</strong></p>
              </div>

              <a
                href={crs.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>Enroll Free Course</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* FULL-SCREEN INTERACTIVE QUIZ OVERLAY MODAL */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto">
          
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden my-auto">
            
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                      Technical Assessment Center
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {selectedCareer.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={closeQuizModal}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quiz Content Body */}
            {!quizSubmitted ? (
              <div className="space-y-6">
                
                {/* Progress Step Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Progress: Question {currentQuestionIdx + 1} of {selectedCareer.quiz.length}</span>
                    <span className="text-cyan-400 font-mono">
                      {Math.round(((currentQuestionIdx + 1) / selectedCareer.quiz.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${((currentQuestionIdx + 1) / selectedCareer.quiz.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Question Card */}
                {selectedCareer.quiz[currentQuestionIdx] && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner">
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                      <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                        {selectedCareer.quiz[currentQuestionIdx].question}
                      </h3>
                    </div>

                    {/* Options List */}
                    <div className="space-y-3">
                      {selectedCareer.quiz[currentQuestionIdx].options.map((opt, optionIdx) => {
                        const isSelected = quizAnswers[currentQuestionIdx] === optionIdx;
                        return (
                          <button
                            key={optionIdx}
                            type="button"
                            onClick={() => handleSelectOption(currentQuestionIdx, optionIdx)}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm font-semibold ${
                              isSelected
                                ? 'bg-gradient-to-r from-cyan-950/90 to-indigo-950/90 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/10'
                                : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-600 text-slate-400'
                              }`}>
                                {String.fromCharCode(65 + optionIdx)}
                              </div>
                              <span>{opt}</span>
                            </div>

                            {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold disabled:opacity-40 transition-all"
                  >
                    Previous
                  </button>

                  {currentQuestionIdx < selectedCareer.quiz.length - 1 ? (
                    <button
                      disabled={quizAnswers[currentQuestionIdx] === undefined}
                      onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                      className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold disabled:opacity-40 flex items-center space-x-2 transition-all shadow-lg"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      disabled={Object.keys(quizAnswers).length < selectedCareer.quiz.length}
                      onClick={handleEvaluateQuiz}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold disabled:opacity-40 flex items-center space-x-2 transition-all shadow-xl shadow-emerald-500/20"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Submit & Evaluate Assessment</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              /* Quiz Score Result View */
              <div className="text-center py-6 space-y-6 animate-fade-in">
                
                {quizPassed ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                      <Trophy className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white">🎉 Assessment Passed!</h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      You passed the technical evaluation for <strong className="text-emerald-400">{selectedCareer.title}</strong>!
                    </p>

                    <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl max-w-md mx-auto text-xs text-emerald-300 font-bold space-y-1">
                      <p>✨ Verified Micro-Credential Unlocked!</p>
                      <p className="text-slate-300 font-normal">Your skill gap checklist and Skilling Passport have been automatically updated.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                      <AlertCircle className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-black text-white">Review & Try Again</h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      Review the recommended free NPTEL and Skill India courses below to strengthen your competencies before retaking.
                    </p>
                  </div>
                )}

                {/* Explanations List */}
                <div className="space-y-3 text-left bg-slate-950 p-5 rounded-2xl border border-slate-800 max-h-60 overflow-y-auto">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Answer Explanations:</h4>
                  {selectedCareer.quiz.map((q, idx) => (
                    <div key={idx} className="text-xs space-y-1 border-b border-slate-900 pb-2">
                      <p className="font-bold text-white">Q{idx + 1}: {q.question}</p>
                      <p className="text-emerald-400 font-semibold">Correct: {q.options[q.correct]}</p>
                      <p className="text-slate-400 italic text-[11px]">{q.explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-3 pt-2">
                  <button
                    onClick={startQuizModal}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retake Quiz</span>
                  </button>

                  <button
                    onClick={closeQuizModal}
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold shadow-lg"
                  >
                    Return to Dashboard
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default UpskillingHub;
