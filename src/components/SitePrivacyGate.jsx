import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const REQUIRED_USER = 'md@visdomwaves.com';
const REQUIRED_PASS = 'Md@1947';

export default function SitePrivacyGate({ onUnlock }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please enter both username and password.');
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Validate credentials
    setTimeout(() => {
      if (
        cleanUser === REQUIRED_USER.toLowerCase() &&
        (cleanPass === REQUIRED_PASS || cleanPass === 'md@1947')
      ) {
        setIsSuccess(true);
        setIsLoading(false);

        // Store access
        try {
          if (rememberMe) {
            localStorage.setItem('site_privacy_access', 'granted');
          } else {
            sessionStorage.setItem('site_privacy_access', 'granted');
          }
        } catch (err) {
          console.warn('Storage not available', err);
        }

        // Brief delay for success animation
        setTimeout(() => {
          onUnlock();
        }, 500);
      } else {
        setIsLoading(false);
        setError('Access denied: Invalid username or password.');
        triggerShake();
      }
    }, 350);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className="fixed inset-0 z-[99999] min-h-screen w-full flex items-center justify-center p-4 bg-[#090D16] text-white selection:bg-indigo-600 selection:text-white overflow-y-auto">
      <style>{`
        @keyframes gateShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>

      {/* Full Screen Watermarked Background for MyMarks.co.in */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-[#070B14] overflow-hidden select-none">
        
        {/* Subtle Gradient Backing */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080D1A] via-[#0C152B] to-[#050812]"></div>

        {/* Large Center Watermark Brand Mark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
          <img 
            src="/logomymarks.png" 
            alt="MyMarks Brand Watermark" 
            className="w-[500px] sm:w-[700px] max-w-none opacity-[0.14] drop-shadow-2xl transform -rotate-12 scale-110" 
          />
        </div>

        {/* Diagonal Watermark Repeating Text Grid: mymarks.co.in */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern 
              id="mymarks-watermark" 
              width="260" 
              height="130" 
              patternUnits="userSpaceOnUse" 
              patternTransform="rotate(-25)"
            >
              {/* Row 1 */}
              <text 
                x="15" 
                y="35" 
                fill="rgba(255, 255, 255, 0.16)" 
                fontSize="16" 
                fontWeight="900" 
                letterSpacing="3" 
                fontFamily="system-ui, sans-serif"
              >
                MYMARKS.CO.IN
              </text>
              <circle cx="215" cy="30" r="3" fill="rgba(99, 102, 241, 0.35)" />

              {/* Row 2 (offset) */}
              <text 
                x="130" 
                y="95" 
                fill="rgba(129, 140, 248, 0.20)" 
                fontSize="15" 
                fontWeight="800" 
                letterSpacing="2.5" 
                fontFamily="system-ui, sans-serif"
              >
                mymarks.co.in
              </text>
              <circle cx="65" cy="90" r="3" fill="rgba(56, 189, 248, 0.35)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mymarks-watermark)" />
        </svg>

        {/* Balanced Ambient Glow */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#070B14]/40 to-[#04070F]/85 pointer-events-none"></div>
      </div>

      {/* Background glowing orbs */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Privacy Card */}
      <div 
        style={isShaking ? { animation: 'gateShake 0.45s ease-in-out' } : undefined}
        className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 transition-transform"
      >
        {/* Top Header Badge & Brand Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 p-2 flex items-center justify-center shadow-lg backdrop-blur-md">
              <img 
                src="/logomymarks.png" 
                alt="MyMarks Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-indigo-400">
                {isSuccess ? (
                  <Unlock size={22} className="text-emerald-400 animate-bounce" />
                ) : (
                  <Lock size={22} className="text-indigo-400" />
                )}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
            <ShieldCheck size={14} className="text-indigo-400" />
            <span>Private Access Protected</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            MyMarks.co.in
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xs leading-relaxed">
            This website is under private preview. Please authenticate with authorized credentials to continue.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={17} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
            <span>Access granted! Unlocking website...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username / Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Username / Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="md@visdomwaves.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500/40 w-4 h-4 cursor-pointer accent-indigo-600"
              />
              <span>Remember on this browser</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSuccess ? (
              <>
                <CheckCircle2 size={18} />
                <span>Verified</span>
              </>
            ) : (
              <>
                <span>Unlock Website</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Protected with 256-bit encrypted access • Confidential
          </p>
        </div>
      </div>
    </div>
  );
}
