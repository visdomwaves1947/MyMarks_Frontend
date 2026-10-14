import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  ReceiptText,
  BarChart3,
  Briefcase,
  CheckCircle2
} from 'lucide-react';

export default function CommerceHero({ onOpenBooking, onOpenVideoDemo }) {
  const handleStartLearning = () => {
    if (onOpenBooking) {
      onOpenBooking('Commerce & Accountancy Program (CEC/MEC)');
    }
  };

  const handleExplorePractice = () => {
    const practiceSection = document.getElementById('commerce-curriculum') || document.getElementById('roadmaps') || document.getElementById('courses');
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/25 dark:bg-emerald-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-teal-400/25 dark:bg-teal-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">
            {/* Stream Badges */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-4 w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>CEC & MEC Core Subject • BIEAP & TSBIE Syllabus</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-3">
              Master Commerce & Accountancy.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-300 bg-clip-text text-transparent">
                Score 100/100 in Board Exams.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
              Comprehensive double-entry bookkeeping, journal entries, ledger balancing, BRS, trial balances, and corporate business concepts. Built for Intermediate 1st & 2nd Year board success and CA Foundation readiness.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-7 w-full sm:w-auto">
              <button
                onClick={handleStartLearning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/50"
              >
                <span>Start Learning Commerce</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleExplorePractice}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#DFE7F2] dark:bg-[#131927] hover:bg-[#D4E0ED] dark:hover:bg-[#1A2338] text-slate-800 dark:text-slate-200 font-semibold text-sm sm:text-base border border-[#BAC9DC] dark:border-[#243048] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500"
              >
                <span>Explore Curriculum & Modules</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" /> Double Entry & BRS Blueprints
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" /> CA Foundation Foundations
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" /> 10+ Years Solved Model Papers
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Card / Visual */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Commerce & Accounts Hub</h3>
                    <p className="text-xs text-slate-500">AP BIEAP & TS TSBIE Stream</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px]">
                  CEC • MEC
                </span>
              </div>

              {/* Card Body Highlights */}
              <div className="mt-5 space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ReceiptText size={18} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Journal & Ledger Postings</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">20 Marks</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 size={18} className="text-teal-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Final Accounts with Adjustments</span>
                  </div>
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">20 Marks</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={18} className="text-cyan-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Business Org & Joint Stock Co.</span>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">50 Marks</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Target Score Blueprint: <strong className="text-emerald-600 dark:text-emerald-400">100/100 Marks</strong> guaranteed with zero debit-credit errors.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
