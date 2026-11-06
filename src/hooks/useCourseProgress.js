import { useCallback, useEffect, useState } from 'react';
import { fetchCourseProgress } from '../services/learningApi';

const EMPTY = { lessons: {}, last: null };

/**
 * Where the signed-in student stopped in each lesson of a course.
 * update() is called by the lecture player each time it saves, so cards and the
 * Continue button change without asking the server again.
 */
export default function useCourseProgress(courseId, enabled) {
  const isOn = Boolean(enabled && courseId);
  // Kept with the course it belongs to, so another course or signing out shows nothing old
  const [saved, setSaved] = useState({ courseId: null, ...EMPTY });

  useEffect(() => {
    if (!isOn) return undefined;
    let live = true;
    fetchCourseProgress(courseId)
      .then((data) => {
        if (live) setSaved({ courseId, lessons: data.lessons || {}, last: data.last || null });
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [courseId, isOn]);

  const update = useCallback(
    (lessonKey, values) => {
      setSaved((previous) => {
        const lessons = previous.courseId === courseId ? previous.lessons : {};
        const before = lessons[lessonKey] || {};
        return {
          courseId,
          lessons: { ...lessons, [lessonKey]: { ...before, ...values, completed: Boolean(before.completed || values.completed) } },
          last: lessonKey,
        };
      });
    },
    [courseId]
  );

  const progress = isOn && saved.courseId === courseId ? { lessons: saved.lessons, last: saved.last } : EMPTY;
  return { progress, update, enabled: isOn };
}
