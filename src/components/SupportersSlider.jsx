import React, { useState } from 'react';
import { Quote, Sparkles, Pause, Play, Zap } from 'lucide-react';

const LUMINARIES = [
  {
    id: 'kalam',
    coachNo: '01',
    name: 'Dr. A.P.J. Abdul Kalam',
    role: '11th President of India • Missile Man',
    badge: 'Youth & National Vision',
    image: '/luminaries/apj_abdul_kalam.jpg',
    quote: 'Learning gives creativity, creativity leads to thinking, thinking provides knowledge, and knowledge makes you great.',
    borderGrad: 'from-amber-400 via-orange-500 to-yellow-500',
    ringColor: 'ring-amber-400',
    badgeStyle: 'bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-400/50'
  },
  {
    id: 'nambi',
    coachNo: '02',
    name: 'Dr. Nambi Narayanan',
    role: 'Aerospace Scientist • ISRO Cryogenic Head',
    badge: 'Indigenous Cryogenics',
    image: '/luminaries/nambi_narayanan.jpg',
    quote: 'Truth will triumph sooner or later. Dedicate your scientific intellect fearlessly to the service of the nation.',
    borderGrad: 'from-cyan-400 via-sky-500 to-blue-600',
    ringColor: 'ring-cyan-400',
    badgeStyle: 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 border-cyan-400/50'
  },
  {
    id: 'tessy',
    coachNo: '03',
    name: 'Dr. Tessy Thomas',
    role: 'Missile Woman of India • Former DG DRDO',
    badge: 'Aeronautics & Agni Systems',
    image: '/luminaries/tessy_thomas.jpg',
    quote: 'Science has no gender. Relentless perseverance, discipline, and curiosity are all that count.',
    borderGrad: 'from-rose-400 via-pink-500 to-purple-600',
    ringColor: 'ring-rose-400',
    badgeStyle: 'bg-rose-500/15 text-rose-800 dark:text-rose-200 border-rose-400/50'
  },
  {
    id: 'sarabhai',
    coachNo: '04',
    name: 'Dr. Vikram Sarabhai',
    role: 'Father of Indian Space Programme • ISRO',
    badge: 'Space Exploration Pioneer',
    image: '/luminaries/vikram_sarabhai.jpg',
    quote: 'He who can listen to the music of the spheres can also hear the yearning of humanity for knowledge.',
    borderGrad: 'from-blue-400 via-indigo-500 to-cyan-500',
    ringColor: 'ring-blue-400',
    badgeStyle: 'bg-blue-500/15 text-blue-800 dark:text-blue-200 border-blue-400/50'
  },
  {
    id: 'bhabha',
    coachNo: '05',
    name: 'Dr. Homi J. Bhabha',
    role: 'Father of Indian Nuclear Programme • TIFR',
    badge: 'Atomic Research Pioneer',
    image: '/luminaries/homi_bhabha.jpg',
    quote: 'A nation’s greatness and sustainable progress lie in its intellectual depth and technological self-reliance.',
    borderGrad: 'from-emerald-400 via-teal-500 to-cyan-600',
    ringColor: 'ring-emerald-400',
    badgeStyle: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-400/50'
  },
  {
    id: 'raman',
    coachNo: '06',
    name: 'Sir C.V. Raman',
    role: 'Nobel Laureate in Physics • Raman Effect',
    badge: 'Optics & Physics Pioneer',
    image: '/luminaries/cv_raman.jpg',
    quote: 'Ask the right questions with keen observation, and nature will generously open the doors to her deepest secrets.',
    borderGrad: 'from-indigo-400 via-purple-500 to-pink-500',
    ringColor: 'ring-indigo-400',
    badgeStyle: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-200 border-indigo-400/50'
  },
  {
    id: 'ramanujan',
    coachNo: '07',
    name: 'Srinivasa Ramanujan',
    role: 'Legendary Mathematical Genius • FRS',
    badge: 'Number Theory & Infinite Series',
    image: '/luminaries/srinivasa_ramanujan.jpg',
    quote: 'An equation for me has no meaning unless it expresses an intuition of profound mathematical harmony.',
    borderGrad: 'from-amber-400 via-yellow-500 to-emerald-500',
    ringColor: 'ring-yellow-400',
    badgeStyle: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-200 border-yellow-400/50'
  }
];

// Double the list for infinite continuous train loop
const TRAIN_COACHES = [...LUMINARIES, ...LUMINARIES];

