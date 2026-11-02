import React, { useState } from 'react';
import { X } from 'lucide-react';
import PlannerDashboard from './PlannerDashboard';

export default function ExamPlannerModal({ isOpen, onClose, selectedRoadmap }) {
  if (!isOpen || !selectedRoadmap) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm overflow-hidden">
      <div className="bg-[#E5ECF4] dark:bg-[#0B0F19] w-full h-full shadow-2xl flex flex-col relative overflow-hidden transition-all duration-300 transform">
        
        {/* Header Bar */}
        <div className="flex-none h-16 sm:h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131927] px-4 sm:px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-black text-xl font-mono">Σ</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Smart Exam Planner</h2>
              <p className="text-xs text-slate-500 font-medium">{selectedRoadmap.courseName || 'Mathematics'} Academic Coach</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto relative">
          <PlannerDashboard planData={selectedRoadmap} onRestart={onClose} />
        </div>
        
      </div>
    </div>
  );
}
