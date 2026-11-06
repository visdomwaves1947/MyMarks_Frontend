// "4:05" or "1:02:09" for a number of seconds
export function formatClock(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = String(total % 60).padStart(2, '0');
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`;
}

// The key a lesson's progress is saved under: its video, or its syllabus topic for a typed YouTube link
export const lessonKeyOf = (entry) => entry?.lesson?.videoId || entry?.nodeId || '';

// Where to start a lesson again: not at the very start or end, and not once it was finished
export function resumePoint(saved) {
  if (!saved || saved.completed) return 0;
  const position = Number(saved.position) || 0;
  const duration = Number(saved.duration) || 0;
  if (position < 5) return 0;
  if (duration > 0 && position > duration - 10) return 0;
  return Math.floor(position);
}

// 0 to 100, for the bar under a lesson
export function watchedPercent(saved) {
  if (!saved) return 0;
  if (saved.completed) return 100;
  const duration = Number(saved.duration) || 0;
  return duration > 0 ? Math.min(100, Math.round(((Number(saved.position) || 0) / duration) * 100)) : 0;
}
