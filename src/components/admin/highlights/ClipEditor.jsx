import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Scissors, X } from 'lucide-react';
import ReelPlayer from '../../highlights/ReelPlayer';
import { createHighlight, fetchAdminHighlights, updateHighlight } from '../../../services/highlightsApi';
import { loadYouTubeApi } from '../../../utils/youtubeApi';
import { formatClock } from '../../../utils/watchTime';
import { mediaOfVideo, parseClock } from '../../../utils/youtubeLink';

const YOUTUBE_HOST = 'https://www.youtube-nocookie.com';
const MAX_SECONDS = 180;
const INPUT =
  'w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40';
const LABEL = 'block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1';

// The whole lesson video with its own controls, to find where the highlight starts and ends
const SourcePlayer = forwardRef(function SourcePlayer({ media, onTime }, ref) {
  const box = useRef(null);
  const player = useRef(null);
  const file = useRef(null);
  const timeRef = useRef(onTime);
  useEffect(() => {
    timeRef.current = onTime;
  });

  useImperativeHandle(
    ref,
    () => ({
      time: () =>
        media.kind === 'youtube' ? Number(player.current?.getCurrentTime?.()) || 0 : Number(file.current?.currentTime) || 0,
      seek: (seconds) => {
        if (media.kind === 'youtube') player.current?.seekTo?.(seconds, true);
        else if (file.current) file.current.currentTime = seconds;
      },
    }),
    [media]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now =
        media.kind === 'youtube' ? Number(player.current?.getCurrentTime?.()) : Number(file.current?.currentTime);
      if (Number.isFinite(now)) timeRef.current?.(now);
    }, 250);
    if (media.kind !== 'youtube') return () => clearInterval(timer);

    let stopped = false;
    // YouTube swaps this element for its player, so React keeps out of it
    const mount = document.createElement('div');
    box.current?.appendChild(mount);
    loadYouTubeApi()
      .then((YT) => {
        if (stopped) return;
        player.current = new YT.Player(mount, {
          host: YOUTUBE_HOST,
          width: '100%',
          height: '100%',
          videoId: media.youtubeId,
          playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        });
      })
      .catch(() => {});
    const holder = box.current;
    return () => {
      stopped = true;
      clearInterval(timer);
      try {
        player.current?.destroy?.();
      } catch {
        // Already gone
      }
      player.current = null;
      if (holder) holder.innerHTML = '';
    };
  }, [media]);

  if (media.kind === 'youtube') {
    return <div ref={box} data-testid="clip-source" className="aspect-video w-full rounded-2xl overflow-hidden bg-black [&>*]:w-full [&>*]:h-full" />;
  }
  return (
    <video
      ref={file}
      data-testid="clip-source"
      src={media.url}
      controls
      playsInline
      className="aspect-video w-full rounded-2xl bg-black object-contain"
    />
  );
});

/**
 * Add to highlights: cut a part of a lesson video (for example 2:00 to 2:12) and put it in reels of its subject.
 * Opened with a video, and with a highlight when editing one.
 */
