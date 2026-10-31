import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  Landmark, 
  Maximize2, 
  Minimize2, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Star, 
  Users, 
  Compass, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Check, 
  Receipt,
  Award,
  Zap,
  Printer,
  Copy,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Precomputed vector points for 100% full-width thermal receipt guillotine tear edge (40 serrated teeth)
const SAWTOOTH_POINTS = Array.from({ length: 40 }, (_, i) => `${i * 20},0 ${i * 20 + 10},18 ${(i + 1) * 20},0`).join(' ');

export default function BookingModal({ isOpen, onClose, preselectedTrack = '' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentStep, setCurrentStep] = useState('form'); // 'form' | 'payment' | 'confirmed'
  const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // 'upi_qr' | 'upi_id'
  const [upiIdInput, setUpiIdInput] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [mobileTab, setMobileTab] = useState('matter'); // 'matter' (Course Highlights) | 'form' (Student Details / Checkout)

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

  // Reset tab to matter when opening modal
  useEffect(() => {
    if (isOpen) {
      setMobileTab('matter');
    }
  }, [isOpen]);

  const transactionId = React.useMemo(() => `MM-PAY-${Math.floor(100000 + Math.random() * 900000)}`, []);
  const SubjectIcon = detectedSubject.icon;

  // Trigger stamp effect shortly after the thermal receipt slip unrolls (~1.25s)
  useEffect(() => {
    if (isOpen && currentStep === 'confirmed') {
      setShowStamp(false);
      const timer = setTimeout(() => {
        setShowStamp(true);
        // Festive confetti burst when rubber stamp slams onto paper
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.58 },
          colors: ['#dc2626', '#ef4444', '#b91c1c']
        });
      }, 1250);
      return () => clearTimeout(timer);
    } else {
      setShowStamp(false);
    }
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  // Step 1 -> Step 2
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (formData.parentPhone.length !== 10) {
      return;
    }
    setMobileTab('form');
    setCurrentStep('payment');
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

  // Step 2 -> Step 3
  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentStep('confirmed');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, 1100);
  };

  const handlePrintReceipt = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      window.print();
    }, 300);
  };

  const handleCopyReceipt = () => {
    const text = `MyMarks Enrollment Receipt\nTxn: ${transactionId}\nStudent: ${formData.studentName}\nSubject: ${detectedSubject.name}\nGrade: ${formData.gradeLevel}\nPlan: All Chapters Access & Doubt Support\nAmount: ₹299 (Paid in Full)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setCurrentStep('form');
    setMobileTab('matter');
    setShowStamp(false);
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
        {/* Receipt Step Close Button (Floating) */}
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

        {/* STEP 1 & 2: Main Top Header Bar (Safe Layout with Zero Close Button Overlap) */}
        {currentStep !== 'confirmed' && (
          <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-[#BAC9DC] dark:!border-slate-800/80 bg-[#DCE7F4]/90 dark:!bg-[#0B0F19]/90 backdrop-blur-md z-30 shrink-0 w-full overflow-hidden">
            {/* Header Badges */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/90 border border-blue-300/80 text-blue-900 dark:!bg-blue-950/80 dark:!border-blue-500/40 dark:!text-blue-300 text-[10.5px] sm:text-xs font-bold shadow-xs shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping shrink-0" />
                <span>Board Offer • ₹299 per Subject</span>
                <span className="line-through text-slate-500 dark:!text-slate-400 text-[9.5px] hidden xs:inline">₹999</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-black shrink-0">70% OFF</span>
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
                ₹299
              </span>
            </button>
          </div>
        )}

        {/* STEP 1 & 2: Form & Payment Layout */}
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
                  Get instant, unlimited access to all syllabus chapters, curated study notes, previous 10-year question banks, and dedicated faculty doubt clarifications.
                </p>

                {/* What You Get Checklist: All 4 Inclusions Fully Detailed */}
                <div className="space-y-3 sm:space-y-3.5 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2.5 sm:gap-3 group">
                    <div className="p-1 rounded-lg bg-blue-100 text-blue-600 border border-blue-300/80 dark:!bg-blue-500/15 dark:!text-blue-400 dark:!border-blue-500/30 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <CheckCircle2 size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:!text-white">Full Access to All Chapters & Lessons</h4>
                      <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:!text-slate-400 font-medium">Instant 24/7 access to all chapters, core concept deep-dives & board blueprint lessons.</p>
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
                        <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:!text-white">₹299</span>
                        <span className="text-xs text-slate-500 dark:!text-slate-400 line-through">₹999</span>
                        <span className="text-[10.5px] sm:text-[11px] font-bold text-emerald-700 dark:!text-emerald-400">Save ₹700</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] sm:text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-100 border border-blue-300/80 text-blue-800 dark:!bg-blue-500/15 dark:!text-blue-400 dark:!border-blue-500/30">
                        ₹299 Per Subject
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
                    <span>Proceed to Student Enrollment (₹299)</span>
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

            {/* Right Panel: Interactive Form OR Payment Gateway */}
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
                        ₹299 All-Inclusive • Save ₹700
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

                {/* Visual Step Progress Bar */}
                <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#BAC9DC] dark:!border-slate-800">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-colors ${
                      currentStep === 'form' 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40' 
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {currentStep === 'form' ? '1' : <Check size={13} />}
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold ${currentStep === 'form' ? 'text-slate-950 dark:!text-white' : 'text-slate-500 dark:!text-slate-400'}`}>
                      Student Details
                    </span>

                    <span className="w-5 sm:w-8 h-[2px] bg-[#BAC9DC] dark:!bg-slate-700 mx-0.5 sm:mx-1" />

                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-colors ${
                      currentStep === 'payment' 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/40' 
                        : 'bg-[#D2DFEE] text-slate-600 border border-[#BAC9DC] dark:!bg-slate-800 dark:!text-slate-400 dark:!border-slate-700'
                    }`}>
                      2
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold ${currentStep === 'payment' ? 'text-slate-950 dark:!text-white' : 'text-slate-500 dark:!text-slate-400'}`}>
                      Payment (₹299)
                    </span>
                  </div>

                  <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-blue-100 text-blue-800 dark:!bg-blue-500/10 dark:!text-blue-400 font-mono text-[10.5px] sm:text-xs font-bold border border-blue-300 dark:!border-blue-500/20 shrink-0">
                    ₹299 / Subject
                  </span>
                </div>

                {/* STEP 1: Student Details & Course Enrollment Form */}
                {currentStep === 'form' && (
                  <div className="animate-fadeIn">
                    <div className="mb-4 sm:mb-5">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-950 dark:!text-white mb-0.5 sm:mb-1">
                        Student Details & Course Enrollment
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:!text-slate-400 font-medium">
                        Fill in student info to activate instant access to all {detectedSubject.name} chapters & doubt portal for ₹299.
                      </p>
                    </div>

                    <form onSubmit={handleProceedToPayment} className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
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
                          Enrollment Fee: <strong className="text-slate-950 dark:!text-white font-bold">₹299 per Subject</strong> (All Inclusive)
                        </span>
                        <span className="text-emerald-700 dark:!text-emerald-400 text-[10.5px] sm:text-[11px] font-semibold">Instant Access & Doubt Portal</span>
                      </div>

                      {/* Proceed to Payment Button with Website Signature Blue Gradient */}
                      <div className="pt-1 sm:pt-2">
                        <button
                          type="submit"
                          className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <span>Proceed to Pay ₹299 & Unlock All Chapters</span>
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11px] text-slate-600 dark:!text-slate-400 text-center font-medium pt-0.5">
                        <Lock size={12} className="text-emerald-600 dark:!text-emerald-400" />
                        <span>Secure 256-bit encrypted checkout • Zero hidden charges</span>
                      </div>
                    </form>
                  </div>
                )}

                {/* STEP 2: Payment Gateway Screen */}
                {currentStep === 'payment' && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-[#BAC9DC] dark:!border-slate-800">
                      <button
                        onClick={() => setCurrentStep('form')}
                        className="text-slate-600 hover:text-slate-950 dark:!text-slate-400 dark:hover:!text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ArrowLeft size={14} /> Back to details
                      </button>
                      <span className="text-xs text-blue-700 dark:!text-blue-400 font-bold">
                        Step 2: Pay ₹299
                      </span>
                    </div>

                    {/* Order Summary Box */}
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#D2DFEE]/90 border border-[#BAC9DC] dark:!bg-slate-900/90 dark:!border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#BAC9DC] dark:!border-slate-800">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-950 dark:!text-white">
                            Complete {detectedSubject.name} Course & Doubt Access Pack
                          </h4>
                          <span className="text-[11px] sm:text-xs text-slate-600 dark:!text-slate-400 font-medium">
                            Student: {formData.studentName} • {formData.gradeLevel}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg sm:text-xl font-black text-slate-950 dark:!text-white">₹299</span>
                          <span className="block text-[9.5px] sm:text-[10px] text-emerald-700 dark:!text-emerald-400 font-semibold">Incl. all taxes</span>
                        </div>
                      </div>
                      <div className="text-[10.5px] sm:text-[11px] text-slate-600 dark:!text-slate-400 flex items-center justify-between font-medium">
                        <span>Includes: All Chapters Access + Doubt Clarifications + Notes & Q-Bank</span>
                        <span className="text-emerald-700 dark:!text-emerald-400 font-bold shrink-0">100% Guaranteed</span>
                      </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:!text-slate-300 uppercase tracking-wider mb-2 sm:mb-2.5">
                        Select Payment Method:
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi_qr')}
                          className={`p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                            paymentMethod === 'upi_qr'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30 ring-1 ring-blue-500'
                              : 'bg-[#D2DFEE] border-[#BAC9DC] text-slate-700 hover:text-slate-950 hover:bg-[#C5D5E7] dark:!bg-slate-900/80 dark:!border-slate-700/80 dark:!text-slate-400 dark:hover:!text-white dark:hover:!bg-slate-800'
                          }`}
                        >
                          <QrCode size={15} className={paymentMethod === 'upi_qr' ? 'text-white' : 'text-blue-600 dark:!text-blue-400'} />
                          <span>UPI / QR Scan</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('upi_id')}
                          className={`p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                            paymentMethod === 'upi_id'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30 ring-1 ring-blue-500'
                              : 'bg-[#D2DFEE] border-[#BAC9DC] text-slate-700 hover:text-slate-950 hover:bg-[#C5D5E7] dark:!bg-slate-900/80 dark:!border-slate-700/80 dark:!text-slate-400 dark:hover:!text-white dark:hover:!bg-slate-800'
                          }`}
                        >
                          <Smartphone size={15} className={paymentMethod === 'upi_id' ? 'text-white' : 'text-blue-600 dark:!text-blue-400'} />
                          <span>UPI ID / VPA</span>
                        </button>
                      </div>
                    </div>

                    {/* UPI QR Code Display View */}
                    {paymentMethod === 'upi_qr' && (
                      <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#D2DFEE]/70 border border-[#BAC9DC] dark:!bg-slate-950/80 dark:!border-slate-800 text-center space-y-2.5 sm:space-y-3 relative overflow-hidden">
                        <div className="inline-block p-2.5 sm:p-3 rounded-2xl bg-white shadow-xl relative">
                          <div className="w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 bg-white flex flex-col items-center justify-center border-2 border-slate-900 rounded-xl relative p-1">
                            <QrCode size={105} className="text-slate-950 w-full h-full" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white border border-white shadow-md">
                                <span className="font-mono text-[9px] sm:text-[10px] font-black">₹299</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className="text-[11.5px] sm:text-xs font-bold text-slate-950 dark:!text-white block">
                            Scan with any UPI App to pay ₹299
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-slate-600 dark:!text-slate-400 block mt-0.5 font-medium">
                            Google Pay • PhonePe • Paytm • BHIM • Amazon Pay
                          </span>
                        </div>
                      </div>
                    )}

                    {/* UPI ID Input View */}
                    {paymentMethod === 'upi_id' && (
                      <div className="space-y-2">
                        <label className="block text-xs text-slate-700 dark:!text-slate-300 font-semibold">
                          Enter your UPI ID (VPA):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. mobile@upi or name@okaxis"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            className="flex-1 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#D2DFEE] border border-[#B8CADF] rounded-xl text-slate-950 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-600 focus:bg-white dark:!bg-slate-900 dark:!border-slate-700 dark:!text-white dark:placeholder:text-slate-500 font-medium"
                          />
                          <button
                            type="button"
                            onClick={handleCompletePayment}
                            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md shadow-blue-600/30"
                          >
                            Verify & Pay
                          </button>
                        </div>
                        <span className="text-[10.5px] sm:text-[11px] text-slate-600 dark:!text-slate-500 block font-medium">
                          You will receive a payment request notification on your UPI App.
                        </span>
                      </div>
                    )}

                    {/* Complete / Confirm Payment Button with Blue Brand Theme */}
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={handleCompletePayment}
                      className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Payment of ₹299...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>I Have Paid ₹299 • Unlock My Course Access</span>
                        </>
                      )}
                    </button>

                    <div className="text-[10.5px] sm:text-[11px] text-center text-slate-600 dark:!text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                      <ShieldCheck size={13} className="text-blue-600 dark:!text-blue-400" />
                      <span>Payment protected by 100% Satisfaction Guarantee</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        ) : (
          /* STEP 3: Animated Thermal UI Printer & Printing Receipt Slip */
          <div className="relative w-full flex-1 flex flex-col items-center justify-center p-2.5 sm:p-5 text-center animate-fadeIn font-sans overflow-hidden bg-gradient-to-br from-[#DFE7F2] via-[#E8EFF8] to-[#D5E1EE] dark:!bg-gradient-to-br dark:!from-[#0c1427] dark:!via-[#0f1b36] dark:!to-[#070b18]">
            {/* Ambient Lighting Orbs */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            {/* Subtle High-Tech Blueprint Grid Texture */}
            <div 
              className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"
            />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-xl mx-auto space-y-2.5 my-auto">
            {/* Status Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 dark:!bg-emerald-950/80 dark:!border-emerald-500/40 dark:!text-emerald-400 text-xs font-bold mb-1.5 shadow-xs">
                <CheckCircle2 size={13} />
                <span>Payment of ₹299 Verified • Course Activated</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:!text-white tracking-tight">
                Enrollment Confirmed, {formData.studentName || 'Student'}!
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:!text-slate-400 mt-0.5 max-w-sm mx-auto font-medium">
                Official enrollment receipt printed below. Course access link and doubt support portal details sent to {formData.parentEmail || formData.parentPhone}.
              </p>
            </div>

            {/* Thermal Printer Hardware Unit */}
            <div className="relative w-full max-w-[310px] xs:max-w-[340px] sm:max-w-[370px] mx-auto select-none pt-1">
              {/* 3D Realistic Thermal Printer Head & Casing (Extended Width with Titanium Metallic Finish) */}
              <div className="relative z-20 -mx-3 xs:-mx-4 sm:-mx-7 rounded-2xl bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800 p-[1.5px] shadow-[0_6px_16px_rgba(0,0,0,0.5),0_1px_1px_rgba(255,255,255,0.35)_inset] border border-slate-500/80">
                <div className="relative rounded-[15px] bg-gradient-to-b from-[#334155] via-[#1E293B] to-[#0F172A] px-3 xs:px-4 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.6)]">
                  
                  {/* Left: Device Status & POS Model with Official MyMarks Logo */}
                  <div className="flex items-center gap-2 xs:gap-2.5">
                    {/* Multi-ring Neon Status Diode */}
                    <div className="relative flex items-center justify-center shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
                      <span className="absolute w-4 h-4 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
                    </div>

                    {/* Official MyMarks Logo Icon */}
                    <img 
                      src="/logomymarks.png" 
                      alt="MyMarks Logo" 
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    />

                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] xs:text-[11px] font-mono font-black tracking-wider uppercase text-white drop-shadow-md">
                          MYMARKS
                        </span>
                        <span className="px-1.5 py-[1px] rounded bg-blue-600/30 text-blue-200 text-[8px] xs:text-[8.5px] font-mono font-extrabold border border-blue-400/40 shadow-xs">
                          POS-299
                        </span>
                      </div>
                      <span className="text-[7px] xs:text-[7.5px] font-mono text-slate-300 font-semibold tracking-widest uppercase">
                        TITANIUM THERMAL PRO
                      </span>
                    </div>
                  </div>

                  {/* Center: Miniature Realistic Air Vents */}
                  <div className="hidden sm:flex items-center gap-1 opacity-40">
                    <span className="w-0.5 h-3.5 bg-slate-300 rounded-full" />
                    <span className="w-0.5 h-3.5 bg-slate-300 rounded-full" />
                    <span className="w-0.5 h-3.5 bg-slate-300 rounded-full" />
                  </div>

                  {/* Right: Redesigned Premium "PRINTED" Status Capsule Badge */}
                  <div className="flex items-center gap-1.5">
                    <div 
                      className={`flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 py-1 rounded-full text-[9.5px] xs:text-[10.5px] font-mono font-black tracking-wider transition-all duration-300 border shadow-lg ${
                        isPrinting
                          ? 'bg-blue-950/95 border-blue-400 text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.6)] ring-1 ring-blue-400/50'
                          : 'bg-emerald-950/95 border-emerald-400 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.55)] ring-1 ring-emerald-400/50'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isPrinting ? 'bg-blue-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'}`} />
                      <Printer size={12} className={isPrinting ? 'text-blue-400 animate-bounce' : 'text-emerald-400'} />
                      <span>{isPrinting ? 'PRINTING...' : 'PRINTED'}</span>
                    </div>
                  </div>

                </div>

                {/* Metallic Serrated Guillotine Tear Edge / Paper Exit Slit (Aligned with slip width) */}
                <div className="relative mx-3 xs:mx-4 sm:mx-7 -mb-1 z-30">
                  {/* Recessed Paper Chute Slot */}
                  <div className="h-1 bg-black rounded-full border-t border-slate-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.98)]" />
                  {/* Polished Chrome Tear Bar Blade Edge */}
                  <div className="h-[1.5px] bg-gradient-to-r from-transparent via-slate-300 to-transparent shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
                </div>
              </div>

              {/* The Animated Thermal Receipt Slip Coming Out */}
              <div className="relative -mt-1 z-10 overflow-hidden pt-1 pb-5">
                <div className="animate-print-slip bg-white text-slate-900 font-mono text-left shadow-[0_8px_24px_rgba(0,0,0,0.4)] p-3.5 xs:p-4 sm:p-5 pb-5 relative">
                  
                  {/* Realistic Animated Rubber Stamp Seal ("MYMARKS - PAID") */}
                  {showStamp && (
                    <div 
                      className="absolute top-[38%] left-1/2 z-30 pointer-events-none select-none animate-stamp-impact w-auto"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      <div className="relative border-4 border-double border-red-600 rounded-xl px-3 xs:px-4 py-1.5 bg-red-600/10 backdrop-blur-[0.5px] shadow-[0_0_0_2px_rgba(220,38,38,0.25),inset_0_0_0_2px_rgba(220,38,38,0.15)] text-red-600 font-mono text-center tracking-wider min-w-[190px] xs:min-w-[210px] sm:min-w-[230px]">
                        {/* Top Star & Brand Banner */}
                        <div className="flex items-center justify-between text-[8px] sm:text-[8.5px] font-black tracking-widest uppercase border-b-2 border-red-600/80 pb-0.5">
                          <span>★ ★ ★</span>
                          <span className="tracking-widest font-extrabold">MYMARKS</span>
                          <span>★ ★ ★</span>
                        </div>
                        
                        {/* Central Bold "PAID" Impact */}
                        <div className="py-0.5 flex items-center justify-center">
                          <span className="text-3xl sm:text-4xl font-black tracking-tighter leading-none text-red-600 font-sans uppercase drop-shadow-[0_1px_2px_rgba(220,38,38,0.35)]">
                            PAID
                          </span>
                        </div>
                        
                        {/* Bottom Seal Details */}
                        <div className="border-t-2 border-red-600/80 pt-0.5 space-y-0.5">
                          <div className="text-[7.5px] sm:text-[8px] font-black tracking-wider uppercase text-red-700">
                            OFFICIAL VERIFIED SEAL
                          </div>
                          <div className="text-[7px] font-mono tracking-widest text-red-600/90 font-bold">
                            AUTH: {transactionId.slice(-6)} • 100% ACCESS
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Top Branding Header (Pure white, no dark overlay) */}
                  <div className="text-center pb-2 border-b border-dashed border-slate-300">
                    <div className="flex items-center justify-center gap-1.5 font-black text-slate-950 text-sm tracking-wider">
                      <img src="/logomymarks.png" alt="MyMarks Logo" className="w-4 h-4 object-contain" />
                      <span>MYMARKS.CO.IN</span>
                    </div>
                    <span className="text-[9.5px] tracking-wider uppercase text-slate-500 font-bold block">
                      AP & TS INTERMEDIATE ACADEMY
                    </span>
                    <span className="text-[8.5px] text-slate-400 block mt-0.5">
                      COMPLETE SUBJECT ENROLLMENT RECEIPT
                    </span>
                  </div>

                  {/* Student & Session Data */}
                  <div className="py-2 space-y-1 text-[10.5px] border-b border-dashed border-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">STUDENT:</span>
                      <span className="font-bold text-slate-950 truncate max-w-[170px]">{formData.studentName.toUpperCase() || 'STUDENT'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">SUBJECT:</span>
                      <span className="font-extrabold text-blue-700">{detectedSubject.name.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GRADE:</span>
                      <span className="font-semibold text-slate-800">{formData.gradeLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ACCESS:</span>
                      <span className="font-bold text-slate-900">ALL CHAPTERS + DOUBTS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">TXN ID:</span>
                      <span className="font-mono text-slate-700">{transactionId}</span>
                    </div>
                  </div>

                  {/* Grand Amount Paid Banner */}
                  <div className="py-2.5 text-center border-b border-dashed border-slate-300 bg-slate-50 -mx-3.5 xs:-mx-4 sm:-mx-5 px-3.5 xs:px-4 sm:px-5 my-1">
                    <span className="text-[9.5px] uppercase font-bold text-slate-500 block">Total Amount Paid</span>
                    <span className="text-2xl font-black text-slate-950 block tracking-tight">₹299.00</span>
                    <span className="inline-block mt-0.5 text-[8.5px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      UPI PAYMENT APPROVED • PAID IN FULL
                    </span>
                  </div>

                  {/* Itemized Breakdown */}
                  <div className="py-2 space-y-1 text-[10px] border-b border-dashed border-slate-300">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-700 leading-tight">1X ALL CHAPTERS ACCESS & LESSONS</span>
                      <span className="font-bold text-slate-900 shrink-0">₹999.00</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-700 leading-tight">1X DEDICATED DOUBT CLARIFICATIONS</span>
                      <span className="font-bold text-slate-900 shrink-0">₹499.00</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-700 leading-tight">1X CHAPTER NOTES & 10-YR Q-BANK</span>
                      <span className="font-bold text-emerald-700 shrink-0">INCLUDED</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-700 leading-tight">1X 100/100 ANSWER SCRIPT GUIDE</span>
                      <span className="font-bold text-emerald-700 shrink-0">INCLUDED</span>
                    </div>
                  </div>

                  {/* Subtotal, Scholarship & Grand Total */}
                  <div className="py-1.5 space-y-0.5 text-[10px] border-b-2 border-slate-900">
                    <div className="flex justify-between text-slate-500">
                      <span>SUBTOTAL:</span>
                      <span>₹1498.00</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>BOARD SCHOLARSHIP (70%):</span>
                      <span>-₹1199.00</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[9px]">
                      <span>TAX (GST 18%):</span>
                      <span>INCLUDED</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-950 text-[11px] pt-0.5 border-t border-slate-200">
                      <span>GRAND TOTAL:</span>
                      <span>₹299.00</span>
                    </div>
                  </div>

                  {/* Barcode & Thank You */}
                  <div className="pt-2 text-center">
                    <span className="text-[9px] font-bold text-slate-600 uppercase block tracking-wider mb-1">
                      THANK YOU FOR LEARNING WITH MYMARKS!
                    </span>

                    {/* Barcode Graphic */}
                    <div className="flex justify-center items-center gap-[2px] h-6 max-w-[190px] mx-auto opacity-85">
                      {[3,1,2,1,4,1,2,3,1,1,3,2,1,4,1,2,1,3,1,2,4,1,2,3,1,2,1,4,2,1,3,1,2].map((w, i) => (
                        <div key={i} className="h-full bg-slate-950" style={{ width: `${w * 1.4}px` }} />
                      ))}
                    </div>
                    <span className="text-[8.5px] font-mono tracking-widest text-slate-400 block mt-0.5">
                      TXN-{transactionId}-APTS
                    </span>
                  </div>

                  {/* Perforated Sawtooth Guillotine Tear Edge at Bottom (Dynamic 100% Full-Width) */}
                  <div className="absolute top-[calc(100%-1px)] left-0 right-0 h-3 sm:h-3.5 pointer-events-none z-20 overflow-visible">
                    <svg 
                      className="w-full h-full block filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.45)]"
                      viewBox="0 0 800 20"
                      preserveAspectRatio="none"
                    >
                      <polygon 
                        points={SAWTOOTH_POINTS} 
                        fill="#ffffff" 
                      />
                    </svg>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
