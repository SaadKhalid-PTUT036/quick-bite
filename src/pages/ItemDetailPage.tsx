import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { MenuItem } from '../types';
import { fetchMealById } from '../lib/api';
import { Skeleton } from '../components/Skeleton';
import { useCart } from '../hooks/useCart';
import { useFavorites, toggleFavorite } from '../lib/favorites';

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { add, items } = useCart();
  const favorites = useFavorites();

  const inCart = item ? items.find((i) => i.id === item.id) : undefined;
  const isFav = item ? favorites.has(item.id) : false;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMealById(id)
      .then((meal) => {
        setItem(meal);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load item');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-5 w-1/4" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🍽️</p>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">{error ?? 'Item not found'}</p>
        <Link to="/" className="text-brand-600 underline text-sm">Back to menu</Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 transition-colors mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to menu
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-72 md:h-96 object-cover"
        />

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                {item.name}
              </h1>
              <span className="inline-block bg-brand-50 dark:bg-brand-700/20 text-brand-700 dark:text-brand-400 text-xs font-semibold px-3 py-1 rounded-full">
                {item.category}
              </span>
              {item.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.tags.split(',').filter(Boolean).map((tag) => (
                    <span key={tag} className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-brand-600">${item.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Add to cart + favorite */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => add(item)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-colors text-base"
              aria-label={`Add ${item.name} to cart`}
            >
              {inCart ? '✓ Add another' : '+ Add to cart'}
            </button>
            <button
              onClick={() => toggleFavorite(item.id)}
              aria-pressed={isFav}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-3.5 rounded-2xl border transition-colors ${
                isFav
                  ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-500/10 dark:border-red-500/30'
                  : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 dark:bg-gray-900 dark:border-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          {item.instructions && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">About this dish</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line line-clamp-[12]">
                {item.instructions}
              </p>
            </div>
          )}

          {/* YouTube */}
          {item.youtube && (
            <a
              href={item.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.615 3.184C17.011 3 12 3 12 3s-5.011 0-7.615.184C2.763 3.4 2.092 4.103 1.917 5.68 1.74 7.275 1.74 10 1.74 10s0 2.727.177 4.32c.175 1.578.846 2.28 2.468 2.496C6.989 17 12 17 12 17s5.011 0 7.615-.184c1.622-.216 2.293-.918 2.468-2.496C22.26 12.727 22.26 10 22.26 10s0-2.725-.177-4.32c-.175-1.577-.846-2.28-2.468-2.496zM9.75 13.02V6.98L15.5 10l-5.75 3.02z"/>
              </svg>
              Watch recipe on YouTube
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
