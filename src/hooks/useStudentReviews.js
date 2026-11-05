import { useEffect, useSyncExternalStore } from 'react';
import { fetchStudentReviews } from '../services/reviewsApi';
import { DEFAULT_REVIEWS } from '../data/studentReviewsDefaults';

const MAX_AGE_MS = 60 * 1000;

// The home page shows the built-in reviews at once, then the saved ones when they arrive
let reviews = DEFAULT_REVIEWS;
let loadedAt = 0;
let pending = null;
const subscribers = new Set();

const shownOnly = (saved) => ({ ...saved, items: (saved.items || []).filter((item) => item.visible !== false) });

const publish = (next) => {
  reviews = shownOnly(next);
  subscribers.forEach((update) => update());
};

const subscribe = (update) => {
  subscribers.add(update);
  return () => subscribers.delete(update);
};

const getReviews = () => reviews;

const loadReviews = () => {
  if (!pending) {
    pending = fetchStudentReviews()
      .then((saved) => {
        loadedAt = Date.now();
        if (saved) publish(saved);
      })
      // A failed load keeps the reviews already showing
      .catch(() => {})
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};

/**
 * Show reviews the admin just saved, without waiting for the next load
 */
export const setStudentReviews = (saved) => {
  loadedAt = Date.now();
  publish(saved);
};

export default function useStudentReviews() {
  const current = useSyncExternalStore(subscribe, getReviews);

  useEffect(() => {
    if (Date.now() - loadedAt > MAX_AGE_MS) loadReviews();
  }, []);

  return current;
}
