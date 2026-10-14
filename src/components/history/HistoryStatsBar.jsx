import React from 'react';

export default function HistoryStatsBar() {
  const stats = [
    { value: "98.9%", label: "History Board Pass Rate" },
    { value: "2,900+", label: "Junior & Senior HEC Students" },
    { value: "410+", label: "Students with 95+ Marks in 2024" },
    { value: "4.9/5", label: "Student Rating for Timeline Clarity" }
  ];

  return (
    <div className="py-8 bg-rose-600 dark:bg-rose-950 text-white border-y border-rose-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, idx) => (
            <div key={idx}>
              <div className="text-2xl sm:text-3xl font-black">{item.value}</div>
              <div className="text-xs sm:text-sm text-rose-100 dark:text-rose-300 font-medium mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
