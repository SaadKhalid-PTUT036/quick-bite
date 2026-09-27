import { Link } from 'react-router-dom';
import type { MenuItem } from '../types';
import { useCart } from '../hooks/useCart';

interface Props {
  item: MenuItem;
}

export function MenuItemCard({ item }: Props) {
  const { add, items } = useCart();
  const inCart = items.find((i) => i.id === item.id);

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <Link to={`/item/${item.id}`} className="block overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link
          to={`/item/${item.id}`}
          className="font-semibold text-gray-800 hover:text-brand-600 transition-colors line-clamp-2 mb-1"
        >
          {item.name}
        </Link>
        <span className="text-xs text-gray-400 mb-3">{item.category}</span>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-brand-600">${item.price.toFixed(2)}</span>
          <button
            onClick={() => add(item)}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
            aria-label={`Add ${item.name} to cart`}
          >
            {inCart ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Add again
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add to cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
