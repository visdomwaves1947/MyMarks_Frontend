import React, { useEffect, useRef } from 'react';
import { loadYouTubeApi } from '../../utils/youtubeApi';

const YOUTUBE_HOST = 'https://www.youtube-nocookie.com';
const PLAYING = 1;
const PAUSED = 2;
const ENDED = 0;

/**
 * A YouTube lesson that starts where the student stopped. YouTube's API reads the time
 * every few seconds; if it cannot load, the video still plays and only the time is not saved.
 * Nothing is saved until the video has played, so opening and closing a lesson keeps the old place.
 */
// endAt: play only up to this time (a highlight), then stop
// onTime(seconds, length) each second; control.current.seek(seconds) jumps the video there
export function YouTubeLesson({ youtubeId, title, startAt, endAt = 0, report, onEnded, onTime, control }) {
  const frame = useRef(null);
  const reportRef = useRef(report);
  const endedRef = useRef(onEnded);
  const timeRef = useRef(onTime);
  useEffect(() => {
    reportRef.current = report;
    endedRef.current = onEnded;
    timeRef.current = onTime;
  });

  useEffect(() => {
    let player = null;
    let timer = null;
    let clock = null;
    let stopped = false;
    let played = false;

    const send = (options) => {
      if (!played) return;
      try {
        reportRef.current(player.getCurrentTime(), player.getDuration(), options);
      } catch {
        // The player went away first; the last saved time stands
      }
    };

    loadYouTubeApi()
      .then((YT) => {
        if (stopped || !frame.current) return;
        player = new YT.Player(frame.current, {
          host: YOUTUBE_HOST,
          events: {
            onStateChange: (event) => {
              if (event.data === PLAYING || event.data === PAUSED || event.data === ENDED) played = true;
              if (event.data === ENDED) {
                send({ ended: true });
                endedRef.current?.();
              } else if (event.data === PAUSED) send({ now: true });
            },
          },
        });
        timer = setInterval(() => {
          if (player?.getPlayerState?.() === PLAYING) send();
        }, 5000);
        if (control) {
          control.current = {
            seek: (seconds) => {
              try {
                player.seekTo(seconds, true);
                player.playVideo?.();
              } catch {
                // Not ready yet
              }
            },
          };
        }
        // Where the video is, for notes; read every second
        clock = setInterval(() => {
          try {
            const now = Number(player?.getCurrentTime?.());
            const length = Number(player?.getDuration?.());
            if (Number.isFinite(now)) timeRef.current?.(now, Number.isFinite(length) ? length : 0);
          } catch {
            // Not ready yet
          }
        }, 1000);
      })
      .catch(() => {});

    return () => {
      stopped = true;
      clearInterval(timer);
      clearInterval(clock);
      if (control) control.current = null;
      if (player) send({ now: true });
    };
  }, []);

  const start = startAt > 0 ? `&start=${Math.floor(startAt)}` : '';
  const end = endAt > 0 ? `&end=${Math.ceil(endAt)}` : '';
  const origin = encodeURIComponent(window.location.origin);

  return (
    <iframe
      ref={frame}
      src={`${YOUTUBE_HOST}/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1&origin=${origin}${start}${end}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="absolute inset-0 w-full h-full border-0"
    />
  );
}

// An uploaded video lesson that starts where the student stopped, saving only once it has played
export function VideoLesson({ url, startAt, endAt = 0, report, onEnded, onTime, control }) {
  const video = useRef(null);
  const played = useRef(false);
  const stoppedAtEnd = useRef(false);
  const reportRef = useRef(report);
  useEffect(() => {
    reportRef.current = report;
  });

  useEffect(() => {
    const element = video.current;
    if (control) {
      control.current = {
        seek: (seconds) => {
          if (!element) return;
          element.currentTime = seconds;
          element.play().catch(() => {});
        },
      };
    }
    return () => {
      if (control) control.current = null;
      if (element && played.current) reportRef.current(element.currentTime, element.duration, { now: true });
    };
    // The control belongs to this video element for its whole life
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = (options) => {
    const element = video.current;
    if (element && played.current) report(element.currentTime, element.duration, options);
  };

  return (
    <video
      ref={video}
      src={url}
      controls
      autoPlay
      onLoadedMetadata={() => {
        if (startAt > 0 && video.current) video.current.currentTime = startAt;
      }}
      onPlaying={() => {
        played.current = true;
      }}
      onTimeUpdate={() => {
        send();
        if (video.current) onTime?.(video.current.currentTime, Number(video.current.duration) || 0);
        // A highlight stops at its end time
        const element = video.current;
        if (endAt > 0 && element && !stoppedAtEnd.current && element.currentTime >= endAt) {
          stoppedAtEnd.current = true;
          element.pause();
          onEnded?.();
        }
      }}
      onPause={() => send({ now: true })}
      onEnded={() => {
        send({ ended: true });
        onEnded?.();
      }}
      className="absolute inset-0 w-full h-full object-contain bg-black"
    />
  );
}
