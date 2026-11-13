import { loadYouTubeApi } from '../../utils/youtubeApi';
import { locate, reelTimeOf } from '../../utils/reelTimeline';

/**
 * Plays a highlight reel as one video. Each part is a stretch of a lesson video (a YouTube video or an
 * uploaded file). Two players take turns: while one plays a part, the other loads the next part and
 * waits, paused and muted, so the switch at the end of a part is a near-instant cut.
 *
 * YouTube cannot join two of its videos into one file, so this is how a reel feels like one video.
 */

const YOUTUBE_HOST = 'https://www.youtube-nocookie.com';
const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_BUFFERING = 3;
const TICK_MS = 100;
// A part ends this close to its end time, so the next one starts without a pause
const END_SLACK = 0.12;

// ── One player slot ─────────────────────────────────────────────

class Deck {
  constructor(host, name, onEvent) {
    this.slot = document.createElement('div');
    this.slot.dataset.deck = name;
    Object.assign(this.slot.style, {
      position: 'absolute',
      inset: '0',
      opacity: '0',
      transition: 'opacity 140ms linear',
      pointerEvents: 'none',
    });
    host.appendChild(this.slot);
    this.onEvent = onEvent;
    this.kind = null;
    this.player = null;
    this.ready = Promise.resolve();
    this.index = -1;
    this.loaded = false;
    this.holdAt = null;
    // What the viewer chose; the reel copies these to both slots
    this.volume = 100;
    this.userMuted = false;
    this.rate = 1;
  }

  // The sound of the part being watched: the viewer's volume, and silent only when they muted it
  applySound() {
    try {
      if (this.kind === 'youtube') {
        this.player?.setVolume?.(this.volume);
        if (this.userMuted) this.player?.mute?.();
        else this.player?.unMute?.();
      } else if (this.kind === 'file') {
        this.player.volume = this.volume / 100;
        this.player.muted = this.userMuted;
      }
    } catch {
      // Not ready yet
    }
  }

  applyRate() {
    try {
      if (this.kind === 'youtube') this.player?.setPlaybackRate?.(this.rate);
      if (this.kind === 'file') {
        this.player.defaultPlaybackRate = this.rate;
        this.player.playbackRate = this.rate;
      }
    } catch {
      // Not ready yet
    }
  }

  // How far this slot's video has loaded, in seconds of that video
  loadedTo() {
    try {
      if (this.kind === 'youtube') {
        return Number(this.player?.getVideoLoadedFraction?.()) * Number(this.player?.getDuration?.());
      }
      if (this.kind === 'file') {
        const { buffered, currentTime } = this.player;
        for (let i = 0; i < buffered.length; i += 1) {
          if (buffered.start(i) <= currentTime + 0.5 && buffered.end(i) >= currentTime) return buffered.end(i);
        }
      }
    } catch {
      // Not ready yet
    }
    return NaN;
  }

  show(visible) {
    this.slot.style.opacity = visible ? '1' : '0';
    this.slot.dataset.active = visible ? 'true' : 'false';
  }

  clear() {
    try {
      if (this.kind === 'youtube') this.player?.destroy?.();
      if (this.kind === 'file') this.player?.pause?.();
    } catch {
      // Already gone
    }
    this.slot.innerHTML = '';
    this.kind = null;
    this.player = null;
    this.loaded = false;
  }

  async makeYouTube() {
    if (this.kind === 'youtube') return this.ready;
    this.clear();
    const YT = await loadYouTubeApi();
    const mount = document.createElement('div');
    this.slot.appendChild(mount);
    this.kind = 'youtube';
    this.ready = new Promise((resolve) => {
      this.player = new YT.Player(mount, {
        host: YOUTUBE_HOST,
        width: '100%',
        height: '100%',
        playerVars: { controls: 0, disablekb: 1, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, fs: 0 },
        events: {
          onReady: () => resolve(),
          onStateChange: (event) => {
            // A part loaded ahead waits at its start, paused and muted, until its turn
            if (event.data === YT_PLAYING && this.holdAt !== null) {
              const at = this.holdAt;
              this.holdAt = null;
              this.player.pauseVideo();
              this.player.seekTo(at, true);
              this.loaded = true;
            } else if (event.data === YT_PLAYING) {
              this.loaded = true;
              this.applyRate();
            }
            this.onEvent(this, event.data === YT_ENDED ? 'ended' : 'state', event.data);
          },
        },
      });
    });
    return this.ready;
  }

