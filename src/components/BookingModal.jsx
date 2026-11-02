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
  Zap
} from 'lucide-react';
import { submitEnrollmentRequest } from '../services/api';
import useCatalog from '../hooks/useCatalog';
import { formatPrice } from '../utils/courseImage';

// Used only when the form opens from an old subject page with no course behind it
const DEFAULT_PRICE = 299;
const DEFAULT_OLD_PRICE = 999;

export default function BookingModal({ isOpen, onClose, preselectedTrack = '', course = null }) {
  const { courses } = useCatalog();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentStep, setCurrentStep] = useState('form'); // 'form' | 'confirmed'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [mobileTab, setMobileTab] = useState('matter'); // 'matter' (Course Highlights) | 'form' (Student Details)

  // Subject detection to adapt icon and subject title
  const guessedSubject = React.useMemo(() => {
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

  const selectedCourse =
    course ||
    courses.find((item) => item.name === guessedSubject.name || item.subject === guessedSubject.name) ||
    null;

  const detectedSubject = selectedCourse
    ? { name: selectedCourse.name, icon: guessedSubject.name === 'Academic' ? BookOpen : guessedSubject.icon }
    : guessedSubject;

  const price = selectedCourse ? selectedCourse.price : DEFAULT_PRICE;
  const oldPrice = selectedCourse ? selectedCourse.oldPrice : DEFAULT_OLD_PRICE;
  const hasDiscount = oldPrice > price;
  const priceText = formatPrice(price ?? 0);
  const oldPriceText = formatPrice(oldPrice ?? 0);
  const savingText = formatPrice((oldPrice ?? 0) - (price ?? 0));
  const percentOff = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

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

  // Reset tab to matter when opening modal
  useEffect(() => {
    if (isOpen) {
      setMobileTab('matter');
    }
  }, [isOpen]);

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
      await submitEnrollmentRequest({
        ...formData,
        subjectName: detectedSubject.name,
        courseSlug: selectedCourse?.slug,
      });
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
    setMobileTab('matter');
    setSubmitError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden p-2 sm:p-3 md:p-5 lg:p-6 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xl animate-fadeIn font-sans">
      {/* Modal Container */}
      <div 
        className={`relative w-full mx-auto ${
          currentStep === 'confirmed' 
            ? 'bg-[#DFE7F2] dark:!bg-[#0A1124]' 
            : 'bg-[#DFE7F2] dark:!bg-[#0B0F19]'
        } border-0 sm:border border-[#BAC9DC] dark:!border-slate-800/90 shadow-[0_20px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.6)] text-left overflow-hidden flex flex-col transition-all duration-300 font-sans ${
          isFullscreen 
            ? 'h-full w-full rounded-none' 
            : currentStep === 'confirmed'
              ? 'max-w-2xl h-full sm:h-auto max-h-[100dvh] sm:max-h-[96vh] rounded-none sm:rounded-3xl'
              : 'max-w-5xl xl:max-w-6xl h-full sm:h-auto max-h-[100dvh] sm:max-h-[96vh] lg:max-h-[92vh] rounded-none sm:rounded-2xl lg:rounded-3xl'
        }`}
      >
        {/* Confirmation Close Button (Floating) */}
        {currentStep === 'confirmed' && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
            <button
              onClick={handleResetAndClose}
              className="p-1.5 sm:p-2 rounded-xl bg-[#D2DFEE] hover:bg-[#C5D5E7] text-slate-700 hover:text-slate-950 border border-[#BAC9DC] dark:!bg-slate-900/90 dark:hover:!bg-slate-800 dark:!text-slate-300 dark:hover:!text-white dark:!border-slate-700/60 transition-all cursor-pointer backdrop-blur-md shadow-xs hover:rotate-90 duration-200"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Main Top Header Bar (Safe Layout with Zero Close Button Overlap) */}
        {currentStep !== 'confirmed' && (
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-[#BAC9DC] dark:!border-slate-800/80 bg-[#DCE7F4]/90 dark:!bg-[#0B0F19]/90 backdrop-blur-md z-30 shrink-0 w-full overflow-hidden">
            {/* Header Badges */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/90 border border-blue-300/80 text-blue-900 dark:!bg-blue-950/80 dark:!border-blue-500/40 dark:!text-blue-300 text-[10.5px] sm:text-xs font-bold shadow-xs shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping shrink-0" />
                <span>Board Offer • {priceText} per Subject</span>
                {hasDiscount && (
                  <>
                    <span className="line-through text-slate-500 dark:!text-slate-400 text-[9.5px] hidden xs:inline">{oldPriceText}</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black shrink-0">{percentOff}% OFF</span>
                  </>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100/80 border border-blue-300/80 text-blue-950 dark:!bg-blue-900/50 dark:!border-blue-400/40 dark:!text-white text-[11px] sm:text-xs font-bold shadow-xs shrink-0">
                <SubjectIcon size={13} className="text-blue-600 dark:!text-blue-400 shrink-0" />
                <span className="uppercase">{detectedSubject.name}</span>
              </div>
            </div>

            {/* Controls: Fullscreen Toggle & Close Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 sm:p-2 rounded-xl bg-[#D2DFEE] hover:bg-[#C5D5E7] text-slate-700 hover:text-slate-950 border border-[#BAC9DC] dark:!bg-slate-900/90 dark:hover:!bg-slate-800 dark:!text-slate-300 dark:hover:!text-white dark:!border-slate-700/60 transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md shadow-xs"
                title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                <span className="hidden md:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>

              <button
                onClick={handleResetAndClose}
                className="p-1.5 sm:p-2 rounded-xl bg-[#D2DFEE] hover:bg-[#C5D5E7] text-slate-700 hover:text-slate-950 border border-[#BAC9DC] dark:!bg-slate-900/90 dark:hover:!bg-slate-800 dark:!text-slate-300 dark:hover:!text-white dark:!border-slate-700/60 transition-all cursor-pointer backdrop-blur-md shadow-xs hover:rotate-90 duration-200"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Segmented Tab Switcher (Visible ONLY on Mobile < md) */}
        {currentStep !== 'confirmed' && (
          <div className="md:hidden px-3.5 py-2 bg-[#D2DFEE]/70 dark:!bg-[#0A1124] border-b border-[#BAC9DC] dark:!border-slate-800/80 flex gap-2 shrink-0 w-full overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileTab('matter')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileTab === 'matter'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                  : 'bg-[#EBF0F7] dark:!bg-slate-900/80 text-slate-700 dark:!text-slate-300 border border-[#BAC9DC]/80 dark:!border-slate-700/60 hover:bg-white'
              }`}
            >
              <Sparkles size={14} className={mobileTab === 'matter' ? 'text-amber-300' : 'text-blue-600 dark:!text-blue-400'} />
              <span>Course Highlights</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                mobileTab === 'matter' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800 dark:!bg-blue-900/60 dark:!text-blue-300'
              }`}>
                4 Perks
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileTab('form')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mobileTab === 'form'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40'
                  : 'bg-[#EBF0F7] dark:!bg-slate-900/80 text-slate-700 dark:!text-slate-300 border border-[#BAC9DC]/80 dark:!border-slate-700/60 hover:bg-white'
              }`}
            >
              <GraduationCap size={14} />
              <span>Enrollment Form</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                mobileTab === 'form' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-100 text-emerald-800 dark:!bg-emerald-950 dark:!text-emerald-300'
              }`}>
                {priceText}
              </span>
            </button>
          </div>
        )}

        {/* Course Highlights & Enrollment Form Layout */}
        {currentStep !== 'confirmed' ? (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto overflow-x-hidden divide-y md:divide-y-0 md:divide-x divide-[#BAC9DC] dark:!divide-slate-800/80 w-full">
            {/* Left Panel: Hero & Value Proposition (Image 2 Matter) */}
            <div className={`${mobileTab === 'matter' ? 'block' : 'hidden'} md:block md:col-span-5 bg-gradient-to-br from-[#DCE7F4] via-[#E8F0F9] to-[#DFE7F2] dark:!bg-none dark:!bg-[#0B0F19] dark:bg-gradient-to-br dark:from-[#0B0F19] dark:via-[#0F172A] dark:to-[#0B0F19] p-4 sm:p-6 md:p-5 lg:p-7 xl:p-8 flex flex-col justify-start md:justify-between relative overflow-y-auto overflow-x-hidden w-full min-w-0`}>
              {/* Background Decorative Blur Orbs (Strictly clipped to prevent horizontal shift) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl animate-pulse" />
              </div>

              <div className="relative z-10 w-full min-w-0">
                {/* Subject Category Pill - Ultra-Responsive Dual Badge */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 max-w-full">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100/80 border border-blue-300/80 text-blue-950 dark:!bg-blue-900/50 dark:!border-blue-400/40 dark:!text-white shadow-xs">
                    <SubjectIcon size={13} className="text-blue-600 dark:!text-blue-400 shrink-0" />
                    <span className="text-blue-950 dark:!text-white font-extrabold text-[11px] sm:text-xs tracking-wider uppercase">
                      {detectedSubject.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 dark:!bg-blue-950/70 dark:!border-blue-800/40 dark:!text-cyan-300 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                    Board Mastery Pack
                  </span>
                </div>

                {/* Main Heading in Website Outfit Font */}
                <h2 className="text-xl sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl font-black text-slate-950 dark:!text-white tracking-tight leading-tight sm:leading-snug mb-2 sm:mb-2.5 break-words">
                  Enroll in {detectedSubject.name} Course & Doubt Portal
                </h2>

                <p className="text-slate-700 dark:!text-slate-300 text-xs sm:text-xs md:text-xs lg:text-sm leading-relaxed mb-4 sm:mb-6 font-medium">
                  Get access to all syllabus chapters, curated study notes, previous 10-year question banks, and dedicated faculty doubt clarifications.
                </p>

                {/* What You Get Checklist: All 4 Inclusions Fully Detailed */}
                <div className="space-y-3 sm:space-y-3.5 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-100 text-blue-600 border border-blue-300/80 dark:!bg-blue-500/15 dark:!text-blue-400 dark:!border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:!text-white">Full Access to All Chapters & Lessons</h4>
                      <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:!text-slate-400 font-medium">Access to all chapters, core concept deep-dives & board blueprint lessons.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-100 text-blue-600 border border-blue-300/80 dark:!bg-blue-500/15 dark:!text-blue-400 dark:!border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:!text-white">Dedicated Faculty Doubt Clarifications</h4>
                      <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:!text-slate-400 font-medium">Stuck on tough questions or numericals? Submit doubts anytime for step-by-step faculty guidance.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-100 text-blue-600 border border-blue-300/80 dark:!bg-blue-500/15 dark:!text-blue-400 dark:!border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:!text-white">Full Chapter Notes & 10-Year Question Bank</h4>
                      <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:!text-slate-400 font-medium">Download complete chapter summary sheets, previous 10-year solved questions & model papers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-100 text-blue-600 border border-blue-300/80 dark:!bg-blue-500/15 dark:!text-blue-400 dark:!border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:!text-white">Board Exam 100/100 Presentation Guide</h4>
                      <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:!text-slate-400 font-medium">Learn how top scorers structure and present high-scoring answers to secure maximum marks.</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdown Card */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#D2DFEE]/90 border border-[#BAC9DC] dark:!bg-slate-900/90 dark:!border-slate-800 shadow-md relative overflow-hidden mb-3 sm:mb-0">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-slate-600 dark:!text-slate-400 block">Course Fee</span>
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5">
                        <span data-testid="enrollment-price" className="text-2xl sm:text-3xl font-black text-slate-950 dark:!text-white">{priceText}</span>
                        {hasDiscount && (
                          <>
                            <span className="text-xs text-slate-500 dark:!text-slate-400 line-through">{oldPriceText}</span>
                            <span className="text-[10.5px] sm:text-[11px] font-bold text-emerald-700 dark:!text-emerald-400">Save {savingText}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] sm:text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-100 border border-blue-300/80 text-blue-800 dark:!bg-blue-500/15 dark:!text-blue-400 dark:!border-blue-500/30">
                        {priceText} Per Subject
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-600 dark:!text-slate-400 block mt-1 font-medium">All Chapters + Doubt Access</span>
                    </div>
                  </div>
                </div>

                {/* Mobile CTA to proceed directly to enrollment form */}
                <div className="md:hidden pt-3 pb-1">
                  <button
                    type="button"
                    onClick={() => setMobileTab('form')}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <span>Continue to Enrollment Form ({priceText})</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Bottom Social Proof - Always Visible */}
              <div className="flex relative z-10 pt-3 sm:pt-4 mt-3 sm:mt-6 border-t border-[#BAC9DC]/80 dark:!border-slate-800/80 items-center justify-between text-xs text-slate-600 dark:!text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-blue-600 dark:!text-blue-400" />
                  <span><strong className="text-slate-950 dark:!text-white">15,000+</strong> students enrolled</span>
                </div>
                <div className="flex items-center gap-1 text-amber-600 dark:!text-amber-400 font-bold">
                  <Star size={13} className="fill-amber-500 text-amber-500" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Enrollment Form */}
            <div className={`${mobileTab === 'form' ? 'block' : 'hidden'} md:block md:col-span-7 bg-[#EBF0F7] dark:!bg-[#0F172A]/90 p-4 sm:p-6 md:p-5 lg:p-7 xl:p-8 flex flex-col justify-start md:justify-center relative overflow-y-auto overflow-x-hidden w-full min-w-0`}>
              <div className="max-w-xl mx-auto w-full min-w-0">
                
                {/* Mobile Quick Course Info Banner inside Form */}
                <div className="md:hidden mb-3.5 p-2.5 rounded-xl bg-[#D2DFEE]/90 border border-[#BAC9DC] dark:!bg-slate-900/90 dark:!border-slate-800 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:!bg-blue-900/50 text-blue-600 dark:!text-blue-400 shrink-0">
                      <SubjectIcon size={15} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-950 dark:!text-white leading-tight block">
                        {detectedSubject.name} Board Mastery Pack
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:!text-emerald-400 font-extrabold">
                        {priceText} All-Inclusive{hasDiscount ? ` • Save ${savingText}` : ''}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileTab('matter')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-xs hover:bg-blue-500 cursor-pointer shrink-0 transition-colors"
                  >
                    View 4 Perks
                  </button>
                </div>

                {/* Student Details & Course Enrollment Form */}
                <div className="animate-fadeIn">
                  <div className="mb-4 sm:mb-5">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-950 dark:!text-white mb-0.5 sm:mb-1">
                      Student Details & Course Enrollment
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:!text-slate-400 font-medium">
                      Send your details and our team will contact you to complete your {detectedSubject.name} enrollment for {priceText}. No payment is taken on this form.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitRequest} className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    {/* Student Name */}
                    <div>
                      <label className="block text-slate-800 dark:!text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                        <User size={13} className="text-blue-600 dark:!text-blue-400" />
                        <span>Student Full Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#D2DFEE] border border-[#B8CADF] rounded-xl text-slate-950 placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 focus:bg-white dark:!bg-slate-900/90 dark:!border-slate-700/80 dark:!text-white dark:placeholder:text-slate-500 dark:focus:!bg-slate-900 dark:focus:ring-blue-500/50 dark:focus:border-blue-500 transition-all text-xs sm:text-sm shadow-2xs"
                      />
                    </div>

                    {/* Email & Phone Dual Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                      <div>
                        <label className="block text-slate-800 dark:!text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                          <Mail size={13} className="text-blue-600 dark:!text-blue-400" />
                          <span>Student / Parent Email</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="parent@example.com"
                          value={formData.parentEmail}
                          onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                          className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#D2DFEE] border border-[#B8CADF] rounded-xl text-slate-950 placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 focus:bg-white dark:!bg-slate-900/90 dark:!border-slate-700/80 dark:!text-white dark:placeholder:text-slate-500 dark:focus:!bg-slate-900 dark:focus:ring-blue-500/50 dark:focus:border-blue-500 transition-all text-xs sm:text-sm shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-800 dark:!text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center justify-between text-xs sm:text-sm">
                          <span className="flex items-center gap-1.5">
                            <Phone size={13} className="text-blue-600 dark:!text-blue-400" />
                            <span>Phone / WhatsApp</span>
                          </span>
                          <span className="text-[10px] text-slate-500 dark:!text-slate-400 font-normal">
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
                          className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#D2DFEE] border border-[#B8CADF] rounded-xl text-slate-950 placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 focus:bg-white dark:!bg-slate-900/90 dark:!border-slate-700/80 dark:!text-white dark:placeholder:text-slate-500 dark:focus:!bg-slate-900 dark:focus:ring-blue-500/50 dark:focus:border-blue-500 transition-all text-xs sm:text-sm shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Grade & Target Study Goal Dual Selects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                      <div>
                        <label className="block text-slate-800 dark:!text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                          <GraduationCap size={13} className="text-blue-600 dark:!text-blue-400" />
                          <span>Current Grade / Year</span>
                        </label>
                        <select
                          value={formData.gradeLevel}
                          onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#D2DFEE] border border-[#B8CADF] rounded-xl text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 focus:bg-white dark:!bg-slate-900/90 dark:!border-slate-700/80 dark:!text-white dark:focus:!bg-slate-900 transition-all text-xs sm:text-sm cursor-pointer"
                        >
                          <option className="bg-white text-slate-900 dark:!bg-slate-900 dark:!text-white">Intermediate 1st Year (Junior Inter)</option>
                          <option className="bg-white text-slate-900 dark:!bg-slate-900 dark:!text-white">Intermediate 2nd Year (Senior Inter)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-800 dark:!text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                          <Sparkles size={13} className="text-blue-600 dark:!text-blue-400" />
                          <span>Access Mode & Study Goal</span>
                        </label>
                        <select
                          value={formData.studyGoal}
                          onChange={(e) => setFormData({ ...formData, studyGoal: e.target.value })}
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#D2DFEE] border border-[#B8CADF] rounded-xl text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 focus:bg-white dark:!bg-slate-900/90 dark:!border-slate-700/80 dark:!text-white dark:focus:!bg-slate-900 transition-all text-xs sm:text-sm cursor-pointer"
                        >
                          <option className="bg-white text-slate-900 dark:!bg-slate-900 dark:!text-white">Full Syllabus Access & Doubt Support</option>
                          <option className="bg-white text-slate-900 dark:!bg-slate-900 dark:!text-white">Target 100/100 Board Exam Score Booster</option>
                          <option className="bg-white text-slate-900 dark:!bg-slate-900 dark:!text-white">Concept Clarity & Chapter Revisions</option>
                          <option className="bg-white text-slate-900 dark:!bg-slate-900 dark:!text-white">Important Questions & Doubt Solving</option>
                        </select>
                      </div>
                    </div>

                    {/* Primary Focus Area / Challenge */}
                    <div>
                      <label className="block text-slate-800 dark:!text-slate-200 font-semibold mb-1 sm:mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
                        <BookOpen size={13} className="text-blue-600 dark:!text-blue-400" />
                        <span>Primary Chapter Focus or Current Doubts</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chapter Doubts, Numerical Problems, Board Blueprint..."
                        value={formData.goalArea}
                        onChange={(e) => setFormData({ ...formData, goalArea: e.target.value })}
                        className="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#D2DFEE] border border-[#B8CADF] rounded-xl text-slate-950 placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 focus:bg-white dark:!bg-slate-900/90 dark:!border-slate-700/80 dark:!text-white dark:placeholder:text-slate-500 dark:focus:!bg-slate-900 dark:focus:ring-blue-500/50 dark:focus:border-blue-500 transition-all text-xs sm:text-sm shadow-2xs"
                      />
                    </div>

                    {/* Price Summary Pill */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-blue-100/70 border border-blue-300/80 dark:!bg-blue-950/40 dark:!border-blue-500/30 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-[11.5px] sm:text-xs">
                      <span className="text-blue-900 dark:!text-blue-200 font-medium">
                        Enrollment Fee: <strong className="text-slate-950 dark:!text-white font-bold">{priceText} per Subject</strong> (All Inclusive)
                      </span>
                      <span className="text-emerald-700 dark:!text-emerald-400 text-[10.5px] sm:text-[11px] font-semibold">Pay after our team contacts you</span>
                    </div>

                    {/* Send Request Button with Website Signature Blue Gradient */}
                    <div className="pt-1 sm:pt-2">
                      {submitError && (
                        <p role="alert" className="mb-2 text-[11.5px] sm:text-xs font-semibold text-rose-700 dark:!text-rose-400">
                          {submitError}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="disabled:opacity-70 disabled:cursor-not-allowed w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <span>{isSubmitting ? 'Sending Your Request...' : 'Send Enrollment Request'}</span>
                          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11px] text-slate-600 dark:!text-slate-400 text-center font-medium pt-0.5">
                      <Lock size={12} className="text-emerald-600 dark:!text-emerald-400" />
                      <span>No payment is taken here • Zero hidden charges</span>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Request received */
          <div className="relative w-full flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center animate-fadeIn font-sans bg-gradient-to-br from-[#DFE7F2] via-[#E8EFF8] to-[#D5E1EE] dark:!bg-gradient-to-br dark:!from-[#0c1427] dark:!via-[#0f1b36] dark:!to-[#070b18]">
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 dark:!bg-emerald-500/15 dark:!border-emerald-500/40 dark:!text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:!text-white tracking-tight">
                  Request Received, {formData.studentName || 'Student'}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:!text-slate-300 mt-1 font-medium">
                  Our team will contact you on {formData.parentPhone} with the next steps for {detectedSubject.name}.
                </p>
              </div>
              <p className="p-3 rounded-xl bg-[#D2DFEE]/90 border border-[#BAC9DC] dark:!bg-slate-900/90 dark:!border-slate-800 text-xs text-slate-700 dark:!text-slate-300 font-medium">
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
