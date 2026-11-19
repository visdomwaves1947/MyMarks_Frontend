import React, { useEffect } from 'react';
import { Scale, Clock, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-xs">
              <Scale size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Terms of Service</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  Legal
                </span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                <Clock size={13} />
                <span>Last Updated: October 2026 • Visdom Waves MyMarks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-sm leading-relaxed shadow-xs">
          <p className="font-semibold">
            Welcome to <strong className="text-indigo-700 dark:text-indigo-300">MyMarks</strong> (a division of Visdom Waves Pvt. Ltd.). By creating an account, registering for intermediate courses, or accessing educational services on this platform, you agree to comply with and be bound by the following terms.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">1</span>
              Eligibility & Student Account Registration
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Users must be intermediate students (AP BIEAP, TS TSBIE, or equivalent educational boards), parents, guardians, or authorized educators. When signing up, you agree to provide truthful, accurate, and current information, including student name, board affiliation, junior college details, and valid contact information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">2</span>
              Academy Honor Code & Academic Policies
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              MyMarks is dedicated to academic excellence and student integrity. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Use academy tests, practice problems, and step-by-step solutions for personal learning and exam preparation only.</li>
              <li>Maintain confidentiality of student login credentials and not share accounts across multiple unauthorized users.</li>
              <li>Refrain from automated scraping, data extraction, or redistribution of course materials, mock exams, or video demos.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">3</span>
              Intellectual Property & Proprietary Content
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              All interactive formulas, curriculum roadmaps, subject blueprints, visual charts, and educational modules published on MyMarks are the exclusive intellectual property of Visdom Waves. Unauthorized reproduction, commercial distribution, or mirror hosting is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">4</span>
              Consultations, Diagnostic Sessions & Bookings
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Free 1-on-1 diagnostic sessions and demo classes scheduled through our booking system are subject to mentor availability. We reserve the right to reschedule or modify sessions in consultation with the student or parent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">5</span>
              Limitation of Liability & Educational Disclaimers
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              While our study materials and roadmap predictions are curated by senior subject matter experts, MyMarks does not guarantee specific numerical marks in state intermediate board examinations. Academic outcomes depend on individual student dedication and continuous effort.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">6</span>
              Governing Law & Legal Contact
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              These Terms are governed by and construed under the laws of India. For any questions regarding these Terms of Service, please contact our legal team at <a href="mailto:info@visdomwaves.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">info@visdomwaves.com</a>.
            </p>
          </section>

        </div>

        {/* Footer info banner */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Applies to all registered students on MyMarks.co.in</span>
          </div>
          <a
            href="mailto:info@visdomwaves.com"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Mail size={14} />
            <span>info@visdomwaves.com</span>
          </a>
        </div>

      </div>
    </div>
  );
}
