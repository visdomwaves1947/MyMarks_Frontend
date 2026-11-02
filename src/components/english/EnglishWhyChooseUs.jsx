import React from 'react';

export default function EnglishWhyChooseUs({ onOpenBooking }) {
  const features = [
    {
      title: "Official Board Curriculum Aligned",
      subtitle: "100% matched with TS BIE, BIEAP, CBSE, and competitive English exam standards.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Master Literature & Language Faculty",
      subtitle: "Learn from university professors, published authors, and veteran board examiners.",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Line-by-Line Poetry & Prose Breakdowns",
      subtitle: "Deep analytical notes, theme explanations, character sketches, and stanza annotations.",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Timed Essay & Grammar Mock Tests",
      subtitle: "Real simulators of board examinations with time management techniques.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "10+ Years Previous Solved Papers",
      subtitle: "Fully solved board papers with 100/100 model answers and scoring secrets.",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Daily Vocabulary & Reading Planners",
      subtitle: "Curated word banks, phrasal verbs, idioms, and reading habit builders.",
      image: "https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Expected Board Questions & Blueprints",
      subtitle: "High-yield essay predictions, letter formats, and summary blueprints for maximum marks.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Smart Writing & Progress Tracking",
      subtitle: "Automated analysis of vocabulary richness, grammar precision, and syllabus mastery.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Interactive Phonetics & Grammar Lab",
      subtitle: "Interactive IPA phonetic transcriptions, sentence transformations, and tense charts.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Speech & Pronunciation Clinics",
      subtitle: "Build spoken English confidence, public speaking delivery, and accent clarity.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Official Language Certificates",
      subtitle: "Credentials showcasing advanced English writing, literature, and communication mastery.",
      image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "100% Concept & Fluency Clarity",
      subtitle: "Zero mindless rote memorization—only genuine mastery of language mechanics.",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#E6F0FA]/40 dark:bg-[#0B0F19] relative overflow-hidden border-b border-blue-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <span>Core Highlights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Why Thousands Choose English Learning Academy
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal">
            The premier platform engineered to build impeccable English grammar, deep literary appreciation, 100/100 board scores, and articulate spoken fluency.
          </p>
        </div>

        {/* 12 Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4.5">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-blue-100 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col cursor-pointer group"
              onClick={onOpenBooking}
            >
              <div className="relative h-36 sm:h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 leading-snug line-clamp-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={feature.title}>
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal line-clamp-2">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
