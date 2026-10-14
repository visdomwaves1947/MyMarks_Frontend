import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function CivicsTestimonials({ onOpenBooking }) {
  const reviews = [
    {
      name: "Sowmya Reddy",
      role: "CEC Topper • 98/100 in Civics",
      college: "Gowtham Junior College, Vijayawada",
      text: "Civics used to feel like pure rote memorization until I joined MyMarks. The point-by-point presentation format for 10-mark questions made my exam papers stand out immediately.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Vikas Chandra",
      role: "HEC Student • TS Inter State Ranker",
      college: "Kakatiya Junior College, Hanamkonda",
      text: "The separation of powers and Fundamental Rights flowcharts are brilliant. MyMarks gave me the exact constitutional articles needed to write flawless answers.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Meghana Iyer",
      role: "CLAT Aspirant & Junior Inter Student",
      college: "Villa Marie College, Hyderabad",
      text: "My goal is National Law School Bangalore (NLSIU). Studying Civics on MyMarks gave me an unmatched head start in Constitutional Law and Legal Aptitude.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            High Scores in Civics & Political Science
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Feedback from CEC and HEC students who aced their board examinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div 
              key={i}
              className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} className="fill-amber-500" />
                  ))}
                </div>
                <Quote className="text-indigo-500/20 mb-2" size={32} />
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{rev.role}</p>
                  <p className="text-[11px] text-slate-400">{rev.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
