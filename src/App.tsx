import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import GamesPage from './pages/GamesPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import AllGamesPage from './pages/AllGamesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import FavoritesPage from './pages/FavoritesPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-zinc-950">
                <Routes>
                <Route path="/" element={<GamesPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/all-games" element={<AllGamesPage />} />
                <Route path="/game" element={<GameDetailsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
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
