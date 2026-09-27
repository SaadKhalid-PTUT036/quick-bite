import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export function CartPage() {
  const { items, remove, increment, decrement, clear, totalPrice } = useCart();
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Order Placed!</h1>
        <p className="text-gray-500 mb-8">
          Thanks for your order. Your food is being prepared and will arrive shortly.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
        >
          Back to Menu
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some delicious dishes from the menu.</p>
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
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>

      <ul className="space-y-4 mb-8">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item.name}</p>
              <p className="text-sm text-gray-400 mb-2">{item.category}</p>

              <div className="flex items-center justify-between">
                {/* Quantity controls */}
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => decrement(item.id)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-2 font-semibold text-sm min-w-[1.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increment(item.id)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-brand-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>Delivery fee</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900 mb-6">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={() => { clear(); setConfirmed(true); }}
          className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-colors text-lg"
        >
          Place Order
        </button>
      </div>
    </main>
  );
}
