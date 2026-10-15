import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FlaskConical,
  Atom,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
} from "lucide-react";

export default function SubjectLabPracticalBanner({
  subjectId = "phy",
  subjectName = "Physics",
  practicalMarks = "30 Marks",
}) {
  const navigate = useNavigate();

  return (
    <section className="py-10 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 text-white border-y border-purple-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical size={13} className="text-purple-400" />
                <span>Compulsory {practicalMarks} Board Practical</span>
              </span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles size={12} /> AP / TS BIE Verified
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Master {subjectName} Lab Experiments & Viva-Voce
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Don't leave practical marks to chance. Practice with interactive virtual simulators, step-by-step apparatus procedures, observation record templates, and examiner viva oral question banks.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Interactive Virtual Sandbox</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Tabular Calculation Columns</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Top 20 Viva Questions</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => navigate(`/practicals?subject=${subjectId}`)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Sliders size={16} />
              <span>Launch {subjectName} Virtual Lab</span>
            </button>
            <button
              onClick={() => navigate(`/practicals?subject=${subjectId}`)}
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FileText size={15} />
              <span>Viva Handbooks</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
