import React from 'react';

export default function HistoryWhyChooseUs({ onOpenBooking }) {
  const features = [
    {
      title: "Chronological Timelines & Maps",
      subtitle: "Never confuse historical eras, dynasties, or treaty dates with visual timeline flowcharts and interactive maps.",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "10-Mark Historical Essay Blueprint",
      subtitle: "Learn the proven layout: Historical Background, Causes, Main Course/Events, Consequences, and Significance.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Ancient, Medieval & Modern Balance",
      subtitle: "In-depth treatment from Stone Age and Indus Valley to Mughal administration and Indian Freedom Struggle.",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Regional Andhra & Telangana History",
      subtitle: "Special chapters on the Satavahanas, Kakatiyas, Qutb Shahis, Asaf Jahis, and the state integration movements.",
      image: "https://images.unsplash.com/photo-1590053343281-2a1380922851?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Civil Services & UPSC GS-1 Alignment",
      subtitle: "Build strong historiographical reasoning and source criticism vital for UPSC, APPSC, and TSPSC Group-1.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "10+ Years Previous Solved Papers",
      subtitle: "Full-length solved board papers, 5-mark short answers, and 2-mark historical personalities flashcards.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-[#0B0F19] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-3">
            Why Choose MyMarks History
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Master History with Context & Evidence
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Turn historical facts, dates, and causes into high-scoring essay answers with guidance from experienced university historians.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <div 
              key={index}
              className="group bg-slate-50 dark:bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={feat.image} 
                  alt={feat.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
