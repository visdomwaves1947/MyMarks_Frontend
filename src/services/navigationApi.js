import { adminFetch, resilientFetch } from './api';

const readNavigation = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMessage);
  return data.navigation;
};

export async function fetchNavigation() {
  return readNavigation(await resilientFetch('/api/navigation'), 'Could not load the menu');
}

export async function saveAdminNavigation(navigation) {
  const res = await adminFetch('/api/admin/navigation', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(navigation),
  });
  return readNavigation(res, 'Could not save the menu');
}

export async function resetAdminNavigation() {
  return readNavigation(await adminFetch('/api/admin/navigation', { method: 'DELETE' }), 'Could not reset the menu');
}
