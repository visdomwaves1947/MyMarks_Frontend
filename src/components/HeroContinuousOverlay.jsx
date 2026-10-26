import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  BookOpen,
} from "lucide-react";

/**
 * HeroContinuousOverlay
 * Four continuously transitioning animations:
 * 1. My Marks Logo & Brand Title with gap & text brand animation (~3.0s)
 * 2. Powered by Visdom Waves Innovations Private Limited Driven by vision (~3.0s)
 * 3. Government of Telangana & Andhra Pradesh Rotating Wheels with central My Marks Logo (~5.0s)
 * 4. Continuously Moving 3D Educational Intermediate Books Showcase (~6.0s)
 */
export default function HeroContinuousOverlay({
  onOpenVideoDemo,
  onOpenBooking,
  onSceneChange,
}) {
  const [currentScene, setCurrentScene] = useState(0); // 0, 1, 2, 3
  const [exitingScene, setExitingScene] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Exact user-specified timing:
  // Scene 0 (My Marks Brand): 3 sec (3000ms)
  // Scene 1 (Powered by Visdom Waves + full info): 3 sec (3000ms)
  // Scene 2 (AP & TS Rotating Wheels + My Marks center logo): 3 sec (3000ms)
  // Scene 3 (Continuous Books Showcase): 4 sec (4000ms)
  const SCENE_DURATIONS = [3000, 3000, 3000, 4000];
  const TRANSITION_DURATION = 250;

  // Sync scene change to parent immediately for zero-lag background transitions
  useEffect(() => {
    if (onSceneChange) {
      onSceneChange(currentScene);
    }
  }, [currentScene, onSceneChange]);

  const triggerNextScene = (forcedIndex = null) => {
    const next = forcedIndex !== null ? forcedIndex : (currentScene + 1) % 4;
    setExitingScene(currentScene);
    setCurrentScene(next);
    if (onSceneChange) {
      onSceneChange(next);
    }
    setTimeout(() => {
      setExitingScene(null);
    }, TRANSITION_DURATION);
  };

  useEffect(() => {
    if (isPaused) return;

    const duration = SCENE_DURATIONS[currentScene];
    timerRef.current = setTimeout(() => {
      triggerNextScene();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentScene, isPaused]);

  // AP and TS Intermediate Educational Subject Books Collection
  const INTERMEDIATE_BOOKS = [
    {
      id: "maths",
      subject: "Mathematics",
      code: "Maths 1A • 1B • 2A • 2B",
      stream: "MPC • MEC",
      curriculum: "Algebra & Calculus",
      color: "from-blue-700 via-indigo-900 to-slate-950",
      badge: "MPC / MEC",
      symbol: "∫ dx",
      floatClass: "animate-book-float-a",
    },
    {
      id: "physics",
      subject: "Physics",
      code: "1st & 2nd Year",
      stream: "MPC • BiPC",
      curriculum: "30M Board Practicals",
      color: "from-purple-700 via-violet-900 to-slate-950",
      badge: "30M Lab",
      symbol: "⚛",
      floatClass: "animate-book-float-b",
    },
    {
      id: "chemistry",
      subject: "Chemistry",
      code: "1st & 2nd Year",
      stream: "MPC • BiPC",
      curriculum: "Salt Analysis & Titration",
      color: "from-emerald-700 via-teal-900 to-slate-950",
      badge: "30M Lab",
      symbol: "⚗",
      floatClass: "animate-book-float-c",
    },
    {
      id: "botany",
      subject: "Botany",
      code: "Plant Sciences 1 & 2",
      stream: "BiPC (NEET)",
      curriculum: "Taxonomy & Genetics",
      color: "from-green-700 via-emerald-950 to-slate-950",
      badge: "BiPC NEET",
      symbol: "🌿",
      floatClass: "animate-book-float-a",
    },
    {
      id: "zoology",
      subject: "Zoology",
      code: "Animal Sciences 1 & 2",
      stream: "BiPC (NEET)",
      curriculum: "Physiology & Spotting",
      color: "from-teal-700 via-cyan-950 to-slate-950",
      badge: "BiPC NEET",
      symbol: "🧬",
      floatClass: "animate-book-float-b",
    },
    {
      id: "languages-sanskrit",
      subject: "Sanskrit",
      code: "Part II Language",
      stream: "All Streams",
      curriculum: "Vyakaranam & Shlokas",
      color: "from-amber-700 via-rose-950 to-slate-950",
      badge: "Part II",
      symbol: "📜",
      floatClass: "animate-book-float-c",
    },
    {
      id: "languages-telugu",
      subject: "Telugu",
      code: "Part II Language",
      stream: "All Streams",
      curriculum: "Sahityam & Vyakaranam",
      color: "from-orange-700 via-amber-950 to-slate-950",
      badge: "Part II",
      symbol: "క",
      floatClass: "animate-book-float-a",
    },
    {
      id: "languages-english",
      subject: "English",
      code: "Part I Compulsory",
      stream: "All Streams",
      curriculum: "Literature & Grammar",
      color: "from-rose-700 via-pink-950 to-slate-950",
      badge: "Part I",
      symbol: "Aa",
      floatClass: "animate-book-float-b",
    },
    {
      id: "commerce",
      subject: "Commerce",
      code: "Accountancy & Business",
      stream: "CEC • MEC",
      curriculum: "Ledgers & Balance Sheets",
      color: "from-amber-600 via-yellow-900 to-slate-950",
      badge: "CA Base",
      symbol: "₹",
      floatClass: "animate-book-float-c",
    },
    {
      id: "economics",
      subject: "Economics",
      code: "Micro & Macro Economics",
      stream: "CEC • MEC • HEC",
      curriculum: "National Income & Curves",
      color: "from-yellow-700 via-amber-950 to-slate-950",
      badge: "CEC / MEC",
      symbol: "📈",
      floatClass: "animate-book-float-a",
    },
    {
      id: "civics",
      subject: "Civics",
      code: "Political Science",
      stream: "CEC • HEC",
      curriculum: "Indian Constitution",
      color: "from-indigo-800 via-blue-950 to-slate-950",
      badge: "HEC / Law",
      symbol: "🏛",
      floatClass: "animate-book-float-b",
    },
    {
      id: "history",
      subject: "History",
      code: "Heritage & Civilizations",
      stream: "HEC",
      curriculum: "Timelines & Heritage",
      color: "from-stone-700 via-amber-950 to-slate-950",
      badge: "HEC",
      symbol: "🏺",
      floatClass: "animate-book-float-c",
    },
    {
      id: "cs",
      subject: "Computer Science",
      code: "Python, SQL & Logic",
      stream: "MPC • Vocational",
      curriculum: "30M Practical Lab",
      color: "from-sky-700 via-blue-950 to-slate-950",
      badge: "30M Lab",
      symbol: "01",
      floatClass: "animate-book-float-a",
    },
  ];

  const renderScene = (sceneIdx, isExit = false) => {
    const animationClass = isExit
      ? "animate-hero-scene-exit pointer-events-none"
      : "animate-hero-scene-enter";

    switch (sceneIdx) {
      // =========================================================================
      // 1. ANIMATION ONE — My Marks Logo and Brand Title (3.0s)
      // - Clear gap between "My" and "Marks"
      // - Text brand animation on "Marks" (animate-text-shimmer)
      // - Ultra-clear, high-visibility My Marks logo image
      // =========================================================================
      case 0:
        return (
          <div
            key={`scene-0-${isExit ? "exit" : "active"}`}
            className={`w-full max-w-4xl mx-auto flex items-center justify-center text-center px-3 select-none ${animationClass}`}
          >
            <div className="flex items-center justify-center gap-3 xs:gap-3.5 sm:gap-5 md:gap-6 bg-slate-950/75 backdrop-blur-md px-5 xs:px-7 sm:px-10 py-3.5 xs:py-4 sm:py-5 rounded-3xl border border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.7)] ring-1 ring-cyan-400/40">
              {/* Ultra-Clear My Marks Logo Image with Crisp Contrast & Glow */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/60 via-cyan-400/60 to-indigo-500/60 rounded-2xl blur-md opacity-90 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-2xl bg-white p-1.5 xs:p-2 shadow-[0_4px_24px_rgba(0,0,0,0.95)] border border-white/90 flex items-center justify-center">
                  <img
                    src="/logomymarks.png"
                    alt="My Marks Logo"
                    className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast]"
                  />
                </div>
              </div>

              {/* Brand Title with Clear Gap & Text Shimmer Animation */}
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3.5">
                <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  My
                </span>
                <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent animate-text-shimmer tracking-tight leading-none whitespace-nowrap drop-shadow-[0_4px_20px_rgba(34,211,238,0.7)]">
                  Marks
                </span>
              </div>
            </div>
          </div>
        );

      // =========================================================================
      // 2. ANIMATION TWO — Powered by Visdom Waves Full Info (3.0s)
      // - "Powered by"
      // - Visdom Waves logo
      // - Visdom Waves Innovations Private Limited
      // - Driven by vision (with cyan accent lines)
      // =========================================================================
      case 1:
        return (
          <div
            key={`scene-1-${isExit ? "exit" : "active"}`}
            className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-3 select-none ${animationClass}`}
          >
            <div className="flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-md px-5 xs:px-7 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-3xl border border-cyan-400/35 shadow-[0_12px_40px_rgba(0,0,0,0.7)] ring-1 ring-cyan-400/40">
              {/* Small Subtle Lightweight "Powered by" */}
              <span className="text-[10px] xs:text-xs sm:text-sm font-bold text-white tracking-[0.25em] uppercase mb-1 sm:mb-1.5 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                Powered by
              </span>

              {/* Full Visdom Waves Brand Layout - Always Horizontal Side-by-Side Like Laptop View */}
              <div className="flex flex-row items-center justify-center gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 text-left">
                {/* Visdom Waves Logo with Crisp Backdrop */}
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1 bg-cyan-400/40 rounded-xl blur-sm"></div>
                  <img
                    src="/Visdomlogo.png"
                    alt="Visdom Waves Logo"
                    className="relative h-8 xs:h-10 sm:h-16 md:h-18 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] shrink-0 [image-rendering:-webkit-optimize-contrast]"
                  />
                </div>

                {/* Full Brand Details: Visdom Waves + Innovations Private Limited + Driven by vision */}
                <div className="flex flex-col items-start justify-center">
                  <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                    Visdom Waves
                  </h2>

                  <h3 className="text-[10px] xs:text-xs sm:text-lg md:text-xl font-bold text-cyan-300 tracking-wide mt-0.5 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    Innovations Private Limited
                  </h3>

                  {/* Slogan: Driven by vision */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                    <span className="h-[2px] w-3 xs:w-4 sm:w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"></span>
                    <span className="text-[8px] xs:text-[9.5px] sm:text-xs font-bold text-cyan-200 tracking-[0.2em] uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                      Driven by vision
                    </span>
                    <span className="h-[2px] w-3 xs:w-4 sm:w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // =========================================================================
      // 3. ANIMATION THREE — Government of AP & Telangana Real Golden Chakras (3.0s)
      // Symmetrical layout: [Telangana Chakra] <--> [AP Chakra]
      // Real 24-spoke Golden Chakra wheels, text covering full 360° circle,
      // authentic gold colors, fast rotation, and crisp state seals.
      // =========================================================================
      case 2:
        return (
          <div
            key={`scene-2-${isExit ? "exit" : "active"}`}
            className={`w-full max-w-4xl mx-auto flex items-center justify-center px-1 xs:px-2 select-none ${animationClass}`}
          >
            <div className="flex items-center justify-center gap-6 xs:gap-8 sm:gap-14 md:gap-20 w-full bg-slate-950/75 backdrop-blur-md px-4 xs:px-6 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-3xl border border-amber-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.7)] ring-1 ring-amber-400/40">
              {/* Left Circular Rotating Chakra: Government of Telangana */}
              <div className="flex flex-col items-center">
                <div className="relative w-18 h-18 xs:w-22 xs:h-22 sm:w-28 sm:h-28 md:w-34 md:h-34 shrink-0">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full animate-wheel-spin drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)]"
                  >
                    <defs>
                      <linearGradient id="tsGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF7B8" />
                        <stop offset="25%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="75%" stopColor="#B45309" />
                        <stop offset="100%" stopColor="#FFE066" />
                      </linearGradient>
                      <linearGradient id="tsSpokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="25%" stopColor="#FFE066" />
                        <stop offset="60%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#92400E" />
                      </linearGradient>
                      <radialGradient id="tsBeadGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="40%" stopColor="#FFE57F" />
                        <stop offset="75%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#78350F" />
                      </radialGradient>
                      <path
                        id="tsWheelPath"
                        d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                      />
                    </defs>

                    {/* Outer 24K Gold Beaded Rim */}
                    <circle
                      cx="100"
                      cy="100"
                      r="97"
                      fill="none"
                      stroke="url(#tsGoldGrad)"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="93.5"
                      fill="none"
                      stroke="#78350F"
                      strokeWidth="1"
                      opacity="0.6"
                    />

                    {/* 24 Golden Chakra Outer Studs / Rivets */}
                    {[...Array(24)].map((_, i) => (
                      <circle
                        key={`ts-rim-${i}`}
                        cx="100"
                        cy="6"
                        r="2.2"
                        fill="url(#tsBeadGrad)"
                        transform={`rotate(${i * 15} 100 100)`}
                      />
                    ))}

                    <circle
                      cx="100"
                      cy="100"
                      r="87"
                      fill="none"
                      stroke="url(#tsGoldGrad)"
                      strokeWidth="1.8"
                    />

                    {/* Full 360° Circular Text Covering Entire Circle */}
                    <text className="fill-amber-300 text-[8.5px] font-black tracking-[1.4px] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                      <textPath href="#tsWheelPath" startOffset="0%">
                        <tspan textLength="471" lengthAdjust="spacingAndGlyphs">
                          ★ GOVERNMENT OF TELANGANA ★ TS BIE INTERMEDIATE ★ SYLLABUS 2025-26 ★
                        </tspan>
                      </textPath>
                    </text>

                    {/* Inner Rim Divider */}
                    <circle
                      cx="100"
                      cy="100"
                      r="64"
                      fill="none"
                      stroke="url(#tsGoldGrad)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      opacity="0.75"
                    />

                    {/* 24 Real Golden Chakra Spokes Radiating Outwards */}
                    {[...Array(24)].map((_, i) => (
                      <g key={`ts-spoke-${i}`} transform={`rotate(${i * 15} 100 100)`}>
                        <line
                          x1="100"
                          y1="34"
                          x2="100"
                          y2="60"
                          stroke="url(#tsSpokeGrad)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="100"
                          cy="59"
                          r="1.6"
                          fill="url(#tsBeadGrad)"
                        />
                      </g>
                    ))}

                    {/* Golden Center Hub Ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="34"
                      fill="none"
                      stroke="url(#tsGoldGrad)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="31"
                      fill="none"
                      stroke="#FFE57F"
                      strokeWidth="1.2"
                      opacity="0.9"
                    />
                  </svg>

                  {/* Center Emblem: Government of Telangana Seal (Stationary & Regal) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 xs:w-11 xs:h-11 sm:w-15 sm:h-15 md:w-18 md:h-18 rounded-full bg-white p-0.5 sm:p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.85)] border-2 border-amber-400 ring-2 ring-amber-300/70 flex items-center justify-center">
                      <img
                        src="/ts_logo.png"
                        alt="Telangana Board Seal"
                        className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast]"
                      />
                    </div>
                  </div>
                </div>

                <span className="text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm font-extrabold text-amber-300 uppercase tracking-widest mt-1.5 sm:mt-2 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  Govt of Telangana
                </span>
              </div>

              {/* Right Circular Rotating Chakra: Government of Andhra Pradesh */}
              <div className="flex flex-col items-center">
                <div className="relative w-18 h-18 xs:w-22 xs:h-22 sm:w-28 sm:h-28 md:w-34 md:h-34 shrink-0">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full animate-wheel-spin-reverse drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)]"
                  >
                    <defs>
                      <linearGradient id="apGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF7B8" />
                        <stop offset="25%" stopColor="#FFD700" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="75%" stopColor="#B45309" />
                        <stop offset="100%" stopColor="#FFE066" />
                      </linearGradient>
                      <linearGradient id="apSpokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="25%" stopColor="#FFE066" />
                        <stop offset="60%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#92400E" />
                      </linearGradient>
                      <radialGradient id="apBeadGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="40%" stopColor="#FFE57F" />
                        <stop offset="75%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#78350F" />
                      </radialGradient>
                      <path
                        id="apWheelPath"
                        d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                      />
                    </defs>

                    {/* Outer 24K Gold Beaded Rim */}
                    <circle
                      cx="100"
                      cy="100"
                      r="97"
                      fill="none"
                      stroke="url(#apGoldGrad)"
                      strokeWidth="3.5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="93.5"
                      fill="none"
                      stroke="#78350F"
                      strokeWidth="1"
                      opacity="0.6"
                    />

                    {/* 24 Golden Chakra Outer Studs / Rivets */}
                    {[...Array(24)].map((_, i) => (
                      <circle
                        key={`ap-rim-${i}`}
                        cx="100"
                        cy="6"
                        r="2.2"
                        fill="url(#apBeadGrad)"
                        transform={`rotate(${i * 15} 100 100)`}
                      />
                    ))}

                    <circle
                      cx="100"
                      cy="100"
                      r="87"
                      fill="none"
                      stroke="url(#apGoldGrad)"
                      strokeWidth="1.8"
                    />

                    {/* Full 360° Circular Text Covering Entire Circle */}
                    <text className="fill-amber-300 text-[8.5px] font-black tracking-[1.4px] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                      <textPath href="#apWheelPath" startOffset="0%">
                        <tspan textLength="471" lengthAdjust="spacingAndGlyphs">
                          ★ GOVERNMENT OF ANDHRA PRADESH ★ BIEAP INTERMEDIATE ★ SYLLABUS 2025-26 ★
                        </tspan>
                      </textPath>
                    </text>

                    {/* Inner Rim Divider */}
                    <circle
                      cx="100"
                      cy="100"
                      r="64"
                      fill="none"
                      stroke="url(#apGoldGrad)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      opacity="0.75"
                    />

                    {/* 24 Real Golden Chakra Spokes Radiating Outwards */}
                    {[...Array(24)].map((_, i) => (
                      <g key={`ap-spoke-${i}`} transform={`rotate(${i * 15} 100 100)`}>
                        <line
                          x1="100"
                          y1="34"
                          x2="100"
                          y2="60"
                          stroke="url(#spokeGold)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="100"
                          cy="59"
                          r="1.6"
                          fill="url(#apBeadGrad)"
                        />
                      </g>
                    ))}

                    {/* Golden Center Hub Ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r="34"
                      fill="none"
                      stroke="url(#apGoldGrad)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="31"
                      fill="none"
                      stroke="#FFE57F"
                      strokeWidth="1.2"
                      opacity="0.9"
                    />
                  </svg>

                  {/* Center Emblem: Government of Andhra Pradesh Seal (Stationary & Regal) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 xs:w-11 xs:h-11 sm:w-15 sm:h-15 md:w-18 md:h-18 rounded-full bg-white p-0.5 sm:p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.85)] border-2 border-amber-400 ring-2 ring-amber-300/70 flex items-center justify-center">
                      <img
                        src="/ap_logo.png"
                        alt="Andhra Pradesh Board Seal"
                        className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast]"
                      />
                    </div>
                  </div>
                </div>

                <span className="text-[8.5px] xs:text-[10px] sm:text-xs md:text-sm font-extrabold text-amber-300 uppercase tracking-widest mt-1.5 sm:mt-2 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  Govt of Andhra Pradesh
                </span>
              </div>
            </div>
          </div>
        );

      // =========================================================================
      // 4. ANIMATION FOUR — Continuously Moving Educational Books Showcase (6.0s)
      // Seamless horizontal marquee, 3D perspective, staggered floats.
      // Compact and clean for reduced mobile height.
      // =========================================================================
      case 3:
        return (
          <div
            key={`scene-3-${isExit ? "exit" : "active"}`}
            className={`w-full max-w-6xl mx-auto flex items-center justify-center select-none ${animationClass}`}
          >
            {/* 3D Realistic Hardcover Books Gliding Showcase */}
            <div className="relative w-full perspective-1200 overflow-hidden py-1">
              {/* Edge Gradient Fades for Depth Horizon */}
              <div className="absolute left-0 inset-y-0 w-6 sm:w-14 bg-gradient-to-r from-[#040d28] to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 inset-y-0 w-6 sm:w-14 bg-gradient-to-l from-[#040d28] to-transparent z-20 pointer-events-none" />

              {/* Continuous Horizontal Marquee Track of Realistic Hardcover Textbooks */}
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-4 md:gap-5 w-max animate-book-marquee transform-style-3d">
                {[...INTERMEDIATE_BOOKS, ...INTERMEDIATE_BOOKS].map(
                  (book, index) => (
                    <div
                      key={`${book.id}-${index}`}
                      className={`relative w-22 xs:w-26 sm:w-34 md:w-38 h-30 xs:h-34 sm:h-46 md:h-50 rounded-r-xl rounded-l-sm bg-gradient-to-br ${book.color} border border-white/20 shadow-2xl transition-all duration-300 hover:scale-105 shrink-0 text-left flex flex-col justify-between p-1.5 xs:p-2 sm:p-2.5 cursor-pointer group ${book.floatClass}`}
                    >
                      {/* Realistic Hardcover Book Spine Bevel on Left Edge */}
                      <div className="absolute left-0 inset-y-0 w-1.5 xs:w-2 sm:w-2.5 bg-gradient-to-r from-black/60 via-white/20 to-black/40 rounded-l-sm border-r border-white/10" />

                      {/* Right Paper Edge Bevel */}
                      <div className="absolute right-0 inset-y-1 w-1 bg-gradient-to-b from-slate-200 via-amber-100 to-slate-300 rounded-r-sm opacity-80 shadow-md" />

                      {/* Top Header: Board + Stream Indicator */}
                      <div className="pl-1.5 sm:pl-2 flex items-center justify-between">
                        <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-semibold text-white/80 tracking-wider uppercase whitespace-nowrap">
                          {book.stream}
                        </span>
                        <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] font-semibold px-1 py-0.5 rounded bg-white/15 border border-white/20 text-cyan-200 whitespace-nowrap">
                          {book.badge}
                        </span>
                      </div>

                      {/* Center Subject Name & Emblem */}
                      <div className="pl-1.5 sm:pl-2 my-auto">
                        <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white mb-0.5 shadow-inner group-hover:scale-110 transition-transform font-serif font-black text-[11px] sm:text-sm">
                          {book.symbol}
                        </div>
                        <h3 className="text-[10px] xs:text-[11px] sm:text-sm md:text-base font-semibold text-white leading-tight line-clamp-1 drop-shadow">
                          {book.subject}
                        </h3>
                        <p className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] text-cyan-200/80 leading-tight mt-0.5 line-clamp-1">
                          {book.code}
                        </p>
                      </div>

                      {/* Bottom Footer: Curriculum / Practicals */}
                      <div className="pl-1.5 sm:pl-2 pt-0.5 sm:pt-1 border-t border-white/15 flex items-center justify-between text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] text-white/70">
                        <span className="truncate">{book.curriculum}</span>
                        <span className="text-cyan-300 font-bold group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="relative z-10 w-full flex flex-col items-center justify-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Overlay Canvas Stage (Compact Mobile Height, Zero Layout Shift) */}
      <div className="relative w-full min-h-[100px] xs:min-h-[120px] sm:min-h-[160px] md:min-h-[200px] flex items-center justify-center overflow-hidden">
        {/* Render Current Active Scene */}
        {renderScene(currentScene, false)}

        {/* Render Exiting Scene in Parallel during 500ms Transition (Zero Blank Frames) */}
        {exitingScene !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {renderScene(exitingScene, true)}
          </div>
        )}
      </div>

      {/* Persistent Primary Action Buttons (Decreased size on mobile, clean side-by-side) */}
      <div className="flex flex-row items-center justify-center gap-1.5 xs:gap-2 sm:gap-4 mt-2 xs:mt-2.5 sm:mt-5 w-full px-2 sm:w-auto">
        <button
          onClick={() => onOpenVideoDemo && onOpenVideoDemo()}
          className="w-auto px-2.5 xs:px-3 sm:px-7 py-1.5 xs:py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-[10px] xs:text-[11px] sm:text-sm md:text-base shadow-xl shadow-black/60 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer border border-blue-400/50"
        >
          <Play size={12} className="sm:w-4 sm:h-4" fill="currentColor" />
          <span className="whitespace-nowrap">Watch Demo Videos</span>
        </button>

        <button
          onClick={() => {
            const subjectsEl = document.getElementById("courses");
            if (subjectsEl) {
              subjectsEl.scrollIntoView({ behavior: "smooth" });
            } else if (onOpenBooking) {
              onOpenBooking("Intermediate AP & TS Course");
            }
          }}
          className="w-auto px-2.5 xs:px-3 sm:px-6 py-1.5 xs:py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold text-[10px] xs:text-[11px] sm:text-sm md:text-base border border-white/40 backdrop-blur-md shadow-xl shadow-black/60 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <BookOpen size={12} className="sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Explore Subjects</span>
        </button>
      </div>

      {/* Minimal Elegant Scene Navigation Indicators with dark pill for crisp visibility */}
      <div className="flex items-center gap-1.5 xs:gap-2 mt-2 xs:mt-2.5 sm:mt-4 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
        {[
          { label: "My Marks Brand", index: 0 },
          { label: "Powered by Visdom Waves", index: 1 },
          { label: "AP & TS Boards", index: 2 },
          { label: "Textbooks Showcase", index: 3 },
        ].map((item) => {
          const isActive = currentScene === item.index;
          return (
            <button
              key={item.index}
              id={`hero-dot-${item.index}`}
              onClick={() => triggerNextScene(item.index)}
              title={item.label}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? "w-6 sm:w-9 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                  : "w-1.5 sm:w-2.5 bg-white/40 hover:bg-white/80"
              }`}
              aria-label={`Switch to ${item.label}`}
            />
          );
        })}
      </div>
    </div>
  );
}

