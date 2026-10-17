import React, { useState, useEffect } from 'react';
import {
  Signal,
  Wifi,
  Battery,
  ChevronDown,
  Send,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { submitContactMessage } from '../services/api';

export default function ContactUs() {
  const [contactInfo] = useState({
    contactEmail: 'info@visdomwaves.com',
    contactPhone: '+91 79977 55155',
    address: 'Hyderabad, Telangana, India',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    rating: 5,
  });

  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [currentTime, setCurrentTime] = useState({
    time: '9:42 AM',
    day: 'Tuesday',
    date: '16 July 2025',
  });

  // 3D Tilt state for smartphone mockup
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Rotary Phone Dial states
  const [dialAngle, setDialAngle] = useState(0);
  const [isDialing, setIsDialing] = useState(false);
  const [isCelebrationDialing, setIsCelebrationDialing] = useState(false);
  const [highlightPhoneInput, setHighlightPhoneInput] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Clock in Asia/Kolkata IST
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime({
        time: now.toLocaleTimeString('en-US', {
          timeStyle: 'short',
          timeZone: 'Asia/Kolkata',
        }),
        day: now.toLocaleDateString('en-US', {
          weekday: 'long',
          timeZone: 'Asia/Kolkata',
        }),
        date: now.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Kolkata',
        }),
      });
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Tilt Handler for Smartphone
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -((y / (rect.height / 2)) * 10),
      y: (x / (rect.width / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  // Rotary Dial Interactive Handler
  const handleDial = (digit, index) => {
    if (isDialing || isCelebrationDialing) return;
    const angle = 230 - (index * 26 - 30);
    setIsDialing(true);
    setDialAngle(angle);
    setHighlightPhoneInput(true);

    setTimeout(() => {
      setHighlightPhoneInput(false);
    }, 300);

    setTimeout(() => {
      setFormData((prev) => {
        const clean = prev.phone.replace(/\D/g, '');
        return clean.length >= 10
          ? { ...prev, phone: String(digit) }
          : { ...prev, phone: clean + String(digit) };
      });
    }, 350);

    setTimeout(() => {
      setDialAngle(0);
      setTimeout(() => {
        setIsDialing(false);
      }, 400);
    }, 450);
  };

  // Trigger celebration spin when 10 digits are filled
  useEffect(() => {
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length === 10 && !isCelebrationDialing) {
      setIsCelebrationDialing(true);
      showToast('Phone number fully dialed! 📞', 'success');
      setDialAngle(720);
      setTimeout(() => {
        setDialAngle(0);
        setIsCelebrationDialing(false);
      }, 1200);
    }
  }, [formData.phone]);

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim().length < 2) {
      showToast('Please enter a valid full name (at least 2 characters).', 'error');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      showToast('Please enter a valid email address (e.g. name@example.com).', 'error');
      return;
    }

    const cleanPhone = formData.phone ? formData.phone.replace(/\D/g, '') : '';
    if (!formData.phone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      showToast('Please enter a valid 10-digit mobile number (e.g. 9876543210).', 'error');
      return;
    }

    const words = formData.message.trim()
      ? formData.message.trim().split(/\s+/).filter(Boolean).length
      : 0;

    if (words < 3) {
      showToast('Please write a message with at least 3 words.', 'error');
      return;
    }

    if (words > 300) {
      showToast('Message must be 300 words or less.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await submitContactMessage(formData);
      showToast('Your message has been sent successfully! Our advisors will reply soon.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
        rating: 5,
      });
    } catch (err) {
      showToast(err.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = formData.message.trim()
    ? formData.message.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 transition-colors min-h-screen antialiased relative">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-24 right-5 z-50 animate-bounce duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-bold ${
              toast.type === 'error'
                ? 'bg-rose-900/90 border-rose-500 text-rose-100'
                : 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-80 p-0.5 rounded cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Main Hero & Content Section with Nature Wallpaper */}
      <section
        className="relative overflow-hidden pt-20 pb-16 bg-cover bg-center min-h-screen"
        style={{ backgroundImage: 'url(/HILLS.png)' }}
      >
        {/* Subtle backdrop overlay */}
        <div className="absolute inset-0 bg-white/15 dark:bg-slate-950/35 backdrop-blur-[1px] z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Top Title Block */}
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center space-y-2 select-none">
            <span className="text-[10px] sm:text-xs font-black text-cyan-800 dark:text-cyan-300 uppercase tracking-widest bg-white/95 dark:bg-slate-900/95 px-3 py-0.5 rounded-full shadow-md">
              Get In Touch
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0A192F] dark:text-white uppercase tracking-wider leading-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Connect With Us
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-extrabold text-[#0A192F]/85 dark:text-white/85 max-w-xl mx-auto leading-tight">
              Have questions about the Intermediate syllabus, grammar lessons, or mock tests?
            </p>
            <p className="text-xs sm:text-sm md:text-base font-extrabold text-[#0A192F]/85 dark:text-white/85 max-w-xl mx-auto leading-tight">
              Fill out the form below or write to us directly.
            </p>
          </div>

          {/* Cards Grid: Vintage Rotary Phone (Left) + 3D Smartphone Form (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* LEFT CARD: Realistic Vintage Rotary Telephone */}
            <div className="lg:col-span-5 relative flex items-center justify-center p-2 sm:p-4 group select-none hover:-translate-y-2 hover:scale-[1.015] transition-all duration-500">
              <div className="w-full max-w-[550px] aspect-[1/1.05] relative z-10">
                <svg
                  className="w-full h-full drop-shadow-[0_20px_40px_rgba(6,182,212,0.25)] dark:drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_30px_60px_rgba(6,182,212,0.45)] transition-all duration-500"
                  viewBox="0 0 600 650"
                >
                  <defs>
                    <linearGradient id="phoneBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0f172a" stopOpacity="0.97" />
                      <stop offset="50%" stopColor="#0f172a" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0.99" />
                    </linearGradient>

                    <linearGradient id="phoneBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#0891b2" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0e7490" stopOpacity="0.15" />
                    </linearGradient>

                    <pattern id="phoneImgPattern" patternUnits="userSpaceOnUse" width="600" height="650">
                      <image
                        href="/HILLS.png"
                        x="0"
                        y="0"
                        width="600"
                        height="650"
                        preserveAspectRatio="xMidYMid slice"
                        className="opacity-45"
                      />
                    </pattern>
                  </defs>

                  {/* Handset resting prongs */}
                  <rect
                    x="195"
                    y="115"
                    width="22"
                    height="70"
                    rx="6"
                    fill="url(#phoneBodyGrad)"
                    stroke="url(#phoneBorderGrad)"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="195"
                    y="115"
                    width="22"
                    height="70"
                    rx="6"
                    fill="url(#phoneImgPattern)"
                    opacity="0.4"
                  />
                  <rect
                    x="383"
                    y="115"
                    width="22"
                    height="70"
                    rx="6"
                    fill="url(#phoneBodyGrad)"
                    stroke="url(#phoneBorderGrad)"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="383"
                    y="115"
                    width="22"
                    height="70"
                    rx="6"
                    fill="url(#phoneImgPattern)"
                    opacity="0.4"
                  />
                  <path
                    d="M 185 165 H 415"
                    stroke="url(#phoneBorderGrad)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* Main Trapezoidal Telephone Body */}
                  <path
                    d="M 170 175 
                       C 220 170, 380 170, 430 175 
                       C 445 210, 480 280, 530 360 
                       C 570 425, 570 480, 570 610 
                       C 570 630, 550 640, 530 640 
                       H 70 
                       C 50 640, 30 630, 30 610 
                       C 30 480, 30 425, 70 360 
                       C 120 280, 155 210, 170 175 Z"
                    fill="url(#phoneBodyGrad)"
                    stroke="url(#phoneBorderGrad)"
                    strokeWidth="3.5"
                    className="transition-all duration-500 group-hover:stroke-cyan-400"
                  />
                  <path
                    d="M 170 175 
                       C 220 170, 380 170, 430 175 
                       C 445 210, 480 280, 530 360 
                       C 570 425, 570 480, 570 610 
                       C 570 630, 550 640, 530 640 
                       H 70 
                       C 50 640, 30 630, 30 610 
                       C 30 480, 30 425, 70 360 
                       C 120 280, 155 210, 170 175 Z"
                    fill="url(#phoneImgPattern)"
                    opacity="0.45"
                    className="pointer-events-none"
                  />

                  {/* Vintage Handset on top */}
                  <path
                    d="M 30 180 
                       C 20 125, 120 60, 300 60 
                       C 480 60, 580 125, 570 180 
                       C 545 220, 490 170, 420 135 
                       C 345 110, 255 110, 180 135 
                       C 110 170, 55 220, 30 180 Z"
                    fill="url(#phoneBodyGrad)"
                    stroke="url(#phoneBorderGrad)"
                    strokeWidth="3.5"
                    className="transition-all duration-500 group-hover:stroke-cyan-400"
                  />
                  <path
                    d="M 30 180 
                       C 20 125, 120 60, 300 60 
                       C 480 60, 580 125, 570 180 
                       C 545 220, 490 170, 420 135 
                       C 345 110, 255 110, 180 135 
                       C 110 170, 55 220, 30 180 Z"
                    fill="url(#phoneImgPattern)"
                    opacity="0.45"
                    className="pointer-events-none"
                  />

                  {/* Rotary Dial Outer Rim */}
                  <circle
                    cx="300"
                    cy="415"
                    r="95"
                    fill="#0b0f19"
                    stroke="url(#phoneBorderGrad)"
                    strokeWidth="4.5"
                  />

                  {/* Rotating Dial Disc */}
                  <g
                    style={{
                      transform: `rotate(${dialAngle}deg)`,
                      transformOrigin: '300px 415px',
                      transition: isCelebrationDialing
                        ? 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)'
                        : isDialing
                        ? dialAngle === 0
                          ? 'transform 0.4s ease-out'
                          : 'transform 0.4s cubic-bezier(0.1, 0.8, 0.3, 1)'
                        : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                    }}
                  >
                    <circle
                      cx="300"
                      cy="415"
                      r="75"
                      fill="#1e293b"
                      stroke="url(#phoneBorderGrad)"
                      strokeWidth="2.5"
                    />

                    {/* Rotary Holes for Digits 1 to 9, 0 */}
                    {Array.from({ length: 10 }).map((_, index) => {
                      const rad = ((index * 26 - 30) * Math.PI) / 180;
                      const cx = 300 + 52 * Math.cos(rad);
                      const cy = 415 + 52 * Math.sin(rad);
                      const digit = index === 9 ? 0 : index + 1;

                      return (
                        <g
                          key={index}
                          onClick={() => handleDial(digit, index)}
                          className="cursor-pointer group/hole select-none"
                        >
                          <circle
                            cx={cx}
                            cy={cy}
                            r="12"
                            fill="#0b0f19"
                            stroke="url(#phoneBorderGrad)"
                            strokeWidth="1.8"
                            className="transition-all duration-200 group-hover/hole:fill-[#161e2e] group-hover/hole:stroke-[#22d3ee] group-hover/hole:filter group-hover/hole:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                          />
                          <text
                            x={cx}
                            y={cy + 3.5}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="black"
                            fill="#22d3ee"
                            className="transition-colors duration-200 group-hover/hole:fill-white"
                          >
                            {digit}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* Center Hub */}
                  <circle
                    cx="300"
                    cy="415"
                    r="32"
                    fill="#0b0f19"
                    stroke="url(#phoneBorderGrad)"
                    strokeWidth="3"
                  />

                  {/* Finger Stop Bracket */}
                  <path
                    d={`M ${300 + 64 * Math.cos((230 * Math.PI) / 180)} ${
                      415 + 64 * Math.sin((230 * Math.PI) / 180)
                    } L ${300 + 40 * Math.cos((230 * Math.PI) / 180)} ${
                      415 + 40 * Math.sin((230 * Math.PI) / 180)
                    }`}
                    stroke="url(#phoneBorderGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <circle
                    cx={300 + 40 * Math.cos((230 * Math.PI) / 180)}
                    cy={415 + 40 * Math.sin((230 * Math.PI) / 180)}
                    r="3"
                    fill="#22d3ee"
                  />

                  {/* Top Header Text (Inside Handset Arc) */}
                  <foreignObject x="110" y="65" width="380" height="70">
                    <div className="w-full h-full flex flex-col justify-center items-center text-white font-sans text-center">
                      <h2 className="text-[13px] sm:text-[15px] font-black tracking-widest uppercase text-cyan-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                        Contact Information
                      </h2>
                    </div>
                  </foreignObject>

                  {/* Contact Info (Email & Phone) */}
                  <foreignObject x="80" y="175" width="440" height="150">
                    <div className="w-full h-full flex flex-col items-center justify-center font-sans gap-3 px-4">
                      <div className="flex items-center gap-2 text-[12px] sm:text-[14.5px] font-semibold text-slate-100 whitespace-nowrap">
                        <span className="text-cyan-400">✉ Email:</span>
                        <a
                          href={`mailto:${contactInfo.contactEmail}`}
                          className="hover:text-cyan-300 transition-colors"
                        >
                          {contactInfo.contactEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] sm:text-[14.5px] font-semibold text-slate-100 whitespace-nowrap">
                        <span className="text-cyan-400">☎ Phone:</span>
                        <a
                          href={`tel:${contactInfo.contactPhone.replace(/\s+/g, '')}`}
                          className="hover:text-cyan-300 transition-colors"
                        >
                          {contactInfo.contactPhone}
                        </a>
                      </div>
                    </div>
                  </foreignObject>

                  {/* Address & Social Links (Bottom Area) */}
                  <foreignObject x="50" y="520" width="500" height="110">
                    <div className="w-full h-full flex flex-col items-center justify-between font-sans py-1 px-4">
                      <span className="text-[9px] sm:text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
                        📍 Our Address
                      </span>
                      <div className="w-full overflow-x-auto scrollbar-none whitespace-nowrap text-center text-[12.5px] sm:text-[15px] text-slate-100 font-semibold tracking-wide">
                        {contactInfo.address}
                      </div>
                      <div className="flex flex-col items-center gap-1 mt-0.5">
                        <span className="text-[8px] sm:text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                          Connect Socially
                        </span>
                        <div className="flex items-center gap-4 text-slate-350 mt-1">
                          {/* LinkedIn */}
                          <a
                            href={contactInfo.socialLinks.linkedin || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-300 transition-colors text-slate-300 hover:scale-110"
                            title="LinkedIn"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                          </a>
                          {/* YouTube */}
                          <a
                            href={contactInfo.socialLinks.youtube || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-300 transition-colors text-slate-300 hover:scale-110"
                            title="YouTube"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M23.498 6.163c-.272-.98-1.04-1.748-2.02-2.02-1.782-.475-8.978-.475-8.978-.475s-7.197 0-8.98.475c-.978.272-1.748 1.04-2.02 2.02-.475 1.783-.475 5.503-.475 5.503s0 3.72.475 5.502c.272.98 1.04 1.748 2.02 2.02 1.783.475 8.98.475 8.98.475s7.197 0 8.98-.475c.98-.272 1.748-1.04 2.02-2.02.475-1.782.475-5.502.475-5.502s0-3.72-.475-5.502zm-14.32 9.005v-7.02l6.127 3.51-6.127 3.51z" />
                            </svg>
                          </a>
                          {/* Facebook */}
                          <a
                            href={contactInfo.socialLinks.facebook || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-300 transition-colors text-slate-300 hover:scale-110"
                            title="Facebook"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                          </a>
                          {/* Instagram */}
                          <a
                            href={contactInfo.socialLinks.instagram || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-300 transition-colors text-slate-300 hover:scale-110"
                            title="Instagram"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </a>
                          {/* Twitter / X */}
                          <a
                            href={contactInfo.socialLinks.twitter || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-300 transition-colors text-slate-300 hover:scale-110"
                            title="X / Twitter"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </svg>
              </div>
            </div>

            {/* RIGHT CARD: 3D Interactive Smartphone Form */}
            <div className="lg:col-span-7 flex items-center justify-center p-2 sm:p-4 relative">
              {/* Back ambient radial glow */}
              <div className="absolute -inset-8 bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-[60px] blur-3xl opacity-50 dark:opacity-40 animate-pulse pointer-events-none z-0" />

              {/* Smartphone Chassis with Mouse-Tracking Perspective */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.5s ease-out' : 'none',
                }}
                className="w-full max-w-[395px] relative group select-none z-10"
              >
                {/* Metallic Smartphone Outer Frame */}
                <div className="rounded-[52px] p-[3px] bg-gradient-to-tr from-slate-400 via-slate-100 to-slate-500 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative">
                  {/* Black Bezel */}
                  <div className="rounded-[49px] p-[10px] bg-black ring-1 ring-slate-800/80">
                    {/* Screen Container */}
                    <div
                      className="w-full h-[710px] rounded-[38px] overflow-hidden text-slate-900 relative flex flex-col border border-slate-300 shadow-inner bg-amber-500"
                      style={{
                        backgroundImage: 'url(/phone_wallpaper.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {/* Glass Sheen Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-30 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4" />
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none z-10" />

                      {/* Ambient screen color accents */}
                      <div className="absolute top-10 left-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none z-0" />
                      <div className="absolute bottom-10 right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none z-0" />

                      {/* Phone Top Status Bar */}
                      <div className="w-full h-8 flex items-center justify-between px-6 bg-white/60 backdrop-blur-md border-b border-black/5 text-[10px] font-semibold text-slate-800 z-40 select-none relative">
                        <span className="tracking-wide">{currentTime.time}</span>

                        {/* Speaker Grill & Selfie Camera (Dynamic Island style) */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-2 flex items-center gap-1.5 z-50">
                          <div className="w-10 h-[3px] bg-neutral-800 rounded-full border border-neutral-700/50 shadow-inner" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                            <span className="w-1 h-1 rounded-full bg-blue-600/80 animate-pulse" />
                          </div>
                        </div>

                        {/* Status Icons */}
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Signal className="w-3.5 h-3.5" />
                          <Wifi className="w-3.5 h-3.5" />
                          <Battery className="w-3.5 h-3.5 text-cyan-800" />
                          <span className="text-[8.5px]">100%</span>
                        </div>
                      </div>

                      {/* Scrollable Form Body inside Smartphone */}
                      <div className="flex-1 overflow-y-auto scrollbar-none px-5 pt-4 pb-6 relative z-20 flex flex-col">
                        {/* Digital Clock Widget */}
                        <div className="flex flex-col items-center justify-center text-center mt-1 mb-4 select-none">
                          <div className="text-[20px] font-black text-slate-900 tracking-widest">
                            {currentTime.time}
                          </div>
                          <div className="text-[9.5px] font-bold text-cyan-800 uppercase tracking-widest mt-0.5">
                            {currentTime.day}, {currentTime.date}
                          </div>
                        </div>

                        {/* Heading & Subtitle */}
                        <div className="text-center mb-5">
                          <h2 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-800 via-blue-900 to-cyan-800 uppercase tracking-widest">
                            Contact Us
                          </h2>
                          <p className="text-[9.5px] sm:text-[10px] text-slate-750 font-bold leading-snug mt-1 max-w-[280px] mx-auto text-slate-700">
                            We're here to answer your questions. Send us a message and we'll respond as soon as possible.
                          </p>
                        </div>

                        {/* Interactive Form */}
                        <form
                          onSubmit={handleSubmit}
                          className="space-y-4 flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-3.5">
                            {/* Full Name Field */}
                            <div className="relative group">
                              <label
                                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                                  focusedField === 'name' || formData.name
                                    ? 'text-cyan-800 text-[8.5px] top-1.5 font-bold uppercase tracking-wider'
                                    : 'text-slate-700 text-[11px] sm:text-xs top-3 font-semibold'
                                }`}
                              >
                                Your Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                spellCheck="false"
                                className={`w-full text-xs bg-white/70 border rounded-xl px-3 text-slate-900 font-semibold transition-all duration-300 ${
                                  focusedField === 'name' || formData.name
                                    ? 'pt-5 pb-1.5 border-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.25)] bg-white/90'
                                    : 'py-3 border-slate-300'
                                } focus:outline-none focus:ring-0 focus:border-cyan-600`}
                              />
                            </div>

                            {/* Email Address Field */}
                            <div className="relative group">
                              <label
                                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                                  focusedField === 'email' || formData.email
                                    ? 'text-cyan-800 text-[8.5px] top-1.5 font-bold uppercase tracking-wider'
                                    : 'text-slate-700 text-[11px] sm:text-xs top-3 font-semibold'
                                }`}
                              >
                                Email Address <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                spellCheck="false"
                                className={`w-full text-xs bg-white/70 border rounded-xl px-3 text-slate-900 font-semibold transition-all duration-300 ${
                                  focusedField === 'email' || formData.email
                                    ? 'pt-5 pb-1.5 border-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.25)] bg-white/90'
                                    : 'py-3 border-slate-300'
                                } focus:outline-none focus:ring-0 focus:border-cyan-600`}
                              />
                            </div>

                            {/* Phone Number Field (with dial flash effect) */}
                            <div className="relative group">
                              <label
                                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                                  focusedField === 'phone' || formData.phone
                                    ? 'text-cyan-800 text-[8.5px] top-1.5 font-bold uppercase tracking-wider'
                                    : 'text-slate-700 text-[11px] sm:text-xs top-3 font-semibold'
                                }`}
                              >
                                Phone Number <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                maxLength={10}
                                value={formData.phone}
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                                spellCheck="false"
                                className={`w-full text-xs bg-white/70 border rounded-xl px-3 text-slate-900 font-semibold transition-all duration-300 ${
                                  highlightPhoneInput
                                    ? 'pt-5 pb-1.5 border-cyan-600 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-[1.01] bg-white/90'
                                    : focusedField === 'phone' || formData.phone
                                    ? 'pt-5 pb-1.5 border-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.25)] bg-white/90'
                                    : 'py-3 border-slate-300'
                                } focus:outline-none focus:ring-0 focus:border-cyan-600`}
                              />
                            </div>

                            {/* Inquiry Subject Dropdown */}
                            <div className="relative group">
                              <label className="absolute left-3 top-1.5 text-cyan-800 text-[8.5px] font-bold uppercase tracking-wider z-10 pointer-events-none">
                                Inquiry Subject
                              </label>
                              <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full text-xs bg-white/70 border border-slate-300 rounded-xl pt-5 pb-1.5 px-3 text-slate-900 font-semibold focus:outline-none focus:ring-0 focus:border-cyan-600 transition-all duration-300 appearance-none cursor-pointer"
                              >
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Admissions">Admissions</option>
                                <option value="Courses">Courses</option>
                                <option value="Technical Support">Technical Support</option>
                                <option value="Feedback">Feedback</option>
                                <option value="Other">Other</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-[18px] text-slate-700 pointer-events-none z-20" />
                            </div>

                            {/* Website Rating Dropdown */}
                            <div className="relative group">
                              <label className="absolute left-3 top-1.5 text-cyan-800 text-[8.5px] font-bold uppercase tracking-wider z-10 pointer-events-none">
                                Website Rating (out of 5 Stars)
                              </label>
                              <select
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                className="w-full text-xs bg-white/70 border border-slate-300 rounded-xl pt-5 pb-1.5 px-3 text-slate-900 font-extrabold focus:outline-none focus:ring-0 focus:border-cyan-600 transition-all duration-300 appearance-none cursor-pointer"
                              >
                                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Excellent Experience</option>
                                <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good Platform</option>
                                <option value={3}>⭐⭐⭐ 3 Stars - Good & Helpful</option>
                                <option value={2}>⭐⭐ 2 Stars - Fair / Needs Work</option>
                                <option value={1}>⭐ 1 Star - Poor Experience</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-[18px] text-slate-700 pointer-events-none z-20" />
                            </div>

                            {/* Message Textarea */}
                            <div className="relative group">
                              <label
                                className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
                                  focusedField === 'message' || formData.message
                                    ? 'text-cyan-800 text-[8.5px] top-1.5 font-bold uppercase tracking-wider'
                                    : 'text-slate-700 text-[11px] sm:text-xs top-3 font-semibold'
                                }`}
                              >
                                Your Message <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                name="message"
                                value={formData.message}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                                onChange={handleChange}
                                required
                                rows={3}
                                autoComplete="off"
                                spellCheck="false"
                                className={`w-full text-xs bg-white/70 border rounded-xl px-3 text-slate-900 font-semibold transition-all duration-300 ${
                                  focusedField === 'message' || formData.message
                                    ? 'pt-5 pb-1.5 border-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.25)] bg-white/90'
                                    : 'py-3 border-slate-300'
                                } focus:outline-none focus:ring-0 focus:border-cyan-600 resize-none`}
                              />
                              <div className="flex justify-between items-center text-[9.5px] font-extrabold mt-1 px-1 select-none">
                                <span className="text-slate-700">Max 300 words</span>
                                <span
                                  className={
                                    wordCount > 300
                                      ? 'text-red-600 font-black animate-pulse'
                                      : 'text-cyan-900 font-black'
                                  }
                                >
                                  {wordCount} / 300 words
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="mt-4">
                            <button
                              type="submit"
                              disabled={submitting}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-[0_4px_20px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.55)] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? (
                                <>
                                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Send Message</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Side Buttons */}
                  <div className="absolute -left-[3.5px] top-[140px] w-[3.5px] h-[40px] bg-gradient-to-b from-slate-400 to-slate-500 rounded-l-md shadow-md z-50 border-r-0" />
                  <div className="absolute -left-[3.5px] top-[190px] w-[3.5px] h-[40px] bg-gradient-to-b from-slate-400 to-slate-500 rounded-l-md shadow-md z-50 border-r-0" />
                  <div className="absolute -right-[3.5px] top-[170px] w-[3.5px] h-[55px] bg-gradient-to-b from-slate-400 to-slate-500 rounded-r-md shadow-md z-50 border-l-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
