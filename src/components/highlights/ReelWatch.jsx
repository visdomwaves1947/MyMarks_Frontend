import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ListVideo, Play, Repeat, X } from 'lucide-react';
import ReelPlayer from './ReelPlayer';
import SaveHighlightButton from './SaveHighlightButton';
import { formatClock } from '../../utils/watchTime';
import { chapterLine, thumbnailOf } from '../../utils/reelTimeline';

/**
 * Watching a list of highlights the way a playlist is watched: the player, the list beside it
 * (under it on a phone) with the one now playing marked, and what that highlight covers below.
 * A click on a row plays from that highlight on.
 */

// A row's picture: the video's own, or a plain tile when it has none
function Thumbnail({ clip }) {
  const [broken, setBroken] = useState(false);
  const source = thumbnailOf(clip);
  if (!source || broken) {
    return (
      <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white/70">
        <Play size={18} fill="currentColor" />
      </span>
    );
  }
  return <img src={source} alt="" loading="lazy" onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover" />;
}

// Three bars that move while the highlight plays
function PlayingMark({ moving }) {
  return (
    <span aria-hidden="true" className="mx-auto flex h-3 w-3 items-end justify-between">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className={`w-[3px] rounded-sm bg-blue-600 dark:bg-cyan-400 ${moving ? 'reel-eq' : ''}`}
          style={{ height: moving ? undefined : ['55%', '100%', '75%'][bar], animationDelay: `${bar * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export default function ReelWatch({
  clips,
  title = '',
  subtitle = '',
  autoPlay = false,
  startAt = 0,
  startKey = 0,
  currentUser,
  onOpenSignIn,
  onClose = null,
}) {
  const playable = useMemo(() => (clips || []).filter((clip) => clip.media), [clips]);
  const root = useRef(null);
  const list = useRef(null);
  const control = useRef(null);
  const started = useRef(startKey);
  const [part, setPart] = useState(startAt);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);

  // Play pressed on another highlight of the same list: the player jumps there
  useEffect(() => {
    if (startKey === started.current) return;
    started.current = startKey;
    control.current?.playPart(startAt);
  }, [startKey, startAt]);

  // The player comes into view when it opens, and when another highlight is picked from far down the page
  useEffect(() => {
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    if (box.top < 70 || box.top > window.innerHeight * 0.45) root.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [startKey]);

  // The row now playing stays in sight in the list
  useEffect(() => {
    const box = list.current;
    const row = box?.querySelector(`[data-index="${part}"]`);
    if (!box || !row) return;
    const top = row.offsetTop;
    if (top < box.scrollTop || top + row.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTo({ top: Math.max(top - 8, 0), behavior: 'smooth' });
    }
  }, [part]);

  if (playable.length === 0) return null;
  const current = playable[part] || playable[0];
  const about = [chapterLine(current), current.lessonTitle, `${formatClock(current.start)}–${formatClock(current.end)}`].filter(Boolean);

  return (
    <div
      ref={root}
      data-testid="reel-watch"
      className="scroll-mt-24 grid grid-cols-1 gap-x-5 gap-y-3 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <ReelPlayer
          clips={playable}
          title={title}
          autoPlay={autoPlay}
          startAt={startAt}
          loop={loop}
          control={control}
          onPart={setPart}
          onPlaying={setPlaying}
          className="shadow-lg"
        />
      </div>

      {/* What is playing now */}
      <div data-testid="now-playing" className="min-w-0 space-y-2 lg:col-start-1 lg:row-start-2">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <div className="min-w-0">
            <h3 data-testid="now-playing-title" className="text-lg sm:text-xl font-bold leading-snug text-slate-950 dark:text-white">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{about.join(' · ')}</p>
          </div>
          <SaveHighlightButton highlight={current} currentUser={currentUser} onOpenSignIn={onOpenSignIn} />
        </div>
        {(current.summary || current.points?.length > 0) && (
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800/70 px-3.5 py-3 text-sm text-slate-700 dark:text-slate-200">
            {current.summary && <p>{current.summary}</p>}
            {current.points?.length > 0 && (
              <ul className={`list-disc space-y-0.5 pl-5 ${current.summary ? 'mt-1.5' : ''}`}>
                {current.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* The list, as tall as the player on a wide screen */}
      <div className="min-w-0 lg:relative lg:col-start-2 lg:row-start-1">
        <aside
          data-testid="playlist"
          aria-label={title ? `Playlist: ${title}` : 'Playlist'}
          className="flex max-h-[26rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0f172a] lg:absolute lg:inset-0 lg:max-h-none"
        >
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-slate-950 dark:text-white">{title || 'Highlights'}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {subtitle ? `${subtitle} · ` : ''}
                  <span data-testid="playlist-position">
                    {part + 1} / {playable.length}
                  </span>
                </p>
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close the player"
                  className="-mr-1.5 -mt-1 rounded-full p-2 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="-ml-2 mt-1 flex items-center gap-1">
              <button
                type="button"
                data-testid="playlist-loop"
                aria-pressed={loop}
                aria-label="Loop playlist"
                title={loop ? 'Loop is on: the playlist starts again at the end' : 'Loop playlist'}
                onClick={() => setLoop((on) => !on)}
                className={`rounded-full p-2 cursor-pointer ${
                  loop
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-cyan-300'
                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <Repeat size={18} />
              </button>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ListVideo size={15} />
                <span>Plays one after another</span>
              </span>
            </div>
          </div>

          <ol ref={list} className="relative flex-1 overflow-y-auto py-1.5">
            {playable.map((clip, index) => {
              const now = index === part;
              return (
                <li key={`${clip._id}-${index}`}>
                  <button
                    type="button"
                    data-testid="playlist-item"
                    data-index={index}
                    aria-current={now ? 'true' : undefined}
                    onClick={() => control.current?.playPart(index)}
                    className={`flex w-full items-center gap-2 py-1.5 pl-1.5 pr-3 text-left cursor-pointer ${
                      now ? 'bg-blue-50 dark:bg-blue-950/40' : 'hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <span className="w-6 shrink-0 text-center text-xs text-slate-500 dark:text-slate-400">
                      {now ? <PlayingMark moving={playing} /> : index + 1}
                    </span>
                    <span className="relative aspect-video w-[104px] shrink-0 overflow-hidden rounded-lg bg-slate-800 sm:w-[120px]">
                      <Thumbnail clip={clip} />
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[11px] font-semibold leading-4 text-white">
                        {formatClock(clip.end - clip.start)}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 dark:text-white">{clip.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-slate-600 dark:text-slate-400">{chapterLine(clip) || clip.subject}</span>
                      {clip.lessonTitle && <span className="block truncate text-xs text-slate-500 dark:text-slate-500">{clip.lessonTitle}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </div>
  );
}
