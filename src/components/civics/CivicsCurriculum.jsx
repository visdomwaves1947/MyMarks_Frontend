import React, { useState } from 'react';
import { BookOpen, ArrowRight, Info, ChevronLeft, Landmark, Scale, CheckCircle2 } from 'lucide-react';

export default function CivicsCurriculum({ onEnroll }) {
  const [activeEnroll, setActiveEnroll] = useState(null);
  const [activeExplore, setActiveExplore] = useState(null);

  const modules = [
    {
      id: 'civ-1st-year',
      name: '1st Year Political Theory',
      category: 'AP / TS Intermediate',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop',
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      desc: 'Scope and importance of Political Science, State elements, Nation and Nationality, Sovereignty (Austin & Pluralistic theories), Law, Liberty, Equality, and Rights & Duties.',
      topics: ['Nature & Scope of Political Science', 'Elements of State & Sovereignty', 'Safeguards of Liberty & Rule of Law', 'Classification of Rights & Civic Duties']
    },
    {
      id: 'civ-democracy-constitution',
      name: 'Democracy & Constitutional Framework',
      category: 'Constitutional Theory',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      desc: 'Direct & Indirect Democracy, Devices of direct democracy (Referendum, Initiative, Recall), Classification of Constitutions (Written/Unwritten, Rigid/Flexible), and Separation of Powers.',
      topics: ['Direct Democracy Mechanisms', 'Features of a Good Constitution', 'Separation of Powers & Checks and Balances', 'Organs of Government (Legislature, Executive, Judiciary)']
    },
    {
      id: 'civ-2nd-year',
      name: '2nd Year Indian Constitution & Polity',
      category: 'AP / TS Intermediate',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      desc: 'Salient features of Indian Constitution, Preamble, Fundamental Rights (Articles 12-35), Directive Principles of State Policy, and Fundamental Duties (Article 51A).',
      topics: ['Preamble Philosophy & Core Values', '6 Fundamental Rights & Constitutional Writs', 'Directive Principles vs Fundamental Rights', 'Basic Structure Doctrine']
    },
    {
      id: 'civ-governance-judiciary',
      name: 'Union Executive, Parliament & Judiciary',
      category: 'Indian Governance',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop',
      color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
      desc: 'President of India powers, Prime Minister & Council of Ministers, Lok Sabha & Rajya Sabha legislative procedure, and Supreme Court of India original and appellate jurisdictions.',
      topics: ['President Election & Emergency Powers', 'Prime Minister Leadership & Cabinet', 'Lok Sabha vs Rajya Sabha Powers', 'Supreme Court & Judicial Review']
    },
    {
      id: 'civ-local-governance',
      name: 'State Government & Panchayati Raj',
      category: 'Grassroots Democracy',
      image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=600&auto=format&fit=crop',
      color: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
      desc: 'Governor, Chief Minister, State Legislative Assembly, High Court, and 73rd & 74th Constitutional Amendments (Gram Panchayat, Mandal Parishad, Zilla Parishad, Municipalities).',
      topics: ['Governor Constitutional Role & Discretion', 'Chief Minister & State Executive', '73rd Amendment & Three-Tier Panchayati Raj', '74th Amendment & Urban Local Bodies']
    },
    {
      id: 'civ-clat-upsc',
      name: 'CLAT & Civil Services Polity Track',
      category: 'Legal & UPSC Foundations',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      desc: 'Foundational training for Law entrance exams (CLAT Legal Reasoning) and UPSC / State PSC Civil Services GS Paper 2 (Indian Polity & Constitution).',
      topics: ['Constitutional Amendments & Landmark Cases', 'Election Commission & Electoral Reforms', 'Center-State Relations (Federalism)', 'Public Interest Litigation (PIL)']
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
            <Landmark size={20} />
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
            CEC • HEC
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
          <div className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1.5">
            {mod.category}
          </div>
          <h4 
            className="text-lg font-bold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
                  <CheckCircle2 size={13} className="text-indigo-500 shrink-0" />
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
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-indigo-500/20"
              >
                Regular Board Batch
              </button>
              <button 
                onClick={() => {
                  setActiveEnroll(null);
                  onEnroll && onEnroll(`${mod.name} - 100/100 Score Booster`);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
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
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800" id="civics-curriculum">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs sm:text-sm font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Complete Civics & Political Science Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Civics Curriculum & Modules
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-xl font-medium">
            Complete subject-wise mastery for Junior & Senior Intermediate Civics. Explore our structured modules and enroll to master political theory, Fundamental Rights, and Indian governance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map(renderModuleCard)}
        </div>
      </div>
    </section>
  );
}
