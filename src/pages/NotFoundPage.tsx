import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-7xl mb-6">🍜</p>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">404 — Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like this dish fell off the menu.</p>
      <Link
        to="/"
        className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
      >
        Back to Menu
      </Link>
    </main>
  );
}
