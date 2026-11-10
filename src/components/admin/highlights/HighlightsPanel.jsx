import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Clapperboard, ExternalLink, Pencil, Play, Plus, Trash2, X } from 'lucide-react';
import ClipEditor from './ClipEditor';
import ReelPlayer from '../../highlights/ReelPlayer';
import useDialog from '../../../hooks/useDialog';
import { fetchPublicCourses } from '../../../services/courseApi';
import { createReel, deleteHighlight, deleteReel, fetchAdminHighlights, updateReel } from '../../../services/highlightsApi';
import { formatClock } from '../../../utils/watchTime';
import { partLabel } from '../../../utils/reelTimeline';

const CARD = 'rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/80 shadow-sm';
const SMALL_BUTTON =
  'px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const INPUT =
  'px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40';

const timesOf = (clip) => `${formatClock(clip.start)}–${formatClock(clip.end)}`;

/**
 * Admin, Highlights: the highlight reels of a subject and every highlight in it.
 * A highlight is made from a video with Add to highlights (in Videos, YouTube & Links).
 */
export default function HighlightsPanel({ showToast }) {
  const { confirm } = useDialog();
  const [courseSubjects, setCourseSubjects] = useState([]);
  const [subject, setSubject] = useState('');
  const [data, setData] = useState({ subjects: [], reels: [], clips: [] });
  const [status, setStatus] = useState('loading');
  const [newName, setNewName] = useState('');
  const [renaming, setRenaming] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [editing, setEditing] = useState(null);

  const say = useCallback((message, type) => showToast?.(message, type), [showToast]);

  // Subjects: every course's, and any that already has highlights
  useEffect(() => {
    fetchPublicCourses()
      .then((courses) => setCourseSubjects((courses || []).map((course) => course.subject).filter(Boolean)))
      .catch(() => setCourseSubjects([]));
    fetchAdminHighlights()
      .then((result) => {
        setData((previous) => ({ ...previous, subjects: result.subjects || [] }));
        setSubject((current) => current || result.subjects?.[0] || '');
      })
      .catch(() => {});
  }, []);

  const subjects = useMemo(
    () => [...new Set([...courseSubjects, ...data.subjects])].sort((a, b) => a.localeCompare(b)),
    [courseSubjects, data.subjects]
  );
  useEffect(() => {
    if (!subject && subjects.length) setSubject(subjects[0]);
  }, [subject, subjects]);

  const load = useCallback(async () => {
    if (!subject) return;
    setStatus('loading');
    try {
      const result = await fetchAdminHighlights(subject);
      setData(result);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [subject]);

  useEffect(() => {
    load();
  }, [load]);

  // Every change answers with the subject's reels and highlights as they are now
  const apply = async (action, message) => {
    try {
      const result = await action();
      setData((previous) => ({ ...previous, reels: result.reels || [], clips: result.clips || [] }));
      if (message) say(message);
      return true;
    } catch (problem) {
      say(problem.message || 'Could not save the change.', 'error');
      return false;
    }
  };

  const addReel = async (event) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (await apply(() => createReel({ subject, name }), `Made the reel "${name}"`)) setNewName('');
  };

  const move = (reel, index, step) => {
    const ids = reel.clips.map((clip) => clip._id);
    const [moved] = ids.splice(index, 1);
    ids.splice(index + step, 0, moved);
    return apply(() => updateReel(reel._id, { clipIds: ids }));
  };
  const removeFromReel = (reel, clipId) =>
    apply(
      () => updateReel(reel._id, { clipIds: reel.clips.map((clip) => clip._id).filter((id) => id !== clipId) }),
      `Removed from "${reel.name}"`
    );

  const removeReel = async (reel) => {
    const ok = await confirm({
      title: `Delete "${reel.name}"?`,
      message: 'The reel goes away. Its highlights stay, in the list below.',
      confirmLabel: 'Delete Reel',
      tone: 'danger',
    });
    if (ok) apply(() => deleteReel(reel._id), `Deleted the reel "${reel.name}"`);
  };
  const removeClip = async (clip) => {
    const ok = await confirm({
      title: `Delete "${clip.title}"?`,
      message: clip.reels.length ? `It also leaves ${clip.reels.map((reel) => `"${reel.name}"`).join(', ')}.` : 'It is in no reel.',
      confirmLabel: 'Delete Highlight',
      tone: 'danger',
    });
    if (ok) apply(() => deleteHighlight(clip._id), `Deleted "${clip.title}"`);
  };

  const saveName = async (event) => {
    event.preventDefault();
    const name = renaming.name.trim();
    if (!name) return;
    if (await apply(() => updateReel(renaming.id, { name }), 'Renamed the reel')) setRenaming(null);
  };

  return (
    <div data-testid="highlights-panel" className="space-y-4">
      <div className={`${CARD} p-5 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base inline-flex items-center gap-2">
            <Clapperboard size={18} className="text-blue-600" />
            <span>Highlights</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            Short parts of lesson videos. Make one from a video in Videos, YouTube &amp; Links with Add to highlights. A reel
            plays its highlights back to back as one video, even from different chapters.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span>Subject</span>
          <select data-testid="highlights-subject" value={subject} onChange={(event) => setSubject(event.target.value)} className={INPUT}>
            {subjects.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className={`${CARD} p-5 space-y-4`} aria-label={`${subject} reels`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{subject} reels</h4>
          <form onSubmit={addReel} className="flex gap-2">
            <input
              data-testid="new-reel-name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              maxLength={80}
              placeholder="New reel name"
              className={`${INPUT} w-56`}
            />
            <button type="submit" className={`${SMALL_BUTTON} bg-blue-600 hover:bg-blue-700 text-white px-3.5`}>
              <Plus size={14} />
              <span>New Reel</span>
            </button>
          </form>
        </div>

        {status === 'loading' && <p className="text-sm text-slate-500">Loading...</p>}
        {status === 'error' && <p className="text-sm text-rose-600">Could not load the highlights. Try again.</p>}
        {status === 'ready' && data.reels.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No reels in {subject} yet.</p>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {data.reels.map((reel) => (
            <article key={reel._id} data-testid="admin-reel" className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {renaming?.id === reel._id ? (
                    <form onSubmit={saveName} className="flex gap-2">
                      <input
                        autoFocus
                        value={renaming.name}
                        onChange={(event) => setRenaming({ ...renaming, name: event.target.value })}
                        maxLength={80}
                        aria-label="Reel name"
                        className={`${INPUT} py-1.5`}
                      />
                      <button type="submit" className={`${SMALL_BUTTON} bg-blue-600 text-white`}>
                        Save
                      </button>
                    </form>
                  ) : (
                    <h5 className="font-bold text-slate-900 dark:text-white truncate">{reel.name}</h5>
                  )}
                  <p data-testid="admin-reel-stats" className="text-xs text-slate-500 dark:text-slate-400">
                    {reel.clipCount} {reel.clipCount === 1 ? 'part' : 'parts'} · {formatClock(reel.duration)} · {reel.chapterCount}{' '}
                    {reel.chapterCount === 1 ? 'chapter' : 'chapters'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={reel.clipCount === 0}
                    onClick={() => setPlaying(reel)}
                    className={`${SMALL_BUTTON} bg-slate-900 text-white hover:bg-slate-700`}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Play</span>
                  </button>
                  <a
                    href={`/highlights/${reel._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open the reel's page"
                    className={`${SMALL_BUTTON} bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200`}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={reel.freePreview}
                    onChange={(event) =>
                      apply(
                        () => updateReel(reel._id, { freePreview: event.target.checked }),
                        event.target.checked ? `"${reel.name}" is a free preview` : `"${reel.name}" is for buyers only`
                      )
                    }
                  />
                  <span>Free preview</span>
                </label>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={reel.status === 'draft'}
                    onChange={(event) =>
                      apply(
                        () => updateReel(reel._id, { status: event.target.checked ? 'draft' : 'published' }),
                        event.target.checked ? `"${reel.name}" is hidden as a draft` : `"${reel.name}" is on the website`
                      )
                    }
                  />
                  <span>Draft (hidden)</span>
                </label>
                <span className="ml-auto flex gap-1.5">
                  <button type="button" onClick={() => setRenaming({ id: reel._id, name: reel.name })} className={`${SMALL_BUTTON} text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800`}>
                    <Pencil size={13} />
                    <span>Rename</span>
                  </button>
                  <button type="button" onClick={() => removeReel(reel)} className={`${SMALL_BUTTON} text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40`}>
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </span>
              </div>

              {reel.clips.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Empty. Open a video in Videos, YouTube &amp; Links and press Add to highlights.
                </p>
              ) : (
                <ol className="space-y-1.5">
                  {reel.clips.map((clip, index) => (
                    <li key={clip._id} data-testid="admin-reel-clip" className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 px-2.5 py-2">
                      <span className="text-xs font-bold text-slate-400 w-4 text-right">{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900 dark:text-white truncate">{partLabel(clip)}</span>
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {timesOf(clip)} · {clip.lessonTitle || 'Video removed'}
                        </span>
                      </span>
                      <button type="button" disabled={index === 0} onClick={() => move(reel, index, -1)} aria-label={`Move ${clip.title} up`} className={`${SMALL_BUTTON} px-1.5 hover:bg-slate-200 dark:hover:bg-slate-700`}>
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={index === reel.clips.length - 1}
                        onClick={() => move(reel, index, 1)}
                        aria-label={`Move ${clip.title} down`}
                        className={`${SMALL_BUTTON} px-1.5 hover:bg-slate-200 dark:hover:bg-slate-700`}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button type="button" onClick={() => removeFromReel(reel, clip._id)} aria-label={`Remove ${clip.title} from ${reel.name}`} className={`${SMALL_BUTTON} px-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40`}>
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className={`${CARD} p-5 space-y-3`} aria-label={`All ${subject} highlights`}>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">All {subject} highlights</h4>
        {status === 'ready' && data.clips.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">None yet. Open a video and press Add to highlights.</p>
        )}
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.clips.map((clip) => (
            <li key={clip._id} data-testid="admin-highlight" className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{partLabel(clip)}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {timesOf(clip)} · {clip.lessonTitle || 'Video removed'}
                  {clip.freePreview ? ' · Free preview' : ''}
                  {clip.reels.length ? ` · In ${clip.reels.map((reel) => reel.name).join(', ')}` : ' · In no reel'}
                </p>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={!clip.media}
                  onClick={() =>
                    setEditing({
                      clip,
                      video: {
                        _id: clip.videoId,
                        title: clip.lessonTitle,
                        subject: clip.subject,
                        chapterNumber: clip.chapter?.number,
                        ...(clip.media?.kind === 'youtube'
                          ? { youtubeId: clip.media.youtubeId, type: 'youtube' }
                          : { url: clip.media?.url, type: 'video' }),
                      },
                    })
                  }
                  className={`${SMALL_BUTTON} text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800`}
                >
                  <Pencil size={13} />
                  <span>Edit</span>
                </button>
                <button type="button" onClick={() => removeClip(clip)} className={`${SMALL_BUTTON} text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40`}>
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {playing && (
        <div className="fixed inset-0 z-[60] flex justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div data-testid="admin-reel-player" className="relative w-full max-w-4xl my-auto space-y-3">
            <div className="flex items-center justify-between text-white">
              <p className="font-bold">{playing.name}</p>
              <button type="button" onClick={() => setPlaying(null)} aria-label="Close" className="p-2 rounded-xl hover:bg-white/10 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <ReelPlayer clips={playing.clips} title={playing.name} autoPlay />
          </div>
        </div>
      )}

      {editing && (
        <ClipEditor
          video={editing.video}
          clip={editing.clip}
          onClose={() => setEditing(null)}
          onSaved={({ data: result, message }) => {
            setData((previous) => ({ ...previous, reels: result.reels || [], clips: result.clips || [] }));
            setEditing(null);
            say(message);
          }}
        />
      )}
    </div>
  );
}
