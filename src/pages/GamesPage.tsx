import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';

import { Spinner } from '../components/ui/spinner';
import { Carousel } from '../components/ui/carousel';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageBanner from '../components/ImageBanner';
import QuickFilters from '../components/QuickFilters';
import SortOptions, { type SortOption } from '../components/SortOptions';
import FloatingButtons from '../components/FloatingButtons';
import FilterModal from '../components/FilterModal';
import AuthModal from '../components/AuthModal';
import SignUpModal from '../components/SignUpModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { fetchGames } from '../api/games';
import type { FetchGamesProps } from '../api/games';
import { useDebounce } from '../hooks/useDebounce';
import { sortGames } from '../utils/sort-games';
import type { Game } from '../models/Game';
import CountdownTimer from '../components/CountdownTimer';

// Games Section with Carousel
interface GamesSectionProps {
  title: string;
  subtitle?: string;
  games: Game[];
  isPending: boolean;
  onViewAll?: () => void;
  onAuthRequired?: () => void;
}

const GamesSection: React.FC<GamesSectionProps> = ({ title, subtitle, games, isPending, onViewAll, onAuthRequired }) => {
  if (games.length === 0 && !isPending) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          {title} {subtitle && <span className="text-primary">{subtitle}</span>}
        </h2>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-xs text-primary hover:text-primary/80 border border-primary hover:border-primary/80 px-3 py-1 rounded-md transition-colors"
          >
            Ver todos
          </button>
        )}
      </div>
      
      {isPending ? (
        <div className="flex items-center justify-center w-full mt-8">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Listagem vertical para telas menores que xl */}
          <div className="block xl:hidden grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 md:gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} onAuthRequired={onAuthRequired} />
            ))}
          </div>
          
          {/* Carrossel para telas xl e maiores */}
          <div className="hidden xl:block">
            <Carousel classNameItem="max-w-[300px] my-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} onAuthRequired={onAuthRequired} />
              ))}
            </Carousel>
          </div>
        </>
      )}
    </div>
  );
};

// Main Games Page
const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const gamesSectionRef = useRef<HTMLDivElement>(null);
  
  // Initialize formik with URL params
  const formik = useFormik({
    initialValues: {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      price: searchParams.get('price') || '',
      console: searchParams.get('console') || '',
    },
    onSubmit: (values) => {
      const params = new URLSearchParams();
      if (values.search) params.set('search', values.search);
      if (values.category) params.set('category', values.category);
      if (values.price) params.set('price', values.price);
      if (values.console) params.set('console', values.console);
      setSearchParams(params);
    },
  });

  // Debounce search input
  const debouncedSearchTerm = useDebounce(formik.values.search, 500);

  // Apply search filter when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchParams.get('search')) {
      formik.submitForm();
    }
  }, [debouncedSearchTerm]);

  const handleReset = () => {
    formik.resetForm({
      values: {
        search: '',
        category: '',
        price: '',
        console: '',
      }
    });
    setSearchParams(new URLSearchParams());
  };

  const { data: gamesData, isPending } = useQuery({
    queryFn: () =>
      fetchGames({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') as FetchGamesProps['category'],
        price: searchParams.get('price') as FetchGamesProps['price'],
        console: searchParams.get('console') as FetchGamesProps['console'],
      }),
    queryKey: ['games', searchParams.get('search'), searchParams.get('category'), searchParams.get('price'), searchParams.get('console')],
  });

  const games = gamesData?.data || [];
  const promoGames = gamesData?.promoGames || [];
  const unmissableGames = gamesData?.unmissableGames || [];

  // Check if any filters are applied
  const hasFilters = searchParams.get('search') || searchParams.get('category') || searchParams.get('price') || searchParams.get('console');

  // Scroll to games section when filters are applied
  useEffect(() => {
    if (hasFilters && gamesSectionRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        gamesSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [hasFilters, searchParams]);

  return (
    <>
      <Header 
        searchValue={formik.values.search}
        onSearchChange={(value) => formik.setFieldValue('search', value)}
        showSearch={true}
      />
      {/* <BlackFridayBanner /> */}
      <ImageBanner />
      <CountdownTimer />
      <FloatingButtons />
      
      {/* Quick Filters */}
      <QuickFilters />
      
      <section id="games-section" ref={gamesSectionRef} className="pb-16 bg-zinc-950 min-h-screen">
        <header className="px-4 text-center py-12 bg-gradient-to-b from-zinc-950 to-zinc-950/50">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-shadow">
              💎 PREÇOS IMPERDÍVEIS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-green-400 to-primary bg-clip-text text-transparent mb-2">
            CATÁLOGO DE JOGOS
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Encontre os melhores jogos com os melhores preços
          </p>
        </header>
        
        <div className="container mx-auto px-2 md:px-4">

          {/* Filter Modal */}
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            formik={formik}
            onSubmit={formik.handleSubmit}
            onReset={handleReset}
          />

          {/* Games Sections - Show filtered or unfiltered based on filters */}
          {hasFilters ? (
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">
                  RESULTADOS DA <span className="text-primary">BUSCA</span>
                </h2>
                <div className="flex items-center gap-4">
                  <SortOptions value={sortBy} onChange={setSortBy} />
                  <button 
                    onClick={handleReset}
                    className="text-xs text-red-500 hover:text-red-400 border border-red-500 hover:border-red-400 px-3 py-1 rounded-md transition-colors"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
              
              {isPending ? (
                <div className="flex items-center justify-center w-full mt-8">
                  <Spinner />
                </div>
              ) : games.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-lg">Nenhum jogo encontrado com os filtros aplicados.</p>
                  <button 
                    onClick={handleReset}
                    className="mt-4 text-primary hover:text-primary/80 underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 md:gap-4">
                  {sortGames(games, sortBy).map((game) => (
                    <GameCard key={game.id} game={game} onAuthRequired={() => setIsAuthModalOpen(true)} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <GamesSection
                title="JOGOS"
                subtitle="IMPERDÍVEIS"
                games={unmissableGames}
                isPending={isPending}
                onViewAll={() => navigate('/all-games?type=unmissable')}
                onAuthRequired={() => setIsAuthModalOpen(true)}
              />
              
              <GamesSection
                title="OFERTAS"
                subtitle="ESPECIAIS"
                games={promoGames}
                isPending={isPending}
                onViewAll={() => navigate('/all-games?type=promo')}
                onAuthRequired={() => setIsAuthModalOpen(true)}
              />
            </>
          )}
        </div>
      </section>
      <Footer />
      
      {/* Auth Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsAuthModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setIsAuthModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
      />
      
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
      
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        onSwitchToLogin={() => {
          setIsForgotPasswordModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
    </>
  );
};

export default GamesPage;
