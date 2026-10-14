import React from 'react';

export default function CivicsStatsBar() {
  const stats = [
    { value: "99.4%", label: "Civics Board Pass Rate" },
    { value: "3,200+", label: "Junior & Senior CEC/HEC Students" },
    { value: "480+", label: "Students with 95+ Marks in 2024" },
    { value: "4.9/5", label: "Student Rating for Answer Blueprints" }
  ];

  return (
    <div className="py-8 bg-indigo-600 dark:bg-indigo-950 text-white border-y border-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => (
            <div key={idx}>
              <div className="text-2xl sm:text-3xl font-black">{item.value}</div>
              <div className="text-xs sm:text-sm text-indigo-100 dark:text-indigo-300 font-medium mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
