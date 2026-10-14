import React from 'react';
import {
  ArrowRight,
  Landmark,
  Scroll,
  Hourglass,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function HistoryHero({ onOpenBooking, onOpenVideoDemo }) {
  const handleStartLearning = () => {
    if (onOpenBooking) {
      onOpenBooking('History & Heritage Program (HEC)');
    }
  };

  const handleExplorePractice = () => {
    const practiceSection = document.getElementById('history-curriculum') || document.getElementById('roadmaps') || document.getElementById('courses');
    if (practiceSection) {
      practiceSection.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenVideoDemo) {
      onOpenVideoDemo();
    }
  };

  return (
    <section className="relative pt-8 pb-14 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-16 overflow-hidden bg-[#EBF0F7] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-math-grid opacity-70 dark:opacity-40 pointer-events-none -z-10"></div>

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-400/25 dark:bg-rose-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-amber-400/25 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-red-400/20 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">
            {/* Stream Badges */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold mb-4 w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>HEC Core Subject • Ancient, Medieval & Modern Heritage</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-3">
              Master History.{' '}
              <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-orange-600 dark:from-rose-400 dark:via-amber-400 dark:to-orange-300 bg-clip-text text-transparent">
                Trace Civilizations & Score 100/100.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
              Journey through the Indus Valley Civilization, Vedic period, Mauryas, Guptas, Delhi Sultanate, Vijayanagara Empire, Mughals, Indian National Movement, and regional history of Andhra Pradesh & Telangana.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-7 w-full sm:w-auto">
              <button
                onClick={handleStartLearning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-rose-500/50"
              >
                <span>Start Learning History</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleExplorePractice}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#DFE7F2] dark:bg-[#131927] hover:bg-[#D4E0ED] dark:hover:bg-[#1A2338] text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base border border-[#BAC9DC] dark:border-[#243048] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-rose-400 dark:hover:border-rose-500"
              >
                <span>Explore Timeline & Maps</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-rose-500" /> Historical Timelines & Map Pointing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-rose-500" /> 10-Mark Chronology Templates
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-rose-500" /> UPSC & Civil Services Alignment
              </span>
            </div>
          </div>

          {/* Right Column: Visual Highlights */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Scroll size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">History & Heritage Archive</h3>
                    <p className="text-xs text-slate-500">AP BIEAP & TS TSBIE Stream</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold text-[11px]">
                  HEC Group
                </span>
              </div>

              {/* Card Body Highlights */}
              <div className="mt-5 space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hourglass size={18} className="text-rose-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indus Valley & Vedic Civilization</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">Ancient</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Landmark size={18} className="text-amber-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Vijayanagara & Kakatiya Dynasties</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">Medieval</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Compass size={18} className="text-orange-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Freedom Movement & Gandhian Era</span>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">10 Marks</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-500/20 text-center">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Chronological cause-effect blueprints guarantee top scoring answers with accurate historical dates.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
