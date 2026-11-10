import React, { useCallback, useEffect, useState } from 'react';
import { Pencil, Scissors, Trash2 } from 'lucide-react';
import ClipEditor from './ClipEditor';
import useDialog from '../../../hooks/useDialog';
import { deleteHighlight, fetchAdminHighlights } from '../../../services/highlightsApi';
import { formatClock } from '../../../utils/watchTime';
import { mediaOfVideo } from '../../../utils/youtubeLink';

/**
 * In a video's Edit Lesson window: the highlights cut from this video, with Add highlight.
 * A new video is saved first, so its highlights have a video to point to.
 */
export default function VideoHighlights({ video, showToast }) {
  const { confirm } = useDialog();
  const [clips, setClips] = useState([]);
  const [status, setStatus] = useState('loading');
  const [editing, setEditing] = useState(null);

  const videoId = video?._id ? String(video._id) : '';
  const subject = video?.subject || '';
  const canCut = Boolean(mediaOfVideo(video));

  const load = useCallback(async () => {
    if (!videoId || !subject) return;
    setStatus('loading');
    try {
      const data = await fetchAdminHighlights(subject);
      setClips((data.clips || []).filter((clip) => String(clip.videoId) === videoId));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [videoId, subject]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (clip) => {
    const ok = await confirm({
      title: `Delete "${clip.title}"?`,
      message: clip.reels.length ? `It also leaves ${clip.reels.map((reel) => `"${reel.name}"`).join(', ')}.` : 'It is in no reel.',
      confirmLabel: 'Delete Highlight',
      tone: 'danger',
    });
    if (!ok) return;
    try {
      const data = await deleteHighlight(clip._id);
      setClips((data.clips || []).filter((item) => String(item.videoId) === videoId));
      showToast?.(`Deleted "${clip.title}"`);
    } catch (problem) {
      showToast?.(problem.message || 'Could not delete the highlight.', 'error');
    }
  };

  let body;
  if (!videoId) {
    body = <p className="text-xs text-slate-500 dark:text-slate-400">Save this video first. Then open it again to cut highlights from it.</p>;
  } else if (!canCut) {
    body = <p className="text-xs text-slate-500 dark:text-slate-400">Highlights can be cut from YouTube videos and uploaded videos only.</p>;
  } else if (!subject) {
    body = <p className="text-xs text-slate-500 dark:text-slate-400">Give this video a subject and save it, so its highlights belong to that subject.</p>;
  } else if (status === 'loading') {
    body = <p className="text-xs text-slate-500 dark:text-slate-400">Loading...</p>;
  } else if (status === 'error') {
    body = <p className="text-xs text-rose-600">Could not load this video&apos;s highlights.</p>;
  } else if (clips.length === 0) {
    body = (
      <p className="text-xs text-slate-500 dark:text-slate-400">
        None yet. Add one for each part students search for, such as 2:00 to 2:12 &quot;What is trigonometry&quot;.
      </p>
    );
  } else {
    body = (
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {clips.map((clip) => (
          <li key={clip._id} data-testid="video-highlight" className="py-2 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{clip.title}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {formatClock(clip.start)}–{formatClock(clip.end)}
                {clip.freePreview ? ' · Free preview' : ''}
                {clip.reels.length ? ` · In ${clip.reels.map((reel) => reel.name).join(', ')}` : ' · In no reel'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing({ clip })}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil size={13} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => remove(clip)}
              aria-label={`Delete ${clip.title}`}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section
      data-testid="video-highlights"
      aria-label="Highlights of this video"
      className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-4 sm:p-5 space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white inline-flex items-center gap-2">
            <Scissors size={16} className="text-blue-600" />
            <span>Highlights of this video</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Short parts students can find in the search and watch on their own or in a reel.
          </p>
        </div>
        {videoId && canCut && subject && (
          <button
            type="button"
            data-testid="video-add-highlight"
            onClick={() => setEditing({ clip: null })}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Scissors size={14} />
            <span>Add highlight</span>
          </button>
        )}
      </div>
      {body}

      {editing && (
        <ClipEditor
          video={video}
          clip={editing.clip}
          onClose={() => setEditing(null)}
          onSaved={({ data, message }) => {
            setClips((data.clips || []).filter((item) => String(item.videoId) === videoId));
            setEditing(null);
            showToast?.(message);
          }}
        />
      )}
    </section>
  );
}
