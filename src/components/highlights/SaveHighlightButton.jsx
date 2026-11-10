import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import useSavedHighlights from '../../hooks/useSavedHighlights';

const VARIANTS = {
  // In lists of highlights: a small outlined button
  default: {
    off: 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:text-blue-700',
    on: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    size: 'px-3 py-1.5 text-xs',
    icon: 13,
  },
};

/**
 * Save a highlight to My Highlights, or take it out again. A visitor is asked to sign in;
 * administrators get no button, as they see every highlight.
 */
export default function SaveHighlightButton({ highlight, currentUser, onOpenSignIn, variant = 'default', className = '' }) {
  const saved = useSavedHighlights(currentUser);
  if (currentUser?.role === 'admin') return null;
  const style = VARIANTS[variant] || VARIANTS.default;
  const isSaved = saved.isSaved(highlight._id);

  const toggle = () => {
    if (!currentUser) {
      onOpenSignIn?.();
      return;
    }
    saved.toggle(highlight._id).catch((problem) => {
      if (problem.status === 401) onOpenSignIn?.();
    });
  };

  return (
    <button
      type="button"
      data-testid="save-highlight"
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${highlight.title} from My Highlights` : `Save ${highlight.title} to My Highlights`}
      onClick={toggle}
      className={`rounded-lg border font-bold inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${style.size} ${
        isSaved ? style.on : style.off
      } ${className}`}
    >
      {isSaved ? <BookmarkCheck size={style.icon} /> : <Bookmark size={style.icon} />}
      <span>{isSaved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
