import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function EnglishFaqSection({ onOpenBooking }) {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does the free 1-on-1 English diagnostic assessment work?',
      a: 'The free 45-minute assessment connects your student directly with a senior English language & literature specialist. We evaluate grammar mechanics, reading speed, comprehension depth, essay structuring, and vocabulary. Afterwards, parents receive an in-depth scorecard and a personalized study roadmap with zero obligation.'
    },
    {
      q: 'My child struggles with essay writing and grammar rules. How is this different?',
      a: 'We never force mindless rote memorization of essays or rules. Our educators break down grammar using visual syntax formulas, real-world examples, and step-by-step essay blueprints. By teaching students how to outline ideas and use dynamic vocabulary, writing becomes intuitive and enjoyable.'
    },
    {
      q: 'Does the curriculum cover both Telangana (TS BIE) and Andhra Pradesh (BIEAP) board syllabi?',
      a: 'Yes, 100%! We provide dedicated tracks tailored specifically for Telangana State Board (TS BIE) and Andhra Pradesh Board (BIEAP) 1st & 2nd Year Intermediate English, alongside CBSE, ICSE, and competitive entrance preparation (CUET, IELTS).'
    },
    {
      q: 'How do you prepare students to score 98+ marks in board English?',
      a: 'Intermediate board English requires precise presentation: correct question numbering, neat paragraph divisions, accurate phonetic transcription, proper formal letter formats, and rich vocabulary in annotations. We train students on exact board examiner marking rubrics and provide line-by-line answer critique.'
    },
    {
      q: 'What is the background of your English faculty?',
      a: 'Our tutors are post-graduates in English Literature and Linguistics, published writers, Cambridge CELTA/IELTS certified trainers, and former board paper evaluators with an average of 8+ years of dedicated teaching experience.'
    },
    {
      q: 'What study materials and notes are provided?',
      a: 'Enrolled students receive chapter summaries, line-by-line poetry annotations, grammar cheat sheets, model essay banks, letter formats, phonetic flashcards, and 10+ years of solved board question papers in downloadable high-res PDF format.'
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 relative bg-[#E5ECF4] dark:bg-[#0B0F19] border-t border-b border-[#CBD5E1] dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle size={14} className="text-blue-600 dark:text-blue-400" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Know About English
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2.5 text-sm sm:text-base font-normal">
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
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-[#D2DFEE] dark:bg-[#0D121F] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-600 dark:bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-slate-800 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-[#CAD8EA] dark:border-[#1E293B] pt-4 animate-fadeIn font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Contact Box */}
        <div className="mt-10 sm:mt-12 text-center p-6 rounded-2xl bg-[#D2DFEE] dark:bg-[#131927] border border-[#BAC9DC] dark:border-[#243048] shadow-xs">
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">Still have a specific question about English?</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 font-normal">Our language advisors are available 7 days a week to evaluate your child's goals and syllabus.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Speak with English Academic Counselor
            </button>
            <a
              href="mailto:support@mathslearningacademy.com"
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Email Support Team
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
