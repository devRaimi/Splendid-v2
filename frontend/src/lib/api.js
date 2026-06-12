/**
 * api.js — all backend calls isolated here.
 * Set VITE_API_BASE in your .env to point at a real backend.
 * Without it, falls back to Google Apps Script webhook (VITE_SHEET_WEBHOOK).
 */

export const API_BASE      = import.meta.env.VITE_API_BASE ?? '';
export const SHEET_WEBHOOK = import.meta.env.VITE_SHEET_WEBHOOK ?? '';

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function fetchOrders() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  }
  const res  = await fetch(SHEET_WEBHOOK);
  const data = await res.json();
  return Array.isArray(data?.obj) ? data.obj : [];
}

export async function fetchOrderByRef(ref) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/orders/${ref}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  }
  const orders = await fetchOrders();
  return orders.find(o => o.ref?.toUpperCase() === ref.toUpperCase()) ?? null;
}

export async function createOrder(payload) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create order');
    return res.json();
  }
  await fetch(SHEET_WEBHOOK, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'createOrder', ...payload }),
  });
  return { ref: payload.ref ?? '' };
}

export async function updateOrderStatus(ref, status) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/orders/${ref}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return;
  }
  await fetch(SHEET_WEBHOOK, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'updateStatus', ref, status }),
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }
  const { CONFIG } = await import('./config');
  return CONFIG.PRODUCTS;
}

export async function createProduct(payload) {
  if (!API_BASE) throw new Error('A backend is required for product management');
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id, payload) {
  if (!API_BASE) throw new Error('A backend is required for product management');
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id) {
  if (!API_BASE) throw new Error('A backend is required for product management');
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
}
