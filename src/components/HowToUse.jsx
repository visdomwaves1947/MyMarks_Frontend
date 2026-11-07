import React from 'react';
import { UserPlus, BookOpen, PenTool, TrendingUp, Video, Target, Award, Clock } from 'lucide-react';
import useHomePage from '../hooks/useHomePage';

// The icon choices on the admin Website Pages > Home Page tab
const STEP_ICONS = {
  'user-plus': UserPlus,
  book: BookOpen,
  pen: PenTool,
  trending: TrendingUp,
  video: Video,
  target: Target,
  award: Award,
  clock: Clock,
};

// "How to Use MyMarks". The admin preview passes its own content; the home page uses the saved one.
// Its button signs a visitor up; someone already signed in goes on to the subjects instead.
export default function HowToUse({ onOpenSignUp, content, currentUser = null }) {
  const home = useHomePage();
  const { heading, subheading, buttonLabel, steps = [] } = content || home.howToUse;
  if (steps.length === 0) return null;

  return (
    <section data-testid="how-to-use" className="py-10 sm:py-14 bg-[#e6f0fa] dark:bg-[#071328] border-t border-blue-200/60 dark:border-blue-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {heading && (
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              {heading}
            </h2>
          )}
          {subheading && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal mt-1 leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              data-testid="how-to-use-step"
              className="relative flex flex-col items-center text-center p-5 rounded-2xl bg-[#c8e1fd] dark:bg-[#0f2a4a] border-2 border-[#93c5fd] dark:border-[#1e4b7a] shadow-xs hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-4 group-hover:scale-105 transition-transform duration-300">
                {React.createElement(STEP_ICONS[step.icon] || BookOpen, { size: 22 })}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-2">
                {idx + 1}. {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                {step.text}
              </p>
              {/* Arrow connector for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-11 -right-3 w-6 border-t-2 border-dashed border-[#93c5fd] dark:border-[#1e4b7a]"></div>
              )}
            </div>
          ))}
        </div>

        {buttonLabel && (
          <div className="text-center">
            <button
              data-testid="how-to-use-start"
              onClick={() => {
                if (currentUser) {
                  document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  return;
                }
                if (onOpenSignUp) onOpenSignUp();
              }}
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              {buttonLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
