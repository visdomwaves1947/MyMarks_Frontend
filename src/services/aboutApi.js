import { adminFetch, resilientFetch } from './api';

const readAbout = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMessage);
  return data.about;
};

// The About Us page as visitors see it
export async function fetchAboutPage() {
  return readAbout(await resilientFetch('/api/about'), 'Could not load the About Us page');
}

// The About Us page with its hidden cards
export async function fetchAdminAboutPage() {
  return readAbout(await adminFetch('/api/admin/about'), 'Could not load the About Us page');
}

export async function saveAdminAboutPage(about) {
  const res = await adminFetch('/api/admin/about', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(about),
  });
  return readAbout(res, 'Could not save the About Us page');
}

export async function resetAdminAboutPage() {
  return readAbout(await adminFetch('/api/admin/about', { method: 'DELETE' }), 'Could not reset the About Us page');
}
