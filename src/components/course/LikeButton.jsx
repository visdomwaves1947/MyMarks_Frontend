import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const STYLES = {
  // Round, over a course card's picture
  card: 'w-8 h-8 rounded-full bg-black/45 hover:bg-black/60 backdrop-blur-md border border-white/25 text-white',
  // Next to Buy Now and Add to Cart on a course page
  hero:
    'px-4 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:border-rose-300 text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base gap-2',
  // On a Liked Courses card, to take it off the list
  list: 'w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/60 text-rose-600',
};

/**
 * The heart that likes a course or takes the like away. It gives a small pop when pressed.
 */
export default function LikeButton({ liked, onToggle, name, variant = 'card', className = '' }) {
  const [pop, setPop] = useState(false);
  useEffect(() => {
    if (!pop) return undefined;
    const timer = setTimeout(() => setPop(false), 180);
    return () => clearTimeout(timer);
  }, [pop]);

  return (
    <button
      type="button"
      data-testid="like-button"
      aria-pressed={liked}
      aria-label={liked ? `Remove ${name} from liked courses` : `Like ${name}`}
      title={liked ? 'Liked: click to remove' : 'Like this course'}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setPop(true);
        onToggle();
      }}
      className={`inline-flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer ${STYLES[variant]} ${className}`}
    >
      <Heart
        size={variant === 'hero' ? 18 : 16}
        className={`transition-transform duration-200 motion-reduce:transition-none ${pop ? 'scale-125' : 'scale-100'} ${
          liked ? 'fill-rose-500 text-rose-500' : ''
        }`}
      />
      {variant === 'hero' && <span>{liked ? 'Liked' : 'Like'}</span>}
    </button>
  );
}
