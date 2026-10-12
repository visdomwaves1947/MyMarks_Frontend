import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Sparkles,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Shield,
  ChevronRight,
  Video,
  Copy,
  Check,
  Calculator,
  Atom,
  FlaskConical,
  Sprout,
  HeartPulse,
  Languages,
  Radio,
  Lock,
  FileCheck2,
  Target
} from 'lucide-react';

export default function ProfilePage({
  currentUser,
  onLogout,
  onOpenBooking,
  onOpenSignIn,
  onOpenSignUp
}) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [copiedRoll, setCopiedRoll] = useState(false);

  // Exact student credentials & profile data
  const studentData = {
    initials: 'RV',
    name: currentUser?.name || currentUser?.fullName || 'Rangineni Varun Bhargav',
    email: currentUser?.email || 'varun@gmail.com',
    mobile: currentUser?.mobile || currentUser?.mobileNumber || '+91 98765 43210',
    role: currentUser?.role || 'MATH SCHOLAR',
    board: currentUser?.board || 'Andhra Pradesh Intermediate',
    year: currentUser?.year || 'First Year',
    collegeName: currentUser?.collegeName || 'Narayana Junior College, Vijayawada',
    hallTicketNumber: currentUser?.hallTicketNumber || '2604819230',
    studyMonthYear: currentUser?.studyMonthYear || 'June, 2025 - March, 2026',
    fatherName: currentUser?.fatherName || 'C. Venkateswara Rao',
    fatherMobile: currentUser?.fatherMobile || '+91 98765 43211',
    relationship: currentUser?.relationship || 'Father',
    status: 'Active Student',
    avatarUrl: currentUser?.avatarUrl || ''
  };

  const handleCopyRoll = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(studentData.hallTicketNumber);
      setCopiedRoll(true);
      setTimeout(() => setCopiedRoll(false), 2000);
    }
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/demo');
  };

  return (
    <div className="min-h-[calc(100vh-86px)] bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 transition-colors duration-300 py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Container */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate('/demo')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-all cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-cyan-300 text-xs font-semibold shadow-2xs">
              <Sparkles size={13} className="text-blue-600 dark:text-cyan-400" />
              <span>Academic Year 2025–2026</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{studentData.status}</span>
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* HERO PROFILE CARD WITH BRIGHT VISIBLE COVER BANNER       */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-xl transition-all hover:shadow-2xl">
          
          {/* 1. Bright & Clear Cover Photo Banner */}
          <div 
            className="h-36 sm:h-48 w-full bg-cover bg-center relative overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0.65) 100%), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-indigo-900/40 pointer-events-none" />
            
            {/* Top Right Campus & Academic Badge */}
            <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-lg">
              <Building2 size={13} className="text-cyan-300" />
              <span>{studentData.collegeName}</span>
            </div>
          </div>

          {/* 2. Main Profile Content Row with Overlapping Avatar */}
          <div className="relative z-10 px-5 sm:px-8 pb-6 sm:pb-8 pt-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              
              {/* Left Section: Avatar (Overlapping) + Identity Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-5 -mt-14 sm:-mt-16">
                
                {/* RV Avatar Badge */}
                <div className="relative shrink-0 group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-xl shadow-blue-950/40 ring-4 ring-white dark:ring-[#111827] group-hover:scale-105 transition-all duration-300">
                    {studentData.avatarUrl ? (
                      <img
                        src={studentData.avatarUrl}
                        alt={studentData.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <span className="tracking-tight select-none">{studentData.initials}</span>
                    )}
                  </div>

                  {/* Live Online Active Pulse Dot */}
                  <span 
                    className="absolute -bottom-1 -right-1 flex h-4 w-4" 
                    title="Active Student"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-xs"></span>
                  </span>
                </div>

                {/* Student Identity Information */}
                <div className="space-y-1.5 pt-2 sm:pt-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                      {studentData.name}
                    </h1>
                    
                    {/* MATH SCHOLAR BADGE */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-xs shadow-blue-500/25">
                      <Award size={13} className="text-amber-300" />
                      <span>{studentData.role}</span>
                    </span>
                  </div>

                  {/* Email, Phone & Active Status */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <a 
                      href={`mailto:${studentData.email}`} 
                      className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors"
                    >
                      <Mail size={13.5} className="text-blue-500 shrink-0" />
                      <span>{studentData.email}</span>
                    </a>

                    <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

                    <a 
                      href={`tel:${studentData.mobile}`}
                      className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <Phone size={13.5} className="text-emerald-500 shrink-0" />
                      <span>{studentData.mobile}</span>
                    </a>
                  </div>

                  {/* Status & Board Badges */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80 shadow-2xs">
                      <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                      <span>{studentData.status}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                      <GraduationCap size={13} className="text-blue-600 dark:text-cyan-400" />
                      <span>{studentData.board}</span>
                    </span>
                  </div>

                </div>
              </div>

              {/* Right Section: Action Buttons */}
              <div className="flex flex-col sm:flex-row md:flex-col items-center justify-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                {/* Book 1-on-1 Mentorship */}
                <button
                  onClick={() => onOpenBooking ? onOpenBooking('1-on-1 Mentorship') : navigate('/demo')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <Video size={15} />
                  <span>Book 1-on-1 Mentorship</span>
                </button>

                {/* Log Out */}
                <button
                  id="logout-button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
                  title="Log Out of Account"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* STATS & METRICS GRID (BRIGHT, CRISP, VISIBLE PICTURES)   */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* 1. Target Score Card (Mathematics Geometry Blueprint - Clearly Visible) */}
          <div 
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-blue-400/40"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.90) 0%, rgba(30, 58, 138, 0.50) 55%, rgba(30, 58, 138, 0.15) 100%), url('https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-black/40 backdrop-blur-md text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs border border-white/20">
                <Target size={22} className="text-cyan-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-100 drop-shadow-xs">
                  Target Score
                </p>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  75 / 75
                </p>
              </div>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden relative z-10 border border-white/10">
              <div className="h-full bg-cyan-300 rounded-full w-full"></div>
            </div>
            <p className="text-[10px] text-blue-100 mt-1 font-semibold relative z-10 drop-shadow-xs">
              100% Target Mastery (MPC)
            </p>
          </div>

          {/* 2. Practice Score Card (Exam Testing - Clearly Visible) */}
          <div 
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-emerald-400/40"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(6, 78, 59, 0.90) 0%, rgba(5, 150, 105, 0.50) 55%, rgba(5, 150, 105, 0.15) 100%), url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-black/40 backdrop-blur-md text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs border border-white/20">
                <TrendingUp size={22} className="text-emerald-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 drop-shadow-xs">
                  Practice Score
                </p>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  98% <span className="text-xs font-bold text-emerald-200">(A+)</span>
                </p>
              </div>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden relative z-10 border border-white/10">
              <div className="h-full bg-emerald-300 rounded-full w-[98%]"></div>
            </div>
            <p className="text-[10px] text-emerald-100 mt-1 font-semibold relative z-10 drop-shadow-xs">
              Top 2% Board Rank Tier
            </p>
          </div>

          {/* 3. Class Attendance Card (Lecture Academy - Clearly Visible) */}
          <div 
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-purple-400/40"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(88, 28, 135, 0.90) 0%, rgba(126, 34, 206, 0.50) 55%, rgba(126, 34, 206, 0.15) 100%), url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-black/40 backdrop-blur-md text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs border border-white/20">
                <Clock size={22} className="text-purple-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-purple-100 drop-shadow-xs">
                  Class Attendance
                </p>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  96% <span className="text-xs font-semibold text-purple-200">Completed</span>
                </p>
              </div>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden relative z-10 border border-white/10">
              <div className="h-full bg-purple-300 rounded-full w-[96%]"></div>
            </div>
            <p className="text-[10px] text-purple-100 mt-1 font-semibold relative z-10 drop-shadow-xs">
              48 of 50 Live Labs Attended
            </p>
          </div>

          {/* 4. Chapters Covered Card (Syllabus & Books - Clearly Visible) */}
          <div 
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-amber-400/40"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(146, 64, 14, 0.90) 0%, rgba(217, 119, 6, 0.50) 55%, rgba(217, 119, 6, 0.15) 100%), url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-black/40 backdrop-blur-md text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs border border-white/20">
                <BookOpen size={22} className="text-amber-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-100 drop-shadow-xs">
                  Chapters Covered
                </p>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  14 / 16 <span className="text-xs font-semibold text-amber-200">Units</span>
                </p>
              </div>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full mt-3 overflow-hidden relative z-10 border border-white/10">
              <div className="h-full bg-amber-300 rounded-full w-[87.5%]"></div>
            </div>
            <p className="text-[10px] text-amber-100 mt-1 font-semibold relative z-10 drop-shadow-xs">
              87.5% Complete (2 Units Left)
            </p>
          </div>

        </div>

        {/* ======================================================== */}
        {/* TWO COLUMN DETAIL LAYOUT                                 */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (7 cols): Academic Credentials & Enrolled Curriculum */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Academic & College Credentials Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
              {/* Background Campus Architecture - Clear & Visible with Soft Vignette */}
              <div 
                className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 dark:opacity-25"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white/95 dark:from-[#111827]/70 dark:via-[#111827]/85 dark:to-[#111827]/95 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between pb-4 mb-5 border-b border-slate-100/80 dark:border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                  <span>Academic & College Credentials</span>
                </h2>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800/80">
                  Verified Records
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* State Education Board */}
                <div className="p-4 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 backdrop-blur-md shadow-2xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">State Education Board</span>
                  <strong className="text-slate-900 dark:text-white text-sm font-semibold flex items-center gap-1.5">
                    <Shield size={14} className="text-blue-500 shrink-0" />
                    <span>{studentData.board}</span>
                  </strong>
                </div>

                {/* Class / Academic Year */}
                <div className="p-4 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 backdrop-blur-md shadow-2xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Class / Academic Year</span>
                  <strong className="text-slate-900 dark:text-white text-sm font-semibold flex items-center gap-1.5">
                    <GraduationCap size={14} className="text-indigo-500 shrink-0" />
                    <span>{studentData.year}</span>
                  </strong>
                </div>

                {/* Junior College Name */}
                <div className="p-4 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 sm:col-span-2 backdrop-blur-md shadow-2xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Junior College Name</span>
                  <strong className="text-slate-900 dark:text-white text-sm font-semibold flex items-center gap-2">
                    <Building2 size={16} className="text-blue-600 dark:text-cyan-400 shrink-0" />
                    <span>{studentData.collegeName}</span>
                  </strong>
                </div>

                {/* Hall Ticket / Roll No with Click-to-Copy */}
                <div className="p-4 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between backdrop-blur-md shadow-2xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Hall Ticket / Roll No</span>
                    <strong className="text-slate-900 dark:text-slate-100 text-sm font-mono font-bold tracking-wider">
                      {studentData.hallTicketNumber}
                    </strong>
                  </div>
                  <button
                    onClick={handleCopyRoll}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
                    title="Copy Hall Ticket Number"
                  >
                    {copiedRoll ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Month & Year of Study */}
                <div className="p-4 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 backdrop-blur-md shadow-2xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">Month & Year of Study</span>
                  <strong className="text-slate-900 dark:text-white text-sm font-semibold flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-600 dark:text-cyan-400 shrink-0" />
                    <span>{studentData.studyMonthYear}</span>
                  </strong>
                </div>

                {/* Guardian Details (Father) */}
                <div className="p-4 rounded-2xl bg-white/85 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 backdrop-blur-md shadow-2xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium block mb-1">
                      Guardian Details ({studentData.relationship})
                    </span>
                    <strong className="text-slate-900 dark:text-white text-sm font-semibold">
                      {studentData.fatherName}
                    </strong>
                    <span className="text-slate-600 dark:text-slate-300 text-xs ml-2 font-mono">
                      ({studentData.fatherMobile})
                    </span>
                  </div>
                  <a
                    href={`tel:${studentData.fatherMobile}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-semibold text-xs border border-blue-200 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors self-start sm:self-center shadow-2xs"
                  >
                    <Phone size={12} />
                    <span>Contact</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Enrolled Intermediate Curriculum Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
              <div className="relative z-10 flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <BookOpen size={18} />
                  </div>
                  <span>Enrolled Intermediate Curriculum</span>
                </h2>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                  6 Subjects Active
                </span>
              </div>

              {/* 6 Subject Picture Cards - Ultra Bright, Crisp, Completely Visible */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[
                  { 
                    name: 'Mathematics', 
                    desc: '1A, 1B, 2A, 2B', 
                    route: '/maths',
                    icon: <Calculator size={15} />,
                    bgImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop',
                    accentColor: 'border-blue-400'
                  },
                  { 
                    name: 'Physics', 
                    desc: 'Theory & Labs', 
                    route: '/physics',
                    icon: <Atom size={15} />,
                    bgImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop',
                    accentColor: 'border-purple-400'
                  },
                  { 
                    name: 'Chemistry', 
                    desc: 'Organic & Inorganic', 
                    route: '/chemistry',
                    icon: <FlaskConical size={15} />,
                    bgImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop',
                    accentColor: 'border-emerald-400'
                  },
                  { 
                    name: 'Botany', 
                    desc: 'Plant Anatomy & Cell', 
                    route: '/botany',
                    icon: <Sprout size={15} />,
                    bgImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop',
                    accentColor: 'border-green-400'
                  },
                  { 
                    name: 'Zoology', 
                    desc: 'Human Physiology', 
                    route: '/zoology',
                    icon: <HeartPulse size={15} />,
                    bgImage: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=600&auto=format&fit=crop',
                    accentColor: 'border-cyan-400'
                  },
                  { 
                    name: 'Sanskrit', 
                    desc: 'Poetry & Grammar', 
                    route: '/sanskrit',
                    icon: <Languages size={15} />,
                    bgImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
                    accentColor: 'border-amber-400'
                  },
                ].map((subject, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(subject.route)}
                    className={`relative overflow-hidden h-36 sm:h-40 rounded-2xl border ${subject.accentColor} transition-all duration-300 text-left group cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 text-white flex flex-col justify-between p-3.5`}
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.40) 50%, rgba(15, 23, 42, 0.05) 100%), url('${subject.bgImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Top Bar with Icon & Arrow */}
                    <div className="flex items-center justify-between w-full relative z-10">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/50 backdrop-blur-md text-white shadow-xs group-hover:scale-110 transition-transform border border-white/20">
                        {subject.icon}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-cyan-500 transition-colors">
                        <ChevronRight size={13} className="text-white transition-all" />
                      </div>
                    </div>

                    {/* Bottom Label with High Contrast Readability */}
                    <div className="relative z-10 pt-2">
                      <div className="text-sm sm:text-base font-extrabold text-white group-hover:text-cyan-200 transition-colors drop-shadow-md">
                        {subject.name}
                      </div>
                      <p className="text-[10.5px] text-slate-200 mt-0.5 leading-tight font-medium drop-shadow-sm">
                        {subject.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Live Class, Practice, and Account Management */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Class & Problem Sets Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
              <div className="relative z-10 flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <span>Live Class & Problem Sets</span>
                </h2>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                  <Radio size={11} className="animate-pulse" />
                  <span>Live Soon</span>
                </span>
              </div>

              <div className="relative z-10 space-y-3.5 text-xs">
                
                {/* 1. Next Live Class with Broadcast Studio Background - Clearly Visible */}
                <div 
                  className="relative overflow-hidden p-4 sm:p-5 rounded-2xl text-white shadow-md border border-blue-400/50 group hover:shadow-lg transition-all"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(30, 58, 138, 0.50) 55%, rgba(30, 58, 138, 0.15) 100%), url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                    <span className="text-[10.5px] font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1.5 drop-shadow-xs">
                      <Sparkles size={12} className="text-cyan-300" />
                      <span>Upcoming Live Class</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500 text-white font-bold text-[10px] shadow-xs animate-pulse">
                      Join in 35m
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-white text-xs sm:text-sm mb-1 leading-snug relative z-10 drop-shadow-sm">
                    Math 1A: Calculus & Functions (Limits & Continuity)
                  </h3>
                  
                  <p className="text-[11px] text-blue-100 leading-relaxed mb-3 relative z-10 drop-shadow-xs">
                    Live with Senior Board Faculty • Direct 1-on-1 doubt clearing
                  </p>

                  <button
                    onClick={() => onOpenBooking ? onOpenBooking('Math 1A Live Class') : navigate('/maths')}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 relative z-10"
                  >
                    <Video size={14} />
                    <span>Enter Live Classroom</span>
                  </button>
                </div>

                {/* 2. Practice Homework Set #4 - Clear Visible Wallpaper */}
                <div 
                  className="relative overflow-hidden p-4 rounded-2xl border border-emerald-400/40 text-white shadow-xs group hover:shadow-md transition-all"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(6, 78, 59, 0.92) 0%, rgba(6, 78, 59, 0.45) 55%, rgba(6, 78, 59, 0.15) 100%), url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 relative z-10">
                    <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1 drop-shadow-xs">
                      <FileCheck2 size={12} />
                      <span>Practice Problem Set #4</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-extrabold font-mono text-xs border border-emerald-300">
                      A+ (98%)
                    </span>
                  </div>
                  <p className="text-[11.5px] text-white font-medium leading-relaxed relative z-10 drop-shadow-xs">
                    AP Intermediate 7-Mark & 4-Mark Solved Blueprint Set
                  </p>
                </div>

                {/* 3. State Mock Test #2 - Clear Visible Wallpaper */}
                <div 
                  className="relative overflow-hidden p-4 rounded-2xl border border-blue-400/40 text-white shadow-xs group hover:shadow-md transition-all"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(30, 58, 138, 0.92) 0%, rgba(30, 58, 138, 0.45) 55%, rgba(30, 58, 138, 0.15) 100%), url('https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 relative z-10">
                    <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider flex items-center gap-1 drop-shadow-xs">
                      <Award size={12} />
                      <span>State Mock Test #2</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/90 text-white font-extrabold font-mono text-xs border border-blue-300">
                      72 / 75
                    </span>
                  </div>
                  <p className="text-[11.5px] text-white font-medium leading-relaxed relative z-10 drop-shadow-xs">
                    Top 2% Percentile in AP & TS Board benchmark
                  </p>
                </div>

              </div>
            </div>

            {/* Account Management Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 transition-all hover:shadow-md">
              {/* Security Shield Grid Background - Clearly Visible */}
              <div 
                className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 dark:opacity-25"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white/95 dark:from-[#111827]/70 dark:via-[#111827]/85 dark:to-[#111827]/95 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between pb-4 mb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <span>Account Management</span>
                </h2>
                <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Lock size={11} />
                  <span>256-bit SSL</span>
                </span>
              </div>

              <p className="relative z-10 text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Manage your authenticated student session and security settings.
              </p>

              {/* Log Out of Account Button */}
              <div className="relative z-10">
                <button
                  type="button"
                  id="logout-button-card"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100/90 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-rose-200 dark:border-rose-900/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-[0.99]"
                >
                  <LogOut size={16} />
                  <span>Log Out of Account</span>
                </button>
                
                <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-3 font-medium">
                  Student session secured with 256-bit SSL encryption.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* LOGOUT CONFIRMATION MODAL                                */}
      {/* ======================================================== */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-sm w-full bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
              <LogOut size={26} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">Confirm Sign Out</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Are you sure you want to log out of your student account?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="grow py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogoutAction}
                className="grow py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
