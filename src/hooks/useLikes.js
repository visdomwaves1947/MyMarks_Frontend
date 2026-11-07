import { useEffect, useSyncExternalStore } from 'react';
import { fetchLikes, likeCourseRequest, unlikeCourseRequest } from '../services/learningApi';

/**
 * The signed-in student's liked courses, kept on their account and shared by every heart on the page.
 * A heart changes at once and goes back if the server says no.
 */

const EMPTY = { token: null, status: 'none', courses: [] };
let state = EMPTY;
let loadingFor = null;
const listeners = new Set();

const publish = (next) => {
  state = next;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const load = (token) => {
  if (loadingFor === token) return;
  loadingFor = token;
  publish({ token, status: 'loading', courses: [] });
  fetchLikes().then(
    (data) => {
      if (loadingFor === token) publish({ token, status: 'ready', courses: data.courses || [] });
    },
    () => {
      if (loadingFor === token) publish({ token, status: 'error', courses: [] });
    }
  );
};

// What the Liked Courses page shows for a course liked just now, until the list loads again
const summaryOf = (course) => ({
  _id: String(course._id),
  name: course.name,
  slug: course.slug,
  thumbnail: course.thumbnail || '',
  price: course.price,
  oldPrice: course.oldPrice,
  shortDescription: course.shortDescription || '',
  sellOnline: course.sellOnline,
  mostBought: Boolean(course.mostBought),
  bestValue: Boolean(course.bestValue),
  tagLabel: course.tagLabel || '',
  streams: course.streams || [],
  likedAt: new Date().toISOString(),
});

export async function toggleLike(course) {
  const id = String(course._id);
  const before = state;
  const liked = before.courses.some((item) => item._id === id);
  publish({
    ...before,
    courses: liked ? before.courses.filter((item) => item._id !== id) : [summaryOf(course), ...before.courses],
  });
  try {
    if (liked) await unlikeCourseRequest(id);
    else await likeCourseRequest(id);
  } catch (error) {
    if (state.token === before.token) publish({ ...state, courses: before.courses });
    throw error;
  }
}

export default function useLikes(currentUser) {
  const token = currentUser && currentUser.role !== 'admin' ? currentUser.token || null : null;
  const snapshot = useSyncExternalStore(subscribe, () => state, () => state);

  useEffect(() => {
    if (token && state.token !== token) load(token);
    if (!token && state.token) {
      loadingFor = null;
      publish(EMPTY);
    }
  }, [token]);

  const mine = token && snapshot.token === token ? snapshot : { ...EMPTY, status: token ? 'loading' : 'none' };
  return {
    status: mine.status,
    courses: mine.courses,
    count: mine.courses.length,
    isLiked: (id) => mine.courses.some((item) => item._id === String(id)),
    toggle: toggleLike,
  };
}
