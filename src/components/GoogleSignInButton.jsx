import React, { useEffect, useRef, useState } from 'react';
import { fetchGoogleSignInConfig } from '../services/api';

const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';

// Loaded once per page: the server's Google setting and Google's own script
let configPromise = null;
let scriptPromise = null;
let initializedFor = '';
let currentHandler = null;

const loadConfig = () => {
  configPromise = configPromise || fetchGoogleSignInConfig().catch(() => ({ enabled: false, clientId: '' }));
  return configPromise;
};

const loadScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  scriptPromise =
    scriptPromise ||
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = GOOGLE_SCRIPT;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error('Google sign-in could not load.'));
      };
      document.head.appendChild(script);
    });
  return scriptPromise;
};

/**
 * Google's own "Sign in with Google" button. It shows only when the server has a Google client id,
 * and gives onCredential the ID token Google hands the page. The server checks that token.
 * text is Google's wording: 'signin_with', 'signup_with' or 'continue_with'.
 */
export default function GoogleSignInButton({ text = 'continue_with', onCredential, dividerLabel }) {
  const holderRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'off' | 'failed'

  useEffect(() => {
    currentHandler = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let isCurrent = true;

    loadConfig().then(async (config) => {
      if (!isCurrent) return;
      if (!config.enabled) {
        setStatus('off');
        return;
      }
      try {
        await loadScript();
      } catch {
        if (isCurrent) setStatus('failed');
        return;
      }
      if (!isCurrent || !holderRef.current) return;

      const google = window.google.accounts.id;
      if (initializedFor !== config.clientId) {
        google.initialize({
          client_id: config.clientId,
          callback: (response) => currentHandler?.(response.credential),
          ux_mode: 'popup',
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        initializedFor = config.clientId;
      }
      google.renderButton(holderRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text,
        logo_alignment: 'center',
        width: Math.min(Math.max(holderRef.current.offsetWidth, 200), 400),
      });
      setStatus('ready');
    });

    return () => {
      isCurrent = false;
    };
  }, [text]);

  if (status === 'off') return null;

  return (
    <div className="space-y-3">
      {dividerLabel && status !== 'failed' && (
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          <span>{dividerLabel}</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        </div>
      )}
      <div ref={holderRef} data-testid="google-sign-in" className="w-full flex justify-center min-h-[44px]" />
      {status === 'failed' && (
        <p className="text-center text-[11px] font-semibold text-rose-600 dark:text-rose-400">
          Google sign-in could not load. Check your connection, or use the form above.
        </p>
      )}
    </div>
  );
}
