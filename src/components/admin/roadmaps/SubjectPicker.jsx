import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { INPUT_STYLE } from '../courses/fields';

const countLabel = (count) => `${count} ${count === 1 ? 'roadmap' : 'roadmaps'}`;

/**
 * Subject list for the Roadmaps page. A short scrolling list with a search box,
 * because the browser's own dropdown grows as tall as the screen with 18 subjects.
 */
export default function SubjectPicker({ courses, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const selected = courses.find((course) => course._id === value);
  const matches = useMemo(() => {
    const text = query.trim().toLowerCase();
    return text ? courses.filter((course) => course.name.toLowerCase().includes(text)) : courses;
  }, [courses, query]);

  // Closes on a click anywhere else on the page
  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', closeOutside);
    return () => document.removeEventListener('mousedown', closeOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, isOpen]);

  const open = () => {
    setQuery('');
    setActive(Math.max(courses.findIndex((course) => course._id === value), 0));
    setIsOpen(true);
  };

  const choose = (course) => {
    setIsOpen(false);
    onChange(course._id);
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, matches.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (matches[active]) choose(matches[active]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <span id="roadmap-subject-label" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
        Subject
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="roadmap-subject-label roadmap-subject-value"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        className={`${INPUT_STYLE} flex items-center justify-between gap-2 text-left cursor-pointer`}
      >
        <span id="roadmap-subject-value" className={`truncate ${selected ? '' : 'text-slate-400 dark:text-slate-500'}`}>
          {selected ? `${selected.name} · ${countLabel(selected.roadmapCount)}` : 'Choose a subject'}
        </span>
        <ChevronDown size={16} className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-30 mt-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search subjects"
                aria-label="Search subjects"
                aria-controls="roadmap-subject-list"
                className={`${INPUT_STYLE} !pl-8 !py-2`}
              />
            </div>
          </div>

          <ul id="roadmap-subject-list" ref={listRef} role="listbox" aria-label="Subjects" className="max-h-64 overflow-y-auto p-1">
            {matches.length === 0 && (
              <li className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">No subject matches "{query}".</li>
            )}
            {matches.map((course, index) => {
              const isSelected = course._id === value;
              return (
                <li
                  key={course._id}
                  role="option"
                  aria-selected={isSelected}
                  data-active={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(course)}
                  className={`px-3 py-2 rounded-xl flex items-center justify-between gap-2 cursor-pointer text-sm ${
                    index === active ? 'bg-blue-50 dark:bg-slate-800' : ''
                  }`}
                >
                  <span className="min-w-0 flex items-center gap-2">
                    {isSelected ? (
                      <Check size={14} className="shrink-0 text-blue-600" />
                    ) : (
                      <span className="w-3.5 shrink-0" />
                    )}
                    <span className="truncate font-semibold text-slate-800 dark:text-slate-100">{course.name}</span>
                    {course.status !== 'published' && (
                      <span className="shrink-0 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                        {course.status}
                      </span>
                    )}
                  </span>
                  <span
                    className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      course.roadmapCount > 0
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {countLabel(course.roadmapCount)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
