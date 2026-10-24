import React from 'react';

export default function NewsScroller({ onOpenBooking }) {
  const newsItems = [
    {
      id: 1,
      label: 'DOWNLOAD INTERMEDIATE 2026-27 ADMISSION & ENROLLMENT FORM',
      action: 'Enrollment Form',
      isNew: true,
    },
    {
      id: 2,
      label: 'CLICK HERE FOR ONLINE SCHOLARSHIP & 1-ON-1 DEMO SESSION',
      action: 'Scholarship Demo',
      isNew: false,
    },
    {
      id: 3,
      label: 'CLASS 11 & 12 (MPC, BIPC, CEC, MEC) BATCHES COMMENCING SOON',
      action: 'Intermediate Batches',
      isNew: true,
    },
    {
      id: 4,
      label: 'BIEAP & TSBIE BOARD BLUEPRINTS & COMPREHENSIVE CHAPTER NOTES UPDATED',
      action: 'Blueprints',
      isNew: false,
    },
    {
      id: 5,
      label: 'INTERMEDIATE SCIENCE LAB PRACTICALS & VIVA VOCE EXPERIMENTS RELEASED',
      action: 'Lab Practicals',
      isNew: true,
    },
    {
      id: 6,
      label: 'WEEKLY CHAPTER MOCK TESTS & ALL-INDIA RANK PREDICTOR AVAILABLE NOW',
      action: 'Mock Tests',
      isNew: false,
    },
  ];

  const handleClick = (item) => {
    if (onOpenBooking) {
      onOpenBooking(item.action || item.label);
    }
  };

  return (
    <div
      className="relative w-full z-30 flex items-stretch overflow-hidden select-none h-6 xs:h-7 sm:h-8 md:h-9"
      style={{
        boxShadow: '0 4px 16px rgba(30,58,138,0.28)',
        borderTop: '1.5px solid rgba(245,158,11,0.45)',
        borderBottom: '1.5px solid rgba(245,158,11,0.2)',
      }}
    >
      {/* Left Ribbon Badge with Polygon Pointy Notch */}
      <div
        className="flex-shrink-0 flex items-center gap-1 sm:gap-2 font-black text-white tracking-wider uppercase relative z-20"
        style={{
          background: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
          paddingLeft: '7px',
          paddingRight: '15px',
          clipPath: 'polygon(0 0, calc(100% - 9px) 0, 100% 50%, calc(100% - 9px) 100%, 0 100%)',
          minWidth: '52px',
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      >
        <span
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse flex-shrink-0"
          style={{ boxShadow: '0 0 5px rgba(255,255,255,0.9)' }}
        />
        <span className="sm:hidden text-[7.5px] xs:text-[8.5px] font-black tracking-wide">NEWS</span>
        <span className="hidden sm:inline text-[11px] font-black tracking-widest">News & Events</span>
      </div>

      {/* Scrolling Ticker Track */}
      <div
        className="flex-1 overflow-hidden flex items-center relative -ml-2 sm:-ml-3"
        style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #1d4ed8 80%, #2563eb 100%)' }}
      >
        {/* Left Gradient Fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-5 sm:w-10 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #1e3a8a, transparent)' }}
        />

        {/* Continuous Ticker Row */}
        <div className="ticker-news flex items-center whitespace-nowrap">
          {[...newsItems, ...newsItems].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleClick(item)}
              className="inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2.5 px-2 xs:px-3 sm:px-7 text-[9px] xs:text-[10px] sm:text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200 group cursor-pointer"
              style={{ color: '#fde68a' }}
            >
              {/* Amber bullet dot */}
              <span
                className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-150"
                style={{
                  background: '#fbbf24',
                  boxShadow: '0 0 4px rgba(251,191,36,0.8)',
                }}
              />
              <span
                className="group-hover:text-white transition-colors duration-200"
                style={{ textShadow: '0 1px 6px rgba(30,58,138,0.5)' }}
              >
                {item.label}
              </span>

              {/* NEW Badge */}
              {item.isNew && (
                <span
                  className="new-badge inline-flex items-center justify-center text-[6.5px] xs:text-[7.5px] sm:text-[9px] font-black text-white rounded-xs px-1 sm:px-1.5 py-0.5 leading-none tracking-wider flex-shrink-0 shadow-xs"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    boxShadow: '0 0 6px rgba(239,68,68,0.8), 0 1px 3px rgba(0,0,0,0.3)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                    letterSpacing: '0.05em',
                  }}
                >
                  NEW
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right Gradient Fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, #2563eb, transparent)' }}
        />
      </div>
    </div>
  );
}
