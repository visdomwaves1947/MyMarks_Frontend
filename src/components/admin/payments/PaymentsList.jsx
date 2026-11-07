import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Search } from 'lucide-react';
import { INPUT_STYLE, PANEL_STYLE, SECONDARY_BUTTON } from '../courses/fields';
import { fetchAdminPayments } from '../../../services/adminPaymentsApi';

const REFRESH_MS = 30000;

const rupees = (paise) => `₹${(Number(paise || 0) / 100).toLocaleString('en-IN')}`;

const when = (value) =>
  value ? new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'online', label: 'Paid online' },
  { id: 'given', label: 'Given by admin' },
  { id: 'demo', label: 'Demo' },
  { id: 'created', label: 'Not finished' },
  { id: 'revoked', label: 'Removed' },
];

const STATUS = {
  online: ['Paid', 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'],
  given: ['Given by admin', 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60'],
  demo: ['Demo, no money', 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60'],
  created: ['Not finished', 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'],
  revoked: ['Removed', 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'],
};

const statusOf = (purchase) => {
  if (purchase.status === 'paid') return STATUS[{ admin: 'given', demo: 'demo' }[purchase.source] || 'online'];
  return STATUS[purchase.status] || STATUS.created;
};

function SummaryTile({ label, value, detail }) {
  return (
    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-lg font-bold text-slate-900 dark:text-white">{value}</div>
      {detail && <div className="text-[11px] text-slate-500 dark:text-slate-400">{detail}</div>}
    </div>
  );
}

/**
 * Every purchase, newest first, with totals at the top. Refreshes by itself every 30 seconds,
 * so payments made on the website show up while the page is open.
 */
export default function PaymentsList() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ status: 'loading', data: null, error: '' });

  const load = useCallback(
    () =>
      fetchAdminPayments({ status: filter, search: query, page }).then(
        (data) => setState({ status: 'ready', data, error: '' }),
        (error) => setState((previous) => ({ ...previous, status: previous.data ? 'ready' : 'error', error: error.message }))
      ),
    [filter, query, page]
  );

  useEffect(() => {
    load();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  // Search after a short pause in typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setQuery(search.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const data = state.data;
  const summary = data?.summary;

  return (
    <div className="space-y-4">
      <div className={`${PANEL_STYLE} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {data ? `Updated ${new Date(data.checkedAt).toLocaleTimeString('en-IN')}. Refreshes every 30 seconds.` : 'Loading payments...'}
          </p>
          <button type="button" onClick={load} className={SECONDARY_BUTTON}>
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        </div>

        {summary && (
          <div data-testid="payment-summary" className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <SummaryTile label="Collected online" value={rupees(summary.collected)} detail={`${summary.paidOnline} paid`} />
            <SummaryTile label="Collected today" value={rupees(summary.collectedToday)} />
            <SummaryTile label="Given by admin" value={summary.given} />
            <SummaryTile label="Demo payments" value={summary.demo || 0} detail="No money" />
            <SummaryTile label="Payments not finished" value={summary.unfinished} />
            <SummaryTile label="Removed" value={summary.removed} />
          </div>
        )}
      </div>

      <div className={`${PANEL_STYLE} space-y-3`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Show">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => {
                  setFilter(item.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  filter === item.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="relative md:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Search payments"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Student, course or payment id"
              className={`${INPUT_STYLE} pl-9`}
            />
          </div>
        </div>

        {state.status === 'error' && <p className="text-xs text-rose-600 dark:text-rose-400">{state.error}</p>}

        {data && data.purchases.length === 0 && (
          <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            {query || filter !== 'all' ? 'No payments match.' : 'No payments yet. They appear here as soon as a student buys a course.'}
          </p>
        )}

        {data && data.purchases.length > 0 && (
          <div className="overflow-x-auto -mx-1">
            <table data-testid="payments-table" className="w-full min-w-[720px] text-xs">
              <thead>
                <tr className="text-left text-[11px] text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-2 py-2 font-semibold">When</th>
                  <th className="px-2 py-2 font-semibold">Student</th>
                  <th className="px-2 py-2 font-semibold">Course</th>
                  <th className="px-2 py-2 font-semibold">Amount</th>
                  <th className="px-2 py-2 font-semibold">Status</th>
                  <th className="px-2 py-2 font-semibold">Razorpay</th>
                </tr>
              </thead>
              <tbody>
                {data.purchases.map((purchase) => {
                  const [label, style] = statusOf(purchase);
                  return (
                    <tr key={purchase.id} className="border-b border-slate-100 dark:border-slate-800/70 align-top">
                      <td className="px-2 py-2.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {when(purchase.paidAt || purchase.createdAt)}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="text-slate-900 dark:text-white">{purchase.student?.fullName || 'Deleted student'}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {[purchase.student?.email, purchase.student?.mobileNumber].filter(Boolean).join(' · ')}
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-slate-700 dark:text-slate-200">{purchase.courseName}</td>
                      <td className="px-2 py-2.5 whitespace-nowrap text-slate-900 dark:text-white">
                        {purchase.source === 'admin' ? 'Free' : purchase.source === 'demo' ? `${rupees(purchase.amount)} (demo)` : rupees(purchase.amount)}
                      </td>
                      <td className="px-2 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-semibold ${style}`}>{label}</span>
                        {purchase.note && <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{purchase.note}</div>}
                      </td>
                      <td className="px-2 py-2.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 break-all">
                        {purchase.razorpayPaymentId || purchase.razorpayOrderId || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {data && data.pages > 1 && (
          <div className="flex items-center justify-end gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Page {data.page} of {data.pages}
            </span>
            <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)} className={SECONDARY_BUTTON}>
              <ChevronLeft size={14} />
            </button>
            <button type="button" aria-label="Next page" disabled={page >= data.pages} onClick={() => setPage(page + 1)} className={SECONDARY_BUTTON}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
