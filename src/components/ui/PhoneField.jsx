import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';
import { COUNTRIES, INDIA, flagSrc } from '../../data/countryCodes';
import { parsePhone, phoneValue } from '../../utils/phone';

const MAX_DIGITS = { india: 10, other: 13 };

const Flag = ({ code, className = '' }) => (
  <img src={flagSrc(code)} alt="" width="22" height="16" className={`w-[22px] h-[15px] object-cover rounded-[3px] shrink-0 ring-1 ring-black/10 ${className}`} />
);

// How well a country fits the search (lower is better), or -1: its code or another name exactly
// ("UK", "USA", "AE") first, then names that start with it, then a word that does, then the rest
const rank = (country, query) => {
  const q = query.toLowerCase().replace(/^\+/, '');
  const name = country.name.toLowerCase();
  const also = (country.also || []).map((other) => other.toLowerCase());
  if (/^\d+$/.test(q)) return country.dial.slice(1) === q ? 0 : country.dial.slice(1).startsWith(q) ? 1 : -1;
  if (country.code.toLowerCase() === q || also.includes(q)) return 0;
  if (name.startsWith(q)) return 1;
  if (name.split(/[\s(),'-]+/).some((word) => word.startsWith(q)) || also.some((other) => other.startsWith(q))) return 2;
  return name.includes(q) || also.some((other) => other.includes(q)) ? 3 : -1;
};

/**
 * A mobile number with a country code picker, like the mobile app's country_code_picker: India is
 * chosen to begin with; the list searches by country name or code. The value given to onChange is
 * what the server keeps: an Indian number as 10 digits, any other as +code and number (+971501234567).
 */
export default function PhoneField({
  value,
  onChange,
  placeholder = 'Mobile number',
  inputClassName = '',
  buttonClassName = '',
  className = '',
  ariaLabel = 'Mobile number',
  disabled = false,
  invalid = false,
  inputProps = {},
}) {
  const [country, setCountry] = useState(() => parsePhone(value).country);
  const [number, setNumber] = useState(() => parsePhone(value).number);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [place, setPlace] = useState(null);
  const button = useRef(null);
  const panel = useRef(null);
  const search = useRef(null);
  const listId = useId();

  // A number set from outside (filled in from the account, or cleared) is read again
  useEffect(() => {
    if ((value || '') !== phoneValue(country, number)) {
      const parsed = parsePhone(value);
      setCountry(parsed.country);
      setNumber(parsed.number);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const send = (nextCountry, nextNumber) => {
    setCountry(nextCountry);
    setNumber(nextNumber);
    onChange?.(phoneValue(nextCountry, nextNumber));
  };

  const max = country.code === INDIA.code ? MAX_DIGITS.india : MAX_DIGITS.other;
  const typed = (event) => {
    const raw = event.target.value;
    // A whole number pasted with its code, such as +971 50 123 4567, picks the country too
    if (raw.trim().startsWith('+')) {
      const parsed = parsePhone(raw);
      send(parsed.country, parsed.number.slice(0, parsed.country.code === INDIA.code ? MAX_DIGITS.india : MAX_DIGITS.other));
      return;
    }
    send(country, raw.replace(/\D/g, '').slice(0, max));
  };

  // India first, then every country by name; a search lists the best fits first
  const options = useMemo(() => {
    const q = query.trim();
    if (!q) return [INDIA, ...COUNTRIES.filter((c) => c.code !== INDIA.code)];
    return COUNTRIES.map((country) => [country, rank(country, q)])
      .filter(([, score]) => score >= 0)
      .sort((a, b) => a[1] - b[1] || a[0].name.localeCompare(b[0].name))
      .map(([country]) => country);
  }, [query]);

  // The list sits on top of everything (forms in windows scroll and clip), under the button or above it
  const measure = () => {
    const box = button.current?.getBoundingClientRect();
    if (!box) return;
    const width = Math.min(320, window.innerWidth - 16);
    const left = Math.max(8, Math.min(box.left, window.innerWidth - width - 8));
    const below = window.innerHeight - box.bottom;
    const height = Math.min(340, Math.max(below, box.top) - 16);
    setPlace(below >= 260 || below >= box.top ? { left, width, top: box.bottom + 6, height } : { left, width, bottom: window.innerHeight - box.top + 6, height });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    measure();
    const close = (event) => {
      if (panel.current?.contains(event.target) || button.current?.contains(event.target)) return;
      setOpen(false);
    };
    const keep = () => measure();
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    window.addEventListener('resize', keep);
    window.addEventListener('scroll', keep, true);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
      window.removeEventListener('resize', keep);
      window.removeEventListener('scroll', keep, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => search.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const choose = (picked) => {
    send(picked, number.slice(0, picked.code === INDIA.code ? MAX_DIGITS.india : MAX_DIGITS.other));
    setOpen(false);
    button.current?.focus();
  };

  const onListKey = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (options[active]) choose(options[active]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      button.current?.focus();
    }
  };

  return (
    <div className={`flex items-stretch gap-1.5 ${className}`} data-testid="phone-field">
      <button
        ref={button}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((shown) => !shown)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${country.name} ${country.dial}`}
        title={`${country.name} ${country.dial}`}
        data-testid="phone-country"
        className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 rounded-xl border bg-white text-slate-800 border-slate-300 hover:border-sky-400 dark:bg-slate-900/70 dark:text-slate-100 dark:border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer disabled:opacity-60 ${
          invalid ? 'border-rose-400 dark:border-rose-500' : ''
        } ${buttonClassName}`}
      >
        <Flag code={country.code} />
        <span data-testid="phone-dial">{country.dial}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={number}
        onChange={typed}
        placeholder={country.code === INDIA.code ? placeholder : 'Mobile number'}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        className={`min-w-0 flex-1 ${inputClassName}`}
        {...inputProps}
      />
      {open &&
        place &&
        createPortal(
          <div
            ref={panel}
            onKeyDown={onListKey}
            style={{ position: 'fixed', left: place.left, width: place.width, top: place.top, bottom: place.bottom, maxHeight: place.height }}
            className="z-[1000] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden text-left"
            data-testid="phone-country-list"
          >
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={search}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  placeholder="Search country or code"
                  aria-label="Search country or code"
                  aria-controls={listId}
                  className="w-full pl-8 pr-2 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>
            <ul id={listId} role="listbox" aria-label="Countries" className="overflow-y-auto py-1">
              {options.length === 0 && <li className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">No country found</li>}
              {options.map((option, index) => {
                const selected = option.code === country.code;
                return (
                  <li
                    key={`${option.code}-${index}`}
                    role="option"
                    aria-selected={selected}
                    data-index={index}
                    data-testid="phone-country-option"
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(option)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer ${
                      index === active ? 'bg-sky-50 dark:bg-slate-800' : ''
                    } ${!query.trim() && index === 0 ? 'border-b border-slate-100 dark:border-slate-800 mb-1' : ''}`}
                  >
                    <Flag code={option.code} />
                    <span className="flex-1 truncate text-slate-800 dark:text-slate-100">{option.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums">{option.dial}</span>
                    {selected && <Check size={14} className="text-sky-600 dark:text-sky-400" />}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
