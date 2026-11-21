import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Scissors, Sparkles, X } from 'lucide-react';
import ReelPlayer from '../../highlights/ReelPlayer';
import { SourcePlayer } from '../highlights/ClipEditor';
import { fetchLessonHighlights } from '../../../services/highlightsApi';
import { formatClock } from '../../../utils/watchTime';
import { parseClock } from '../../../utils/youtubeLink';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '../courses/fields';
import { partTimeProblem } from './roadmapDrafts';

const INPUT =
  'w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40';
const LABEL = 'block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1';

const clockOrBlank = (value) => (value === null || value === undefined || value === '' ? '' : formatClock(value));

/**
 * One part of a roadmap: the stretch of a lesson video students watch (never the whole video), with the
 * summary and key points shown beside it. Saving without times or a summary keeps it unfinished.
 */
export default function PartEditor({ lesson, part, dayNumber, onSave, onClose }) {
  const source = useRef(null);
  const [now, setNow] = useState(0);
  const [duration, setDuration] = useState(0);
  const [form, setForm] = useState(() => ({
    start: clockOrBlank(part.start),
    end: clockOrBlank(part.end),
    summary: part.summary || '',
    points: (part.points || []).join('\n'),
  }));
  const [previewing, setPreviewing] = useState(false);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // The video's length, once its player knows it: a part may not be the whole video
  useEffect(() => {
    const timer = setInterval(() => {
      const length = source.current?.duration?.() || 0;
      if (length > 0) {
        setDuration(length);
        clearInterval(timer);
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Highlights already cut from this video can fill the part in
  useEffect(() => {
    let live = true;
    const media = lesson?.media;
    fetchLessonHighlights(media?.kind === 'youtube' ? { youtubeId: media.youtubeId } : { videoId: lesson?.lesson?.videoId || '' })
      .then((data) => live && setHighlights(data.highlights || []))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [lesson]);

  const start = parseClock(form.start);
  const end = parseClock(form.end);
  const startValue = form.start.trim() === '' ? null : start;
  const endValue = form.end.trim() === '' ? null : end;
  const badClock = (form.start.trim() && Number.isNaN(start)) || (form.end.trim() && Number.isNaN(end));
  const timeProblem = badClock ? 'Write times like 2:05 or 1:02:05.' : partTimeProblem(startValue, endValue, duration);
  const timesSet = startValue !== null && endValue !== null && !timeProblem;
  const points = form.points.split('\n').map((line) => line.trim()).filter(Boolean);
  const pointsProblem = points.length > 8 ? 'Up to 8 key points.' : '';
  const isFinished = timesSet && form.summary.trim() !== '';

  const set = (changes) => setForm((previous) => ({ ...previous, ...changes }));
  const markStart = () => set({ start: formatClock(source.current?.time() || 0) });
  const markEnd = () => set({ end: formatClock(source.current?.time() || 0) });

  const fillFromHighlight = (clip) => {
    set({
      start: formatClock(clip.start),
      end: formatClock(clip.end),
      summary: form.summary.trim() ? form.summary : clip.summary || '',
      points: form.points.trim() ? form.points : (clip.points || []).join('\n'),
    });
    setPreviewing(false);
  };

  const save = () =>
    onSave({
      start: timesSet ? start : null,
      end: timesSet ? end : null,
      summary: form.summary.trim(),
      points,
    });

  const clip = timesSet ? { _id: 'part-preview', title: lesson.label, start, end, media: lesson.media } : null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start sm:items-center justify-center p-2 sm:p-6 bg-slate-950/60 overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Part of ${lesson.label}`}
        data-testid="part-editor"
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl my-auto"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Day {dayNumber} · {[lesson.chapterNumber && `Ch ${lesson.chapterNumber}`, lesson.chapterName].filter(Boolean).join(' · ')}
            </p>
            <h3 className="text-base font-black text-slate-900 dark:text-white truncate">{lesson.label}</h3>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {previewing && clip ? (
            <div>
              <ReelPlayer clips={[clip]} title={lesson.label} autoPlay />
              <button type="button" onClick={() => setPreviewing(false)} className={`${SECONDARY_BUTTON} mt-2`}>
                Back to the whole video
              </button>
            </div>
          ) : (
            <>
              <SourcePlayer ref={source} media={lesson.media} onTime={setNow} />
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span data-testid="part-now">Now at {formatClock(now)}</span>
                {duration > 0 && <span>· Video {formatClock(duration)}</span>}
                <span className="flex-1" />
                <button type="button" onClick={markStart} className={SECONDARY_BUTTON} data-testid="part-set-start">
                  <Scissors size={13} /> Set start
                </button>
                <button type="button" onClick={markEnd} className={SECONDARY_BUTTON} data-testid="part-set-end">
                  <Scissors size={13} className="rotate-180" /> Set end
                </button>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <label>
              <span className={LABEL}>Start</span>
              <input value={form.start} onChange={(event) => set({ start: event.target.value })} placeholder="2:00" aria-label="Start" className={INPUT} data-testid="part-start" />
            </label>
            <label>
              <span className={LABEL}>End</span>
              <input value={form.end} onChange={(event) => set({ end: event.target.value })} placeholder="2:30" aria-label="End" className={INPUT} data-testid="part-end" />
            </label>
            <button type="button" disabled={!timesSet} onClick={() => setPreviewing(true)} className={`${SECONDARY_BUTTON} col-span-2 sm:col-span-1`}>
              <Eye size={14} /> Preview part
            </button>
          </div>
          <p className={`text-xs ${timeProblem ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`} data-testid="part-time-note" role={timeProblem ? 'alert' : undefined}>
            {timeProblem ||
              (timesSet
                ? `Students watch ${formatClock(start)} to ${formatClock(end)} only (${Math.round(end - start)} sec), not the whole video.`
                : 'Play the video and press Set start and Set end, or type the times. Only this part plays for students.')}
          </p>

          {highlights.length > 0 && (
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3">
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} /> Highlights of this video
              </p>
              <div className="flex flex-wrap gap-1.5">
                {highlights.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => fillFromHighlight(item)}
                    className="text-left px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-xs text-slate-800 dark:text-slate-100 hover:border-amber-400 cursor-pointer"
                  >
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-slate-500"> · {formatClock(item.start)}–{formatClock(item.end)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="block">
            <span className={LABEL}>Summary *</span>
            <textarea
              rows={3}
              value={form.summary}
              onChange={(event) => set({ summary: event.target.value })}
              placeholder="What the student should take from this part, in two or three sentences."
              aria-label="Summary"
              data-testid="part-summary"
              maxLength={800}
              className={INPUT}
            />
          </label>
          <label className="block">
            <span className={LABEL}>Key points (one per line, up to 8)</span>
            <textarea
              rows={3}
              value={form.points}
              onChange={(event) => set({ points: event.target.value })}
              placeholder={'(a, b) is not (b, a)\nA × B has n(A) × n(B) pairs'}
              aria-label="Key points"
              data-testid="part-points"
              className={INPUT}
            />
            {pointsProblem && <span className="block mt-1 text-xs font-semibold text-rose-600">{pointsProblem}</span>}
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 dark:border-slate-800">
          <span className={`text-xs ${isFinished ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
            {isFinished ? 'Ready: students will see this part.' : 'Not finished: students see it once it has its times and a summary.'}
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>Cancel</button>
            <button type="button" onClick={save} disabled={Boolean(timeProblem) || Boolean(pointsProblem)} className={PRIMARY_BUTTON} data-testid="part-save">
              Save part
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
