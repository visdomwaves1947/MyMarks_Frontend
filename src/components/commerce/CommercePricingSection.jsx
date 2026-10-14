import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function CommercePricingSection({ onOpenBooking }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Self-Paced Commerce Explorer',
      description: 'Ideal for independent learners wanting full syllabus videos, ledger worksheets & BRS calculators.',
      monthlyPrice: 59,
      annualPrice: 39,
      popular: false,
      tag: 'Self-Paced',
      features: [
        'Complete AP & TS 1st/2nd Year Commerce interactive modules',
        'Step-by-step Final Accounts adjustment blueprints',
        'Downloadable ledger, trial balance & journal cheat sheets',
        'Chapter-wise quizzes & instant scoring feedback',
        'Previous 10 years solved board examination papers'
      ],
      ctaText: 'Start Explorer Plan',
      buttonStyle: 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white'
    },
    {
      name: 'Commerce & Accounts Masterclass',
      description: 'Live interactive classes with senior board evaluators and Chartered Accountants.',
      monthlyPrice: 149,
      annualPrice: 119,
      popular: true,
      tag: 'Most Popular',
      features: [
        'Everything in Self-Paced Explorer',
        '2 Weekly live interactive problem-solving batches',
        'Live grading of your 20-mark final account problems',
        'Doubt clearing support within 15 minutes',
        'Timed board exam simulators with time management tips',
        'Board guarantee: 95+ marks or letter grade jump'
      ],
      ctaText: 'Enroll in Masterclass',
      buttonStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/30 font-bold'
    },
    {
      name: 'CA Foundation & MEC Elite Track',
      description: 'Comprehensive coaching for high board ranks alongside CA Foundation / CMA entrance prep.',
      monthlyPrice: 289,
      annualPrice: 229,
      popular: false,
      tag: 'Elite Track',
      features: [
        'Everything in Commerce Masterclass',
        'Dedicated CA Foundation paper 1 & 2 preparation',
        '1-on-1 private doubt resolution sessions',
        'Customized weekly study calendar and mentor monitoring',
        'Direct WhatsApp contact with Senior CA faculty',
        'Interview and career guidance for corporate finance'
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
            Transparent Tuition Plans for Commerce
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Affordable, high-impact learning for CEC & MEC Intermediate students across AP & Telangana.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`rounded-3xl p-7 bg-white dark:bg-slate-900 border transition-all duration-300 flex flex-col justify-between ${
                plan.popular 
                  ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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
                      <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenBooking && onOpenBooking(`Commerce Plan: ${plan.name}`)}
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
