import { useEffect, useState } from 'react';
import { fetchMyCourses } from '../services/learningApi';
import { COURSE_BOUGHT } from './useCourseCheckout';

/**
 * The signed-in student's courses, with lessons finished and where they stopped.
 * status: 'none' (no student signed in), 'loading', 'ready' or 'error'.
 */
export default function useMyCourses(currentUser) {
  const token = currentUser && currentUser.role !== 'admin' ? currentUser.token || null : null;
  const [state, setState] = useState({ token: null, status: 'loading', courses: [] });
  const [bought, setBought] = useState(0);

  // A course bought anywhere on the site joins the list at once
  useEffect(() => {
    const onBought = () => setBought((count) => count + 1);
    window.addEventListener(COURSE_BOUGHT, onBought);
    return () => window.removeEventListener(COURSE_BOUGHT, onBought);
  }, []);

  useEffect(() => {
    if (!token) return undefined;
    let live = true;
    fetchMyCourses().then(
      (data) => live && setState({ token, status: 'ready', courses: data.courses || [] }),
      () => live && setState({ token, status: 'error', courses: [] })
    );
    return () => {
      live = false;
    };
  }, [token, bought]);

  if (!token) return { status: 'none', courses: [] };
  if (state.token !== token) return { status: 'loading', courses: [] };
  return state;
}

// Where a course's Continue button goes: the course page, straight into the last lesson
export const continueLink = (course) => `/courses/${course.slug}?continue=1`;

// Most recently watched first, then most recently bought
export const byLastActivity = (a, b) => {
  const when = (course) => new Date(course.lastLesson?.updatedAt || course.boughtAt || 0).getTime();
  return when(b) - when(a);
};
