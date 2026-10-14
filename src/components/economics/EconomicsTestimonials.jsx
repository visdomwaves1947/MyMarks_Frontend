import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function EconomicsTestimonials({ onOpenBooking }) {
  const reviews = [
    {
      name: "Bhavana Sharma",
      role: "CEC Group • 99/100 in Economics",
      college: "Bhavan's Sri Ramakrishna Jr College, Secunderabad",
      text: "The diagram blueprints are a lifesaver. MyMarks taught me how to label the X and Y axes, schedule, and assumptions for Law of DMU so cleanly that the examiner gave me full 10 marks!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Tarun Kumar",
      role: "MEC Group • AP State 3rd Rank",
      college: "Aditya Junior College, Kakinada",
      text: "Economics requires both logic and memorization. The comparative tables for Perfect Competition vs. Monopoly and the elasticity formulas made answering Section-A effortless.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Ananya Pillai",
      role: "HEC Student & UPSC Civil Services Aspirant",
      college: "St. Francis College for Women, Hyderabad",
      text: "Choosing HEC was the best decision for my civil services goal. MyMarks made Intermediate Economics so engaging, bridging NCERT fundamentals with AP/TS Board requirements seamlessly.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            High Scores Across CEC, MEC & HEC
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Verified feedback from students who achieved state ranks in Economics.
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
                <Quote className="text-amber-500/20 mb-2" size={32} />
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</h3>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{rev.role}</p>
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
