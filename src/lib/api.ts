import type { Category, MenuItem } from '../types';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

// Deterministic fake price from meal id — stays consistent across renders
export function generatePrice(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  // Price between $5.99 and $24.99
  const base = Math.abs(hash) % 1900; // 0–1899
  return parseFloat(((base + 599) / 100).toFixed(2));
}

interface RawMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strMealThumb: string;
  strInstructions?: string;
  strTags?: string;
  strYoutube?: string;
  [key: string]: string | null | undefined;
}

function mapMeal(raw: RawMeal): MenuItem {
  return {
    id: raw.idMeal,
    name: raw.strMeal,
    category: raw.strCategory,
    image: raw.strMealThumb,
    price: generatePrice(raw.idMeal),
    instructions: raw.strInstructions ?? undefined,
    tags: raw.strTags ?? undefined,
    youtube: raw.strYoutube ?? undefined,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categories.php`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return (data.categories ?? []) as Category[];
}

export async function fetchMealsByCategory(category: string): Promise<MenuItem[]> {
  const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error(`Failed to fetch meals for ${category}`);
  const data = await res.json();
  // filter endpoint returns partial meals (no instructions), add price
  return ((data.meals ?? []) as RawMeal[]).map((m) => ({
    id: m.idMeal,
    name: m.strMeal,
    category,
    image: m.strMealThumb,
    price: generatePrice(m.idMeal),
  }));
}

export async function fetchMealById(id: string): Promise<MenuItem | null> {
  const res = await fetch(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch meal ${id}`);
  const data = await res.json();
  const meals = (data.meals ?? []) as RawMeal[];
  if (!meals.length) return null;
  return mapMeal(meals[0]);
}

export async function fetchMealsByIds(ids: string[]): Promise<MenuItem[]> {
  const results = await Promise.all(ids.map((id) => fetchMealById(id).catch(() => null)));
  return results.filter((m): m is MenuItem => m !== null);
}

export async function searchMeals(query: string): Promise<MenuItem[]> {
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return ((data.meals ?? []) as RawMeal[]).map(mapMeal);
}
