import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Menu,
  X,
  PhoneCall,
  GraduationCap,
  ExternalLink,
  LogOut,
  Shield,
  BarChart3,
  Users,
  BookOpen,
  Video,
  Settings,
  Database,
} from 'lucide-react';
import { VisdomBrand } from '../VisdomBrand';

export default function AdminNavbar({
  currentUser = null,
  theme = 'light',
  toggleTheme,
  onLogout,
  activeTab = 'dashboard',
  setActiveTab,
  apiStatus = { online: true, latency: 45 },
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const adminName = currentUser?.name || 'MyMarks Administrator';
  const adminEmail = currentUser?.email || 'md@visdomwaves.com';
  const adminRole = currentUser?.role || 'Administrator';

  const userInitials = adminName
    ? adminName
        .trim()
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AD';

  return (
    <>
      {/* Fixed Header Container containing Top Navbar & Main Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 select-none shadow-sm w-full max-w-full overflow-hidden">
        {/* Chinmaya Vidyalaya Style Top Bar */}
        <div
          className="h-9 px-3 sm:px-6 flex items-center justify-between text-xs text-blue-100 select-none relative z-50 w-full max-w-full overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #1e3a8a, #1d4ed8)' }}
        >
          {/* Left: Contact Info */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <PhoneCall size={11} className="text-amber-300 shrink-0" />
              <a
                href="tel:+917997755155"
                className="text-[10px] sm:text-xs font-semibold hover:text-amber-300 transition-colors"
              >
                +91 79977 55155
              </a>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-blue-100">
              <span className="w-1 h-1 rounded-full bg-blue-300"></span>
              <a
                href="mailto:info@visdomwaves.com"
                className="text-[11px] font-medium hover:text-amber-300 transition-colors"
              >
                info@visdomwaves.com
              </a>
            </span>
          </div>

          {/* Right: Social Links + Board Accreditation Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Social Links - visible only on large desktop */}
            <div className="hidden xl:flex items-center gap-2 text-blue-200">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition-colors p-1"
                title="Facebook"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-300 transition-colors p-1"
                title="Instagram"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-300 transition-colors p-1"
                title="YouTube"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163c-.272-.98-1.04-1.748-2.02-2.02-1.782-.475-8.978-.475-8.978-.475s-7.197 0-8.98.475c-.978.272-1.748 1.04-2.02 2.02-.475 1.783-.475 5.503-.475 5.503s0 3.72.475 5.502c.272.98 1.04 1.748 2.02 2.02 1.783.475 8.98.475 8.98.475s7.197 0 8.98-.475c.98-.272 1.748-1.04 2.02-2.02.475-1.782.475-5.502.475-5.502s0-3.72-.475-5.502zm-14.32 9.005v-7.02l6.127 3.51-6.127 3.51z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition-colors p-1"
                title="LinkedIn"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

            {/* Curriculum Accreditation Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] xs:text-[9.5px] sm:text-[10px] font-bold text-white border border-white/30 bg-white/10 whitespace-nowrap">
              <GraduationCap size={10} className="text-amber-300 shrink-0" />
              <span>AP & TS Board</span>
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div
          className={`transition-all duration-300 w-full max-w-full overflow-hidden ${
            scrolled ? 'shadow-xl shadow-blue-900/15' : ''
          } dark:!bg-slate-900 dark:!border-slate-800`}
          style={{
            background: scrolled ? '#bfdbfe' : '#dbeafe',
            borderBottom: scrolled ? '1px solid #93c5fd' : '1px solid #bfdbfe',
          }}
        >
          <div className="w-full max-w-full px-2.5 xs:px-3 sm:px-6 lg:px-8 relative z-10 flex items-center justify-between gap-1.5 sm:gap-3 h-[60px] xs:h-[66px] sm:h-[80px] md:h-[84px]">
            {/* Left: Visdom Waves Brand Logo Badge + Admin Hub Badge */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="scale-90 xs:scale-95 sm:scale-100 origin-left">
                <VisdomBrand
                  onClick={() => {
                    navigate('/demo');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
              <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/10 dark:bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400">
                <Shield size={13} className="text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-black uppercase tracking-wider">Admin Panel</span>
              </div>
            </div>

            {/* Right: Controls & Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 shrink-0">
              {/* Return to Student Website Action Button - visible on xl screens */}
              <button
                onClick={() => navigate('/demo')}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer shrink-0"
                title="View Main Student Website"
              >
                <span>View Website</span>
                <ExternalLink size={13} className="text-blue-600 dark:text-blue-400" />
              </button>

              {/* Dark / Light Mode Toggle Pill Switch */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative flex items-center w-[48px] sm:w-[54px] h-[26px] sm:h-[30px] rounded-full p-[2px] transition-colors duration-300 border focus:outline-none cursor-pointer shrink-0 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-slate-200/90 border-slate-300/80 shadow-inner'
                }`}
                aria-label="Toggle dark mode"
                title={
                  theme === 'dark'
                    ? 'Switch to Light Mode'
                    : 'Switch to Dark Mode'
                }
              >
                {/* Sliding White Circular Knob */}
                <div
                  className={`absolute top-[2px] w-[20px] sm:w-[24px] h-[20px] sm:h-[24px] bg-white rounded-full shadow-md transition-transform duration-300 ease-out z-0 ${
                    theme === 'dark' ? 'translate-x-[22px] sm:translate-x-[24px]' : 'translate-x-[1px]'
                  }`}
                />
                <div className="relative flex justify-between items-center w-full px-[4px] sm:px-[5px] z-10 pointer-events-none">
                  <Sun
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-amber-500 font-bold'
                    }`}
                  />
                  <Moon
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-indigo-400 font-bold' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>

              {/* Admin Profile Monogram Badge */}
              <div
                className="flex items-center gap-2 p-1 xl:pl-1.5 xl:pr-3 xl:py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs transition-all duration-200 shrink-0 cursor-default"
                title={`Signed in as ${adminName} (${adminEmail})`}
              >
                {/* Monogram Avatar with Status Indicator */}
                <div className="relative shrink-0 flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white text-[11px] sm:text-xs font-bold shadow-2xs ring-1 ring-white dark:ring-slate-800">
                  {userInitials}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-slate-900"></span>
                </div>

                {/* Typography visible only on large screens */}
                <div className="flex-col text-left leading-tight hidden xl:flex max-w-[130px]">
                  <span className="text-[12px] font-bold text-slate-950 dark:text-white truncate tracking-tight">
                    {adminName}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                    {adminRole}
                  </span>
                </div>
              </div>

              {/* Sign Out Button - visible on tablet & desktop */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="hidden md:flex p-2 sm:px-3 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-tight shadow-md transition-all cursor-pointer active:scale-95 items-center justify-center gap-1.5 shrink-0"
                  title="Sign Out of Admin Portal"
                >
                  <LogOut size={14} />
                  <span className="hidden xl:inline">Sign Out</span>
                </button>
              )}

              {/* Mobile & Tablet Hamburger Toggle Button - ALWAYS visible on < lg */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-800 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Off-Canvas Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile & Tablet Slide-Over Menu Bar (Drawer) */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-full sm:w-[350px] max-w-[88vw] bg-[#E6F0FA] dark:bg-[#070B14] border-l border-blue-200 dark:border-slate-800 shadow-2xl flex flex-col p-4 sm:p-5 select-none overflow-y-auto transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Header with Title and Close (X) button */}
        <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-blue-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Shield size={16} />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Admin Panel Menu
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Workspace Navigation
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors shadow-2xs"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Admin Profile Row */}
        <div className="w-full py-2.5 px-3 rounded-2xl bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium text-xs flex items-center justify-between shadow-2xs mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white text-xs font-bold shadow-xs">
              {userInitials}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-slate-900"></span>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                {adminName}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {adminRole}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="space-y-1.5 mb-3 flex-1">
          <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Navigation Sections
          </div>
          {[
            { id: 'dashboard', label: 'Overview & Analytics', icon: BarChart3 },
            { id: 'students', label: 'Students Directory', icon: Users },
            { id: 'courses', label: 'Curriculum & Subjects', icon: BookOpen },
            { id: 'videos', label: 'Videos, YouTube & Links', icon: Video },
            { id: 'settings', label: 'Platform Controls', icon: Settings },
          ].map((item) => {
            const isActive = activeTab === item.id;
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  setMobileMenuOpen(false);
                  const workspace = document.querySelector("#admin-workspace-scroll");
                  if (workspace) workspace.scrollTo({ top: 0, behavior: "smooth" });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-1 ring-blue-500'
                    : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ItemIcon
                    size={16}
                    className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}
                  />
                  <span>{item.label}</span>
                </span>
                {isActive && (
                  <span className="text-[10px] uppercase font-black tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Status & Settings Cards */}
        <div className="space-y-2 pt-2 border-t border-blue-200/80 dark:border-slate-800 mt-auto">
          {/* Database Live Status Row */}
          <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-blue-200/90 dark:border-slate-800 flex items-center justify-between text-xs shadow-2xs">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Database size={14} className="text-emerald-500" />
              <span>MongoDB Database</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {apiStatus?.online ? `${apiStatus?.latency || 45}ms` : 'Offline'}
            </span>
          </div>

          {/* View Website Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/demo');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <span>Visit Main Student Website</span>
            <ExternalLink size={14} className="text-blue-600 dark:text-blue-400" />
          </button>

          {/* Mobile Dark/Light Toggle */}
          <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Appearance Mode
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative flex items-center w-[50px] h-[28px] rounded-full p-[2px] transition-colors duration-300 border focus:outline-none cursor-pointer shrink-0 ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-slate-200/90 border-slate-300/80 shadow-inner'
              }`}
            >
              <div
                className={`absolute top-[2px] w-[22px] h-[22px] bg-white rounded-full shadow-md transition-transform duration-300 ease-out z-0 ${
                  theme === 'dark' ? 'translate-x-[22px]' : 'translate-x-[1px]'
                }`}
              />
              <div className="relative flex justify-between items-center w-full px-[5px] z-10 pointer-events-none">
                <Sun
                  className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-amber-500 font-bold'
                  }`}
                />
                <Moon
                  className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-indigo-400 font-bold' : 'text-slate-400'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Sign Out Button in Drawer */}
          {onLogout && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <LogOut size={14} className="text-white" />
              <span>Sign Out of Admin Portal</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
