import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

export const INPUT_STYLE =
  'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium focus:bg-white dark:focus:bg-slate-950';

export const PRIMARY_BUTTON =
  'px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

export const SECONDARY_BUTTON =
  'px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

export const ICON_BUTTON =
  'p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed';

export const PANEL_STYLE =
  'p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 shadow-sm dark:shadow-none';

// An error shows in place of the hint
export function Field({ label, hint, error, required, children }) {
  return (
    <div>
      <label className="block">
        <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </span>
        {children}
      </label>
      {error ? (
        <p className="mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">{error}</p>
      ) : (
        hint && <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  );
}

export function TextInput({ label, hint, error, required, value, onChange, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <input
        type="text"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        className={`${INPUT_STYLE}${error ? ' !border-rose-400 dark:!border-rose-700' : ''}`}
        {...props}
      />
    </Field>
  );
}

export function TextArea({ label, hint, error, required, value, onChange, rows = 3, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <textarea
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        className={`${INPUT_STYLE}${error ? ' !border-rose-400 dark:!border-rose-700' : ''}`}
        {...props}
      />
    </Field>
  );
}

// One item per line, because items can contain commas
export function LinesField({ label, hint = 'One per line.', rows = 4, value, onChange }) {
  return (
    <TextArea
      label={label}
      hint={hint}
      rows={rows}
      value={(value || []).join('\n')}
      onChange={(text) => onChange(text.split('\n'))}
    />
  );
}

export function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 w-4 h-4 rounded accent-blue-600 cursor-pointer shrink-0"
      />
      <span className="min-w-0">
        <span className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{label}</span>
        {hint && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{hint}</span>}
      </span>
    </label>
  );
}

export function CheckboxGroup({ label, hint, options, selected, onChange }) {
  const toggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(next);
  };

  return (
    <div>
      <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isOn = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isOn}
              onClick={() => toggle(option.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isOn
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {hint && <span className="block mt-1 text-[11px] text-slate-500 dark:text-slate-400">{hint}</span>}
    </div>
  );
}

export const moveItem = (list, index, direction) => {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};

/**
 * A list the admin can add to, reorder and remove from
 */
export function RepeatList({ items = [], onChange, blank, addLabel, itemTitle, renderItem }) {
  const updateItem = (index, value) =>
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...value } : item)));

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div
          key={index}
          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {index + 1}. {itemTitle ? itemTitle(item) : ''}
            </span>
            <div className="flex items-center shrink-0">
              <button
                type="button"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => onChange(moveItem(items, index, -1))}
                className={ICON_BUTTON}
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={index === items.length - 1}
                onClick={() => onChange(moveItem(items, index, 1))}
                className={ICON_BUTTON}
              >
                <ArrowDown size={14} />
              </button>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className={`${ICON_BUTTON} hover:!text-rose-500`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {renderItem(item, (value) => updateItem(index, value))}
        </div>
      ))}

      <button type="button" onClick={() => onChange([...items, { ...blank }])} className={SECONDARY_BUTTON}>
        <Plus size={14} />
        <span>{addLabel}</span>
      </button>
    </div>
  );
}
