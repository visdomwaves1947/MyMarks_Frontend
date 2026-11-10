import React from 'react';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Text with the searched words marked: each word of the text that starts with a searched word,
 * so a search for "trig" marks "Trigonometry".
 */
export default function Marked({ text, words = [] }) {
  const value = String(text ?? '');
  const parts = words.filter(Boolean).map(escapeRegex);
  if (!value || parts.length === 0) return value;

  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])((?:${parts.join('|')})[\\p{L}\\p{N}]*)`, 'giu');
  const pieces = [];
  let last = 0;
  let match;
  while ((match = pattern.exec(value)) !== null) {
    const start = match.index + match[1].length;
    if (start > last) pieces.push(value.slice(last, start));
    pieces.push(
      <mark key={start} className="bg-amber-200/80 dark:bg-amber-400/30 text-inherit rounded px-0.5">
        {match[2]}
      </mark>
    );
    last = start + match[2].length;
    if (match[0].length === 0) pattern.lastIndex += 1;
  }
  if (last < value.length) pieces.push(value.slice(last));
  return pieces;
}
