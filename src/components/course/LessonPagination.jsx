import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LESSONS_PER_PAGE, pageList } from './lessonPages';

const BUTTON =
  'min-w-10 h-10 px-3 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40';
const IDLE =
  'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600';

/** Page buttons under a course's topic cards; nothing when everything fits on one page */
export default function LessonPagination({ page, pageCount, total, perPage = LESSONS_PER_PAGE, theme, onChange }) {
  if (pageCount <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <nav aria-label="Lesson pages" data-testid="course-pagination" className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-slate-600 dark:text-slate-400" data-testid="course-pagination-range">
        Showing{' '}
        <span className="font-bold text-slate-900 dark:text-white">
          {from}–{to}
        </span>{' '}
        of {total} topics
      </p>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page" className={`${BUTTON} ${IDLE}`}>
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <span className="sm:hidden px-3 text-sm font-semibold text-slate-700 dark:text-slate-300" data-testid="course-pagination-page">
          Page {page} of {pageCount}
        </span>
        <div className="hidden sm:flex items-center gap-1.5">
          {pageList(page, pageCount).map((number, index) =>
            number === null ? (
              <span key={`gap-${index}`} className="px-1 text-slate-400" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={number}
                type="button"
                onClick={() => onChange(number)}
                aria-label={`Page ${number}`}
                aria-current={number === page ? 'page' : undefined}
                className={`${BUTTON} ${number === page ? `${theme.solid} shadow-md` : IDLE}`}
              >
                {number}
              </button>
            )
          )}
        </div>
        <button type="button" onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page" className={`${BUTTON} ${IDLE}`}>
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
