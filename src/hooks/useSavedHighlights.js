import { useEffect, useSyncExternalStore } from 'react';
import { fetchSavedHighlights, saveHighlightRequest, unsaveHighlightRequest } from '../services/learningApi';

/**
 * The signed-in student's My Highlights box, shared by every Save button on the page.
 * A button changes at once and goes back if the server says no; the box reloads after each change.
 */

const EMPTY = { token: null, status: 'none', ids: [], subjects: [] };
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

const fetchInto = (token) =>
  fetchSavedHighlights().then(
    (data) => {
      if (state.token === token || loadingFor === token) {
        publish({ token, status: 'ready', ids: (data.ids || []).map(String), subjects: data.subjects || [] });
      }
    },
    () => {
      if (loadingFor === token && state.status === 'loading') publish({ token, status: 'error', ids: [], subjects: [] });
    }
  );

const load = (token) => {
  if (loadingFor === token) return;
  loadingFor = token;
  publish({ token, status: 'loading', ids: [], subjects: [] });
  fetchInto(token);
};

export async function toggleSavedHighlight(highlightId) {
  const id = String(highlightId);
  const before = state;
  const saved = before.ids.includes(id);
  publish({
    ...before,
    ids: saved ? before.ids.filter((item) => item !== id) : [id, ...before.ids],
    subjects: saved
      ? before.subjects
          .map((group) => ({ ...group, highlights: group.highlights.filter((clip) => String(clip._id) !== id) }))
          .filter((group) => group.highlights.length > 0)
      : before.subjects,
  });
  try {
    if (saved) await unsaveHighlightRequest(id);
    else await saveHighlightRequest(id);
    // The box's subjects, order and times come from the server
    if (state.token === before.token) fetchInto(before.token);
  } catch (error) {
    if (state.token === before.token) publish({ ...state, ids: before.ids, subjects: before.subjects });
    throw error;
  }
}

export default function useSavedHighlights(currentUser) {
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
    subjects: mine.subjects,
    count: mine.ids.length,
    isSaved: (id) => mine.ids.includes(String(id)),
    toggle: toggleSavedHighlight,
    // Students only: administrators see every highlight
    canSave: Boolean(currentUser) && currentUser.role !== 'admin',
  };
}
