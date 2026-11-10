import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize, Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { createReelEngine } from './reelEngine';
import { formatClock } from '../../utils/watchTime';
import { partLabel, timelineOf } from '../../utils/reelTimeline';

/**
 * A highlight reel played as one video: its parts (each a stretch of a lesson video) back to back,
 * on one timeline. Only parts that carry their video play. A reel of one part plays one highlight.
 */
export default function ReelPlayer({ clips, title = '', autoPlay = false, className = '' }) {
  const playable = useMemo(() => (clips || []).filter((clip) => clip.media), [clips]);
  const key = playable.map((clip) => `${clip._id}:${clip.start}:${clip.end}`).join('|');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeline = useMemo(() => timelineOf(playable), [key]);

  const frame = useRef(null);
  const host = useRef(null);
  const engine = useRef(null);
  const [time, setTime] = useState(0);
  const [part, setPart] = useState(0);
  const [state, setState] = useState({ playing: false, ended: false, started: false });
  const [problem, setProblem] = useState('');

  useEffect(() => {
    if (!host.current || timeline.parts.length === 0) return undefined;
    const reel = createReelEngine({
      host: host.current,
      timeline,
      onTime: setTime,
      onPart: setPart,
      onState: setState,
    });
    engine.current = reel;
    setTime(0);
    setPart(0);
    setState({ playing: false, ended: false, started: false });
    setProblem('');
    reel
      .prepare()
      .then(() => autoPlay && reel.play())
      .catch(() => setProblem('The video could not load. Check your connection and try again.'));
    return () => {
      reel.destroy();
      engine.current = null;
    };
  }, [timeline, autoPlay]);

  if (timeline.parts.length === 0) {
    return (
      <div className={`aspect-video rounded-2xl bg-slate-900 text-slate-300 flex items-center justify-center text-sm ${className}`}>
        Nothing to play yet.
      </div>
    );
  }

  const { parts, total } = timeline;
  const current = parts[part] || parts[0];
  const toggle = () => engine.current?.toggle();

  // Click or drag on the timeline to jump anywhere in the reel
  const seekFromPointer = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
    engine.current?.seek(ratio * total);
  };
  const onKey = (event) => {
    const step = { ArrowLeft: -5, ArrowRight: 5 }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    engine.current?.seek(Math.min(Math.max(time + step, 0), total));
  };
  const fullScreen = () => {
    const element = frame.current;
    if (!element) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else element.requestFullscreen?.().catch(() => {});
  };

  return (
    <div
      ref={frame}
      data-testid="reel-player"
      data-state={state.ended ? 'ended' : state.playing ? 'playing' : 'paused'}
      className={`rounded-2xl overflow-hidden bg-black text-white select-none ${className}`}
    >
      <div className="relative aspect-video bg-black">
        <div ref={host} className="absolute inset-0" />
        {/* Clicks go to the reel, never into YouTube's own player */}
        <button
          type="button"
          onClick={toggle}
          aria-label={state.playing ? 'Pause reel' : 'Play reel'}
          className="absolute inset-0 w-full h-full cursor-pointer bg-transparent"
        />
        <div className="absolute top-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
          {title && <p className="text-xs sm:text-sm font-bold text-white/90 truncate">{title}</p>}
          <p data-testid="reel-part" className="text-[11px] sm:text-xs text-white/75 truncate">
            {parts.length > 1 ? `Part ${part + 1} of ${parts.length} · ` : ''}
            <span data-testid="reel-label">{partLabel(current)}</span>
          </p>
        </div>
        {!state.started && !state.ended && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-16 h-16 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-xl">
              <Play size={28} fill="currentColor" className="ml-1" />
            </span>
          </span>
        )}
        {state.ended && (
          <div data-testid="reel-ended" className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center gap-3 text-center p-6">
            <p className="text-base sm:text-lg font-bold">{parts.length === 1 ? 'Highlight finished' : 'Reel finished'}</p>
            <p className="text-xs text-slate-300">
              {parts.length} {parts.length === 1 ? 'part' : 'parts'} · {formatClock(total)}
            </p>
            <button
              type="button"
              onClick={() => engine.current?.play()}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Replay</span>
            </button>
          </div>
        )}
        {problem && (
          <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center p-6 text-center text-sm text-slate-200">{problem}</div>
        )}
      </div>

      {/* One timeline for the whole reel, with a mark where each part starts */}
      <div className="px-3 sm:px-4 pt-3 pb-2.5 bg-slate-950">
        <div
          role="slider"
          tabIndex={0}
          aria-label="Reel position"
          aria-valuemin={0}
          aria-valuemax={Math.round(total)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${formatClock(time)} of ${formatClock(total)}`}
          data-testid="reel-timeline"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture?.(event.pointerId);
            seekFromPointer(event);
          }}
          onPointerMove={(event) => event.buttons === 1 && seekFromPointer(event)}
          onKeyDown={onKey}
          className="relative h-2.5 rounded-full bg-white/15 cursor-pointer flex gap-0.5 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          {parts.map((item) => {
            const done = Math.min(Math.max((time - item.from) / (item.length || 1), 0), 1);
            return (
              <span
                key={`${item._id}-${item.index}`}
                data-testid="reel-segment"
                title={partLabel(item)}
                className="relative h-full bg-white/10 first:rounded-l-full last:rounded-r-full overflow-hidden"
                style={{ width: `${(item.length / total) * 100}%` }}
              >
                <span className="absolute inset-y-0 left-0 bg-sky-400" style={{ width: `${done * 100}%` }} />
              </span>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => engine.current?.previousPart()}
            aria-label="Previous part"
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <SkipBack size={16} />
          </button>
          <button
            type="button"
            onClick={toggle}
            data-testid="reel-play"
            aria-label={state.playing ? 'Pause' : 'Play'}
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            {state.playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button
            type="button"
            onClick={() => engine.current?.nextPart()}
            aria-label="Next part"
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <SkipForward size={16} />
          </button>
          <span data-testid="reel-time" className="text-xs font-mono text-white/80 tabular-nums">
            {formatClock(time)} / {formatClock(total)}
          </span>
          <span className="ml-auto" />
          <button
            type="button"
            onClick={fullScreen}
            aria-label="Full screen"
            className="p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <Maximize size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
