import { useState, useEffect } from 'react';
import type { Category, MenuItem } from '../types';
import { fetchCategories, fetchMealsByCategory, searchMeals } from '../lib/api';
import { CategoryFilter } from '../components/CategoryFilter';
import { MenuItemCard } from '../components/MenuItemCard';
import { MenuItemSkeleton } from '../components/Skeleton';

export function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('Seafood');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [results, setResults] = useState<MenuItem[]>([]);
  const [searching, setSearching] = useState(false);

  // Load categories once
  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        setCatLoading(false);
      })
      .catch(() => setCatLoading(false));
  }, []);

  // Load items whenever category changes (skipped while a search is active)
  useEffect(() => {
    if (search.trim()) return;
    setItemsLoading(true);
    setError(null);
    fetchMealsByCategory(selectedCategory)
      .then((meals) => {
        setItems(meals);
        setItemsLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setItemsLoading(false);
      });
  }, [selectedCategory, search]);

  // Debounced global search across all dishes (TheMealDB search endpoint)
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    setError(null);
    const timer = setTimeout(() => {
      searchMeals(q)
        .then(setResults)
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : 'Search failed');
          setResults([]);
        })
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const isSearch = search.trim().length >= 2;
  const visibleItems = isSearch ? results : items;
  const loading = isSearch ? searching : itemsLoading;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          What are you craving?
        </h1>
        <p className="text-gray-500 text-lg">
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
          placeholder="Search dishes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm bg-white shadow-sm"
          aria-label="Search dishes"
        />
      </div>

      {/* Category filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={(cat) => { setSelectedCategory(cat); setSearch(''); }}
          loading={catLoading}
        />
      </div>

      {/* Grid */}
      {error ? (
        <div className="text-center py-16">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => setSelectedCategory(selectedCategory)}
            className="mt-4 text-sm text-brand-600 underline"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <MenuItemSkeleton key={i} />)}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-gray-500 text-lg font-medium">
            {isSearch ? `No results for "${search.trim()}"` : 'No dishes found'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-sm text-brand-600 underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          {isSearch && (
            <p className="mb-4 text-sm text-gray-500">
              {visibleItems.length} result{visibleItems.length === 1 ? '' : 's'} for
              “<span className="font-semibold text-gray-700">{search.trim()}</span>” across all categories
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
