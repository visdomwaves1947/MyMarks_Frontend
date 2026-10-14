import React from 'react';
import { ArrowRight, Award, Clock } from 'lucide-react';

export default function EconomicsRoadmapsGrid({ onSelectPlan }) {
  const plans = [
    {
      id: '1-day',
      level: 'CRASH REVIEW',
      levelColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      expectedScore: '75-80 Marks',
      title: '1 Day Essay & Curve Sprint',
      desc: 'Master the 5 guaranteed 10-mark questions: Law of DMU, Law of Variable Proportions, and Perfect Competition.',
      stats: { modules: 6, tests: 4, pdfs: 8, videos: 6 },
      duration: 1
    },
    {
      id: '3-days',
      level: 'FOUNDATION',
      levelColor: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40',
      expectedScore: '80-88 Marks',
      title: '3 Days Microeconomics Intensive',
      desc: 'Demand elasticity formulas, consumer surplus, cost-revenue curves, and indifference curve properties.',
      stats: { modules: 10, tests: 8, pdfs: 14, videos: 10 },
      duration: 3
    },
    {
      id: '7-days',
      level: 'DISTINCTION',
      levelColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      expectedScore: '90-95 Marks',
      title: '7 Days Complete Syllabus',
      desc: 'Full coverage of Section-A essays, Section-B short questions, and Section-C 2-mark definitions with zero flaws.',
      stats: { modules: 18, tests: 15, pdfs: 22, videos: 18 },
      duration: 7
    },
    {
      id: 'full',
      level: 'TOPPER 100/100',
      levelColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
      expectedScore: '99-100 Marks',
      title: 'Full Term UPSC & Board Track',
      desc: 'In-depth conceptual mastery, state economic survey correlation, and high-order analytical reasoning.',
      stats: { modules: 28, tests: 24, pdfs: 35, videos: 30 },
      duration: 30
    }
  ];

  return (
    <section id="roadmaps" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} /> Structured Prep Plans
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Targeted Economics Study Roadmaps
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Structured study schedules tailored for CEC, MEC, and HEC intermediate board students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${plan.levelColor}`}>
                    {plan.level}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> {plan.duration} {plan.duration === 1 ? 'Day' : 'Days'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {plan.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {plan.desc}
                </p>

                <div className="py-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold mb-4 flex items-center justify-between">
                  <span>Target Score:</span>
                  <span className="text-sm font-black">{plan.expectedScore}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectPlan && onSelectPlan(plan)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white dark:bg-slate-800 dark:hover:bg-amber-500 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Roadmap</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
