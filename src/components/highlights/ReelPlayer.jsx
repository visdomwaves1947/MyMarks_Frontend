import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  Check,
  FastForward,
  Maximize,
  Minimize,
  Pause,
  Play,
  Rewind,
  RotateCcw,
  Settings,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { createReelEngine } from './reelEngine';
import { formatClock } from '../../utils/watchTime';
import { locate, partLabel, thumbnailOf, timelineOf } from '../../utils/reelTimeline';

/**
 * A highlight reel played as one video: its parts (each a stretch of a lesson video) back to back,
 * on one timeline. Only parts that carry their video play. A reel of one part plays one highlight.
 *
 * The controls sit over the video and work the way people know from video sites: they fade away while
 * it plays, the bar grows under the pointer and shows the time there, with volume, speed, full screen
 * and the usual keys (Space or K, the arrows, J and L, M, F, 0 to 9).
 */

const PREFS_KEY = 'mymarks_player';
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
// The controls leave this long after the pointer last moved
const IDLE_MS = 2600;
const START_STATE = { playing: false, ended: false, started: false, waiting: false };

const clamp = (value, low, high) => Math.min(Math.max(value, low), high);

// The viewer's volume and speed, kept on this device for the next video
const readPrefs = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    return {
      volume: Number.isFinite(saved.volume) ? clamp(Math.round(saved.volume), 0, 100) : 100,
      muted: saved.muted === true,
      rate: SPEEDS.includes(saved.rate) ? saved.rate : 1,
    };
  } catch {
    return { volume: 100, muted: false, rate: 1 };
  }
};
const savePrefs = (prefs) => {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Private windows may refuse: the player works without it
  }
};

