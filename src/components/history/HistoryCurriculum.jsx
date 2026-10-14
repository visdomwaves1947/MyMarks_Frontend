import React, { useState } from 'react';
import { BookOpen, ArrowRight, Info, ChevronLeft, Scroll, Landmark, CheckCircle2 } from 'lucide-react';

export default function HistoryCurriculum({ onEnroll }) {
  const [activeEnroll, setActiveEnroll] = useState(null);
  const [activeExplore, setActiveExplore] = useState(null);

  const modules = [
    {
      id: 'his-1st-year',
      name: '1st Year Ancient History & Civilizations',
      category: 'AP / TS Intermediate',
      image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      desc: 'Meaning and scope of History, Historical sources, Paleolithic & Neolithic societies, Indus Valley Civilization (town planning, drainage, society), and Vedic Culture.',
      topics: ['Historical Sources & Chronology', 'Indus Valley Civilization & Town Planning', 'Early & Later Vedic Societies', 'Rise of Jainism & Buddhism']
    },
    {
      id: 'his-empires-dynasties',
      name: 'Classical Empires & Medieval Dynasties',
      category: 'Dynastic History',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      desc: 'Mauryan Empire administration & Ashoka Dhamma, Kushanas, Gupta Golden Age, Harshavardhana, Delhi Sultanate (Alauddin Khilji reforms), and the Mughal Empire under Akbar.',
      topics: ['Mauryan Central & Provincial Administration', 'Gupta Golden Age in Art & Literature', 'Delhi Sultanate & Alauddin Market Reforms', 'Mughal Administration & Mansabdari System']
    },
    {
      id: 'his-2nd-year',
      name: '2nd Year Modern India & National Movement',
      category: 'AP / TS Intermediate',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop',
      color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      desc: 'Arrival of Europeans, Revolt of 1857 (causes & consequences), Indian National Congress foundation, Moderates vs Extremists, and Gandhian Era movements (1920-1947).',
      topics: ['Revolt of 1857: Causes, Nature & Results', 'Socio-Religious Reform Movements', 'Gandhian Mass Movements (Non-Cooperation, Civil Disobedience, Quit India)', 'Integration of Princely States (Sardar Patel)']
    },
    {
      id: 'his-regional-heritage',
      name: 'Regional Andhra Pradesh & Telangana Heritage',
      category: 'Regional History',
      image: 'https://images.unsplash.com/photo-1590053343281-2a1380922851?q=80&w=600&auto=format&fit=crop',
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      desc: 'Satavahanas, Ikshvakus, Kakatiyas of Warangal, Vijayanagara Empire under Krishnadevaraya, Qutb Shahis, Asaf Jahis, and modern regional political movements.',
      topics: ['Satavahana Trade & Amaravati Art', 'Kakatiya Dynasty: Orugallu & Ramappa Heritage', 'Vijayanagara Empire & Krishnadevaraya Reign', 'Qutb Shahis & Asaf Jahi Dynasty (Hyderabad State)']
    },
    {
      id: 'his-map-pointing',
      name: 'Historical Maps & Chronology Timelines',
      category: 'Exam Visuals',
      image: 'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?q=80&w=600&auto=format&fit=crop',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      desc: 'Master the mandatory 5-mark map pointing section (Harappa, Mohenjodaro, Pataliputra, Hampi, Dandi, Sanchi) and cause-effect chronological timeline flowcharts.',
      topics: ['15 Mandatory Board Examination Map Sites', 'Chronological Dynastic Rulers Flowcharts', 'Key Treaties, Battles & Dates Checklist', 'Historical Personalities & 2-Mark Bank']
    },
    {
      id: 'his-upsc-civil-services',
      name: 'UPSC Civil Services History Track',
      category: 'Civil Services Foundations',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      desc: 'Historiography, archaeological evidence evaluation, and analytical answer writing combining board syllabus with UPSC GS-1 Indian Heritage & History foundations.',
      topics: ['Primary vs Secondary Source Criticism', 'Art, Architecture & Cultural Evolution', 'Economic Impact of British Colonial Rule', 'Constitutional Development & Partition Analysis']
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
            <Scroll size={20} />
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
            HEC Group
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
          <div className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1.5">
            {mod.category}
          </div>
          <h4 
            className="text-lg font-bold text-slate-900 dark:text-white mb-2 cursor-pointer hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
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
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
                  <CheckCircle2 size={13} className="text-rose-500 shrink-0" />
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
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-rose-500/20"
              >
                Regular Board Batch
              </button>
              <button 
                onClick={() => {
                  setActiveEnroll(null);
                  onEnroll && onEnroll(`${mod.name} - 100/100 Score Booster`);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
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
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-slate-800" id="history-curriculum">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs sm:text-sm font-bold mb-6">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Complete History & Heritage Tracks</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            History Curriculum & Modules
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-xl font-medium">
            Complete subject-wise mastery for Junior & Senior Intermediate History. Explore our structured modules and enroll to master ancient, medieval, modern, and regional heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map(renderModuleCard)}
        </div>
      </div>
    </section>
  );
}
