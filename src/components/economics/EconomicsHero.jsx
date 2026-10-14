import React from 'react';
import {
  ArrowRight,
  TrendingUp,
  LineChart,
  PieChart,
  Coins,
  CheckCircle2
} from 'lucide-react';

export default function EconomicsHero({ onOpenBooking, onOpenVideoDemo }) {
  const handleStartLearning = () => {
    if (onOpenBooking) {
      onOpenBooking('Economics Program (CEC/MEC/HEC)');
    }
  };

  const handleExplorePractice = () => {
    const practiceSection = document.getElementById('economics-curriculum') || document.getElementById('roadmaps') || document.getElementById('courses');
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/25 dark:bg-amber-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-orange-400/25 dark:bg-orange-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-yellow-400/20 dark:bg-yellow-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">
            {/* Stream Badges */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold mb-4 w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>CEC, MEC & HEC Common Pillar • Micro & Macroeconomics</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-3">
              Master Economics.{' '}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-300 bg-clip-text text-transparent">
                Graph Every Curve with Clarity.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
              Demystify Diminishing Marginal Utility, Indifference Curves, Law of Demand, Market Price Determination, National Income, and Indian & State Economic policies for maximum board exam scores.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-7 w-full sm:w-auto">
              <button
                onClick={handleStartLearning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-amber-500/50"
              >
                <span>Start Learning Economics</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleExplorePractice}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#DFE7F2] dark:bg-[#131927] hover:bg-[#D4E0ED] dark:hover:bg-[#1A2338] text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base border border-[#BAC9DC] dark:border-[#243048] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-amber-400 dark:hover:border-amber-500"
              >
                <span>Explore Curves & Curriculum</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-amber-500" /> Interactive Utility & Demand Curves
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-amber-500" /> 10-Mark Essay Answer Templates
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-amber-500" /> AP & TS Economy Blueprints
              </span>
            </div>
          </div>

          {/* Right Column: Visual Highlights */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Coins size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Economics Intelligence</h3>
                    <p className="text-xs text-slate-500">AP BIEAP & TS TSBIE Stream</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-extrabold text-[11px]">
                  CEC • MEC • HEC
                </span>
              </div>

              {/* Card Body Highlights */}
              <div className="mt-5 space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LineChart size={18} className="text-amber-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Law of Diminishing Marginal Utility</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">10 Marks</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={18} className="text-orange-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Perfect Competition Price Determination</span>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">10 Marks</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PieChart size={18} className="text-rose-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">National Income & Economic Growth</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">2nd Year</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Visual diagram blueprints guarantee full marks on 10-mark essay and 5-mark short answers.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
