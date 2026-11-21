import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, ListPlus, Minus, Search, Sparkles, X } from 'lucide-react';
import { formatClock } from '../../../utils/watchTime';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '../courses/fields';
import { lessonVideoKey, partKey } from './roadmapDrafts';

const thumbnailOf = (lesson) => (lesson?.media?.kind === 'youtube' ? `https://img.youtube.com/vi/${lesson.media.youtubeId}/default.jpg` : '');

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

// A summary is ticked by its stretch ("node@120-150"); a video to cut by its node alone
const isSummaryKey = (key) => key.includes('@');

function Tick({ state, label, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state === 'some' ? 'mixed' : state === 'all'}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
        state === 'none' ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600' : 'bg-blue-600 border-blue-600 text-white'
      }`}
    >
      {state === 'all' && <Check size={13} strokeWidth={3} />}
      {state === 'some' && <Minus size={13} strokeWidth={3} />}
    </button>
  );
}

/**
 * Picks summaries from the syllabus for a day. Each subtopic lists its summaries: short parts of its
 * video already cut, with their summary and key points. Ticking a chapter or a topic ticks every summary
 * under it. Students only ever get these parts, never the whole video. With "Only summaries" off, videos
 * that have no summary yet can be ticked too, and the admin cuts their part next.
 */
export default function SyllabusPicker({ chapters, lessons, summaries = new Map(), alreadyIn, dayNumber, onAdd, onClose }) {
  const summaryCount = useMemo(() => [...summaries.values()].reduce((sum, list) => sum + list.length, 0), [summaries]);
  const [onlySummaries, setOnlySummaries] = useState(summaryCount > 0);
  const [chosen, setChosen] = useState(() => new Set());
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(() => new Set());
  const searchBox = useRef(null);

  // Where each video's summaries are listed, for the other nodes that play the same video
  const holders = useMemo(() => {
    const map = new Map();
    summaries.forEach((_, nodeId) => {
      const key = lessonVideoKey(lessons.get(nodeId));
      if (key && !map.has(key)) map.set(key, nodeId);
    });
    return map;
  }, [summaries, lessons]);

  useEffect(() => {
    searchBox.current?.focus();
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const textMatches = (text) => !q || String(text || '').toLowerCase().includes(q);

  // What can be ticked for one lesson: its summaries, or (with "Only summaries" off) the video to cut
  const unitsOf = (nodeId) => {
    const list = summaries.get(nodeId);
    if (list?.length) return list.map((clip) => partKey(nodeId, clip.start, clip.end));
    return onlySummaries ? [] : [partKey(nodeId)];
  };

  // Chapters with something to tick, and with the search: only the matching branches
  const shown = useMemo(() => {
    const prune = (node) => {
      const children = (node.children || []).map(prune).filter(Boolean);
      const clips = summaries.get(node.nodeId) || [];
      const nodeMatches = textMatches(`${node.code || ''} ${node.title}`);
      const matchingClips = nodeMatches ? clips : clips.filter((clip) => textMatches(`${clip.title} ${clip.summary}`));
      const own = lessons.has(node.nodeId) && unitsOf(node.nodeId).length > 0 && (nodeMatches || matchingClips.length > 0);
      return own || children.length > 0 ? { ...node, children, own, clips: own ? matchingClips : [] } : null;
    };
    return chapters
      .map((chapter) => ({ ...chapter, topics: (chapter.topics || []).map(prune).filter(Boolean) }))
      .filter((chapter) => chapter.topics.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, lessons, summaries, onlySummaries, q]);

  // Everything tickable under a shown node, in syllabus order
  const unitsUnder = (node) => [
    ...(node.own ? (node.clips.length > 0 ? node.clips.map((clip) => partKey(node.nodeId, clip.start, clip.end)) : unitsOf(node.nodeId)) : []),
    ...(node.children || []).flatMap(unitsUnder),
  ];

  const stateOf = (keys) => {
    const free = keys.filter((key) => !alreadyIn.has(key));
    if (free.length === 0) return keys.length > 0 ? 'all' : 'none';
    const picked = free.filter((key) => chosen.has(key)).length;
    return picked === 0 ? 'none' : picked === free.length ? 'all' : 'some';
  };

  const toggle = (keys) =>
    setChosen((previous) => {
      const free = keys.filter((key) => !alreadyIn.has(key));
      const next = new Set(previous);
      const allIn = free.every((key) => next.has(key));
      free.forEach((key) => (allIn ? next.delete(key) : next.add(key)));
      return next;
    });

  const switchOnlySummaries = () => {
    const next = !onlySummaries;
    setOnlySummaries(next);
    // Videos to cut are not listed with only summaries shown, so they are unticked
    if (next) setChosen((previous) => new Set([...previous].filter(isSummaryKey)));
  };

  // What was ticked, in syllabus order whatever order it was ticked in: { lesson, clip } (clip null: cut it next)
  const orderedChoice = () => {
    const order = [];
    const walk = (node) => {
      const lesson = lessons.get(node.nodeId);
      if (lesson) {
        (summaries.get(node.nodeId) || []).forEach((clip) => {
          if (chosen.has(partKey(node.nodeId, clip.start, clip.end))) order.push({ lesson, clip });
        });
        if (chosen.has(partKey(node.nodeId))) order.push({ lesson, clip: null });
      }
      (node.children || []).forEach(walk);
    };
    chapters.forEach((chapter) => (chapter.topics || []).forEach(walk));
    return order;
  };

  const tickedSummaries = [...chosen].filter(isSummaryKey).length;
  const tickedVideos = chosen.size - tickedSummaries;
  const countText =
    chosen.size === 0
      ? 'Nothing ticked yet'
      : `Ticked: ${[tickedSummaries && plural(tickedSummaries, 'summary', 'summaries'), tickedVideos && plural(tickedVideos, 'video to cut', 'videos to cut')]
          .filter(Boolean)
          .join(', ')}`;

  const renderSummary = (node, clip, depth) => {
    const key = partKey(node.nodeId, clip.start, clip.end);
    const isIn = alreadyIn.has(key);
    const seconds = Math.round(clip.end - clip.start);
    const pointCount = (clip.points || []).filter(Boolean).length;
    return (
      <li key={key}>
        <div
          data-testid="picker-summary"
          className="flex items-start gap-2.5 py-1.5 pr-2 rounded-lg hover:bg-amber-50/60 dark:hover:bg-amber-950/20"
          style={{ paddingLeft: 8 + depth * 18 }}
        >
          <span className="pt-0.5">
            <Tick
              state={isIn || chosen.has(key) ? 'all' : 'none'}
              disabled={isIn}
              label={`Summary: ${clip.title}, ${formatClock(clip.start)} to ${formatClock(clip.end)}`}
              onToggle={() => toggle([key])}
            />
          </span>
          <span className="w-12 h-7 shrink-0 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center" aria-hidden="true">
            <Sparkles size={14} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{clip.title}</span>
            <span className="block text-[11px] text-slate-500" data-testid="picker-summary-times">
              {formatClock(clip.start)}–{formatClock(clip.end)} · {seconds} sec only
              {pointCount > 0 && ` · ${plural(pointCount, 'key point', 'key points')}`}
              {clip.status === 'draft' && ' · Draft highlight'}
            </span>
            {clip.summary ? (
              <span className="block text-xs text-slate-600 dark:text-slate-300 line-clamp-2" data-testid="picker-summary-text">
                {clip.summary}
              </span>
            ) : (
              <span className="block text-[11px] font-semibold text-amber-700 dark:text-amber-400">No summary text yet: add it after adding</span>
            )}
          </span>
          {isIn && <span className="shrink-0 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">In Day {dayNumber}</span>}
        </div>
      </li>
    );
  };

  const renderNode = (node, depth) => {
    const keys = unitsUnder(node);
    const lesson = node.own ? lessons.get(node.nodeId) : null;
    const clips = node.clips || [];
    const cutKey = partKey(node.nodeId);
    const cutIsIn = lesson && clips.length === 0 && alreadyIn.has(cutKey);
    const freeKeys = keys.filter((key) => !alreadyIn.has(key));
    const underCount = keys.length - (lesson ? (clips.length || 1) : 0);
    let note = '';
    if (lesson && clips.length > 0) note = plural(clips.length, 'summary', 'summaries');
    else if (lesson) {
      const holder = holders.get(lessonVideoKey(lesson));
      note =
        holder && holder !== node.nodeId
          ? `Same video as ${lessons.get(holder)?.label || 'another topic'}: its summaries are listed there`
          : 'No summary yet · you cut the part next';
    }
    if (underCount > 0) note = [note, `${underCount} more under it`].filter(Boolean).join(' · ');
    return (
      <li key={node.nodeId}>
        <div
          data-testid="picker-node"
          className="flex items-center gap-2.5 py-1.5 pr-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60"
          style={{ paddingLeft: 8 + depth * 18 }}
        >
          <Tick
            state={stateOf(keys)}
            disabled={freeKeys.length === 0}
            label={`${node.code ? `${node.code} ` : ''}${node.title}${keys.length > 1 ? `, all ${keys.length} under it` : ''}`}
            onToggle={() => toggle(keys)}
          />
          {lesson && thumbnailOf(lesson) ? (
            <img src={thumbnailOf(lesson)} alt="" className="w-12 h-7 rounded object-cover shrink-0 bg-slate-200" loading="lazy" />
          ) : (
            <span className="w-12 h-7 shrink-0" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-slate-800 dark:text-slate-100 truncate">
              {node.code && <span className="font-mono text-xs text-slate-500 mr-1.5">{node.code}</span>}
              {node.title}
            </span>
            {note && <span className={`block text-[11px] ${lesson && clips.length === 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'}`}>{note}</span>}
          </span>
          {cutIsIn && <span className="shrink-0 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">In Day {dayNumber}</span>}
        </div>
        {(clips.length > 0 || node.children?.length > 0) && (
          <ul>
            {clips.map((clip) => renderSummary(node, clip, depth + 1))}
            {(node.children || []).map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const emptyText = () => {
    if (lessons.size === 0) return 'This course has no lesson videos yet.';
    if (q) return 'Nothing matches that search.';
    if (onlySummaries) return 'No summaries left to add. Make more in Highlights, or turn off "Only summaries" to cut your own parts.';
    return 'Every video is already in this day.';
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-slate-950/60" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Add summaries to Day ${dayNumber}`}
        data-testid="syllabus-picker"
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Add summaries to Day {dayNumber}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each subtopic lists its summaries: a short part of its video with the summary and key points. Tick single summaries, or a
              chapter or topic for every summary under it. Students get only these parts, never the whole video.
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-3 space-y-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchBox}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a topic, code or summary, such as 1.0.1 or Cartesian"
              aria-label="Search the syllabus"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-3 py-2">
            <button
              type="button"
              role="switch"
              aria-checked={onlySummaries}
              aria-label="Only summaries"
              disabled={summaryCount === 0}
              onClick={switchOnlySummaries}
              data-testid="picker-only-summaries"
              className={`mt-0.5 shrink-0 w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${onlySummaries ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform ${onlySummaries ? 'translate-x-4' : ''}`} />
            </button>
            <span className="text-xs text-amber-900 dark:text-amber-100">
              <span className="font-bold">Only summaries</span>
              <span className="block text-amber-800/80 dark:text-amber-200/80" data-testid="picker-summary-total">
                {summaryCount > 0
                  ? `${plural(summaryCount, 'summary', 'summaries')} in this subject. Turn this off to also tick videos with no summary yet and cut their part yourself.`
                  : 'This subject has no summaries yet. Make them in Highlights, or tick videos below and cut each part yourself.'}
              </span>
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {shown.length === 0 && <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-10">{emptyText()}</p>}
          {shown.map((chapter, chapterIndex) => {
            const id = chapter.chapterId || chapter.name;
            const keys = chapter.topics.flatMap(unitsUnder);
            const summaryKeys = keys.filter(isSummaryKey).length;
            const videoKeys = keys.length - summaryKeys;
            const isOpen = open.has(id) !== (chapterIndex === 0) || Boolean(q);
            const title = [chapter.number && `Chapter ${chapter.number}`, chapter.name].filter(Boolean).join(': ');
            return (
              <section key={id} data-testid="picker-chapter" className="mb-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <Tick
                    state={stateOf(keys)}
                    disabled={keys.every((key) => alreadyIn.has(key))}
                    label={`${title}, all ${keys.length} under it`}
                    onToggle={() => toggle(keys)}
                  />
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpen((previous) => {
                        const next = new Set(previous);
                        if (next.has(id)) next.delete(id);
                        else next.add(id);
                        return next;
                      })
                    }
                    className="flex-1 min-w-0 flex items-center justify-between gap-2 text-left cursor-pointer"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-slate-900 dark:text-white truncate">{title}</span>
                      <span className="block text-[11px] text-slate-500">
                        {[summaryKeys && plural(summaryKeys, 'summary', 'summaries'), videoKeys && plural(videoKeys, 'video with no summary', 'videos with no summary')]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                    <ChevronDown size={16} className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isOpen && <ul className="pb-2 border-t border-slate-100 dark:border-slate-800 pt-1">{chapter.topics.map((topic) => renderNode(topic, 0))}</ul>}
              </section>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-600 dark:text-slate-300" data-testid="picker-count">
            {countText}
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>Cancel</button>
            <button type="button" disabled={chosen.size === 0} onClick={() => onAdd(orderedChoice())} className={PRIMARY_BUTTON}>
              <ListPlus size={14} />
              <span>{chosen.size > 0 ? `Add ${chosen.size} to Day ${dayNumber}` : `Add to Day ${dayNumber}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
