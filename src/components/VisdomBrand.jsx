import React from 'react';

export function VisdomBrand({ onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`relative inline-flex items-center cursor-pointer group shrink-0 select-none antialiased ${className}`}
      title="MyMarks - Score High Marks in Less Time"
    >
      {/* 
        Ultra-Luxury Broadcast / E-Sports Banner (Yellow Theme Matching Navbar & Footer)
        - Tightened ViewBox: 8 40 660 162 (~4.07:1) for Maximum Crispness & Responsive Scaling
        - Left: 3D Beveled Metallic Gold Circular Medallion with Pure White Hub & Enlarged MyMarks Logo
        - Behind Medallion: Rounded Radiant Yellow Pill End Cap
        - Main Upper Bar: Navbar & Footer Matching HD Yellow Gradient with Gold Aerodynamic Right Rim
        - In Main Bar: Ultra-Crisp "MY" (Carbon Black) + "MARKS" (Sapphire Blue) & Refined "Score High Marks in Less Time"
        - Lower Elevated Tray: Metallic Gold Border, Matching Yellow Gradient, and Glowing Golden Corner Flares
        - In Lower Tray: Centered "powered by [logo] Visdom Waves" in Razor-Sharp Deep Slate
      */}
      <div className="relative h-[54px] xs:h-[60px] sm:h-[68px] md:h-[76px] w-auto flex items-center">
        <svg 
          viewBox="8 40 660 162" 
          className="h-full w-auto block select-none overflow-visible filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_6px_20px_rgba(217,119,6,0.35)] transition-all duration-300 transform-gpu group-hover:scale-[1.015]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* 1. Main Yellow Bar Gradient (Matches Navbar & Footer Yellow #fef08a -> #fde047 -> #fef08a) */}
            <linearGradient id="mainYellowBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="25%" stopColor="#fde047" />
              <stop offset="55%" stopColor="#facc15" />
              <stop offset="80%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            {/* 2. Left Pill End Cap Gradient */}
            <linearGradient id="leftPillGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            {/* 3. 3D Metallic Gold Ring Gradient (Rich Antique & Light Gold Highlights) */}
            <linearGradient id="gold3DRimGrad" x1="12%" y1="12%" x2="88%" y2="88%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="14%" stopColor="#fff2a8" />
              <stop offset="30%" stopColor="#f4c442" />
              <stop offset="65%" stopColor="#d2961d" />
              <stop offset="85%" stopColor="#8c580b" />
              <stop offset="100%" stopColor="#663e04" />
            </linearGradient>

            {/* 4. Right Sweeping Aerodynamic Rim Gold Gradient */}
            <linearGradient id="goldRightRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff3b2" />
              <stop offset="35%" stopColor="#f4c03c" />
              <stop offset="70%" stopColor="#c78615" />
              <stop offset="100%" stopColor="#7e4c08" />
            </linearGradient>

            {/* 5. Lower Tray Gold Border Gradient */}
            <linearGradient id="trayGoldBorderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* 6. Lower Tray Yellow Gradient */}
            <linearGradient id="trayYellowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="75%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>

            {/* 7. Top Horizontal Specular Highlight Glint */}
            <linearGradient id="topSpecularGlint" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* 8. Glowing Golden Radial Flare for Tray Corners */}
            <radialGradient id="goldCornerFlare" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

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
              <feDropShadow dx="-2" dy="4" stdDeviation="4.5" floodColor="#000000" floodOpacity="0.35" />
            </filter>

            <filter id="trayShadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#78350f" floodOpacity="0.3" />
            </filter>

            <filter id="visdomLogoGlowDark" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* LAYER 1: BASE YELLOW BARS & RIGHT GOLD SWEEPING RIM      */}
          {/* ======================================================== */}
          
          {/* Left Pill Behind Circle */}
          <path 
            d="M 144 60 L 66 60 A 56 56 0 0 0 66 172 L 144 172 Z" 
            fill="url(#leftPillGrad)" 
            stroke="#f59e0b"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />

          {/* Main Upper Yellow Bar (Matching Footer/Navbar) */}
          <path 
            d="M 144 60 L 555 60 C 600 60 648 88 664 125 C 674 150 655 172 610 172 L 144 172 Z" 
            fill="url(#mainYellowBarGrad)" 
            stroke="#f59e0b"
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          {/* Right Sweeping Metallic Gold Outer Edge Rim */}
          <path 
            d="M 555 60 C 600 60 648 88 664 125 C 674 150 655 172 610 172" 
            fill="none" 
            stroke="url(#goldRightRimGrad)" 
            strokeWidth="5.5" 
            strokeLinecap="round" 
          />

          {/* Top Horizontal Specular Glint Line */}
          <line 
            x1="220" 
            y1="62.5" 
            x2="450" 
            y2="62.5" 
            stroke="url(#topSpecularGlint)" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
          />

          {/* ======================================================== */}
          {/* LAYER 2: LOWER FLOATING TRAY WITH GOLD BORDER & FLARES    */}
          {/* ======================================================== */}
          
          {/* Tray Body */}
          <g filter="url(#trayShadow)">
            <path 
              d="M 235 132 L 628 132 Q 634 148 620 168 Q 612 186 596 186 L 270 186 Q 252 186 242 168 Q 233 148 235 132 Z" 
              fill="url(#trayYellowGrad)" 
              stroke="url(#trayGoldBorderGrad)" 
              strokeWidth="2.8" 
              strokeLinejoin="round" 
            />
          </g>

          {/* Left Top Flare Sparkle */}
          <g>
            <circle cx="235" cy="132" r="14" fill="url(#goldCornerFlare)" />
            <path 
              d="M 235 121 L 237 130.5 L 246 132 L 237 133.5 L 235 143 L 233 133.5 L 224 132 L 233 130.5 Z" 
              fill="#ffffff" 
            />
            <circle cx="235" cy="132" r="2.2" fill="#ffffff" />
          </g>

          {/* Right Top Flare Sparkle */}
          <g>
            <circle cx="628" cy="132" r="14" fill="url(#goldCornerFlare)" />
            <path 
              d="M 628 121 L 630 130.5 L 639 132 L 630 133.5 L 628 143 L 626 133.5 L 617 132 L 626 130.5 Z" 
              fill="#ffffff" 
            />
            <circle cx="628" cy="132" r="2.2" fill="#ffffff" />
          </g>

          {/* ======================================================== */}
          {/* LAYER 3: 3D METALLIC GOLD CIRCULAR MEDALLION             */}
          {/* ======================================================== */}
          <g filter="url(#medallionShadow)">
            {/* Outer 3D Metallic Gold Ring */}
            <circle cx="144" cy="122" r="76" fill="url(#gold3DRimGrad)" />

            {/* Inner Dark Bronze Bevel Edge */}
            <circle cx="144" cy="122" r="64" fill="none" stroke="#663e04" strokeWidth="2.2" strokeOpacity="0.75" />

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
              className="transform-gpu group-hover:scale-105 transition-transform duration-300"
              style={{ imageRendering: 'high-quality' }}
            />
          </g>

          {/* ======================================================== */}
          {/* LAYER 4: BRAND TYPOGRAPHY & TAGLINES (HIGH CONTRAST)     */}
          {/* ======================================================== */}
          
          {/* --- TOP TIER: MY MARKS & CAPTION IN UPPER YELLOW BAR --- */}
          <g className="select-none" style={{ textRendering: 'geometricPrecision' }}>
            {/* LINE 1: MY (Carbon Black) + MARKS (Sapphire Blue) */}
            <g transform="translate(254, 98)">
              {/* "MY" in Ultra-Crisp Carbon Black */}
              <text 
                x="0" 
                y="0" 
                fill="url(#designerMyBlackGrad)" 
                fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
                fontWeight="900" 
                fontSize="38" 
                letterSpacing="1.2"
              >
                MY
              </text>

              {/* "MARKS" in Vivid Sapphire Royal Blue */}
              <text 
                x="68" 
                y="0" 
                fill="url(#marksSapphireGrad)" 
                fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
                fontWeight="900" 
                fontSize="38" 
                letterSpacing="1.4"
              >
                MARKS
              </text>
            </g>

            {/* LINE 2: Score High Marks in Less Time (Deep Slate, Refined, 100% Clear) */}
            <g transform="translate(254, 122)">
              <text 
                x="0" 
                y="0" 
                fill="#0f172a" 
                fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
                fontWeight="600" 
                fontSize="16.5" 
                letterSpacing="0.4"
              >
                Score High Marks in Less Time
              </text>
            </g>
          </g>

          {/* --- BOTTOM TIER: POWERED BY VISDOM WAVES IN LOWER TRAY --- */}
          {/* Centered with clean breathing gap around logo, sharp & visible */}
          <g transform="translate(300, 166)" className="select-none" style={{ textRendering: 'geometricPrecision' }}>
            {/* "powered by" text */}
            <text 
              x="0" 
              y="0" 
              fill="#0f172a" 
              fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
              fontWeight="550" 
              fontSize="18" 
              letterSpacing="0.4"
            >
              powered by
            </text>

            {/* Visdom Waves Cyan Logo (with clean gap) */}
            <image 
              href="/Visdomlogo.png" 
              x="105" 
              y="-17" 
              width="23" 
              height="23" 
              preserveAspectRatio="xMidYMid meet" 
              filter="url(#visdomLogoGlowDark)"
            />

            {/* "Visdom Waves" text */}
            <text 
              x="136" 
              y="0" 
              fill="#0f172a" 
              fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" 
              fontWeight="650" 
              fontSize="18.5" 
              letterSpacing="0.4"
            >
              Visdom Waves
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default VisdomBrand;
