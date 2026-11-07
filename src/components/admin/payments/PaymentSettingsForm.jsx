import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, KeyRound, Save, ShieldCheck } from 'lucide-react';
import { Field, INPUT_STYLE, PANEL_STYLE, PRIMARY_BUTTON, SECONDARY_BUTTON, TextInput, Toggle } from '../courses/fields';
import { checkPaymentKeys, fetchPaymentSettings, savePaymentSettings } from '../../../services/adminPaymentsApi';

const KEYS_FROM = {
  admin: 'Using the keys saved on this page.',
  env: 'Using the keys in the server settings (RAZORPAY_KEY_ID). Keys saved here are used instead.',
  none: 'No Razorpay keys yet.',
};

const METHODS = [
  {
    id: 'auto',
    label: 'Automatic (recommended)',
    text: 'Buy works now with demo payments (no money). Once the Razorpay keys below are saved, real payments start by themselves.',
  },
  {
    id: 'razorpay',
    label: 'Razorpay',
    text: 'Real payments only, by UPI, cards and net banking. Until the keys below are saved, students cannot pay.',
  },
  {
    id: 'demo',
    label: 'Demo (no real money)',
    text: 'Always demo payments, even with keys saved: a confirmation on the site, and the course opens. No money is taken.',
  },
];

const toForm = (settings) => ({
  provider: settings.method || 'auto',
  enabled: settings.enabled,
  keyId: settings.keyId,
  keySecret: '',
  webhookSecret: '',
  freePreviewLessons: String(settings.freePreviewLessons),
});

function SecretInput({ label, hint, value, onChange, placeholder }) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="password"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={INPUT_STYLE}
      />
    </Field>
  );
}

/**
 * Razorpay keys, the webhook, and the free lessons. Secrets are never shown again once saved:
 * the page only says one is saved and how it ends, and an empty box keeps it.
 */
