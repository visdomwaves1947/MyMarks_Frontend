import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
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
  BrainCircuit,
  Calculator,
  GraduationCap,
  CheckCircle,
  PhoneCall,
  Award,
  ChevronRight,
  LogOut,
  Lock,
  LayoutDashboard,
  GraduationCap as CoursesIcon,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { VisdomBrand } from "./VisdomBrand";
import useDialog from "../hooks/useDialog";
import useCatalog from "../hooks/useCatalog";
import useNavigationMenu from "../hooks/useNavigationMenu";
import useCart from "../hooks/useCart";
import useLikes from "../hooks/useLikes";
import MegaMenuPanel from "./nav/MegaMenuPanel";
import { MEGA_MENU_OFFSET, MEGA_MENU_WIDTH, resolveSections } from "./nav/menuSections";

export default function Navbar({
  onOpenBooking,
  onOpenPortal,
  onOpenSignIn,
  onOpenSignUp,
  currentUser = null,
  theme = "light",
  toggleTheme,
  onLockSite,
  onLogout,
}) {
  const navigate = useNavigate();
  const { confirm } = useDialog();
  const location = useLocation();
  const { courses, streams } = useCatalog();
  const navigation = useNavigationMenu();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // The avatar opens a small menu: View Profile, and My Courses (students) or Admin Panel (admins)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const dropdownTimeoutRef = useRef(null);
  const megaMenuRef = useRef(null);

  // A wide dropdown can run past the screen edge on smaller laptops; nudge it back inside
  useLayoutEffect(() => {
    const panel = megaMenuRef.current;
    if (!panel) return;
    panel.style.marginLeft = "";
    const rect = panel.getBoundingClientRect();
    const margin = 12;
    let shift = 0;
    if (rect.right > window.innerWidth - margin) shift = window.innerWidth - margin - rect.right;
    if (rect.left + shift < margin) shift = margin - rect.left;
    panel.style.marginLeft = `${shift}px`;
  }, [activeDropdown]);

  // Automatically close mobile menu when user actually scrolls the page
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const initialScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - initialScrollY) > 8) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  // Automatically close mobile menu when route, query, or hash changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  const handleLinkNavigation = (e, href) => {
    e.preventDefault();
    if (/^https:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (!href || href === "#") {
      if (location.pathname.toLowerCase().includes("demo") || location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/demo");
      }
      return;
    }

    // Handle group navigation e.g. /demo?group=mpc#courses
    const groupMatch = href.match(/[?&]group=([a-z0-9-]+)/i);
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

  // The menu is edited on the admin Navigation Menu page; every dropdown link has its own columns
  const navLinks = navigation.links
    .filter((link) => link.visible !== false)
    .map((link) => {
      const sections = link.kind === "menu" ? resolveSections(link.menu, { courses, streams }) : [];
      return sections.length > 0
        ? { name: link.label, href: link.href, sections, menu: link.menu }
        : { name: link.label, href: link.href };
    });

  const isLinkActive = (href) => {
    const p = location.pathname.toLowerCase();
    if (href === "/demo" || href === "/") return p === "/demo" || p === "/";
    if (href.includes("about")) return p === "/aboutus" || p === "/about" || p === "/about-us";
    if (href.includes("contact")) return p === "/contactus" || p === "/contact" || p === "/contact-us";
    const path = href.split(/[?#]/)[0].toLowerCase();
    return path.length > 1 && p === path;
  };

  const handleSignInClick = onOpenSignIn || onOpenPortal;
  const handleSignUpClick = onOpenSignUp || onOpenPortal;

  const isAdminUser = Boolean(currentUser && currentUser.role === 'admin');
  // Everyone but an administrator has a cart; it works before signing in
  const cart = useCart();
  const showCart = !isAdminUser;
  const cartLabel = cart.count === 0 ? "Cart" : `Cart, ${cart.count} ${cart.count === 1 ? "course" : "courses"}`;
  const likes = useLikes(currentUser);
  const likedLabel = likes.count === 0 ? "Liked courses" : `Liked courses, ${likes.count}`;

  useEffect(() => {
    if (!profileMenuOpen) return undefined;
    const onPointer = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileMenuOpen]);

  // Sign out from any page, without going to the profile first
  const handleSignOut = async () => {
    setMobileMenuOpen(false);
    const ok = await confirm({
      title: "Sign out?",
      message: "You can sign in again at any time.",
      confirmLabel: "Sign Out",
      tone: "danger",
    });
    if (ok && onLogout) onLogout();
  };

  return (
    <>
      {/* Fixed Header Container containing Top Navbar & Main Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 select-none shadow-xs">
        {/* Chinmaya Vidyalaya Style Top Bar */}
        <div
          className="h-9 px-3 sm:px-6 flex items-center justify-between text-xs text-blue-100 select-none relative z-50"
          style={{ background: "linear-gradient(90deg, #1e3a8a, #1d4ed8)" }}
        >
          {/* Left: Contact Info */}
          <div className="flex items-center gap-2 sm:gap-5">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Social Links */}
            <div className="hidden lg:flex items-center gap-2 text-blue-200">
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

            {/* Curriculum Accreditation Badge - Visible on Mobile and Desktop */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] xs:text-[9.5px] sm:text-[10px] font-bold text-white border border-white/30 bg-white/10 whitespace-nowrap">
              <GraduationCap size={10} className="text-amber-300 shrink-0" />
              <span>AP & TS Board</span>
            </span>
          </div>
        </div>

        {/* Main Navbar - Solid Chinmaya Vidyalaya light blue background (#dbeafe), zero scroll movement/color change */}
        <div
          className="bg-[#dbeafe] dark:!bg-slate-900 border-b border-[#bfdbfe] dark:border-slate-800 shadow-xs"
        >
          <div className="w-full px-2 xs:px-3 sm:px-6 lg:px-8 relative z-10 flex items-center justify-between gap-1.5 sm:gap-4 h-[62px] xs:h-[68px] sm:h-[82px] md:h-[86px]">
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
                        ref={link.sections ? megaMenuRef : undefined}
                        className={`absolute top-[calc(100%+6px)] ${link.sections ? `${MEGA_MENU_OFFSET[link.sections.length]} ${MEGA_MENU_WIDTH[link.sections.length]}` : "left-0 w-72"} rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-visible ring-1 ring-black/5 before:content-[''] before:absolute before:-top-4 before:inset-x-0 before:h-4`}
                        onMouseEnter={() => handleDropdownEnter(idx)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {link.sections ? (
                          <MegaMenuPanel
                            sections={link.sections}
                            menu={link.menu}
                            onNavigate={(e, href) => {
                              setActiveDropdown(null);
                              handleLinkNavigation(e, href);
                            }}
                          />
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
                className="w-full text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-3.5 pr-8 text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-xs transition-all font-semibold"
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


              {/* Liked courses, with how many (phones reach them from the menu) */}
              {showCart && (
                <button
                  type="button"
                  onClick={() => navigate("/liked")}
                  aria-label={likedLabel}
                  title={likedLabel}
                  data-testid="nav-liked"
                  className="relative hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                  <Heart size={19} />
                  {likes.count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                      {likes.count}
                    </span>
                  )}
                </button>
              )}

              {/* Cart, with how many courses are in it */}
              {showCart && (
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  aria-label={cartLabel}
                  title={cartLabel}
                  data-testid="nav-cart"
                  className="relative p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                >
                  <ShoppingCart size={19} />
                  {cart.count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                      {cart.count}
                    </span>
                  )}
                </button>
              )}

              {/* User Account / Profile Navigation Action (Compact Icon Only to keep navbar UI balanced & responsive) */}
              {currentUser ? (
                <div ref={profileMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                  className="relative p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/60 dark:hover:ring-blue-400/60 transition-all duration-200 cursor-pointer shrink-0 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Account menu"
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={profileMenuOpen}
                >
                  {/* Clean Monogram / Account Avatar with Online Status Indicator */}
                  <div className="relative shrink-0 flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white text-xs sm:text-[13px] font-bold shadow-sm ring-1.5 ring-white dark:ring-slate-800 group-hover:shadow-md transition-shadow">
                    {currentUser.name
                      ? currentUser.name
                          .trim()
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : <User size={16} className="text-white" />}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
                  </div>
                </button>

                {/* An administrator chooses between their profile and the admin panel */}
                {profileMenuOpen && (
                  <div
                    role="menu"
                    aria-label="Account"
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-50 animate-fadeIn"
                  >
                    <div className="px-3 py-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {currentUser.name || currentUser.fullName || (isAdminUser ? "Administrator" : "Student")}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{isAdminUser ? "Administrator" : "Student"}</div>
                    </div>
                    {[
                      { label: "View Profile", Icon: User, to: "/profile" },
                      isAdminUser
                        ? { label: "Admin Panel", Icon: LayoutDashboard, to: "/admin" }
                        : { label: "My Courses", Icon: CoursesIcon, to: "/my-courses" },
                      !isAdminUser && { label: "Liked Courses", Icon: Heart, to: "/liked" },
                    ].filter(Boolean).map(({ label, Icon, to }) => (
                      <button
                        key={to}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          navigate(to);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <Icon size={15} className="text-slate-500 dark:text-slate-400" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}
                </div>
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

              {/* Sign Out (hidden on mobile, available in mobile drawer). A plain icon that turns red, with its name below on hover. */}
              {currentUser && onLogout && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="group relative hidden sm:flex p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 focus-visible:text-rose-600 transition-colors cursor-pointer shrink-0 focus:outline-none"
                  aria-label="Sign Out"
                >
                  <LogOut size={17} />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap rounded-md bg-slate-900 dark:bg-slate-700 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 z-50"
                  >
                    Sign out
                  </span>
                </button>
              )}

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen((prev) => !prev);
                }}
                className="lg:hidden p-1.5 rounded-lg text-slate-950 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer (Seamlessly Connected Directly Under Header, Zero Gap) */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden absolute top-full left-0 right-0 w-full bg-[#dbeafe] dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-b-2 border-blue-400/80 dark:border-slate-800 shadow-2xl overflow-y-auto max-h-[calc(100dvh-95px)] overscroll-contain py-4 px-4 select-none z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center mb-3"
            >
              <input
                type="text"
                placeholder="Search curriculum, labs, lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-3.5 pr-9 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium shadow-xs"
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
                    className="border-b border-blue-200/50 dark:border-slate-800/80 last:border-b-0 pb-1"
                  >
                    {hasDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleMobileDropdown(idx)}
                          className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 text-slate-500 dark:text-slate-400 ${mobileDropdowns[idx] ? "rotate-180 text-blue-600 dark:text-blue-400" : ""}`}
                          />
                        </button>
                        {mobileDropdowns[idx] && (
                          <div className="pl-3 pr-2 pb-2 space-y-2.5 bg-blue-100/70 dark:bg-blue-950/40 rounded-xl p-2.5 my-1 border border-blue-200 dark:border-blue-900/50">
                            {link.sections ? (
                              <>
                                {link.sections.map((section, secIdx) => (
                                  <div key={secIdx} className="space-y-1">
                                    <div className="text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider px-2 pt-1 border-b border-blue-200/70 dark:border-blue-900/40 pb-1">
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
                                        className="block py-1.5 px-2 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer"
                                      >
                                        <div className="font-semibold">• {sub.name}</div>
                                        {sub.desc && (
                                          <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-3">
                                            {sub.desc}
                                          </div>
                                        )}
                                      </a>
                                    ))}
                                  </div>
                                ))}
                                {link.menu?.exploreHref && (
                                  <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-800">
                                    <a
                                      href={link.menu.exploreHref}
                                      onClick={(e) => {
                                        setMobileMenuOpen(false);
                                        handleLinkNavigation(e, link.menu.exploreHref);
                                      }}
                                      className="block py-1 px-2 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
                                    >
                                      → {link.menu.exploreLabel || "Explore All"}
                                    </a>
                                  </div>
                                )}
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
                                  className="block py-1.5 px-2 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
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
                        className={`block py-2.5 px-3 text-sm font-semibold transition-colors rounded-xl cursor-pointer ${
                          isLinkActive(link.href)
                            ? "text-blue-700 dark:text-blue-300 font-bold bg-white/80 dark:bg-blue-950/70 shadow-xs border border-blue-200/80 dark:border-blue-900/60"
                            : "text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        {link.name}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Action Buttons & Theme Controls */}
            <div className="mt-4 pt-3 border-t border-blue-200/80 dark:border-slate-800 space-y-2">
              {/* Theme Toggle Pill on mobile */}
              <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-blue-200/60 dark:border-slate-700 shadow-2xs">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Appearance: {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="relative flex items-center w-[50px] h-[26px] rounded-full bg-slate-900 dark:bg-slate-700 transition-colors focus:outline-none shadow-inner cursor-pointer shrink-0"
                  aria-label="Toggle theme"
                >
                  <div
                    className={`absolute top-[2px] w-[22px] h-[22px] bg-white rounded-full shadow-md transition-transform duration-300 ease-out ${
                      theme === "dark" ? "translate-x-[25px]" : "translate-x-[2px]"
                    }`}
                  />
                  <div className="relative flex justify-between items-center w-full px-[5px] pointer-events-none">
                    <Sun className={`w-3 h-3 ${theme === "dark" ? "text-slate-400" : "text-amber-500 font-bold"}`} />
                    <Moon className={`w-3 h-3 ${theme === "dark" ? "text-indigo-400 font-bold" : "text-slate-400"}`} />
                  </div>
                </button>
              </div>

              {!currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignInClick();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 hover:from-blue-500 hover:to-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
                >
                  <User size={15} className="text-white" />
                  <span>Sign In / Sign Up</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/profile");
                  }}
                  title="View Profile"
                  aria-label={isAdminUser ? "View Profile" : "View Student Profile"}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs flex items-center justify-between transition-colors shadow-xs cursor-pointer"
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
                        {isAdminUser ? "Administrator • View Profile" : `${currentUser.role || "Student Scholar"} • View Profile`}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}

              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(isAdminUser ? "/admin" : "/my-courses");
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    {isAdminUser ? (
                      <LayoutDashboard size={15} className="text-slate-500 dark:text-slate-400" />
                    ) : (
                      <CoursesIcon size={15} className="text-slate-500 dark:text-slate-400" />
                    )}
                    <span>{isAdminUser ? "Admin Panel" : "My Courses"}</span>
                  </span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}

              {currentUser && !isAdminUser && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/liked");
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-xs flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart size={15} className="text-rose-500" />
                    <span>Liked Courses{likes.count > 0 ? ` (${likes.count})` : ""}</span>
                  </span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}

              {currentUser && onLogout && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/60"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              )}

              {onLockSite && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLockSite();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Lock size={13} />
                  <span>Lock Website (Privacy Gate)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Static Layout Spacer (Preserves exact page height so content never shifts under fixed header) */}
      <div
        className="h-[98px] xs:h-[104px] sm:h-[118px] md:h-[122px] w-full shrink-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Mobile Menu Backdrop (Tapping or dragging outside automatically closes the menu) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
          onClick={() => setMobileMenuOpen(false)}
          onTouchMove={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
