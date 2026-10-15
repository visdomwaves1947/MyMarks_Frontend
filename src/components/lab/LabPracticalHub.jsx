import React, { useState } from "react";
import {
  FlaskConical,
  Atom,
  Binary,
  Cpu,
  Globe2,
  Wrench,
  Dna,
  Microscope,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Play,
  FileText,
  Sliders,
  ChevronDown,
  ChevronRight,
  Search,
  Lock,
  Compass,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { LAB_SUBJECTS } from "../../data/labPracticalsData";
import {
  PhysicsSimulator,
  ChemistrySimulator,
  ElectronicsSimulator,
  CSCodeSimulator,
  MicroscopeSimulator,
  MathSimulator,
} from "./LabSimulators";

export default function LabPracticalHub({
  initialSubjectId = "phy",
  onOpenBooking,
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [activeTab, setActiveTab] = useState("simulator"); // 'simulator' | 'experiments' | 'viva' | 'marking'
  const [selectedYear, setSelectedYear] = useState("all"); // 'all' | '1st Year' | '2nd Year'
  const [expandedExpId, setExpandedExpId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentSubject =
    LAB_SUBJECTS.find((s) => s.id === selectedSubjectId) || LAB_SUBJECTS[0];

  const getSubjectIcon = (id, size = 20) => {
    switch (id) {
      case "maths":
        return <Compass size={size} />;
      case "phy":
        return <Atom size={size} />;
      case "chem":
        return <FlaskConical size={size} />;
      case "bot":
        return <Dna size={size} />;
      case "zoo":
        return <Microscope size={size} />;
      case "cs":
        return <Binary size={size} />;
      case "elec":
        return <Cpu size={size} />;
      case "geo":
        return <Globe2 size={size} />;
      default:
        return <FlaskConical size={size} />;
    }
  };

  const filteredExperiments = currentSubject.experiments.filter((exp) => {
    const matchesYear =
      selectedYear === "all" || exp.year === selectedYear;
    const matchesQuery =
      searchQuery === "" ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.aim.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesQuery;
  });

  const renderSimulatorForSubject = (id) => {
    switch (id) {
      case "maths":
        return <MathSimulator />;
      case "phy":
        return <PhysicsSimulator />;
      case "chem":
        return <ChemistrySimulator />;
      case "elec":
        return <ElectronicsSimulator />;
      case "cs":
        return <CSCodeSimulator />;
      case "bot":
      case "zoo":
        return <MicroscopeSimulator />;
      default:
        return (
          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Sparkles size={28} />
            </div>
            <h4 className="text-xl font-bold">Interactive Practical Workbench</h4>
            <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
              Explore step-by-step procedures, observation tables, and examiner viva questions for {currentSubject.name} below.
            </p>
            <button
              onClick={() => setActiveTab("experiments")}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              View Official Board Experiments
            </button>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Subject Selector Bar (Horizontal scroll on mobile) */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {LAB_SUBJECTS.map((sub) => {
            const isSelected = sub.id === currentSubject.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setExpandedExpId(null);
                }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-lg scale-[1.02]"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span
                  className={
                    isSelected
                      ? "text-cyan-400 dark:text-indigo-600"
                      : "text-slate-500 dark:text-slate-400"
                  }
                >
                  {getSubjectIcon(sub.id, 16)}
                </span>
                <span>{sub.shortName}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                    isSelected
                      ? "bg-white/20 dark:bg-black/10 text-white dark:text-slate-900"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {sub.boardMarks}M
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Subject Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-10 mb-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                {currentSubject.stream} &bull; AP / TS Intermediate
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Board Practical: {currentSubject.boardMarks} Marks
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Exam Duration: {currentSubject.durationHours}
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
              {currentSubject.name}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentSubject.overview}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => onOpenBooking && onOpenBooking(`${currentSubject.name} Practical Workshop`)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles size={16} />
              <span>Book 1-on-1 Lab Prep</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Board Marks</span>
            <span className="text-xl sm:text-2xl font-black text-white">{currentSubject.boardMarks} Marks</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Experiment Setup</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-400">{currentSubject.experimentMarks} Marks</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Record Book</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{currentSubject.recordMarks} Marks</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Viva-Voce</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">{currentSubject.vivaMarks} Marks</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "simulator"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sliders size={15} />
            <span>Virtual Lab Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab("experiments")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "experiments"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText size={15} />
            <span>Official Experiments ({currentSubject.experiments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("viva")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "viva"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <HelpCircle size={15} />
            <span>Viva-Voce Bank</span>
          </button>
          <button
            onClick={() => setActiveTab("marking")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "marking"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Award size={15} />
            <span>Marking Scheme</span>
          </button>
        </div>

        {/* Year Filter for Experiments */}
        {activeTab === "experiments" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Filter Year:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              {["all", "1st Year", "2nd Year"].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedYear === yr
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {yr === "all" ? "All Years" : yr}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Content Display */}

      {/* 1. Virtual Simulator Tab */}
      {activeTab === "simulator" && (
        <div className="mb-12">
          {renderSimulatorForSubject(currentSubject.id)}
        </div>
      )}

      {/* 2. Official Board Experiments Tab */}
      {activeTab === "experiments" && (
        <div className="space-y-4 mb-12">
          {filteredExperiments.map((exp, idx) => {
            const isExpanded = expandedExpId === exp.id || (idx === 0 && expandedExpId === null);
            return (
              <div
                key={exp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedExpId(isExpanded ? "" : exp.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 font-black text-sm flex items-center justify-center shrink-0 border border-cyan-200 dark:border-cyan-800">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {exp.year}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          Board Compulsory
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {exp.title}
                      </h4>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform duration-300 shrink-0 ${
                      isExpanded ? "rotate-180 text-cyan-600" : ""
                    }`}
                  />
                </button>

                {/* Accordion Expanded Body */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80 space-y-6">
                    {/* Aim */}
                    <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-400 block mb-1">
                        Aim of Experiment:
                      </span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {exp.aim}
                      </p>
                    </div>

                    {/* Apparatus Required */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Apparatus & Reagents Required:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {exp.apparatus}
                      </p>
                    </div>

                    {/* Principle & Formula */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                        <span className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-400 block mb-1">
                          Principle & Scientific Theory:
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {exp.principle}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                        <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 block mb-1">
                          Governing Formula & Units:
                        </span>
                        <code className="text-xs sm:text-sm font-mono font-bold text-emerald-800 dark:text-emerald-300 block py-1">
                          {exp.formula}
                        </code>
                      </div>
                    </div>

                    {/* Step-by-Step Procedure */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                        Official Step-by-Step Procedure:
                      </span>
                      <div className="space-y-2">
                        {exp.procedure.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Observation Table Columns */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Tabular Column Format for Record & Exam Sheet:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {exp.observationColumns.map((col, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Precautions */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                      <span className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 block mb-2">
                        Crucial Examiner Precautions to Avoid Mark Deductions:
                      </span>
                      <div className="space-y-1.5">
                        {exp.precautions.map((prec, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 font-medium"
                          >
                            <CheckCircle2 size={14} className="text-amber-500 shrink-0 mt-0.5" />
                            <span>{prec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Viva-Voce Master Bank Tab */}
      {activeTab === "viva" && (
        <div className="space-y-4 mb-12">
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 flex items-center gap-3">
            <Sparkles size={22} className="text-amber-500 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">
              These are the top frequently asked oral questions by Board External Examiners in AP & Telangana intermediate practicals. Memorize these model answers for guaranteed 5/5 or 10/10 viva marks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentSubject.vivaQuestions.map((viva, vIdx) => (
              <div
                key={vIdx}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                    Q{vIdx + 1}
                  </span>
                  <h5 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                    {viva.q}
                  </h5>
                </div>

                <div className="ml-10 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                    Examiner-Approved Model Answer:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {viva.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Marking Scheme & Record Rules Tab */}
      {activeTab === "marking" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Breakdown Table */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Official Board Evaluation Rubric
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {currentSubject.name} Marking Blueprint
              </h4>
            </div>

            <div className="space-y-3">
              {currentSubject.markingBreakdown.map((item, mIdx) => (
                <div
                  key={mIdx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {item.component}
                  </span>
                  <span className="text-xs sm:text-sm font-black px-3 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                    {item.marks} Marks
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white font-bold">
              <span>Total Practical Marks:</span>
              <span className="text-xl font-black text-cyan-400">
                {currentSubject.boardMarks} / {currentSubject.boardMarks} Marks
              </span>
            </div>
          </div>

          {/* Record Book Submission Guidelines */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-850 p-6 sm:p-8 rounded-3xl border border-indigo-100 dark:border-slate-800 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Board Examiner Guidelines
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Rules for 100% Practical Record Score
            </h4>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  All diagrams must be drawn with HB pencil only on the left unruled page with clear horizontal labels.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Index page must have complete experiment titles, dates, page numbers, and lecturer signature for every entry.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Units must strictly accompany every numerical value in tabular columns, formulas, and final results.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Record books must be submitted in neat, clean condition on day of board practical with student hall ticket number.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
