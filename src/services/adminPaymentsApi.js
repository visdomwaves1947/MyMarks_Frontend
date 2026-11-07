import { adminFetch } from './api';

// Admin: every payment, and the Razorpay settings

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || fallbackMessage);
  return data;
};

const sendJson = (path, method, body) =>
  adminFetch(path, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export async function fetchAdminPayments({ status = 'all', search = '', page = 1 } = {}) {
  const query = new URLSearchParams({ status, search, page: String(page) });
  return readJson(await adminFetch(`/api/admin/payments?${query}`), 'Could not load the payments.');
}

export async function fetchPaymentSettings() {
  const data = await readJson(await adminFetch('/api/admin/payment-settings'), 'Could not load the payment settings.');
  return data.settings;
}

export async function savePaymentSettings(changes) {
  return readJson(await sendJson('/api/admin/payment-settings', 'PUT', changes), 'Could not save the payment settings.');
}

// Resolves { success, message, mode }, also when Razorpay refuses the keys
export async function checkPaymentKeys(keys) {
  const res = await sendJson('/api/admin/payment-settings/test', 'POST', keys);
  const data = await res.json().catch(() => ({}));
  return { success: res.ok && data.success, message: data.message || 'Could not check the keys.', mode: data.mode || '' };
}
