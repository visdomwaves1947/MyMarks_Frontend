import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Award,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Compass,
  CheckCircle2,
  UserCheck,
  Layers,
  Briefcase,
  Users
} from 'lucide-react';

import SupportersSlider from './SupportersSlider';
import useAboutPage from '../hooks/useAboutPage';
import { initialsOf } from '../utils/initials';

const HERO_BG_IMAGE = '/about-hero-bg.png';

// The icon choices on the admin About Us tab
const LEADER_ICONS = {
  cpu: Cpu,
  compass: Compass,
  shield: ShieldCheck,
  graduation: GraduationCap,
  award: Award,
  briefcase: Briefcase,
  users: Users,
};

const iconOf = (leader) => LEADER_ICONS[leader.icon] || Award;

// Executive portrait, or the leader's initials when there is no photo or it fails to load
function Portrait({ leader }) {
  const [failedImage, setFailedImage] = useState('');
  const hasPhoto = Boolean(leader.image) && failedImage !== leader.image;

  return (
    <div className="shrink-0">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-md bg-white flex items-center justify-center">
        {hasPhoto ? (
          <img
            src={leader.image}
            alt={leader.name}
            width="112"
            height="112"
            loading="eager"
            decoding="async"
            onError={() => setFailedImage(leader.image)}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <span className="text-3xl font-black text-sky-700">{initialsOf(leader.name)}</span>
        )}
      </div>
    </div>
  );
}

function RoleChip({ leader }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-cyan-300 border border-sky-300 dark:border-sky-700 shadow-xs">
      {React.createElement(iconOf(leader), { size: 14, className: 'shrink-0 text-sky-700 dark:text-cyan-300' })}
      <span>{leader.role}</span>
    </div>
  );
}

function Tagline({ leader }) {
  if (!leader.tagline) return null;
  return (
    <div className="p-3 sm:p-3.5 rounded-xl bg-amber-100/90 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-500/60 shadow-xs mb-3.5 text-left">
      <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 leading-snug">
        {leader.tagline}
      </p>
    </div>
  );
}

function Biography({ leader }) {
  if (!leader.bio) return null;
  return (
    <div className="p-4 sm:p-5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-sky-200 dark:border-slate-700 shadow-xs mb-3.5 text-left">
      <h3 className="text-xs sm:text-sm font-bold text-sky-800 dark:text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Briefcase size={14} className="text-sky-700 dark:text-cyan-400" />
        <span>Leadership Profile & Background</span>
      </h3>
      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
        {leader.bio}
      </p>
    </div>
  );
}

