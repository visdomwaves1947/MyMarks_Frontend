import React from 'react';
import { Star, Quote, Award, CheckCircle } from 'lucide-react';

export default function EnglishTestimonials({ onOpenBooking }) {
  const englishReviews = [
    {
      name: 'Ananya Sharma',
      role: 'Class 12 / Senior Inter Student',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      comment: 'I scored 98/100 in my Intermediate Board English! The poetry analysis blueprints and formal letter templates were absolute game changers. My mentor corrected my grammar line by line.',
      rating: 5,
      course: 'Senior Inter English Masterclass',
      achievement: '98/100 Board Score'
    },
    {
      name: 'Rahul Varma',
      role: 'Junior Inter Student & CUET Aspirant',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
      comment: 'English grammar used to confuse me, especially Direct & Indirect speech. The interactive grammar drills and active voice rules made everything crystal clear. I feel confident speaking in public too!',
      rating: 5,
      course: 'Grammar & Syntax Mastery',
      achievement: '99% Grammar Accuracy'
    },
    {
      name: 'Dr. Suresh Reddy (Parent)',
      role: 'Father of AP Board Student',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      comment: 'The personalized feedback on essay writing and reading comprehension helped my son jump from 72 to 96 marks in English. The tutors are exceptionally dedicated and provide weekly progress notes.',
      rating: 5,
      course: '1-on-1 Elite English Mentorship',
      achievement: '24 Mark Jump'
    },
    {
      name: 'Pooja Iyer',
      role: 'Class 11 / Junior Inter Student',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
      comment: 'The phonetics transcription guides and previous 10-year question banks made preparing for exams so peaceful. The mock test simulations matched the exact board pattern!',
      rating: 5,
      course: 'Junior Inter English Foundation',
      achievement: '100% Pass in Mock Series'
    }
  ];

  return (
    <section id="reviews" className="py-16 sm:py-20 relative bg-[#E5ECF4] dark:bg-[#0B0F19] overflow-hidden border-t border-b border-[#CBD5E1] dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Award size={14} className="text-blue-600 dark:text-blue-400" />
            Verified English Transformations
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Loved by Students. Trusted by Parents.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base font-normal">
            Read how students transformed their grammar anxiety into 98+ board marks, eloquent essay writing, and confident English fluency.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {englishReviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-lg relative group"
            >
              <div className="absolute top-6 right-6 text-slate-400/40 dark:text-slate-600/40 group-hover:text-blue-600/30 transition-colors">
                <Quote size={40} />
              </div>

              <div>
                {/* Rating & Achievement Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70">
                    ★ {review.achievement}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed mb-6 italic relative z-10 font-normal">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Course info */}
              <div className="pt-4 border-t border-[#CAD8EA] dark:border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      {review.name}
                      <CheckCircle size={14} className="text-blue-600 dark:text-blue-400" />
                    </h4>
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{review.role}</span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Course Completed:</span>
                  <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 font-mono">
                    {review.course}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Global Impact Numbers */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="p-5 sm:p-6 rounded-2xl bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] shadow-xs">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono mb-1">45,000+</div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Live Hours Taught</div>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] shadow-xs">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono mb-1">99.2%</div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Board Pass Rate</div>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] shadow-xs">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono mb-1">4.96 / 5</div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Parent Satisfaction</div>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] shadow-xs">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono mb-1">280+</div>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">95+ Marks Scorers</div>
          </div>
        </div>

      </div>
    </section>
  );
}
