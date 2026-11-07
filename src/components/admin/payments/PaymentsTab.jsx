import React, { useState } from 'react';
import { CreditCard, List, Settings } from 'lucide-react';
import { PANEL_STYLE } from '../courses/fields';
import PaymentsList from './PaymentsList';
import PaymentSettingsForm from './PaymentSettingsForm';

const VIEWS = [
  { id: 'list', label: 'Payments', icon: List },
  { id: 'settings', label: 'Settings', icon: Settings },
];

/**
 * The admin's Payments menu: every payment as it comes in, and the Razorpay settings.
 */
export default function PaymentsTab({ showToast }) {
  const [view, setView] = useState('list');

  return (
    <div className="space-y-5">
      <div className={`${PANEL_STYLE} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" />
            <span>Payments</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Course payments as they come in, and the Razorpay settings.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Payments"
          className="inline-flex self-start sm:self-auto p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          {VIEWS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                view === id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white'
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {view === 'list' ? <PaymentsList /> : <PaymentSettingsForm showToast={showToast} />}
    </div>
  );
}
