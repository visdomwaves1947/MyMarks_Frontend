import React, { useState } from 'react';
import { Check } from 'lucide-react';

export default function EconomicsPricingSection({ onOpenBooking }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Economics Curve Explorer',
      description: 'Self-paced access to all Micro & Macro concept lectures, curve animations, and question banks.',
      monthlyPrice: 59,
      annualPrice: 39,
      popular: false,
      tag: 'Self-Paced',
      features: [
        'Complete AP & TS 1st/2nd Year Economics interactive modules',
        'Downloadable curve diagram templates & schedules',
        'Section-A 10-mark essay model answer sheets',
        'Chapter-wise quizzes with instant scoring',
        'Previous 10 years solved board question papers'
      ],
      ctaText: 'Start Explorer Plan',
      buttonStyle: 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white'
    },
    {
      name: 'Economics & Policy Masterclass',
      description: 'Live interactive classes with master lecturers focusing on 100/100 diagram precision and state blueprints.',
      monthlyPrice: 149,
      annualPrice: 119,
      popular: true,
      tag: 'Most Popular',
      features: [
        'Everything in Economics Curve Explorer',
        '2 Weekly live interactive classes with essay writing drills',
        'Personal evaluation of your hand-drawn curves & schedules',
        'Doubt clearing support within 15 minutes',
        'State economic survey & current budget insights',
        'Board guarantee: 95+ marks or letter grade jump'
      ],
      ctaText: 'Enroll in Masterclass',
      buttonStyle: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-600/30 font-bold'
    },
    {
      name: 'Civil Services & CA Foundation Track',
      description: 'High-level training covering intermediate syllabus alongside UPSC / CUET / CA Foundation economics.',
      monthlyPrice: 289,
      annualPrice: 229,
      popular: false,
      tag: 'Elite Track',
      features: [
        'Everything in Economics Masterclass',
        '1-on-1 private mentoring with senior faculty',
        'CUET & CA Foundation Business Economics modules',
        'Weekly essay writing feedback tailored for competitive exams',
        'Personal WhatsApp access to Economics mentor',
        'Career mentorship for economics, finance & civil services'
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
            Tuition Plans for Intermediate Economics
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Engineered for CEC, MEC, and HEC students aiming for 95+ marks in board exams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`rounded-3xl p-7 bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between ${
                plan.popular 
                  ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20' 
                  : 'border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
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
                      <Check size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenBooking && onOpenBooking(`Economics Plan: ${plan.name}`)}
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
