import React, { useEffect } from 'react';
import { ShieldCheck, Clock, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicyPage() {
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
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xs">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Privacy Policy</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
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
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-sm leading-relaxed shadow-xs">
          <p className="font-semibold">
            At <strong className="text-emerald-700 dark:text-emerald-300">MyMarks</strong> (a division of Visdom Waves Pvt. Ltd.), student privacy and data security are our highest priorities. We are committed to protecting all personal information shared by students, parents, and educators.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">1</span>
              Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              To provide personalized academic roadmaps and secure authentication, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li><strong>Student Profile Details:</strong> Full name, date of birth, optional avatar photo, and board registration details.</li>
              <li><strong>Contact Credentials:</strong> Mobile phone number and email address for account verification and exam reminders.</li>
              <li><strong>Academic Affiliation:</strong> Intermediate Board (AP / TS), academic year, junior college name, and hall ticket number.</li>
              <li><strong>Guardian Information:</strong> Parent / guardian name and contact mobile number for progress reporting.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">2</span>
              How We Use Student Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              The data collected is utilized solely to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Deliver customized chapter blueprints and subject difficulty analytics.</li>
              <li>Facilitate login authentication and student session management.</li>
              <li>Notify students and parents regarding milestone exam dates and study schedules.</li>
              <li>Improve academic pedagogy and responsive interactive learning modules.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">3</span>
              Zero Third-Party Data Selling
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              <strong>We never sell, rent, or monetize student or guardian information</strong> to third-party telemarketers or advertisers. Your academic journey belongs strictly to you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">4</span>
              Bank-Grade Encryption & Security Safeguards
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              All network communication is protected with 256-bit SSL encryption. Passwords and credentials are cryptographically hashed using standard security protocols.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">5</span>
              Student & Parental Rights
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Students and parents may request profile review, data correction, or full deletion of their student profile at any time by emailing our Data Protection Team at <a href="mailto:privacy@visdomwaves.com" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">privacy@visdomwaves.com</a>.
            </p>
          </section>

        </div>

        {/* Footer info banner */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Applies to all registered students on MyMarks.co.in</span>
          </div>
          <a
            href="mailto:privacy@visdomwaves.com"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Mail size={14} />
            <span>privacy@visdomwaves.com</span>
          </a>
        </div>

      </div>
    </div>
  );
}
