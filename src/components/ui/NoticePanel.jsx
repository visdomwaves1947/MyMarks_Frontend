import React from 'react';
import { Link } from 'react-router-dom';

const PANEL = 'bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm';
const PRIMARY = 'px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold';
const SECONDARY =
  'px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 text-sm font-bold';

/**
 * A centred card for a page with nothing else to show: an icon, a title, a line of text and up to two links.
 * The first link is the main one.
 */
export default function NoticePanel({ icon = null, title, children = null, actions = [], testId }) {
  return (
    <div data-testid={testId} className={`${PANEL} max-w-lg mx-auto p-8 text-center space-y-3`}>
      {icon && (
        <span className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          {icon}
        </span>
      )}
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
      {children && <p className="text-sm text-slate-600 dark:text-slate-400">{children}</p>}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
          {actions.map((action, index) => (
            <Link key={action.to} to={action.to} className={index === 0 ? PRIMARY : SECONDARY}>
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
