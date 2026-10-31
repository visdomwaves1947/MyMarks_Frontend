import React from 'react';

export default function EnglishStatsBar() {
  const stats = [
    { number: '120+', label: 'STRUCTURED LESSONS' },
    { number: '4500+', label: 'GRAMMAR EXERCISES' },
    { number: '800+', label: 'PREVIOUS BOARD PAPERS' },
    { number: '250+', label: 'VIDEO CLASSES' },
    { number: '100+', label: 'MOCK EXAMINATIONS' },
    { number: '99.4%', label: 'STUDENT PASS RATE' },
  ];

  return (
    <section className="w-full bg-[#E5ECF4] dark:bg-[#0B0F19] py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white dark:bg-[#131927] rounded-[24px] shadow-sm border border-slate-200/50 dark:border-slate-800 py-8 sm:py-10 px-6 w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-4 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center pt-6 lg:pt-0 first:pt-0 lg:first:pt-0">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight mb-1.5">
                  {stat.number}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
