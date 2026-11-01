import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Landmark,
  Maximize2,
  Minimize2,
  ArrowRight,
  Lock,
  Star,
  Users,
  Compass,
  Zap,
  ChevronDown
} from 'lucide-react';
import { submitEnrollmentRequest } from '../services/api';

export default function BookingModal({ isOpen, onClose, preselectedTrack = '' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentStep, setCurrentStep] = useState('form'); // 'form' | 'confirmed'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showBenefitsMobile, setShowBenefitsMobile] = useState(false);

  // Subject detection to adapt icon and subject title
  const detectedSubject = React.useMemo(() => {
    const text = (preselectedTrack || window.location.pathname).toLowerCase();
    if (text.includes('history')) return { name: 'History', icon: Landmark };
    if (text.includes('math')) return { name: 'Mathematics', icon: Compass };
    if (text.includes('botany')) return { name: 'Botany', icon: BookOpen };
    if (text.includes('physics')) return { name: 'Physics', icon: Zap };
    if (text.includes('chemistry')) return { name: 'Chemistry', icon: Sparkles };
    if (text.includes('zoology')) return { name: 'Zoology', icon: BookOpen };
    if (text.includes('commerce')) return { name: 'Commerce', icon: Landmark };
    if (text.includes('english')) return { name: 'English', icon: BookOpen };
    if (text.includes('hindi')) return { name: 'Hindi', icon: BookOpen };
    if (text.includes('telugu')) return { name: 'Telugu', icon: BookOpen };
    if (text.includes('urdu')) return { name: 'Urdu', icon: BookOpen };
    if (text.includes('sanskrit')) return { name: 'Sanskrit', icon: BookOpen };
    return { name: 'Academic', icon: GraduationCap };
  }, [preselectedTrack]);

  const [formData, setFormData] = useState({
    studentName: '',
    parentEmail: '',
    parentPhone: '',
    gradeLevel: 'Intermediate 1st Year (Junior Inter)',
    goalArea: preselectedTrack || `Complete ${detectedSubject.name} Chapters & Doubt Support`,
    studyGoal: 'Full Syllabus Access & Doubt Support',
  });

  // Keep goalArea synced when preselectedTrack changes
  useEffect(() => {
    if (preselectedTrack) {
      setFormData(prev => ({
        ...prev,
        goalArea: preselectedTrack
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        goalArea: `Complete ${detectedSubject.name} Chapters & Doubt Support`
      }));
    }
  }, [preselectedTrack, detectedSubject.name]);

  const SubjectIcon = detectedSubject.icon;

  if (!isOpen) return null;

  // Saves the request for the team to follow up. No payment is taken here.
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (formData.parentPhone.length !== 10) {
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      await submitEnrollmentRequest({ ...formData, subjectName: detectedSubject.name });
      setCurrentStep('confirmed');
    } catch (err) {
      setSubmitError(err.message || 'We could not send your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10 && val.startsWith('91')) {
      val = val.slice(2);
    } else if (val.length > 10 && val.startsWith('0')) {
      val = val.slice(1);
    }
    val = val.slice(0, 10);
    setFormData(prev => ({ ...prev, parentPhone: val }));
  };

  const handleResetAndClose = () => {
    setCurrentStep('form');
    setSubmitError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-5 lg:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn font-sans">
      {/* Modal Container */}
      <div 
        className={`relative w-full ${currentStep === 'confirmed' ? 'bg-[#0A1124]' : 'bg-[#0B0F19]'} border-0 sm:border border-slate-800/90 shadow-[0_20px_70px_rgba(0,0,0,0.6)] text-left overflow-hidden flex flex-col transition-all duration-300 font-sans ${
          isFullscreen 
            ? 'h-full w-full rounded-none' 
            : currentStep === 'confirmed'
              ? 'max-w-2xl h-full sm:h-auto max-h-[100dvh] sm:max-h-[96vh] rounded-none sm:rounded-3xl'
              : 'max-w-5xl xl:max-w-6xl h-full sm:h-auto max-h-[100dvh] sm:max-h-[96vh] lg:max-h-[92vh] rounded-none sm:rounded-2xl lg:rounded-3xl'
        }`}
      >
        {/* Top Floating Control Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2">
          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md shadow-xs"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer backdrop-blur-md shadow-xs hover:rotate-90 duration-200"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Enrollment Request Form */}
        {currentStep !== 'confirmed' ? (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
            {/* Left Panel: Hero & Value Proposition (5 Cols on Tablet & Laptop) */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#0B0F19] via-[#0F172A] to-[#0B0F19] p-3.5 xs:p-4 sm:p-6 md:p-5 lg:p-7 xl:p-8 flex flex-col justify-between relative overflow-hidden">
              {/* Animated Floating Gradient Orbs */}
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

              <div className="relative z-10">
                {/* Special Board Offer Badge with Price & Clearance for Close Button */}
                <div className="flex items-center pr-12 sm:pr-0 mb-2 sm:mb-2.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[10px] xs:text-[11px] sm:text-xs font-bold shadow-sm max-w-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping shrink-0" />
                    <span>Board Offer • ₹299 per Subject</span>
                    <span className="line-through text-slate-400 text-[9.5px] xs:text-[10px] hidden xs:inline">₹999</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black shrink-0">70% OFF</span>
                  </div>
                </div>

                {/* Subject Category Pill - Ultra-Responsive Dual Badge */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 max-w-full">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-900/50 border border-blue-400/40 shadow-xs">
                    <SubjectIcon size={13} className="text-blue-400 shrink-0" />
                    <span className="text-white font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
                      {detectedSubject.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-800/40 text-cyan-300 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                    Board Mastery Pack
                  </span>
                </div>

                {/* Main Heading in Website Outfit Font */}
                <h2 className="text-lg xs:text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-black text-white tracking-tight leading-tight sm:leading-snug mb-1.5 sm:mb-2.5 break-words">
                  Enroll in {detectedSubject.name} Course & Doubt Portal
                </h2>

                <p className="text-slate-300 text-[11.5px] sm:text-xs md:text-xs lg:text-sm leading-relaxed mb-3 sm:mb-4 font-medium">
                  Get access to all syllabus chapters, curated study notes, previous 10-year question banks, and dedicated faculty doubt clarifications.
                </p>

                {/* Mobile Quick Preview Row & Benefits Toggle Button */}
                <div className="md:hidden mb-4">
                  <div className="flex flex-wrap gap-1.5 mb-2.5 text-[10px] font-semibold text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-800/40 text-blue-300">✓ All Chapters</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-800/40 text-blue-300">✓ Dedicated Doubts</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-800/40 text-blue-300">✓ Notes & Q-Bank</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-950/70 border border-blue-800/40 text-blue-300">✓ 100/100 Guide</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBenefitsMobile(!showBenefitsMobile)}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px] font-medium flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="text-blue-400 font-semibold">
                      {showBenefitsMobile ? 'Hide Course Inclusions' : 'View What Is Included in Course (4 Perks)'}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showBenefitsMobile ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* What You Get Checklist (Always visible on Tablet & Laptop, Collapsible on Mobile) */}
                <div className={`space-y-2.5 sm:space-y-3.5 mb-4 sm:mb-6 ${showBenefitsMobile ? 'block' : 'hidden md:block'}`}>
                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Full Access to All Chapters & Lessons</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium">Access to all chapters, core concept deep-dives & board blueprint lessons.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Dedicated Faculty Doubt Clarifications</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium">Stuck on tough questions or numericals? Submit doubts anytime for step-by-step faculty guidance.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Full Chapter Notes & 10-Year Question Bank</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium">Download complete chapter summary sheets, previous 10-year solved questions & model papers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Board Exam 100/100 Presentation Guide</h4>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium">Learn how top scorers structure and present high-scoring answers to secure maximum marks.</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown Card */}
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block">Course Fee</span>
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-black text-white">₹299</span>
                        <span className="text-xs text-slate-400 line-through">₹999</span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400">Save ₹700</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9.5px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        ₹299 Per Subject
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-1 font-medium">All Chapters + Doubt Access</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Social Proof */}
              <div className="hidden sm:flex relative z-10 pt-3 sm:pt-4 mt-4 sm:mt-6 border-t border-slate-800/80 items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-blue-400" />
                  <span><strong className="text-white">15,000+</strong> students enrolled</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star size={13} className="fill-amber-400" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Interactive Form (7 Cols on Tablet & Laptop) */}
            <div className="md:col-span-7 bg-[#0F172A]/90 p-4 sm:p-6 md:p-5 lg:p-7 xl:p-8 flex flex-col justify-center relative">
              <div className="max-w-xl mx-auto w-full">
                
                <div className="animate-fadeIn">
                    <div className="mb-4 sm:mb-5">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-0.5 sm:mb-1">
                        Student Details & Course Enrollment
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                        Send your details and our team will contact you to complete your {detectedSubject.name} enrollment for ₹299. No payment is taken on this form.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitRequest} className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                      {/* Student Name */}
                      <div>
                        <label className="block text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                          <User size={13} className="text-blue-400" />
                          <span>Student Full Name</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                          className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-xs sm:text-sm shadow-inner"
                        />
                      </div>

                      {/* Email & Phone Dual Inputs */}
                      {/* Email & Phone Dual Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                        <div>
                          <label className="block text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                            <Mail size={13} className="text-blue-400" />
                            <span>Student / Parent Email</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="parent@example.com"
                            value={formData.parentEmail}
                            onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                            className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-xs sm:text-sm shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center justify-between text-xs sm:text-sm">
                            <span className="flex items-center gap-1.5">
                              <Phone size={13} className="text-blue-400" />
                              <span>Phone / WhatsApp</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {formData.parentPhone ? `${formData.parentPhone.length}/10` : '10 digits'}
                            </span>
                          </label>
                          <input
                            type="tel"
                            required
                            inputMode="numeric"
                            maxLength={10}
                            minLength={10}
                            pattern="[0-9]{10}"
                            title="Please enter exactly 10 digits"
                            placeholder="10-digit mobile number"
                            value={formData.parentPhone}
                            onChange={handlePhoneChange}
                            className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-xs sm:text-sm shadow-inner"
                          />
                        </div>
                      </div>

                      {/* Grade & Target Study Goal Dual Selects */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                        <div>
                          <label className="block text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                            <GraduationCap size={13} className="text-blue-400" />
                            <span>Current Grade / Year</span>
                          </label>
                          <select
                            value={formData.gradeLevel}
                            onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                            className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-xs sm:text-sm cursor-pointer"
                          >
                            <option>Intermediate 1st Year (Junior Inter)</option>
                            <option>Intermediate 2nd Year (Senior Inter)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                            <Sparkles size={13} className="text-blue-400" />
                            <span>Access Mode & Study Goal</span>
                          </label>
                          <select
                            value={formData.studyGoal}
                            onChange={(e) => setFormData({ ...formData, studyGoal: e.target.value })}
                            className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-xs sm:text-sm cursor-pointer"
                          >
                            <option>Full Syllabus Access & Doubt Support</option>
                            <option>Target 100/100 Board Exam Score Booster</option>
                            <option>Concept Clarity & Chapter Revisions</option>
                            <option>Important Questions & Doubt Solving</option>
                          </select>
                        </div>
                      </div>

                      {/* Primary Focus Area / Challenge */}
                      <div>
                        <label className="block text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                          <BookOpen size={13} className="text-blue-400" />
                          <span>Primary Chapter Focus or Current Doubts</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Chapter Doubts, Numerical Problems, Board Blueprint..."
                          value={formData.goalArea}
                          onChange={(e) => setFormData({ ...formData, goalArea: e.target.value })}
                          className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-xs sm:text-sm shadow-inner"
                        />
                      </div>

                      {/* Price Summary Pill */}
                      <div className="p-2.5 sm:p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-[11.5px] sm:text-xs">
                        <span className="text-blue-200 font-medium">
                          Enrollment Fee: <strong className="text-white font-bold">₹299 per Subject</strong> (All Inclusive)
                        </span>
                        <span className="text-emerald-400 text-[10.5px] sm:text-[11px] font-semibold">Pay after our team contacts you</span>
                      </div>

                      {submitError && (
                        <p role="alert" className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                          {submitError}
                        </p>
                      )}

                      {/* Submit Button with Website Signature Blue Gradient */}
                      <div className="pt-1 sm:pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <span>{isSubmitting ? 'Sending Your Request...' : 'Send Enrollment Request'}</span>
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11px] text-slate-400 text-center font-medium pt-0.5">
                        <Lock size={12} className="text-emerald-400" />
                        <span>No payment is taken here • Zero hidden charges</span>
                      </div>
                    </form>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Request received */
          <div className="relative w-full flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center animate-fadeIn font-sans bg-gradient-to-br from-[#0c1427] via-[#0f1b36] to-[#070b18]">
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Request Received, {formData.studentName || 'Student'}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                  Our team will contact you on {formData.parentPhone} with the next steps for {detectedSubject.name}.
                </p>
              </div>
              <p className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-medium">
                No payment has been taken. Course access starts after our team confirms your enrollment.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
      )}

      </div>
    </div>
  );
}
