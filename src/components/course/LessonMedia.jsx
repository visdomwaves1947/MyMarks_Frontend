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
export function YouTubeLesson({ youtubeId, title, startAt, report }) {
  const frame = useRef(null);
  const reportRef = useRef(report);
  useEffect(() => {
    reportRef.current = report;
  });

  useEffect(() => {
    let player = null;
    let timer = null;
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
              if (event.data === ENDED) send({ ended: true });
              else if (event.data === PAUSED) send({ now: true });
            },
          },
        });
        timer = setInterval(() => {
          if (player?.getPlayerState?.() === PLAYING) send();
        }, 5000);
      })
      .catch(() => {});

    return () => {
      stopped = true;
      clearInterval(timer);
      if (player) send({ now: true });
    };
  }, []);

  const start = startAt > 0 ? `&start=${startAt}` : '';
  const origin = encodeURIComponent(window.location.origin);

  return (
    <iframe
      ref={frame}
      src={`${YOUTUBE_HOST}/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1&origin=${origin}${start}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="absolute inset-0 w-full h-full border-0"
    />
  );
}

// An uploaded video lesson that starts where the student stopped, saving only once it has played
export function VideoLesson({ url, startAt, report }) {
  const video = useRef(null);
  const played = useRef(false);
  const reportRef = useRef(report);
  useEffect(() => {
    reportRef.current = report;
  });

  useEffect(() => {
    const element = video.current;
    return () => {
      if (element && played.current) reportRef.current(element.currentTime, element.duration, { now: true });
    };
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
      onTimeUpdate={() => send()}
      onPause={() => send({ now: true })}
      onEnded={() => send({ ended: true })}
      className="absolute inset-0 w-full h-full object-contain bg-black"
    />
  );
}
