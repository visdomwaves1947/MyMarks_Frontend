import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function CivicsFaqSection({ onOpenBooking }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Which groups have Civics as a core subject?",
      a: "Civics (Political Science) is a core subject in two intermediate groups: CEC (Commerce, Economics, Civics) and HEC (History, Economics, Civics)."
    },
    {
      q: "How can I score full marks in Section-A 10-mark essays?",
      a: "Follow the 5-point blueprint: (1) Introduction & Origin of term, (2) Standard Definition by scholars like Aristotle, Garner, or Austin, (3) Numbered core characteristics with clear subheadings, (4) Critical evaluation/merits & demerits, and (5) Conclusion."
    },
    {
      q: "What is the difference between 1st Year and 2nd Year Civics?",
      a: "1st Year Civics focuses on Political Theory (State, Sovereignty, Law, Liberty, Rights, Forms of Government). 2nd Year Civics is dedicated to Indian Constitution, Central & State Government institutions, Judiciary, and Local Governance (Panchayati Raj)."
    },
    {
      q: "Is Civics helpful for future legal studies or civil services?",
      a: "Immense value! It covers the entire foundational syllabus of Indian Polity (GS-2) for UPSC, APPSC, and TSPSC, as well as Constitutional Law topics asked in CLAT and law entrance exams."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} /> Got Questions?
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions about Civics
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
                <ChevronDown size={18} className={`transition-transform duration-200 text-slate-400 ${openIndex === idx ? 'rotate-180 text-indigo-500' : ''}`} />
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
