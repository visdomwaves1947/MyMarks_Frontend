import React from 'react';

export function VisdomBrand({ onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`relative flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0 select-none bg-white text-slate-950 rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all duration-200 overflow-hidden antialiased ${className}`}
    >
      {/* Subtle Inner Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-sky-500/5 to-cyan-500/5 pointer-events-none rounded-full"></div>

      {/* Left: Brand Mascot Logo (Crisp HD White Circle) */}
      <div className="relative shrink-0 flex items-center justify-center w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white p-0.5 sm:p-1 ring-1 ring-slate-200 shadow-2xs">
        <img 
          src="/logomymarks.png" 
          alt="MyMarks Logo" 
          className="h-full w-full object-contain shrink-0 transform-gpu group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Right: Razor-Sharp, Deep Dark, High-Clarity Typography (Refined Less Font Weight) */}
      <div className="flex flex-col items-center justify-center pr-0.5 sm:pr-1 relative z-10">
        
        {/* Main Brand Title: MY MARKS */}
        <div className="flex items-center justify-center leading-none font-semibold text-[13px] xs:text-[14.5px] sm:text-[16px] md:text-[18px] tracking-tight font-sans">
          {/* MY (Deep Solid Navy - Not Dull, Less Weight) */}
          <span className="text-[#00183b] font-semibold mr-1 tracking-tight">
            MY
          </span>

          {/* MARKS (Vivid Sapphire Blue - Not Dull, Less Weight) */}
          <span className="flex items-center text-[#0055d4] font-semibold tracking-tight">
            <span>M</span>
            {/* Custom stylized 'A' with inner white rocket/arrow */}
            <span className="inline-flex items-center justify-center mx-[0.5px]">
              <svg 
                viewBox="0 0 100 115" 
                className="h-[0.88em] w-auto inline-block group-hover:scale-105 transition-transform"
                fill="none"
              >
                <defs>
                  <linearGradient id="marksGradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0066ee" />
                    <stop offset="100%" stopColor="#0044bb" />
                  </linearGradient>
                </defs>
                {/* Body of A */}
                <path 
                  d="M 50 2 L 98 112 L 72 112 L 59 81 L 41 81 L 28 112 L 2 112 Z" 
                  fill="url(#marksGradA)" 
                />
                {/* White Arrow Negative Space inside A */}
                <path 
                  d="M 50 22 L 69 56 L 57.5 56 L 57.5 81 L 42.5 81 L 42.5 56 L 31 56 Z" 
                  fill="#ffffff" 
                />
              </svg>
            </span>
            <span>RKS</span>
          </span>
        </div>

        {/* Tagline: — Learning Without Language Barriers — */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-0.5 w-full">
          {/* Left Gradient Bar */}
          <span className="h-[1.5px] w-2 sm:w-3.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 shrink-0"></span>

          {/* Slogan Text: Deep Solid Dark, Non-Dull, Less Font Weight */}
          <span className="text-[7.5px] xs:text-[8.5px] sm:text-[9.5px] md:text-[10px] font-medium text-[#00183b] tracking-tight whitespace-nowrap leading-none font-sans antialiased">
            Learning Without Language Barriers
          </span>

          {/* Right Gradient Bar */}
          <span className="h-[1.5px] w-2 sm:w-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shrink-0"></span>
        </div>

        {/* Powered by Visdom Waves (Deep Dark, Vector SVG, Non-Dull) */}
        <div className="flex items-center justify-center gap-1 mt-0.5 w-full">
          <span className="text-[6.5px] xs:text-[7.5px] sm:text-[8px] font-medium text-[#1e293b] tracking-tight">
            powered by
          </span>
          
          {/* Previous Normal Visdom Waves Logo from Hero Section */}
          <img 
            src="/Visdomlogo.png" 
            alt="Visdom Waves" 
            className="h-1.5 xs:h-2 sm:h-2.5 w-auto object-contain shrink-0 group-hover:rotate-12 transition-transform duration-300"
          />
          
          <span className="text-[7px] xs:text-[8px] sm:text-[8.5px] font-semibold text-[#00183b] tracking-tight leading-none">
            Visdom Waves
          </span>
          <span className="hidden xs:inline text-[6.5px] sm:text-[7.5px] font-medium text-[#1e293b] tracking-tight leading-none">
            Innovations Private Limited
          </span>
        </div>

      </div>
    </div>
  );
}
