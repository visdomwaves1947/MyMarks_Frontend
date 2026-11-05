import { adminFetch, resilientFetch } from './api';

const readReviews = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMessage);
  return data.reviews;
};

// The home page reviews students can see
export async function fetchStudentReviews() {
  return readReviews(await resilientFetch('/api/reviews'), 'Could not load the reviews');
}

// Every review, hidden ones included
export async function fetchAdminStudentReviews() {
  return readReviews(await adminFetch('/api/admin/reviews'), 'Could not load the reviews');
}

export async function saveAdminStudentReviews(reviews) {
  const res = await adminFetch('/api/admin/reviews', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviews),
  });
  return readReviews(res, 'Could not save the reviews');
}

export async function resetAdminStudentReviews() {
  return readReviews(await adminFetch('/api/admin/reviews', { method: 'DELETE' }), 'Could not reset the reviews');
}
