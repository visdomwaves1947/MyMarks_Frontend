import React from 'react';
import { Link } from 'react-router-dom';
import { parseClock } from '../../utils/youtubeLink';

const TIME = /\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g;

// The times written in a note, such as [0:55] and [1:02:05], in order
export function timesIn(text) {
  return [...String(text || '').matchAll(TIME)].map((match) => ({ label: match[1], seconds: parseClock(match[1]) }));
}

/**
 * A note as text, with its [0:55] times as buttons (onTime) or links (linkFor) to that moment of the video.
 */
export default function NoteText({ text, onTime, linkFor, className = '' }) {
  const value = String(text || '');
  const pieces = [];
  let last = 0;
  for (const match of value.matchAll(TIME)) {
    if (match.index > last) pieces.push(value.slice(last, match.index));
    const seconds = parseClock(match[1]);
    const label = `Play from ${match[1]}`;
    const style =
      'inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 font-mono text-[0.85em] font-bold hover:bg-blue-100 cursor-pointer';
    if (linkFor) {
      pieces.push(
        <Link key={match.index} to={linkFor(seconds)} data-testid="note-time" aria-label={label} className={style}>
          {match[1]}
        </Link>
      );
    } else if (onTime) {
      pieces.push(
        <button key={match.index} type="button" data-testid="note-time" aria-label={label} onClick={() => onTime(seconds)} className={style}>
          {match[1]}
        </button>
      );
    } else {
      pieces.push(match[0]);
    }
    last = match.index + match[0].length;
  }
  if (last < value.length) pieces.push(value.slice(last));
  return <div className={`whitespace-pre-wrap break-words ${className}`}>{pieces}</div>;
}
