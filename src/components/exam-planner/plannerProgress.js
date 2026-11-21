// Ticked steps and the open day are kept in this browser, per course and roadmap
const PROGRESS_PREFIX = 'mymarks_roadmap_';

export const readProgress = (key) => {
  if (!key) return { done: [], day: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_PREFIX + key) || '{}');
    return { done: Array.isArray(saved.done) ? saved.done : [], day: Number(saved.day) || 0 };
  } catch {
    return { done: [], day: 0 };
  }
};

export const writeProgress = (key, progress) => {
  if (!key) return;
  try {
    localStorage.setItem(PROGRESS_PREFIX + key, JSON.stringify(progress));
  } catch {
    // Private windows can block storage; the ticks then last until the plan is closed
  }
};
