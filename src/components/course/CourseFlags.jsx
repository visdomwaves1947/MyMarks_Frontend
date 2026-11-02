import React from 'react';
import { Award, TrendingUp } from 'lucide-react';

const FLAG_STYLE =
  'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm';

export default function CourseFlags({ course, className = '' }) {
  if (!course.mostBought && !course.bestValue) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {course.mostBought && (
        <span className={`${FLAG_STYLE} bg-amber-400 text-amber-950`}>
          <TrendingUp size={11} />
          <span>Most Bought</span>
        </span>
      )}
      {course.bestValue && (
        <span className={`${FLAG_STYLE} bg-emerald-500 text-white`}>
          <Award size={11} />
          <span>Best Value</span>
        </span>
      )}
    </div>
  );
}
