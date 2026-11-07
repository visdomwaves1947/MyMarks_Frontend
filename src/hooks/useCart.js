import { useSyncExternalStore } from 'react';
import { COURSE_BOUGHT, boughtIds } from '../utils/purchaseEvents';

/**
 * The cart: courses a visitor or student wants to buy together, kept in this browser, so it works
 * before signing in. The server reads the prices again at checkout; the ones here are only shown.
 */

const KEY = 'mymarks_cart';
export const MAX_CART = 20;

const read = () => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(list) ? list.filter((item) => item && typeof item.id === 'string').slice(0, MAX_CART) : [];
  } catch {
    return [];
  }
};

let items = read();
const listeners = new Set();
const tell = () => listeners.forEach((listener) => listener());

// Kept in memory too, so the cart still works for this visit when the browser blocks storage
const save = (next) => {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage is full or blocked
  }
  tell();
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

if (typeof window !== 'undefined') {
  // Another tab changed the cart
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY && event.key !== null) return;
    items = read();
    tell();
  });
  // Bought courses leave the cart, wherever they were bought
  window.addEventListener(COURSE_BOUGHT, (event) => removeManyFromCart(boughtIds(event)));
}

export const cartItemOf = (course) => ({
  id: String(course._id || course.id),
  slug: course.slug || '',
  name: course.name || '',
  price: Number(course.price) || 0,
  oldPrice: Number(course.oldPrice) || 0,
  image: course.thumbnail || course.image || '',
});

export function addToCart(course) {
  const item = cartItemOf(course);
  if (!item.id || items.some((entry) => entry.id === item.id) || items.length >= MAX_CART) return false;
  save([...items, item]);
  return true;
}

export function removeFromCart(id) {
  removeManyFromCart([id]);
}

export function removeManyFromCart(ids) {
  const gone = new Set(ids.map(String));
  if (!items.some((item) => gone.has(item.id))) return;
  save(items.filter((item) => !gone.has(item.id)));
}

export default function useCart() {
  const list = useSyncExternalStore(subscribe, () => items, () => items);
  return {
    items: list,
    count: list.length,
    total: list.reduce((sum, item) => sum + item.price, 0),
    has: (id) => list.some((item) => item.id === String(id)),
    isFull: list.length >= MAX_CART,
  };
}
