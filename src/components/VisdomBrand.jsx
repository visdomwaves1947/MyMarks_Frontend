import React from 'react';

export function VisdomBrand({ onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`relative inline-flex items-center cursor-pointer group shrink-0 select-none antialiased ${className}`}
      title="MyMarks - Watch MyMarks, gain more marks"
    >
      <div className="relative h-[50px] xs:h-[58px] sm:h-[72px] md:h-[82px] w-auto flex items-center">
        <svg 
          viewBox="8 40 660 162" 
          className="h-full w-auto block select-none overflow-visible filter drop-shadow-[0_3px_10px_rgba(0,0,0,0.10)]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* 1. Main Pure White Bar Gradient */}
            <linearGradient id="mainWhiteBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fafafa" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* 2. Left Pill End Cap Pure White Gradient */}
            <linearGradient id="leftPillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fafafa" />
            </linearGradient>

            {/* 3. Footer-Matching Concentric Blue Circle Gradients (from-blue-600 via-sky-500 to-blue-600) */}
            <linearGradient id="footerBlueCircleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>

            <linearGradient id="footerBlueRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            {/* 9. Vivid Sapphire Royal Blue Gradient for MARKS */}
            <linearGradient id="marksSapphireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="45%" stopColor="#0062eb" />
              <stop offset="100%" stopColor="#0041b3" />
            </linearGradient>

            {/* 10. Designer Carbon Black Gradient for MY */}
            <linearGradient id="designerMyBlackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="50%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>

            {/* 11. Drop Shadows */}
            <filter id="medallionShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#0284c7" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* LAYER 1: BASE PURE WHITE BARS & CLEAN MATCHING CURVES    */}
          {/* ======================================================== */}
          
          {/* Left Pill Behind Circle - Clean Plain Semicircular Radius 56 */}
          <path 
            d="M 144 60 L 66 60 A 56 56 0 0 0 66 172 L 144 172 Z" 
            fill="url(#leftPillGrad)" 
            stroke="#d4d4d8"
            strokeWidth="1.2"
          />

          {/* Main Pure White Bar - Right Curve Matches Left Curve Plainly (No Gold/Yellow) */}
          <path 
            d="M 144 60 L 570 60 A 56 56 0 0 1 570 172 L 144 172 Z" 
            fill="url(#mainWhiteBarGrad)" 
            stroke="#d4d4d8"
            strokeWidth="1.2"
          />

          {/* ======================================================== */}
          {/* LAYER 2: FOOTER-MATCHING CONCENTRIC BLUE CIRCLE MEDALLION */}
          {/* ======================================================== */}
          <g filter="url(#medallionShadow)">
            {/* Outer Concentric Blue Ring matching Footer (from-blue-600 via-sky-500 to-blue-600) */}
            <circle cx="144" cy="122" r="76" fill="url(#footerBlueCircleGrad)" stroke="#60a5fa" strokeWidth="1.2" strokeOpacity="0.5" />

            {/* Inner Slender Sky Blue Ring matching Footer ring-1 ring-blue-400/30 */}
            <circle cx="144" cy="122" r="66" fill="none" stroke="url(#footerBlueRimGrad)" strokeWidth="1.8" strokeOpacity="0.9" />

            {/* Pure HD White Center Hub */}
            <circle cx="144" cy="122" r="62" fill="#ffffff" />

            {/* MyMarks Official Logo Emblem Inside */}
            <image 
              href="/logomymarks.png" 
              x="87" 
              y="65" 
              width="114" 
              height="114" 
              preserveAspectRatio="xMidYMid meet" 
              style={{ imageRendering: 'high-quality' }}
            />
          </g>

          {/* ======================================================== */}
          {/* LAYER 3: BRAND TYPOGRAPHY (HIGH CONTRAST & VISIBILITY)   */}
          {/* ======================================================== */}
          
          <g className="select-none" style={{ textRendering: 'geometricPrecision' }}>
            {/* LINE 1: MY (Carbon Black) + MARKS (Sapphire Blue) */}
            <g transform="translate(254, 98)">
              {/* "MY" in Crisp Carbon Black */}
              <text 
                x="0" 
                y="0" 
                fill="url(#designerMyBlackGrad)" 
                fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
                fontWeight="800" 
                fontSize="38" 
                letterSpacing="1.2"
              >
                MY
              </text>

              {/* "MARKS" in Vivid Sapphire Royal Blue */}
              <text 
                x="64" 
                y="0" 
                fill="url(#marksSapphireGrad)" 
                fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
                fontWeight="800" 
                fontSize="38" 
                letterSpacing="1.4"
              >
                MARKS
              </text>
            </g>

            {/* LINE 2: Watch MyMarks, gain more marks (Ultra-Visible Subtitle, 100% Clear & Bold) */}
            <g transform="translate(254, 125)">
              <text 
                x="0" 
                y="0" 
                fill="#09090b" 
                fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
                fontWeight="750" 
                fontSize="18" 
                letterSpacing="0.15"
              >
                Watch MyMarks, gain more marks
              </text>
            </g>

            {/* LINE 3: powered by [icon] Visdom Waves (Large, Bold & Ultra-Crisp Visibility) */}
            <g transform="translate(254, 153)">
              {/* "powered by" text */}
              <text 
                x="0" 
                y="0" 
                fill="#1e293b" 
                fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
                fontWeight="700" 
                fontSize="15.5" 
                letterSpacing="0.3"
              >
                powered by
              </text>

              {/* Visdom Waves Cyan/Blue Logo */}
              <image 
                href="/Visdomlogo.png" 
                x="92" 
                y="-15" 
                width="19" 
                height="19" 
                preserveAspectRatio="xMidYMid meet" 
              />

              {/* "Visdom Waves" text */}
              <text 
                x="117" 
                y="0" 
                fill="#0284c7" 
                fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
                fontWeight="800" 
                fontSize="17.5" 
                letterSpacing="0.3"
              >
                Visdom Waves
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default VisdomBrand;
