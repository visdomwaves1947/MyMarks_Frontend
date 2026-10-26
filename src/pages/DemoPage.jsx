import React, { useState } from "react";
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
  const [activeHeroScene, setActiveHeroScene] = useState(0);

  // 1st, 2nd, and 3rd overlays (Scene 0, 1, 2) keep image.png background
  // 4th overlay (Scene 3: Textbooks Showcase) keeps the cosmic clouds night sky
  const isImageBackground = activeHeroScene === 0 || activeHeroScene === 1 || activeHeroScene === 2;

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Background Math Grid Pattern & Glows */}
      <div className="absolute inset-0 bg-math-grid opacity-70 dark:opacity-40 pointer-events-none -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300/25 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-purple-300/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Hero Section with Dynamic Background (image.png on 1st, 2nd & 3rd overlays; Cosmic Night Sky with Clouds on 4th) */}
      <section className="relative overflow-hidden min-h-[340px] xs:min-h-[380px] sm:min-h-[460px] md:min-h-[calc(100vh-122px)] flex items-center justify-center">
        {/* Layer 1: Animated 3D HD Night Sky Canvas (Luminous Royal Cosmic Navy Background with Nebula Clouds, Stars & Meteors) */}
        <NightSkyHeroBackground />

        {/* Layer 2: Illustrated Map Background (public/image.png) for 1st, 2nd, and 3rd overlays - crystal-clear and very bright */}
        <div
          className={`absolute inset-0 z-[1] transition-opacity duration-250 ease-out pointer-events-none ${
            isImageBackground ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!isImageBackground}
        >
          <img
            src="/image.png"
            alt="Hero Background Map"
            className="w-full h-full object-cover object-center scale-105 brightness-[1.03] contrast-[1.02]"
            loading="eager"
          />
          {/* Gentle edge feathering only at extreme borders for clean navbar & news bar blending */}
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>

        {/* Delicate Ambient Center Highlight for Cosmic Night Sky */}
        <div
          className={`absolute inset-0 pointer-events-none z-[2] transition-opacity duration-300 ${
            isImageBackground ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, rgba(4, 13, 40, 0.25) 75%, rgba(4, 13, 40, 0.45) 100%)",
          }}
        />

        <div className="w-full relative z-10 flex items-center justify-center py-4 xs:py-6 sm:py-10 md:py-16">
          <HeroContinuousOverlay
            onOpenVideoDemo={onOpenVideoDemo}
            onOpenBooking={onOpenBooking}
            onSceneChange={setActiveHeroScene}
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
