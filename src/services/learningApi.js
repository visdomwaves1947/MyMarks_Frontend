import { getStudentToken, resilientFetch } from './api';

// Buying courses and saving where a student stopped watching. These calls go out as the signed-in student.

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(
      res.status === 401 ? 'Your sign-in has ended. Please sign in again.' : data.message || fallbackMessage
    );
    error.status = res.status;
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

// Makes the Razorpay order for a course. The server sets the amount from the course's price.
export async function createCourseOrder(courseId) {
  return readJson(await studentFetch('/api/payments/orders', { method: 'POST', body: { courseId } }), 'The payment could not be started.');
}

// Sends Razorpay's signed answer back, so the server can open the course
export async function verifyCoursePayment(response) {
  return readJson(await studentFetch('/api/payments/verify', { method: 'POST', body: response }), 'The payment could not be checked.');
}

export async function fetchCourseProgress(courseId) {
  return readJson(await studentFetch(`/api/progress/${courseId}`), 'Could not load your progress.');
}

// Fire and forget: a missed save only means the lesson resumes a few seconds earlier
export function saveLessonProgress(courseId, progress, { keepalive = false } = {}) {
  return studentFetch(`/api/progress/${courseId}`, { method: 'PUT', body: progress, keepalive }).catch(() => null);
}
