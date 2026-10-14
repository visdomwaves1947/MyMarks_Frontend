import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function CommerceFaqSection({ onOpenBooking }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Is the syllabus aligned with both BIEAP (Andhra Pradesh) and TSBIE (Telangana)?",
      a: "Yes! Our Commerce & Accountancy courses cover 100% of the syllabus for both Andhra Pradesh and Telangana Intermediate Boards, including state-specific blueprints and question formats."
    },
    {
      q: "Can I prepare for CA Foundation alongside Intermediate Commerce?",
      a: "Absolutely. Our MEC and CEC tracks are designed to reinforce fundamental accounting principles, partnership accounts, and business laws so you hit the ground running with CA Foundation."
    },
    {
      q: "How does MyMarks help with the 20-mark Final Accounts problem?",
      a: "We provide step-by-step interactive ledgers, adjustment checklists, and timed simulators that teach you how to systematically post adjustments (closing stock, depreciation, bad debts, outstanding expenses) to guarantee your balance sheet tallies on the first try."
    },
    {
      q: "What is the difference between CEC and MEC?",
      a: "CEC combines Commerce, Economics, and Civics (ideal for CA, Law, Banking, and Business). MEC combines Mathematics, Economics, and Commerce (ideal for Actuarial Science, Data Economics, CA, and Quantitative Finance)."
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} /> Got Questions?
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions about Commerce
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
                <ChevronDown size={18} className={`transition-transform duration-200 text-slate-400 ${openIndex === idx ? 'rotate-180 text-emerald-500' : ''}`} />
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
