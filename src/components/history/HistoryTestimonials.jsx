import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function HistoryTestimonials({ onOpenBooking }) {
  const reviews = [
    {
      name: "Pooja Varma",
      role: "HEC Student • 99/100 in History",
      college: "St. Ann's Junior College for Girls, Hyderabad",
      text: "The cause-and-effect timeline charts made remembering dates and peace treaties effortless. I scored 99 in History and my answers were displayed as model scripts in college!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Kalyan Krishna",
      role: "BIEAP Intermediate • State 2nd Rank in Humanities",
      college: "Government Junior College, Guntur",
      text: "History map pointing used to cost me marks, but MyMarks 15 landmark map templates gave me full 5 marks on the map section. Their essay structures are unmatched.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Aparna Nambiar",
      role: "UPSC Civil Services Aspirant & HEC Scholar",
      college: "Loyola Academy, Secunderabad",
      text: "The analytical depth of MyMarks History courses is exceptional. It gives intermediate students the historical thinking and primary source evaluation normally taught only at university level.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Proven Scores in History & Humanities
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Feedback from HEC students who scored top ranks in AP & TS Intermediate Board Exams.
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
                <Quote className="text-rose-500/20 mb-2" size={32} />
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</h3>
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{rev.role}</p>
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
