import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Category, MenuItem } from '../types';
import { fetchCategories, fetchMealsByCategory, fetchMealsByIds, searchMeals } from '../lib/api';
import { useFavorites } from '../lib/favorites';
import { CategoryFilter } from '../components/CategoryFilter';
import { MenuItemCard } from '../components/MenuItemCard';
import { MenuItemSkeleton } from '../components/Skeleton';

const DEFAULT_CATEGORY = 'Seafood';

export function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const favorites = useFavorites();

  // URL is the source of truth for filters -> shareable & back-button friendly
  const selectedCategory = searchParams.get('cat') ?? DEFAULT_CATEGORY;
  const query = searchParams.get('q') ?? '';
  const favOnly = searchParams.get('fav') === '1';

  // Local input value; debounced into the URL `q` param below
  const [search, setSearch] = useState(query);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const isSearch = query.trim().length >= 2;
  const isFavMode = favOnly && !isSearch;

  // Push the typed search into the URL after a short debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        const trimmed = search.trim();
        if (trimmed) next.set('q', trimmed);
        else next.delete('q');
        return next;
      }, { replace: true });
    }, 350);
    return () => clearTimeout(timer);
  }, [search, setSearchParams]);

  // Load categories once
  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        setCatLoading(false);
        // If we land on a default category, reflect it in the URL
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (!next.get('cat')) next.set('cat', DEFAULT_CATEGORY);
          return next;
        }, { replace: true });
      })
      .catch(() => setCatLoading(false));
  }, [setSearchParams]);

  // Load dishes whenever the active "mode" changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        let data: MenuItem[];
        if (isSearch) {
          data = await searchMeals(query.trim());
        } else if (isFavMode) {
          data = await fetchMealsByIds([...favorites]);
        } else {
          data = await fetchMealsByCategory(selectedCategory);
        }
        if (!cancelled) setItems(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();

    return () => { cancelled = true; };
    // favorites intentionally omitted: only read when entering fav mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, query, favOnly, isSearch, isFavMode, retryKey]);

  const selectCategory = (cat: string) => {
    setSearch('');
    setSearchParams({ cat });
  };

  const toggleFavMode = () => {
    setSearch('');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      if (favOnly) next.delete('fav');
      else next.set('fav', '1');
      return next;
    });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          What are you craving?
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Fresh ingredients, bold flavours — delivered fast.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search all dishes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 shadow-sm"
          aria-label="Search dishes"
        />
      </div>

      {/* Category filter + favorites toggle */}
      <div className="mb-8 flex items-start gap-2">
        <button
          onClick={toggleFavMode}
          aria-pressed={favOnly}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
            favOnly
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-500 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill={favOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Favorites
          {favorites.size > 0 && (
            <span className={`text-xs font-bold ${favOnly ? 'text-white' : 'text-red-500'}`}>{favorites.size}</span>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={selectCategory}
            loading={catLoading}
          />
        </div>
      </div>

      {/* Grid */}
      {error ? (
        <div className="text-center py-16">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => setRetryKey((k) => k + 1)}
            className="mt-4 text-sm text-brand-600 underline"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <MenuItemSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">{isFavMode ? '❤️' : '🍽️'}</p>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            {isSearch
              ? `No results for “${query.trim()}”`
              : isFavMode
                ? 'No favorites yet — tap the heart on a dish to save it'
                : 'No dishes found'}
          </p>
          {(search || favOnly) && (
            <button
              onClick={() => { setSearch(''); setSearchParams({ cat: selectedCategory }); }}
              className="mt-3 text-sm text-brand-600 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {isSearch ? (
              <>
                {items.length} result{items.length === 1 ? '' : 's'} for “
                <span className="font-semibold text-gray-700 dark:text-gray-200">{query.trim()}</span>” across all categories
              </>
            ) : isFavMode ? (
              <>Showing your favorites</>
            ) : null}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
