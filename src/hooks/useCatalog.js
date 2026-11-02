import { useEffect, useSyncExternalStore } from 'react';
import { fetchPublicCourses, fetchPublicStreams } from '../services/courseApi';

const MAX_AGE_MS = 60 * 1000;

// Navbar, Footer, home page and profile all read the same list, so they share one request
let state = { courses: [], streams: [], isLoaded: false, error: null };
let loadedAt = 0;
let pending = null;
const subscribers = new Set();

const setState = (changes) => {
  state = { ...state, ...changes };
  subscribers.forEach((update) => update());
};

const subscribe = (update) => {
  subscribers.add(update);
  return () => subscribers.delete(update);
};

const getState = () => state;

const loadCatalog = () => {
  if (!pending) {
    if (state.error) setState({ error: null });

    pending = Promise.all([fetchPublicCourses(), fetchPublicStreams()])
      .then(([courses, streams]) => {
        loadedAt = Date.now();
        setState({ courses, streams, isLoaded: true, error: null });
      })
      .catch((error) => setState({ error }))
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};

/**
 * Forget the saved list, so the next page shows what the admin just changed
 */
export const refreshCatalog = () => {
  loadedAt = 0;
  return loadCatalog();
};

export default function useCatalog() {
  const { courses, streams, isLoaded, error } = useSyncExternalStore(subscribe, getState);

  useEffect(() => {
    if (Date.now() - loadedAt > MAX_AGE_MS) {
      loadCatalog();
    }
  }, []);

  return {
    courses,
    streams,
    isLoading: !isLoaded && !error,
    // A failed refresh keeps showing the list that already loaded
    error: isLoaded ? null : error,
    retry: loadCatalog,
  };
}
