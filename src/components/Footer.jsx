import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  Phone, 
  ArrowUp,
  Globe,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { VisdomBrand } from './VisdomBrand';

// Social Icon SVGs
function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 320 512">
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

function TwitterXIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 512 512">
      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 448 512">
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function YouTubeIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 576 512">
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
    </svg>
  );
}

const SUPPORTED_LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'తెలుగు (Telugu)', code: 'te' },
  { name: 'हिन्दी (Hindi)', code: 'hi' },
  { name: 'தமிழ் (Tamil)', code: 'ta' },
  { name: 'ಕನ್ನಡ (Kannada)', code: 'kn' },
  { name: 'മലയാളം (Malayalam)', code: 'ml' },
  { name: 'मराठी (Marathi)', code: 'mr' },
  { name: 'বাংলা (Bengali)', code: 'bn' },
  { name: 'ગુજરાતી (Gujarati)', code: 'gu' },
  { name: 'संस्कृतम् (Sanskrit)', code: 'sa' },
  { name: 'اردو (Urdu)', code: 'ur' },
  { name: 'Français (French)', code: 'fr' }
];

export default function Footer({ onOpenBooking }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
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

  // SVG circular calculation for back to top button
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <footer 
      className="relative overflow-hidden transition-all duration-300 border-t border-amber-300 bg-[#FEF9C3] dark:bg-[#FEF08A] text-slate-900 font-medium"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Main 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Visdom Waves Brand Info & Multilingual Mission */}
          <div className="space-y-4">
            <VisdomBrand onClick={scrollToTop} />
            
            <p className="text-xs sm:text-sm text-slate-800 font-normal leading-relaxed">
              Empowering Intermediate students across all <strong className="font-semibold text-slate-900">MPC, BiPC, CEC & MEC</strong> streams with interactive modules, visual labs, timed mock tests, and multilingual learning support in your preferred language.
            </p>

            {/* Friendly Multilingual Support Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 border border-amber-300 shadow-2xs text-[11.5px] text-slate-800">
              <Globe className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-900">Learn in Any Language</span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded-full">12+ Languages</span>
            </div>

            {/* Social Circle Badges */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-8 w-8 rounded-full bg-white border border-amber-300 text-slate-900 hover:bg-yellow-200/80 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
              >
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter X"
                className="h-8 w-8 rounded-full bg-white border border-amber-300 text-slate-900 hover:bg-yellow-200/80 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
              >
                <TwitterXIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 rounded-full bg-white border border-amber-300 text-slate-900 hover:bg-yellow-200/80 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="h-8 w-8 rounded-full bg-white border border-amber-300 text-slate-900 hover:bg-yellow-200/80 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
              >
                <YouTubeIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: All Intermediate Subjects */}
          <div>
            <h3 className="text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 border-l-3 border-amber-500 pl-3">
              Intermediate Subjects
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium">
              <li>
                <a 
                  href="/maths" 
                  onClick={(e) => handleNavigation(e, '/maths')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Mathematics (1A, 1B, 2A & 2B)
                </a>
              </li>
              <li>
                <a 
                  href="/physics" 
                  onClick={(e) => handleNavigation(e, '/physics')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Physics (Mechanics & Modern Physics)
                </a>
              </li>
              <li>
                <a 
                  href="/chemistry" 
                  onClick={(e) => handleNavigation(e, '/chemistry')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Chemistry (Organic, Inorganic & Physical)
                </a>
              </li>
              <li>
                <a 
                  href="/botany" 
                  onClick={(e) => handleNavigation(e, '/botany')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Botany & Zoology (BiPC Biology)
                </a>
              </li>
              <li>
                <a 
                  href="/english" 
                  onClick={(e) => handleNavigation(e, '/english')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  English & Language Arts (Grammar & Prose)
                </a>
              </li>
              <li>
                <a 
                  href="/demo#courses" 
                  onClick={(e) => handleNavigation(e, '/demo#courses')}
                  className="hover:text-blue-800 font-semibold transition-colors flex items-center gap-1.5 text-blue-900"
                >
                  <span className="text-blue-700 text-[10px]">★</span>
                  Explore All Intermediate Streams & Syllabi
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Multilingual Support & Learning Tools */}
          <div>
            <h3 className="text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 border-l-3 border-amber-500 pl-3">
              Tools & Languages
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium">
              <li>
                <a 
                  href="/demo" 
                  onClick={(e) => handleNavigation(e, '/demo')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Learn in Any Language (12+ Regional Options)
                </a>
              </li>
              <li>
                <a 
                  href="/demo#interactive-lab" 
                  onClick={(e) => handleNavigation(e, '/demo#interactive-lab')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Interactive Virtual Labs & Simulations
                </a>
              </li>
              <li>
                <a 
                  href="/demo#speed-quiz" 
                  onClick={(e) => handleNavigation(e, '/demo#speed-quiz')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Speed Quizzes & Subject Practice Arenas
                </a>
              </li>
              <li>
                <a 
                  href="/demo#courses" 
                  onClick={(e) => handleNavigation(e, '/demo#courses')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Online Timed Mock Exams & Test Series
                </a>
              </li>
              <li>
                <a 
                  href="/demo#faq" 
                  onClick={(e) => handleNavigation(e, '/demo#faq')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Previous Board (TS/AP BIE) Question Papers
                </a>
              </li>
              <li>
                <a 
                  href="/demo#methodology" 
                  onClick={(e) => handleNavigation(e, '/demo#methodology')}
                  className="hover:text-blue-800 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-amber-700 text-[10px]">▶</span>
                  Step-by-Step Concepts, Proofs & Notes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Free Trial */}
          <div>
            <h3 className="text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider mb-4 border-l-3 border-amber-500 pl-3">
              Contact & Support
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-700 flex-shrink-0" />
                <a href="mailto:info@visdomwaves.com" className="hover:text-blue-800 transition-colors break-all">
                  info@visdomwaves.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-700 flex-shrink-0" />
                <a href="tel:+917997755155" className="hover:text-blue-800 transition-colors">
                  +91 79977 55155
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-tight shadow-sm shadow-blue-500/20 hover:shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                  <span>Book 1-on-1 Free Class</span>
                </button>
              </li>
              <li className="pt-1">
                <span className="text-[11px] text-slate-700 block">
                  ✨ Multilingual tutors available for personalized guidance.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Multilingual Support Ribbon / Chips Bar */}
        <div className="mt-10 pt-6 border-t border-amber-300/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Globe className="h-4 w-4 text-blue-600" />
              <span>Learn In Your Native Language Without Barriers:</span>
            </div>
            <span className="text-[11px] text-slate-700 font-medium">
              Click any language to explore interactive lessons & resources
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <a
                key={lang.code}
                href={`/demo?lang=${lang.code}`}
                onClick={(e) => handleNavigation(e, `/demo?lang=${lang.code}`)}
                className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-800 hover:text-blue-700 border border-amber-300/80 text-[11px] font-medium transition-all shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95"
              >
                {lang.name}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Decorative Divider & Copyright */}
        <div className="border-t border-amber-300/80 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright line */}
          <p className="text-xs text-slate-800 text-center md:text-left md:flex-1 font-medium">
            © {new Date().getFullYear()} MyMarks Academy • Visdom Waves Innovations. All rights reserved.
          </p>

          {/* Slogan Centerpiece */}
          <div className="flex items-center gap-2 select-none md:flex-1 justify-center">
            {/* Left Decorative Line */}
            <div className="flex items-center">
              <span className="text-amber-800 font-mono font-bold text-xs sm:text-sm mr-1.5">∑</span>
              <div className="h-[1.5px] w-6 sm:w-12 bg-amber-500" />
            </div>

            {/* Slogan */}
            <span className="text-xs sm:text-sm font-semibold text-slate-900 tracking-wider whitespace-nowrap px-1 font-sans">
              All Intermediate Subjects • Learn in Any Language
            </span>

            {/* Right Decorative Line */}
            <div className="flex items-center">
              <div className="h-[1.5px] w-6 sm:w-12 bg-amber-500" />
              <span className="text-amber-800 font-mono font-bold text-xs sm:text-sm ml-1.5">∞</span>
            </div>
          </div>

          {/* Quick Legal Links */}
          <div className="flex gap-2.5 text-xs text-slate-800 md:flex-1 justify-center md:justify-end font-semibold">
            <a 
              href="/aboutus" 
              onClick={(e) => handleNavigation(e, '/aboutus')}
              className="hover:text-blue-800 transition-colors"
            >
              About Us
            </a>
            <span>•</span>
            <a href="mailto:info@visdomwaves.com" className="hover:text-blue-800 transition-colors">
              Contact Us
            </a>
            <span>•</span>
            <a href="#privacy" className="hover:text-blue-800 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-blue-800 transition-colors">
              Terms
            </a>
          </div>

        </div>

      </div>

      {/* Floating Back to Top Button with Progress Ring */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 p-2 rounded-full bg-white shadow-xl border border-amber-300 text-amber-700 hover:text-white hover:bg-amber-600 transition-all duration-200 flex items-center justify-center focus:outline-none cursor-pointer group"
        >
          <svg className="absolute w-12 h-12 transform -rotate-90 pointer-events-none">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-amber-500 transition-all duration-75"
            />
          </svg>
          <div className="h-8 w-8 flex items-center justify-center z-10">
            <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </button>
      )}

    </footer>
  );
}
