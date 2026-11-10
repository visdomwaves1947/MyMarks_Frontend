import { useEffect, useSyncExternalStore } from 'react';
import { fetchNotes } from '../services/learningApi';

/**
 * A student's notes for each course, kept for the whole visit: one note for each video
 * (id "v:<lesson key>") and older chapter notes (id "c:<chapter key>").
 * Opening My Notes again, or another lesson, shows them at once and refreshes them quietly.
 */

export const videoNoteId = (lessonKey) => `v:${lessonKey}`;
export const chapterNoteId = (chapterKey) => `c:${chapterKey}`;
const idOf = (note) => (note.kind === 'video' || note.lessonKey ? videoNoteId(note.lessonKey) : chapterNoteId(note.chapterKey));

const courses = new Map(); // courseId -> { token, status, notes: { id: note }, typed: { id: note } }
const listeners = new Set();
let version = 0;

const notify = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const load = (courseId, token) => {
  const known = courses.get(courseId);
  const fresh = known && known.token === token && known.status === 'ready';
  courses.set(courseId, {
    token,
    notes: fresh ? known.notes : {},
    typed: fresh ? known.typed : {},
    status: fresh ? 'ready' : 'loading',
    refreshing: true,
  });
  notify();
  fetchNotes(courseId).then(
    (data) => {
      const current = courses.get(courseId);
      if (!current || current.token !== token) return;
      const fromServer = Object.fromEntries((data.notes || []).map((note) => [idOf(note), note]));
      // A note typed while the list was on its way wins over the older copy
      const notes = { ...fromServer, ...current.typed };
      Object.keys(notes).forEach((id) => {
        if (!notes[id]) delete notes[id];
      });
      courses.set(courseId, { token, status: 'ready', notes, typed: current.typed });
      notify();
    },
    () => {
      const current = courses.get(courseId);
      if (!current || current.token !== token) return;
      courses.set(courseId, { ...current, status: current.status === 'ready' ? 'ready' : 'error', refreshing: false });
      notify();
    }
  );
};

// A note as typed or as saved (null or empty text: gone)
export function rememberNote(courseId, id, note) {
  const current = courses.get(courseId);
  if (!current) return;
  const notes = { ...current.notes };
  const typed = { ...(current.typed || {}) };
  if (note?.text) {
    notes[id] = { ...notes[id], ...note };
    typed[id] = notes[id];
  } else {
    delete notes[id];
    typed[id] = null;
  }
  courses.set(courseId, { ...current, notes, typed });
  notify();
}

export default function useCourseNotes(courseId, token) {
  useSyncExternalStore(subscribe, () => version, () => version);

  useEffect(() => {
    if (!courseId || !token) return;
    const known = courses.get(courseId);
    if (!known || known.token !== token || !known.refreshing) load(courseId, token);
  }, [courseId, token]);

  const entry = courseId && token ? courses.get(courseId) : null;
  const mine = entry && entry.token === token ? entry : null;
  return {
    status: mine ? mine.status : 'loading',
    notes: mine ? mine.notes : {},
    retry: () => courseId && token && load(courseId, token),
  };
}
