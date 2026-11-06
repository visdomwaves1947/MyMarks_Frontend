import { useEffect, useSyncExternalStore } from 'react';
import { fetchHomePage } from '../services/homeApi';
import { DEFAULT_HOME } from '../data/homePageDefaults';

const MAX_AGE_MS = 60 * 1000;

// The home page shows the built-in sections at once, then the saved ones when they arrive
let home = DEFAULT_HOME;
let loadedAt = 0;
let pending = null;
const subscribers = new Set();

const shown = (items) => (items || []).filter((item) => item.visible !== false);

const publish = (next) => {
  home = {
    ...next,
    howToUse: { ...next.howToUse, steps: shown(next.howToUse?.steps) },
    whyChoose: { ...next.whyChoose, items: shown(next.whyChoose?.items) },
    reviews: { ...next.reviews, items: shown(next.reviews?.items) },
  };
  subscribers.forEach((update) => update());
};

const subscribe = (update) => {
  subscribers.add(update);
  return () => subscribers.delete(update);
};

const getHome = () => home;

const loadHome = () => {
  if (!pending) {
    pending = fetchHomePage()
      .then((saved) => {
        loadedAt = Date.now();
        if (saved) publish(saved);
      })
      // A failed load keeps the sections already showing
      .catch(() => {})
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};

/**
 * Show sections the admin just saved, without waiting for the next load
 */
export const setHomePage = (saved) => {
  loadedAt = Date.now();
  publish(saved);
};

export default function useHomePage() {
  const current = useSyncExternalStore(subscribe, getHome);

  useEffect(() => {
    if (Date.now() - loadedAt > MAX_AGE_MS) loadHome();
  }, []);

  return current;
}
