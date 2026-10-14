import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function HistoryFaqSection({ onOpenBooking }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Which group includes History in Intermediate?",
      a: "History is the primary anchor subject of the HEC (History, Economics, Civics) Humanities group in both Andhra Pradesh and Telangana boards."
    },
    {
      q: "How can I remember all the historical dates and dynasties for exams?",
      a: "We teach through chronological timelines, mnemonic associations, and theme-based maps. Rather than memorizing isolated numbers, you learn cause-and-effect sequences (e.g. causes leading to the 1857 Revolt or the downfall of the Delhi Sultanate)."
    },
    {
      q: "Is Map Pointing compulsory in the Intermediate History examination?",
      a: "Yes! The board question paper includes a mandatory 5-mark map pointing section where students locate major historical sites such as Harappa, Pataliputra, Hampi, Tanjore, or Dandi."
    },
    {
      q: "Why is HEC considered the premier track for Civil Services (IAS/IPS)?",
      a: "HEC aligns directly with the core subjects of General Studies: History (ancient, medieval, modern), Indian Economy, and Indian Polity/Constitution (Civics). Preparing these during Intermediate provides an unbeatable 2-year early advantage."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} /> Got Questions?
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions about History
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
                <ChevronDown size={18} className={`transition-transform duration-200 text-slate-400 ${openIndex === idx ? 'rotate-180 text-rose-500' : ''}`} />
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
