import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadOrders, clearOrders, type Order } from '../lib/orders';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export function OrdersPage() {
  // Read once per mount; clear/reload resets the list
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  if (orders.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🧾</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No orders yet</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Your past orders will show up here once you check out.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Your Orders</h1>
        <button
          onClick={() => {
            clearOrders();
            setOrders([]);
          }}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear history
        </button>
      </div>

      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-mono text-sm font-semibold text-brand-600">{order.id}</p>
                <p className="text-xs text-gray-400">{formatDate(order.placedAt)}</p>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                ${order.total.toFixed(2)}
              </span>
            </div>

            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>
                    {i.quantity} × {i.name}
                  </span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 text-xs text-gray-400">
              <p>Delivering to: {order.details.address}</p>
              <p>
                {order.details.name} · {order.details.phone}
                {order.details.notes ? ` · Note: ${order.details.notes}` : ''}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
