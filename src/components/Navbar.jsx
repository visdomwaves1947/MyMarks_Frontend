import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Sun,
  Moon,
  User,
  Menu,
  X,
  Sparkles,
  BookOpen,
  BrainCircuit,
  Calculator,
  GraduationCap,
  CheckCircle,
  PhoneCall,
  Layers,
  Award,
  ChevronRight,
  Lock,
} from "lucide-react";
import { VisdomBrand } from "./VisdomBrand";

export default function Navbar({
  onOpenBooking,
  onOpenPortal,
  onOpenSignIn,
  onOpenSignUp,
  currentUser = null,
  theme = "light",
  toggleTheme,
  onLockSite,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const dropdownTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkNavigation = (e, href) => {
    e.preventDefault();
    if (!href || href === "#") {
      if (location.pathname.toLowerCase().includes("demo")) {
        navigate("/maths");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (href.startsWith("#")) {
      if (location.pathname.toLowerCase().includes("demo")) {
        navigate(`/maths${href}`);
      } else {
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      navigate(href);
    }
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const el =
        document.getElementById("courses") ||
        document.getElementById("interactive-lab");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleDropdownEnter = (index) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileDropdown = (index) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const navLinks = [
    {
      name: "Home",
      href: "/demo",
    },
    {
      name: "About Us",
      href: "/aboutus",
    },
    {
      name: "Languages",
      dropdown: [
        { name: "English", desc: "Master Intermediate in English Medium", href: "/demo?lang=en" },
        { name: "Telugu (తెలుగు)", desc: "తెలుగు మాధ్యమంలో సులభమైన వివరణలు", href: "/demo?lang=te" },
        { name: "Hindi (हिन्दी)", desc: "हिन्दी में सम्पूर्ण पाठ और अभ्यास", href: "/demo?lang=hi" },
        { name: "Tamil (தமிழ்)", desc: "தமிழில் முழுமையான விளக்கம்", href: "/demo?lang=ta" },
        { name: "Kannada (ಕನ್ನಡ)", desc: "ಕನ್ನಡದಲ್ಲಿ ಪರಿಪೂರ್ಣ ಕಲಿಕೆ", href: "/demo?lang=kn" },
        { name: "Malayalam (മലയാളം)", desc: "മലയാളത്തിൽ ലളിതമായ ക്ലാసുകൾ", href: "/demo?lang=ml" },
        { name: "Marathi (मराठी)", desc: "मराठीमध्ये सोपे शिक्षण", href: "/demo?lang=mr" },
        { name: "Bengali (বাংলা)", desc: "বাংলা ভাষায় সম্পূর্ণ প্রস্তুতি", href: "/demo?lang=bn" },
        { name: "Gujarati (ગુજરાતી)", desc: "ગુજરાતીમાં ઉત્તમ માર્ગદર્શન", href: "/demo?lang=gu" },
        { name: "Sanskrit (संस्कृतम्)", desc: "संस्कृत भाषा अभ्यासाः", href: "/demo?lang=sa" },
        { name: "Odia (ଓଡ଼ିଆ)", desc: "ଓଡ଼ିଆ ଭାଷାରେ ସରଳ ଶିକ୍ଷା", href: "/demo?lang=or" },
        { name: "Urdu (اردو)", desc: "اردو میں جامع رہنمائی", href: "/demo?lang=ur" },
      ],
    },
  ];

  const isLinkActive = (href) => {
    const p = location.pathname.toLowerCase();
    if (href === "/demo" || href === "/") return p === "/demo" || p === "/";
    if (href.includes("about")) return p === "/aboutus" || p === "/about" || p === "/about-us";
    return false;
  };

  const handleSignInClick = onOpenSignIn || onOpenPortal;
  const handleSignUpClick = onOpenSignUp || onOpenPortal;

  return (
    <>
      {/* Main Sticky Navbar - 100% Solid Opaque Background with Thin Black Line */}
      <header
        className="sticky top-0 z-50 border-b border-black dark:border-black bg-white dark:bg-[#030712] shadow-xs transform-gpu will-change-transform"
      >
        <div className="w-full px-2.5 sm:px-6 lg:px-8 relative z-10 flex items-center justify-between gap-2 sm:gap-4 h-[72px] sm:h-[82px] md:h-[86px]">
          {/* Left: Visdom Waves Brand Logo */}
          <div className="flex items-center shrink-0">
            <VisdomBrand
              onClick={() => {
                navigate("/demo");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>

          {/* Right: Navigation, Search, Controls & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => link.dropdown && handleDropdownEnter(idx)}
                  onMouseLeave={() => link.dropdown && handleDropdownLeave()}
                >
                  {link.dropdown ? (
                    <button
                      className="flex items-center gap-1 px-3.5 py-2 text-[14px] font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors tracking-tight rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer"
                      onClick={() =>
                        setActiveDropdown(activeDropdown === idx ? null : idx)
                      }
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 text-slate-500 dark:text-slate-400 ${activeDropdown === idx ? "rotate-180 text-blue-600 dark:text-cyan-400" : ""}`}
                      />
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkNavigation(e, link.href)}
                      className={`block px-3.5 py-2 text-[14px] transition-colors tracking-tight rounded-lg cursor-pointer ${
                        isLinkActive(link.href)
                          ? "text-blue-600 dark:text-cyan-300 font-semibold bg-blue-50 dark:bg-slate-800/80 shadow-2xs"
                          : "text-slate-700 dark:text-slate-200 font-medium hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      {link.name}
                    </a>
                  )}

                  {/* Desktop Dropdown Popover */}
                  {link.dropdown && activeDropdown === idx && (
                    <div
                      className="absolute top-full left-0 mt-1.5 w-72 rounded-2xl bg-white dark:bg-[#090d16] border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto"
                      onMouseEnter={() => handleDropdownEnter(idx)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xs">
                        Select Language
                      </div>
                      {link.dropdown.map((sub, sIdx) => (
                        <a
                          key={sIdx}
                          href={sub.href}
                          onClick={(e) => {
                            setActiveDropdown(null);
                            handleLinkNavigation(e, sub.href);
                          }}
                          className="block px-4 py-2 hover:bg-blue-50/70 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 transition-colors group cursor-pointer border-b border-slate-50 dark:border-slate-900/60 last:border-b-0"
                        >
                          <div className="text-xs font-medium group-hover:text-blue-600 dark:group-hover:text-cyan-300">
                            {sub.name}
                          </div>
                          {sub.desc && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {sub.desc}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Box (Desktop / Tablet) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden xl:flex items-center relative max-w-[190px] w-full"
            >
              <input
                type="text"
                placeholder="Search calculus, algebra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white dark:bg-slate-950 border border-slate-400 dark:border-cyan-700 rounded-full py-2 pl-3.5 pr-8 text-slate-950 dark:text-white placeholder-slate-600 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 shadow-xs transition-all font-semibold"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2.5 text-slate-800 hover:text-cyan-900 dark:text-slate-300 dark:hover:text-cyan-400 cursor-pointer"
              >
                <Search size={14} />
              </button>
            </form>

            {/* Right Controls & Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Dark / Light Mode Toggle Pill Switch */}
              <button
                type="button"
                onClick={toggleTheme}
                className="relative flex items-center w-[52px] xs:w-[58px] h-[28px] xs:h-[30px] rounded-full bg-slate-900 dark:bg-slate-700 transition-colors duration-300 focus:outline-none shadow-inner ring-1 ring-slate-900/15 dark:ring-white/20 cursor-pointer shrink-0"
                aria-label="Toggle dark mode"
                title={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
              >
                {/* Sliding White Knob */}
                <div
                  className={`absolute top-[2.5px] w-[23px] xs:w-[25px] h-[23px] xs:h-[25px] bg-white rounded-full shadow-md transition-transform duration-300 ease-out z-0 ${
                    theme === "dark"
                      ? "translate-x-[25px] xs:translate-x-[29px]"
                      : "translate-x-[2.5px]"
                  }`}
                />
                <div className="relative flex justify-between items-center w-full px-[6px] xs:px-[7px] z-10 pointer-events-none">
                  <Sun
                    className={`w-3.5 h-3.5 transition-colors duration-300 ${theme === "dark" ? "text-slate-400" : "text-amber-500 font-bold"}`}
                  />
                  <Moon
                    className={`w-3.5 h-3.5 transition-colors duration-300 ${theme === "dark" ? "text-indigo-600 font-bold" : "text-slate-400"}`}
                  />
                </div>
              </button>

              {/* Privacy Lock Button */}
              {onLockSite && (
                <button
                  onClick={onLockSite}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors cursor-pointer shrink-0"
                  title="Lock Website (Privacy Gate)"
                  aria-label="Lock Website"
                >
                  <Lock size={15} />
                </button>
              )}

              {/* User Account / Professional Profile Navigation Action */}
              {currentUser ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer group shrink-0"
                  title="View Student Profile"
                  aria-label="View Student Profile"
                >
                  {/* Clean Monogram Avatar with Status Indicator */}
                  <div className="relative shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white text-xs font-bold shadow-2xs ring-1 ring-white dark:ring-slate-800">
                    {currentUser.name
                      ? currentUser.name
                          .trim()
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "ST"}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-slate-900"></span>
                  </div>

                  {/* Clean Professional Typography */}
                  <div className="flex flex-col text-left leading-tight hidden sm:flex max-w-[150px] md:max-w-[190px]">
                    <span className="text-[12.5px] font-semibold text-slate-900 dark:text-slate-100 truncate tracking-tight group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {currentUser.name || "Student"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.role || "Student Scholar"}
                    </span>
                  </div>

                  {/* Subtle navigation arrow */}
                  <ChevronRight
                    size={13}
                    className="text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all hidden sm:inline shrink-0"
                  />
                </button>
              ) : (
                /* Clean Simple Sign In / Sign Up Button (Icon-only on mobile) */
                <button
                  onClick={handleSignInClick}
                  aria-label="Sign In / Sign Up"
                  title="Sign In / Sign Up"
                  className="p-2 sm:px-4 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium text-xs tracking-tight shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                >
                  <User size={15} className="text-white" />
                  <span className="hidden sm:inline">Sign In / Sign Up</span>
                </button>
              )}

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-slate-950 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[auto] z-40 bg-white dark:bg-[#030712] border-b border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[calc(100vh-100px)] py-4 px-4 animate-in slide-in-from-top duration-200">
          {/* Mobile Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center mb-4"
          >
            <input
              type="text"
              placeholder="Search curriculum, labs, lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-3.5 pr-9 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <button
              type="submit"
              className="absolute right-3 text-slate-500 dark:text-slate-400 hover:text-blue-600"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Mobile Navigation List */}
          <div className="space-y-1">
            {navLinks.map((link, idx) => (
              <div
                key={idx}
                className="border-b border-slate-100 dark:border-slate-800/80 last:border-b-0 pb-1"
              >
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleMobileDropdown(idx)}
                      className="w-full flex items-center justify-between py-2 px-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 text-slate-400 ${mobileDropdowns[idx] ? "rotate-180 text-blue-600" : ""}`}
                      />
                    </button>
                    {mobileDropdowns[idx] && (
                      <div className="pl-4 pr-2 pb-2 space-y-1.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl p-2.5 my-1">
                        {link.dropdown.map((sub, sIdx) => (
                          <a
                            key={sIdx}
                            href={sub.href}
                            onClick={(e) => {
                              setMobileMenuOpen(false);
                              handleLinkNavigation(e, sub.href);
                            }}
                            className="block py-1.5 px-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 cursor-pointer"
                          >
                            • {sub.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleLinkNavigation(e, link.href);
                    }}
                    className={`block py-2 px-2 text-sm font-medium transition-colors cursor-pointer ${
                      isLinkActive(link.href)
                        ? "text-blue-600 dark:text-cyan-300 font-semibold"
                        : "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400"
                    }`}
                  >
                    {link.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignInClick();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <User size={14} className="text-white" />
                <span>Sign In / Sign Up</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/profile");
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium text-xs flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white text-xs font-bold shadow-xs">
                    {currentUser.name
                      ? currentUser.name
                          .trim()
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "ST"}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-slate-900"></span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {currentUser.role || "Student Scholar"} • View Profile
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-400" />
              </button>
            )}

            {onLockSite && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLockSite();
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Lock size={13} />
                <span>Lock Website (Privacy Gate)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
