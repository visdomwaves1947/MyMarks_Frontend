import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ArrowRight,
  Info,
  ChevronLeft,
  Lock,
  LogIn,
  X,
  Sparkles,
  CheckCircle2,
  FlaskConical,
  Atom,
  Sliders,
} from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import LabPracticalHub from "./lab/LabPracticalHub";
import { LAB_SUBJECTS } from "../data/labPracticalsData";


export default function IntermediateSubjects({
  onEnroll,
  currentUser,
  onOpenSignIn,
  onOpenSignUp,
}) {
  const [activeEnroll, setActiveEnroll] = useState(null);
  const [activeExplore, setActiveExplore] = useState(null);
  const [lockedSubject, setLockedSubject] = useState(null);
  const [selectedStream, setSelectedStream] = useState("all");
  const [activeLabModalSubject, setActiveLabModalSubject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGroupSelection = (grp) => {
      if (!grp) return;
      const lower = grp.toLowerCase();
      if (["mpc", "bipc", "mec", "cec", "hec", "labs", "languages", "all"].includes(lower)) {
        setSelectedStream(lower);
        setTimeout(() => {
          const coursesEl = document.getElementById("courses");
          if (coursesEl) {
            coursesEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    // 1. Check URL query params on load or location change
    const groupParam = searchParams.get("group") || searchParams.get("stream");
    if (groupParam) {
      handleGroupSelection(groupParam);
    }

    // 2. Listen to custom event for instantaneous in-page navigation from Navbar/Footer
    const onSelectGroupEvent = (e) => {
      if (e.detail) {
        handleGroupSelection(e.detail);
      }
    };
    window.addEventListener("selectIntermediateGroup", onSelectGroupEvent);

    return () => {
      window.removeEventListener("selectIntermediateGroup", onSelectGroupEvent);
    };
  }, [searchParams, location]);

  // Determine if the user is authenticated from props or saved local storage
  const isAuthenticated = Boolean(
    currentUser ||
    (() => {
      try {
        const stored = localStorage.getItem("mla_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })(),
  );

  const streamDefinitions = {
    mpc: {
      number: "1",
      code: "MPC",
      name: "Mathematics, Physics, Chemistry",
      description: "Premier Engineering, Architecture, Pure Sciences & Technology track for JEE & EAMCET aspirants. Includes compulsory board practicals for Mathematics, Physics (30M), and Chemistry (30M).",
      careerBadge: "Engineering & Tech",
      careerList: "JEE Mains & Advanced, B.Tech / BE, B.Arch, IISER, NDA • Practicals: Mathematics (30M), Physics (30M) & Chemistry (30M).",
      subjectIds: ["maths", "phy", "chem"],
      practicalLabIds: ["maths", "phy", "chem"],
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    bipc: {
      number: "2",
      code: "BiPC",
      name: "Biology (Botany & Zoology), Physics, Chemistry",
      description: "Medical, Dental, Pharmacy, Agricultural, Biotechnology & Life Sciences track for NEET aspirants. Includes compulsory board practicals for Botany, Zoology, Physics, and Chemistry (30M each).",
      careerBadge: "Medical & Life Sciences",
      careerList: "NEET UG, MBBS, BDS, B.Pharm, Pharm.D, B.Sc Agriculture • Compulsory Practicals: Botany (30M), Zoology (30M), Physics (30M), Chemistry (30M).",
      subjectIds: ["bot", "zoo", "phy", "chem"],
      practicalLabIds: ["bot", "zoo", "phy", "chem"],
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    cec: {
      number: "3",
      code: "CEC",
      name: "Commerce, Economics, Civics (Political Science)",
      description: "Commerce Group — Foundation for Chartered Accountancy, Corporate Law, Banking, and Business Management.",
      careerBadge: "Commerce & Business",
      careerList: "CA Foundation, CMA, CS, B.Com (Hons), BBA, Corporate Banking, Stock Markets, Law (CLAT / LLB).",
      subjectIds: ["com", "eco", "civ"],
      practicalLabIds: [],
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    mec: {
      number: "4",
      code: "MEC",
      name: "Mathematics, Economics, Commerce / Accountancy",
      description: "Mathematics & Commerce Track — Quantitative Finance, Actuarial Science, Analytics, and Corporate Strategy.",
      careerBadge: "Quantitative Finance & Actuarial",
      careerList: "Actuarial Science, Quantitative Finance, CA, CFA, B.Com Analytics, Economic Honors, Data Science.",
      subjectIds: ["maths", "eco", "com"],
      practicalLabIds: [],
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    hec: {
      number: "5",
      code: "HEC",
      name: "History, Economics, Civics (Political Science)",
      description: "Humanities Group — Premier pipeline for Civil Services (UPSC), Judiciary, Public Policy & International Relations.",
      careerBadge: "Civil Services & Law",
      careerList: "UPSC IAS / IPS / IFS, APPSC / TSPSC Group 1, Law (CLAT 5-Year LLB), Public Policy, Journalism • Practical: Geography (30M).",
      subjectIds: ["his", "eco", "civ"],
      practicalLabIds: ["geo"],
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    },
    labs: {
      number: "6",
      code: "LABS",
      name: "Lab & Practical Work (Board 30 Marks)",
      description: "Compulsory hands-on laboratory examinations, viva-voce handbooks, experiment procedure guides, observational record templates, and 30-mark board scoring blueprints across Science, Technical & Humanities disciplines.",
      careerBadge: "Board Practical Examinations",
      careerList: "Mathematics (30M), Physics (30M), Chemistry (30M), Botany (30M), Zoology (30M), Computer Science (30M), Electronics (30M), Geography (30M).",
      subjectIds: ["maths", "phy", "chem", "bot", "zoo", "cs", "elec", "geo"],
      practicalLabIds: ["maths", "phy", "chem", "bot", "zoo", "cs", "elec", "geo"],
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    languages: {
      number: "7",
      code: "LANG",
      name: "Part I & Part II Languages",
      description: "Comprehensive board curriculum, question paper blueprints, grammar rules, poetry, prose, and comprehension for English and Second Languages (Telugu, Sanskrit, Hindi, Urdu, French).",
      careerBadge: "Board Languages (100 Marks Each)",
      careerList: "English (Part I • 100M) • Sanskrit, Telugu, Hindi, Urdu, French (Part II • 100M).",
      subjectIds: ["eng", "san", "tel", "hin", "urd", "fre"],
      practicalLabIds: [],
      badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
  };

  const subjects = [
    {
      id: "maths",
      name: "Mathematics",
      category: "MPC / MEC",
      image: "/books/maths.jpg",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      desc: "Master algebra, calculus, geometry, and trigonometry. Essential core for both MPC engineering and MEC actuarial tracks.",
    },
    {
      id: "phy",
      name: "Physics",
      category: "MPC / BiPC",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image: "/books/physics.jpg",
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      desc: "Understand mechanics, thermodynamics, and electromagnetism with practical real-world applications, numerical problem-solving, and laboratory experiments.",
    },
    {
      id: "chem",
      name: "Chemistry",
      category: "MPC / BiPC",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image: "/books/chemistry.jpg",
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      desc: "Explore organic, inorganic, and physical chemistry. Systematic qualitative salt analysis, volumetric titrations, and molecular models.",
    },
    {
      id: "bot",
      name: "Botany",
      category: "BiPC",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image: "/books/botany.jpg",
      color:
        "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      desc: "Study plant biology, anatomical section cutting, double staining, and plant physiology. Tailored for high NEET and Board scores.",
    },
    {
      id: "zoo",
      name: "Zoology",
      category: "BiPC",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image: "/books/zoology.jpg",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
      desc: "Dive into animal sciences, human anatomy, specimen spotting, physiological demonstrations, and expert medical guidance.",
    },
    {
      id: "cs",
      name: "Computer Science",
      category: "MPC / MEC / Vocational",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image: "/books/cs.jpg",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      desc: "Master Python/C++ programming, data structures (stacks, queues), relational SQL databases, and practical lab executions for 30/30 board marks.",
    },
    {
      id: "elec",
      name: "Electronics",
      category: "MPC / Vocational",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image: "/books/electronics.jpg",
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      desc: "Understand semiconductor diodes, transistors, power rectifiers, and digital logic gate truth tables with hands-on breadboard circuit wiring.",
    },
    {
      id: "geo",
      name: "Geography",
      category: "HEC",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image: "/books/geography.jpg",
      color:
        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      desc: "Master Survey of India toposheet reading, relief contour profiles, map scales (R.F.), and meteorological weather instruments for board practicals.",
    },
    {
      id: "com",
      name: "Commerce",
      category: "CEC / MEC",
      image: "/books/commerce.jpg",
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      desc: "Master business organization, joint stock companies, double-entry bookkeeping, ledger balancing, BRS, and final accounts for 100/100 marks.",
    },
    {
      id: "eco",
      name: "Economics",
      category: "CEC / MEC / HEC",
      image: "/books/economics.jpg",
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      desc: "Understand consumer behavior, Law of DMU, demand & supply elasticity, market structures, national income, and economic growth with curve blueprints.",
    },
    {
      id: "civ",
      name: "Civics",
      category: "CEC / HEC",
      image: "/books/civics.jpg",
      color:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      desc: "Explore Indian Constitution, Fundamental Rights, Union & State Legislature, Executive, Supreme Court, and Local Self-Governance (Panchayati Raj).",
    },
    {
      id: "his",
      name: "History",
      category: "HEC",
      image: "/books/history.jpg",
      color:
        "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
      desc: "Journey through ancient Indus & Vedic civilizations, Delhi Sultanate, Vijayanagara Empire, Mughals, and the Indian Freedom Movement with timelines & maps.",
    },
    {
      id: "eng",
      name: "English",
      category: "Languages",
      image: "/books/english.jpg",
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      desc: "Improve grammar, vocabulary, and literature comprehension. Learn how to structure essays perfectly for maximum board exam marks.",
    },
    {
      id: "san",
      name: "Sanskrit",
      category: "Languages",
      image: "/books/sanskrit.jpg",
      color: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
      desc: "Learn ancient texts, fundamental grammar rules, and translation strategies to score 98+ marks easily in your language board exams.",
    },
    {
      id: "tel",
      name: "Telugu",
      category: "Languages",
      image: "/books/telugu.jpg",
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      desc: "Master the Telugu language, literature, and grammar to achieve excellence in your board exams.",
    },
    {
      id: "hin",
      name: "Hindi",
      category: "Languages",
      image: "/books/hindi.jpg",
      color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      desc: "Enhance your Hindi reading, writing, and comprehension skills for top scores in language exams.",
    },
    {
      id: "urd",
      name: "Urdu",
      category: "Languages",
      image: "/books/urdu.jpg",
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      desc: "Dive into Urdu poetry, prose, and grammar with expert guidance tailored for board exam success.",
    },
    {
      id: "fre",
      name: "French",
      category: "Languages",
      image: "/books/french.jpg",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      desc: "Learn French vocabulary, grammar, and conjugation rules easily for perfect marks in your language subjects.",
    },
  ];

  const handleSubjectClick = (subject) => {
    if (!isAuthenticated) {
      setLockedSubject(subject);
      return;
    }

    if (subject.id === "maths") {
      navigate("/maths");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "eng") {
      navigate("/english");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "bot") {
      navigate("/botany");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "zoo") {
      navigate("/zoology");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "phy") {
      navigate("/physics");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "chem") {
      navigate("/chemistry");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "san") {
      navigate("/sanskrit");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "tel") {
      navigate("/telugu");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "hin") {
      navigate("/hindi");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "urd") {
      navigate("/urdu");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "fre") {
      navigate("/french");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "com") {
      navigate("/commerce");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "eco") {
      navigate("/economics");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "civ") {
      navigate("/civics");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "his") {
      navigate("/history");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (["cs", "elec", "geo"].includes(subject.id)) {
      navigate(`/practicals?subject=${subject.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveExplore(activeExplore === subject.id ? null : subject.id);
    }
  };

  const handleExploreClick = (e, subject) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setLockedSubject(subject);
      return;
    }

    if (subject.id === "maths") {
      navigate("/maths");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "eng") {
      navigate("/english");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "bot") {
      navigate("/botany");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "zoo") {
      navigate("/zoology");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "phy") {
      navigate("/physics");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "chem") {
      navigate("/chemistry");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "san") {
      navigate("/sanskrit");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "tel") {
      navigate("/telugu");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "hin") {
      navigate("/hindi");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "urd") {
      navigate("/urdu");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "fre") {
      navigate("/french");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "com") {
      navigate("/commerce");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "eco") {
      navigate("/economics");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "civ") {
      navigate("/civics");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (subject.id === "his") {
      navigate("/history");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (["cs", "elec", "geo"].includes(subject.id)) {
      navigate(`/practicals?subject=${subject.id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveExplore(subject.id);
    }
  };

  const handleEnrollClick = (e, subject) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setLockedSubject(subject);
      return;
    }
    setActiveEnroll(subject.id);
  };

  const handleGoToSignIn = () => {
    setLockedSubject(null);
    if (onOpenSignIn) {
      onOpenSignIn();
    } else {
      navigate("/signin");
    }
  };

  const handleGoToSignUp = () => {
    setLockedSubject(null);
    if (onOpenSignUp) {
      onOpenSignUp();
    } else {
      navigate("/signup");
    }
  };

  const renderSubjectCard = (subject) => {
    const isEnrolling = activeEnroll === subject.id;
    const isExploring = activeExplore === subject.id;

    return (
      <div
        key={subject.id}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[330px] sm:h-[360px] border-2 border-blue-400/60 hover:border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
        onClick={() => handleSubjectClick(subject)}
      >
        {/* Full-Cover Background Image */}
        <img
          src={subject.image}
          alt={subject.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        />

        {/* Legibility Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-900/10 pointer-events-none"></div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-3.5 sm:p-4">
          {/* Top Bar: Subject Category Tag (No duplicate locked badge on image) */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-blue-100 bg-blue-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-blue-400/30 uppercase tracking-wider">
              {subject.category}
            </span>
          </div>

          {/* Bottom Overlay: Title & Blue Buttons */}
          <div
            className={`mt-auto pt-2 transition-opacity duration-300 ${
              isExploring || isEnrolling ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate">
              {subject.name}
            </h4>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => handleExploreClick(e, subject)}
                className="flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-400/40 cursor-pointer"
              >
                <span>Explore</span>
              </button>
              <button
                type="button"
                onClick={(e) => handleEnrollClick(e, subject)}
                className="flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-400/40 cursor-pointer"
              >
                <span>{!isAuthenticated ? "Demo Trial" : "Enroll"}</span>
              </button>
            </div>
          </div>

          {/* Explore View (when authenticated) */}
          {isAuthenticated && (
            <div
              className={`absolute inset-0 bg-[#0d2238]/95 backdrop-blur-md p-5 flex flex-col z-20 transition-transform duration-300 ${
                isExploring ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
                {subject.name} Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed overflow-y-auto pr-1 mb-4 flex-1 scrollbar-thin">
                {subject.desc}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveExplore(null);
                }}
                className="w-full mt-auto py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} /> Back
              </button>
            </div>
          )}

          {/* Enroll View (when authenticated) */}
          {isAuthenticated && (
            <div
              className={`absolute inset-0 bg-[#0d2238]/95 backdrop-blur-md p-5 flex flex-col z-20 transition-transform duration-300 ${
                isEnrolling ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <h4 className="text-xs sm:text-sm font-semibold text-white mb-4 text-center">
                Select Year for {subject.name}
              </h4>
              <div className="flex flex-col gap-2 flex-1 justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEnroll(null);
                    if (onEnroll) onEnroll(`${subject.name} (1st Year)`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  1st Year (Junior)
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEnroll(null);
                    if (onEnroll) onEnroll(`${subject.name} (2nd Year)`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  2nd Year (Senior)
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveEnroll(null);
                }}
                className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold flex items-center justify-center transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPracticalCard = (lab) => {
    return (
      <div
        key={`practical-${lab.id}`}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[330px] sm:h-[360px] border-2 border-blue-400/60 hover:border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
        onClick={() => {
          if (!isAuthenticated) {
            setLockedSubject({
              id: lab.id,
              name: lab.name,
              desc: lab.overview,
              image: lab.image,
              hasPractical: true,
              practicalMarks: "30 Marks",
            });
            return;
          }
          navigate(`/practicals?subject=${lab.id}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        {/* Full-Cover Background Image */}
        <img
          src={lab.image}
          alt={lab.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        />

        {/* Legibility Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-900/10 pointer-events-none"></div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-3.5 sm:p-4">
          {/* Top Bar: Practical Category Pill */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-blue-100 bg-blue-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-blue-400/30 uppercase tracking-wider">
              {lab.stream}
            </span>
          </div>

          {/* Bottom Overlay: Title & Blue Buttons */}
          <div className="mt-auto pt-2">
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate">
              {lab.name}
            </h4>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    setLockedSubject({
                      id: lab.id,
                      name: lab.name,
                      desc: lab.overview,
                      image: lab.image,
                      hasPractical: true,
                      practicalMarks: "30 Marks",
                    });
                    return;
                  }
                  navigate(`/practicals?subject=${lab.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-400/40 cursor-pointer"
              >
                <span>Explore</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    setLockedSubject({
                      id: lab.id,
                      name: lab.name,
                      desc: lab.overview,
                      image: lab.image,
                      hasPractical: true,
                      practicalMarks: "30 Marks",
                    });
                    return;
                  }
                  setActiveLabModalSubject(lab.id);
                }}
                className="flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-400/40 cursor-pointer"
              >
                <span>Demo Trial</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <section
      className="py-10 sm:py-14 bg-[#e6f0fa] dark:bg-[#071328] border-t border-blue-200/60 dark:border-blue-900/40 relative"
      id="courses"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {!isAuthenticated ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <Lock size={12} className="text-blue-600 dark:text-blue-400" />
              <span>Intermediate Subjects</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
              <span>AP/TS Board Curriculum</span>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Intermediate Subjects
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal mt-1 leading-relaxed">
            Complete subject-wise curriculum for AP & Telangana Intermediate students. Select your subject to explore interactive classes, notes, and simulators.
          </p>
        </div>

        {/* Lock Info Banner when user is not signed in */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-8 p-3.5 sm:p-4 rounded-2xl bg-[#c8e1fd] dark:bg-[#0f2a4a] border-2 border-[#93c5fd] dark:border-[#1e4b7a] text-blue-900 dark:text-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock size={16} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Intermediate Subject Trials are Locked
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">
                  Sign in to unlock interactive demo trials and video lessons for any subject.
                </p>
              </div>
            </div>
            <button
              onClick={handleGoToSignIn}
              className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogIn size={13} />
              <span>Sign In Now</span>
            </button>
          </div>
        )}

        {/* Interactive Stream Filter Tabs */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-nowrap items-center sm:justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-[#c8e1fd] dark:bg-[#0f2a4a] rounded-2xl border-2 border-[#93c5fd] dark:border-[#1e4b7a] shadow-xs max-w-5xl mx-auto overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setSelectedStream("all")}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              All Subjects (18)
            </button>
            <button
              onClick={() => setSelectedStream("labs")}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                selectedStream === "labs"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              <FlaskConical size={13} />
              <span>Lab / Practicals (8)</span>
            </button>
            <button
              onClick={() => setSelectedStream("mpc")}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "mpc"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              MPC
            </button>
            <button
              onClick={() => setSelectedStream("bipc")}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "bipc"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              BiPC
            </button>
            <button
              onClick={() => setSelectedStream("cec")}
              title="Commerce, Economics, Civics"
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "cec"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              CEC
            </button>
            <button
              onClick={() => setSelectedStream("mec")}
              title="Mathematics, Economics, Commerce"
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "mec"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              MEC
            </button>
            <button
              onClick={() => setSelectedStream("hec")}
              title="History, Economics, Civics"
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "hec"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              HEC
            </button>
            <button
              onClick={() => setSelectedStream("languages")}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "languages"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              Languages (6)
            </button>
          </div>
        </div>

        {/* Filtered Stream View */}
        {selectedStream !== "all" && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-16">
            {selectedStream === "labs"
              ? LAB_SUBJECTS.map(renderPracticalCard)
              : selectedStream === "languages"
              ? subjects
                  .filter((s) => s.category === "Languages")
                  .map(renderSubjectCard)
              : subjects
                  .filter((s) =>
                    streamDefinitions[selectedStream]?.subjectIds.includes(s.id)
                  )
                  .map(renderSubjectCard)}
          </div>
        )}

        {/* Full "All Groups" View - Clean Single Grid, No Repetition */}
        {selectedStream === "all" && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-16">
            {subjects.map(renderSubjectCard)}
          </div>
        )}
      </div>

      {/* Interactive Lab Practical Modal Hub */}
      {activeLabModalSubject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn overflow-y-auto"
          onClick={() => setActiveLabModalSubject(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-left my-auto max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FlaskConical size={20} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Intermediate Lab & Practical Hub
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Interactive Simulators, Experiments & Board Viva Bank
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveLabModalSubject(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close lab modal"
              >
                <X size={18} />
              </button>
            </div>

            <LabPracticalHub
              initialSubjectId={activeLabModalSubject}
              onOpenBooking={(topic) => {
                setActiveLabModalSubject(null);
                if (onEnroll) onEnroll(topic);
              }}
            />
          </div>
        </div>
      )}

      {/* Ultra-Premium Animated Lock Modal */}
      {lockedSubject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn"
          onClick={() => setLockedSubject(null)}
        >
          {/* Ambient Glowing Background Orbs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

          <div
            className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-slate-800 text-center transform transition-all animate-scaleUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Animated Gradient Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500"></div>

            {/* Close Button */}
            <button
              onClick={() => setLockedSubject(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-all duration-200 hover:rotate-90 cursor-pointer shadow-xs"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Animated 3D Security Emblem */}
            <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
              {/* Outer pulsing glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-md animate-pulse"></div>

              {/* Spinning dashed ring effect */}
              <div className="absolute -inset-1 rounded-3xl border border-blue-500/30 border-dashed animate-[spin_12s_linear_infinite]"></div>

              {/* Main Badge */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/20">
                <Lock size={30} className="stroke-[2.2] animate-bounce" />
              </div>

              {/* Corner Sparkle Badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-blue-400 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md">
                <Sparkles size={12} className="animate-pulse" />
              </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/25 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2.5 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Demo Trial Locked</span>
            </div>

            {/* Modal Heading */}
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mb-2">
              Sign In Required
            </h3>

            {/* Targeted User-Requested Message */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-5 max-w-md mx-auto">
              Please{" "}
              <button
                onClick={handleGoToSignIn}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                sign in
              </button>{" "}
              to access the demo trial for{" "}
              <span className="font-semibold text-slate-900 dark:text-white underline decoration-blue-500 decoration-2 underline-offset-4">
                {lockedSubject.name}
              </span>
              .
            </p>

            {/* Subject Preview & Feature Perks Box */}
            <div className="bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl p-4 mb-6 text-left border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center gap-3.5 mb-3.5 pb-3 border-b border-slate-200/70 dark:border-slate-700/50">
                <img
                  src={lockedSubject.image}
                  alt={lockedSubject.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 ring-2 ring-white dark:ring-slate-700 shadow-md"
                />
                <div className="min-w-0">
                  <div className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 tracking-wider mb-1">
                    {lockedSubject.category} &bull; AP / TS Intermediate
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                    {lockedSubject.name}
                  </div>
                </div>
              </div>

              {/* Perks Checklist */}
              <div className="space-y-2 text-xs font-normal text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-blue-600 shrink-0"
                  />
                  <span>
                    Full Chapter Interactive Lessons & Video Concept Maps
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-blue-600 shrink-0"
                  />
                  <span>Live Formula Simulations & Solved Board Examples</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-blue-600 shrink-0"
                  />
                  <span>
                    Timed Mock Question Sets with Instant Score Feedback
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoToSignIn}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] group relative overflow-hidden"
              >
                <LogIn
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
                <span>Sign In to Access Demo</span>
              </button>

              <button
                onClick={handleGoToSignUp}
                className="w-full py-2.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700/60 flex items-center justify-center gap-2 hover:border-slate-300 dark:hover:border-slate-600 group"
              >
                <span>Don't have an account? Sign Up Free</span>
                <ArrowRight
                  size={15}
                  className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                />
              </button>
            </div>

            {/* Instant Access Note */}
            <p className="mt-4 text-[11px] font-normal text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-blue-500" />
              <span>
                Instant activation &bull; Free demo trial across all subjects
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
