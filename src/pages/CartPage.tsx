import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import type { CartItem } from '../types';
import { saveOrder } from '../lib/orders';

interface DeliveryDetails {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

const EMPTY_DELIVERY: DeliveryDetails = { name: '', phone: '', address: '', notes: '' };

function validate(details: DeliveryDetails) {
  const errors: Partial<Record<keyof DeliveryDetails, string>> = {};
  if (details.name.trim().length < 2) errors.name = 'Please enter your full name';
  if (!/^[0-9+\-()\s]{7,15}$/.test(details.phone.trim()))
    errors.phone = 'Enter a valid phone number (7–15 digits)';
  if (details.address.trim().length < 8) errors.address = 'Please enter a detailed delivery address';
  return errors;
}

export function CartPage() {
  const { items, remove, increment, decrement, clear, totalPrice } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [details, setDetails] = useState<DeliveryDetails>(EMPTY_DELIVERY);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryDetails, string>>>({});
  // Snapshot of the order so the confirmation screen can show it after the cart is cleared
  const [order, setOrder] = useState<{ items: CartItem[]; total: number; id: string } | null>(null);

  if (step === 'confirmed' && order) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Order Placed!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Thanks{details.name ? `, ${details.name.split(' ')[0]}` : ''}! Your food is being prepared and will
          arrive shortly.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">Order ID: <span className="font-mono font-semibold">{order.id}</span></p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          Delivering to: {details.address.trim()}
        </p>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 text-left mb-8">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Order summary</h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.quantity} × {i.name}
                </span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 dark:border-gray-800 mt-3 pt-3 flex justify-between font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/orders"
            className="inline-block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold px-6 py-3 rounded-2xl transition-colors hover:border-brand-400"
          >
            View Orders
          </Link>
          <Link
            to="/"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Add some delicious dishes from the menu.</p>
        <Link
          to="/"
          className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  if (step === 'checkout') {
    const handleChange = (field: keyof DeliveryDetails) => (value: string) => {
      setDetails((d) => ({ ...d, [field]: value }));
      setErrors((e) => ({ ...e, [field]: undefined }));
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      const errs = validate(details);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
      const saved = saveOrder({ details, items, total: totalPrice });
      setOrder({ items, total: totalPrice, id: saved.id });
      clear();
      setStep('confirmed');
    };

    const inputClass = (field: keyof DeliveryDetails) =>
      `w-full px-4 py-3 rounded-2xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${
        errors[field] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
      }`;

    return (
      <main className="max-w-lg mx-auto px-4 py-8">
        <button
          onClick={() => setStep('cart')}
          className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 transition-colors mb-4 flex items-center gap-1"
        >
          ← Back to cart
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Checkout</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Where should we deliver your order?</p>

        <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full name</label>
            <input
              id="name"
              type="text"
              value={details.name}
              onChange={(e) => handleChange('name')(e.target.value)}
              placeholder="Jon Doe"
              autoComplete="name"
              className={inputClass('name')}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone number</label>
            <input
              id="phone"
              type="tel"
              value={details.phone}
              onChange={(e) => handleChange('phone')(e.target.value)}
              placeholder="+1 234 567 890"
              autoComplete="tel"
              className={inputClass('phone')}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery address</label>
            <textarea
              id="address"
              value={details.address}
              onChange={(e) => handleChange('address')(e.target.value)}
              placeholder="Street, building, apartment, city…"
              rows={3}
              className={`${inputClass('address')} resize-none`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Delivery notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="notes"
              type="text"
              value={details.notes}
              onChange={(e) => handleChange('notes')(e.target.value)}
              placeholder="e.g. Leave at the door"
              className={inputClass('notes')}
            />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-colors text-lg"
          >
            Place Order
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Your Cart</h1>

      <ul className="space-y-4 mb-8">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
              <p className="text-sm text-gray-400 mb-2">{item.category}</p>

              <div className="flex items-center justify-between">
                {/* Quantity controls */}
                <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => decrement(item.id)}
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-bold"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-2 font-semibold text-sm min-w-[1.5rem] text-center text-gray-800 dark:text-gray-100">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increment(item.id)}
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-bold"
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Delivery fee</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between font-bold text-lg text-gray-900 dark:text-white mb-6">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={() => setStep('checkout')}
          className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-colors text-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}
