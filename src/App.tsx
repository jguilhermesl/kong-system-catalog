import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import GamesPage from './pages/GamesPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import AllGamesPage from './pages/AllGamesPage';
import GameDetailsPage from './pages/GameDetailsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-zinc-950">
            <Routes>
              <Route path="/" element={<GamesPage />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/all-games" element={<AllGamesPage />} />
              <Route path="/game" element={<GameDetailsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
