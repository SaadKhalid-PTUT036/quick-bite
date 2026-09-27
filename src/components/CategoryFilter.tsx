import type { Category } from '../types';
import { Skeleton } from './Skeleton';

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (cat: string) => void;
  loading: boolean;
}

export function CategoryFilter({ categories, selected, onSelect, loading }: Props) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="status" aria-label="Loading categories">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 flex-shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <nav aria-label="Menu categories">
      <ul className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <li key={cat.idCategory} className="flex-shrink-0">
            <button
              onClick={() => onSelect(cat.strCategory)}
              aria-pressed={selected === cat.strCategory}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${
                selected === cat.strCategory
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400 hover:text-brand-600'
              }`}
            >
              <img
                src={cat.strCategoryThumb}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 rounded-full object-cover"
              />
              {cat.strCategory}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
