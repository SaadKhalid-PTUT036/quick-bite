import type { CartItem } from '../types';

const STORAGE_KEY = 'quickbite_orders';

export interface Order {
  id: string;
  placedAt: string; // ISO timestamp
  details: { name: string; phone: string; address: string; notes?: string };
  items: CartItem[];
  total: number;
}

export function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Omit<Order, 'id' | 'placedAt'>): Order {
  const full: Order = {
    ...order,
    id: `QB-${Date.now().toString(36).toUpperCase()}`,
    placedAt: new Date().toISOString(),
  };
  // Newest first, keep the last 20 orders
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([full, ...loadOrders()].slice(0, 20)));
  } catch {
    // Ignore storage failures — order still confirmed in-session
  }
  return full;
}

export function clearOrders() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