export default function PaymentSettingsForm({ showToast }) {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [check, setCheck] = useState(null); // { success, message }

  const load = useCallback(
    () =>
      fetchPaymentSettings().then(
        (loaded) => {
          setSettings(loaded);
          setForm(toForm(loaded));
          setError('');
        },
        (problem) => setError(problem.message)
      ),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  if (!form) {
    return <div className={PANEL_STYLE}>{error ? <p className="text-xs text-rose-600">{error}</p> : <p className="text-xs text-slate-500">Loading settings...</p>}</div>;
  }

  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      const changes = {
        provider: form.provider,
        enabled: form.enabled,
        keyId: form.keyId.trim(),
        freePreviewLessons: Number(form.freePreviewLessons),
      };
      if (form.keySecret.trim()) changes.keySecret = form.keySecret.trim();
      if (form.webhookSecret.trim()) changes.webhookSecret = form.webhookSecret.trim();
      const data = await savePaymentSettings(changes);
      setSettings(data.settings);
      setForm(toForm(data.settings));
      setCheck(null);
      showToast?.(data.message);
    } catch (problem) {
      setError(problem.message);
    } finally {
      setBusy(false);
    }
  };

  const checkKeys = async () => {
    setBusy(true);
    setCheck(null);
    const typed = form.keyId.trim() && form.keySecret.trim() ? { keyId: form.keyId.trim(), keySecret: form.keySecret.trim() } : {};
    setCheck(await checkPaymentKeys(typed));
    setBusy(false);
  };

  const copyWebhook = () => {
    navigator.clipboard?.writeText(settings.webhookUrl).then(
      () => showToast?.('Webhook address copied'),
      () => {}
    );
  };

  const savedSecret = settings.hasKeySecret && settings.keySecretHint;

  return (
    <div className="space-y-4">
      <div
        data-testid="payment-status"
        className={`p-4 rounded-3xl border flex items-start gap-3 ${
          settings.configured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-200'
            : 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-200'
        }`}
      >
        {settings.configured ? <ShieldCheck size={20} className="shrink-0 mt-0.5" /> : <AlertTriangle size={20} className="shrink-0 mt-0.5" />}
        <div className="text-xs sm:text-sm space-y-1">
          <p className="font-semibold">
            {settings.configured ? 'Payments are on.' : 'Payments are off.'}{' '}
            {settings.mode && (
              <span className="inline-block ml-1 px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/20 border border-current/20 text-[11px]">
                {{ live: 'Live mode: real money', test: 'Test mode: no real money', demo: 'Demo: no money' }[settings.mode]}
              </span>
            )}
          </p>
          <p>
            {!settings.enabled ? 'Switched off below. ' : ''}
            {settings.provider === 'demo'
              ? settings.method === 'auto'
                ? 'Payment method: Automatic. No Razorpay keys yet, so Buy uses demo payments. Save the keys below and real payments start.'
                : 'The payment method is Demo, so no Razorpay keys are needed.'
              : KEYS_FROM[settings.keysFrom]}
            {settings.provider !== 'demo' && settings.activeKeyId ? ` Key ${settings.activeKeyId}.` : ''}
          </p>
          {settings.provider === 'demo' && settings.configured && (
            <p data-testid="demo-warning" className="font-semibold">
              {settings.method === 'auto'
                ? 'Demo payments are on until the Razorpay keys are added: students can open courses without paying until then.'
                : 'Demo payments are on: students can open courses without paying. Choose Automatic or Razorpay before the website goes live.'}
            </p>
          )}
          {settings.coursesForSale > 0 && (
            <p data-testid="courses-for-sale" className="font-semibold">
              {settings.configured
                ? `${settings.coursesForSale} ${settings.coursesForSale === 1 ? 'course is' : 'courses are'} sold online.`
                : `${settings.coursesForSale} ${settings.coursesForSale === 1 ? 'course is' : 'courses are'} for sale, so students can watch only the free lessons until payments are on.`}
            </p>
          )}
          <p>
            {settings.webhookReady
              ? 'Webhook secret set: a payment opens the course even if the student closes the page before it finishes.'
              : 'No webhook secret yet: payments still open the course when the checkout finishes, but not if the student closes the page first.'}
          </p>
        </div>
      </div>

      {settings.unreadable && (
        <p className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
          The saved secrets can no longer be read, because the server's JWT_SECRET or PAYMENT_SETTINGS_KEY changed. Enter them again and save.
        </p>
      )}

      <div className={`${PANEL_STYLE} space-y-3`}>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Payment method</h3>
        <div role="radiogroup" aria-label="Payment method" className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {METHODS.map((method) => (
            <label
              key={method.id}
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${
                form.provider === method.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                checked={form.provider === method.id}
                onChange={() => set('provider')(method.id)}
                className="mt-1 accent-blue-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">{method.label}</span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">{method.text}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={`${PANEL_STYLE} space-y-4`}>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound size={16} className="text-blue-600" />
          <span>Razorpay keys</span>
          {form.provider === 'demo' && <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">(not used while the method is Demo; add them any time)</span>}
          {form.provider === 'auto' && settings.keysFrom === 'none' && (
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">(save them and real payments start)</span>
          )}
        </h3>
        <Toggle
          label="Take payments online"
          hint="Off stops new payments at once. The keys stay saved, and courses already bought stay open."
          checked={form.enabled}
          onChange={set('enabled')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Key id"
            hint="Razorpay Dashboard: Account & Settings, API Keys. rzp_test_ keys take no real money."
            value={form.keyId}
            onChange={set('keyId')}
            placeholder="rzp_test_..."
            autoComplete="off"
          />
          <SecretInput
            label="Key secret"
            hint={savedSecret ? `Saved, ends in ${settings.keySecretHint.slice(-4)}. Leave empty to keep it.` : 'Shown once by Razorpay when you make the keys.'}
            value={form.keySecret}
            onChange={set('keySecret')}
            placeholder={savedSecret ? settings.keySecretHint : 'Paste the key secret'}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={checkKeys} disabled={busy} className={SECONDARY_BUTTON}>
            <CheckCircle2 size={14} />
            <span>Check keys</span>
          </button>
          {check && (
            <span data-testid="key-check" className={`text-xs ${check.success ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {check.message}
            </span>
          )}
        </div>
      </div>

      <div className={`${PANEL_STYLE} space-y-4`}>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Webhook</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          In Razorpay: Account & Settings, Webhooks, Add New Webhook. Paste this address, tick the events payment.captured and
          order.paid, choose a secret, and put the same secret here.
        </p>
        <div className="flex gap-2">
          <input aria-label="Webhook address" readOnly value={settings.webhookUrl} className={`${INPUT_STYLE} font-mono`} />
          <button type="button" onClick={copyWebhook} className={SECONDARY_BUTTON}>
            <Copy size={14} />
            <span>Copy</span>
          </button>
        </div>
        <SecretInput
          label="Webhook secret"
          hint={settings.hasWebhookSecret ? 'Saved. Leave empty to keep it.' : 'The secret you typed in Razorpay for this webhook.'}
          value={form.webhookSecret}
          onChange={set('webhookSecret')}
          placeholder={settings.hasWebhookSecret ? 'Saved' : 'Paste the webhook secret'}
        />
      </div>

      <div className={`${PANEL_STYLE} space-y-3`}>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Free lessons</h3>
        <div className="max-w-xs">
          <TextInput
            label="Lessons to watch before buying"
            hint="The first lessons of a course sold online, in page order, that signed-in students can watch free. 0 locks every lesson."
            type="number"
            min="0"
            max="20"
            value={form.freePreviewLessons}
            onChange={set('freePreviewLessons')}
          />
        </div>
      </div>

      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={busy} className={PRIMARY_BUTTON}>
          <Save size={14} />
          <span>Save Payment Settings</span>
        </button>
      </div>
    </div>
  );
}
