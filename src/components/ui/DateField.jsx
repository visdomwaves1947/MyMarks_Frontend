import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MONTHS, ageOn, isoFromTyped, isoOf, longDateOf, partsOf, todayIso, typedOf } from '../../utils/dateOfBirth';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const YEARS_PER_PAGE = 16;

/**
 * Digits typed become "dd-mm-yyyy" as they are typed ("14052008" → "14-05-2008"). Anything typed
 * with its own separators ("1-5-2008", "14/05/2008", "2008-05-14") is left as it is.
 */
const withDashes = (raw) => {
  if (/[^\d-]/.test(raw)) return raw;
  const segments = raw.split('-');
  if (segments.slice(0, -1).some((segment) => segment.length !== 2)) return raw;
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('-');
};

/**
 * A date typed as dd-mm-yyyy or picked on a calendar. With nothing chosen the calendar opens on the
 * years (a year, then a month, then the day); otherwise on the chosen month. Days outside [min, max]
 * cannot be picked. onChange gets "yyyy-mm-dd" for a whole real date, or what was typed.
 */
export default function DateField({
  value,
  onChange,
  min = '',
  max = '',
  startYear,
  ariaLabel = 'Date',
  placeholder = 'dd-mm-yyyy',
  invalid = false,
  showAge = false,
  className = '',
  inputClassName = '',
  testId = 'date-field',
}) {
  const [text, setText] = useState(() => typedOf(value));
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('days');
  const [shown, setShown] = useState({ year: 2008, month: 0 });
  const [yearPage, setYearPage] = useState(2000);
  const [place, setPlace] = useState(null);
  const box = useRef(null);
  const panel = useRef(null);
  const input = useRef(null);

  const today = todayIso();
  const chosen = partsOf(value);
  const lastYear = partsOf(max)?.year ?? new Date().getFullYear();
  const firstYear = partsOf(min)?.year ?? lastYear - 100;

  // A date set from outside (filled in from the account, or cleared) is shown again
  useEffect(() => {
    if ((value || '') !== isoFromTyped(text)) setText(typedOf(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Pages of 16 years run from the first year that can be picked
  const pageOf = (year) => Math.max(firstYear, year - ((year - firstYear) % YEARS_PER_PAGE));

  const allowed = (iso) => (!min || iso >= min) && (!max || iso <= max);
  // A month can be shown when any of its days can be picked
  const monthAllowed = (year, month) =>
    (!min || isoOf(year, month, new Date(year, month + 1, 0).getDate()) >= min) && (!max || isoOf(year, month, 1) <= max);
  const monthFrom = (step) => {
    const date = new Date(shown.year, shown.month + step, 1);
    return { year: date.getFullYear(), month: date.getMonth() };
  };

  const showDate = (parts) => {
    setShown({ year: parts.year, month: parts.month });
    setYearPage(pageOf(parts.year));
  };

  const openCalendar = () => {
    if (open) return;
    const base = chosen || partsOf(isoFromTyped(text));
    const year = base?.year ?? Math.min(lastYear, Math.max(firstYear, startYear ?? lastYear));
    showDate({ year, month: base?.month ?? 0 });
    setView(base ? 'days' : 'years');
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    input.current?.focus();
  };

  const type = (event) => {
    const next = withDashes(event.target.value);
    const iso = isoFromTyped(next);
    const parts = partsOf(iso);
    // A date pasted as yyyy-mm-dd is shown as dd-mm-yyyy
    setText(parts && /^\d{4}/.test(next) ? typedOf(iso) : next);
    onChange?.(iso);
    if (parts) {
      showDate(parts);
      setView('days');
    }
  };

  const pick = (iso) => {
    setText(typedOf(iso));
    onChange?.(iso);
    close();
  };

  const clear = () => {
    setText('');
    onChange?.('');
    setView('years');
  };

  // The calendar sits on top of everything, under the field or above it when there is no room below
  const measure = () => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(232, window.innerWidth - 16);
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const below = window.innerHeight - rect.bottom;
    setPlace(below >= 270 || below >= rect.top ? { left, width, top: rect.bottom + 4 } : { left, width, bottom: window.innerHeight - rect.top + 4 });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    measure();
    const outside = (event) => {
      if (panel.current?.contains(event.target) || box.current?.contains(event.target)) return;
      setOpen(false);
    };
    const keep = () => measure();
    document.addEventListener('mousedown', outside);
    document.addEventListener('touchstart', outside);
    window.addEventListener('resize', keep);
    window.addEventListener('scroll', keep, true);
    return () => {
      document.removeEventListener('mousedown', outside);
      document.removeEventListener('touchstart', outside);
      window.removeEventListener('resize', keep);
      window.removeEventListener('scroll', keep, true);
    };
    // measure only reads refs and the window
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // The weeks of the shown month; days of the months around it are left blank
  const weeks = useMemo(() => {
    const first = new Date(shown.year, shown.month, 1).getDay();
    const days = new Date(shown.year, shown.month + 1, 0).getDate();
    const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
    while (cells.length % 7) cells.push(null);
    return Array.from({ length: cells.length / 7 }, (_, row) => cells.slice(row * 7, row * 7 + 7));
  }, [shown]);

  // The one day Tab reaches: the chosen day in this month, else the first day that can be picked
  const tabDay = (() => {
    if (chosen && chosen.year === shown.year && chosen.month === shown.month) return chosen.day;
    const days = new Date(shown.year, shown.month + 1, 0).getDate();
    for (let day = 1; day <= days; day += 1) if (allowed(isoOf(shown.year, shown.month, day))) return day;
    return 0;
  })();

  // Arrow keys move between days, into the months around this one too
  const onGridKey = (event) => {
    const current = event.target.closest?.('[data-day]')?.getAttribute('data-day');
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!current || !(event.key in steps)) return;
    event.preventDefault();
    const parts = partsOf(current);
    const next = new Date(parts.year, parts.month, parts.day + steps[event.key]);
    const iso = isoOf(next.getFullYear(), next.getMonth(), next.getDate());
    if (!allowed(iso)) return;
    if (next.getMonth() !== shown.month) setShown({ year: next.getFullYear(), month: next.getMonth() });
    requestAnimationFrame(() => panel.current?.querySelector(`[data-day="${iso}"]`)?.focus());
  };

  // The arrows: a month on the days, a year on the months, a page on the years
  const arrow = (step) => {
    if (view === 'years') {
      const page = yearPage + step * YEARS_PER_PAGE;
      return { label: step < 0 ? 'Earlier years' : 'Later years', disabled: step < 0 ? yearPage <= firstYear : page > lastYear, go: () => setYearPage(page) };
    }
    if (view === 'months') {
      const year = shown.year + step;
      return { label: step < 0 ? 'Previous year' : 'Next year', disabled: year < firstYear || year > lastYear, go: () => setShown({ year, month: shown.month }) };
    }
    const next = monthFrom(step);
    return { label: step < 0 ? 'Previous month' : 'Next month', disabled: !monthAllowed(next.year, next.month), go: () => setShown(next) };
  };

  const headerButton =
    'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer';
  const arrowButton =
    'w-6 h-6 rounded-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed';
  const cell = (selected, disabled) =>
    `rounded-lg text-[11px] font-semibold transition-colors ${
      selected
        ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
        : disabled
          ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
          : 'text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer'
    }`;

  const years = Array.from({ length: YEARS_PER_PAGE }, (_, index) => yearPage + index).filter((year) => year <= lastYear);
  const age = showAge && chosen ? ageOn(value, today) : NaN;
  const previous = arrow(-1);
  const next = arrow(1);

  return (
    <div ref={box} className={`relative ${className}`} data-testid={testId}>
      <button
        type="button"
        onClick={() => (open ? close() : openCalendar())}
        aria-label={open ? 'Close the calendar' : 'Open the calendar'}
        aria-expanded={open}
        aria-haspopup="dialog"
        data-testid={`${testId}-open`}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 cursor-pointer"
      >
        <Calendar size={14} />
      </button>
      <input
        ref={input}
        type="text"
        inputMode="numeric"
        autoComplete="bday"
        value={text}
        onChange={type}
        onClick={openCalendar}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && open) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
          } else if (event.key === 'ArrowDown' && !open) {
            event.preventDefault();
            openCalendar();
          }
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        maxLength={10}
        data-testid={`${testId}-input`}
        className={`w-full pl-8 pr-3 ${invalid ? '!border-rose-400 dark:!border-rose-500' : ''} ${inputClassName}`}
      />

      {open &&
        place &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-label={`Choose ${ariaLabel.toLowerCase()}`}
            data-testid={`${testId}-calendar`}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                close();
              }
            }}
            style={{ position: 'fixed', left: place.left, width: place.width, top: place.top, bottom: place.bottom }}
            className="z-[1000] rounded-2xl border border-slate-200 bg-white/95 backdrop-blur shadow-2xl shadow-slate-900/15 dark:border-slate-700 dark:bg-slate-900/95 p-2 text-left select-none"
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <button type="button" onClick={previous.go} disabled={previous.disabled} aria-label={previous.label} className={arrowButton}>
                <ChevronLeft size={13} />
              </button>
              <div className="flex items-center">
                {view !== 'years' && (
                  <button
                    type="button"
                    onClick={() => setView(view === 'months' ? 'days' : 'months')}
                    aria-label={`Month: ${MONTHS[shown.month]}`}
                    className={headerButton}
                    data-testid={`${testId}-month`}
                  >
                    {MONTHS[shown.month]}
                    <ChevronDown size={11} className={`transition-transform ${view === 'months' ? 'rotate-180' : ''}`} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setYearPage(pageOf(shown.year));
                    setView(view === 'years' ? 'days' : 'years');
                  }}
                  aria-label={view === 'years' ? 'Back to the days' : `Year: ${shown.year}`}
                  className={headerButton}
                  data-testid={`${testId}-year`}
                >
                  {view === 'years' ? `${years[0]} – ${years[years.length - 1]}` : shown.year}
                  <ChevronDown size={11} className={`transition-transform ${view === 'years' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <button type="button" onClick={next.go} disabled={next.disabled} aria-label={next.label} className={arrowButton}>
                <ChevronRight size={13} />
              </button>
            </div>

            {view === 'years' && (
              <div className="grid grid-cols-4 gap-1" data-testid={`${testId}-years`}>
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    disabled={year < firstYear}
                    onClick={() => {
                      setShown({ year, month: shown.month });
                      setView('months');
                    }}
                    className={`h-7 ${cell(chosen?.year === year, year < firstYear)}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}

            {view === 'months' && (
              <div className="grid grid-cols-3 gap-1" data-testid={`${testId}-months`}>
                {MONTHS.map((name, month) => {
                  const disabled = !monthAllowed(shown.year, month);
                  return (
                    <button
                      key={name}
                      type="button"
                      disabled={disabled}
                      aria-label={`${name} ${shown.year}`}
                      onClick={() => {
                        setShown({ year: shown.year, month });
                        setView('days');
                      }}
                      className={`h-8 ${cell(chosen?.year === shown.year && chosen?.month === month, disabled)}`}
                    >
                      {name.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            )}

            {view === 'days' && (
              <div onKeyDown={onGridKey} role="grid" aria-label={`${MONTHS[shown.month]} ${shown.year}`} data-testid={`${testId}-days`}>
                <div className="grid grid-cols-7 mb-0.5" role="row">
                  {WEEKDAYS.map((day) => (
                    <span key={day} role="columnheader" className="text-center text-[9px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 py-0.5">
                      {day}
                    </span>
                  ))}
                </div>
                {weeks.map((week, row) => (
                  <div key={row} className="grid grid-cols-7 gap-0.5" role="row">
                    {week.map((day, column) => {
                      if (day === null) return <span key={column} role="gridcell" />;
                      const iso = isoOf(shown.year, shown.month, day);
                      const disabled = !allowed(iso);
                      const selected = value === iso;
                      return (
                        <span key={column} role="gridcell">
                          <button
                            type="button"
                            data-day={iso}
                            disabled={disabled}
                            onClick={() => pick(iso)}
                            aria-label={longDateOf(iso)}
                            aria-pressed={selected}
                            tabIndex={day === tabDay ? 0 : -1}
                            className={`w-full h-7 ${cell(selected, disabled)} ${iso === today && !selected ? 'ring-1 ring-sky-400' : ''}`}
                          >
                            {day}
                          </button>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[10px]">
              <span className="text-slate-500 dark:text-slate-400" data-testid={`${testId}-summary`}>
                {chosen
                  ? `${longDateOf(value)}${Number.isFinite(age) ? ` · ${age} years old` : ''}`
                  : view === 'years'
                    ? 'Pick the year you were born'
                    : view === 'months'
                      ? 'Now the month'
                      : 'And the day'}
              </span>
              {text && (
                <button type="button" onClick={clear} className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 cursor-pointer">
                  <X size={10} /> Clear
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
