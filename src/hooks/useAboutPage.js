import { useEffect, useSyncExternalStore } from 'react';
import { fetchAboutPage } from '../services/aboutApi';
import { DEFAULT_ABOUT } from '../data/aboutPageDefaults';

const MAX_AGE_MS = 60 * 1000;

// Null until the first load, so the page never shows one set of leaders and then swaps to another.
// If the API is down, the built-in page shows instead.
let about = null;
let loadedAt = 0;
let pending = null;
const subscribers = new Set();

const shown = (items) => (items || []).filter((item) => item.visible !== false);

const publish = (next) => {
  about = {
    ...next,
    leaders: shown(next.leaders),
    inspirations: { ...next.inspirations, items: shown(next.inspirations?.items) },
  };
  subscribers.forEach((update) => update());
};

const subscribe = (update) => {
  subscribers.add(update);
  return () => subscribers.delete(update);
};

const getAbout = () => about;

const loadAbout = () => {
  if (!pending) {
    pending = fetchAboutPage()
      .then((saved) => {
        loadedAt = Date.now();
        if (saved) publish(saved);
      })
      .catch(() => {
        if (!about) publish(DEFAULT_ABOUT);
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};

/**
 * Show a page the admin just saved, without waiting for the next load
 */
export const setAboutPage = (saved) => {
  loadedAt = Date.now();
  publish(saved);
};

export default function useAboutPage() {
  const current = useSyncExternalStore(subscribe, getAbout);

  useEffect(() => {
    if (Date.now() - loadedAt > MAX_AGE_MS) loadAbout();
  }, []);

  return current;
}
