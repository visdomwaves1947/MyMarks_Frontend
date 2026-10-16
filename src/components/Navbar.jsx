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
  Globe,
  FlaskConical,
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
      if (location.pathname.toLowerCase().includes("demo") || location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/demo");
      }
      return;
    }

    // Handle group navigation e.g. /demo?group=mpc#courses
    const groupMatch = href.match(/[?&]group=([a-z0-9]+)/i);
    if (groupMatch) {
      const group = groupMatch[1].toLowerCase();
      window.dispatchEvent(new CustomEvent("selectIntermediateGroup", { detail: group }));
      if (location.pathname.toLowerCase().includes("demo") || location.pathname === "/") {
        const el = document.getElementById("courses");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        navigate(href, { replace: true });
        return;
      }
    }

    if (href.startsWith("#")) {
      if (location.pathname.toLowerCase().includes("demo") || location.pathname === "/") {
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate(`/demo${href}`);
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
    }, 220);
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
      name: "Intermediate",
      href: "/demo#courses",
      sections: [
        {
          title: "Academic Groups",
          icon: Layers,
          items: [
            { name: "MPC", desc: "Maths, Physics, Chem", href: "/demo?group=mpc#courses" },
            { name: "BiPC", desc: "Botany, Zoology, Phy, Chem", href: "/demo?group=bipc#courses" },
            { name: "CEC", desc: "Commerce, Econ, Civics", href: "/demo?group=cec#courses" },
            { name: "MEC", desc: "Maths, Econ, Commerce", href: "/demo?group=mec#courses" },
            { name: "HEC", desc: "History, Econ, Civics", href: "/demo?group=hec#courses" },
          ],
        },
        {
          title: "Languages",
          icon: Globe,
          items: [
            { name: "English", href: "/english" },
            { name: "Sanskrit", href: "/sanskrit" },
            { name: "Telugu", href: "/telugu" },
            { name: "Hindi", href: "/hindi" },
            { name: "Urdu", href: "/urdu" },
          ],
        },
        {
          title: "Lab / Practicals",
          icon: FlaskConical,
          items: [
            { name: "Physics Lab (30M)", href: "/practicals?subject=phy" },
            { name: "Chemistry Lab (30M)", href: "/practicals?subject=chem" },
            { name: "Biology Labs (30M)", href: "/practicals?subject=bot" },
            { name: "Computer Science (30M)", href: "/practicals?subject=cs" },
            { name: "Electronics Lab (30M)", href: "/practicals?subject=elec" },
            { name: "Geography Lab (30M)", href: "/practicals?subject=geo" },
            { name: "View All Practical Handbooks", href: "/practicals" },
          ],
        },
      ],
    },
    {
      name: "Contact Us",
      href: "/contactus",
    },
  ];

  const isLinkActive = (href) => {
    const p = location.pathname.toLowerCase();
    if (href === "/demo" || href === "/") return p === "/demo" || p === "/";
    if (href.includes("about")) return p === "/aboutus" || p === "/about" || p === "/about-us";
    if (href.includes("contact")) return p === "/contactus" || p === "/contact" || p === "/contact-us";
    return false;
  };

  const handleSignInClick = onOpenSignIn || onOpenPortal;
  const handleSignUpClick = onOpenSignUp || onOpenPortal;

  return (
    <>
      {/* Main Sticky Navbar - Solid High Resolution Light Blue Header (100% Opaque, No Movement or Shrink) */}
      <header
        className="sticky top-0 z-50 bg-[#cde4fd] dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border-b border-blue-300/80 dark:border-slate-800 relative select-none"
      >
        <div className="w-full px-2.5 sm:px-6 lg:px-8 relative z-10 flex items-center justify-between gap-2 sm:gap-4 h-[72px] sm:h-[82px] md:h-[86px]">
          {/* Left: Visdom Waves Brand Logo Badge (Exact Reference Graphic Style) */}
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
              {navLinks.map((link, idx) => {
                const hasDropdown = Boolean(link.dropdown || link.sections);
                return (
                  <div
                    key={idx}
                    className="relative"
                    onMouseEnter={() => hasDropdown && handleDropdownEnter(idx)}
                    onMouseLeave={() => hasDropdown && handleDropdownLeave()}
                  >
                    {hasDropdown ? (
                      <button
                        className="flex items-center gap-1 px-3 py-2 text-[14px] font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors tracking-tight rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === idx ? null : idx)
                        }
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 text-slate-600 dark:text-slate-400 ${activeDropdown === idx ? "rotate-180 text-blue-600" : ""}`}
                        />
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkNavigation(e, link.href)}
                        className={`block px-3 py-2 text-[14px] transition-colors tracking-tight rounded-lg cursor-pointer ${
                          isLinkActive(link.href)
                            ? "text-blue-600 font-extrabold bg-blue-50 dark:bg-blue-950/40 shadow-xs border-b-2 border-blue-600"
                            : "text-slate-800 dark:text-slate-200 font-bold hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {link.name}
                      </a>
                    )}

                    {/* Desktop Dropdown Popover */}
                    {hasDropdown && activeDropdown === idx && (
                      <div
                        className={`absolute top-[calc(100%+6px)] ${link.sections ? "-left-40 sm:-left-60 md:-left-64 w-[560px] sm:w-[620px] md:w-[650px]" : "left-0 w-72"} rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-visible ring-1 ring-black/5 before:content-[''] before:absolute before:-top-4 before:inset-x-0 before:h-4`}
                        onMouseEnter={() => handleDropdownEnter(idx)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {link.sections ? (
                          <div>
                            {/* 3-Column Grid: Academic Groups, Languages & Lab Practicals */}
                            <div className={`grid ${link.sections.length === 3 ? "grid-cols-3" : "grid-cols-2"} divide-x divide-slate-100 dark:divide-slate-800 p-2 gap-1.5`}>
                              {link.sections.map((section, secIdx) => {
                                const SectionIcon = section.icon || BookOpen;
                                return (
                                  <div key={secIdx} className="px-1.5">
                                    {/* Section Header */}
                                    <div className="px-2.5 py-1.5 mb-1.5 rounded-lg bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-900/40 flex items-center gap-1.5">
                                      <SectionIcon size={13} className="text-blue-600 dark:text-blue-400" />
                                      <span className="text-[11px] font-bold text-blue-950 dark:text-blue-200 uppercase tracking-wider">
                                        {section.title}
                                      </span>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-0.5">
                                      {section.items.map((sub, sIdx) => (
                                        <a
                                          key={sIdx}
                                          href={sub.href}
                                          onClick={(e) => {
                                            setActiveDropdown(null);
                                            handleLinkNavigation(e, sub.href);
                                          }}
                                          className="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/90 dark:hover:bg-blue-950/50 transition-colors cursor-pointer group"
                                        >
                                          <span className="block font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {sub.name}
                                          </span>
                                          {sub.desc && (
                                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                                              {sub.desc}
                                            </span>
                                          )}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Dropdown Bottom Footer */}
                            <div className="mt-1 pt-2 pb-1.5 px-3.5 border-t border-slate-100 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/30 flex items-center justify-between text-xs">
                              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                                AP & TS Intermediate
                              </span>
                              <a
                                href="/demo#courses"
                                onClick={(e) => {
                                  setActiveDropdown(null);
                                  handleLinkNavigation(e, "/demo#courses");
                                }}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 group cursor-pointer"
                              >
                                <span>Explore All</span>
                                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider sticky top-0 bg-blue-50/90 dark:bg-blue-950/70 backdrop-blur-xs">
                              {link.dropdownHeader || "Select Option"}
                            </div>
                            {link.dropdown?.map((sub, sIdx) => (
                              <a
                                key={sIdx}
                                href={sub.href}
                                onClick={(e) => {
                                  setActiveDropdown(null);
                                  handleLinkNavigation(e, sub.href);
                                }}
                                className="block px-4 py-2 hover:bg-blue-50/80 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-200 transition-colors group cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-b-0"
                              >
                                <div className="text-xs font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {sub.name}
                                </div>
                                {sub.desc && (
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                    {sub.desc}
                                  </div>
                                )}
                              </a>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
                className="w-full text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-3.5 pr-8 text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-xs transition-all font-semibold"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2.5 text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Search size={14} />
              </button>
            </form>

            {/* Right Controls & Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Dark / Light Mode Toggle Pill Switch (hidden on mobile, available in mobile drawer) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="hidden sm:flex relative items-center w-[52px] xs:w-[58px] h-[28px] xs:h-[30px] rounded-full bg-slate-900 dark:bg-slate-700 transition-colors duration-300 focus:outline-none shadow-inner ring-1 ring-slate-900/15 dark:ring-white/20 cursor-pointer shrink-0"
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

              {/* Privacy Lock Button (hidden on mobile, available in mobile drawer) */}
              {onLockSite && (
                <button
                  onClick={onLockSite}
                  className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0 shadow-2xs"
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
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow transition-all duration-200 cursor-pointer group shrink-0"
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
                    <span className="text-[12.5px] font-bold text-slate-950 truncate tracking-tight group-hover:text-blue-600 transition-colors">
                      {currentUser.name || "Student"}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 truncate">
                      {currentUser.role || "Student Scholar"}
                    </span>
                  </div>

                  {/* Subtle navigation arrow */}
                  <ChevronRight
                    size={13}
                    className="text-slate-500 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all hidden sm:inline shrink-0"
                  />
                </button>
              ) : (
                /* Clean Simple Sign In / Sign Up Button (Gradient Blue) */
                <button
                  onClick={handleSignInClick}
                  aria-label="Sign In / Sign Up"
                  title="Sign In / Sign Up"
                  className="p-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-sky-600 text-white font-bold text-xs tracking-tight shadow-md shadow-blue-950/20 hover:shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                >
                  <User size={15} className="text-white" />
                  <span className="hidden sm:inline">Sign In / Sign Up</span>
                </button>
              )}

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-slate-950 hover:bg-black/10 transition-colors cursor-pointer"
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
        <div className="lg:hidden fixed inset-x-0 top-[72px] sm:top-[82px] z-40 bg-[#cde4fd] dark:bg-[#070a12] text-slate-900 dark:text-slate-100 border-b border-blue-300 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[calc(100vh-100px)] py-4 px-4 select-none">
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
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-3.5 pr-9 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
            <button
              type="submit"
              className="absolute right-3 text-slate-400 hover:text-blue-600"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Mobile Navigation List */}
          <div className="space-y-1">
            {navLinks.map((link, idx) => {
              const hasDropdown = Boolean(link.dropdown || link.sections);
              return (
                <div
                  key={idx}
                  className="border-b border-slate-100 dark:border-slate-800/80 last:border-b-0 pb-1"
                >
                  {hasDropdown ? (
                    <div>
                      <button
                        onClick={() => toggleMobileDropdown(idx)}
                        className="w-full flex items-center justify-between py-2 px-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 text-slate-400 ${mobileDropdowns[idx] ? "rotate-180 text-blue-600" : ""}`}
                        />
                      </button>
                      {mobileDropdowns[idx] && (
                        <div className="pl-3 pr-2 pb-2 space-y-2.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-2.5 my-1 border border-blue-100 dark:border-blue-950/50">
                          {link.sections ? (
                            <>
                              {link.sections.map((section, secIdx) => (
                                <div key={secIdx} className="space-y-1">
                                  <div className="text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider px-2 pt-1 border-b border-blue-200/50 dark:border-blue-900/40 pb-1">
                                    {section.title}
                                  </div>
                                  {section.items.map((sub, sIdx) => (
                                    <a
                                      key={sIdx}
                                      href={sub.href}
                                      onClick={(e) => {
                                        setMobileMenuOpen(false);
                                        handleLinkNavigation(e, sub.href);
                                      }}
                                      className="block py-1.5 px-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                                    >
                                      <div className="font-semibold">• {sub.name}</div>
                                      {sub.desc && (
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 pl-3">
                                          {sub.desc}
                                        </div>
                                      )}
                                    </a>
                                  ))}
                                </div>
                              ))}
                              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                                <a
                                  href="/demo#courses"
                                  onClick={(e) => {
                                    setMobileMenuOpen(false);
                                    handleLinkNavigation(e, "/demo#courses");
                                  }}
                                  className="block py-1 px-2 text-xs font-bold text-blue-600 dark:text-blue-400"
                                >
                                  → Explore All Intermediate Courses
                                </a>
                              </div>
                            </>
                          ) : (
                            link.dropdown?.map((sub, sIdx) => (
                              <a
                                key={sIdx}
                                href={sub.href}
                                onClick={(e) => {
                                  setMobileMenuOpen(false);
                                  handleLinkNavigation(e, sub.href);
                                }}
                                className="block py-1.5 px-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                              >
                                • {sub.name}
                              </a>
                            ))
                          )}
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
                          ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40 rounded-lg"
                          : "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      {link.name}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Action Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignInClick();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-sky-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
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
