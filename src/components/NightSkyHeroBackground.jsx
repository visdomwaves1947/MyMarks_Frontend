import React, { useEffect, useRef } from 'react';

/**
 * NightSkyHeroBackground
 * Ultra-realistic 3D HD animated night sky featuring:
 * - Dynamic high-performance HTML5 Canvas rendering at 60fps
 * - 400+ dense multi-spectrum blinking & scintillating stars
 * - High-contrast sinusoidal blinking with glowing corona blooms and 4-point cross diffraction spikes
 * - Lighter, rich royal celestial navy/sapphire space background with glowing Milky Way nebula dust
 * - Photorealistic 3D shaded glowing moon with lunar Maria basins, Tycho ray filaments, and bright atmosphere corona
 * - Incandescent shooting stars / meteors with glowing plasma nuclei and sparkling ion tails
 * - Floating cosmic stardust micro-particles
 */
export default function NightSkyHeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 650);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 650;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    // 1. Stars configuration - DENSE & VIVID BLINKING
    let stars = [];
    function initStars() {
      stars = [];
      const starDensity = width < 640 ? 2600 : 1600;
      const count = Math.min(520, Math.max(300, Math.floor((width * height) / starDensity)));
      const colors = [
        '#FFFFFF', // Brilliant diamond white
        '#F0F9FF', // Icy crisp starlight
        '#BAE6FD', // Sirius cyan blue
        '#93C5FD', // Sapphire starlight
        '#FEF08A', // Warm Capella gold
        '#FED7AA', // Soft Arcturus peach
        '#A7F3D0', // Subtle cosmic mint
      ];

      for (let i = 0; i < count; i++) {
        const isFocal = Math.random() < 0.14; // 14% focal bright stars
        const isMicro = Math.random() < 0.50; // 50% dense micro stardust
        const radius = isFocal
          ? Math.random() * 1.6 + 1.4
          : isMicro
          ? Math.random() * 0.6 + 0.35
          : Math.random() * 0.9 + 0.7;

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          baseAlpha: isMicro ? Math.random() * 0.45 + 0.25 : Math.random() * 0.65 + 0.35,
          twinkleSpeed: Math.random() * 0.055 + 0.020, // Lively twinkling
          twinklePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          isFocal,
          spikeLen: isFocal ? Math.random() * 7 + 6 : 0,
        });
      }
    }
    initStars();

    // 2. Shooting Stars (Meteors with Plasma Tails)
    let meteors = [];
    function spawnMeteor() {
      const startX = Math.random() * (width * 0.88);
      const startY = Math.random() * (height * 0.42);
      const angle = (Math.PI / 180) * (Math.random() * 22 + 28);
      const speed = Math.random() * 10 + 14;
      const length = Math.random() * 120 + 95;
      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.011,
        color: Math.random() > 0.35 ? '#67E8F9' : '#FDE047',
        thickness: Math.random() * 1.7 + 1.3,
      });
    }

    let meteorTimer = 0;

    // 3. Stardust floating micro-particles
    let stardust = [];
    const dustCount = width < 640 ? 20 : 40;
    for (let d = 0; d < dustCount; d++) {
      stardust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Animation Render Loop
    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // A. BRIGHT, VIBRANT CELESTIAL BACKGROUND GRADIENT
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#040d28'); // Luminous deep midnight sapphire
      skyGrad.addColorStop(0.25, '#071848'); // Vibrant cosmic navy
      skyGrad.addColorStop(0.55, '#0b2668'); // Rich royal starry space
      skyGrad.addColorStop(0.85, '#0e3484'); // Luminous deep indigo
      skyGrad.addColorStop(1, '#071c4c'); // Deep royal blue base
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // B. Ambient Space Nebula Clouds (Gas Clouds & Milky Way Band)
      // 1. Diagonal Milky Way Cosmic Band
      const mwGrad = ctx.createLinearGradient(0, 0, width, height);
      mwGrad.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
      mwGrad.addColorStop(0.35, 'rgba(99, 102, 241, 0.16)');
      mwGrad.addColorStop(0.65, 'rgba(168, 85, 247, 0.14)');
      mwGrad.addColorStop(1, 'rgba(14, 165, 233, 0.08)');
      ctx.fillStyle = mwGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Cyan / Turquoise Nebula Haze (Upper Left)
      const neb1 = ctx.createRadialGradient(
        width * 0.22,
        height * 0.32,
        30,
        width * 0.22,
        height * 0.32,
        width * 0.52
      );
      neb1.addColorStop(0, 'rgba(6, 182, 212, 0.26)');
      neb1.addColorStop(0.45, 'rgba(37, 99, 235, 0.18)');
      neb1.addColorStop(1, 'transparent');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      // 3. Deep Violet / Cosmic Purple Nebula (Lower Right)
      const neb2 = ctx.createRadialGradient(
        width * 0.78,
        height * 0.68,
        30,
        width * 0.78,
        height * 0.68,
        width * 0.58
      );
      neb2.addColorStop(0, 'rgba(147, 51, 234, 0.22)');
      neb2.addColorStop(0.5, 'rgba(79, 70, 229, 0.15)');
      neb2.addColorStop(1, 'transparent');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // 4. Starlight Amber Core Haze (Center)
      const neb3 = ctx.createRadialGradient(
        width * 0.5,
        height * 0.42,
        15,
        width * 0.5,
        height * 0.42,
        width * 0.4
      );
      neb3.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      neb3.addColorStop(1, 'transparent');
      ctx.fillStyle = neb3;
      ctx.fillRect(0, 0, width, height);

      // C. Luminous 3D HD Moon (Positioned in top-right)
      const moonX = width > 768 ? width * 0.82 : width * 0.84;
      const moonY = Math.max(70, height * 0.20);
      const moonR = width > 768 ? 48 : 36;

      // 1. Moonlight Far Atmosphere Halo
      const wideHalo = ctx.createRadialGradient(
        moonX,
        moonY,
        moonR * 0.8,
        moonX,
        moonY,
        moonR * 5.6
      );
      wideHalo.addColorStop(0, 'rgba(224, 242, 254, 0.38)');
      wideHalo.addColorStop(0.25, 'rgba(186, 230, 253, 0.20)');
      wideHalo.addColorStop(0.65, 'rgba(125, 211, 252, 0.08)');
      wideHalo.addColorStop(1, 'transparent');
      ctx.fillStyle = wideHalo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 5.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Moonlight Inner Corona Glow
      const innerCorona = ctx.createRadialGradient(
        moonX,
        moonY,
        moonR * 0.9,
        moonX,
        moonY,
        moonR * 2.0
      );
      innerCorona.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
      innerCorona.addColorStop(0.4, 'rgba(224, 242, 254, 0.35)');
      innerCorona.addColorStop(1, 'transparent');
      ctx.fillStyle = innerCorona;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 2.0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Moon Spherical Body with 3D Shading
      ctx.save();
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.clip();

      const moonBody = ctx.createRadialGradient(
        moonX - moonR * 0.35,
        moonY - moonR * 0.35,
        moonR * 0.1,
        moonX,
        moonY,
        moonR
      );
      moonBody.addColorStop(0, '#FFFFFF'); // Zenith highlight
      moonBody.addColorStop(0.35, '#F1F5F9');
      moonBody.addColorStop(0.75, '#CBD5E1');
      moonBody.addColorStop(1, '#94A3B8'); // Dark limb
      ctx.fillStyle = moonBody;
      ctx.fillRect(moonX - moonR, moonY - moonR, moonR * 2, moonR * 2);

      // Moon Surface Maria Basins (Authentic Lunar Features)
      const craters = [
        { x: -0.25, y: -0.2, r: 0.32, opacity: 0.24 }, // Mare Serenitatis
        { x: 0.18, y: -0.3, r: 0.26, opacity: 0.22 },  // Mare Tranquillitatis
        { x: 0.3, y: 0.15, r: 0.36, opacity: 0.26 },   // Mare Fecunditatis
        { x: -0.15, y: 0.35, r: 0.22, opacity: 0.20 },  // Mare Nubium
        { x: -0.42, y: 0.1, r: 0.19, opacity: 0.21 },  // Oceanus Procellarum
        { x: 0.05, y: 0.05, r: 0.16, opacity: 0.18 },
        { x: 0.24, y: 0.44, r: 0.14, opacity: 0.26 },  // Tycho Crater hub
      ];
      for (const c of craters) {
        ctx.fillStyle = `rgba(71, 85, 105, ${c.opacity})`;
        ctx.beginPath();
        ctx.arc(
          moonX + c.x * moonR,
          moonY + c.y * moonR,
          c.r * moonR,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      // Tycho Crater Bright Radial Rays (Real Astronomical Feature)
      const tychoX = moonX + 0.24 * moonR;
      const tychoY = moonY + 0.44 * moonR;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.lineWidth = 0.85;
      const rayAngles = [-0.6, -1.2, -1.8, -2.4, 2.8, 2.2];
      for (const ra of rayAngles) {
        ctx.beginPath();
        ctx.moveTo(tychoX, tychoY);
        ctx.lineTo(
          tychoX + Math.cos(ra) * moonR * 0.75,
          tychoY + Math.sin(ra) * moonR * 0.75
        );
        ctx.stroke();
      }

      // Moon Limb / Rim Spherical Lighting
      const rimLight = ctx.createRadialGradient(
        moonX - moonR * 0.4,
        moonY - moonR * 0.4,
        moonR * 0.8,
        moonX,
        moonY,
        moonR
      );
      rimLight.addColorStop(0, 'rgba(255, 255, 255, 0)');
      rimLight.addColorStop(0.85, 'rgba(255, 255, 255, 0.48)');
      rimLight.addColorStop(1, 'rgba(224, 242, 254, 0.85)');
      ctx.fillStyle = rimLight;
      ctx.fillRect(moonX - moonR, moonY - moonR, moonR * 2, moonR * 2);
      ctx.restore();

      // D. Stardust Ambient Micro-particles
      for (const dust of stardust) {
        dust.x += dust.vx;
        dust.y += dust.vy;
        if (dust.x < 0) dust.x = width;
        if (dust.x > width) dust.x = 0;
        if (dust.y < 0) dust.y = height;
        if (dust.y > height) dust.y = 0;

        ctx.fillStyle = 'rgba(186, 230, 253, ' + dust.alpha + ')';
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // E. REALISTIC VIVID BLINKING STARS
      for (const star of stars) {
        const pulse = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
        const alpha = Math.min(
          1,
          Math.max(
            0.08,
            star.baseAlpha + pulse * 0.72
          )
        );

        // Core star point
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Star glowing bloom aura during peak brightness
        if (alpha > 0.78) {
          ctx.globalAlpha = (alpha - 0.78) * 0.9;
          const bloomRadius = star.radius * (star.isFocal ? 3.8 : 2.5);
          const glowGrad = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            bloomRadius
          );
          glowGrad.addColorStop(0, star.color);
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, bloomRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4-Point Starlight Diffraction Spikes for Focal Bright Stars
        if (star.isFocal && alpha > 0.45) {
          const spikeDynamic = star.spikeLen * (0.65 + alpha * 0.65);
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 1.0;
          ctx.globalAlpha = alpha * 0.85;
          ctx.beginPath();
          ctx.moveTo(star.x - spikeDynamic, star.y);
          ctx.lineTo(star.x + spikeDynamic, star.y);
          ctx.moveTo(star.x, star.y - spikeDynamic);
          ctx.lineTo(star.x, star.y + spikeDynamic);
          ctx.stroke();

          // Subtle diagonal 45° secondary diamond glint
          const diagDynamic = spikeDynamic * 0.48;
          ctx.lineWidth = 0.55;
          ctx.globalAlpha = alpha * 0.45;
          ctx.beginPath();
          ctx.moveTo(star.x - diagDynamic, star.y - diagDynamic);
          ctx.lineTo(star.x + diagDynamic, star.y + diagDynamic);
          ctx.moveTo(star.x - diagDynamic, star.y + diagDynamic);
          ctx.lineTo(star.x + diagDynamic, star.y - diagDynamic);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // F. Shooting Stars (Meteors)
      meteorTimer++;
      if (meteorTimer % 110 === 0 || Math.random() < 0.012) {
        if (meteors.length < 3) {
          spawnMeteor();
        }
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= m.decay;

        if (m.alpha <= 0 || m.x > width + 120 || m.y > height + 120) {
          meteors.splice(i, 1);
          continue;
        }

        const angle = Math.atan2(m.vy, m.vx);
        const tailX = m.x - Math.cos(angle) * m.length;
        const tailY = m.y - Math.sin(angle) * m.length;

        // Meteor glowing plasma tail
        const meteorGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        meteorGrad.addColorStop(
          0.25,
          m.color === '#67E8F9'
            ? `rgba(103, 232, 249, ${m.alpha * 0.9})`
            : `rgba(253, 224, 71, ${m.alpha * 0.9})`
        );
        meteorGrad.addColorStop(1, 'transparent');

        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = m.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Meteor Head Sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = m.alpha;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: 'block' }}
    />
  );
}