  makeFile() {
    if (this.kind === 'file') return;
    this.clear();
    const video = document.createElement('video');
    video.playsInline = true;
    video.preload = 'auto';
    Object.assign(video.style, { width: '100%', height: '100%', objectFit: 'contain', background: '#000' });
    video.addEventListener('ended', () => this.onEvent(this, 'ended'));
    video.addEventListener('waiting', () => this.onEvent(this, 'state', YT_BUFFERING));
    video.addEventListener('playing', () => this.onEvent(this, 'state', YT_PLAYING));
    this.slot.appendChild(video);
    this.kind = 'file';
    this.player = video;
    this.ready = Promise.resolve();
  }

  // Loads a part; play: start it now, otherwise wait at its start (muted)
  async load(part, { play, at = part.start }) {
    this.index = part.index;
    this.loaded = false;
    // A newer load of this slot wins over one still waiting for YouTube
    this.loadCount = (this.loadCount || 0) + 1;
    const mine = this.loadCount;
    const media = part.media;
    if (media.kind === 'youtube') {
      await this.makeYouTube();
      if (mine !== this.loadCount) return;
      const options = { videoId: media.youtubeId, startSeconds: at, endSeconds: part.end };
      if (play) {
        this.holdAt = null;
        this.applySound();
        this.player.loadVideoById(options);
        this.applyRate();
      } else {
        this.holdAt = at;
        this.player.mute?.();
        this.player.loadVideoById(options);
      }
    } else {
      this.makeFile();
      const video = this.player;
      if (video.getAttribute('src') !== media.url) video.src = media.url;
      const seek = () => {
        video.currentTime = at;
        this.loaded = true;
      };
      if (video.readyState >= 1) seek();
      else video.addEventListener('loadedmetadata', seek, { once: true });
      this.applyRate();
      if (play) {
        this.applySound();
        video.play().catch(() => this.onEvent(this, 'blocked'));
      } else {
        video.muted = true;
        video.pause();
      }
    }
  }

  play() {
    this.applySound();
    this.applyRate();
    if (this.kind === 'youtube') {
      this.holdAt = null;
      this.player?.playVideo?.();
    } else if (this.kind === 'file') {
      this.player.play().catch(() => this.onEvent(this, 'blocked'));
    }
  }

  pause() {
    try {
      if (this.kind === 'youtube') this.player?.pauseVideo?.();
      if (this.kind === 'file') this.player?.pause();
    } catch {
      // Not ready yet
    }
  }

  seek(seconds) {
    try {
      if (this.kind === 'youtube') this.player?.seekTo?.(seconds, true);
      if (this.kind === 'file') this.player.currentTime = seconds;
    } catch {
      // Not ready yet
    }
  }

  time() {
    try {
      if (this.kind === 'youtube') return Number(this.player?.getCurrentTime?.());
      if (this.kind === 'file') return Number(this.player.currentTime);
    } catch {
      // Not ready yet
    }
    return NaN;
  }

  destroy() {
    this.clear();
    this.slot.remove();
  }
}

// ── The reel ────────────────────────────────────────────────────

