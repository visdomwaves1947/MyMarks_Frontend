import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FlaskConical, Sparkles, BookOpen, Layers } from "lucide-react";
import LabPracticalHub from "../components/lab/LabPracticalHub";

export default function LabPracticalsPage({ onOpenBooking }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subjectParam = searchParams.get("subject") || "phy";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [subjectParam]);

  return (
    <div className="min-h-screen bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 transition-colors duration-300 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate("/demo#courses")}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-300 transition-all cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Intermediate Subjects</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
            <FlaskConical size={14} className="text-purple-500" />
            <span>AP & TS Board Practical Curriculum (30 / 50 Marks)</span>
          </div>
        </div>

        {/* Page Main Title & Description */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 text-xs font-bold">
            <Sparkles size={14} className="text-cyan-500" />
            <span>Interactive Virtual Lab & Examiner Handbooks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Intermediate Lab & Practical Work
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Hands-on laboratory practical guides, interactive real-time simulators, step-by-step experiment procedures, observation records, and examiner viva-voce master banks for Physics, Chemistry, Botany, Zoology, Computer Science, Electronics, and Geography.
          </p>
        </div>

        {/* Interactive Lab Practical Hub */}
        <div className="pt-2">
          <LabPracticalHub
            initialSubjectId={subjectParam}
            onOpenBooking={onOpenBooking}
          />
        </div>
      </div>
    </div>
  );
}
