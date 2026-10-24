import React from "react";
import { Play } from "lucide-react";
import IntermediateSubjects from "../components/IntermediateSubjects";
import HowToUse from "../components/HowToUse";
import NightSkyHeroBackground from "../components/NightSkyHeroBackground";
import NewsScroller from "../components/NewsScroller";
import HeroContinuousOverlay from "../components/HeroContinuousOverlay";

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
      <section className="relative overflow-hidden min-h-[340px] xs:min-h-[380px] sm:min-h-[460px] md:min-h-[calc(100vh-122px)] flex items-center justify-center">
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

        <div className="w-full relative z-10 flex items-center justify-center py-4 xs:py-6 sm:py-10 md:py-16">
          <HeroContinuousOverlay
            onOpenVideoDemo={onOpenVideoDemo}
            onOpenBooking={onOpenBooking}
          />
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
