import React from 'react';
import {
  BarChart3,
  Users,
  BookOpen,
  Video,
  Settings,
  Database,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react';

export default function AdminSidebar({
  activeTab = 'dashboard',
  setActiveTab,
  apiStatus = { online: true, latency: 45 },
  loadAdminData,
  isRefreshing = false,
  theme = 'light',
  toggleTheme,
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Overview & Analytics',
      icon: BarChart3,
    },
    {
      id: 'students',
      label: 'Students Directory',
      icon: Users,
    },
    {
      id: 'courses',
      label: 'Curriculum & Subjects',
      icon: BookOpen,
    },
    {
      id: 'videos',
      label: 'Videos, YouTube & Links',
      icon: Video,
    },
    {
      id: 'settings',
      label: 'Platform Controls',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP VERTICAL SIDEBAR
          Light blue background (#dbeafe), clear text, spaced items
         ───────────────────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 dark:!bg-slate-900 min-h-[calc(100vh-122px)] transition-colors duration-200 select-none shadow-xs"
        style={{
          background: '#dbeafe',
          borderRight: '1px solid #bfdbfe',
        }}
      >
        {/* Sidebar Header Title */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-blue-200/80 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Navigation
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Navigation Items List with generous spacing, increased font size (text-sm) and light readable text */}
        <div className="p-3 space-y-2 grow">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const ItemIcon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/70 font-semibold'
                }`}
              >
                <ItemIcon
                  size={18}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                />
                <span
                  className={`text-sm tracking-tight truncate font-semibold transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Sidebar Status Card */}
        <div className="p-3 space-y-2 border-t border-blue-200/90 dark:border-slate-800/80">
          {/* Dark / Light Appearance Toggle Pill Switch */}
          {toggleTheme && (
            <div className="p-2 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-blue-200/90 dark:border-slate-700/60 flex items-center justify-between text-xs shadow-2xs">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Theme Mode</span>
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative flex items-center w-[54px] h-[30px] rounded-full p-[3px] transition-colors duration-300 border focus:outline-none cursor-pointer shrink-0 ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-slate-200/90 border-slate-300/80 shadow-inner'
                }`}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark mode"
              >
                <div
                  className={`absolute top-[2px] w-[24px] h-[24px] bg-white rounded-full shadow-md transition-transform duration-300 ease-out z-0 ${
                    theme === 'dark' ? 'translate-x-[24px]' : 'translate-x-[1px]'
                  }`}
                />
                <div className="relative flex justify-between items-center w-full px-[5px] z-10 pointer-events-none">
                  <Sun
                    className={`w-3.5 h-3.5 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-amber-500 font-bold'
                    }`}
                  />
                  <Moon
                    className={`w-3.5 h-3.5 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-indigo-400 font-bold' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            </div>
          )}

          {/* Database Live Status Row */}
          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-blue-200/90 dark:border-slate-700/60 flex items-center justify-between text-xs shadow-2xs">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Database size={14} className="text-emerald-500" />
              <span>MongoDB</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {apiStatus?.online ? `${apiStatus?.latency || 45}ms` : 'Offline'}
            </span>
          </div>

          {/* Quick Refresh Button */}
          {loadAdminData && (
            <button
              onClick={loadAdminData}
              disabled={isRefreshing}
              className="w-full py-2.5 px-3 rounded-xl bg-white/90 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-blue-200/90 dark:border-slate-700 shadow-2xs"
            >
              <RefreshCw
                size={13}
                className={isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500 dark:text-slate-400'}
              />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Records'}</span>
            </button>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE / TABLET HORIZONTAL QUICK TABS (< lg)
         ───────────────────────────────────────────────────────────── */}
      <div
        className="lg:hidden w-full px-3 py-2 overflow-x-auto scrollbar-none select-none dark:!bg-slate-900 border-b border-blue-200/90 dark:border-slate-800"
        style={{
          background: '#dbeafe',
        }}
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <ItemIcon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
