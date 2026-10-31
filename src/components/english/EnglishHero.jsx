import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  RotateCw,
  Feather,
  Languages,
  PenTool
} from 'lucide-react';

export default function EnglishHero({ onOpenBooking, onOpenVideoDemo }) {
  // Real 3D Book Opening Animation State (Starts closed on load/refresh)
  const [isBookOpen, setIsBookOpen] = useState(false);

  const handleStartLearning = () => {
    if (onOpenBooking) {
      onOpenBooking('English Language & Literature Program');
    }
  };

  const handleExplorePractice = () => {
    const practiceSection = document.getElementById('english-curriculum') || document.getElementById('roadmaps') || document.getElementById('courses');
    if (practiceSection) {
      practiceSection.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenVideoDemo) {
      onOpenVideoDemo();
    }
  };

  return (
    <section className="relative pt-8 pb-14 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-16 overflow-hidden bg-[#EBF0F7] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* Subtle Background Pattern & Coordinate Grid */}
      <div className="absolute inset-0 bg-math-grid opacity-70 dark:opacity-40 pointer-events-none -z-10"></div>

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-300/30 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-indigo-300/30 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-teal-300/20 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TWO-COLUMN HERO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

          {/* =========================================================================
              LEFT COLUMN: TEXT, ACTIONS & TELANGANA / ANDHRA PRADESH CARDS (7 COLS)
              ========================================================================= */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight mb-2.5">
              Master English.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 bg-clip-text text-transparent">
                Express with Confidence.
              </span>
            </h1>

            {/* Supporting Description Text */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-4 max-w-2xl mx-auto lg:mx-0">
              Learn English literature, grammar, essay writing, comprehension, and communication skills through practice questions, mock tests, and previous-year question papers designed to help students score 100/100.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 mb-4">
              {/* Start Learning Button */}
              <button
                onClick={handleStartLearning}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-sky-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Start Learning English</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Explore Practice Button */}
              <button
                onClick={handleExplorePractice}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm border border-blue-200 dark:border-blue-800 shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <BookOpen size={15} className="text-blue-600 dark:text-blue-400" />
                <span>Explore Curriculum</span>
              </button>
            </div>

            {/* TELANGANA + ANDHRA PRADESH CURRICULUM SECTION */}
            <div className="pt-3 border-t border-blue-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-blue-600 dark:text-blue-400" />
                  State Board English Curriculums
                </span>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  2025–26 Syllabus
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto lg:mx-0 text-left">

                {/* Card 1: Telangana */}
                <div
                  onClick={handleExplorePractice}
                  className="relative p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-xs hover:shadow-md group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icon, State Name & Board Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs shrink-0">
                          <GraduationCap size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block leading-none">
                            Telangana
                          </span>
                          <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                            Govt. of Telangana
                          </h2>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900 shrink-0">
                        TS BIE
                      </span>
                    </div>

                    <p className="text-[11.5px] text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-2">
                      Complete TS Intermediate English resources, prose, poetry, letter writing & grammar blueprints.
                    </p>
                  </div>

                  {/* Subject Tags & Indicator */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-1 mb-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                        Junior Inter English
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                        Senior Inter English
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] font-semibold text-blue-700 dark:text-blue-400 pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                        TS Board & CUET Ready
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-300 group-hover:translate-x-0.5 transition-transform">
                        Explore <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Andhra Pradesh */}
                <div
                  onClick={handleExplorePractice}
                  className="relative p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-xs hover:shadow-md group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icon, State Name & Board Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-xs shrink-0">
                          <GraduationCap size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block leading-none">
                            Andhra Pradesh
                          </span>
                          <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
                            Govt. of Andhra Pradesh
                          </h2>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900 shrink-0">
                        BIEAP
                      </span>
                    </div>

                    <p className="text-[11.5px] text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-2">
                      Targeted AP syllabus modules, 100/100 scoring templates, phonetics guides & 10-year question banks.
                    </p>
                  </div>

                  {/* Subject Tags & Indicator */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-1 mb-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                        Junior Inter English
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                        Senior Inter English
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] font-semibold text-blue-700 dark:text-blue-400 pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400"></span>
                        AP Board Ready
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-300 group-hover:translate-x-0.5 transition-transform">
                        Explore <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: REALISTIC 3D ANIMATED ENGLISH LITERATURE & GRAMMAR BOOK
              ========================================================================= */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center py-2 select-none">

            {/* FLOATING ENGLISH LITERARY & GRAMMATICAL SYMBOLS AROUND THE BOOK */}
            <div className="absolute -top-3 left-6 px-2.5 py-1 rounded-lg bg-white border border-slate-300 shadow-md font-serif font-black text-base pointer-events-none animate-float-slow z-30" style={{ color: '#000000' }}>
              ✦ Syntax
            </div>

            <div className="absolute top-10 right-4 px-2.5 py-1 rounded-lg bg-white border border-slate-300 shadow-md font-mono font-black text-base pointer-events-none animate-float-reverse z-30" style={{ color: '#000000' }}>
              /ɪŋɡlɪʃ/
            </div>

            <div className="absolute top-1/4 -left-4 sm:-left-8 px-3 py-1.5 rounded-xl bg-white border border-slate-300 shadow-lg font-mono text-xs font-black pointer-events-none animate-float-slow z-30 backdrop-blur-md hidden sm:flex items-center gap-1.5" style={{ color: '#000000' }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span style={{ color: '#000000' }}>Subject + Verb + Object</span>
            </div>

            <div className="absolute bottom-12 -right-2 sm:-right-6 px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 shadow-lg font-serif text-xs font-black pointer-events-none animate-float-reverse z-30 backdrop-blur-md hidden sm:flex items-center gap-1.5" style={{ color: '#000000' }}>
              <span className="text-amber-500">📜</span>
              <span style={{ color: '#000000' }}>Metaphor & Simile</span>
            </div>

            <div className="absolute bottom-2 left-10 px-2.5 py-1 rounded-lg bg-white border border-slate-300 shadow-md font-mono font-black text-sm pointer-events-none animate-float-slow z-30" style={{ color: '#000000' }}>
              Passive Voice
            </div>

            <div className="absolute -top-2 right-1/3 px-2.5 py-1 rounded-lg bg-white border border-slate-300 shadow-md font-serif font-black text-xs pointer-events-none animate-float-reverse z-30" style={{ color: '#000000' }}>
              IELTS Band 8.5
            </div>

            {/* REALISTIC 3D BOOK STAGE WITH PERSPECTIVE & SMOOTH INERTIAL OPEN/CLOSE */}
            <div
              className="relative w-full max-w-[480px] sm:max-w-[530px] transition-all duration-700 cursor-pointer group"
              onClick={() => setIsBookOpen(prev => !prev)}
              style={{
                perspective: '1600px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Dynamic Table Reflection & Ground Drop Shadow */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 bg-slate-950/30 dark:bg-black/80 blur-2xl rounded-full transition-all duration-700 pointer-events-none ${
                  isBookOpen ? '-bottom-7 w-[92%] h-12' : '-bottom-5 w-[65%] h-8'
                }`}
              ></div>

              {/* Ambient Magical Backglow */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-teal-500/20 dark:from-amber-600/30 dark:via-indigo-600/30 dark:to-teal-600/30 blur-2xl -z-10"></div>

              {/* ===============================================================
                  REALISTIC PHYSICAL BOOK SPREAD (DUAL PAGES & HARDBACK CASING)
                  =============================================================== */}
              <div
                className="relative rounded-2xl bg-gradient-to-r from-[#2A1B14] via-[#161224] to-[#2A1B14] p-2.5 sm:p-3 shadow-2xl border border-amber-900/60 transition-all duration-700 transform-gpu"
                style={{
                  transform: isBookOpen
                    ? 'rotateX(8deg) rotateY(0deg)'
                    : 'rotateX(12deg) rotateY(-8deg) scale(0.88)'
                }}
              >

                {/* Real Stacked Gilt Page Edges */}
                <div className="rounded-xl bg-gradient-to-b from-[#FAF5EE] via-[#EFE5D5] to-[#E2D4BF] dark:from-[#212C45] dark:via-[#1B2438] dark:to-[#131A2B] p-[3px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.35),0_5px_15px_rgba(0,0,0,0.2)]">

                  {/* Book Spine Channel & Arch */}
                  <div className="relative grid grid-cols-2 gap-0 bg-[#FCFAF6] dark:bg-[#0F172A] rounded-lg overflow-hidden border border-[#D5CABB] dark:border-[#334155]">

                    {/* Center Spine Crease & Heavy Realistic Shadow */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-black/25 via-black/45 to-black/25 dark:from-black/60 dark:via-black/90 dark:to-black/60 z-20 pointer-events-none shadow-sm"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-amber-900/40 dark:bg-amber-400/40 z-20"></div>

                    {/* Satin Gold Bookmark Ribbon */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-16 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-md z-30 rounded-b-sm">
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#EBF0F7] dark:bg-[#0B0F19] [clip-path:polygon(0_100%,50%_0,100%_100%)]"></div>
                    </div>

                    {/* =========================================================
                        LEFT PAGE: GRAMMAR, SYNTAX & VOCABULARY
                        ========================================================= */}
                    <div
                      className="p-3.5 sm:p-5 relative flex flex-col justify-between border-r border-[#E6DDD0] bg-[#FCFAF6] transition-all duration-700"
                      style={{
                        boxShadow: 'inset -12px 0 20px rgba(0,0,0,0.04)',
                        color: '#000000'
                      }}
                    >
                      {/* Left Page Top Bar */}
                      <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-1" style={{ color: '#000000' }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          Unit I • Grammar & Syntax
                        </span>
                        <span className="text-[9px] font-mono font-bold" style={{ color: '#000000' }}>
                          p. 18
                        </span>
                      </div>

                      {/* Grammar Rule Highlight Box */}
                      <div className="my-1 p-2 rounded-lg bg-white border border-[#DFD7CA] flex flex-col justify-between shadow-xs">
                        <div className="text-[10.5px] font-bold text-amber-900 mb-1 flex items-center gap-1">
                          <Feather size={12} className="text-amber-700" />
                          <span>Direct to Indirect Speech</span>
                        </div>
                        <div className="text-[10px] font-mono space-y-0.5 text-slate-900">
                          <div><strong>Direct:</strong> "I am writing an essay."</div>
                          <div className="text-indigo-900 font-bold"><strong>Indirect:</strong> She said that she was writing an essay.</div>
                        </div>
                      </div>

                      {/* Rules & Vocabulary Terms */}
                      <div className="space-y-1.5 text-[10px] font-mono mt-1" style={{ color: '#000000' }}>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#F1E8DB] px-2 border border-[#E3DBD0]" style={{ color: '#000000' }}>
                          <span className="font-black">Voice:</span>
                          <span className="font-bold">Active: He wrote the book.</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#F1E8DB] px-2 border border-[#E3DBD0]" style={{ color: '#000000' }}>
                          <span className="font-black">Passive:</span>
                          <span className="font-bold">The book was written by him.</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#F1E8DB] px-2 border border-[#E3DBD0]" style={{ color: '#000000' }}>
                          <span className="font-black">Idiom:</span>
                          <span className="font-bold">"Piece of cake" = effortless</span>
                        </div>
                      </div>

                      {/* Left Page Footer */}
                      <div className="pt-2 mt-1 border-t border-[#E8E1D5] flex items-center justify-between text-[9.5px] font-sans" style={{ color: '#000000' }}>
                        <span className="font-semibold" style={{ color: '#000000' }}>Grammar Blueprints</span>
                        <span className="font-black text-emerald-700" style={{ color: '#047857' }}>✓ 100% Accurate</span>
                      </div>
                    </div>

                    {/* =========================================================
                        RIGHT PAGE: POETRY, PROSE & COMPOSITION
                        ========================================================= */}
                    <div
                      className="p-3.5 sm:p-5 relative flex flex-col justify-between bg-[#FCFAF6] transition-all duration-700"
                      style={{
                        boxShadow: 'inset 12px 0 20px rgba(0,0,0,0.04)',
                        color: '#000000'
                      }}
                    >
                      {/* Right Page Top Bar */}
                      <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-1" style={{ color: '#000000' }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                          Unit II • Literature & Prose
                        </span>
                        <span className="text-[9px] font-mono font-bold" style={{ color: '#000000' }}>
                          p. 19
                        </span>
                      </div>

                      {/* Literature & Stanza Diagram */}
                      <div className="my-1 p-2 rounded-lg bg-white border border-[#DFD7CA] shadow-xs">
                        <div className="text-[10px] font-serif italic text-slate-800 leading-snug">
                          "Two roads diverged in a yellow wood,<br />
                          And sorry I could not travel both..."
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-indigo-800 font-bold border-t border-slate-100 pt-1">
                          <span>Rhyme: ABAAB</span>
                          <span>Device: Metaphor</span>
                        </div>
                      </div>

                      {/* Composition & Exam Tips */}
                      <div className="space-y-1.5 text-[10px] font-mono mt-1" style={{ color: '#000000' }}>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#F1E8DB] px-2 border border-[#E3DBD0]" style={{ color: '#000000' }}>
                          <span className="font-black">Letter Writing:</span>
                          <span className="font-bold">Formal / Informal Formats</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#F1E8DB] px-2 border border-[#E3DBD0]" style={{ color: '#000000' }}>
                          <span className="font-black">Comprehension:</span>
                          <span className="font-bold">Skimming & Critical Analysis</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#F1E8DB] px-2 border border-[#E3DBD0]" style={{ color: '#000000' }}>
                          <span className="font-black">Phonetics:</span>
                          <span className="font-bold">Silent letters & Stress mark</span>
                        </div>
                      </div>

                      {/* Right Page Footer */}
                      <div className="pt-2 mt-1 border-t border-[#E8E1D5] flex items-center justify-between text-[9.5px] font-sans" style={{ color: '#000000' }}>
                        <span className="font-semibold" style={{ color: '#000000' }}>Target: 100/100 Board Score</span>
                        <span className="font-black text-indigo-700" style={{ color: '#4338CA' }}>● Mastered</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ===============================================================
                    REALISTIC 3D FLIPPING FRONT COVER (PHYSICAL BOOK COVER)
                    =============================================================== */}
                <div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2D1B12] via-[#3A2218] to-[#18110D] p-6 shadow-2xl border-2 border-amber-500/50 flex flex-col justify-between text-white transition-transform duration-1000 ease-in-out origin-left z-40 backface-hidden"
                  style={{
                    transform: isBookOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                    pointerEvents: isBookOpen ? 'none' : 'auto'
                  }}
                >
                  {/* Spine Ribbed Border on Left Edge */}
                  <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/60 via-black/25 to-transparent rounded-l-2xl border-r border-amber-500/40"></div>

                  {/* Gold Embossed Corner Ornaments */}
                  <div className="absolute top-3 left-10 w-6 h-6 border-t-2 border-l-2 border-amber-400/80"></div>
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/80"></div>
                  <div className="absolute bottom-3 left-10 w-6 h-6 border-b-2 border-l-2 border-amber-400/80"></div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/80"></div>

                  {/* Top Cover Text */}
                  <div className="pl-6 text-center">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-amber-300 font-bold font-mono">
                      State Board & Literature
                    </span>
                  </div>

                  {/* Center Emblem & Gold Foil Typography */}
                  <div className="pl-6 text-center my-auto">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500/25 via-amber-400/35 to-amber-500/10 border border-amber-400/70 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
                      <span className="text-3xl font-bold font-serif text-amber-300">Aa</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif uppercase leading-tight drop-shadow-md">
                      ENGLISH
                    </h2>
                    <p className="text-xs text-amber-200/90 font-medium mt-1">
                      Complete Prose, Poetry, Grammar & Blueprints
                    </p>
                  </div>

                  {/* Bottom Cover Edition */}
                  <div className="pl-6 text-center pt-3 border-t border-amber-500/30 text-[11px] text-amber-200">
                    <span>Maths & English Learning Academy</span>
                  </div>
                </div>

              </div>

              {/* SMOOTH INTERACTIVE TOGGLE BUTTON */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors">
                <RotateCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                <span>{isBookOpen ? 'Click Book to Close 📖' : 'Click Book to Open 📖'}</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
