import { adminFetch, resilientFetch } from './api';

const readHome = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMessage);
  return data.home;
};

// The home page sections as visitors see them
export async function fetchHomePage() {
  return readHome(await resilientFetch('/api/home'), 'Could not load the home page');
}

// The home page sections with their hidden cards
export async function fetchAdminHomePage() {
  return readHome(await adminFetch('/api/admin/home'), 'Could not load the home page');
}

export async function saveAdminHomePage(home) {
  const res = await adminFetch('/api/admin/home', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(home),
  });
  return readHome(res, 'Could not save the home page');
}

export async function resetAdminHomePage() {
  return readHome(await adminFetch('/api/admin/home', { method: 'DELETE' }), 'Could not reset the home page');
}
