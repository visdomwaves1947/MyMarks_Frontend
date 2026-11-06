import { useCallback, useEffect, useRef } from 'react';
import { saveLessonProgress } from '../services/learningApi';

const SAVE_EVERY_MS = 10000;

const fresh = () => ({ position: 0, duration: 0, completed: false, savedAt: Date.now(), dirty: false });

/**
 * Saves where the student is in one lesson: at most every 10 seconds while it plays, and at once
 * on pause, at the end, when the lesson changes, when the player closes and when the page is hidden.
 * Returns report(position, duration, { ended, now }) for the video to call.
 */
export default function useLessonTracker({ courseId, lessonKey, enabled, onSaved }) {
  const state = useRef(fresh());

  const flush = useCallback(
    (keepalive = false) => {
      const current = state.current;
      if (!enabled || !lessonKey || !current.dirty) return;
      current.dirty = false;
      current.savedAt = Date.now();
      const values = { position: current.position, duration: current.duration, completed: current.completed };
      saveLessonProgress(courseId, { lessonKey, ...values }, { keepalive });
      onSaved?.(lessonKey, values);
    },
    [courseId, enabled, lessonKey, onSaved]
  );

  useEffect(() => {
    state.current = fresh();
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush(true);
    };
    const onLeave = () => flush(true);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onLeave);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onLeave);
      flush(true);
    };
  }, [flush]);

  return useCallback(
    (position, duration, { ended = false, now = false } = {}) => {
      if (!enabled || !lessonKey) return;
      const current = state.current;
      const seconds = Math.max(0, Number(position) || 0);
      const length = Number.isFinite(Number(duration)) && Number(duration) > 0 ? Number(duration) : current.duration;
      const completed = current.completed || ended || (length > 0 && seconds >= length * 0.95);
      const moved = Math.abs(seconds - current.position) >= 1 || completed !== current.completed || length !== current.duration;
      if (moved) {
        current.position = ended && length ? length : seconds;
        current.duration = length;
        current.completed = completed;
        current.dirty = true;
      }
      if (now || ended || Date.now() - current.savedAt >= SAVE_EVERY_MS) flush();
    },
    [enabled, flush, lessonKey]
  );
}
