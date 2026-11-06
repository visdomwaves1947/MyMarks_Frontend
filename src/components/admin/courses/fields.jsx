import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-react';

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

const problemChip = (text) => (
  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
    {text}
  </span>
);

/**
 * A panel the admin opens when they want to change it. It starts closed, so a long page stays short,
 * and its header still shows a summary and how many problems it has.
 */
export function CollapsiblePanel({ title, summary, problemCount = 0, defaultOpen = false, testId, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div data-testid={testId} className={`${PANEL_STYLE} !p-0 overflow-hidden`}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 text-left cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-slate-900 dark:text-white">{title}</span>
          {summary && <span className="block mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{summary}</span>}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {problemCount > 0 && problemChip(problemCount === 1 ? '1 problem' : `${problemCount} problems`)}
          <span className="hidden sm:inline text-[11px] font-medium text-blue-700 dark:text-blue-400">
            {isOpen ? 'Close' : 'Open to edit'}
          </span>
          <ChevronDown size={18} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-4 space-y-3 border-t border-slate-100 dark:border-slate-800">{children}</div>
      )}
    </div>
  );
}

/**
 * A list the admin can add to, reorder and remove from.
 * With collapsible, each item shows only its title until it is opened, and a new item opens by itself.
 * itemProblem(item) can return a short message, shown on the item even while it is closed.
 */
export function RepeatList({ items = [], onChange, blank, addLabel, itemTitle, renderItem, collapsible = false, itemProblem }) {
  const [openItems, setOpenItems] = useState(() => new Set());
  const isOpen = (index) => !collapsible || openItems.has(index);

  const updateItem = (index, value) =>
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...value } : item)));

  const toggle = (index) =>
    setOpenItems((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  // Open items stay open when they move or when an item above them is removed
  const move = (index, direction) => {
    const target = index + direction;
    onChange(moveItem(items, index, direction));
    setOpenItems((previous) => {
      const next = new Set(previous);
      next.delete(index);
      next.delete(target);
      if (previous.has(index)) next.add(target);
      if (previous.has(target)) next.add(index);
      return next;
    });
  };

  const remove = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
    setOpenItems(
      (previous) =>
        new Set([...previous].filter((open) => open !== index).map((open) => (open > index ? open - 1 : open)))
    );
  };

  const add = () => {
    onChange([...items, { ...blank }]);
    setOpenItems((previous) => new Set(previous).add(items.length));
  };

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => {
        const title = `${index + 1}. ${itemTitle ? itemTitle(item) : ''}`;
        const problem = itemProblem ? itemProblem(item) : '';

        return (
          <div
            key={index}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
          >
            <div className={`flex items-center justify-between gap-2 ${isOpen(index) ? 'mb-2' : ''}`}>
              {collapsible ? (
                <button
                  type="button"
                  aria-expanded={isOpen(index)}
                  onClick={() => toggle(index)}
                  className="flex-1 min-w-0 flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <ChevronDown
                    size={14}
                    className={`shrink-0 text-slate-400 transition-transform ${isOpen(index) ? 'rotate-180' : ''}`}
                  />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate">{title}</span>
                  {problem && problemChip(problem)}
                </button>
              ) : (
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">{title}</span>
              )}
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className={ICON_BUTTON}
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                  className={ICON_BUTTON}
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => remove(index)}
                  className={`${ICON_BUTTON} hover:!text-rose-500`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {isOpen(index) && renderItem(item, (value) => updateItem(index, value))}
          </div>
        );
      })}

      <button type="button" onClick={add} className={SECONDARY_BUTTON}>
        <Plus size={14} />
        <span>{addLabel}</span>
      </button>
    </div>
  );
}
