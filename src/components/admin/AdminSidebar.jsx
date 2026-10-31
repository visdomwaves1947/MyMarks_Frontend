import React from "react";
import {
  BarChart3,
  Users,
  BookOpen,
  Video,
  Settings,
  Database,
} from "lucide-react";

export default function AdminSidebar({
  activeTab = "dashboard",
  setActiveTab,
  apiStatus = { online: true, latency: 45 },
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Overview & Analytics",
      icon: BarChart3,
    },
    {
      id: "students",
      label: "Students Directory",
      icon: Users,
    },
    {
      id: "courses",
      label: "Curriculum & Subjects",
      icon: BookOpen,
    },
    {
      id: "videos",
      label: "Videos, YouTube & Links",
      icon: Video,
    },
    {
      id: "settings",
      label: "Platform Controls",
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
        className="hidden lg:flex flex-col justify-between w-60 xl:w-64 fixed left-0 top-[122px] h-[calc(100vh-122px)] z-40 select-none shadow-xs overflow-hidden"
        style={{
          background: "#dbeafe",
          borderRight: "1px solid #bfdbfe",
        }}
      >
        {/* Top: Navigation Header and Links */}
        <div className="flex flex-col min-h-0">
          {/* Sidebar Header Title */}
          <div className="px-3.5 py-2.5 shrink-0 flex items-center justify-between border-b border-blue-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Navigation
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* Navigation Items List */}
          <div className="p-2.5 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              const ItemIcon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (setActiveTab) setActiveTab(item.id);
                    const workspace = document.querySelector("#admin-workspace-scroll");
                    if (workspace) workspace.scrollTo({ top: 0, behavior: "smooth" });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/70 font-semibold"
                  }`}
                >
                  <ItemIcon
                    size={17}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }`}
                  />
                  <span
                    className={`text-xs sm:text-sm tracking-tight truncate font-semibold transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Sidebar Status Card - Firmly pinned at bottom, everything fits without scrolling */}
        <div className="p-2.5 space-y-1.5 shrink-0 border-t border-blue-200/90 dark:border-slate-800/80 mt-auto bg-inherit">

          {/* Database Live Status Row */}
          <div className="p-2 px-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-blue-200/90 dark:border-slate-700/60 flex items-center justify-between text-xs shadow-2xs">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Database size={13} className="text-emerald-500" />
              <span>MongoDB</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {apiStatus?.online ? `${apiStatus?.latency || 45}ms` : "Offline"}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

