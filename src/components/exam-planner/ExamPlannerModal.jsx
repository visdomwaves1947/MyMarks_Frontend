import React from 'react';
import { X } from 'lucide-react';
import PlannerDashboard from './PlannerDashboard';

// A course page also passes how to open its lessons, and a key that keeps the student's progress
export default function ExamPlannerModal({ isOpen, onClose, selectedRoadmap, onOpenLesson, canOpenLesson, progressKey, ...plannerProps }) {
  if (!isOpen || !selectedRoadmap) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-[#0B0F19]" role="dialog" aria-modal="true" aria-label="Smart Exam Planner">
      {/* A slim bar: what this is, and Close */}
      <div className="flex-none h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-base font-mono">Σ</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">Smart Exam Planner</h2>
            <p className="text-[11px] text-slate-500 font-medium truncate">{selectedRoadmap.courseName || 'Mathematics'} Academic Coach</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close the planner"
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PlannerDashboard
          planData={selectedRoadmap}
          onOpenLesson={onOpenLesson}
          canOpenLesson={canOpenLesson}
          progressKey={progressKey}
          {...plannerProps}
        />
      </div>
    </div>
  );
}
