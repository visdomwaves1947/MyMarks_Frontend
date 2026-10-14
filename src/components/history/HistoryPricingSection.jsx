import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function HistoryPricingSection({ onOpenBooking }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'History Timeline Explorer',
      description: 'Self-paced access to world and Indian history video lessons, chronology maps, and essay banks.',
      monthlyPrice: 59,
      annualPrice: 39,
      popular: false,
      tag: 'Self-Paced',
      features: [
        'Complete AP & TS 1st/2nd Year History interactive modules',
        'Downloadable chronology charts & map pointing templates',
        'Section-A 10-mark essay model answer sheets',
        'Chapter-wise quizzes with immediate review',
        'Previous 10 years solved board question papers'
      ],
      ctaText: 'Start Explorer Plan',
      buttonStyle: 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white'
    },
    {
      name: 'Humanities & Heritage Masterclass',
      description: 'Live interactive classes with senior history faculty focusing on essay quality, historiography, and maps.',
      monthlyPrice: 149,
      annualPrice: 119,
      popular: true,
      tag: 'Most Popular',
      features: [
        'Everything in History Timeline Explorer',
        '2 Weekly live interactive classes with essay writing drills',
        'Personal evaluation of your 10-mark essays and map entries',
        'Doubt clearing support within 15 minutes',
        'Regional AP & Telangana history special sessions',
        'Board guarantee: 95+ marks or letter grade jump'
      ],
      ctaText: 'Enroll in Masterclass',
      buttonStyle: 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-lg shadow-rose-600/30 font-bold'
    },
    {
      name: 'Civil Services Foundation Track',
      description: 'Rigorous preparation combining board syllabus with UPSC GS-1 History and State PSC foundations.',
      monthlyPrice: 289,
      annualPrice: 229,
      popular: false,
      tag: 'Elite Track',
      features: [
        'Everything in History Masterclass',
        '1-on-1 private mentoring with senior historians',
        'NCERT deep-dive & primary historical source criticism',
        'Weekly analytical writing feedback tailored for civil services',
        'Personal WhatsApp access to History mentor',
        'Career mentorship for civil services, archaeology & research'
      ],
      ctaText: 'Join Elite Track',
      buttonStyle: 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white'
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50 dark:bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tuition Plans for Intermediate History
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Structured for HEC Intermediate students aiming for 95+ marks and civil services grounding.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`rounded-3xl p-7 bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between ${
                plan.popular 
                  ? 'border-rose-500 shadow-xl shadow-rose-500/10 ring-2 ring-rose-500/20' 
                  : 'border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    {plan.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">₹{isAnnual ? plan.annualPrice * 10 : plan.monthlyPrice * 12}</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Check size={16} className="text-rose-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenBooking && onOpenBooking(`History Plan: ${plan.name}`)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${plan.buttonStyle}`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
