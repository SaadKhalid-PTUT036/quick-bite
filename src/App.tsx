import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartProvider';
import { Header } from './components/Header';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/item/:id" element={<ItemDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} QuickBite — a portfolio demo
        </footer>
      </div>
    </CartProvider>
  );
}
