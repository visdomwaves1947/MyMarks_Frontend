import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Lock,
  LogIn,
  X,
  Sparkles,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import LabPracticalHub from "./lab/LabPracticalHub";
import CourseCard from "./course/CourseCard";
import { LAB_SUBJECTS } from "../data/labPracticalsData";
import useCatalog from "../hooks/useCatalog";
import useMyCourses, { continueLink } from "../hooks/useMyCourses";
import useLikes from "../hooks/useLikes";
import { isOutsideLink } from "../utils/courseImage";
import { jumpToTop } from "../utils/scroll";


export default function IntermediateSubjects({
  onEnroll,
  currentUser,
  onOpenSignIn,
  onOpenSignUp,
}) {
  const { courses, streams, isLoading, error, retry } = useCatalog();
  const [lockedSubject, setLockedSubject] = useState(null);
  const [selectedStream, setSelectedStream] = useState("all");
  const [activeLabModalSubject, setActiveLabModalSubject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGroupSelection = (grp) => {
      if (!grp) return;
      setSelectedStream(grp.toLowerCase());
      setTimeout(() => {
        const coursesEl = document.getElementById("courses");
        if (coursesEl) {
          coursesEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    };

    // 1. Check URL query params on load or location change
    const groupParam = searchParams.get("group") || searchParams.get("stream");
    if (groupParam) {
      handleGroupSelection(groupParam);
    }

    // 2. Listen to custom event for instantaneous in-page navigation from Navbar/Footer
    const onSelectGroupEvent = (e) => {
      if (e.detail) {
        handleGroupSelection(e.detail);
      }
    };
    window.addEventListener("selectIntermediateGroup", onSelectGroupEvent);

    return () => {
      window.removeEventListener("selectIntermediateGroup", onSelectGroupEvent);
    };
  }, [searchParams, location]);

  // Determine if the user is authenticated from props or saved local storage
  const isAuthenticated = Boolean(
    currentUser ||
    (() => {
      try {
        const stored = localStorage.getItem("mla_user");
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    })(),
  );

  // A stream that has been hidden or removed falls back to all courses
  const activeStream =
    selectedStream === "labs" || streams.some((stream) => stream.slug === selectedStream)
      ? selectedStream
      : "all";

  const coursesInStream = (slug) =>
    courses.filter((course) => course.streams.some((stream) => stream.slug === slug));

  const visibleCourses = activeStream === "all" ? courses : coursesInStream(activeStream);

  const handleExplore = (course) => {
    if (isOutsideLink(course.ownLink)) {
      window.open(course.ownLink, "_blank", "noopener,noreferrer");
      return;
    }
    // Jump first, so the next page opens at its top with its loading skeleton in view
    jumpToTop();
    navigate(course.ownLink || `/courses/${course.slug}`);
  };

  const handleEnroll = (course) => {
    if (onEnroll) {
      onEnroll(course.name, course);
    }
  };

  // Courses the signed-in student already has go straight back in, at the lesson they stopped in
  const mine = useMyCourses(currentUser);
  const owned = new Map(mine.courses.map((item) => [item.courseId, item]));
  const ownedBy = (course) => {
    const item = owned.get(String(course._id));
    return item ? { started: item.lessonsStarted > 0 } : null;
  };
  const handleContinue = (course) => {
    jumpToTop();
    navigate(continueLink(course));
  };

  // The heart on each card: a visitor signs in first; administrators have no likes
  const likes = useLikes(currentUser);
  const signIn = () => (onOpenSignIn ? onOpenSignIn() : navigate("/signin"));
  const likeFor = (course) =>
    currentUser?.role === "admin"
      ? null
      : {
          liked: likes.isLiked(course._id),
          onToggle: () =>
            currentUser
              ? likes.toggle(course).catch((problem) => problem.status === 401 && signIn())
              : signIn(),
        };

  const handleGoToSignIn = () => {
    setLockedSubject(null);
    if (onOpenSignIn) {
      onOpenSignIn();
    } else {
      navigate("/signin");
    }
  };

  const handleGoToSignUp = () => {
    setLockedSubject(null);
    if (onOpenSignUp) {
      onOpenSignUp();
    } else {
      navigate("/signup");
    }
  };

  const renderPracticalCard = (lab) => {
    return (
      <div
        key={`practical-${lab.id}`}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[330px] sm:h-[360px] border-2 border-blue-400/60 hover:border-blue-500 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
        onClick={() => {
          if (!isAuthenticated) {
            setLockedSubject({
              id: lab.id,
              name: lab.name,
              desc: lab.overview,
              image: lab.image,
              hasPractical: true,
              practicalMarks: "30 Marks",
            });
            return;
          }
          jumpToTop();
          navigate(`/practicals?subject=${lab.id}`);
        }}
      >
        {/* Full-Cover Background Image */}
        <img
          src={lab.image}
          alt={lab.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
        />

        {/* Legibility Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-900/10 pointer-events-none"></div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-3.5 sm:p-4">
          {/* Top Bar: Practical Category Pill */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-blue-100 bg-blue-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-blue-400/30 uppercase tracking-wider">
              {lab.stream}
            </span>
          </div>

          {/* Bottom Overlay: Title & Blue Buttons */}
          <div className="mt-auto pt-2">
            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-white leading-tight mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate">
              {lab.name}
            </h4>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    setLockedSubject({
                      id: lab.id,
                      name: lab.name,
                      desc: lab.overview,
                      image: lab.image,
                      hasPractical: true,
                      practicalMarks: "30 Marks",
                    });
                    return;
                  }
                  jumpToTop();
                  navigate(`/practicals?subject=${lab.id}`);
                }}
                className="flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-400/40 cursor-pointer"
              >
                <span>Explore</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isAuthenticated) {
                    setLockedSubject({
                      id: lab.id,
                      name: lab.name,
                      desc: lab.overview,
                      image: lab.image,
                      hasPractical: true,
                      practicalMarks: "30 Marks",
                    });
                    return;
                  }
                  setActiveLabModalSubject(lab.id);
                }}
                className="flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-400/40 cursor-pointer"
              >
                <span>Demo Trial</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <section
      className="py-10 sm:py-14 bg-[#e6f0fa] dark:bg-[#071328] border-t border-blue-200/60 dark:border-blue-900/40 relative"
      id="courses"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {!isAuthenticated ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <Lock size={12} className="text-blue-600 dark:text-blue-400" />
              <span>Intermediate Subjects</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <Sparkles size={12} className="text-blue-600 dark:text-blue-400" />
              <span>AP/TS Board Curriculum</span>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white tracking-tight">
            Intermediate Subjects
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal mt-1 leading-relaxed">
            Complete subject-wise curriculum for AP & Telangana Intermediate students. Select your subject to explore interactive classes, notes, and simulators.
          </p>
        </div>

        {/* Lock Info Banner when user is not signed in */}
        {!isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-8 p-3.5 sm:p-4 rounded-2xl bg-[#c8e1fd] dark:bg-[#0f2a4a] border-2 border-[#93c5fd] dark:border-[#1e4b7a] text-blue-900 dark:text-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock size={16} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  Intermediate Subject Trials are Locked
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">
                  Sign in to unlock interactive demo trials and video lessons for any subject.
                </p>
              </div>
            </div>
            <button
              onClick={handleGoToSignIn}
              className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogIn size={13} />
              <span>Sign In Now</span>
            </button>
          </div>
        )}

        {/* Interactive Stream Filter Tabs */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-nowrap items-center sm:justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-[#c8e1fd] dark:bg-[#0f2a4a] rounded-2xl border-2 border-[#93c5fd] dark:border-[#1e4b7a] shadow-xs max-w-5xl mx-auto overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => setSelectedStream("all")}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeStream === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              All Subjects ({courses.length})
            </button>
            <button
              onClick={() => setSelectedStream("labs")}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                activeStream === "labs"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
              }`}
            >
              <FlaskConical size={13} />
              <span>Lab / Practicals ({LAB_SUBJECTS.length})</span>
            </button>
            {streams.map((stream) => (
              <button
                key={stream.slug}
                onClick={() => setSelectedStream(stream.slug)}
                title={stream.name}
                className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeStream === stream.slug
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-800 dark:text-slate-200 hover:text-blue-600 hover:bg-blue-100/70 dark:hover:bg-blue-900/50"
                }`}
              >
                {stream.code}
                {stream.slug === "languages" ? ` (${coursesInStream(stream.slug).length})` : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards */}
        {activeStream === "labs" ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-16">
            {LAB_SUBJECTS.map(renderPracticalCard)}
          </div>
        ) : isLoading ? (
          <div
            role="status"
            aria-label="Loading courses"
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-16"
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-[330px] sm:h-[360px] rounded-2xl sm:rounded-3xl bg-blue-100 dark:bg-slate-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto mb-16 text-center">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              We could not load the courses. Please check your connection and try again.
            </p>
            <button
              onClick={retry}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : visibleCourses.length === 0 ? (
          <p className="mb-16 text-center text-sm text-slate-600 dark:text-slate-400">
            Courses for this group are being added. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mb-16">
            {visibleCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onExplore={handleExplore}
                onEnroll={handleEnroll}
                mine={ownedBy(course)}
                onContinue={handleContinue}
                like={likeFor(course)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Interactive Lab Practical Modal Hub */}
      {activeLabModalSubject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn overflow-y-auto"
          onClick={() => setActiveLabModalSubject(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-left my-auto max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FlaskConical size={20} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Intermediate Lab & Practical Hub
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Interactive Simulators, Experiments & Board Viva Bank
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveLabModalSubject(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close lab modal"
              >
                <X size={18} />
              </button>
            </div>

            <LabPracticalHub
              initialSubjectId={activeLabModalSubject}
              onOpenBooking={(topic) => {
                setActiveLabModalSubject(null);
                if (onEnroll) onEnroll(topic);
              }}
            />
          </div>
        </div>
      )}

      {/* Ultra-Premium Animated Lock Modal */}
      {lockedSubject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn"
          onClick={() => setLockedSubject(null)}
        >
          {/* Ambient Glowing Background Orbs */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

          <div
            className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-slate-800 text-center transform transition-all animate-scaleUp overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Animated Gradient Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500"></div>

            {/* Close Button */}
            <button
              onClick={() => setLockedSubject(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-all duration-200 hover:rotate-90 cursor-pointer shadow-xs"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Animated 3D Security Emblem */}
            <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
              {/* Outer pulsing glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-md animate-pulse"></div>

              {/* Spinning dashed ring effect */}
              <div className="absolute -inset-1 rounded-3xl border border-blue-500/30 border-dashed animate-[spin_12s_linear_infinite]"></div>

              {/* Main Badge */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/20">
                <Lock size={30} className="stroke-[2.2] animate-bounce" />
              </div>

              {/* Corner Sparkle Badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-blue-400 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md">
                <Sparkles size={12} className="animate-pulse" />
              </div>
            </div>

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/25 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2.5 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Demo Trial Locked</span>
            </div>

            {/* Modal Heading */}
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight mb-2">
              Sign In Required
            </h3>

            {/* Targeted User-Requested Message */}
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-5 max-w-md mx-auto">
              Please{" "}
              <button
                onClick={handleGoToSignIn}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                sign in
              </button>{" "}
              to access the demo trial for{" "}
              <span className="font-semibold text-slate-900 dark:text-white underline decoration-blue-500 decoration-2 underline-offset-4">
                {lockedSubject.name}
              </span>
              .
            </p>

            {/* Subject Preview & Feature Perks Box */}
            <div className="bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl p-4 mb-6 text-left border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
              <div className="flex items-center gap-3.5 mb-3.5 pb-3 border-b border-slate-200/70 dark:border-slate-700/50">
                <img
                  src={lockedSubject.image}
                  alt={lockedSubject.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 ring-2 ring-white dark:ring-slate-700 shadow-md"
                />
                <div className="min-w-0">
                  <div className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 tracking-wider mb-1">
                    {lockedSubject.category} &bull; AP / TS Intermediate
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                    {lockedSubject.name}
                  </div>
                </div>
              </div>

              {/* Perks Checklist */}
              <div className="space-y-2 text-xs font-normal text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-blue-600 shrink-0"
                  />
                  <span>
                    Full Chapter Interactive Lessons & Video Concept Maps
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-blue-600 shrink-0"
                  />
                  <span>Live Formula Simulations & Solved Board Examples</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="text-blue-600 shrink-0"
                  />
                  <span>
                    Timed Mock Question Sets with Instant Score Feedback
                  </span>
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoToSignIn}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] group relative overflow-hidden"
              >
                <LogIn
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
                <span>Sign In to Access Demo</span>
              </button>

              <button
                onClick={handleGoToSignUp}
                className="w-full py-2.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700/60 flex items-center justify-center gap-2 hover:border-slate-300 dark:hover:border-slate-600 group"
              >
                <span>Don't have an account? Sign Up Free</span>
                <ArrowRight
                  size={15}
                  className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                />
              </button>
            </div>

            {/* Instant Access Note */}
            <p className="mt-4 text-[11px] font-normal text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-blue-500" />
              <span>
                Instant activation &bull; Free demo trial across all subjects
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
