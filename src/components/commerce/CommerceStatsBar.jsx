import React from 'react';

export default function CommerceStatsBar() {
  const stats = [
    { value: "98.6%", label: "Average Commerce Board Pass Rate" },
    { value: "4,500+", label: "Junior & Senior Students Mentored" },
    { value: "100/100", label: "Perfect Score Achievers in 2024" },
    { value: "4.9/5", label: "Student & Parent Satisfaction Rating" }
  ];

  return (
    <div className="py-8 bg-emerald-600 dark:bg-emerald-950 text-white border-y border-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => (
            <div key={idx}>
              <div className="text-2xl sm:text-3xl font-black">{item.value}</div>
              <div className="text-xs sm:text-sm text-emerald-100 dark:text-emerald-300 font-medium mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
