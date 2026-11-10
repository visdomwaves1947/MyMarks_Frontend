import React, { useEffect, useState } from 'react';
import { Pause, Play, Scissors } from 'lucide-react';
import { fetchLessonHighlights } from '../../services/highlightsApi';
import { formatClock } from '../../utils/watchTime';
import SaveHighlightButton from '../highlights/SaveHighlightButton';

/**
 * Under a lesson video: its highlights, such as 2:00–2:20 "What is trigonometry".
 * Play runs only that part in the lesson player above. Nothing shows when the lesson has none.
 */
export default function LessonHighlights({ lesson, playingId = '', onPlay, onFull, player, currentUser = null, onOpenSignIn }) {
  const videoId = lesson?.videoId || '';
  const youtubeId = lesson?.youtubeId || '';
  const [state, setState] = useState({ key: '', highlights: [] });
  const key = `${videoId}|${youtubeId}`;

  useEffect(() => {
    if (!videoId && !youtubeId) return undefined;
    let live = true;
    fetchLessonHighlights({ videoId, youtubeId })
      .then((data) => live && setState({ key, highlights: data.highlights || [] }))
      .catch(() => live && setState({ key, highlights: [] }));
    return () => {
      live = false;
    };
  }, [key, videoId, youtubeId]);

  const highlights = state.key === key ? state.highlights : [];
  if (highlights.length === 0) return null;

  return (
    <section
      data-testid="lesson-highlights"
      aria-label="Highlights in this lesson"
      className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900/90 dark:border-slate-800/80 shadow-md"
    >
      <div className={`flex items-center gap-2 ${player.text} font-extrabold text-xs uppercase tracking-wider mb-3`}>
        <Scissors size={14} />
        <span>Highlights in this lesson ({highlights.length})</span>
      </div>
      <ol className="space-y-2">
        {highlights.map((clip) => {
          const playing = playingId === String(clip._id);
          return (
            <li
              key={clip._id}
              data-testid="lesson-highlight"
              data-playing={playing ? 'true' : 'false'}
              className={`rounded-xl border p-3 transition-colors ${
                playing
                  ? 'border-blue-300 bg-blue-50/70 dark:border-blue-800 dark:bg-blue-950/30'
                  : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="px-2 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-700 font-mono text-[11px] font-bold shrink-0">
                  {formatClock(clip.start)}–{formatClock(clip.end)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{clip.title}</p>
                  {clip.summary && <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{clip.summary}</p>}
                  {clip.points.length > 0 && (
                    <ul className="mt-1 list-disc pl-4 text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                      {clip.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-start gap-1.5 shrink-0">
                <SaveHighlightButton highlight={clip} currentUser={currentUser} onOpenSignIn={onOpenSignIn} />
                {playing ? (
                  <button
                    type="button"
                    onClick={onFull}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Pause size={12} />
                    <span>Playing</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    data-testid="lesson-highlight-play"
                    onClick={() => onPlay(clip, highlights)}
                    aria-label={`Play ${clip.title}, ${formatClock(clip.start)} to ${formatClock(clip.end)}`}
                    className={`px-3 py-1.5 rounded-lg ${player.solid} text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer`}
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Play</span>
                  </button>
                )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
