import React, { useState } from 'react';
import { BookOpen, ArrowRight, Info, ChevronLeft, Briefcase, Calculator, CheckCircle2 } from 'lucide-react';

export default function CommerceCurriculum({ onEnroll }) {
  const [activeEnroll, setActiveEnroll] = useState(null);
  const [activeExplore, setActiveExplore] = useState(null);

  const modules = [
    {
      id: 'com-1st-year',
      name: '1st Year Junior Commerce',
      category: 'AP / TS Intermediate',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      desc: 'Introduction to Business, Human Activities, Sole Proprietorship, Joint Hindu Family, Partnership Deed, Joint Stock Company, and sources of business finance.',
      topics: ['Nature & Scope of Business', 'Forms of Business Organizations', 'Joint Stock Company Promotion', 'Micro, Small & Medium Enterprises (MSMEs)']
    },
    {
      id: 'acc-1st-year',
      name: '1st Year Junior Accountancy',
      category: 'Core Accounting',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
      color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
      desc: 'GAAP principles, Double-entry system, Journalizing, Ledger posting, Three-column Cash Book, Bank Reconciliation Statement (BRS), Trial Balance, and Final Accounts with Adjustments.',
      topics: ['Golden Rules of Accounting', 'Journal & Ledger Balancing', 'Bank Reconciliation Statement (BRS)', 'Final Accounts with Adjustments (20 Marks)']
    },
    {
      id: 'com-2nd-year',
      name: '2nd Year Senior Commerce',
      category: 'AP / TS Intermediate',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
      color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
      desc: 'Financial markets, Money market vs Capital market, Stock Exchange (SEBI), Principles of Management (Fayol & Taylor), Banking services, and Entrepreneurship development.',
      topics: ['Financial Markets & Instruments', 'Stock Exchange & SEBI Functions', 'Principles & Functions of Management', 'Banking, Insurance & Warehousing']
    },
    {
      id: 'acc-2nd-year',
      name: '2nd Year Senior Accountancy',
      category: 'Advanced Accounting',
      image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=600&auto=format&fit=crop',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      desc: 'Depreciation methods (Straight Line & Diminishing Balance), Bills of Exchange, Consignment Accounts, Accounts of Non-Trading Concerns, and Partnership Accounts.',
      topics: ['Depreciation Accounting', 'Consignment & Bills of Exchange', 'Non-Profit Organizations (Receipts & Payments)', 'Partnership Accounts & Goodwill Valuation']
    },
    {
      id: 'ca-foundation-track',
      name: 'CA Foundation & CMA Fast Track',
      category: 'Professional Entrance',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      desc: 'High-yield conceptual alignment bridging intermediate commerce with ICAI CA Foundation Paper 1 (Accounting) and Paper 2 (Business Laws).',
      topics: ['ICAI Concept Blueprints', 'Company Shares & Debentures', 'Contract Act Fundamentals', 'Speed Numerical Drills']
    },
    {
      id: 'board-answer-blueprint',
      name: '100/100 Board Answer Blueprints',
      category: 'Exam Strategy',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      desc: 'Top-scorer presentation layouts, ledger ruling guidelines, step marking secrets, and 10+ years solved previous board papers for Section-A and Section-B.',
      topics: ['Final Accounts 20-Mark Master Checklist', '5-Mark Short Question Formats', '2-Mark Definition Bank', 'Time Allocation Strategy']
    }
  ];

  const renderModuleCard = (mod) => {
    const isEnrolling = activeEnroll === mod.id;
    const isExploring = activeExplore === mod.id;

    return (
      <div 
        key={mod.id} 
        className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800 h-[400px] group hover:-translate-y-1 relative"
      >
        <div 
          className="h-44 w-full overflow-hidden relative shrink-0 cursor-pointer"
          onClick={() => setActiveExplore(mod.id)}
        >
          <img 
            src={mod.image} 
            alt={mod.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/20 text-white border border-white/20">
            <Briefcase size={20} />
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
            CEC • MEC
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
          <div className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">
            {mod.category}
          </div>
          <h4 
            className="text-lg font-bold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            onClick={() => setActiveExplore(mod.id)}
          >
            {mod.name}
          </h4>

          {/* Default View */}
          <div className={`flex flex-col mt-auto transition-opacity duration-300 ${isExploring || isEnrolling ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {mod.desc}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveExplore(mod.id)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Info size={14} /> Explore
              </button>
              <button 
                onClick={() => setActiveEnroll(mod.id)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                Enroll <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Explore View */}
          <div className={`absolute inset-0 bg-white dark:bg-slate-900 p-5 flex flex-col z-10 transition-transform duration-300 ${isExploring ? 'translate-y-0' : 'translate-y-full'}`}>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{mod.name} Syllabus</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {mod.desc}
            </p>
            <div className="space-y-1.5 mb-4 flex-1 overflow-y-auto">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Core Topics:</span>
              {mod.topics.map((t, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{t}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveExplore(null)}
              className="w-full mt-auto py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} /> Back
            </button>
          </div>

          {/* Enroll View */}
          <div className={`absolute inset-0 bg-white dark:bg-slate-900 p-5 flex flex-col z-10 transition-transform duration-300 ${isEnrolling ? 'translate-y-0' : 'translate-y-full'}`}>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 text-center">Enroll in {mod.name}</h4>
            <div className="flex flex-col gap-2 flex-1 justify-center">
              <button 
                onClick={() => {
                  setActiveEnroll(null);
                  onEnroll && onEnroll(`${mod.name} - Regular Board Batch`);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-emerald-500/20"
              >
                Regular Board Batch
              </button>
              <button 
                onClick={() => {
                  setActiveEnroll(null);
                  onEnroll && onEnroll(`${mod.name} - 100/100 Score Booster`);
                }}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-teal-500/20"
              >
                100/100 Score Booster
              </button>
            </div>
            <button 
              onClick={() => setActiveEnroll(null)}
              className="w-full mt-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800" id="commerce-curriculum">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Complete Commerce & Accountancy Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Commerce Curriculum & Modules
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-xl font-medium">
            Complete subject-wise mastery for Junior & Senior Intermediate Commerce & Accountancy. Explore our structured modules and enroll to master ledgers, BRS, and final accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map(renderModuleCard)}
        </div>
      </div>
    </section>
  );
}
