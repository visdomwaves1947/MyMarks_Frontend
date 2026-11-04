import { adminFetch, getAdminToken, resilientFetch } from './api';

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMessage);
  return data;
};

const sendJson = (path, method, body) =>
  adminFetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

/**
 * Published course cards. Unlike the old content calls this has no sample data
 * to fall back on, so a failure reaches the page and it can offer a retry.
 */
export async function fetchPublicCourses() {
  const data = await readJson(await resilientFetch('/api/courses'), 'Could not load courses');
  return data.courses;
}

export async function fetchPublicStreams() {
  const data = await readJson(await resilientFetch('/api/streams'), 'Could not load streams');
  return data.streams;
}

/**
 * One full course page. The admin token opens drafts for preview.
 * Returns null when the course does not exist or is not published.
 */
export async function fetchCoursePage(slug) {
  const token = getAdminToken();
  const res = await resilientFetch(`/api/courses/${encodeURIComponent(slug)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 404) return null;
  return readJson(res, 'Could not load this course');
}

// ── Admin: courses ───────────────────────────────────────────────

export async function fetchAdminCourses() {
  const data = await readJson(await adminFetch('/api/admin/courses'), 'Could not load courses');
  return data.courses;
}

// Lessons on each course page, and how many are YouTube links typed into the syllabus
export async function fetchAdminCourseLessonCounts() {
  const data = await readJson(await adminFetch('/api/admin/courses/lesson-counts'), 'Could not count the lessons');
  return data.counts;
}

// A course page as students see it. The admin also gets drafts and premium lessons.
export async function fetchAdminCoursePage(slug) {
  const data = await readJson(await adminFetch(`/api/courses/${slug}`), 'Could not load this course page');
  return data.curriculum;
}

export async function fetchAdminCourse(id) {
  return readJson(await adminFetch(`/api/admin/courses/${id}`), 'Could not load this course');
}

export async function createAdminCourse(course) {
  const data = await readJson(await sendJson('/api/admin/courses', 'POST', course), 'Could not add this course');
  return data.course;
}

export async function updateAdminCourse(id, course) {
  const data = await readJson(await sendJson(`/api/admin/courses/${id}`, 'PUT', course), 'Could not save this course');
  return data.course;
}

export async function setAdminCourseStatus(id, status) {
  const data = await readJson(
    await sendJson(`/api/admin/courses/${id}/status`, 'PATCH', { status }),
    'Could not change the status'
  );
  return data.course;
}

export async function saveAdminCourseOrder(ids) {
  return readJson(await sendJson('/api/admin/courses/order', 'PATCH', { ids }), 'Could not save the order');
}

export async function storeImageFromLink(url) {
  const data = await readJson(
    await sendJson('/api/admin/courses/image-from-link', 'POST', { url }),
    'Could not store this image'
  );
  return data.data;
}

// ── Admin: curriculum ────────────────────────────────────────────

export async function fetchAdminCurriculum(id) {
  return readJson(await adminFetch(`/api/admin/courses/${id}/curriculum`), 'Could not load the curriculum');
}

export async function saveAdminCurriculum(id, chapters) {
  return readJson(
    await sendJson(`/api/admin/courses/${id}/curriculum`, 'PUT', { chapters }),
    'Could not save the curriculum'
  );
}

export async function importAdminCurriculum(id, file, { preview, mode }) {
  const form = new FormData();
  form.append('file', file);
  const query = new URLSearchParams({ preview: String(preview), mode }).toString();

  return readJson(
    await adminFetch(`/api/admin/courses/${id}/curriculum/import?${query}`, { method: 'POST', body: form }),
    'Could not import this file'
  );
}

// ── Admin: streams and requests ──────────────────────────────────

export async function fetchAdminStreams() {
  const data = await readJson(await adminFetch('/api/admin/streams'), 'Could not load streams');
  return data.streams;
}

export async function createAdminStream(stream) {
  const data = await readJson(await sendJson('/api/admin/streams', 'POST', stream), 'Could not add this stream');
  return data.stream;
}

export async function updateAdminStream(id, stream) {
  const data = await readJson(await sendJson(`/api/admin/streams/${id}`, 'PUT', stream), 'Could not save this stream');
  return data.stream;
}

export async function deleteAdminStream(id) {
  return readJson(await adminFetch(`/api/admin/streams/${id}`, { method: 'DELETE' }), 'Could not delete this stream');
}

export async function saveAdminStreamOrder(ids) {
  return readJson(await sendJson('/api/admin/streams/order', 'PATCH', { ids }), 'Could not save the order');
}

// ── Admin: boards and years ──────────────────────────────────────

export async function fetchAdminCourseOptions() {
  const data = await readJson(await adminFetch('/api/admin/course-options'), 'Could not load boards and years');
  return { boards: data.boards, years: data.years };
}

export async function createAdminCourseOption(kind, name) {
  const data = await readJson(await sendJson('/api/admin/course-options', 'POST', { kind, name }), 'Could not add it');
  return data.option;
}

export async function updateAdminCourseOption(id, changes) {
  return readJson(await sendJson(`/api/admin/course-options/${id}`, 'PUT', changes), 'Could not save it');
}

export async function deleteAdminCourseOption(id) {
  return readJson(await adminFetch(`/api/admin/course-options/${id}`, { method: 'DELETE' }), 'Could not delete it');
}

export async function saveAdminCourseOptionOrder(ids) {
  return readJson(await sendJson('/api/admin/course-options/order', 'PATCH', { ids }), 'Could not save the order');
}

export async function fetchNewBookingCount() {
  const data = await readJson(await adminFetch('/api/admin/bookings/new-count'), 'Could not load the count');
  return data.count;
}
