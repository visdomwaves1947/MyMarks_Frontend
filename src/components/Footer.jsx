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

    // Handle group navigation e.g. /demo?group=mpc#courses
    const groupMatch = href.match(/[?&]group=([a-z0-9]+)/i);
    if (groupMatch) {
      const group = groupMatch[1].toLowerCase();
      window.dispatchEvent(new CustomEvent("selectIntermediateGroup", { detail: group }));
      if (location.pathname.toLowerCase().includes('demo') || location.pathname === '/') {
        const el = document.getElementById('courses');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        navigate(href, { replace: true });
        return;
      }
    }

    if (href.startsWith('#')) {
      if (location.pathname.toLowerCase().includes('demo') || location.pathname === '/') {
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#cde4fd] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 border-t border-blue-300/80 dark:border-slate-800 transition-colors select-none antialiased subpixel-antialiased">
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes ringFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-3px) scale(1.015); }
        }
        @keyframes bluePulse {
          0%, 100% { box-shadow: 0 4px 14px -2px rgba(37, 99, 235, 0.25); }
          50% { box-shadow: 0 8px 20px -2px rgba(37, 99, 235, 0.45); }
        }
        .animate-ring-float {
          animation: ringFloat 5s ease-in-out infinite;
        }
        .animate-blue-pulse {
          animation: bluePulse 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Top Blue Flowing Wave Banner (Ultra Crisp HD Vector) */}
      <div className="relative w-full overflow-hidden leading-none z-10">
        <svg 
          viewBox="0 0 1440 70" 
          className="w-full h-7 sm:h-9 md:h-11 lg:h-13 object-fill block"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id="footerBlueBack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#172554" />
              <stop offset="30%" stopColor="#1e3a8a" />
              <stop offset="70%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="footerBlueFront" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="20%" stopColor="#2563eb" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="85%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <filter id="waveShadow" x="-5%" y="-5%" width="110%" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1e3a8a" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Layer 1: Dark navy back wave */}
          <path 
            d="M 0 0 L 1440 0 L 1440 32 Q 1120 65 760 32 T 0 55 Z" 
            fill="url(#footerBlueBack)" 
          />

          {/* Layer 2: Main bright blue curved wave */}
          <path 
            d="M 0 0 L 1440 0 L 1440 20 Q 1060 52 680 25 T 0 40 Z" 
            fill="url(#footerBlueFront)"
            filter="url(#waveShadow)"
          />
        </svg>
      </div>

      {/* Main Content Area (Crisp 4K HD Contrast, Less Font Weight) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-4 sm:pb-5 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Concentric Blue Ring Badge with Slender Thickness */}
          <div className="lg:col-span-3 xl:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex flex-row sm:flex-col items-center gap-3.5 sm:gap-2.5">
              
              {/* Concentric Double Blue Circle Ring (Slender Thickness & Weight) */}
              <div 
                onClick={scrollToTop}
                className="relative cursor-pointer group animate-ring-float shrink-0"
                title="Back to top"
              >
                {/* Outer Ring: Slender, Refined Thickness (p-[2.5px] instead of chunky padding) */}
                <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-blue-600 p-[2.5px] sm:p-[3px] shadow-md animate-blue-pulse transition-transform duration-200 group-hover:scale-105 flex items-center justify-center ring-1 ring-blue-400/30">
                  
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
                      MY <span className="text-blue-600 font-semibold">MARKS</span>
                    </span>
                  </div>

                </div>

                {/* Subtle Floating Ground Shadow */}
                <div className="w-11 sm:w-13 h-1 bg-blue-900/15 rounded-full blur-[2px] mx-auto mt-1" />
              </div>

              {/* Brand Meta & Social Links (Clear High Definition) */}
              <div className="flex flex-col items-start sm:items-center lg:items-start">
                <div className="flex items-center gap-1 text-[11px] font-normal text-slate-600 dark:text-slate-400">
                  <span>powered by</span>
                  <img src="/Visdomlogo.png" alt="Visdom Waves" className="h-2.5 w-auto object-contain [image-rendering:-webkit-optimize-contrast]" />
                  <span className="font-semibold text-slate-900 dark:text-white">Visdom Waves</span>
                </div>
                
                {/* Social Circle Badges */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="h-7 w-7 rounded-full bg-slate-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 shadow-2xs transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter X"
                    className="h-7 w-7 rounded-full bg-slate-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 shadow-2xs transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <TwitterXIcon />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="h-7 w-7 rounded-full bg-slate-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 shadow-2xs transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="h-7 w-7 rounded-full bg-slate-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 shadow-2xs transition-all duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <YouTubeIcon />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Columns: Useful & Interrelated Links (High Clarity, Less Font Weight) */}
          <div className="lg:col-span-9 xl:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6 pt-1">
            
            {/* Column 1: Academic Groups */}
            <div>
              <h3 className="text-slate-950 dark:text-white font-semibold text-[11px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-2.5 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-1">
                <span className="w-1 h-3 bg-blue-600 rounded-full inline-block"></span>
                <span>Academic Groups</span>
              </h3>
              <ul className="space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <li>
                  <a 
                    href="/demo?group=mpc#courses" 
                    onClick={(e) => handleNavigation(e, '/demo?group=mpc#courses')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>MPC (Maths, Physics, Chem)</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo?group=bipc#courses" 
                    onClick={(e) => handleNavigation(e, '/demo?group=bipc#courses')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>BiPC (Biology, Physics, Chem)</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo?group=cec#courses" 
                    onClick={(e) => handleNavigation(e, '/demo?group=cec#courses')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>CEC (Commerce, Econ, Civics)</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo?group=mec#courses" 
                    onClick={(e) => handleNavigation(e, '/demo?group=mec#courses')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>MEC (Maths, Econ, Commerce)</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo?group=hec#courses" 
                    onClick={(e) => handleNavigation(e, '/demo?group=hec#courses')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>HEC (History, Econ, Civics)</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo?group=languages#courses" 
                    onClick={(e) => handleNavigation(e, '/demo?group=languages#courses')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Languages (English, Sanskrit, etc.)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Tools & Practice */}
            <div>
              <h3 className="text-slate-950 dark:text-white font-semibold text-[11px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-2.5 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-1">
                <span className="w-1 h-3 bg-blue-600 rounded-full inline-block"></span>
                <span>Practice & Tools</span>
              </h3>
              <ul className="space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <li>
                  <a 
                    href="/practicals" 
                    onClick={(e) => handleNavigation(e, '/practicals')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Lab & Practicals</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo#speed-quiz" 
                    onClick={(e) => handleNavigation(e, '/demo#speed-quiz')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Speed Quizzes</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo#courses" 
                    onClick={(e) => handleNavigation(e, '/demo#courses')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Mock Exams</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo#faq" 
                    onClick={(e) => handleNavigation(e, '/demo#faq')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Board Papers</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="/demo#methodology" 
                    onClick={(e) => handleNavigation(e, '/demo#methodology')}
                    className="group flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <ChevronRight size={12} className="text-blue-500/80 transform-gpu group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>Concept Proofs</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Booking */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-slate-950 dark:text-white font-semibold text-[11px] sm:text-xs uppercase tracking-wider mb-2 sm:mb-2.5 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-1">
                <span className="w-1 h-3 bg-blue-600 rounded-full inline-block"></span>
                <span>Contact & Support</span>
              </h3>
              <ul className="space-y-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Hyderabad, Telangana</span>
                </li>
                <li>
                  <a 
                    href="mailto:info@visdomwaves.com" 
                    className="flex items-center gap-1.5 hover:text-blue-600 transition-colors break-all"
                  >
                    <Mail className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>info@visdomwaves.com</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="tel:+917997755155" 
                    className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>+91 79977 55155</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* Motivational Caption Banner: WATCH MYMARKS, GAIN MORE MARKS */}
      <div className="w-full border-t border-blue-300/80 dark:border-slate-800 bg-[#b9d9fc]/70 dark:bg-slate-900/60 py-2.5 sm:py-3 px-3 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 select-none">
          <div className="h-[1px] w-6 sm:w-16 md:w-24 bg-gradient-to-r from-transparent to-blue-600/50 shrink" />
          <p className="text-[11px] xs:text-xs sm:text-sm md:text-[14.5px] font-extrabold text-blue-700 dark:text-blue-400 uppercase tracking-[0.16em] sm:tracking-[0.24em] md:tracking-[0.28em] font-sans whitespace-nowrap text-center leading-none antialiased">
            WATCH MYMARKS, GAIN MORE MARKS
          </p>
          <div className="h-[1px] w-6 sm:w-16 md:w-24 bg-gradient-to-l from-transparent to-blue-600/50 shrink" />
        </div>
      </div>

      {/* Solid Blue Bottom Stripe (High-Contrast Crisp White Text, Refined Weight) */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-800 to-blue-950 text-white shadow-inner antialiased">
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
              className="hover:text-sky-200 hover:underline transition-colors font-medium"
            >
              About Us
            </a>
            <span className="text-blue-300">•</span>
            <a 
              href="/contactus" 
              onClick={(e) => handleNavigation(e, '/contactus')}
              className="hover:text-sky-200 hover:underline transition-colors font-medium"
            >
              Contact Us
            </a>
            <span className="text-blue-300">•</span>
            <button 
              type="button"
              onClick={() => {
                setLegalModalTab('privacy');
                setLegalModalOpen(true);
              }}
              className="hover:text-sky-200 hover:underline transition-colors cursor-pointer font-medium"
            >
              Privacy Policy
            </button>
            <span className="text-blue-300">•</span>
            <button 
              type="button"
              onClick={() => {
                setLegalModalTab('terms');
                setLegalModalOpen(true);
              }}
              className="hover:text-sky-200 hover:underline transition-colors cursor-pointer font-medium"
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
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md hover:shadow-lg border border-blue-500/80 text-blue-600 hover:text-white hover:bg-blue-600 transition-all duration-200 flex items-center justify-center focus:outline-none cursor-pointer group hover:scale-105 active:scale-95"
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