export default function ClipEditor({ video, clip = null, onClose, onSaved }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const media = useMemo(() => mediaOfVideo(video), [video?._id, video?.url, video?.youtubeId]);
  const source = useRef(null);
  const [now, setNow] = useState(0);
  const [form, setForm] = useState(() => ({
    start: clip ? formatClock(clip.start) : '',
    end: clip ? formatClock(clip.end) : '',
    title: clip?.title || '',
    summary: clip?.summary || '',
    points: (clip?.points || []).join('\n'),
    keywords: (clip?.keywords || []).join(', '),
    freePreview: Boolean(clip?.freePreview),
  }));
  const [reels, setReels] = useState([]);
  const [chosen, setChosen] = useState(() => new Set((clip?.reels || []).map((reel) => String(reel._id))));
  const [newReel, setNewReel] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!video?.subject) return;
    fetchAdminHighlights(video.subject)
      .then((data) => setReels(data.reels || []))
      .catch(() => setReels([]));
  }, [video?.subject]);

  const set = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const start = parseClock(form.start);
  const end = parseClock(form.end);
  const length = Number.isFinite(start) && Number.isFinite(end) ? end - start : NaN;
  let timeProblem = '';
  if (form.start && !Number.isFinite(start)) timeProblem = 'Type the start as minutes and seconds, such as 2:00.';
  else if (form.end && !Number.isFinite(end)) timeProblem = 'Type the end as minutes and seconds, such as 2:12.';
  else if (Number.isFinite(length) && length <= 0) timeProblem = 'The end must come after the start.';
  else if (Number.isFinite(length) && length > MAX_SECONDS) timeProblem = 'A highlight can be at most 3 minutes long.';
  const timesReady = Number.isFinite(length) && !timeProblem;

  const markStart = () => setForm((previous) => ({ ...previous, start: formatClock(source.current?.time() || 0) }));
  const markEnd = () => setForm((previous) => ({ ...previous, end: formatClock(source.current?.time() || 0) }));
  const toggleReel = (id) =>
    setChosen((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const save = async (event) => {
    event.preventDefault();
    // Opened from inside the video's edit form: saving a highlight must not also save and close that form
    event.stopPropagation();
    if (!form.title.trim()) return setError('Give the highlight a title, such as "What is trigonometry".');
    if (!timesReady) return setError(timeProblem || 'Set where the highlight starts and ends.');
    setSaving(true);
    setError('');
    const body = {
      start: form.start,
      end: form.end,
      title: form.title.trim(),
      summary: form.summary,
      points: form.points.split('\n'),
      keywords: form.keywords,
      freePreview: form.freePreview,
      reelIds: [...chosen],
      ...(newReel.trim() ? { newReel: { name: newReel.trim() } } : {}),
    };
    try {
      const data = clip ? await updateHighlight(clip._id, body) : await createHighlight({ videoId: video._id, ...body });
      const reelCount = chosen.size + (newReel.trim() ? 1 : 0);
      onSaved?.({
        data,
        message: `Saved "${body.title}"${reelCount ? ` in ${reelCount} ${reelCount === 1 ? 'reel' : 'reels'}` : ''}`,
      });
    } catch (problem) {
      setError(problem.message || 'Could not save the highlight.');
      setSaving(false);
    }
  };

  let content;
  if (!media) {
    content = <p className="text-sm text-slate-600 dark:text-slate-300">Highlights can be taken from YouTube videos and uploaded videos only.</p>;
  } else if (!video.subject) {
    content = <p className="text-sm text-slate-600 dark:text-slate-300">Give this video a subject first, so its highlight belongs to that subject.</p>;
  } else {
    const previewClip = { _id: 'preview', title: form.title || 'Highlight', start, end, media, chapter: { number: video.chapterNumber } };
    content = (
      <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-3">
          {previewing && timesReady ? (
            <ReelPlayer clips={[previewClip]} title={`Preview: ${form.title || 'Highlight'}`} autoPlay />
          ) : (
            <SourcePlayer ref={source} media={media} onTime={setNow} />
          )}
          <div className="flex flex-wrap items-center gap-2">
            {!previewing && (
              <>
                <span data-testid="clip-now" className="text-xs font-mono text-slate-600 dark:text-slate-300 mr-1">
                  Now at {formatClock(now)}
                </span>
                <button type="button" data-testid="clip-set-start" onClick={markStart} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer">
                  Set start
                </button>
                <button type="button" data-testid="clip-set-end" onClick={markEnd} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold cursor-pointer">
                  Set end
                </button>
              </>
            )}
            <button
              type="button"
              data-testid="clip-preview"
              disabled={!timesReady}
              onClick={() => setPreviewing((value) => !value)}
              className="ml-auto px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 disabled:opacity-50 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} />
              <span>{previewing ? 'Back to the full video' : 'Preview highlight'}</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <label className="block">
              <span className={LABEL}>Start</span>
              <input data-testid="clip-start" value={form.start} onChange={set('start')} placeholder="2:00" className={INPUT} />
            </label>
            <label className="block">
              <span className={LABEL}>End</span>
              <input data-testid="clip-end" value={form.end} onChange={set('end')} placeholder="2:12" className={INPUT} />
            </label>
            <p data-testid="clip-length" className="pb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {timesReady ? `Length ${formatClock(length)}` : ''}
            </p>
          </div>
          {timeProblem && <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{timeProblem}</p>}
        </div>

        <div className="lg:col-span-2 space-y-3">
          <label className="block">
            <span className={LABEL}>Title</span>
            <input data-testid="clip-title" value={form.title} onChange={set('title')} maxLength={120} placeholder="What is trigonometry" className={INPUT} />
          </label>
          <label className="block">
            <span className={LABEL}>Summary</span>
            <textarea value={form.summary} onChange={set('summary')} maxLength={600} rows={2} placeholder="One or two lines on what this part explains" className={INPUT} />
          </label>
          <label className="block">
            <span className={LABEL}>Key points (one per line)</span>
            <textarea value={form.points} onChange={set('points')} rows={3} placeholder={'Sine, cosine and tangent\nThey are ratios of sides'} className={INPUT} />
          </label>
          <label className="block">
            <span className={LABEL}>Search words (comma between)</span>
            <input value={form.keywords} onChange={set('keywords')} placeholder="trigonometry, sin, cos" className={INPUT} />
          </label>

          <fieldset className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-2">
            <legend className="px-1 text-xs font-bold text-slate-700 dark:text-slate-200">Add to {video.subject} reels</legend>
            {reels.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No reels in {video.subject} yet. Name a new one below.</p>}
            {reels.map((reel) => (
              <label key={reel._id} data-testid="reel-option" className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-100 cursor-pointer">
                <input type="checkbox" checked={chosen.has(String(reel._id))} onChange={() => toggleReel(String(reel._id))} />
                <span className="font-semibold">{reel.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {reel.clipCount} {reel.clipCount === 1 ? 'part' : 'parts'} · {formatClock(reel.duration)}
                </span>
              </label>
            ))}
            <input
              data-testid="clip-new-reel"
              value={newReel}
              onChange={(event) => setNewReel(event.target.value)}
              maxLength={80}
              placeholder="New reel name, such as Trigonometry in 40 seconds"
              className={INPUT}
            />
          </fieldset>

          <label className="flex items-start gap-2 text-sm text-slate-800 dark:text-slate-100 cursor-pointer">
            <input type="checkbox" checked={form.freePreview} onChange={set('freePreview')} className="mt-1" />
            <span>
              <span className="font-semibold">Free preview</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Students without the course can play this highlight once signed in.</span>
            </span>
          </label>

          {error && (
            <p data-testid="clip-error" className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              data-testid="clip-save"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold cursor-pointer"
            >
              {saving ? 'Saving...' : clip ? 'Save Highlight' : 'Add to Highlights'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }

  // On the page itself, so no window it was opened from can clip or move it
  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add to highlights"
        data-testid="clip-editor"
        className="relative w-full max-w-5xl my-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-6 text-left"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
              <Scissors size={18} />
            </span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">{clip ? 'Edit highlight' : 'Add to highlights'}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {video.subject ? `${video.subject} · ` : ''}
                {video.title}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        {content}
      </div>
    </div>,
    document.body
  );
}
