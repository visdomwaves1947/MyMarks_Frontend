import { getStudentToken, resilientFetch } from './api';

/**
 * The site search: highlights, highlight reels, lessons and courses.
 * Sent as the signed-in student, so highlights they may play come with their video.
 */
export async function fetchSearch(query, { signal } = {}) {
  const token = getStudentToken();
  const res = await resilientFetch(`/api/search?q=${encodeURIComponent(query)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'The search did not work. Please try again.');
  return data;
}
