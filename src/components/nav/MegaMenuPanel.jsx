import React from 'react';
import { Award, BookOpen, ChevronRight, FlaskConical, Globe, GraduationCap, Layers } from 'lucide-react';

const ICONS = {
  layers: Layers,
  globe: Globe,
  flask: FlaskConical,
  book: BookOpen,
  graduation: GraduationCap,
  star: Award,
};

const GRID_COLUMNS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

/**
 * The Intermediate dropdown: one column per section, and a footer with the Explore All link
 */
export default function MegaMenuPanel({ sections, menu, onNavigate }) {
  return (
    <div>
      <div className={`grid ${GRID_COLUMNS[sections.length] || 'grid-cols-3'} divide-x divide-slate-100 dark:divide-slate-800 p-2 gap-1.5`}>
        {sections.map((section, secIdx) => {
          const SectionIcon = ICONS[section.icon] || BookOpen;
          return (
            <div key={secIdx} className="px-1.5 min-w-0">
              <div className="px-2.5 py-1.5 mb-1.5 rounded-lg bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-900/40 flex items-center gap-1.5">
                <SectionIcon size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[11px] font-bold text-blue-950 dark:text-blue-200 uppercase tracking-wider truncate">
                  {section.title}
                </span>
              </div>

              <div className="space-y-0.5">
                {section.items.length === 0 && (
                  <p className="px-2.5 py-2 rounded-lg border border-dashed border-amber-300 dark:border-amber-700/60 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    No links yet. Hidden on the website until it has one.
                  </p>
                )}
                {section.items.map((sub, sIdx) => (
                  <a
                    key={sIdx}
                    href={sub.href}
                    onClick={(e) => onNavigate(e, sub.href)}
                    className="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/90 dark:hover:bg-blue-950/50 transition-colors cursor-pointer group"
                  >
                    <span className="block font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {sub.name}
                    </span>
                    {sub.desc && (
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-normal">{sub.desc}</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {(menu?.footerText || menu?.exploreHref) && (
        <div className="mt-1 pt-2 pb-1.5 px-3.5 border-t border-slate-100 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/30 flex items-center justify-between text-xs">
          <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{menu.footerText}</span>
          {menu.exploreHref && (
            <a
              href={menu.exploreHref}
              onClick={(e) => onNavigate(e, menu.exploreHref)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 group cursor-pointer"
            >
              <span>{menu.exploreLabel || 'Explore All'}</span>
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
