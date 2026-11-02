import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function UrduFaqSection({ onOpenBooking }) {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does the free 1-on-1 Urdu diagnostic assessment work?',
      a: 'The free 45-minute assessment connects your student directly with a senior Urdu language & literature specialist. We evaluate grammar mechanics, reading speed, comprehension depth, essay structuring, and vocabulary. Afterwards, parents receive an in-depth scorecard and a personalized study roadmap with zero obligation.'
    },
    {
      q: 'My child struggles with essay writing and grammar rules. How is this different?',
      a: 'We never force mindless rote memorization of essays or rules. Our educators break down grammar using visual syntax formulas, real-world examples, and step-by-step essay blueprints. By teaching students how to outline ideas and use dynamic vocabulary, writing becomes intuitive and enjoyable.'
    },
    {
      q: 'Does the curriculum cover both Telangana (TS BIE) and Andhra Pradesh (BIEAP) board syllabi?',
      a: 'Yes, 100%! We provide dedicated tracks tailored specifically for Telangana State Board (TS BIE) and Andhra Pradesh Board (BIEAP) 1st & 2nd Year Intermediate Urdu, alongside CBSE, ICSE, and competitive entrance preparation (CUET, IELTS).'
    },
    {
      q: 'How do you prepare students to score 98+ marks in board Urdu?',
      a: 'Intermediate board Urdu requires precise presentation: correct question numbering, neat paragraph divisions, accurate phonetic transcription, proper formal letter formats, and rich vocabulary in annotations. We train students on exact board examiner marking rubrics and provide line-by-line answer critique.'
    },
    {
      q: 'What is the background of your Urdu faculty?',
      a: 'Our tutors are post-graduates in Urdu Literature and Linguistics, published writers, Cambridge CELTA/IELTS certified trainers, and former board paper evaluators with an average of 8+ years of dedicated teaching experience.'
    },
    {
      q: 'What study materials and notes are provided?',
      a: 'Enrolled students receive chapter summaries, line-by-line poetry annotations, grammar cheat sheets, model essay banks, letter formats, phonetic flashcards, and 10+ years of solved board question papers in downloadable high-res PDF format.'
    }
  ];

  return (
    <section id="faq" className="py-24 relative bg-[#E5ECF4] border-t border-b border-[#CBD5E1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle size={14} className="text-amber-700" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Know About Urdu
          </h2>
          <p className="text-slate-700 mt-3 text-base">
            Have questions before starting? Here are answers to common questions from parents and students.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="bg-[#DFE7F2] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] rounded-xl overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white hover:text-amber-700 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-[#D2DFEE] dark:bg-[#0D121F] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-amber-600 dark:bg-amber-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-slate-800 dark:text-slate-300 text-sm leading-relaxed border-t border-[#CAD8EA] dark:border-[#1E293B] pt-4 animate-fadeIn font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Box */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#D2DFEE] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] shadow-xs">
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Still have a specific question about Urdu?</h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 mb-4">Our language advisors are available 7 days a week to evaluate your child's goals and syllabus.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Speak with Urdu Academic Counselor
            </button>
            <a
              href="mailto:info@visdomwaves.com"
              className="px-5 py-2.5 rounded-xl bg-[#DFE7F2] hover:bg-[#D5E1EE] text-slate-900 font-bold text-xs border border-[#BAC9DC] transition-colors"
            >
              Email Support Team
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
