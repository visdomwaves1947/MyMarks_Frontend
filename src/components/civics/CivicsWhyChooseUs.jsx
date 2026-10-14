import React from 'react';

export default function CivicsWhyChooseUs({ onOpenBooking }) {
  const features = [
    {
      title: "Constitutional Articles Demystified",
      subtitle: "Memorize Fundamental Rights, Writs, DPSP, and landmark amendments with visual flowchart diagrams.",
      image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Point-Wise Essay Structures",
      subtitle: "Learn the exact subheadings, definitions, and constitutional provisions that evaluators look for.",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Three Organs of Government",
      subtitle: "Clear comparative breakdowns of Legislature (Lok Sabha/Rajya Sabha), Executive, and Judiciary.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Panchayati Raj & Local Bodies",
      subtitle: "In-depth modules on 73rd and 74th Constitutional amendments, Gram Panchayats, and Municipal bodies.",
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "CLAT & Law Entrance Alignment",
      subtitle: "Foundational legal reasoning, constitutional law, and democratic tenets tailored for aspiring law students.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Verified 100/100 Marking Schemes",
      subtitle: "Step-by-step scoring rules, 2-mark definitions, and 5-mark short note formats from chief examiners.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-[#0B0F19] relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
            Why Choose MyMarks Civics
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Master Political Science & Governance
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Learn state theory, democratic principles, and the Indian Constitutional framework for maximum board marks and competitive readiness.
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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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
