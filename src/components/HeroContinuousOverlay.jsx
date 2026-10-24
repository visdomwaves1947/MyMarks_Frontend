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
}) {
  const [currentScene, setCurrentScene] = useState(0); // 0, 1, 2, 3
  const [exitingScene, setExitingScene] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Exact user-specified timing:
  // Scene 0 (My Marks Brand): 3 sec (3000ms)
  // Scene 1 (Powered by Visdom Waves + full info): 3 sec (3000ms)
  // Scene 2 (AP & TS Rotating Wheels + My Marks center logo): 5 sec (5000ms)
  // Scene 3 (Continuous Books Showcase): 6 sec (6000ms)
  const SCENE_DURATIONS = [3000, 3000, 5000, 6000];
  const TRANSITION_DURATION = 350;

  const triggerNextScene = (forcedIndex = null) => {
    setCurrentScene((prev) => {
      const next = forcedIndex !== null ? forcedIndex : (prev + 1) % 4;
      setExitingScene(prev);
      setTimeout(() => {
        setExitingScene(null);
      }, TRANSITION_DURATION);
      return next;
    });
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
            <div className="flex items-center justify-center gap-3 xs:gap-3.5 sm:gap-5 md:gap-6">
              {/* Ultra-Clear My Marks Logo Image with Crisp Contrast & Glow */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 via-cyan-400/50 to-indigo-500/50 rounded-2xl blur-md opacity-80 group-hover:opacity-100 transition-opacity"></div>
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
                <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-medium text-white tracking-tight leading-none whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  My
                </span>
                <span className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-medium bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent animate-text-shimmer tracking-tight leading-none whitespace-nowrap drop-shadow-[0_4px_20px_rgba(34,211,238,0.7)]">
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
            {/* Small Subtle Lightweight "Powered by" */}
            <span className="text-[10px] xs:text-xs sm:text-sm font-light text-slate-300 tracking-[0.25em] uppercase mb-1 sm:mb-1.5 whitespace-nowrap drop-shadow">
              Powered by
            </span>

            {/* Full Visdom Waves Brand Layout - Always Horizontal Side-by-Side Like Laptop View */}
            <div className="flex flex-row items-center justify-center gap-2.5 xs:gap-3 sm:gap-4 md:gap-5 text-left">
              {/* Visdom Waves Logo with Crisp Backdrop */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-cyan-400/30 rounded-xl blur-sm"></div>
                <img
                  src="/Visdomlogo.png"
                  alt="Visdom Waves Logo"
                  className="relative h-8 xs:h-10 sm:h-16 md:h-18 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] shrink-0 [image-rendering:-webkit-optimize-contrast]"
                />
              </div>

              {/* Full Brand Details: Visdom Waves + Innovations Private Limited + Driven by vision */}
              <div className="flex flex-col items-start justify-center">
                <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight whitespace-nowrap drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  Visdom Waves
                </h2>

                <h3 className="text-[10px] xs:text-xs sm:text-lg md:text-xl font-medium text-cyan-300 tracking-wide mt-0.5 whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Innovations Private Limited
                </h3>

                {/* Slogan: Driven by vision */}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                  <span className="h-[1.5px] w-3 xs:w-4 sm:w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"></span>
                  <span className="text-[8px] xs:text-[9.5px] sm:text-xs font-semibold text-cyan-200 tracking-[0.2em] uppercase whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    Driven by vision
                  </span>
                  <span className="h-[1.5px] w-3 xs:w-4 sm:w-6 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"></span>
                </div>
              </div>
            </div>
          </div>
        );

      // =========================================================================
      // 3. ANIMATION THREE — Government of AP & Telangana Rotating Wheels (5.0s)
      // Symmetrical layout: [Telangana Wheel] - [My Marks Logo] - [AP Wheel]
      // Clear logos, labels, smooth rotation, compact mobile fit.
      // =========================================================================
      case 2:
        return (
          <div
            key={`scene-2-${isExit ? "exit" : "active"}`}
            className={`w-full max-w-4xl mx-auto flex items-center justify-center px-1 xs:px-2 select-none ${animationClass}`}
          >
            <div className="flex items-center justify-center gap-1.5 xs:gap-2.5 sm:gap-5 md:gap-8 w-full">
              {/* Left Circular Rotating Wheel: Government of Telangana */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full animate-wheel-spin"
                  >
                    <defs>
                      <path
                        id="tsWheelPath"
                        d="M 100, 100 m -74, 0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
                      />
                    </defs>
                    {/* Concentric Gold Spoke & Gear Teeth Borders */}
                    <circle
                      cx="100"
                      cy="100"
                      r="96"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="3 4"
                      opacity="0.9"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="88"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                    {/* Circular Rotating Text */}
                    <text className="fill-amber-300 text-[10px] sm:text-[10.5px] font-bold tracking-[2.2px] uppercase">
                      <textPath href="#tsWheelPath" startOffset="0%">
                        WE SUPPORT TELANGANA INTERMEDIATE SYLLABUS • 
                      </textPath>
                    </text>
                  </svg>

                  {/* Center Emblem: Government of Telangana Seal */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white p-0.5 sm:p-1 shadow-lg border border-amber-400/60 flex items-center justify-center">
                      <img
                        src="/ts_logo.png"
                        alt="Telangana Board Seal"
                        className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast]"
                      />
                    </div>
                  </div>
                </div>

                <span className="text-[7px] xs:text-[8px] sm:text-[9.5px] md:text-xs font-medium text-amber-200/90 uppercase tracking-wider mt-0.5 sm:mt-1 whitespace-nowrap drop-shadow">
                  Govt of Telangana
                </span>
              </div>

              {/* Central My Marks Logo (Decreased size on mobile between TS and AP wheels) */}
              <div className="flex flex-col items-center justify-center px-0.5 sm:px-1.5 shrink-0">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-white p-0.5 sm:p-1 shadow-xl border border-blue-400/50 flex items-center justify-center">
                  <img
                    src="/logomymarks.png"
                    alt="My Marks Logo"
                    className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast]"
                  />
                </div>
                <span className="text-[7px] xs:text-[8px] sm:text-[10px] md:text-xs font-semibold text-white tracking-wide mt-0.5 whitespace-nowrap drop-shadow">
                  My Marks
                </span>
              </div>

              {/* Right Circular Rotating Wheel: Government of Andhra Pradesh */}
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full animate-wheel-spin-reverse"
                  >
                    <defs>
                      <path
                        id="apWheelPath"
                        d="M 100, 100 m -74, 0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
                      />
                    </defs>
                    {/* Concentric Gold Spoke & Gear Teeth Borders */}
                    <circle
                      cx="100"
                      cy="100"
                      r="96"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeDasharray="3 4"
                      opacity="0.9"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="88"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      opacity="0.5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="60"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                    {/* Circular Rotating Text */}
                    <text className="fill-amber-300 text-[10px] sm:text-[10.5px] font-bold tracking-[2.2px] uppercase">
                      <textPath href="#apWheelPath" startOffset="0%">
                        WE SUPPORT AP INTERMEDIATE SYLLABUS • 
                      </textPath>
                    </text>
                  </svg>

                  {/* Center Emblem: Government of Andhra Pradesh Seal */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 xs:w-9 xs:h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white p-0.5 sm:p-1 shadow-lg border border-amber-400/60 flex items-center justify-center">
                      <img
                        src="/ap_logo.png"
                        alt="Andhra Pradesh Board Seal"
                        className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast]"
                      />
                    </div>
                  </div>
                </div>

                <span className="text-[7px] xs:text-[8px] sm:text-[9.5px] md:text-xs font-medium text-amber-200/90 uppercase tracking-wider mt-0.5 sm:mt-1 whitespace-nowrap drop-shadow">
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
          className="w-auto px-2 xs:px-2.5 sm:px-7 py-1 xs:py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-medium text-[9.5px] xs:text-[10.5px] sm:text-sm md:text-base shadow-md shadow-indigo-950/70 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1 xs:gap-1.5 cursor-pointer border border-blue-400/40"
        >
          <Play size={11} className="sm:w-4 sm:h-4" fill="currentColor" />
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
          className="w-auto px-2 xs:px-2.5 sm:px-6 py-1 xs:py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[9.5px] xs:text-[10.5px] sm:text-sm md:text-base border border-white/30 backdrop-blur-md shadow-sm shadow-black/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-1 xs:gap-1.5 cursor-pointer"
        >
          <BookOpen size={11} className="sm:w-4 sm:h-4" />
          <span className="whitespace-nowrap">Explore Subjects</span>
        </button>
      </div>

      {/* Minimal Elegant Scene Navigation Indicators (Click to switch directly) */}
      <div className="flex items-center gap-1.5 xs:gap-2 mt-2 xs:mt-2.5 sm:mt-4">
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
              onClick={() => triggerNextScene(item.index)}
              title={item.label}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-400 cursor-pointer ${
                isActive
                  ? "w-5 xs:w-6 sm:w-9 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  : "w-1 xs:w-1.5 sm:w-2.5 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Switch to ${item.label}`}
            />
          );
        })}
      </div>
    </div>
  );
}

