import React from 'react';
import {
  ArrowRight,
  Landmark,
  Scale,
  ShieldAlert,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function CivicsHero({ onOpenBooking, onOpenVideoDemo }) {
  const handleStartLearning = () => {
    if (onOpenBooking) {
      onOpenBooking('Civics & Political Science Program (CEC/HEC)');
    }
  };

  const handleExplorePractice = () => {
    const practiceSection = document.getElementById('civics-curriculum') || document.getElementById('roadmaps') || document.getElementById('courses');
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/25 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-blue-400/25 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">
            {/* Stream Badges */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-4 w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>CEC & HEC Core Subject • Indian Constitution & Governance</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-3">
              Master Civics.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 dark:from-indigo-400 dark:via-blue-400 dark:to-purple-300 bg-clip-text text-transparent">
                Understand the Constitution & Statecraft.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
              Explore State Sovereignty, Fundamental Rights, Directive Principles, Parliamentary democracy, Supreme Court jurisdictions, and Local Governance. Perfect for board examination distinction and CLAT / UPSC foundational preparation.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-7 w-full sm:w-auto">
              <button
                onClick={handleStartLearning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-indigo-500/50"
              >
                <span>Start Learning Civics</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleExplorePractice}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#DFE7F2] dark:bg-[#131927] hover:bg-[#D4E0ED] dark:hover:bg-[#1A2338] text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base border border-[#BAC9DC] dark:border-[#243048] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500"
              >
                <span>Explore Constitution & Articles</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-indigo-500" /> Articles & Preamble Mind Maps
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-indigo-500" /> 10-Mark State & Governance Blueprints
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-indigo-500" /> CLAT & Civil Services Readiness
              </span>
            </div>
          </div>

          {/* Right Column: Visual Highlights */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Civics & Polity Hub</h3>
                    <p className="text-xs text-slate-500">AP BIEAP & TS TSBIE Stream</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-[11px]">
                  CEC • HEC
                </span>
              </div>

              {/* Card Body Highlights */}
              <div className="mt-5 space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Scale size={18} className="text-indigo-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Preamble & Fundamental Rights</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">Articles 12-35</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Landmark size={18} className="text-blue-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Union Executive & Parliament</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">10 Marks</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={18} className="text-purple-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Supreme Court & Judicial Review</span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">Essential</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 text-center">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Step-by-step point-wise answer writing templates ensure top board marks.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
