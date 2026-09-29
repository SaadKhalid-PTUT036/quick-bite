import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';

export function Header() {
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  const navLink = (path: string, label: string) => (
    <Link
      to={path}
      className={`hidden text-sm font-medium transition-colors sm:inline ${
        pathname === path ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600 dark:text-gray-300'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur dark:bg-gray-900/90 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600">
          <span className="text-2xl" role="img" aria-label="fork and knife">🍴</span>
          QuickBite
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-5">
          {navLink('/', 'Menu')}
          {navLink('/orders', 'Orders')}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Cart icon */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300 transition-colors"
            aria-label={`Cart with ${totalItems} items`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8H19M7 13L5.4 5M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
