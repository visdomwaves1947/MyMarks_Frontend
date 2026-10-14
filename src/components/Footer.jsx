import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  Phone, 
  ArrowUp,
  ChevronRight
} from 'lucide-react';
import LegalTermsModal from './LegalTermsModal';

// Social Icon SVGs
function FacebookIcon({ className = "h-3 w-3" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 320 512" shapeRendering="geometricPrecision">
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

function TwitterXIcon({ className = "h-3 w-3" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 512 512" shapeRendering="geometricPrecision">
      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-3 w-3" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 448 512" shapeRendering="geometricPrecision">
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function YouTubeIcon({ className = "h-3 w-3" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 576 512" shapeRendering="geometricPrecision">
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
    </svg>
  );
}

export default function Footer({ onOpenBooking }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('terms');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (e, href) => {
    e.preventDefault();
    if (!href || href === '#') {
      scrollToTop();
      return;
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) {
      window.location.href = href;
      return;
    }
    if (href.startsWith('#')) {
      if (location.pathname.toLowerCase().includes('demo')) {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(`/demo${href}`);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#fef08a] text-slate-950 transition-colors select-none antialiased subpixel-antialiased">
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes ringFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.015); }
        }
        @keyframes redPulse {
          0%, 100% { box-shadow: 0 4px 14px -2px rgba(220, 38, 38, 0.25); }
          50% { box-shadow: 0 8px 20px -2px rgba(220, 38, 38, 0.4); }
        }
        .animate-ring-float {
          animation: ringFloat 5s ease-in-out infinite;
        }
        .animate-red-pulse {
          animation: redPulse 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Top Red Flowing Wave Banner (Ultra Crisp HD Vector) */}
      <div className="relative w-full overflow-hidden leading-none z-10">
        <svg 
          viewBox="0 0 1440 70" 
          className="w-full h-7 sm:h-9 md:h-11 lg:h-13 object-fill block"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id="footerRedBack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="30%" stopColor="#991b1b" />
              <stop offset="70%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <linearGradient id="footerRedFront" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="20%" stopColor="#dc2626" />
              <stop offset="60%" stopColor="#ef4444" />
              <stop offset="85%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <filter id="waveShadow" x="-5%" y="-5%" width="110%" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7f1d1d" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Layer 1: Dark crimson back wave */}
          <path 
            d="M 0 0 L 1440 0 L 1440 32 Q 1120 65 760 32 T 0 55 Z" 
            fill="url(#footerRedBack)" 
          />

          {/* Layer 2: Main bright red curved wave */}
          <path 
            d="M 0 0 L 1440 0 L 1440 20 Q 1060 52 680 25 T 0 40 Z" 
            fill="url(#footerRedFront)"
            filter="url(#waveShadow)"
          />
        </svg>
      </div>

      {/* Main Content Area (Crisp 4K HD Contrast, Less Font Weight) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-4 sm:pb-5 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Concentric Red Ring Badge with Slender Thickness */}
          <div className="lg:col-span-3 xl:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex flex-row sm:flex-col items-center gap-3.5 sm:gap-2.5">
              
              {/* Concentric Double Red Circle Ring (Slender Thickness & Weight) */}
              <div 
                onClick={scrollToTop}
                className="relative cursor-pointer group animate-ring-float shrink-0"
                title="Back to top"
              >
                {/* Outer Ring: Slender, Refined Thickness (p-[2.5px] instead of chunky padding) */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-red-600 p-[2.5px] sm:p-[3px] shadow-md animate-red-pulse transition-transform duration-200 group-hover:scale-105 flex items-center justify-center ring-1 ring-red-400/30">
                  
                  {/* Inner Crisp White Hub */}
                  <div className="w-full h-full rounded-full bg-white shadow-2xs flex flex-col items-center justify-center p-1.5 relative overflow-hidden group-hover:bg-slate-50 transition-colors">
                    {/* Brand Logo Emblem */}
                    <img 
                      src="/logomymarks.png" 
                      alt="MyMarks Logo" 
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain transform-gpu group-hover:scale-105 transition-transform duration-200 [image-rendering:-webkit-optimize-contrast]" 
                    />

                    {/* Micro Brand Label (Clean, Less Weight) */}
                    <span className="text-[9px] sm:text-[9.5px] font-semibold text-slate-950 tracking-wider mt-0.5 font-sans leading-none">
                      MY <span className="text-red-600 font-semibold">MARKS</span>
                    </span>
                  </div>

                </div>

                {/* Subtle Floating Ground Shadow */}
                <div className="w-11 sm:w-13 h-1 bg-red-900/15 rounded-full blur-[2px] mx-auto mt-1" />
              </div>

              {/* Brand Meta & Social Links (Clear High Definition) */}
              <div className="flex flex-col items-start sm:items-center lg:items-start">
                <div className="flex items-center gap-1 text-[11px] font-normal text-slate-600">
                  <span>powered by</span>
                  <img src="/Visdomlogo.png" alt="Visdom Waves" className="h-2.5 w-auto object-contain [image-rendering:-webkit-optimize-contrast]" />
                  <span className="font-medium text-slate-900">Visdom Waves</span>
                </div>
                
                {/* Social Circle Badges */}
                <div className="flex items-center gap-2 pt-1.5 sm:pt-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="h-7 w-7 rounded-full bg-white/90 text-red-700 border border-amber-600/40 hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-110 shadow-2xs transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter X"
                    className="h-7 w-7 rounded-full bg-white/90 text-red-700 border border-amber-600/40 hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-110 shadow-2xs transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <TwitterXIcon />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="h-7 w-7 rounded-full bg-white/90 text-red-700 border border-amber-600/40 hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-110 shadow-2xs transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="h-7 w-7 rounded-full bg-white/90 text-red-700 border border-amber-600/40 hover:bg-red-600 hover:text-white hover:border-red-600 hover:scale-110 shadow-2xs transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <YouTubeIcon />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Columns: Useful & Interrelated Links (High Clarity, Less Font Weight) */}
          <div className="lg:col-span-9 xl:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6 pt-1">
            
            {/* Column 1: Intermediate Subjects */}
            <div>
              <h3 className="text-slate-950 font-semibold text-[11px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-2.5 flex items-center gap-1.5 border-b border-amber-600/30 pb-1">
                <span className="w-1 h-3 bg-red-600 rounded-full inline-block"></span>
                <span>Subjects</span>
              </h3>
              <ul className="space-y-1.5 text-xs font-medium text-slate-900">
                <li>
                  <a 
                    href="/maths" 
                    onClick={(e) => handleNavigation(e, '/maths')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Mathematics</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/physics" 
                    onClick={(e) => handleNavigation(e, '/physics')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Physics</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/chemistry" 
                    onClick={(e) => handleNavigation(e, '/chemistry')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Chemistry</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/botany" 
                    onClick={(e) => handleNavigation(e, '/botany')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Botany & Zoology</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/english" 
                    onClick={(e) => handleNavigation(e, '/english')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Languages</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Tools & Practice */}
            <div>
              <h3 className="text-slate-950 font-semibold text-[11px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-2.5 flex items-center gap-1.5 border-b border-amber-600/30 pb-1">
                <span className="w-1 h-3 bg-red-600 rounded-full inline-block"></span>
                <span>Practice & Tools</span>
              </h3>
              <ul className="space-y-1.5 text-xs font-medium text-slate-900">
                <li>
                  <a 
                    href="/demo#interactive-lab" 
                    onClick={(e) => handleNavigation(e, '/demo#interactive-lab')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Virtual Labs</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo#speed-quiz" 
                    onClick={(e) => handleNavigation(e, '/demo#speed-quiz')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Speed Quizzes</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo#courses" 
                    onClick={(e) => handleNavigation(e, '/demo#courses')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Mock Exams</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo#faq" 
                    onClick={(e) => handleNavigation(e, '/demo#faq')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Board Papers</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo#methodology" 
                    onClick={(e) => handleNavigation(e, '/demo#methodology')}
                    className="group flex items-center gap-1 hover:text-red-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-red-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Concept Proofs</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Booking */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-slate-950 font-semibold text-[11px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-2.5 flex items-center gap-1.5 border-b border-amber-600/30 pb-1">
                <span className="w-1 h-3 bg-red-600 rounded-full inline-block"></span>
                <span>Contact & Support</span>
              </h3>
              <ul className="space-y-1.5 text-xs font-medium text-slate-900">
                <li className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>Hyderabad, Telangana</span>
                </li>
                <li>
                  <a 
                    href="mailto:info@visdomwaves.com" 
                    className="flex items-center gap-1.5 hover:text-red-600 transition-colors break-all"
                  >
                    <Mail className="h-3.5 w-3.5 text-red-600 shrink-0" />
                    <span>info@visdomwaves.com</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+917997755155" 
                    className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-red-600 shrink-0" />
                    <span>+91 79977 55155</span>
                  </a>
                </li>
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-medium text-xs tracking-tight shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Book 1-on-1 Free Class</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* Motivational Caption Banner: SPEND LESS TIME. GAIN MORE MARKS. */}
      <div className="w-full border-t border-amber-500/40 bg-gradient-to-r from-amber-400/25 via-amber-400/55 to-amber-400/25 py-2 sm:py-2.5 px-3 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 select-none">
          <div className="h-[1px] w-6 sm:w-16 md:w-24 bg-gradient-to-r from-transparent to-red-600/50 shrink" />
          <p className="text-[10.5px] xs:text-[11.5px] sm:text-xs md:text-sm lg:text-[14.5px] font-bold text-red-800 uppercase tracking-[0.16em] sm:tracking-[0.24em] md:tracking-[0.28em] font-sans whitespace-nowrap text-center leading-none antialiased">
            SPEND LESS TIME. GAIN MORE MARKS.
          </p>
          <div className="h-[1px] w-6 sm:w-16 md:w-24 bg-gradient-to-l from-transparent to-red-600/50 shrink" />
        </div>
      </div>

      {/* Solid Red Bottom Stripe (High-Contrast Crisp White Text, Refined Weight) */}
      <div className="bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white shadow-inner antialiased">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3 text-[11px] sm:text-xs text-white/95 font-normal">
          
          {/* Copyright */}
          <p className="text-center sm:text-left tracking-tight font-normal text-white/95">
            © {new Date().getFullYear()} MyMarks Academy • Visdom Waves Innovations. All rights reserved.
          </p>

          {/* Quick Legal Links */}
          <div className="flex items-center gap-2.5 font-medium text-white/95">
            <a 
              href="/aboutus" 
              onClick={(e) => handleNavigation(e, '/aboutus')}
              className="hover:text-amber-200 hover:underline transition-colors font-medium"
            >
              About Us
            </a>
            <span className="text-red-300">•</span>
            <a 
              href="/contactus" 
              onClick={(e) => handleNavigation(e, '/contactus')}
              className="hover:text-amber-200 hover:underline transition-colors font-medium"
            >
              Contact Us
            </a>
            <span className="text-red-300">•</span>
            <button 
              type="button"
              onClick={() => {
                setLegalModalTab('privacy');
                setLegalModalOpen(true);
              }}
              className="hover:text-amber-200 hover:underline transition-colors cursor-pointer font-medium"
            >
              Privacy Policy
            </button>
            <span className="text-red-300">•</span>
            <button 
              type="button"
              onClick={() => {
                setLegalModalTab('terms');
                setLegalModalOpen(true);
              }}
              className="hover:text-amber-200 hover:underline transition-colors cursor-pointer font-medium"
            >
              Terms
            </button>
          </div>

        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md hover:shadow-lg border border-red-500/80 text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200 flex items-center justify-center focus:outline-none cursor-pointer group hover:scale-105 active:scale-95"
        >
          <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Interactive Legal Terms of Service & Privacy Policy Modal */}
      <LegalTermsModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </footer>
  );
}
