import React, { useState } from 'react';
import { 
  Clock, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  BookOpen
} from 'lucide-react';

export default function WhyChooseMyMarksSection({ onOpenBooking, showTestimonials = true }) {
  const [selectedHours, setSelectedHours] = useState(null);

  // 1. Why Thousands Choose Cards (For All AP & TS Intermediate Subjects)
  const whyChooseCards = [
    {
      title: "Official AP & Telangana Syllabus",
      desc: "100% textbook matching.",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Expert Faculty Guides",
      desc: "Tips from veteran paper examiners.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Chapter Wise Classes",
      desc: "Deep analytical concept breakdowns.",
      image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Timed Mock Tests",
      desc: "Real simulator of board examinations.",
      image: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Previous Board Papers",
      desc: "Fully solved papers from 2021-2026.",
      image: "https://i.pinimg.com/736x/ca/fb/dc/cafbdc723231d6c2b9e59ffeff1ec139.jpg",
    },
    {
      title: "Daily Revision Planners",
      desc: "Stay disciplined with scheduled checks.",
      image: "https://i.pinimg.com/1200x/30/0d/c9/300dc97960d1a89943538da53942c891.jpg",
    },
    {
      title: "Expected Long Questions",
      desc: "High yield predictions for board marks.",
      image: "https://i.pinimg.com/1200x/47/dc/2b/47dc2b51ec31620b50bdcce3994260f3.jpg",
    },
    {
      title: "Board Presentation Tips",
      desc: "Secrets to guarantee top scores.",
      image: "https://i.pinimg.com/1200x/30/3c/7a/303c7a508de0290c7772f7a5978691f2.jpg",
    },
    {
      title: "Progress Tracking Charts",
      desc: "Visual analytics of syllabus completed.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Gamified Leaderboards",
      desc: "Study together and reach the top spot.",
      image: "https://i.pinimg.com/736x/c9/ae/17/c9ae1757ff4afe99b115e65658a6363e.jpg",
    },
    {
      title: "Signed Certificates",
      desc: "Course completion credentials.",
      image: "https://i.pinimg.com/1200x/2c/e9/51/2ce951eef4ffa88ce769792a7a98c2fe.jpg",
    },
    {
      title: "100% Refund Guarantee",
      desc: "Zero risk, only performance gains.",
      image: "https://i.pinimg.com/1200x/70/14/04/701404e60eafd759dbad2677cdcb406e.jpg",
    },
  ];

  // 2. Score Projection Simulator items
  const projectionItems = [
    {
      time: "1 Hour",
      score: 45,
      text: "35 - 45 Marks",
      color: "from-blue-500 to-indigo-600",
      percent: 45,
    },
    {
      time: "3 Hours",
      score: 60,
      text: "50 - 60 Marks",
      color: "from-blue-600 to-indigo-600",
      percent: 60,
    },
    {
      time: "1 Day",
      score: 80,
      text: "70 - 80 Marks",
      color: "from-indigo-600 to-blue-600",
      percent: 80,
    },
    {
      time: "3 Days",
      score: 85,
      text: "80 - 85 Marks",
      color: "from-blue-600 to-cyan-600",
      percent: 85,
    },
    {
      time: "5 Days",
      score: 90,
      text: "90+ Marks",
      color: "from-blue-600 to-indigo-600",
      percent: 90,
    },
    {
      time: "7 Days",
      score: 95,
      text: "95+ Marks",
      color: "from-indigo-600 to-blue-600",
      percent: 95,
    },
    {
      time: "15 Days",
      score: 99,
      text: "99+/100 Marks",
      color: "from-blue-600 to-cyan-600",
      percent: 99,
    },
  ];

  // 3. Circular Milestone Badges
  const milestoneBadges = [
    {
      label: "1 Hour Prep",
      score: "45",
      desc: "Pass Guaranteed",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "1 Day Crash",
      score: "80",
      desc: "First Class",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "5 Days Master",
      score: "90",
      desc: "Distinction Score",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80",
    },
    {
      label: "7 Days Topper",
      score: "99+",
      desc: "State Rank",
      image: "https://isic.ca/wp-content/uploads/2023/09/pexels-lil-artsy-1925536-1080x675.jpg",
    },
  ];

  // 4. Testimonials array (Clean, for all intermediate students, no stars, no emojis)
  const testimonials = [
    {
      name: "K. Sai Varun",
      role: "1st Year Board Topper",
      text: "The chapter breakdowns and concept maps are lifesavers. I scored 99 out of 100 in my first-year boards. The timed tests gave me great confidence!",
    },
    {
      name: "Ananya Sharma",
      role: "2nd Year Student",
      text: "The explanations and formula guides make tough concepts so easy to memorize. The dashboard progress bars kept me disciplined.",
    },
    {
      name: "Prof. K. Satyanarayana",
      role: "Senior Board Paper Evaluator",
      text: "As an instructor, I recommend this portal to all my students. The comprehensive syllabus coverage and solved question banks are perfect for intermediate students.",
    },
    {
      name: "P. Srinivas Rao",
      role: "1st Year Topper (99/100)",
      text: "The solved previous board papers from 2021-2026 are incredibly accurate. Practicing mock exams helped me complete my actual paper early!",
    },
    {
      name: "M. Venkat Reddy",
      role: "2nd Year Topper (99/100)",
      text: "Crucial concepts and long questions are explained with clear diagrams and notes. The chapter classes helped me get a state rank.",
    },
    {
      name: "T. Lakshmi Prasanna",
      role: "1st Year Student (98/100)",
      text: "I was very nervous about solving equations and numerical problems, but the simple tricks and interactive quizzes made it my favorite subject!",
    },
    {
      name: "G. Chandra Shekar",
      role: "Parent of Student",
      text: "I was worried about my son's board presentation. The board writing tips and handwriting presentation guides changed his score from 75 to 99!",
    },
    {
      name: "B. Rama Devi",
      role: "2nd Year Topper (99/100)",
      text: "The 5-day masterclass revision plan is a lifesaver. It structures your study hours perfectly and covered exactly what came in the exams.",
    },
    {
      name: "K. Rajesh Kumar",
      role: "1st Year Student (99/100)",
      text: "MyMarks is the ultimate platform for intermediate students. Extremely clean interface and the faculty response to doubts is very fast.",
    },
    {
      name: "S. Gayatri Devi",
      role: "2nd Year Student (99/100)",
      text: "Thanks to the Expected Long Questions predicted on the platform, I was able to score full marks without any exam stress.",
    },
  ];

  const handleImageError = (e) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80";
  };

  return (
    <div className="w-full relative z-20">
      {/* ========================================================================= */}
      {/* 1. WHY THOUSANDS CHOOSE MYMARKS (Single straight line, clean font weight) */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-14 bg-[#e6f0fa] dark:bg-[#071328] border-t border-blue-200/60 dark:border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Why Thousands Choose MyMarks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal mt-1 leading-relaxed">
              The premier learning platform designed specifically to match AP and Telangana state intermediate board requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {whyChooseCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#c8e1fd] dark:bg-[#0f2a4a] rounded-2xl shadow-xs border-2 border-[#93c5fd] dark:border-[#1e4b7a] overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 group cursor-pointer"
                onClick={() => onOpenBooking && onOpenBooking(`Feature: ${card.title}`)}
              >
                <div className="flex flex-col h-full">
                  <div className="h-24 xs:h-28 sm:h-36 w-full overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                    <img
                      src={card.image}
                      alt={card.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 sm:p-4 space-y-1 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-normal mt-0.5 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SCORE PROJECTION SIMULATOR (Single straight line heading, blue theme) */}
      {/* ========================================================================= */}
      <section id="scorecard" className="py-10 sm:py-14 bg-[#e6f0fa] dark:bg-[#071328] border-t border-b border-blue-200/60 dark:border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Score Projection Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal mt-1 leading-relaxed">
              See the direct relationship between your study hours and guaranteed board exam percentage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch mb-8 sm:mb-12">
            {/* Visual Progress Map: Score Projection Simulator */}
            <div 
              className="p-5 sm:p-7 rounded-2xl shadow-sm border-2 border-[#93c5fd] dark:border-[#1e4b7a] space-y-4 relative overflow-hidden bg-cover bg-center bg-no-repeat flex flex-col justify-between"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80')" }}
            >
              {/* Overlay for legibility */}
              <div className="absolute inset-0 bg-[#c8e1fd]/95 dark:bg-[#0f2a4a]/95 z-0" />

              <div className="relative z-10 space-y-4">
                <div className="space-y-3.5">
                  {projectionItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="space-y-1 cursor-pointer group"
                      onClick={() => setSelectedHours(item.time)}
                    >
                      <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                        <span className="flex items-center gap-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          {item.time} study
                        </span>
                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                          {item.text}
                        </span>
                      </div>
                      <div className="h-2 sm:h-2.5 w-full bg-blue-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div
                          style={{ width: `${item.percent}%` }}
                          className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-2 border-t border-blue-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>AP & TS Intermediate Board Analytics</span>
                <span className="font-semibold text-blue-700 dark:text-blue-400">
                  Guaranteed Performance
                </span>
              </div>
            </div>

            {/* Circular score projection card with images */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              {milestoneBadges.map((circ, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenBooking && onOpenBooking(`Track: ${circ.label}`)}
                  className="bg-[#c8e1fd] dark:bg-[#0f2a4a] border-2 border-[#93c5fd] dark:border-[#1e4b7a] rounded-2xl overflow-hidden shadow-xs text-center group hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="h-20 sm:h-24 w-full overflow-hidden relative bg-slate-200 dark:bg-slate-800">
                    <img
                      src={circ.image}
                      alt={circ.label}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center p-1">
                      <p className="text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider drop-shadow">
                        {circ.label}
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3 space-y-1 flex flex-col items-center">
                    <div className="relative inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-blue-200 dark:border-slate-800 bg-white dark:bg-slate-900 -mt-7 sm:-mt-8 z-10 shadow-sm">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                        {circ.score}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-normal text-slate-700 dark:text-slate-300">
                      {circ.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 100% Refund Guarantee Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#c8e1fd] dark:bg-[#0f2a4a] border-2 border-[#93c5fd] dark:border-[#1e4b7a] p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="shrink-0 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <div className="space-y-2 flex-grow w-full">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                  100% Refund Guarantee
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                  If you complete your course following our recommended plan, attending lessons, taking required mock tests, and adhering to guidelines—but do not see the expected score improvement—we will refund 100% of your course fee.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => onOpenBooking && onOpenBooking("Refund Guarantee Policy")}
                    className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Enroll With Zero Risk
                  </button>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-normal">
                    *Terms & Conditions Apply
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHAT OUR STUDENTS SAY (No star symbols, less font weight, clean marquee)*/}
      {/* ========================================================================= */}
      {showTestimonials && <StudentReviewsSection />}
    </div>
  );
}

export function StudentReviewsSection() {
  const testimonials = [
    {
      name: "K. Sai Varun",
      role: "1st Year Board Topper",
      text: "The chapter breakdowns and concept maps are lifesavers. I scored 99 out of 100 in my first-year boards. The timed tests gave me great confidence!",
    },
    {
      name: "Ananya Sharma",
      role: "2nd Year Student",
      text: "The explanations and formula guides make tough concepts so easy to memorize. The dashboard progress bars kept me disciplined.",
    },
    {
      name: "Prof. K. Satyanarayana",
      role: "Senior Board Paper Evaluator",
      text: "As an instructor, I recommend this portal to all my students. The comprehensive syllabus coverage and solved question banks are perfect for intermediate students.",
    },
    {
      name: "P. Srinivas Rao",
      role: "1st Year Topper (99/100)",
      text: "The solved previous board papers from 2021-2026 are incredibly accurate. Practicing mock exams helped me complete my actual paper early!",
    },
    {
      name: "M. Venkat Reddy",
      role: "2nd Year Topper (99/100)",
      text: "Crucial concepts and long questions are explained with clear diagrams and notes. The chapter classes helped me get a state rank.",
    },
    {
      name: "T. Lakshmi Prasanna",
      role: "1st Year Student (98/100)",
      text: "I was very nervous about solving equations and numerical problems, but the simple tricks and interactive quizzes made it my favorite subject!",
    },
    {
      name: "G. Chandra Shekar",
      role: "Parent of Student",
      text: "I was worried about my son's board presentation. The board writing tips and handwriting presentation guides changed his score from 75 to 99!",
    },
    {
      name: "B. Rama Devi",
      role: "2nd Year Topper (99/100)",
      text: "The 5-day masterclass revision plan is a lifesaver. It structures your study hours perfectly and covered exactly what came in the exams.",
    },
    {
      name: "K. Rajesh Kumar",
      role: "1st Year Student (99/100)",
      text: "MyMarks is the ultimate platform for intermediate students. Extremely clean interface and the faculty response to doubts is very fast.",
    },
    {
      name: "S. Gayatri Devi",
      role: "2nd Year Student (99/100)",
      text: "Thanks to the Expected Long Questions predicted on the platform, I was able to score full marks without any exam stress.",
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-[#e6f0fa] dark:bg-[#071328] overflow-hidden border-b border-blue-200/60 dark:border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            What Our Students Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal mt-1 leading-relaxed">
            Thousands of intermediate students score top marks in AP & Telangana board exams using our learning system.
          </p>
        </div>
      </div>

      {/* Marquee Train Container */}
      <div className="relative w-full overflow-hidden py-1 select-none">
        <div className="absolute left-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-r from-[#e6f0fa] dark:from-[#071328] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 sm:w-16 bg-gradient-to-l from-[#e6f0fa] dark:from-[#071328] to-transparent z-10 pointer-events-none" />

        <div className="animate-train-marquee flex gap-3 sm:gap-5">
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-[#c8e1fd] dark:bg-[#0f2a4a] p-4 sm:p-5 rounded-2xl shadow-xs border-2 border-[#93c5fd] dark:border-[#1e4b7a] space-y-2.5 w-[270px] xs:w-[300px] sm:w-[330px] shrink-0 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic font-normal leading-relaxed line-clamp-3">
                "{testimonial.text}"
              </p>
              <div className="pt-2 border-t border-blue-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-[10px] text-blue-700 dark:text-blue-400 font-normal uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                  Topper
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
