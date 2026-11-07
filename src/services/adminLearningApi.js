import { adminFetch } from './api';

// Admin: a student's courses (bought, given or removed) and where they stopped watching

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMessage);
  return data;
};

const sendJson = (path, method, body) =>
  adminFetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

export async function fetchStudentLearning(userId) {
  return readJson(await adminFetch(`/api/admin/users/${userId}/learning`), "Could not load this student's courses.");
}

export async function grantStudentCourse(userId, courseId, note = '') {
  return readJson(await sendJson(`/api/admin/users/${userId}/purchases`, 'POST', { courseId, note }), 'Could not give this course.');
}

export async function revokeStudentCourse(userId, purchaseId) {
  return readJson(await sendJson(`/api/admin/users/${userId}/purchases/${purchaseId}`, 'DELETE'), 'Could not remove this course.');
}
