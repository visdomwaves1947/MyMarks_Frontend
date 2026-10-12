import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../redux/thunks/authThunks';
import LegalTermsModal from './LegalTermsModal';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Calendar, 
  CreditCard, 
  GraduationCap, 
  Building2, 
  Eye, 
  EyeOff, 
  Camera, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Award, 
  AlertCircle,
  LogIn,
  UserPlus,
  ArrowLeft,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STEP_TITLES = [
  'Personal Details',
  'Select Board',
  'Select Year & College',
  'Review & Confirm'
];

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'signin',
  currentUser = null,
  onLoginSuccess
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup' | 'portal'
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isShaking, setIsShaking] = useState(false);

  // File input ref for avatar upload
  const fileInputRef = useRef(null);

  // Sign In Form State
  const [signInInput, setSignInInput] = useState(''); // Mobile or Email
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [signInErrors, setSignInErrors] = useState({});
  const [signUpSuccessMsg, setSignUpSuccessMsg] = useState('');

  // Legal Terms & Privacy Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('terms'); // 'terms' | 'privacy'

  // Sign Up Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Guardian Details
    avatarUrl: '',
    fullName: '',
    mobileNumber: '',
    email: '',
    dob: '',
    aadhaarNumber: '',
    relationship: 'Father',
    fatherName: '',
    fatherMobile: '',
    hallTicketNumber: '',
    password: '',
    confirmPassword: '',

    // Step 2: Board
    board: 'Andhra Pradesh Intermediate',

    // Step 3: Year & College
    year: 'First Year',
    collegeName: '',
    studyMonthYear: 'June, 2025',

    // Terms
    termsAccepted: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Synchronize modal mode when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'signin');
      setRegSuccess(false);
      setFormErrors({});
      setSignInErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Trigger error shake animation
  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Avatar upload handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, avatar: 'Photo exceeds 5MB limit. Please choose a smaller image.' }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({ ...prev, avatarUrl: uploadEvent.target?.result || '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Generic field update handler
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      if (field === 'termsAccepted') {
        delete updated.terms;
      }
      return updated;
    });
  };

  // Validation for Sign In (Login)
  const validateSignIn = () => {
    const errors = {};
    const cleanInput = signInInput.trim();
    const cleanPassword = signInPassword.trim();

    if (!cleanInput) {
      errors.signInInput = 'Mobile number or Email address is required';
    } else if (cleanInput.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanInput)) {
        errors.signInInput = 'Please enter a valid email address (e.g. student@example.com)';
      }
    } else {
      const digitsOnly = cleanInput.replace(/\D/g, '');
      if (digitsOnly.length !== 10) {
        errors.signInInput = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (!cleanPassword) {
      errors.signInPassword = 'Password is required';
    } else if (cleanPassword.length < 6) {
      errors.signInPassword = 'Password must be at least 6 characters long';
    }

    setSignInErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step Validation for Registration
  const validateStep = (currentStep) => {
    const errors = {};

    if (currentStep === 1) {
      // Full Name validation
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full Name is required';
      } else if (formData.fullName.trim().length < 2) {
        errors.fullName = 'Full Name must be at least 2 characters';
      }

      // Mobile Number validation (10 digits)
      const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
      if (!formData.mobileNumber.trim()) {
        errors.mobileNumber = 'Mobile Number is required';
      } else if (cleanMobile.length !== 10) {
        errors.mobileNumber = 'Enter a valid 10-digit mobile number';
      }

      // Email Address validation
      if (!formData.email.trim()) {
        errors.email = 'Email Address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errors.email = 'Enter a valid email address (e.g. student@example.com)';
      }

      // Date of Birth validation
      if (!formData.dob) {
        errors.dob = 'Date of Birth is required';
      }

      // Aadhaar Number (optional, but if entered must be 12 digits)
      if (formData.aadhaarNumber.trim()) {
        const cleanAadhaar = formData.aadhaarNumber.replace(/\D/g, '');
        if (cleanAadhaar.length !== 12) {
          errors.aadhaarNumber = 'Aadhaar Number must be exactly 12 digits';
        }
      }

      // Parent Details validation
      if (!formData.fatherName.trim()) {
        errors.fatherName = `${formData.relationship} Name is required`;
      } else if (formData.fatherName.trim().length < 2) {
        errors.fatherName = `Enter valid ${formData.relationship} name`;
      }

      const cleanParentMobile = formData.fatherMobile.replace(/\D/g, '');
      if (!formData.fatherMobile.trim()) {
        errors.fatherMobile = `${formData.relationship} Mobile is required`;
      } else if (cleanParentMobile.length !== 10) {
        errors.fatherMobile = 'Enter a valid 10-digit mobile number';
      }

      // Hall Ticket validation if Second Year
      if (formData.year === 'Second Year') {
        const cleanHT = formData.hallTicketNumber.replace(/\D/g, '');
        if (!formData.hallTicketNumber.trim()) {
          errors.hallTicketNumber = 'Intermediate Hall Ticket Number is mandatory for Second Year';
        } else if (cleanHT.length < 5) {
          errors.hallTicketNumber = 'Enter a valid Hall Ticket Number (digits only)';
        }
      } else if (formData.hallTicketNumber.trim()) {
        const cleanHT = formData.hallTicketNumber.replace(/\D/g, '');
        if (cleanHT.length < 5) {
          errors.hallTicketNumber = 'Enter digits only for Hall Ticket Number';
        }
      }

      // Password validation
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      // Confirm Password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please re-enter password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (currentStep === 2) {
      if (!formData.board) {
        errors.board = 'Please select your academic board';
      }
    }

    if (currentStep === 3) {
      if (!formData.year) {
        errors.year = 'Please select study year (First Year or Second Year)';
      }
      
      // If Second Year is selected, Hall Ticket Number is strictly mandatory!
      if (formData.year === 'Second Year') {
        const cleanHT = (formData.hallTicketNumber || '').replace(/\D/g, '');
        if (!formData.hallTicketNumber || !formData.hallTicketNumber.trim()) {
          errors.hallTicketNumber = 'Hall Ticket Number is mandatory for Second Year students';
        } else if (cleanHT.length < 5) {
          errors.hallTicketNumber = 'Enter a valid Hall Ticket Number (digits only)';
        }
      }

      if (!formData.collegeName.trim() || formData.collegeName.trim().length < 2) {
        errors.collegeName = 'Junior College Name & Location is required (min 2 chars)';
      }
      if (!formData.studyMonthYear.trim() || formData.studyMonthYear.includes('---')) {
        errors.studyMonthYear = 'Month & Year of Study is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step advancement
  const handleNextStep = () => {
    if (validateStep(step)) {
      setDirection('forward');
      setStep((prev) => Math.min(prev + 1, 4));
    } else {
      triggerShake();
    }
  };

  const handlePrevStep = () => {
    setDirection('backward');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Sign In Submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignIn()) {
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    setSignInErrors({});
    setSignUpSuccessMsg('');

    try {
      const resultAction = await dispatch(loginUser({ signInInput, signInPassword }));
      if (loginUser.fulfilled.match(resultAction)) {
        const user = resultAction.payload;
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        const errorMsg = resultAction.payload || 'Invalid credentials. Please try again.';
        setSignInErrors({ server: errorMsg });
        triggerShake();
      }
    } catch (err) {
      setSignInErrors({ server: err.message || 'Server connection failed' });
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Student Fill
  const handleQuickDemo = () => {
    setSignInInput('jordan.student@mathslearningacademy.com');
    setSignInPassword('MasterMaths2026!');
    setSignInErrors({});
    setSignUpSuccessMsg('');
  };

  // Sign Up Final Submission
  const handleSignUpSubmit = async () => {
    if (!formData.termsAccepted) {
      setFormErrors({ terms: 'Please agree to the Terms of Service and Privacy Policy to complete registration.' });
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        try {
          confetti({
            particleCount: 120,
            spread: 85,
            origin: { y: 0.6 }
          });
        } catch {
          // Fallback
        }

        // Automatically prefill credentials and switch to Sign In page
        setSignInInput(formData.email || formData.mobileNumber || '');
        setSignInPassword('');
        setSignInErrors({});
        setSignUpSuccessMsg('Registration successful! Please sign in with your password to access the Demo Page.');
        navigate('/signin');
        setMode('signin');
        setStep(1);
      } else {
        const errorMsg = resultAction.payload || 'Registration failed. Please check your details.';
        setFormErrors({ submit: errorMsg });
        triggerShake();
      }
    } catch (err) {
      setFormErrors({ submit: err.message || 'Server connection failed' });
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-screen overflow-y-auto bg-slate-950 flex flex-col justify-between animate-fadeIn">
      
      {/* Full Page Artistic Watercolor Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center pointer-events-none -z-10 transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: "url('/auth-bg.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#15100B]/90 via-[#18120E]/75 to-[#0A0705]/85 backdrop-blur-[3px]"></div>
        <div className="absolute inset-0 bg-radial-glow opacity-80"></div>
      </div>

      {/* Top Header Bar with Back Button & Close */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
        <div></div>

        {/* Mode Toggle Pills (Sign In / Sign Up) */}
        {mode !== 'portal' && !regSuccess && (
          <div className="flex items-center p-1 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 text-xs font-bold shadow-lg">
            <button
              type="button"
              onClick={() => {
                navigate('/signin');
                setMode('signin');
                setFormErrors({});
                setSignInErrors({});
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigate('/signup');
                setMode('signup');
                setStep(1);
                setFormErrors({});
                setSignInErrors({});
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus size={13} />
              <span>Sign Up</span>
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="Close"
          className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-sm active:scale-90"
        >
          <X size={18} />
        </button>
      </header>

      {/* Main Full Page Central Card */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 my-auto py-3 sm:py-6 flex items-center justify-center">
        <div 
          className={`w-full rounded-[36px] bg-[#1E1611]/85 backdrop-blur-2xl border border-amber-400/30 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.7)] overflow-hidden transition-all grid grid-cols-1 lg:grid-cols-12 ${
            isShaking ? 'animate-shake' : 'animate-scaleUp'
          }`}
        >
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: ILLUSTRATION & INSPIRATIONAL BANNER */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative border-b lg:border-b-0 lg:border-r border-amber-400/20 bg-gradient-to-b from-amber-500/[0.04] to-transparent">
            
            <div className="absolute w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>

            {/* Student Mascot Image */}
            <div className="relative mb-4 group">
              <div className="w-48 sm:w-56 aspect-[5/4] relative flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white/25 bg-white ring-4 ring-sky-400/20">
                <img 
                  src="/student-mascot.png" 
                  alt="Academy Student Mascot" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-sky-400 tracking-tight mb-1.5 drop-shadow-sm">
              Build Your Legacy
            </h2>

            <p className="text-xs sm:text-sm text-amber-100/80 italic font-medium leading-relaxed max-w-xs">
              "Every formula solved creates a whole new world of understanding!"
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-amber-400/20 text-[11px] text-amber-200/90 font-medium">
              <Sparkles size={12} className="text-amber-400" />
              <span>AP & TS Intermediate Excellence</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: AUTHENTIC SIGN IN / SIGN UP FORM */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-center">
            
            {/* Header branding */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  My
                </span>
                <span className="text-2xl sm:text-3xl font-black text-sky-400 tracking-tight">
                  Marks
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-sky-300/80 mt-1">
                SECURE LOGIN PORTAL
              </div>
            </div>

            {/* ======================================================== */}
            {/* SIGN IN FORM (WITH STRICT & INSTANT VALIDATION) */}
            {/* ======================================================== */}
            {mode === 'signin' && (
              <div className="animate-fadeIn">
                <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                  {signUpSuccessMsg && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn mb-2">
                      <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                      <span>{signUpSuccessMsg}</span>
                    </div>
                  )}
                  {signInErrors.server && (
                    <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                      <AlertCircle size={16} className="shrink-0 text-rose-400" />
                      <span>{signInErrors.server}</span>
                    </div>
                  )}
                  {/* MOBILE NUMBER/EMAIL FIELD */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      <Smartphone size={13} className="text-sky-400" />
                      <span>MOBILE NUMBER / EMAIL *</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter 10-digit mobile or email address"
                        value={signInInput}
                        onChange={(e) => {
                          setSignInInput(e.target.value);
                          if (signInErrors.signInInput) {
                            setSignInErrors(prev => ({ ...prev, signInInput: '' }));
                          }
                        }}
                        className={`w-full px-4 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-400/40 border-2 transition-all shadow-md ${
                          signInErrors.signInInput ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-sky-400'
                        }`}
                      />
                    </div>
                    {signInErrors.signInInput && (
                      <p className="text-rose-400 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {signInErrors.signInInput}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD FIELD */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      <Lock size={13} className="text-sky-400" />
                      <span>PASSWORD *</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        placeholder="Enter password (min 6 characters)"
                        value={signInPassword}
                        onChange={(e) => {
                          setSignInPassword(e.target.value);
                          if (signInErrors.signInPassword) {
                            setSignInErrors(prev => ({ ...prev, signInPassword: '' }));
                          }
                        }}
                        className={`w-full px-4 pr-12 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-400/40 border-2 transition-all shadow-md ${
                          signInErrors.signInPassword ? 'border-rose-500 bg-rose-50/10' : 'border-transparent focus:border-sky-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-800 cursor-pointer p-1"
                      >
                        {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signInErrors.signInPassword && (
                      <p className="text-rose-400 text-[11px] font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {signInErrors.signInPassword}
                      </p>
                    )}
                  </div>

                  {/* Options row */}
                  <div className="flex items-center justify-between text-xs text-slate-300 font-medium pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-600 accent-sky-500 w-4 h-4 cursor-pointer" 
                      />
                      <span>Remember me</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => alert("A secure password reset link has been dispatched to your registered email/phone.")} 
                      className="text-sky-400 hover:text-sky-300 font-bold hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* CONTINUE WITH PASSWORD BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#322822]/90 hover:bg-[#3D312A] border border-amber-400/30 text-amber-200/90 hover:text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Lock size={15} className="text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>CONTINUE WITH PASSWORD</span>
                      </>
                    )}
                  </button>

                  {/* Bottom Divider & Switcher */}
                  <div className="pt-3 border-t border-white/10 text-xs text-slate-300 font-medium flex items-center justify-between">
                    <span>
                      Don't have an Account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          navigate('/signup');
                          setMode('signup');
                          setStep(1);
                          setFormErrors({});
                        }}
                        className="text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer ml-1"
                      >
                        Sign Up/Register
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={handleQuickDemo}
                      className="text-[11px] text-amber-400 hover:underline font-bold"
                    >
                      Demo Fill
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* SIGN UP FORM (4 STREAMLINED STEPS) */}
            {/* ======================================================== */}
            {mode === 'signup' && !regSuccess && (
              <div className="animate-fadeIn">
                
                {/* 4 Indicator Progress Dots */}
                <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          s === step
                            ? 'w-8 bg-sky-400 shadow-md shadow-sky-400/50'
                            : s < step
                            ? 'w-2.5 bg-sky-300/60'
                            : 'w-1.5 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    Step {step} of 4: {STEP_TITLES[step - 1]}
                  </span>
                </div>

                {/* -------------------------------------------------------- */}
                {/* STEP 1: PERSONAL & GUARDIAN DETAILS */}
                {/* -------------------------------------------------------- */}
                {step === 1 && (
                  <div className={direction === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}>
                    <div className="space-y-2 text-xs">
                      
                      {/* Row 1: Profile Photo Avatar + Full Name * */}
                      <div className="flex items-center gap-3">
                        <div className="relative group shrink-0">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-md group-hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center overflow-hidden"
                            title="Upload Photo (Optional)"
                          >
                            <div className="w-full h-full rounded-full bg-[#18120E] flex flex-col items-center justify-center text-center p-0.5">
                              {formData.avatarUrl ? (
                                <img 
                                  src={formData.avatarUrl} 
                                  alt="Avatar" 
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <>
                                  <Camera size={14} className="text-sky-400" />
                                  <span className="text-[7.5px] font-black tracking-wider text-sky-400 leading-none mt-0.5">
                                    UPLOAD
                                  </span>
                                </>
                              )}
                            </div>
                          </button>

                          {formData.avatarUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData((prev) => ({ ...prev, avatarUrl: '' }));
                              }}
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow-xs cursor-pointer hover:bg-rose-700"
                              title="Remove photo"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {/* Full Name * */}
                        <div className="grow">
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="block text-slate-200 font-bold text-[11px]">
                              Full Name <span className="text-rose-400">*</span>
                            </label>
                            <span className="text-[9.5px] text-slate-400 font-medium">Photo optional (max 5MB)</span>
                          </div>
                          <div className="relative">
                            <User size={14} className="absolute left-3 top-2.5 text-sky-400" />
                            <input
                              type="text"
                              placeholder="Student full name"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                            />
                          </div>
                          {formErrors.fullName && (
                            <p className="text-rose-400 text-[10px] font-semibold mt-0.5">{formErrors.fullName}</p>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Mobile Number * & Email Address * */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-200 font-bold mb-0.5 text-[11px]">
                            Mobile Number <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-2.5 text-sky-400" />
                            <input
                              type="tel"
                              maxLength={10}
                              placeholder="10-digit phone"
                              value={formData.mobileNumber}
                              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                            />
                          </div>
                          {formErrors.mobileNumber && (
                            <p className="text-rose-400 text-[10px] font-semibold mt-0.5">{formErrors.mobileNumber}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-slate-200 font-bold mb-0.5 text-[11px]">
                            Email Address <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <Mail size={14} className="absolute left-3 top-2.5 text-sky-400" />
                            <input
                              type="email"
                              placeholder="student@example.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                            />
                          </div>
                          {formErrors.email && (
                            <p className="text-rose-400 text-[10px] font-semibold mt-0.5">{formErrors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Row 3: Date of Birth * & Aadhaar Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-200 font-bold mb-0.5 text-[11px]">
                            Date of Birth <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-2.5 text-sky-400 pointer-events-none" />
                            <input
                              type="date"
                              value={formData.dob}
                              onChange={(e) => handleInputChange('dob', e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                            />
                          </div>
                          {formErrors.dob && (
                            <p className="text-rose-400 text-[10px] font-semibold mt-0.5">{formErrors.dob}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-slate-200 font-bold mb-0.5 text-[11px]">
                            Aadhaar Number <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                          </label>
                          <div className="relative">
                            <CreditCard size={14} className="absolute left-3 top-2.5 text-sky-400" />
                            <input
                              type="text"
                              maxLength={12}
                              placeholder="12-digit Aadhaar"
                              value={formData.aadhaarNumber}
                              onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                            />
                          </div>
                          {formErrors.aadhaarNumber && (
                            <p className="text-rose-400 text-[10px] font-semibold mt-0.5">{formErrors.aadhaarNumber}</p>
                          )}
                        </div>
                      </div>

                      {/* Row 4: Parent / Guardian Details Card */}
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-1.5 mb-1.5 text-white font-bold text-[11px]">
                          <Users size={13} className="text-sky-400" />
                          <span>Parent / Guardian Details</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-slate-300 font-bold mb-0.5 text-[10px]">
                              Relationship <span className="text-rose-400">*</span>
                            </label>
                            <select
                              value={formData.relationship}
                              onChange={(e) => handleInputChange('relationship', e.target.value)}
                              className="w-full px-2 py-1.5 bg-white text-slate-900 rounded-lg font-medium text-xs focus:outline-none"
                            >
                              <option value="Father">Father</option>
                              <option value="Mother">Mother</option>
                              <option value="Guardian">Guardian</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-0.5 text-[10px]">
                              {formData.relationship} Name <span className="text-rose-400">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Full name"
                              value={formData.fatherName}
                              onChange={(e) => handleInputChange('fatherName', e.target.value)}
                              className="w-full px-2 py-1.5 bg-white text-slate-900 rounded-lg font-medium text-xs focus:outline-none"
                            />
                            {formErrors.fatherName && (
                              <p className="text-rose-400 text-[9.5px] font-semibold mt-0.5">{formErrors.fatherName}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-slate-300 font-bold mb-0.5 text-[10px]">
                              {formData.relationship} Mobile <span className="text-rose-400">*</span>
                            </label>
                            <input
                              type="tel"
                              maxLength={10}
                              placeholder="10-digit mobile"
                              value={formData.fatherMobile}
                              onChange={(e) => handleInputChange('fatherMobile', e.target.value)}
                              className="w-full px-2 py-1.5 bg-white text-slate-900 rounded-lg font-medium text-xs focus:outline-none"
                            />
                            {formErrors.fatherMobile && (
                              <p className="text-rose-400 text-[9.5px] font-semibold mt-0.5">{formErrors.fatherMobile}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Row 5: Intermediate Hall Ticket Number */}
                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="block text-slate-200 font-bold text-[11px]">
                            Intermediate Hall Ticket Number {formData.year === 'Second Year' ? <span className="text-rose-400">* (Mandatory for 2nd Year)</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
                          </label>
                        </div>
                        <div className="relative">
                          <GraduationCap size={14} className="absolute left-3 top-2.5 text-sky-400" />
                          <input
                            type="text"
                            placeholder="Enter Hall Ticket Number (digits only)"
                            value={formData.hallTicketNumber}
                            onChange={(e) => handleInputChange('hallTicketNumber', e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                          />
                        </div>
                        {formErrors.hallTicketNumber && (
                          <p className="text-rose-400 text-[10px] font-semibold mt-0.5">{formErrors.hallTicketNumber}</p>
                        )}
                      </div>

                      {/* Row 6: Password * & Re-enter Password * in 2 columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-200 font-bold mb-0.5 text-[11px]">
                            Password <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <Lock size={14} className="absolute left-3 top-2.5 text-sky-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create password"
                              value={formData.password}
                              onChange={(e) => handleInputChange('password', e.target.value)}
                              className="w-full pl-8 pr-8 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-800"
                            >
                              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          {formErrors.password && (
                            <p className="text-rose-400 text-[10px] font-semibold mt-0.5">{formErrors.password}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-slate-200 font-bold mb-0.5 text-[11px]">
                            Re-enter Password <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <Lock size={14} className="absolute left-3 top-2.5 text-sky-400" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Re-enter password"
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                              className="w-full pl-8 pr-8 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-800"
                            >
                              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          {formErrors.confirmPassword && (
                            <p className="text-rose-400 text-[10px] font-semibold mt-0.5">{formErrors.confirmPassword}</p>
                          )}
                        </div>
                      </div>

                      {/* Next Step Button */}
                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="w-full py-2.5 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-sky-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Next Step</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      <div className="text-center text-[11px] text-slate-300 font-medium pt-1">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => { navigate('/signin'); setMode('signin'); }}
                          className="text-sky-400 font-bold hover:underline cursor-pointer ml-1"
                        >
                          Sign In
                        </button>
                      </div>

                      <div className="text-center text-[10.5px] text-slate-400 pt-0.5">
                        By continuing, you agree to our{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setLegalModalTab('terms');
                            setLegalModalOpen(true);
                          }}
                          className="text-[#6366f1] hover:text-[#818cf8] font-bold underline-offset-2 hover:underline cursor-pointer"
                        >
                          Terms of Service
                        </button>
                        {' '}and{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setLegalModalTab('privacy');
                            setLegalModalOpen(true);
                          }}
                          className="text-[#6366f1] hover:text-[#818cf8] font-bold underline-offset-2 hover:underline cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 2: SELECT BOARD (CBSE REMOVED, AP & TS ONLY) */}
                {/* -------------------------------------------------------- */}
                {step === 2 && (
                  <div className={direction === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}>
                    <div className="text-center mb-3">
                      <h3 className="text-lg sm:text-xl font-black text-white">Select Board</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5">Choose your academic intermediate board.</p>
                    </div>

                    <div className="space-y-2.5 mb-4">
                      {/* Andhra Pradesh Intermediate */}
                      <div
                        onClick={() => handleInputChange('board', 'Andhra Pradesh Intermediate')}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          formData.board === 'Andhra Pradesh Intermediate'
                            ? 'border-2 border-sky-400 bg-sky-500/20 text-white shadow-md'
                            : 'border-white/15 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-xs sm:text-sm block">Andhra Pradesh Intermediate</span>
                          <span className="text-[10px] text-sky-300 font-medium">BIEAP Syllabus • MPC & BiPC</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          formData.board === 'Andhra Pradesh Intermediate' ? 'border-sky-400 bg-sky-400' : 'border-slate-500'
                        }`}>
                          {formData.board === 'Andhra Pradesh Intermediate' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>

                      {/* Telangana Intermediate */}
                      <div
                        onClick={() => handleInputChange('board', 'Telangana Intermediate')}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          formData.board === 'Telangana Intermediate'
                            ? 'border-2 border-sky-400 bg-sky-500/20 text-white shadow-md'
                            : 'border-white/15 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-xs sm:text-sm block">Telangana Intermediate</span>
                          <span className="text-[10px] text-sky-300 font-medium">TSBIE Syllabus • MPC & BiPC</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          formData.board === 'Telangana Intermediate' ? 'border-sky-400 bg-sky-400' : 'border-slate-500'
                        }`}>
                          {formData.board === 'Telangana Intermediate' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2.5 px-3.5 rounded-xl border border-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-white/10"
                      >
                        <ChevronLeft size={15} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="grow py-2.5 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-500/25"
                      >
                        <span>Next Step</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 3: SELECT YEAR & COLLEGE (WITH STRICT 2ND YEAR HT VALIDATION) */}
                {/* -------------------------------------------------------- */}
                {step === 3 && (
                  <div className={direction === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}>
                    <div className="text-center mb-2.5">
                      <h3 className="text-lg sm:text-xl font-black text-white">Select Year & College</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5">Select year and enter college information.</p>
                    </div>

                    {/* Year Selection */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div
                        onClick={() => handleInputChange('year', 'First Year')}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          formData.year === 'First Year'
                            ? 'border-2 border-sky-400 bg-sky-500/20 text-white shadow-sm'
                            : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-extrabold text-xs sm:text-sm">First Year</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.year === 'First Year' ? 'border-sky-400 bg-sky-400' : 'border-slate-500'
                        }`}>
                          {formData.year === 'First Year' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>

                      <div
                        onClick={() => handleInputChange('year', 'Second Year')}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          formData.year === 'Second Year'
                            ? 'border-2 border-sky-400 bg-sky-500/20 text-white shadow-sm'
                            : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-extrabold text-xs sm:text-sm">Second Year</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.year === 'Second Year' ? 'border-sky-400 bg-sky-400' : 'border-slate-500'
                        }`}>
                          {formData.year === 'Second Year' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Intermediate Hall Ticket Input (MANDATORY FOR SECOND YEAR) */}
                    <div className={`p-2.5 rounded-xl mb-3 border transition-all ${
                      formData.year === 'Second Year'
                        ? 'bg-amber-500/10 border-amber-400/40'
                        : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-200 font-bold text-[11px]">
                          Intermediate Hall Ticket Number{' '}
                          {formData.year === 'Second Year' ? (
                            <span className="text-amber-400 font-bold text-[10.5px] bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/40">
                              * MANDATORY FOR 2ND YEAR
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal text-[10px]">(Optional for 1st Year)</span>
                          )}
                        </label>
                      </div>
                      <div className="relative">
                        <GraduationCap size={14} className="absolute left-3 top-2.5 text-sky-400" />
                        <input
                          type="text"
                          placeholder="Enter Hall Ticket Number (digits only)"
                          value={formData.hallTicketNumber}
                          onChange={(e) => handleInputChange('hallTicketNumber', e.target.value)}
                          className={`w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm ${
                            formErrors.hallTicketNumber ? 'border-2 border-rose-500' : ''
                          }`}
                        />
                      </div>
                      {formErrors.hallTicketNumber && (
                        <p className="text-rose-400 text-[10px] font-bold mt-1 flex items-center gap-1">
                          <AlertCircle size={11} /> {formErrors.hallTicketNumber}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 mb-3.5">
                      <div>
                        <label className="block text-slate-200 font-bold mb-0.5 text-[11px]">
                          Junior College Name & Location <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <Building2 size={14} className="absolute left-3 top-2.5 text-sky-400" />
                          <input
                            type="text"
                            placeholder="e.g. Sri Chaitanya Junior College, Vijayawada"
                            value={formData.collegeName}
                            onChange={(e) => handleInputChange('collegeName', e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                          />
                        </div>
                        {formErrors.collegeName && (
                          <p className="text-rose-400 text-[10px] font-bold mt-0.5">{formErrors.collegeName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-200 font-bold mb-0.5 text-[11px]">
                          Month & Year of Study <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-3 top-2.5 text-sky-400" />
                          <input
                            type="text"
                            placeholder="June, 2025"
                            value={formData.studyMonthYear}
                            onChange={(e) => handleInputChange('studyMonthYear', e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-sm"
                          />
                        </div>
                        {formErrors.studyMonthYear && (
                          <p className="text-rose-400 text-[10px] font-bold mt-0.5">{formErrors.studyMonthYear}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2.5 px-3.5 rounded-xl border border-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-white/10"
                      >
                        <ChevronLeft size={15} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="grow py-2.5 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-500/25"
                      >
                        <span>Next Step</span>
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* STEP 4: REVIEW & CONFIRM */}
                {/* -------------------------------------------------------- */}
                {step === 4 && (
                  <div className={direction === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}>
                    <div className="text-center mb-2.5">
                      <h3 className="text-lg sm:text-xl font-black text-white">Review & Confirm</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5">Confirm your student profile to complete registration.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/15 space-y-2 mb-3 text-xs">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                        <div className="w-9 h-9 rounded-lg bg-sky-500 text-white font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                          {formData.avatarUrl ? (
                            <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            formData.fullName ? formData.fullName.substring(0, 2).toUpperCase() : 'ST'
                          )}
                        </div>
                        <div className="min-w-0">
                          <strong className="text-white text-xs block truncate">{formData.fullName}</strong>
                          <span className="text-slate-400 text-[10px] truncate block">{formData.email} • {formData.mobileNumber}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                        <div><span className="text-slate-400">Board:</span> <strong className="text-white block">{formData.board}</strong></div>
                        <div><span className="text-slate-400">Year:</span> <strong className="text-white block">{formData.year}</strong></div>
                        <div className="col-span-2"><span className="text-slate-400">Junior College:</span> <strong className="text-white block">{formData.collegeName || 'N/A'}</strong></div>
                        <div><span className="text-slate-400">Month & Year:</span> <strong className="text-white block">{formData.studyMonthYear}</strong></div>
                        <div>
                          <span className="text-slate-400">Hall Ticket No:</span>{' '}
                          <strong className="text-white block">
                            {formData.hallTicketNumber || (formData.year === 'Second Year' ? 'Required' : 'Not Provided')}
                          </strong>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-white/10">
                          <span className="text-slate-400">Guardian ({formData.relationship}):</span>{' '}
                          <strong className="text-white">{formData.fatherName}</strong> ({formData.fatherMobile})
                        </div>
                      </div>
                    </div>

                    {/* Terms of Service & Privacy Policy Agreement Checkbox */}
                    <div className="pt-2.5 pb-1 border-t border-white/10 my-2.5">
                      <label 
                        htmlFor="terms-checkbox"
                        className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer select-none group"
                      >
                        <input
                          id="terms-checkbox"
                          type="checkbox"
                          checked={formData.termsAccepted}
                          onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                          className={`w-4 h-4 rounded border ${
                            formErrors.terms ? 'border-rose-400 ring-2 ring-rose-400/50' : 'border-slate-400/70'
                          } bg-white dark:bg-slate-900 text-indigo-600 focus:ring-2 focus:ring-indigo-400 cursor-pointer accent-indigo-600 transition-all shrink-0`}
                        />
                        <span className="font-semibold text-slate-200 text-xs sm:text-[13px] leading-snug">
                          I agree to the{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setLegalModalTab('terms');
                              setLegalModalOpen(true);
                            }}
                            className="font-bold text-[#6366f1] hover:text-[#818cf8] underline-offset-2 hover:underline transition-colors cursor-pointer"
                          >
                            Terms of Service
                          </button>
                          {' '}and{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setLegalModalTab('privacy');
                              setLegalModalOpen(true);
                            }}
                            className="font-bold text-[#6366f1] hover:text-[#818cf8] underline-offset-2 hover:underline transition-colors cursor-pointer"
                          >
                            Privacy Policy
                          </button>
                        </span>
                      </label>
                      {formErrors.terms && (
                        <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold mt-2 animate-fadeIn">
                          <AlertCircle size={14} className="shrink-0" />
                          <span>{formErrors.terms}</span>
                        </div>
                      )}
                    </div>
                    {formErrors.submit && (
                      <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2 mb-2 animate-fadeIn">
                        <AlertCircle size={16} className="shrink-0 text-rose-400" />
                        <span>{formErrors.submit}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2.5 px-3.5 rounded-xl border border-white/20 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-white/10"
                      >
                        <ChevronLeft size={15} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSignUpSubmit}
                        disabled={isSubmitting}
                        className="grow py-2.5 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-sky-500/25 active:scale-[0.98] transition-all"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Sparkles size={15} className="text-amber-300" />
                            <span>Complete Registration 🎉</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* REGISTRATION SUCCESS VIEW */}
            {/* ======================================================== */}
            {regSuccess && (
              <div className="text-center animate-scaleUp py-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 mx-auto flex items-center justify-center mb-4">
                  <Check size={36} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Registration Successful!</h3>
                <p className="text-sm text-slate-300 mb-6">
                  Welcome, <strong className="text-sky-400">{formData.fullName}</strong>! Your academy account is active.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (onClose) onClose();
                    navigate('/profile');
                    setRegSuccess(false);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm cursor-pointer shadow-lg shadow-sky-500/30 active:scale-98 transition-all"
                >
                  View My Student Profile →
                </button>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-20 w-full text-center py-3 text-xs text-slate-400 font-medium">
        © 2026 Maths Learning Academy • Empowering Future Scholars
      </footer>

      {/* Interactive Legal Terms of Service & Privacy Policy Modal */}
      <LegalTermsModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
        onAccept={() => {
          handleInputChange('termsAccepted', true);
        }}
      />
    </div>
  );
}
