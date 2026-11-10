import { getStudentToken, resilientFetch } from './api';

// Buying courses and saving where a student stopped watching. These calls go out as the signed-in student.

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(
      res.status === 401 ? 'Your sign-in has ended. Please sign in again.' : data.message || fallbackMessage
    );
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

const studentFetch = (path, { method = 'GET', body, keepalive = false } = {}) => {
  const token = getStudentToken();
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return resilientFetch(path, { method, headers, keepalive, body: body ? JSON.stringify(body) : undefined });
};

// Makes the Razorpay order for a course (Buy Now), or for a list of course ids (the cart).
// The server sets the amount from the courses' prices.
export async function createCourseOrder(courseIdOrIds) {
  const body = Array.isArray(courseIdOrIds) ? { courseIds: courseIdOrIds } : { courseId: courseIdOrIds };
  return readJson(await studentFetch('/api/payments/orders', { method: 'POST', body }), 'The payment could not be started.');
}

// Sends Razorpay's signed answer back, so the server can open the course
export async function verifyCoursePayment(response) {
  return readJson(await studentFetch('/api/payments/verify', { method: 'POST', body: response }), 'The payment could not be checked.');
}

// The signed-in student's liked courses, newest first
export async function fetchLikes() {
  return readJson(await studentFetch('/api/likes'), 'Could not load your liked courses.');
}

export async function likeCourseRequest(courseId) {
  return readJson(await studentFetch(`/api/likes/${courseId}`, { method: 'PUT' }), 'Could not save the like.');
}

export async function unlikeCourseRequest(courseId) {
  return readJson(await studentFetch(`/api/likes/${courseId}`, { method: 'DELETE' }), 'Could not remove the like.');
}

// Whether the website takes payments online now
export async function fetchPaymentConfig() {
  return readJson(await studentFetch('/api/payments/config'), 'Could not check online payments.');
}

// The courses this student has, with lessons finished and where they stopped
export async function fetchMyCourses() {
  return readJson(await studentFetch('/api/my-courses'), 'Could not load your courses.');
}

// While the payment method is Demo: finish a payment with no money
export async function confirmDemoPayment(orderId) {
  return readJson(await studentFetch('/api/payments/demo/confirm', { method: 'POST', body: { orderId } }), 'The demo payment could not be finished.');
}

export async function fetchCourseProgress(courseId) {
  return readJson(await studentFetch(`/api/progress/${courseId}`), 'Could not load your progress.');
}

// Fire and forget: a missed save only means the lesson resumes a few seconds earlier
export function saveLessonProgress(courseId, progress, { keepalive = false } = {}) {
  return studentFetch(`/api/progress/${courseId}`, { method: 'PUT', body: progress, keepalive }).catch(() => null);
}

// My Highlights: the highlights a student saved, grouped by subject
export async function fetchSavedHighlights() {
  return readJson(await studentFetch('/api/saved-highlights'), 'Could not load your saved highlights.');
}

export async function saveHighlightRequest(highlightId) {
  return readJson(await studentFetch(`/api/saved-highlights/${highlightId}`, { method: 'PUT' }), 'Could not save the highlight.');
}

export async function unsaveHighlightRequest(highlightId) {
  return readJson(await studentFetch(`/api/saved-highlights/${highlightId}`, { method: 'DELETE' }), 'Could not remove the highlight.');
}

// A student's own notes for a course, one per chapter
export async function fetchNotes(courseId) {
  return readJson(await studentFetch(`/api/notes/${courseId}`), 'Could not load your notes.');
}

export async function saveNoteRequest(courseId, chapterKey, { text, chapterName }) {
  return readJson(
    await studentFetch(`/api/notes/${courseId}/${encodeURIComponent(chapterKey)}`, { method: 'PUT', body: { text, chapterName } }),
    'Could not save your note.'
  );
}

// The note of one lesson video, with its title, number and length
export async function saveVideoNoteRequest(courseId, lessonKey, body) {
  return readJson(
    await studentFetch(`/api/notes/${courseId}/lessons/${encodeURIComponent(lessonKey)}`, { method: 'PUT', body }),
    'Could not save your note.'
  );
}

// Every note of the student, by subject, chapter and video (My Notes)
export async function fetchAllNotes() {
  return readJson(await studentFetch('/api/notes'), 'Could not load your notes.');
}
