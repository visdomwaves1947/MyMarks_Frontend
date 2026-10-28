import React from 'react';
import { UserPlus, BookOpen, PenTool, TrendingUp } from 'lucide-react';

export default function HowToUse({ onOpenSignUp }) {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Create Your Account",
      desc: "Sign up to access your personalized student dashboard and track your progress."
    },
    {
      icon: BookOpen,
      title: "2. Choose Your Subjects",
      desc: "Enroll in the specific AP/TS Intermediate subjects you want to master."
    },
    {
      icon: PenTool,
      title: "3. Learn & Practice",
      desc: "Watch interactive lessons, read premium notes, and use our smart simulators."
    },
    {
      icon: TrendingUp,
      title: "4. Test & Improve",
      desc: "Take mock tests designed for BIE patterns and see your scores skyrocket."
    }
  ];

  return (
    <section className="py-10 sm:py-14 bg-[#e6f0fa] dark:bg-[#071328] border-t border-blue-200/60 dark:border-blue-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            How to Use MyMarks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal mt-1 leading-relaxed">
            Follow these four simple steps to begin your journey towards board exam excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="relative flex flex-col items-center text-center p-5 rounded-2xl bg-[#c8e1fd] dark:bg-[#0f2a4a] border-2 border-[#93c5fd] dark:border-[#1e4b7a] shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Icon size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                  {step.desc}
                </p>
                {/* Arrow connector for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-11 -right-3 w-6 border-t-2 border-dashed border-[#93c5fd] dark:border-[#1e4b7a]"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button 
            onClick={() => onOpenSignUp && onOpenSignUp()}
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
