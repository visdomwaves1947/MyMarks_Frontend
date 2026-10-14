import React, { useState } from 'react';
import { BookOpen, ArrowRight, Info, ChevronLeft, TrendingUp, LineChart, CheckCircle2 } from 'lucide-react';

export default function EconomicsCurriculum({ onEnroll }) {
  const [activeEnroll, setActiveEnroll] = useState(null);
  const [activeExplore, setActiveExplore] = useState(null);

  const modules = [
    {
      id: 'eco-1st-year',
      name: '1st Year Microeconomics',
      category: 'AP / TS Intermediate',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      desc: 'Nature and scope of Economics, Law of Diminishing Marginal Utility (DMU), Indifference curves, Law of Demand & Elasticity, Production function, and Cost-Revenue analysis.',
      topics: ['Definitions of Economics (Wealth, Welfare, Scarcity)', 'Law of Diminishing Marginal Utility (10 Marks)', 'Indifference Curve Properties & Equilibrium', 'Price Determination under Perfect Competition']
    },
    {
      id: 'eco-markets-distribution',
      name: 'Market Structures & Theory of Distribution',
      category: 'Core Microeconomics',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop',
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      desc: 'Perfect Competition, Monopoly, Monopolistic Competition, Oligopoly, Price discrimination, and Marginal Productivity theory of distribution (Rent, Wages, Interest, Profit).',
      topics: ['Perfect Competition vs Monopoly Comparison', 'Monopolistic Competition & Selling Costs', 'Ricardian Theory of Rent & Modern Rent', 'Keynesian Liquidity Preference Theory']
    },
    {
      id: 'eco-2nd-year',
      name: '2nd Year Macroeconomics',
      category: 'AP / TS Intermediate',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
      color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      desc: 'National Income concepts (GDP, GNP, NNP, Per Capita Income), Measurement methods, Difficulties in measurement, Economic growth vs development, and Human Development Index (HDI).',
      topics: ['National Income Aggregates & Formulas', 'Methods of Measuring National Income', 'Poverty, Unemployment & Demographic Trends', 'NITI Aayog & Planning in India']
    },
    {
      id: 'eco-indian-state',
      name: 'Indian & AP / TS State Economy',
      category: 'Applied Macroeconomics',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      desc: 'Agricultural sector, Green Revolution, Industrial policies, MSMEs, Service sector growth, and state economic profiles of Andhra Pradesh and Telangana.',
      topics: ['Agricultural Credit & Marketing Reforms', 'Industrial Policy Resolutions (1991 Reforms)', 'Tertiary Sector & IT Contribution', 'AP & TS State Economic Survey Highlights']
    },
    {
      id: 'eco-curve-diagrams',
      name: 'Geometric Curve & Schedule Mastery',
      category: 'Exam Visuals',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      desc: 'Step-by-step drafting of Total/Marginal Utility curves, Demand curves, Cost envelopes, and equilibrium intersection graphs with flawless axis labeling.',
      topics: ['Law of DMU Schedule & Curve Checklist', 'Cost & Revenue U-Shaped Curves', 'Elasticity Geometry & Outlay Tables', 'Variable Proportions 3-Stage Diagram']
    },
    {
      id: 'eco-upsc-cuet',
      name: 'CUET & Civil Services Economics Track',
      category: 'Competitive Foundations',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      desc: 'High-level analytical grounding combining Intermediate syllabus with CUET Economics Domain and UPSC GS-3 Indian Economy foundations.',
      topics: ['Monetary & Fiscal Policy Concepts', 'Inflation Types & Measurement (CPI/WPI)', 'Balance of Payments & Foreign Trade', 'Current Budget & Economic Survey Analysis']
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
            <LineChart size={20} />
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
            CEC • MEC • HEC
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
          <div className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1.5">
            {mod.category}
          </div>
          <h4 
            className="text-lg font-bold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
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
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
                  <CheckCircle2 size={13} className="text-amber-500 shrink-0" />
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
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
              >
                Regular Board Batch
              </button>
              <button 
                onClick={() => {
                  setActiveEnroll(null);
                  onEnroll && onEnroll(`${mod.name} - 100/100 Score Booster`);
                }}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-orange-500/20"
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
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800" id="economics-curriculum">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Complete Micro & Macroeconomics Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Economics Curriculum & Modules
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-xl font-medium">
            Complete subject-wise mastery for Junior & Senior Intermediate Economics. Explore our structured modules and enroll to master curve diagrams, market pricing, and national income.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map(renderModuleCard)}
        </div>
      </div>
    </section>
  );
}
