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
  Briefcase 
} from 'lucide-react';

import SupportersSlider from './SupportersSlider';

const HERO_BG_IMAGE = '/about-hero-bg.png';
const CARD_BG_IMAGE = '/Sunlit Sea Turtle Among Coral.png';

const LEADERS = [
  {
    id: 'dr-srinivas-sivarathri',
    role: 'Founder & Managing Director',
    name: 'Dr. Srinivas Sivarathri',
    image: '/leaders/srinivas.png',
    tagline: 'Seasoned technology leader and academician with 27+ years of experience in AI, digital transformation, and scalable enterprise solutions.',
    bio: 'Dr. Srinivas Sivarathri is a seasoned technology leader, academician, and strategist with over 27 years of combined experience in IT development, higher education, and global project leadership. His visionary guidance bridges state-of-the-art technological advancement with pedagogical excellence, spearheading MyMarks and Visdom Waves toward redefining modern education.',
    link: 'https://www.visdomwaves.com/leadership-team/dr-srinivas-sivarathri',
    initials: 'SS',
    category: 'Leadership',
    icon: Cpu,
    tags: [
      '27+ Years Experience',
      'Artificial Intelligence',
      'Digital Transformation',
      'Enterprise Architecture',
      'Academic Leadership'
    ],
    highlights: [
      'Over 27 years of combined experience across IT and higher education',
      'Extensive expertise in AI, digital transformation, and global scale systems',
      'Leading strategy and educational innovation at Visdom Waves'
    ]
  },
  {
    id: 'gopi-chand-vempati',
    role: 'Head of Technology & Strategy',
    name: 'Gopi Chand Vempati',
    image: '/leaders/gopi.webp',
    tagline: 'Seasoned technology leader and entrepreneur with 16+ years of experience in building scalable, mission-critical digital platforms and driving innovation-led growth.',
    bio: 'Gopi Chand Vempati is a seasoned technology leader and entrepreneur with over 16 years of hands-on experience in building scalable, mission-critical digital products and leading technology strategy for high-impact organizations. He architects high-throughput infrastructure and oversees robust technological execution across all learning platforms.',
    link: 'https://www.visdomwaves.com/leadership-team/gopi-chand-vempati',
    initials: 'GV',
    category: 'Technology',
    icon: Compass,
    tags: [
      '16+ Years Experience',
      'Platform Architecture',
      'Tech Entrepreneurship',
      'Mission-Critical Systems',
      'Growth Strategy'
    ],
    highlights: [
      '16+ years building enterprise-grade, high-availability digital solutions',
      'Proven track record in scaling technology startups and products',
      'Directing core tech innovation, platform reliability, and roadmap'
    ]
  },
  {
    id: 'vishwanath-chinthakindi',
    role: 'Head of Cyber Security & Quality Assurance',
    name: 'Vishwanath Chinthakindi',
    image: '/leaders/vishwanath.webp',
    tagline: 'Cybersecurity leader and quality evangelist with deep expertise in secure architecture, risk management, and compliance.',
    bio: 'Vishwanath Chinthakindi is a seasoned cybersecurity leader and the Founder & CEO of Nivi Cyber Solutions, with a strong blend of industry, consulting, and training experience. He spent five years with IBM as a Service Delivery Specialist, where he built a solid foundation in enterprise security operations, service excellence, and risk management.',
    link: 'https://www.visdomwaves.com/leadership-team/vishwanath-chinthakindi',
    initials: 'VC',
    category: 'Cyber Security',
    icon: ShieldCheck,
    tags: [
      'Founder & CEO, Nivi Cyber',
      'Ex-IBM Service Delivery',
      'Secure Architecture',
      'Risk & Compliance',
      'Quality Evangelist'
    ],
    highlights: [
      '5+ years at IBM heading service delivery and enterprise security operations',
      'Founder & CEO of specialized cybersecurity firm Nivi Cyber Solutions',
      'Guarantees bank-grade security, data privacy, and student trust'
    ]
  },
  {
    id: 'prof-s-ramachandram',
    role: 'Head of Advisory Board',
    name: 'Prof. S. Ramachandram',
    image: '/leaders/ramachandram.webp',
    tagline: 'Eminent academic leader and computer science expert with decades of experience in higher education.',
    bio: 'Professor S. Ramachandram is a highly respected academic leader with over three decades of experience in teaching, research, and university administration. As a senior faculty member and former Vice-Chancellor of Osmania University, he has played a pivotal role in shaping academic programs, mentoring students, and advancing research in emerging technology domains.',
    link: 'https://www.visdomwaves.com/leadership-team/prof-s-ramachandram',
    initials: 'SR',
    category: 'Advisory Board',
    icon: GraduationCap,
    tags: [
      '30+ Years Academic Leadership',
      'Former Vice-Chancellor, OU',
      'Computer Science Veteran',
      'University Administration',
      'Curriculum Development'
    ],
    highlights: [
      'More than 30 years guiding higher education and academic reform',
      'Distinguished tenure as Vice-Chancellor of renowned Osmania University',
      'Shapes foundational pedagogy and academic governance for MyMarks'
    ]
  },
  {
    id: 'mr-gedela-srinivasa-rao',
    role: 'Advisor – Academic Excellence',
    name: 'Mr. Gedela Srinivasa Rao',
    image: '/leaders/gedela.png',
    tagline: 'Popularly known in the student and parent community as MSR Sir (Mathematics Srinivasa Rao), a highly respected academic leader, mathematics mentor, and strategic education expert with nearly two decades of distinguished experience in competitive examination training.',
    bio: 'Gedela Srinivasa Rao, popularly known in the student and parent community as MSR Sir (Mathematics Srinivasa Rao), is a highly respected academic leader, mathematics mentor, and strategic education expert with nearly two decades of distinguished experience in competitive examination training, particularly for JEE Main and JEE Advanced. His mastery in breaking down complex concepts has guided thousands of students to top ranks.',
    link: 'https://www.visdomwaves.com/leadership-team/mr-gedela-srinivasa-rao',
    initials: 'GR',
    category: 'Academic Excellence',
    icon: Award,
    tags: [
      'MSR Sir (Maths Mentor)',
      '20+ Years Experience',
      'JEE Main & Advanced Specialist',
      'Competitive Exam Strategist',
      'Top Rank Producer'
    ],
    highlights: [
      'Two decades mentoring premier rankers for JEE Main and Advanced',
      'Celebrated pedagogy for deep conceptual problem-solving intuition',
      'Oversees curriculum rigor, test papers, and board exam alignment'
    ]
  }
];

