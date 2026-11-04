import { useEffect, useSyncExternalStore } from 'react';
import { fetchNavigation } from '../services/navigationApi';
import { DEFAULT_NAVIGATION } from '../data/navigationDefaults';
import { upgradeNavigation } from '../components/nav/menuSections';

const MAX_AGE_MS = 60 * 1000;

// The navbar shows the built-in menu at once, then the saved one when it arrives
let navigation = DEFAULT_NAVIGATION;
let loadedAt = 0;
let pending = null;
const subscribers = new Set();

const publish = (next) => {
  navigation = next;
  subscribers.forEach((update) => update());
};

const subscribe = (update) => {
  subscribers.add(update);
  return () => subscribers.delete(update);
};

const getNavigation = () => navigation;

const loadNavigation = () => {
  if (!pending) {
    pending = fetchNavigation()
      .then((saved) => {
        loadedAt = Date.now();
        if (saved?.links?.length) publish(upgradeNavigation(saved));
      })
      // A failed load keeps the menu already showing
      .catch(() => {})
      .finally(() => {
        pending = null;
      });
  }
  return pending;
};

/**
 * Show a menu the admin just saved, without waiting for the next load
 */
export const setNavigation = (saved) => {
  loadedAt = Date.now();
  publish(upgradeNavigation(saved));
};

export default function useNavigationMenu() {
  const current = useSyncExternalStore(subscribe, getNavigation);

  useEffect(() => {
    if (Date.now() - loadedAt > MAX_AGE_MS) loadNavigation();
  }, []);

  return current;
}
