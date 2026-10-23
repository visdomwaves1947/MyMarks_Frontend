import React from "react";
import { Play } from "lucide-react";
import IntermediateSubjects from "../components/IntermediateSubjects";
import HowToUse from "../components/HowToUse";
import NightSkyHeroBackground from "../components/NightSkyHeroBackground";
import NewsScroller from "../components/NewsScroller";

export default function DemoPage({
  onOpenBooking,
  onOpenVideoDemo,
  currentUser,
  onOpenSignIn,
  onOpenSignUp,
}) {
  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Background Math Grid Pattern & Glows */}
      <div className="absolute inset-0 bg-math-grid opacity-70 dark:opacity-40 pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300/25 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-purple-300/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Hero Section with Vibrant 3D HD Night Sky: High-Density Blinking Stars, Moon & Meteors */}
      <section className="relative overflow-hidden min-h-[calc(100vh-122px)] flex items-center justify-center">
        {/* Animated 3D HD Night Sky Canvas (Luminous Royal Cosmic Navy Background) */}
        <NightSkyHeroBackground />

        {/* Delicate Ambient Center Highlight (Allows full visibility of stars & night sky) */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, rgba(4, 13, 40, 0.25) 75%, rgba(4, 13, 40, 0.45) 100%)",
          }}
        />

        <div className="w-full relative z-10 min-h-[calc(100vh-122px)] flex items-center justify-center py-16 sm:py-24">
          {/* Content Overlay */}
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
            {/* Plain Visdom Waves Brand Layout (Logo + Bright Clear Typography, Refined Font Weight) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 text-center sm:text-left mb-8 sm:mb-10">
              {/* Logo Beside */}
              <img
                src="/Visdomlogo.png"
                alt="Visdom Waves Logo"
                className="h-16 xs:h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] hover:scale-105 transition-transform duration-300 shrink-0"
              />

              {/* Brand Typography - Bright, Crisp, Refined Weight */}
              <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-tight font-sans drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                  Visdom Waves
                </h1>

                <h2 className="text-lg sm:text-2xl md:text-3xl font-medium text-cyan-300 tracking-wide mt-1.5 sm:mt-2.5 font-sans drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  Innovations Private Limited
                </h2>

                {/* Slogan: Driven by vision */}
                <div className="flex items-center gap-3 mt-2 sm:mt-3">
                  <span className="h-[2px] w-6 sm:w-10 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]"></span>
                  <span className="text-xs sm:text-sm md:text-base font-semibold text-cyan-200 tracking-[0.25em] uppercase font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    Driven by vision
                  </span>
                  <span className="h-[2px] w-6 sm:w-10 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]"></span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Watch Demo Videos only */}
            <div className="flex items-center justify-center w-full sm:w-auto">
              <button
                onClick={() => onOpenVideoDemo && onOpenVideoDemo()}
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-medium text-sm sm:text-base shadow-xl shadow-indigo-950/70 hover:scale-[1.03] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer border border-blue-400/40"
              >
                <Play size={18} fill="currentColor" />
                <span>Watch Demo Videos</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events Section Placed Below Hero Section */}
      <NewsScroller onOpenBooking={onOpenBooking} />

      {/* How To Use Section */}
      <HowToUse
        onOpenSignUp={() => onOpenBooking && onOpenBooking("Sign Up")}
      />

      {/* AP/TS Intermediate Subjects Grid */}
      <IntermediateSubjects
        onEnroll={(subjectName) =>
          onOpenBooking && onOpenBooking(`Enroll in ${subjectName}`)
        }
        currentUser={currentUser}
        onOpenSignIn={onOpenSignIn}
        onOpenSignUp={onOpenSignUp}
      />
    </div>
  );
}