export default function AboutUs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('all'); // Default to View All
  const sectionRef = useRef(null);

  const currentLeader = LEADERS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % LEADERS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + LEADERS.length) % LEADERS.length);
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
          />
          {/* Subtle light blue gradient wash for seamless tone */}
          <div className="absolute inset-0 bg-sky-900/10 dark:bg-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/30 via-transparent to-[#EBF0F7] dark:from-transparent dark:to-[#070B14]" />
        </div>

        {/* Hero Content - Transparent Glassmorphic Container, perfectly fitted */}
        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 text-center flex flex-col items-center">
          
          <div className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md px-4 py-5 sm:px-7 sm:py-6 rounded-2xl border border-white/60 dark:border-sky-800/40 shadow-lg flex flex-col items-center">
            
            {/* Top Pill - Crisp, compact, balanced */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-100/90 dark:bg-sky-950/90 border border-sky-300/80 dark:border-sky-800/80 shadow-2xs mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-sky-900 dark:text-cyan-300">
                About Us • Leadership & Advisory
              </span>
            </div>

            {/* Heading - Reduced Size & Compact Length, Fits Perfectly */}
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-950 dark:text-white tracking-tight leading-snug mb-2 text-center max-w-xl">
              Guided by Visionaries, Educators & Industry Leaders
            </h1>

            {/* Subtitle - Reduced Length and Clean Weight */}
            <p className="text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 font-normal leading-relaxed max-w-lg mx-auto mb-4 text-center">
              Meet the distinguished pioneers powering Visdom Waves and MyMarks, uniting 70+ years of enterprise innovation, academic excellence, and student mentorship.
            </p>

            {/* View Mode Toggle: One-by-One / View All */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <button
                onClick={() => setViewMode('one-by-one')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'one-by-one'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white'
                }`}
              >
                <UserCheck size={13} />
                <span>One-by-One</span>
              </button>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white'
                }`}
              >
                <Layers size={13} />
                <span>View All</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* LEADERSHIP CARDS (COMPACT SIZE, CRISP TEXT, REAL PHOTOS)      */}
      {/* ============================================================ */}
      <div className="py-10 sm:py-14 lg:py-16 px-3 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          
          {/* DEFAULT: VIEW ALL CARDS */}
          {viewMode === 'all' && (
            <div className="space-y-6">
              {LEADERS.map((leader, idx) => {
                const Icon = leader.icon;
                return (
                  <React.Fragment key={leader.id}>
                    <div
                      id={`leader-card-${idx}`}
                      className="relative rounded-2xl border border-white/60 dark:border-cyan-400/40 shadow-xl overflow-hidden transition-all duration-300 hover:border-cyan-300 group"
                    >
                      {/* Background Image: Crisp, Full-Color Sea Turtle & Coral */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0">
                        <img 
                          src={CARD_BG_IMAGE} 
                          alt="Sunlit Sea Turtle Among Coral" 
                          className="w-full h-full object-cover object-center filter brightness-100 contrast-[1.05] saturate-[1.1] transition-transform duration-700 group-hover:scale-102"
                        />
                      </div>

                      {/* Card Content Layer - Sleek, compact, transparent glass */}
                      <div className="relative z-10 p-4 sm:p-6 lg:p-7">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                          
                          {/* Executive Portrait Photo from visdomwaves.com */}
                          <div className="shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-xl bg-slate-900 flex items-center justify-center">
                              <img 
                                src={leader.image} 
                                alt={leader.name} 
                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          </div>

                          {/* Leader Info */}
                          <div className="grow w-full">
                            
                            {/* Role Chip */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-slate-950/80 text-cyan-200 border border-cyan-400/50 shadow-sm">
                              <Icon size={13} className="shrink-0 text-cyan-300" />
                              <span>{leader.role}</span>
                            </div>

                            {/* Full Name - Sharp, Crisp, Non-blurry */}
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1.5">
                              {leader.name}
                            </h2>

                            {/* Tagline - High Contrast, 100% Clear & Legible Container */}
                            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-amber-300/40 shadow-xs mb-3 text-left">
                              <p className="text-xs sm:text-[13px] font-medium text-amber-300 leading-snug">
                                {leader.tagline}
                              </p>
                            </div>

                            {/* Biography Box - Transparent Glass */}
                            <div className="p-3.5 sm:p-4 rounded-xl bg-black/35 border border-white/20 shadow-md mb-3 text-left">
                              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Briefcase size={12} />
                                <span>Leadership Profile & Background</span>
                              </h3>
                              <p className="text-xs sm:text-[13px] text-slate-100 font-normal leading-relaxed">
                                {leader.bio}
                              </p>
                            </div>

                            {/* Strategic Impact Box - Transparent Glass */}
                            <div className="mb-3 text-left">
                              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Award size={12} />
                                <span>Strategic Impact</span>
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {leader.highlights.map((item, hIdx) => (
                                  <div
                                    key={hIdx}
                                    className="p-2.5 rounded-lg bg-black/35 border border-white/20 flex items-start gap-1.5 shadow-xs text-white"
                                  >
                                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span className="text-[11px] sm:text-xs font-medium leading-snug text-slate-100">
                                      {item}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Tags - Compact chips */}
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-4">
                              {leader.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/35 text-cyan-200 border border-cyan-400/30 shadow-2xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Read More Link */}
                            <div className="pt-1 flex justify-center sm:justify-start">
                              <a
                                href={leader.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
                              >
                                <span>Read more about {leader.name}</span>
                                <ExternalLink size={13} />
                              </a>
                            </div>

                          </div>

                        </div>
                      </div>

                    </div>

                    {/* High-Visibility, Premium Artistic Divider Line under each card */}
                    {idx < LEADERS.length - 1 && (
                      <div className="py-9 flex items-center justify-center">
                        <div className="w-full max-w-3xl flex items-center justify-center gap-4 px-4">
                          {/* Left Glowing Beam */}
                          <div className="h-[3px] grow rounded-full bg-gradient-to-r from-transparent via-blue-600 to-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                          
                          {/* Center Elegant Emblem Jewel */}
                          <div className="flex items-center gap-2 shrink-0 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-cyan-400 dark:border-cyan-400 shadow-xl shadow-cyan-500/25">
                            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-sm" />
                            <span className="w-3.5 h-3.5 rotate-45 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xs shadow-md" />
                            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-sm" />
                          </div>
                          
                          {/* Right Glowing Beam */}
                          <div className="h-[3px] grow rounded-full bg-gradient-to-l from-transparent via-blue-600 to-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* ONE-BY-ONE SPOTLIGHT MODE */}
          {viewMode === 'one-by-one' && (
            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-2xl border border-white/60 dark:border-cyan-400/40 shadow-xl overflow-hidden transition-all duration-300">
                
                {/* Background Image: Crisp, Full-Color Sea Turtle & Coral */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl z-0">
                  <img 
                    src={CARD_BG_IMAGE} 
                    alt="Sunlit Sea Turtle Among Coral" 
                    className="w-full h-full object-cover object-center filter brightness-100 contrast-[1.05] saturate-[1.1]"
                  />
                </div>

                {/* Card Content Layer - Sleek, compact */}
                <div className="relative z-10 p-5 sm:p-7">
                  
                  {/* Person Header */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-5 text-center sm:text-left">
                    
                    {/* Executive Portrait Photo */}
                    <div className="shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-xl bg-slate-900 flex items-center justify-center">
                        <img 
                          src={currentLeader.image} 
                          alt={currentLeader.name} 
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grow w-full">
                      {/* Role Chip */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-slate-950/80 text-cyan-200 border border-cyan-400/50 shadow-sm">
                        <currentLeader.icon size={13} className="shrink-0 text-cyan-300" />
                        <span>{currentLeader.role}</span>
                      </div>

                      {/* Name */}
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-1.5">
                        {currentLeader.name}
                      </h2>

                      {/* Tagline - High Contrast, 100% Clear & Legible Container */}
                      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-amber-300/40 shadow-xs mb-3 text-left">
                        <p className="text-xs sm:text-[13px] font-medium text-amber-300 leading-snug">
                          {currentLeader.tagline}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                        {currentLeader.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/35 text-cyan-200 border border-cyan-400/30 shadow-2xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Biography Box */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-black/35 border border-white/20 shadow-md mb-3.5 text-left">
                    <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Briefcase size={12} />
                      <span>Leadership Profile & Background</span>
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-100 font-normal leading-relaxed">
                      {currentLeader.bio}
                    </p>
                  </div>

                  {/* Strategic Impact */}
                  <div className="mb-4 text-left">
                    <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Award size={12} />
                      <span>Strategic Impact</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {currentLeader.highlights.map((item, hIdx) => (
                        <div
                          key={hIdx}
                          className="p-2.5 rounded-lg bg-black/35 border border-white/20 flex items-start gap-1.5 shadow-xs text-white"
                        >
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] sm:text-xs font-medium leading-snug text-slate-100">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Controls Bar */}
                  <div className="pt-3 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Read More Link */}
                    <a
                      href={currentLeader.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Read more about {currentLeader.name}</span>
                      <ExternalLink size={13} />
                    </a>

                    {/* Step Controls */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xs font-bold text-white">
                        Person {activeIndex + 1} of {LEADERS.length}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handlePrev}
                          className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white border border-white/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                          title="Previous Leader"
                          aria-label="Previous Leader"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={handleNext}
                          className="p-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
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
          <SupportersSlider />

        </div>
      </div>

    </section>
  );
}