export default function SupportersSlider() {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState('normal'); // 'normal' | 'fast'

  // Control animation duration based on speed
  const animationDuration = speed === 'fast' ? '22s' : '36s';

  return (
    <div 
      className="w-full mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-sky-300/60 dark:border-slate-800 relative select-none overflow-hidden"
    >
      {/* Background Luminous Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-48 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8 px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-400/15 border border-cyan-400/30 text-cyan-700 dark:text-cyan-300 text-[10.5px] sm:text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={12} className="text-cyan-500 dark:text-cyan-400" />
          <span>Our Inspiration & Guiding Luminaries</span>
        </div>
        
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pioneering Minds That Inspire Us
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-1">
          Moving forward together like continuous coaches of innovation, inspired by India’s legendary educators and scientific titans.
        </p>

        {/* Train Controls Bar (Pause on Hover / Toggle Speed) */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            {isPaused ? <Play size={12} className="text-emerald-500" /> : <Pause size={12} className="text-amber-500" />}
            <span>{isPaused ? 'Resume Train' : 'Pause Train'}</span>
          </button>

          <button
            onClick={() => setSpeed(speed === 'normal' ? 'fast' : 'normal')}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              speed === 'fast'
                ? 'bg-cyan-500 text-white border-cyan-400 shadow-xs shadow-cyan-500/40'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Zap size={12} className={speed === 'fast' ? 'text-yellow-300' : 'text-slate-400'} />
            <span>Speed: {speed === 'fast' ? 'Express' : 'Cruising'}</span>
          </button>

          <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            (Hover any card to inspect)
          </span>
        </div>
      </div>

      {/* Train Track Wrapper with Left & Right Gradient Fade Masks */}
      <div className="relative w-full overflow-hidden py-4">
        
        {/* Left Fade Edge */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#EBF0F7] dark:from-[#070B14] to-transparent z-10" />

        {/* Right Fade Edge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#EBF0F7] dark:from-[#070B14] to-transparent z-10" />

        {/* Continuous Train Marquee Track */}
        <div 
          className="animate-train-marquee items-center"
          style={{
            animationDuration: animationDuration,
            animationPlayState: isPaused ? 'paused' : 'running',
            willChange: 'transform',
            contain: 'layout paint'
          }}
        >
          {TRAIN_COACHES.map((item, index) => (
            <React.Fragment key={`${item.id}-${index}`}>
              
              {/* Individual Coach Card (Very Small Size & Crisp Border Design) */}
              <div className="w-[215px] sm:w-[235px] shrink-0 group transition-transform duration-200 hover:-translate-y-1">
                
                {/* Outer High-Tech Gradient Border */}
                <div className={`p-[1.5px] rounded-2xl bg-gradient-to-b ${item.borderGrad} shadow-md shadow-slate-900/10 dark:shadow-black/50 group-hover:shadow-xl group-hover:shadow-cyan-500/20 transition-all duration-200`}>
                  
                  {/* Inner Card Container */}
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[14.5px] p-3 sm:p-3.5 flex flex-col items-center text-center h-[260px] sm:h-[270px] justify-between relative overflow-hidden">
                    
                    {/* Top Coach Header Bar */}
                    <div className="w-full flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                        Coach #{item.coachNo}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,1)] animate-pulse"></span>
                    </div>

                    {/* Portrait Photo (Full Face Visible Clearly, No Cut Off) */}
                    <div className="relative my-0.5">
                      <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ${item.ringColor} p-0.5 bg-slate-100 dark:bg-slate-800 shadow-md shrink-0`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          width="80"
                          height="80"
                          loading="eager"
                          decoding="async"
                          className="w-full h-full object-cover object-top rounded-full"
                        />
                      </div>
                    </div>

                    {/* Luminary Name & Category Badge */}
                    <div className="w-full mt-1">
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="mt-1 flex justify-center">
                        <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeStyle} truncate max-w-[190px]`}>
                          {item.badge}
                        </span>
                      </div>
                    </div>

                    {/* Quote Box (Compact, Clean, No Emojis) */}
                    <div className="w-full mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-1 px-1">
                      <Quote size={11} className="text-cyan-500 shrink-0 mt-0.5 rotate-180 opacity-75" />
                      <p className="text-[10px] sm:text-[10.5px] text-slate-600 dark:text-slate-300 italic font-medium leading-tight line-clamp-3 text-left">
                        "{item.quote}"
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              {/* Train Coach Mechanical Coupler Connector Link */}
              <div className="flex items-center justify-center shrink-0 w-3.5 sm:w-4.5 z-0">
                <div className="w-full h-[3px] bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.9)] opacity-80" />
              </div>

            </React.Fragment>
          ))}
        </div>

      </div>

      {/* Bottom Track Rail Accent Line */}
      <div className="max-w-4xl mx-auto px-4 mt-2 mb-2 flex items-center justify-center gap-2">
        <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold tracking-widest uppercase">
          Continuous Train of Visionaries
        </span>
        <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>

    </div>
  );
}
