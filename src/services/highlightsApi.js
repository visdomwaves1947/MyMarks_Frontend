import { adminFetch, getStudentToken, resilientFetch } from './api';

// Highlights (parts of lesson videos) and highlight reels (highlights played back to back as one video)

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || fallbackMessage);
    error.status = res.status;
    throw error;
  }
  return data;
};

// As the signed-in student (or admin), so the server can tell what they may play
const viewerFetch = (path) => {
  const token = getStudentToken();
  return resilientFetch(path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
};

const adminSend = (path, method, body) =>
  adminFetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

// ── Students and visitors ───────────────────────────────────────

export async function fetchReel(id) {
  return readJson(await viewerFetch(`/api/highlights/reels/${encodeURIComponent(id)}`), 'Could not load this highlight reel');
}

export async function fetchCourseHighlights(slug) {
  return readJson(await viewerFetch(`/api/highlights/course/${encodeURIComponent(slug)}`), 'Could not load the highlights');
}

// ── Admin ───────────────────────────────────────────────────────

// { subjects, reels, clips } of one subject
export async function fetchAdminHighlights(subject = '') {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return readJson(await adminFetch(`/api/admin/highlights${query}`), 'Could not load the highlights');
}

export async function createHighlight(body) {
  return readJson(await adminSend('/api/admin/highlights', 'POST', body), 'Could not save the highlight');
}

export async function updateHighlight(id, body) {
  return readJson(await adminSend(`/api/admin/highlights/${id}`, 'PUT', body), 'Could not save the highlight');
}

export async function deleteHighlight(id) {
  return readJson(await adminSend(`/api/admin/highlights/${id}`, 'DELETE'), 'Could not delete the highlight');
}

export async function createReel(body) {
  return readJson(await adminSend('/api/admin/highlight-reels', 'POST', body), 'Could not save the reel');
}

export async function updateReel(id, body) {
  return readJson(await adminSend(`/api/admin/highlight-reels/${id}`, 'PUT', body), 'Could not save the reel');
}

export async function deleteReel(id) {
  return readJson(await adminSend(`/api/admin/highlight-reels/${id}`, 'DELETE'), 'Could not delete the reel');
}

// The highlights of a lesson video (times, titles and notes), listed under it in the lesson player
export async function fetchLessonHighlights({ videoId = '', youtubeId = '' } = {}) {
  const query = new URLSearchParams();
  if (videoId) query.set('videoId', videoId);
  if (youtubeId) query.set('youtubeId', youtubeId);
  return readJson(await resilientFetch(`/api/highlights/lesson?${query}`), 'Could not load the highlights');
}
