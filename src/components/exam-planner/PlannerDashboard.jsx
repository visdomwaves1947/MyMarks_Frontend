import React from 'react';
import { Bookmark, X, Check, Video, FileText, CheckSquare, Tag, ArrowRight } from 'lucide-react';

const RESOURCE_STYLES = {
  video: { icon: Video, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' },
  notes: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  quiz: { icon: CheckSquare, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
  tag: { icon: Tag, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' },
};

export default function PlannerDashboard({ planData, onRestart }) {
  // Use plan data or default fallbacks
  const durationText = planData?.steps ? planData.title.toUpperCase() : planData?.planTitle ? planData.planTitle.toUpperCase() : (planData?.duration === 1 ? '1 DAY' : planData?.duration ? `${planData.duration} DAYS` : '15 DAYS');
  const planSubtitle = planData?.expectedScore ? `Target Score: ${planData.expectedScore}` : 'Perfect for students with almost no preparation. Secures minimum passing marks.';
  // A course page brings its own plan. The old subject pages still show this Mathematics plan.
  const planSteps = planData?.steps ? planData.steps.map((step, index) => ({
    id: index + 1,
    time: step.time,
    title: step.title,
    desc: step.desc,
    tags: (step.resources || []).map((resource) => ({ ...RESOURCE_STYLES[resource.kind], text: resource.text }))
  })) : [
    {
      id: 1,
      time: '00-15 MINUTES',
      title: 'Algebra Basics & High-Yield Equations',
      desc: 'Learn crucial algebraic identities and quadratic formulas. Focus on high-weightage equation patterns commonly asked in Board Exams.',
      tags: [
        { icon: Video, text: 'Algebra Shortcuts (8 mins)', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' },
        { icon: FileText, text: 'Quadratic Formula Sheet', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
        { icon: CheckSquare, text: 'Linear Equations Quiz (5 Qs)', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
        { icon: Tag, text: 'High-Yield Identities', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' }
      ]
    },
    {
      id: 2,
      time: '15-30 MINUTES',
      title: 'Essential Geometry Theorems',
      desc: 'Master the most critical geometry proofs: Pythagoras theorem, Basic Proportionality (Thales), and Circle tangents across all variations.',
      tags: [
        { icon: Video, text: 'Theorem Memorizer (6 mins)', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' },
        { icon: FileText, text: 'Top 3 Proof Sheets', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
        { icon: CheckSquare, text: 'Triangles Match Quiz (5 Qs)', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' }
      ]
    },
    {
      id: 3,
      time: '30-45 MINUTES',
      title: 'High-Yield One-Mark Questions',
      desc: 'Review top 10 most frequently repeated one-mark questions from Trigonometry & Statistics sections. Memorize formulas and contexts.',
      tags: [
        { icon: Video, text: 'One-Mark Board Qs Breakdown (5 mins)', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' },
        { icon: FileText, text: 'One-Mark Master List PDF', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
        { icon: CheckSquare, text: 'One-Mark Board Practice (10 Qs)', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' }
      ]
    },
    {
      id: 4,
      time: '45-60 MINUTES',
      title: 'Final Mock Bits & Presentation',
      desc: 'Complete a 15-question fast-paced mock paper section. Learn the exact order in which to write answers and how to leave a great impression on the examiner.',
      tags: [
        { icon: Video, text: 'Exam Hall Presentation Secrets', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' },
        { icon: FileText, text: '1-Hour Exam Cheat Sheet', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-[#0B0F19] overflow-y-auto overflow-x-hidden animate-in fade-in duration-500 pb-12">
      
      {/* Top Blue Banner Section */}
      <div className="bg-[#2A75D3] text-white px-6 py-8 sm:px-10 shrink-0 relative">
        {/* Actions */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
          <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors">
            <Bookmark size={18} fill="currentColor" />
          </button>
          <button onClick={onRestart} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="inline-block bg-[#3B82F6]/50 text-white font-bold px-4 py-1.5 rounded-full text-xs tracking-wider mb-4 border border-blue-400/30">
            {durationText}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3 tracking-tight text-white">{durationText}</h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl font-medium">
            {planSubtitle}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        {/* Timeline Visualizer */}
        <div className="hidden sm:block relative mb-12 mt-4 px-10">
          {/* Connecting Line */}
          <div className="absolute top-[18px] left-16 right-16 h-0.5 bg-slate-200 dark:bg-slate-700"></div>
          
          <div className="relative flex justify-between">
            {planSteps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border-[3px] border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold mb-3 relative z-10 text-sm shadow-sm">
                  {step.id}
                </div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded">
                  {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar min-h-0 shrink-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {planSteps.map((step) => (
            <div 
              key={step.id} 
              className="snap-center shrink-0 w-[85vw] sm:w-[350px] bg-white dark:bg-[#131927] border border-cyan-100 dark:border-cyan-900/30 rounded-3xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow relative"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider">
                  STEP 0{step.id} • {step.time}
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-[17px] font-extrabold text-slate-900 dark:text-white mb-3 leading-snug">
                {step.title}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1 min-h-[90px]">
                {step.desc}
              </p>

              {/* Tags List */}
              <div className="flex flex-wrap gap-2 mb-8">
                {step.tags.map((tag, i) => {
                  const TagIcon = tag.icon;
                  return (
                    <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${tag.border} ${tag.bg} ${tag.color} w-fit max-w-full`}>
                      <TagIcon size={12} className="shrink-0" />
                      <span className="text-[10px] font-bold truncate tracking-wide">{tag.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <button 
                onClick={() => alert(`Starting Step 0${step.id}: ${step.title}`)}
                className="mt-auto w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm py-3.5 rounded-[20px] transition-colors flex items-center justify-center gap-2"
              >
                Start Step 0{step.id} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

      </div>
      
      {/* Hide scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