// A round button of the control bar, with its name (and key) shown above it under the pointer
function Control({ label, hint = '', align = 'center', className = '', children, ...rest }) {
  const side = { left: 'left-0', right: 'right-0', center: 'left-1/2 -translate-x-1/2' }[align];
  return (
    <button
      type="button"
      aria-label={label}
      className={`group/tip relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 cursor-pointer disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent ${
        className || 'flex'
      }`}
      {...rest}
    >
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-full mb-6 ${side} hidden sm:block whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-[11px] font-semibold text-white opacity-0 group-hover/tip:opacity-100 transition-opacity`}
      >
        {hint || label}
      </span>
    </button>
  );
}

// The volume line that slides out beside the speaker
function VolumeSlider({ value, onChange }) {
  const track = useRef(null);
  const at = (event) => {
    const box = track.current.getBoundingClientRect();
    onChange(Math.round(clamp((event.clientX - box.left) / box.width, 0, 1) * 100));
  };
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={`${value}%`}
      data-testid="reel-volume"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        at(event);
      }}
      onPointerMove={(event) => event.buttons === 1 && at(event)}
      onKeyDown={(event) => {
        const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[event.key];
        if (step === undefined) return;
        event.preventDefault();
        event.stopPropagation();
        onChange(clamp(value + step, 0, 100));
      }}
      className="hidden sm:flex h-9 w-0 items-center overflow-hidden opacity-0 transition-all duration-200 cursor-pointer touch-none group-hover/vol:w-[68px] group-hover/vol:opacity-100 group-focus-within/vol:w-[68px] group-focus-within/vol:opacity-100 focus:outline-none"
    >
      <div ref={track} className="relative mx-2 h-[3px] w-[52px] shrink-0 rounded-full bg-white/30">
        <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${value}%` }} />
        <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" style={{ left: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ReelPlayer({
  clips,
  title = '',
  autoPlay = false,
  startAt = 0,
  loop = false,
  control = null,
  onPart = null,
  onPlaying = null,
  className = '',
}) {
  const playable = useMemo(() => (clips || []).filter((clip) => clip.media), [clips]);
  const key = playable.map((clip) => `${clip._id}:${clip.start}:${clip.end}`).join('|');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeline = useMemo(() => timelineOf(playable), [key]);

  const frame = useRef(null);
  const host = useRef(null);
  const bar = useRef(null);
  const engine = useRef(null);
  const menuBox = useRef(null);
  const gear = useRef(null);
  const idle = useRef(null);
  const awake = useRef(true);
  const dragging = useRef(false);
  const lastSeek = useRef(0);
  const first = useRef(startAt);
  first.current = startAt;
  const loopNow = useRef(loop);
  const listeners = useRef({ onPart, onPlaying });
  listeners.current = { onPart, onPlaying };

  const [time, setTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [part, setPart] = useState(0);
  const [state, setState] = useState(START_STATE);
  const [problem, setProblem] = useState('');
  const [prefs, setPrefs] = useState(readPrefs);
  const prefsNow = useRef(prefs);
  // The pointer moved lately, so the controls show while it plays
  const [active, setActive] = useState(true);
  const [menu, setMenu] = useState(false);
  // Where the pointer is along the bar (0 to 1), and the time being dragged to
  const [hover, setHover] = useState(null);
  const [scrub, setScrub] = useState(null);
  const [full, setFull] = useState(false);
  // Fills the window where the browser has no full screen for a page element (iPhone)
  const [pseudo, setPseudo] = useState(false);
  const [flash, setFlash] = useState(null);
  const [posterBroken, setPosterBroken] = useState(false);

  useEffect(() => {
    if (!host.current || timeline.parts.length === 0) return undefined;
    const reel = createReelEngine({
      host: host.current,
      timeline,
      onTime: setTime,
      onPart: setPart,
      onState: setState,
      onBuffer: setBuffered,
    });
    engine.current = reel;
    const start = clamp(Number(first.current) || 0, 0, timeline.parts.length - 1);
    setTime(timeline.parts[start].from);
    setBuffered(0);
    setPart(start);
    setState(START_STATE);
    setProblem('');
    setPosterBroken(false);
    reel.setVolume(prefsNow.current.volume);
    reel.setMuted(prefsNow.current.muted);
    reel.setRate(prefsNow.current.rate);
    reel.setLoop(loopNow.current);
    reel
      .prepare(start)
      .then(() => autoPlay && reel.play())
      .catch(() => setProblem('The video could not load. Check your connection and try again.'));
    return () => {
      reel.destroy();
      engine.current = null;
    };
  }, [timeline, autoPlay]);

  useEffect(() => {
    loopNow.current = loop;
    engine.current?.setLoop(loop);
  }, [loop]);

  // What a playlist beside the player needs: the part playing, and a way to jump to another
  useEffect(() => {
    listeners.current.onPart?.(part);
  }, [part]);
  useEffect(() => {
    listeners.current.onPlaying?.(state.playing);
  }, [state.playing]);
  useEffect(() => {
    if (!control) return undefined;
    control.current = {
      playPart: (index) => engine.current?.playPart(index),
      toggle: () => engine.current?.toggle(),
      pause: () => engine.current?.pause(),
    };
    return () => {
      control.current = null;
    };
  }, [control]);

  // Shows the controls, and lets them go once the pointer has been still for a while
  const wake = useCallback((now = false) => {
    if (!awake.current) {
      awake.current = true;
      // A click that follows the pointer straight away must find the controls already there
      if (now) flushSync(() => setActive(true));
      else setActive(true);
    }
    clearTimeout(idle.current);
    idle.current = setTimeout(() => {
      awake.current = false;
      setActive(false);
    }, IDLE_MS);
  }, []);
  useEffect(() => () => clearTimeout(idle.current), []);
  useEffect(() => {
    if (state.playing) wake();
  }, [state.playing, wake]);

  useEffect(() => {
    const onChange = () => setFull(Boolean(frame.current) && document.fullscreenElement === frame.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  useEffect(() => {
    if (!pseudo) return undefined;
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = before;
    };
  }, [pseudo]);

  // The speed list closes on a click anywhere else
  useEffect(() => {
    if (!menu) return undefined;
    const close = (event) => {
      if (menuBox.current?.contains(event.target) || gear.current?.contains(event.target)) return;
      setMenu(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [menu]);

  if (timeline.parts.length === 0) {
    return (
      <div className={`aspect-video rounded-xl bg-slate-900 text-slate-300 flex items-center justify-center text-sm ${className}`}>
        Nothing to play yet.
      </div>
    );
  }

  const { parts, total } = timeline;
  const current = parts[part] || parts[0];
  const many = parts.length > 1;
  const shownTime = scrub ?? time;
  const shown = !state.playing || active || menu || scrub !== null;
  const big = full || pseudo;
  const sound = prefs.muted ? 0 : prefs.volume;
  const loading = state.waiting || (autoPlay && !state.started && !state.ended && !problem);
  const poster = !state.started && !state.ended && !posterBroken ? thumbnailOf(parts[0], 'hqdefault') : '';

  const flashNow = (kind, text = '') => setFlash({ kind, text, id: `${Date.now()}-${Math.random()}` });

  const toggle = () => {
    if (!engine.current) return;
    if (state.started && !state.ended) flashNow(state.playing ? 'pause' : 'play');
    engine.current.toggle();
  };
  const seekTo = (value) => engine.current?.seek(clamp(value, 0, total));
  const skip = (seconds) => {
    seekTo(time + seconds);
    flashNow(seconds < 0 ? 'back' : 'forward', `${Math.abs(seconds)} seconds`);
  };
  const next = () => {
    if (part + 1 < parts.length) engine.current?.nextPart();
    else if (loop) engine.current?.playPart(0);
  };

  const changePrefs = (change) => {
    const updated = { ...prefsNow.current, ...change };
    prefsNow.current = updated;
    setPrefs(updated);
    savePrefs(updated);
    engine.current?.setVolume(updated.volume);
    engine.current?.setMuted(updated.muted);
    engine.current?.setRate(updated.rate);
    return updated;
  };
  const setVolume = (value) => {
    const volume = clamp(Math.round(value), 0, 100);
    changePrefs({ volume, muted: volume === 0 });
  };
  const toggleMute = () => {
    const now = prefsNow.current;
    // Unmuting a volume of zero would stay silent
    changePrefs(now.muted ? { muted: false, volume: now.volume || 50 } : { muted: true });
  };
  const stepRate = (step) => {
    const index = clamp(SPEEDS.indexOf(prefsNow.current.rate) + step, 0, SPEEDS.length - 1);
    const updated = changePrefs({ rate: SPEEDS[index] });
    flashNow('text', `${updated.rate}x`);
  };

  const toggleFull = () => {
    const element = frame.current;
    if (!element) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else if (pseudo) setPseudo(false);
    else if (element.requestFullscreen) element.requestFullscreen().catch(() => setPseudo(true));
    else setPseudo(true);
  };

  // The bar: a click jumps, a drag follows the pointer
  const ratioAt = (event) => {
    const box = bar.current.getBoundingClientRect();
    return clamp((event.clientX - box.left) / box.width, 0, 1);
  };
  const onBarDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragging.current = true;
    const at = ratioAt(event) * total;
    setHover(at / total);
    setScrub(at);
    seekTo(at);
    lastSeek.current = Date.now();
  };
  const onBarMove = (event) => {
    const ratio = ratioAt(event);
    setHover(ratio);
    if (!dragging.current) return;
    setScrub(ratio * total);
    // The video follows a drag a few times a second, not on every pixel
    if (Date.now() - lastSeek.current > 120) {
      seekTo(ratio * total);
      lastSeek.current = Date.now();
    }
  };
  const onBarUp = (event) => {
    if (!dragging.current) return;
    dragging.current = false;
    seekTo(ratioAt(event) * total);
    setScrub(null);
    if (event.pointerType !== 'mouse') setHover(null);
  };

  const onStageClick = (event) => {
    frame.current?.focus({ preventScroll: true });
    if (menu) {
      setMenu(false);
      return;
    }
    // A tap on a phone first brings the controls back
    if (event.nativeEvent.pointerType === 'touch' && state.playing && !shown) {
      wake(true);
      return;
    }
    toggle();
    wake();
  };

  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const name = event.key;
    const onControl = event.target !== frame.current && event.target.closest?.('button, [role="slider"]');
    // A focused button acts on Space and Enter itself
    if (onControl && (name === ' ' || name === 'Enter')) return;
    const lower = name.length === 1 ? name.toLowerCase() : name;
    if (lower === ' ' || lower === 'k') toggle();
    else if (name === 'ArrowLeft') skip(-5);
    else if (name === 'ArrowRight') skip(5);
    else if (lower === 'j') skip(-10);
    else if (lower === 'l') skip(10);
    else if (name === 'ArrowUp') {
      setVolume(sound + 5);
      flashNow('text', `${clamp(sound + 5, 0, 100)}%`);
    } else if (name === 'ArrowDown') {
      setVolume(sound - 5);
      flashNow('text', `${clamp(sound - 5, 0, 100)}%`);
    } else if (lower === 'm') toggleMute();
    else if (lower === 'f') toggleFull();
    else if (name === 'Home') seekTo(0);
    else if (name === 'End') seekTo(total);
    else if (/^[0-9]$/.test(name)) seekTo((total * Number(name)) / 10);
    else if (name === 'N' && event.shiftKey) next();
    else if (name === 'P' && event.shiftKey) engine.current?.previousPart();
    else if (name === '>') stepRate(1);
    else if (name === '<') stepRate(-1);
    else if (name === 'Escape' && (menu || pseudo)) {
      setMenu(false);
      setPseudo(false);
    } else return;
    event.preventDefault();
    wake();
  };

  const hoverTime = hover === null ? 0 : hover * total;
  const hoverPart = hover === null ? null : parts[locate(timeline, hoverTime).index];
  const SoundIcon = sound === 0 ? VolumeX : sound < 50 ? Volume1 : Volume2;
  const playLabel = state.ended ? 'Play again' : state.playing ? 'Pause' : 'Play';
  const playHint = state.ended ? 'Replay' : `${playLabel} (k)`;

  return (
    <div
      ref={frame}
      tabIndex={0}
      data-testid="reel-player"
      data-state={state.ended ? 'ended' : state.playing ? 'playing' : 'paused'}
      data-controls={shown ? 'shown' : 'hidden'}
      onKeyDown={onKeyDown}
      onMouseMove={() => wake(true)}
      onMouseLeave={() => {
        if (dragging.current) return;
        clearTimeout(idle.current);
        awake.current = false;
        setActive(false);
        setHover(null);
      }}
      onFocus={() => wake()}
      className={`relative overflow-hidden bg-black text-white select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 ${
        pseudo ? 'fixed inset-0 z-[200]' : ''
      } ${big ? 'h-full w-full rounded-none' : 'rounded-xl'} ${className}`}
    >
      <div className={`relative bg-black ${big ? 'h-full w-full' : 'aspect-video'}`}>
        <div ref={host} className="absolute inset-0" />
        {poster && (
          <img
            src={poster}
            alt=""
            onError={() => setPosterBroken(true)}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Clicks go to the reel, never into YouTube's own player */}
        <div
          aria-hidden="true"
          data-testid="reel-stage"
          onClick={onStageClick}
          onDoubleClick={toggleFull}
          className={`absolute inset-0 z-[5] ${state.playing && !shown ? 'cursor-none' : 'cursor-pointer'}`}
        />

        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/75 to-transparent px-3 pb-8 pt-3 sm:px-4 sm:pt-3.5 transition-opacity duration-200 ${
            shown ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title && <p className="truncate text-sm sm:text-base font-semibold text-white">{title}</p>}
          <p data-testid="reel-part" className="truncate text-[11px] sm:text-xs text-white/80">
            {many ? `Part ${part + 1} of ${parts.length} · ` : ''}
            <span data-testid="reel-label">{partLabel(current)}</span>
          </p>
        </div>

        {!state.started && !state.ended && !loading && (
          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="flex h-16 w-16 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full bg-black/65 text-white shadow-2xl ring-1 ring-white/25 backdrop-blur-sm">
              <Play size={30} fill="currentColor" className="ml-1" />
            </span>
          </span>
        )}
        {loading && (
          <span data-testid="reel-loading" className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-4 border-white/25 border-t-white animate-spin" />
          </span>
        )}
        {flash && (
          <span key={flash.id} className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span
              onAnimationEnd={() => setFlash(null)}
              className={`reel-bezel flex items-center justify-center gap-2 bg-black/60 text-white ${
                flash.kind === 'play' || flash.kind === 'pause' ? 'h-16 w-16 rounded-full' : 'rounded-full px-4 py-2.5 text-sm font-semibold'
              }`}
            >
              {flash.kind === 'play' && <Play size={26} fill="currentColor" className="ml-0.5" />}
              {flash.kind === 'pause' && <Pause size={26} fill="currentColor" />}
              {flash.kind === 'back' && <Rewind size={18} fill="currentColor" />}
              {flash.kind !== 'play' && flash.kind !== 'pause' && <span>{flash.text}</span>}
              {flash.kind === 'forward' && <FastForward size={18} fill="currentColor" />}
            </span>
          </span>
        )}

        {state.ended && (
          <div
            data-testid="reel-ended"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-black/85 p-6 pb-16 text-center"
          >
            <p className="text-base sm:text-lg font-bold">{many ? 'Reel finished' : 'Highlight finished'}</p>
            <p className="text-xs text-white/70">
              {parts.length} {many ? 'parts' : 'part'} · {formatClock(total)}
            </p>
            <button
              type="button"
              onClick={() => engine.current?.play()}
              className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-900 hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Replay</span>
            </button>
          </div>
        )}
        {problem && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90 p-6 text-center text-sm text-slate-200">{problem}</div>
        )}

        {menu && (
          <div
            ref={menuBox}
            role="menu"
            aria-label="Playback speed"
            data-testid="reel-speed-menu"
            className="absolute bottom-14 right-3 z-30 w-44 max-h-[calc(100%-4.5rem)] overflow-y-auto rounded-xl bg-[#1f1f1f]/95 py-1.5 text-[13px] text-white shadow-2xl backdrop-blur"
          >
            <p className="px-4 pb-1 pt-1.5 text-[11px] font-bold uppercase tracking-wide text-white/60">Playback speed</p>
            {SPEEDS.map((speed) => (
              <button
                key={speed}
                type="button"
                role="menuitemradio"
                aria-checked={prefs.rate === speed}
                onClick={() => {
                  changePrefs({ rate: speed });
                  setMenu(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-1.5 text-left hover:bg-white/10 cursor-pointer"
              >
                <span className="flex w-4 justify-center">{prefs.rate === speed && <Check size={15} />}</span>
                <span>{speed === 1 ? 'Normal' : speed}</span>
              </button>
            ))}
          </div>
        )}

        {/* The controls, over the bottom of the video */}
        <div
          data-testid="reel-controls"
          className={`absolute inset-x-0 bottom-0 z-20 transition-opacity duration-200 ${shown ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

          {/* One bar for the whole reel, with a gap where each part starts */}
          <div className="relative px-3">
            <div
              ref={bar}
              role="slider"
              tabIndex={0}
              aria-label="Reel position"
              aria-valuemin={0}
              aria-valuemax={Math.round(total)}
              aria-valuenow={Math.round(shownTime)}
              aria-valuetext={`${formatClock(shownTime)} of ${formatClock(total)}`}
              data-testid="reel-timeline"
              onPointerDown={onBarDown}
              onPointerMove={onBarMove}
              onPointerUp={onBarUp}
              onPointerCancel={onBarUp}
              onPointerLeave={() => !dragging.current && setHover(null)}
              className="group/bar relative flex h-4 cursor-pointer touch-none items-center rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <div
                className={`flex w-full gap-[2px] transition-[height] duration-100 group-hover/bar:h-[5px] ${scrub !== null ? 'h-[5px]' : 'h-[3px]'}`}
              >
                {parts.map((item) => {
                  const length = item.length || 1;
                  const done = clamp((shownTime - item.from) / length, 0, 1);
                  const loaded = clamp((buffered - item.from) / length, 0, 1);
                  return (
                    <span
                      key={`${item._id}-${item.index}`}
                      data-testid="reel-segment"
                      className="relative h-full overflow-hidden bg-white/30"
                      style={{ flexGrow: item.length, flexBasis: 0 }}
                    >
                      <span className="absolute inset-y-0 left-0 bg-white/40" style={{ width: `${loaded * 100}%` }} />
                      <span className="absolute inset-y-0 left-0 bg-[#ff0033]" style={{ width: `${done * 100}%` }} />
                    </span>
                  );
                })}
              </div>
              <span
                className={`pointer-events-none absolute top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff0033] transition-transform duration-100 group-hover/bar:scale-100 ${
                  scrub !== null ? 'scale-100' : 'scale-0'
                }`}
                style={{ left: `${(shownTime / (total || 1)) * 100}%` }}
              />
              {hover !== null && (
                <span
                  data-testid="reel-hover"
                  className="pointer-events-none absolute bottom-full mb-2 flex max-w-[220px] -translate-x-1/2 flex-col items-center gap-0.5 text-center"
                  style={{ left: `clamp(56px, ${hover * 100}%, calc(100% - 56px))` }}
                >
                  {many && hoverPart && (
                    <span className="max-w-full truncate rounded bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">{partLabel(hoverPart)}</span>
                  )}
                  <span className="rounded bg-black/80 px-1.5 py-0.5 text-xs font-bold tabular-nums text-white">{formatClock(hoverTime)}</span>
                </span>
              )}
            </div>
          </div>

          <div className="relative flex h-11 sm:h-12 items-center gap-0.5 px-1.5 pb-1 sm:px-2">
            <Control label={playLabel} hint={playHint} align="left" onClick={toggle} data-testid="reel-play">
              {state.ended ? (
                <RotateCcw size={20} />
              ) : state.playing ? (
                <Pause size={22} fill="currentColor" />
              ) : (
                <Play size={22} fill="currentColor" className="ml-0.5" />
              )}
            </Control>
            {many && (
              <>
                <Control label="Previous part" hint="Previous (Shift+P)" className="hidden sm:flex" onClick={() => engine.current?.previousPart()}>
                  <SkipBack size={19} fill="currentColor" />
                </Control>
                <Control label="Next part" hint="Next (Shift+N)" disabled={part + 1 >= parts.length && !loop} onClick={next}>
                  <SkipForward size={19} fill="currentColor" />
                </Control>
              </>
            )}
            <div className="group/vol flex items-center">
              <Control label={sound === 0 ? 'Unmute' : 'Mute'} hint={`${sound === 0 ? 'Unmute' : 'Mute'} (m)`} onClick={toggleMute} data-testid="reel-mute">
                <SoundIcon size={21} />
              </Control>
              <VolumeSlider value={sound} onChange={setVolume} />
            </div>
            <span data-testid="reel-time" className="whitespace-nowrap px-1.5 text-[12px] sm:text-[13px] tabular-nums text-white/95">
              {formatClock(shownTime)} / {formatClock(total)}
            </span>
            {many && (
              <span aria-hidden="true" className="hidden md:flex min-w-0 items-center gap-1.5 text-[13px] text-white/90">
                <span className="text-white/50">•</span>
                <span className="truncate">{partLabel(current)}</span>
              </span>
            )}
            <span className="ml-auto" />
            <span ref={gear} className="flex">
              <Control
                label="Playback speed"
                hint={prefs.rate === 1 ? 'Speed' : `Speed: ${prefs.rate}x`}
                aria-haspopup="menu"
                aria-expanded={menu}
                data-testid="reel-settings"
                onClick={() => setMenu((open) => !open)}
              >
                <Settings size={20} className={`transition-transform duration-200 ${menu ? 'rotate-45' : ''}`} />
                {prefs.rate !== 1 && (
                  <span className="absolute right-0 top-0.5 rounded bg-[#ff0033] px-1 text-[9px] font-bold leading-[14px] text-white">{prefs.rate}x</span>
                )}
              </Control>
            </span>
            <Control label={big ? 'Exit full screen' : 'Full screen'} hint={`${big ? 'Exit full screen' : 'Full screen'} (f)`} align="right" onClick={toggleFull}>
              {big ? <Minimize size={20} /> : <Maximize size={20} />}
            </Control>
          </div>
        </div>
      </div>
    </div>
  );
}
