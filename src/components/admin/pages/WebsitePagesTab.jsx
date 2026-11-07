import React, { useState } from 'react';
import { Home, PanelsTopLeft, Users } from 'lucide-react';
import { PANEL_STYLE } from '../courses/fields';
import AboutPageEditor from './AboutPageEditor';
import HomePageEditor from './HomePageEditor';

const PAGES = [
  { id: 'home', label: 'Home Page', icon: Home },
  { id: 'about', label: 'About Us', icon: Users },
];

/**
 * One admin menu for the content of the website's pages. Each page saves on its own,
 * and both stay open, so switching between them keeps unsaved changes.
 */
export default function WebsitePagesTab({ showToast }) {
  const [page, setPage] = useState('home');

  return (
    <div className="space-y-5">
      <div className={`${PANEL_STYLE} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PanelsTopLeft size={18} className="text-blue-600" />
            <span>Website Pages</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Change the cards and text on the website's pages. Choose a page.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Pages"
          className="inline-flex self-start sm:self-auto p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
        >
          {PAGES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={page === id}
              onClick={() => setPage(id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                page === id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white'
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" aria-label="Home Page" hidden={page !== 'home'}>
        <HomePageEditor showToast={showToast} />
      </div>
      <div role="tabpanel" aria-label="About Us" hidden={page !== 'about'}>
        <AboutPageEditor showToast={showToast} />
      </div>
    </div>
  );
}