export function createReelEngine({ host, timeline, onTime, onPart, onState, onBuffer }) {
  const { parts, total } = timeline;
  const decks = [
    new Deck(host, 'a', (deck, kind, data) => handle(deck, kind, data)),
    new Deck(host, 'b', (deck, kind, data) => handle(deck, kind, data)),
  ];
  let active = decks[0];
  let standby = decks[1];
  let index = 0;
  let playing = false;
  let ended = false;
  let started = false;
  let timer = null;
  let destroyed = false;
  let lastTime = 0;
  // Waiting for the video to load while it should be playing
  let waiting = false;
  let loop = false;

  const report = () => onState?.({ playing, ended, started, waiting: playing && waiting });

  const handle = (deck, kind, data) => {
    if (destroyed || deck !== active) return;
    if (kind === 'state' && (data === YT_BUFFERING || data === YT_PLAYING)) {
      const now = data === YT_BUFFERING;
      if (now !== waiting) {
        waiting = now;
        report();
      }
    }
    // Only the end of the part now playing moves on, not a late signal from the part before
    if (kind === 'ended' && playing && active.time() >= parts[index].end - 1) advance();
    if (kind === 'blocked') {
      playing = false;
      stopTicking();
      report();
    }
  };

  const preload = (next) => {
    if (next >= parts.length) {
      standby.pause();
      return;
    }
    if (standby.index === next) return;
    standby.load(parts[next], { play: false }).catch(() => {});
  };

  // Shows part `next`, from `at` seconds in its own video
  const switchTo = async (next, at = parts[next].start) => {
    index = next;
    onPart?.(next);
    const reused = standby.index === next;
    if (reused) {
      [active, standby] = [standby, active];
      if (Math.abs(active.time() - at) > 0.3 || !active.loaded) active.seek(at);
      if (playing) active.play();
    } else {
      await active.load(parts[next], { play: playing, at });
    }
    active.show(true);
    standby.show(false);
    standby.pause();
    preload(next + 1);
    lastTime = reelTimeOf(timeline, next, at);
    onTime?.(lastTime);
  };

  const finish = () => {
    // A looping reel starts again from its first part
    if (loop && playing) {
      switchTo(0);
      return;
    }
    playing = false;
    ended = true;
    active.pause();
    stopTicking();
    lastTime = total;
    onTime?.(total);
    report();
  };

  const advance = () => {
    if (index + 1 < parts.length) switchTo(index + 1);
    else finish();
  };

  const tick = () => {
    if (destroyed) return;
    const part = parts[index];
    const local = active.time();
    if (!Number.isFinite(local) || !part) return;
    // A time outside the part is from before the player moved to it: wait for the new time
    if (local < part.start - 1 || local > part.end + 1) return;
    lastTime = reelTimeOf(timeline, index, local);
    onTime?.(lastTime);
    const loaded = active.loadedTo();
    if (Number.isFinite(loaded)) onBuffer?.(reelTimeOf(timeline, index, Math.max(loaded, local)));
    if (playing && local >= part.end - END_SLACK) advance();
  };

  const startTicking = () => {
    if (!timer) timer = setInterval(tick, TICK_MS);
  };
  const stopTicking = () => {
    clearInterval(timer);
    timer = null;
  };

  const engine = {
    // Loads the part to start with (and the one after, ahead), waiting at its start
    async prepare(first = 0) {
      if (parts.length === 0) return;
      index = Math.min(Math.max(Number(first) || 0, 0), parts.length - 1);
      await active.load(parts[index], { play: false });
      if (destroyed) return;
      active.show(true);
      preload(index + 1);
      onPart?.(index);
      lastTime = parts[index].from;
      onTime?.(lastTime);
    },
    play() {
      if (destroyed || parts.length === 0) return;
      if (ended) {
        ended = false;
        playing = true;
        started = true;
        switchTo(0);
      } else {
        playing = true;
        started = true;
        active.play();
      }
      startTicking();
      report();
    },
    pause() {
      playing = false;
      waiting = false;
      active.pause();
      stopTicking();
      report();
    },
    toggle() {
      if (playing) engine.pause();
      else engine.play();
    },
    // Jumps to a moment of the reel, in any part
    seek(time) {
      if (parts.length === 0) return;
      ended = false;
      const { index: target, local } = locate(timeline, Math.min(time, total - 0.05));
      if (target === index) {
        active.seek(local);
        lastTime = reelTimeOf(timeline, target, local);
        onTime?.(lastTime);
      } else {
        switchTo(target, local);
      }
      report();
    },
    nextPart() {
      if (index + 1 < parts.length) engine.seek(parts[index + 1].from);
    },
    previousPart() {
      const part = parts[index];
      // Back to the start of this part, or to the part before when already near its start
      const target = lastTime - part.from > 2 || index === 0 ? part.from : parts[index - 1].from;
      engine.seek(target);
    },
    // Plays one part of the reel from its start, as a click on a playlist row does
    playPart(target) {
      if (!parts[target]) return;
      engine.seek(parts[target].from);
      if (!playing) engine.play();
    },
    // 0 to 100
    setVolume(value) {
      const volume = Math.min(Math.max(Math.round(Number(value) || 0), 0), 100);
      decks.forEach((deck) => {
        deck.volume = volume;
      });
      // Before the first play the part waits silently at its start
      if (started) active.applySound();
    },
    setMuted(muted) {
      decks.forEach((deck) => {
        deck.userMuted = Boolean(muted);
      });
      if (started) active.applySound();
    },
    setRate(rate) {
      decks.forEach((deck) => {
        deck.rate = Number(rate) || 1;
        deck.applyRate();
      });
    },
    setLoop(value) {
      loop = Boolean(value);
    },
    destroy() {
      destroyed = true;
      stopTicking();
      decks.forEach((deck) => deck.destroy());
    },
  };
  return engine;
}