function StrategicImpact({ leader, className = 'mb-3.5' }) {
  if (!leader.highlights?.length) return null;
  return (
    <div className={`${className} text-left`}>
      <h3 className="text-xs sm:text-sm font-bold text-sky-800 dark:text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Award size={14} className="text-sky-700 dark:text-cyan-400" />
        <span>Strategic Impact</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {leader.highlights.map((item, hIdx) => (
          <div
            key={hIdx}
            className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-sky-200 dark:border-slate-700 flex items-start gap-2.5 shadow-xs text-slate-900 dark:text-white"
          >
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="text-xs sm:text-[13px] font-semibold leading-snug text-slate-800 dark:text-slate-100">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Tags({ leader, className = '' }) {
  if (!leader.tags?.length) return null;
  return (
    <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-2 ${className}`}>
      {leader.tags.map((tag, tIdx) => (
        <span
          key={tIdx}
          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-cyan-200 border border-sky-300 dark:border-sky-700 shadow-2xs"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ReadMore({ leader, className = '' }) {
  if (!leader.link) return null;
  return (
    <a
      href={leader.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      <span>Read more about {leader.name}</span>
      <ExternalLink size={14} />
    </a>
  );
}

/**
 * One leader in View All mode. The admin About Us tab shows the same card as its preview.
 */
export function LeaderCard({ leader, index = 0 }) {
  return (
    <div
      id={`leader-card-${index}`}
      data-testid="leader-card"
      className="relative rounded-2xl border-2 border-sky-300 dark:border-sky-600 bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#e0f2fe] dark:from-[#0d2238] dark:via-[#102944] dark:to-[#0b1b2d] shadow-xl overflow-hidden hover:border-sky-400 group"
      style={{ contain: 'layout style paint' }}
    >
      {/* Card Content Layer - Crisp, High-Contrast */}
      <div className="relative z-10 p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 text-center sm:text-left">

          {/* Executive Portrait Photo */}
          <Portrait leader={leader} />

          {/* Leader Info */}
          <div className="grow w-full">

            {/* Role Chip */}
            <RoleChip leader={leader} />

            {/* Full Name - Sharp, Crisp, Non-blurry */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-2 drop-shadow-xs">
              {leader.name}
            </h2>

            {/* Tagline - High Contrast, 100% Clear & Legible Container */}
            <Tagline leader={leader} />

            {/* Biography Box - Solid High Contrast Card */}
            <Biography leader={leader} />

            {/* Strategic Impact Box - Solid High Contrast Grid */}
            <StrategicImpact leader={leader} />

            {/* Tags - Solid high-contrast chips */}
            <Tags leader={leader} className="mb-4" />

            {/* Read More Link */}
            {leader.link && (
              <div className="pt-1 flex justify-center sm:justify-start">
                <ReadMore leader={leader} />
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}

// High-Visibility, Premium Artistic Divider Line under each card
function CardDivider() {
  return (
    <div className="py-9 flex items-center justify-center">
      <div className="w-full max-w-3xl flex items-center justify-center gap-4 px-4">
        {/* Left Glowing Beam */}
        <div className="h-[3px] grow rounded-full bg-gradient-to-r from-transparent via-blue-500 to-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />

        {/* Center Elegant Emblem Jewel */}
        <div className="flex items-center gap-2 shrink-0 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-500 shadow-md">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-sm" />
          <span className="w-3.5 h-3.5 rotate-45 bg-gradient-to-tr from-sky-400 to-blue-600 rounded-xs shadow-xs" />
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-sm" />
        </div>

        {/* Right Glowing Beam */}
        <div className="h-[3px] grow rounded-full bg-gradient-to-l from-transparent via-blue-500 to-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
      </div>
    </div>
  );
}

// Shown only on the first visit, until the saved page arrives
function AboutSkeleton() {
  return (
    <div role="status" aria-label="Loading the About Us page" className="py-10 sm:py-14 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        {[0, 1].map((key) => (
          <div key={key} className="rounded-2xl border-2 border-sky-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-5 sm:p-7 flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-sky-100 dark:bg-slate-800 shrink-0 mx-auto sm:mx-0" />
            <div className="grow space-y-3">
              <div className="h-5 w-40 rounded-full bg-sky-100 dark:bg-slate-800" />
              <div className="h-7 w-64 rounded-lg bg-sky-100 dark:bg-slate-800" />
              <div className="h-16 rounded-xl bg-sky-100 dark:bg-slate-800" />
              <div className="h-24 rounded-xl bg-sky-100 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// The About Us page, edited on the admin Website Pages > About Us tab
export default function AboutUs() {
  const about = useAboutPage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('all'); // Default to View All
  const sectionRef = useRef(null);

  const leaders = about?.leaders || [];
  const hero = about?.hero || {};
  const currentIndex = leaders.length > 0 ? activeIndex % leaders.length : 0;
  const currentLeader = leaders[currentIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % leaders.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + leaders.length) % leaders.length);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen bg-[#EBF0F7] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300"
    >

      {/* ============================================================ */}
      {/* HERO SECTION IN ABOUT US WITH LIGHT BLUE BACKGROUND IMAGE    */}
      {/* ============================================================ */}
      <div className="relative w-full overflow-hidden min-h-[340px] sm:min-h-[400px] flex items-center justify-center py-12 sm:py-16 lg:py-20 border-b border-sky-300/60 dark:border-slate-800 shadow-sm">

        {/* Light Blue Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG_IMAGE}
            alt="About Us Leadership Hero"
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          {/* Subtle light blue gradient wash for seamless tone */}
          <div className="absolute inset-0 bg-sky-900/10 dark:bg-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/30 via-transparent to-[#EBF0F7] dark:from-transparent dark:to-[#070B14]" />
        </div>

        {/* Hero Content - Crisp High-Contrast Container */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 text-center flex flex-col items-center">

          <div className="w-full bg-[#cde4fd] dark:bg-[#0d2238] px-5 py-6 sm:px-8 sm:py-7 rounded-2xl border-2 border-sky-400 dark:border-sky-600 shadow-xl flex flex-col items-center min-h-[150px]">

            {about && (
              <>
                {/* Top Pill - Crisp, compact, balanced */}
                {hero.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-sky-950 border border-sky-300 dark:border-sky-700 shadow-xs mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-wide uppercase text-blue-950 dark:text-cyan-300">
                      {hero.badge}
                    </span>
                  </div>
                )}

                {/* Heading - Reduced Size & Compact Length, Fits Perfectly */}
                {hero.heading && (
                  <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug mb-2 text-center max-w-xl">
                    {hero.heading}
                  </h1>
                )}

                {/* Subtitle - Reduced Length and Clean Weight */}
                {hero.subheading && (
                  <p className="text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 font-semibold leading-relaxed max-w-lg mx-auto mb-4 text-center">
                    {hero.subheading}
                  </p>
                )}

                {/* View Mode Toggle: One-by-One / View All (Matching Light Blue Theme) */}
                {leaders.length > 1 && (
                  <div className="inline-flex items-center p-1 rounded-xl bg-sky-200/90 dark:bg-slate-800 border border-sky-300 dark:border-slate-700 shadow-xs">
                    <button
                      onClick={() => setViewMode('one-by-one')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        viewMode === 'one-by-one'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-800 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white'
                      }`}
                    >
                      <UserCheck size={13} />
                      <span>One-by-One</span>
                    </button>
                    <button
                      onClick={() => setViewMode('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        viewMode === 'all'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-800 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white'
                      }`}
                    >
                      <Layers size={13} />
                      <span>View All</span>
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>

      {!about && <AboutSkeleton />}

      {/* ============================================================ */}
      {/* LEADERSHIP CARDS (COMPACT SIZE, CRISP TEXT, REAL PHOTOS)      */}
      {/* ============================================================ */}
      {about && (
        <div className="py-10 sm:py-14 lg:py-16 px-3 sm:px-6 relative">
          <div className="max-w-4xl mx-auto">

            {/* DEFAULT: VIEW ALL CARDS */}
            {(viewMode === 'all' || leaders.length === 1) && (
              <div className="space-y-8">
                {leaders.map((leader, idx) => (
                  <React.Fragment key={idx}>
                    <LeaderCard leader={leader} index={idx} />
                    {idx < leaders.length - 1 && <CardDivider />}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* ONE-BY-ONE SPOTLIGHT MODE */}
            {viewMode === 'one-by-one' && leaders.length > 1 && (
              <div className="max-w-3xl mx-auto">
                <div
                  data-testid="leader-spotlight"
                  className="relative rounded-2xl border-2 border-sky-300 dark:border-sky-600 bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-[#e0f2fe] dark:from-[#0d2238] dark:via-[#102944] dark:to-[#0b1b2d] shadow-xl overflow-hidden"
                  style={{ contain: 'layout style paint' }}
                >
                  {/* Card Content Layer - Crisp, Solid */}
                  <div className="relative z-10 p-5 sm:p-7 lg:p-8">

                    {/* Person Header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 mb-5 text-center sm:text-left">

                      {/* Executive Portrait Photo */}
                      <Portrait key={currentIndex} leader={currentLeader} />

                      {/* Details */}
                      <div className="grow w-full">
                        {/* Role Chip */}
                        <RoleChip leader={currentLeader} />

                        {/* Name */}
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-2 drop-shadow-xs">
                          {currentLeader.name}
                        </h2>

                        {/* Tagline - High Contrast, 100% Clear & Legible Container */}
                        <Tagline leader={currentLeader} />

                        {/* Tags */}
                        <Tags leader={currentLeader} />
                      </div>
                    </div>

                    {/* Biography Box */}
                    <Biography leader={currentLeader} />

                    {/* Strategic Impact */}
                    <StrategicImpact leader={currentLeader} className="mb-4" />

                    {/* Bottom Controls Bar */}
                    <div className="pt-3.5 border-t border-sky-300/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {/* Read More Link */}
                      <ReadMore leader={currentLeader} className="w-full sm:w-auto justify-center" />

                      {/* Step Controls */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end sm:ml-auto">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Person {currentIndex + 1} of {leaders.length}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handlePrev}
                            className="p-2.5 rounded-lg bg-white hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-sky-300 dark:border-slate-600 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                            title="Previous Leader"
                            aria-label="Previous Leader"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={handleNext}
                            className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Next Leader"
                            aria-label="Next Leader"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Guiding Visionaries & Supporters Slider */}
            <SupportersSlider section={about.inspirations} />

          </div>
        </div>
      )}

    </section>
  );
}
