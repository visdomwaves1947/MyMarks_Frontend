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
      image:
        "https://i.pinimg.com/736x/7e/ff/20/7eff2083afbca2a2e99a1525fcc40ce6.jpg",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      desc: "Master algebra, calculus, geometry, and trigonometry. Essential core for both MPC engineering and MEC actuarial tracks.",
    },
    {
      id: "phy",
      name: "Physics",
      category: "MPC / BiPC",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image:
        "https://i.pinimg.com/736x/59/63/26/596326ea62c6f1c23ff12882c8c00e7e.jpg",
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
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop",
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
      image:
        "https://i.pinimg.com/736x/73/a6/34/73a634a96be17ca114e7ac1375713492.jpg",
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
      image:
        "https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=600&auto=format&fit=crop",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
      desc: "Dive into animal sciences, human anatomy, specimen spotting, physiological demonstrations, and expert medical guidance.",
    },
    {
      id: "cs",
      name: "Computer Science",
      category: "MPC / MEC / Vocational",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      desc: "Master Python/C++ programming, data structures (stacks, queues), relational SQL databases, and practical lab executions for 30/30 board marks.",
    },
    {
      id: "elec",
      name: "Electronics",
      category: "MPC / Vocational",
      hasPractical: true,
      practicalMarks: "30 Marks",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop",
      color:
        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      desc: "Master Survey of India toposheet reading, relief contour profiles, map scales (R.F.), and meteorological weather instruments for board practicals.",
    },
    {
      id: "com",
      name: "Commerce",
      category: "CEC / MEC",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      desc: "Master business organization, joint stock companies, double-entry bookkeeping, ledger balancing, BRS, and final accounts for 100/100 marks.",
    },
    {
      id: "eco",
      name: "Economics",
      category: "CEC / MEC / HEC",
      image:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      desc: "Understand consumer behavior, Law of DMU, demand & supply elasticity, market structures, national income, and economic growth with curve blueprints.",
    },
    {
      id: "civ",
      name: "Civics",
      category: "CEC / HEC",
      image:
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop",
      color:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      desc: "Explore Indian Constitution, Fundamental Rights, Union & State Legislature, Executive, Supreme Court, and Local Self-Governance (Panchayati Raj).",
    },
    {
      id: "his",
      name: "History",
      category: "HEC",
      image:
        "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
      color:
        "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
      desc: "Journey through ancient Indus & Vedic civilizations, Delhi Sultanate, Vijayanagara Empire, Mughals, and the Indian Freedom Movement with timelines & maps.",
    },
    {
      id: "eng",
      name: "English",
      category: "Languages",
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop",
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      desc: "Improve grammar, vocabulary, and literature comprehension. Learn how to structure essays perfectly for maximum board exam marks.",
    },
    {
      id: "san",
      name: "Sanskrit",
      category: "Languages",
      image:
        "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=600&auto=format&fit=crop",
      color: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
      desc: "Learn ancient texts, fundamental grammar rules, and translation strategies to score 98+ marks easily in your language board exams.",
    },
    {
      id: "tel",
      name: "Telugu",
      category: "Languages",
      image:
        "https://i.pinimg.com/736x/df/b6/9a/dfb69a75eb75eeee5e54e565d8f99909.jpg",
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      desc: "Master the Telugu language, literature, and grammar to achieve excellence in your board exams.",
    },
    {
      id: "hin",
      name: "Hindi",
      category: "Languages",
      image:
        "https://i.pinimg.com/736x/73/aa/c5/73aac5fba4a5c2fb42aacb50b88f42bd.jpg",
      color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      desc: "Enhance your Hindi reading, writing, and comprehension skills for top scores in language exams.",
    },
    {
      id: "urd",
      name: "Urdu",
      category: "Languages",
      image:
        "https://i.pinimg.com/736x/8b/3d/42/8b3d4232e8785549760496f8dc06ba02.jpg",
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      desc: "Dive into Urdu poetry, prose, and grammar with expert guidance tailored for board exam success.",
    },
    {
      id: "fre",
      name: "French",
      category: "Languages",
      image:
        "https://i.pinimg.com/736x/13/59/a9/1359a95cbdb26f853b5e23cec0196e36.jpg",
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
        className={`flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border ${
          !isAuthenticated
            ? "border-slate-200/80 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 hover:shadow-amber-500/10"
            : "border-slate-100 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/60 hover:shadow-cyan-500/10"
        } h-[375px] group hover:-translate-y-1.5 relative cursor-pointer`}
        onClick={() => handleSubjectClick(subject)}
      >
        {/* Card Thumbnail */}
        <div className="h-44 w-full overflow-hidden relative shrink-0">
          <img
            src={subject.image}
            alt={subject.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

          {/* Subject Category Icon Badge */}
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/20 text-white shadow-md border border-white/20">
            <BookOpen size={20} />
          </div>


          {/* Lock State Indicator Badge */}
          {!isAuthenticated ? (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xl z-10 group-hover:border-amber-400 group-hover:scale-105 transition-all">
              <Lock size={12} className="text-amber-400" />
              <span>Locked Demo</span>
            </div>
          ) : (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-xl z-10">
              <Sparkles size={12} className="text-emerald-400" />
              <span>Unlocked</span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {subject.category}
              </span>
              {!isAuthenticated && (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Lock size={11} /> Locked
                </span>
              )}
            </div>

            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
              {subject.name}
            </h4>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {subject.desc}
            </p>
          </div>

          {/* Default Card Action Buttons */}
          <div
            className={`mt-auto pt-2 transition-opacity duration-300 ${isExploring || isEnrolling ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={(e) => handleExploreClick(e, subject)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {!isAuthenticated ? (
                  <>
                    <Lock size={13} className="text-amber-500" />
                    <span>Explore</span>
                  </>
                ) : (
                  <>
                    <Info size={15} />
                    <span>Explore</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => handleEnrollClick(e, subject)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  !isAuthenticated
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-amber-500/20"
                    : "bg-slate-900 hover:bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white"
                }`}
              >
                {!isAuthenticated ? (
                  <>
                    <Lock size={13} />
                    <span>Demo Trial</span>
                  </>
                ) : (
                  <>
                    <span>Enroll</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Explore View (when authenticated) */}
          {isAuthenticated && (
            <div
              className={`absolute inset-0 bg-white dark:bg-slate-900 p-5 flex flex-col z-10 transition-transform duration-300 ${isExploring ? "translate-y-0" : "translate-y-full"}`}
            >
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {subject.name} Overview
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed overflow-y-auto pr-1 mb-4 flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {subject.desc}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveExplore(null);
                }}
                className="w-full mt-auto py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} /> Back
              </button>
            </div>
          )}

          {/* Enroll View (when authenticated) */}
          {isAuthenticated && (
            <div
              className={`absolute inset-0 bg-white dark:bg-slate-900 p-5 flex flex-col z-10 transition-transform duration-300 ${isEnrolling ? "translate-y-0" : "translate-y-full"}`}
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 text-center">
                Select Year for {subject.name}
              </h4>
              <div className="flex flex-col gap-2 flex-1 justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEnroll(null);
                    if (onEnroll) onEnroll(`${subject.name} (1st Year)`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm shadow-cyan-500/20"
                >
                  1st Year (Junior)
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveEnroll(null);
                    if (onEnroll) onEnroll(`${subject.name} (2nd Year)`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
                >
                  2nd Year (Senior)
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveEnroll(null);
                }}
                className="w-full mt-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
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
        className={`flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border ${
          !isAuthenticated
            ? "border-slate-200/80 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 hover:shadow-amber-500/10"
            : "border-slate-100 dark:border-slate-800 hover:border-cyan-500/60 dark:hover:border-cyan-500/60 hover:shadow-cyan-500/10"
        } h-[375px] group hover:-translate-y-1.5 relative cursor-pointer`}
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
        {/* Card Thumbnail */}
        <div className="h-44 w-full overflow-hidden relative shrink-0">
          <img
            src={lab.image}
            alt={lab.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

          {/* Practical Category Icon Badge */}
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/20 text-white shadow-md border border-white/20">
            <FlaskConical size={20} />
          </div>

          {/* 30 Marks Practical Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-purple-950/90 backdrop-blur-md border border-purple-400/40 text-purple-200 text-[10px] font-black flex items-center gap-1 shadow-lg z-10">
            <FlaskConical size={11} className="text-purple-300" />
            <span>{lab.boardMarks} Marks Practical</span>
          </div>

          {/* Lock State Indicator Badge */}
          {!isAuthenticated ? (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-xl z-10 group-hover:border-amber-400 group-hover:scale-105 transition-all">
              <Lock size={12} className="text-amber-400" />
              <span>Locked Demo</span>
            </div>
          ) : (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-xl z-10">
              <Sparkles size={12} className="text-emerald-400" />
              <span>Unlocked</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {lab.stream}
              </span>
              {!isAuthenticated && (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Lock size={11} /> Locked
                </span>
              )}
            </div>

            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
              {lab.name}
            </h4>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {lab.overview}
            </p>
          </div>

          {/* Action Buttons identical to Science & Engineering Groups */}
          <div className="mt-auto pt-2">
            <div className="flex gap-2.5">
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
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {!isAuthenticated ? (
                  <>
                    <Lock size={13} className="text-amber-500" />
                    <span>Explore</span>
                  </>
                ) : (
                  <>
                    <Info size={15} />
                    <span>Explore</span>
                  </>
                )}
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
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                  !isAuthenticated
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-amber-500/20"
                    : "bg-slate-900 hover:bg-cyan-600 dark:bg-cyan-700 dark:hover:bg-cyan-500 text-white"
                }`}
              >
                {!isAuthenticated ? (
                  <>
                    <Lock size={13} />
                    <span>Demo Trial</span>
                  </>
                ) : (
                  <>
                    <span>Enroll</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <section
      className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800 relative"
      id="courses"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {!isAuthenticated ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-bold mb-6 shadow-xs">
              <Lock size={14} className="text-amber-500" />
              <span>Intermediate Subjects (Demo Locked)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-bold mb-6 shadow-xs">
              <Sparkles size={14} className="text-cyan-500" />
              <span>AP/TS Board Curriculum (Unlocked)</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Intermediate Subjects
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-xl font-medium">
            Complete subject-wise mastery for Intermediate students. Explore our
            subjects and select your year to enroll and boost your board exam
            scores.
          </p>
        </div>

        {/* Lock Info Banner when user is not signed in */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-10 p-4 sm:p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/25 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 shadow-inner">
                <Lock size={20} />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                  Intermediate Subject Trials are Locked
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
                  Sign in to unlock interactive demo trials and video lessons
                  for any subject.
                </p>
              </div>
            </div>
            <button
              onClick={handleGoToSignIn}
              className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-transform hover:scale-105 active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogIn size={14} />
              <span>Sign In Now</span>
            </button>
          </div>
        )}

        {/* Interactive Stream Filter Tabs */}
        <div className="mb-12">
          <div className="flex flex-nowrap items-center sm:justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-6xl mx-auto overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setSelectedStream("all")}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "all"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              All Subjects (18)
            </button>
            <button
              onClick={() => setSelectedStream("labs")}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedStream === "labs"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
              }`}
            >
              <FlaskConical size={14} className={selectedStream === "labs" ? "text-purple-200" : "text-slate-500 dark:text-slate-400"} />
              <span>Lab / Practicals (8)</span>
            </button>
            <button
              onClick={() => setSelectedStream("mpc")}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "mpc"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              }`}
            >
              1. MPC
            </button>
            <button
              onClick={() => setSelectedStream("bipc")}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "bipc"
                  ? "bg-green-600 text-white shadow-md shadow-green-600/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40"
              }`}
            >
              2. BiPC
            </button>
            <button
              onClick={() => setSelectedStream("cec")}
              title="Commerce, Economics, Civics"
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "cec"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              }`}
            >
              3. CEC
            </button>
            <button
              onClick={() => setSelectedStream("mec")}
              title="Mathematics, Economics, Commerce"
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "mec"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              }`}
            >
              4. MEC
            </button>
            <button
              onClick={() => setSelectedStream("hec")}
              title="History, Economics, Civics"
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "hec"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              }`}
            >
              5. HEC
            </button>
            <button
              onClick={() => setSelectedStream("languages")}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                selectedStream === "languages"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/40"
              }`}
            >
              Languages (6)
            </button>
          </div>
        </div>

        {/* Selected Stream Spotlight Banner */}
        {selectedStream !== "all" && streamDefinitions[selectedStream] && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${streamDefinitions[selectedStream].badgeColor}`}>
                    {streamDefinitions[selectedStream].code === "LABS"
                      ? "Lab / Practicals"
                      : streamDefinitions[selectedStream].code === "LANG"
                      ? "Languages"
                      : `Group ${streamDefinitions[selectedStream].number} • ${streamDefinitions[selectedStream].code}`}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {streamDefinitions[selectedStream].careerBadge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                  {streamDefinitions[selectedStream].name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                  {streamDefinitions[selectedStream].description}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 shrink-0 w-full lg:w-auto">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Subjects & Board Practical Marks:
                </span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-sm">
                  {streamDefinitions[selectedStream].careerList}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Single Filtered Stream View */}
        {selectedStream !== "all" && (
          <div className="mb-16">
            {/* Stream Theory Subjects (if not the labs tab) */}
            {selectedStream !== "labs" && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-7 w-2 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">
                    {streamDefinitions[selectedStream]?.code} Theory Subjects
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                    {selectedStream === "languages"
                      ? "6 Languages"
                      : `${streamDefinitions[selectedStream]?.subjectIds.length || 0} Subjects`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {selectedStream === "languages"
                    ? subjects
                        .filter((s) => s.category === "Languages")
                        .map(renderSubjectCard)
                    : subjects
                        .filter((s) => streamDefinitions[selectedStream]?.subjectIds.includes(s.id))
                        .map(renderSubjectCard)}
                </div>
              </div>
            )}

            {/* Related Board Practical Labs Section for the selected stream */}
            {streamDefinitions[selectedStream]?.practicalLabIds?.length > 0 && (
              <div className={selectedStream !== "labs" ? "mt-14 pt-10 border-t border-slate-200/80 dark:border-slate-800" : ""}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-sm">
                      <FlaskConical size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {selectedStream === "labs"
                            ? "Board Practical Laboratories"
                            : `${streamDefinitions[selectedStream]?.code} Related Board Practical Labs`}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-[11px] font-black uppercase tracking-wider">
                          Compulsory 30M Each
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {selectedStream === "labs"
                          ? "Comprehensive 30-mark board practical curriculum with simulators, viva handbooks & record templates"
                          : `Compulsory board practical examinations, virtual simulators & viva bank for ${streamDefinitions[selectedStream]?.code}`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/practicals");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer group"
                  >
                    <span>View All Practicals Hub</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {LAB_SUBJECTS
                    .filter((lab) => streamDefinitions[selectedStream]?.practicalLabIds.includes(lab.id))
                    .map(renderPracticalCard)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full "All Groups" View Organized into Clear Streams */}
        {selectedStream === "all" && (
          <>
            {/* Stream 1 & 2: Science & Engineering Section (MPC & BiPC) - FIRST */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2.5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-sm"></div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Science & Engineering Groups
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    1. MPC (Maths, Physics, Chem) • 2. BiPC (Botany, Zoology, Physics, Chem)
                  </p>
                </div>
                <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800 ml-4"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {subjects
                  .filter((s) => ["maths", "phy", "chem", "bot", "zoo"].includes(s.id))
                  .map(renderSubjectCard)}
              </div>
            </div>

            {/* Stream: Compulsory Lab & Practical Work (Board 30 Marks) - DEDICATED SECTION */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2.5 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full shadow-sm"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      Lab & Practical Work
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-xs font-black uppercase">
                      Compulsory 30 Marks
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                    Mathematics • Physics • Chemistry • Botany • Zoology • Computer Science • Electronics • Geography
                  </p>
                </div>
                <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-purple-200 to-transparent dark:from-purple-950 ml-4"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {subjects
                  .filter((s) => ["maths", "phy", "chem", "bot", "zoo", "cs", "elec", "geo"].includes(s.id))
                  .map(renderSubjectCard)}
              </div>
            </div>

            {/* Stream 3, 4 & 5: Commerce, Mathematical & Humanities Section (CEC, MEC & HEC) - NEXT */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2.5 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full shadow-sm"></div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Commerce, Mathematics & Humanities Groups
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    3. CEC (Commerce, Econ, Civics) • 4. MEC (Maths, Econ, Commerce) • 5. HEC (History, Econ, Civics)
                  </p>
                </div>
                <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800 ml-4"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {subjects
                  .filter((s) => ["com", "eco", "civ", "his"].includes(s.id))
                  .map(renderSubjectCard)}
              </div>
            </div>

            {/* Languages Section */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-2.5 bg-gradient-to-b from-orange-400 to-rose-600 rounded-full shadow-sm"></div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Compulsory & Second Languages
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
                    Part I: English • Part II: Sanskrit, Telugu, Hindi, Urdu, French
                  </p>
                </div>
                <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-800 ml-4"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {subjects
                  .filter((s) => s.category === "Languages")
                  .map(renderSubjectCard)}
              </div>
            </div>
          </>
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
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

          <div
            className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.7)] border border-slate-200/90 dark:border-slate-800 text-center transform transition-all animate-scaleUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Animated Gradient Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600"></div>

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
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 opacity-30 blur-md animate-pulse"></div>

              {/* Spinning dashed ring effect */}
              <div className="absolute -inset-1 rounded-3xl border border-amber-500/30 border-dashed animate-[spin_12s_linear_infinite]"></div>

              {/* Main Badge */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/30 ring-4 ring-amber-500/20">
                <Lock size={30} className="stroke-[2.2] animate-bounce" />
              </div>

              {/* Corner Sparkle Badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-amber-400 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md">
                <Sparkles size={12} className="animate-pulse" />
              </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2.5 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>Demo Trial Locked</span>
            </div>

            {/* Modal Heading */}
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Sign In Required
            </h3>

            {/* Targeted User-Requested Message */}
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-5 max-w-md mx-auto">
              Please{" "}
              <button
                onClick={handleGoToSignIn}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                sign in
              </button>{" "}
              to access the demo trial for{" "}
              <span className="font-extrabold text-slate-900 dark:text-white underline decoration-amber-500 decoration-2 underline-offset-4">
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
                  <div className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 tracking-wider mb-1">
                    {lockedSubject.category} &bull; AP / TS Intermediate
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white truncate">
                    {lockedSubject.name}
                  </div>
                </div>
              </div>

              {/* Perks Checklist */}
              <div className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>
                    Full Chapter Interactive Lessons & Video Concept Maps
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
                  />
                  <span>Live Formula Simulations & Solved Board Examples</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 shrink-0"
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
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
              >
                {/* Continuous Shimmer Light Sweep */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer pointer-events-none"></span>
                <LogIn
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
                <span>Sign In to Access Demo</span>
              </button>

              <button
                onClick={handleGoToSignUp}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700/60 flex items-center justify-center gap-2 hover:border-slate-300 dark:hover:border-slate-600 group"
              >
                <span>Don't have an account? Sign Up Free</span>
                <ArrowRight
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                />
              </button>
            </div>

            {/* Instant Access Note */}
            <p className="mt-4 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" />
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
