import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Scale, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Mail, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

/**
 * Reusable modal for displaying Terms of Service and Privacy Policy.
 * Supports switching between both legal documents via tabs,
 * smooth scrolling, and an optional "Accept & Continue" callback.
 */
export default function LegalTermsModal({ 
  isOpen, 
  onClose, 
  initialTab = 'terms', // 'terms' | 'privacy'
  onAccept = null 
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAcceptAndClose = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#151D30]/80 backdrop-blur-sm flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-xs">
              {activeTab === 'terms' ? <Scale size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hidden sm:inline-block">
                  Legal
                </span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                <Clock size={12} />
                <span>Last Updated: October 2026 • Visdom Waves MyMarks</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal modal"
            className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827] flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <FileText size={15} />
            <span>Terms of Service</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Lock size={15} />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 select-text">
          {activeTab === 'terms' ? (
            /* ======================================================== */
            /* TERMS OF SERVICE CONTENT */
            /* ======================================================== */
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200 text-xs">
                <p className="font-semibold">
                  Welcome to <strong className="text-indigo-700 dark:text-indigo-300">MyMarks</strong> (a division of Visdom Waves Pvt. Ltd.). By creating an account, registering for intermediate courses, or accessing educational services on this platform, you agree to comply with and be bound by the following terms.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">1</span>
                  Eligibility & Student Account Registration
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Users must be intermediate students (AP BIEAP, TS TSBIE, or equivalent educational boards), parents, guardians, or authorized educators. When signing up, you agree to provide truthful, accurate, and current information, including student name, board affiliation, junior college details, and valid contact information.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">2</span>
                  Academy Honor Code & Academic Policies
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  MyMarks is dedicated to academic excellence and student integrity. You agree to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Use academy tests, practice problems, and step-by-step solutions for personal learning and exam preparation only.</li>
                  <li>Maintain confidentiality of student login credentials and not share accounts across multiple unauthorized users.</li>
                  <li>Refrain from automated scraping, data extraction, or redistribution of course materials, mock exams, or video demos.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">3</span>
                  Intellectual Property & Proprietary Content
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All interactive formulas, curriculum roadmaps, subject blueprints, visual charts, and educational modules published on MyMarks are the exclusive intellectual property of Visdom Waves. Unauthorized reproduction, commercial distribution, or mirror hosting is strictly prohibited.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">4</span>
                  Consultations, Diagnostic Sessions & Bookings
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Free 1-on-1 diagnostic sessions and demo classes scheduled through our booking system are subject to mentor availability. We reserve the right to reschedule or modify sessions in consultation with the student or parent.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">5</span>
                  Limitation of Liability & Educational Disclaimers
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  While our study materials and roadmap predictions are curated by senior subject matter experts, MyMarks does not guarantee specific numerical marks in state intermediate board examinations. Academic outcomes depend on individual student dedication and continuous effort.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">6</span>
                  Governing Law & Legal Contact
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  These Terms are governed by and construed under the laws of India. For any questions regarding these Terms of Service, please contact our legal team at <a href="mailto:info@visdomwaves.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">info@visdomwaves.com</a>.
                </p>
              </section>
            </div>
          ) : (
            /* ======================================================== */
            /* PRIVACY POLICY CONTENT */
            /* ======================================================== */
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-xs">
                <p className="font-semibold">
                  At <strong className="text-emerald-700 dark:text-emerald-300">MyMarks</strong>, student privacy and data security are our highest priorities. We are committed to protecting all personal information shared by students, parents, and educators.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">1</span>
                  Information We Collect
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  To provide personalized academic roadmaps and secure authentication, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Student Profile Details:</strong> Full name, date of birth, optional avatar photo, and board registration details.</li>
                  <li><strong>Contact Credentials:</strong> Mobile phone number and email address for account verification and exam reminders.</li>
                  <li><strong>Academic Affiliation:</strong> Intermediate Board (AP / TS), academic year, junior college name, and hall ticket number.</li>
                  <li><strong>Guardian Information:</strong> Parent / guardian name and contact mobile number for progress reporting.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">2</span>
                  How We Use Student Information
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  The data collected is utilized solely to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Deliver customized chapter blueprints and subject difficulty analytics.</li>
                  <li>Facilitate login authentication and student session management.</li>
                  <li>Notify students and parents regarding milestone exam dates and study schedules.</li>
                  <li>Improve academic pedagogy and responsive interactive learning modules.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">3</span>
                  Zero Third-Party Data Selling
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  <strong>We never sell, rent, or monetize student or guardian information</strong> to third-party telemarketers or advertisers. Your academic journey belongs strictly to you.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">4</span>
                  Bank-Grade Encryption & Security Safeguards
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  All network communication is protected with 256-bit SSL encryption. Passwords and credentials are cryptographically hashed using standard security protocols.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">5</span>
                  Student & Parental Rights
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Students and parents may request profile review, data correction, or full deletion of their student profile at any time by emailing our Data Protection Team at <a href="mailto:privacy@visdomwaves.com" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">privacy@visdomwaves.com</a>.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151D30] flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 hidden sm:flex">
            <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Applies to all registered students on MyMarks.co.in</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>

            {onAccept && (
              <button
                type="button"
                onClick={handleAcceptAndClose}
                className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>I Accept & Agree</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
