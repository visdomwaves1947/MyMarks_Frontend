import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function EconomicsFaqSection({ onOpenBooking }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Which intermediate groups study Economics?",
      a: "Economics is an essential core subject for three major groups: CEC (Commerce, Economics, Civics), MEC (Mathematics, Economics, Commerce), and HEC (History, Economics, Civics)."
    },
    {
      q: "How important are schedules and diagrams in the Economics board paper?",
      a: "Crucial! In 10-mark questions like Law of Diminishing Marginal Utility or Law of Variable Proportions, up to 4 marks are allotted specifically for neat tabular schedules and correctly labeled geometric curves."
    },
    {
      q: "Does MyMarks cover both Microeconomics and Macroeconomics?",
      a: "Yes. Junior Intermediate covers Microeconomic theory (consumer behavior, demand, production, costs, markets), while Senior Intermediate covers Macroeconomics and the Indian & State Economy (National income, banking, inflation, planning, and AP/TS economic surveys)."
    },
    {
      q: "Can I prepare for competitive exams like CUET, CA Foundation, or UPSC with this syllabus?",
      a: "Yes! Intermediate Economics forms the bedrock for CUET Economics domain, CA Foundation Business Economics, and foundational General Studies (GS) Paper 3 in UPSC Civil Services."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} /> Got Questions?
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions about Economics
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-900/40"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full p-5 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between text-sm sm:text-base cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`transition-transform duration-200 text-slate-400 ${openIndex === idx ? 'rotate-180 text-amber-500' : ''}`} />
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
