import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import FloatingButtons from '../components/FloatingButtons';
import { Spinner } from '../components/ui/spinner';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, isLoading } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If user is not authenticated, show auth modal
  React.useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  }, [isAuthenticated]);

  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    if (!isAuthenticated) {
      navigate('/');
    }
  };

  return (
    <>
      <Header showSearch={false} />
      <FloatingButtons />
      
      <section className="pb-16 bg-zinc-950 min-h-screen">
        <header className="px-4 text-center py-12 bg-gradient-to-b from-zinc-950 to-zinc-950/50">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-shadow">
              <Heart size={16} className="fill-white" />
              MEUS FAVORITOS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-red-400 to-primary bg-clip-text text-transparent mb-2">
            JOGOS FAVORITOS
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Seus jogos favoritos salvos para consultar depois
          </p>
        </header>
        
        <div className="container mx-auto px-2 md:px-4">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <Heart size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-4">
                Você precisa estar logado para ver seus favoritos
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Fazer Login
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center w-full mt-8">
              <Spinner />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-4">
                Você ainda não tem jogos favoritos
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explorar Jogos
              </button>
            </div>
          ) : (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {favorites.length} {favorites.length === 1 ? 'JOGO' : 'JOGOS'}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 md:gap-4">
                {favorites.map((favorite) => (
                  <GameCard 
                    key={favorite.id} 
                    game={favorite.game} 
                    onAuthRequired={handleAuthRequired}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleAuthModalClose}
        onSwitchToSignUp={() => {}}
        onSwitchToForgotPassword={() => {}}
      />
    </>
  );
};

export default FavoritesPage;
