import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export default function CommerceTestimonials({ onOpenBooking }) {
  const reviews = [
    {
      name: "Sai Teja Reddy",
      role: "BIEAP Junior Inter • 99/100 Marks",
      college: "Sri Chaitanya Jr College, Vijayawada",
      text: "The final accounts with adjustments module is unbelievable. I used to make errors in balance sheet totals, but MyMarks step-by-step ledger breakdown helped me score 99 in Commerce!",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Keerthana Rao",
      role: "TSBIE Senior Inter • 100/100 Marks",
      college: "Narayana Jr College, Hyderabad",
      text: "Scored full 100/100 in Commerce! The Bank Reconciliation Statement (BRS) cheat sheets and Section-A essay predictions were exactly what appeared on the board examination paper.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Rohan Varma",
      role: "MEC Student & CA Foundation Aspirant",
      college: "St. Mary's College, Secunderabad",
      text: "Taking MEC stream gave me the perfect balance of Mathematics and Commerce. MyMarks provided the conceptual clarity I needed to ace both Intermediate and clear CA Foundation in the first attempt.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-[#0B0F19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Proven Results from CEC & MEC Toppers
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Read how students from Andhra Pradesh and Telangana achieved 98+ marks in board examinations.
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
                <Quote className="text-emerald-500/20 mb-2" size={32} />
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rev.name}</h3>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{rev.role}</p>
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
