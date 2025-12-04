import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { trackPageView } from './utils/analytics';
import GamesPage from './pages/GamesPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import AllGamesPage from './pages/AllGamesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import SaldaoPage from './pages/SaldaoPage';

const queryClient = new QueryClient();

// Componente para rastrear mudanças de página
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <BrowserRouter>
              <PageTracker />
              <div className="min-h-screen bg-zinc-950">
                <Routes>
                <Route path="/" element={<GamesPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/all-games" element={<AllGamesPage />} />
                <Route path="/game" element={<GameDetailsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/saldao" element={<SaldaoPage />} />
                </Routes>
              </div>
            </BrowserRouter>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
