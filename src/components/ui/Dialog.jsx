import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, Info } from 'lucide-react';
import { DialogContext } from './dialogContext';

const TONES = {
  danger: {
    icon: AlertTriangle,
    badge: 'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30',
    button: 'bg-rose-600 hover:bg-rose-500 focus-visible:ring-rose-500 shadow-rose-600/30',
  },
  primary: {
    icon: HelpCircle,
    badge: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
    button: 'bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-500 shadow-blue-600/30',
  },
  // Something worked: a course added to the cart, a payment received
  success: {
    icon: CheckCircle2,
    badge: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    button: 'bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-500 shadow-blue-600/30',
  },
  info: {
    icon: Info,
    badge: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
    button: 'bg-blue-600 hover:bg-blue-500 focus-visible:ring-blue-500 shadow-blue-600/30',
  },
};

/**
 * A confirmation or message box in the site's own style, in place of the browser's pop-up.
 * Escape or a click outside counts as Cancel. Focus starts on the safe button and stays inside.
 */
export default function Dialog({
  open,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  tone = 'primary',
  hideCancel = false,
  onConfirm,
  onCancel,
}) {
  const boxRef = useRef(null);
  const safeButtonRef = useRef(null);
  const style = TONES[tone] || TONES.primary;
  const Icon = style.icon;

  useEffect(() => {
    if (!open) return undefined;
    const returnTo = document.activeElement;
    safeButtonRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      } else if (event.key === 'Tab') {
        const buttons = [...(boxRef.current?.querySelectorAll('button') || [])];
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      returnTo?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onCancel}
    >
      <div
        ref={boxRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="site-dialog-title"
        aria-describedby={message ? 'site-dialog-message' : undefined}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${style.badge}`}>
            <Icon size={20} />
          </div>
          <div className="min-w-0 pt-0.5">
            <h2 id="site-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
            {message && (
              <p id="site-dialog-message" className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          {!hideCancel && (
            <button
              ref={safeButtonRef}
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-sm font-semibold cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {cancelLabel}
            </button>
          )}
          <button
            ref={hideCancel ? safeButtonRef : undefined}
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${style.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Put once around the app. Any page then asks with useDialog():
 *   if (await confirm({ title: 'Delete CBSE?', confirmLabel: 'Delete', tone: 'danger' })) ...
 *   await alert({ title: 'Saved', message: '...' })
 */
export function DialogProvider({ children }) {
  const [request, setRequest] = useState(null);
  const requestRef = useRef(null);

  const ask = useCallback((options, kind) => {
    const settings = typeof options === 'string' ? { title: options } : options;
    return new Promise((resolve) => {
      // A new question replaces one still open, which counts as Cancel
      requestRef.current?.resolve(false);
      requestRef.current = { ...settings, kind, resolve };
      setRequest(requestRef.current);
    });
  }, []);

  const close = useCallback((answer) => {
    requestRef.current?.resolve(answer);
    requestRef.current = null;
    setRequest(null);
  }, []);

  const confirmAnswer = useCallback(() => close(true), [close]);
  const cancelAnswer = useCallback(() => close(false), [close]);

  const value = useMemo(
    () => ({
      confirm: (options) => ask(options, 'confirm'),
      alert: (options) => ask(options, 'alert'),
    }),
    [ask]
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Dialog
        open={Boolean(request)}
        title={request?.title}
        message={request?.message}
        confirmLabel={request?.confirmLabel || 'OK'}
        cancelLabel={request?.cancelLabel || 'Cancel'}
        tone={request?.tone || (request?.kind === 'alert' ? 'info' : 'primary')}
        hideCancel={request?.kind === 'alert'}
        onConfirm={confirmAnswer}
        onCancel={request?.kind === 'alert' ? confirmAnswer : cancelAnswer}
      />
    </DialogContext.Provider>
  );
}
