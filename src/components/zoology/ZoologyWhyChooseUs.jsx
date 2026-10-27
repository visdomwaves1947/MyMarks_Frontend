import React from 'react';

export default function ZoologyWhyChooseUs({ onOpenBooking }) {
  const features = [
    {
      title: "100% AP & TS Board Syllabus Match",
      subtitle: "Tailored to BIEAP & TS BIE intermediate blueprints with 60/60 mark question distributions.",
      image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Master Zoology & Medical NEET Faculty",
      subtitle: "Mentored by veteran intermediate board paper evaluators and top medical biology faculty.",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Step-by-Step Labeled Diagram Blueprints",
      subtitle: "Master complete diagrams of Cockroach digestive, nervous, and reproductive systems with neat labeling.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Animal Diversity & Taxonomy Intuition",
      subtitle: "Understand non-chordate phyla and chordate classes visually with comparative anatomical charts.",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "10+ Years Previous Solved Board Papers",
      subtitle: "Complete archive of board exam papers with 60/60 model answer scripts and presentation rubrics.",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Life Cycle & Pathogenesis Flowcharts",
      subtitle: "Chapter-wise flowcharts for Plasmodium vivax, Entamoeba histolytica, Ascaris, and Wuchereria.",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "High-Probability Predicted Questions",
      subtitle: "Carefully curated predicted 8-mark, 4-mark, and 2-mark questions with 95%+ historical hit rates.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Interactive Histology & Specimen Spotting",
      subtitle: "Identify tissues, microscope slides, and museum specimens with high-resolution digital spotters.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "NEET & EAMCET Medical Speed Shortcuts",
      subtitle: "Learn fast assertion-reasoning elimination, diagram recall tricks, and high-yield NCERT biology points.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Timed Board Model Exam Series",
      subtitle: "Exact 3-hour board pattern simulator tests with step-by-step marking critique by examiners.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Official Zoology Distinction Badges",
      subtitle: "Demonstrated score achievements verified through timed full-syllabus board simulations.",
      image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "100% Concept Clarity & Zero Blind Rote",
      subtitle: "Build deep biological understanding that powers your MBBS, BDS, veterinary, and life science careers.",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-[#0B0F19] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Why Thousands Choose Zoology Learning Academy
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            The premier platform engineered to build diagram mastery, taxonomy clarity, 60/60 board scores, and NEET medical biology excellence.
          </p>
        </div>

        {/* 12 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-[#F8FAFC] dark:bg-[#131927] rounded-[20px] overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer group"
              onClick={onOpenBooking}
            >
              <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-5 sm:p-6 flex-grow flex flex-col justify-center bg-white dark:bg-[#131927]">
                <h3 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
