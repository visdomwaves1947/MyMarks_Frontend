import { adminFetch, getAdminToken, getStudentToken, resilientFetch } from './api';

// Chapter assignments: multiple-choice questions for each chapter of a course

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || fallbackMessage);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

// As the signed-in student (or an admin trying an assignment), so the server knows who answers
const viewerFetch = (path, { method = 'GET', body } = {}) => {
  const token = getStudentToken() || getAdminToken();
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  return resilientFetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
};

const adminSend = (path, method, body) =>
  adminFetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

// ── Students and visitors ───────────────────────────────────────

// The assignments of a course's chapters, with this student's best result for each
export async function fetchCourseAssignments(courseId) {
  const data = await readJson(await viewerFetch(`/api/assignments/course/${encodeURIComponent(courseId)}`), 'Could not load the assignments');
  return data.assignments || [];
}

// { assignment (with questions when it may be taken), course, attempt (a go left unfinished), preview }
export async function fetchAssignment(id) {
  return readJson(await viewerFetch(`/api/assignments/${encodeURIComponent(id)}`), 'Could not load this assignment');
}

export async function startAssignment(id) {
  return readJson(await viewerFetch(`/api/assignments/${encodeURIComponent(id)}/attempts`, { method: 'POST', body: {} }), 'Could not start the assignment');
}

// { correct, answer (the place of the right one), explanation, score, answered, total }
export async function answerAssignmentQuestion(id, { attemptId, questionId, choice }) {
  return readJson(
    await viewerFetch(`/api/assignments/${encodeURIComponent(id)}/answer`, { method: 'POST', body: { attemptId, questionId, choice } }),
    'Could not check the answer'
  );
}

// { result: { score, total, percent, passed, review }, attempts, best }
export async function finishAssignment(id, { attemptId, answers }) {
  return readJson(
    await viewerFetch(`/api/assignments/${encodeURIComponent(id)}/finish`, { method: 'POST', body: { attemptId, answers } }),
    'Could not finish the assignment'
  );
}

// ── Admin ───────────────────────────────────────────────────────

export async function fetchAdminAssignments(courseId) {
  const data = await readJson(await adminFetch(`/api/admin/assignments?courseId=${encodeURIComponent(courseId)}`), 'Could not load the assignments');
  return data.assignments || [];
}

export async function createAssignment(body) {
  return (await readJson(await adminSend('/api/admin/assignments', 'POST', body), 'Could not save the assignment')).assignment;
}

export async function updateAssignment(id, body) {
  return (await readJson(await adminSend(`/api/admin/assignments/${id}`, 'PUT', body), 'Could not save the assignment')).assignment;
}

export async function deleteAssignment(id) {
  return readJson(await adminSend(`/api/admin/assignments/${id}`, 'DELETE'), 'Could not delete the assignment');
}

// { title, passPercent, students: [{ name, email, mobileNumber, attempts, best, lastAt }] }
export async function fetchAssignmentResults(id) {
  return readJson(await adminFetch(`/api/admin/assignments/${id}/results`), 'Could not load the results');
}
