import React, { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clapperboard, GraduationCap, Lock, Scissors, Search } from 'lucide-react';
import Marked from './Marked';
import { fetchSearch } from '../../services/searchApi';
import { formatClock } from '../../utils/watchTime';

const STYLES = {
  // The top bar on laptops
  bar: {
    form: 'relative flex items-center w-full',
    input:
      'w-full text-xs bg-slate-50 hover:bg-slate-100 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-3.5 pr-8 text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 shadow-xs transition-all font-semibold',
    button: 'absolute right-2.5 text-slate-800 dark:text-slate-300 hover:text-blue-600 transition-colors cursor-pointer',
    list: 'absolute right-0 top-full mt-2 w-[min(420px,calc(100vw-2rem))]',
    icon: 14,
  },
  // The phone menu
  drawer: {
    form: 'relative flex items-center mb-3',
    input:
      'w-full text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-3.5 pr-9 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium shadow-xs',
    button: 'absolute right-3 text-slate-400 hover:text-blue-600 cursor-pointer',
    list: 'absolute left-0 right-0 top-full mt-1.5',
    icon: 16,
  },
};

// The few best matches shown while typing
const suggestionsOf = (data) => {
  const { highlights = [], reels = [], lessons = [], courses = [] } = data?.results || {};
  return [
    ...highlights.slice(0, 3).map((item) => ({ kind: 'highlight', item })),
    ...reels.slice(0, 1).map((item) => ({ kind: 'reel', item })),
    ...courses.slice(0, 2).map((item) => ({ kind: 'course', item })),
    ...lessons.slice(0, 2).map((item) => ({ kind: 'lesson', item })),
  ];
};

const ICONS = { highlight: Scissors, reel: Clapperboard, course: GraduationCap, lesson: BookOpen };

/**
 * The search box at the top of every page. While typing it suggests highlights, reels, courses and
 * lessons; Enter opens every result on the search page.
 */
export default function SearchBox({ variant = 'bar', placeholder = 'Search topics, e.g. what is trigonometry', onNavigate, className = '' }) {
  const style = STYLES[variant] || STYLES.bar;
  const navigate = useNavigate();
  const listId = useId();
  const box = useRef(null);
  const [text, setText] = useState('');
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  // Suggestions a moment after typing stops; an older search is dropped when a newer one starts
  useEffect(() => {
    const query = text.trim();
    if (query.length < 2) {
      setData(null);
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchSearch(query, { signal: controller.signal })
        .then((result) => {
          setData(result);
          setActive(-1);
        })
        .catch(() => {});
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (box.current && !box.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const go = (path) => {
    setOpen(false);
    setText('');
    setData(null);
    onNavigate?.();
    navigate(path);
  };
  const searchAll = () => {
    const query = text.trim();
    if (query) go(`/search?q=${encodeURIComponent(query)}`);
  };
  const pathOf = ({ kind, item }) => {
    if (kind === 'highlight') return `/search?q=${encodeURIComponent(text.trim())}&play=${item._id}`;
    if (kind === 'reel') return `/highlights/${item._id}`;
    if (kind === 'course') return `/courses/${item.slug}`;
    return item.course ? `/courses/${item.course.slug}` : `/search?q=${encodeURIComponent(item.title)}`;
  };

  const suggestions = suggestionsOf(data);
  const words = data?.words || [];
  const showList = open && text.trim().length >= 2 && data;

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!showList || suggestions.length === 0) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      // -1 is the box itself; the last place is "See all results"
      setActive((current) => {
        const last = suggestions.length;
        const next = current + step;
        if (next > last) return -1;
        if (next < -1) return last;
        return next;
      });
    }
  };

  return (
    <div ref={box} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (active >= 0 && suggestions[active]) go(pathOf(suggestions[active]));
          else searchAll();
        }}
        className={style.form}
      >
        <input
          type="search"
          data-testid={`search-input-${variant}`}
          placeholder={placeholder}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label="Search"
          aria-expanded={Boolean(showList)}
          aria-controls={listId}
          aria-autocomplete="list"
          role="combobox"
          className={style.input}
        />
        <button type="submit" aria-label="Search" className={style.button}>
          <Search size={style.icon} />
        </button>
      </form>

      {showList && (
        <div
          id={listId}
          data-testid="search-suggestions"
          className={`${style.list} z-[70] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden text-left`}
        >
          {data.didYouMean && (
            <p className="px-4 pt-3 text-[11px] text-slate-500 dark:text-slate-400">
              Showing results for <span className="font-semibold text-slate-800 dark:text-slate-200">{data.didYouMean}</span>
            </p>
          )}
          {suggestions.length === 0 ? (
            <p className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">No highlights, lessons or courses match.</p>
          ) : (
            <ul role="listbox" className="py-1.5">
              {suggestions.map((suggestion, index) => {
                const { kind, item } = suggestion;
                const Icon = ICONS[kind];
                const title = kind === 'course' ? item.name : kind === 'reel' ? item.name : item.title;
                let detail = '';
                if (kind === 'highlight') detail = `${item.subject} · ${formatClock(item.start)}–${formatClock(item.end)} · ${Math.round(item.duration)} sec`;
                if (kind === 'reel') detail = `Reel · ${item.clipCount} parts · ${formatClock(item.duration)}`;
                if (kind === 'course') detail = 'Course';
                if (kind === 'lesson') detail = `Lesson · ${item.subject}${item.topic ? ` · ${item.topic}` : ''}`;
                const locked = (kind === 'highlight' || kind === 'reel') && item.lockReason;
                return (
                  <li key={`${kind}-${item._id}`} role="option" aria-selected={active === index}>
                    <button
                      type="button"
                      data-testid="search-suggestion"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => go(pathOf(suggestion))}
                      className={`w-full px-4 py-2 flex items-start gap-3 text-left cursor-pointer ${
                        active === index ? 'bg-blue-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <span className="mt-0.5 w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                        <Icon size={14} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900 dark:text-white truncate">
                          <Marked text={title} words={words} />
                        </span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">{detail}</span>
                      </span>
                      {locked && <Lock size={12} className="mt-1.5 text-slate-400 shrink-0" aria-label="Locked" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <button
            type="button"
            data-testid="search-see-all"
            onMouseDown={(event) => event.preventDefault()}
            onClick={searchAll}
            className={`w-full px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left cursor-pointer ${
              active === suggestions.length ? 'bg-blue-50 dark:bg-slate-800' : ''
            }`}
          >
            See all results for &quot;{text.trim()}&quot;
          </button>
        </div>
      )}
    </div>
  );
}
