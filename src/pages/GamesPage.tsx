import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useFormik } from 'formik';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Spinner } from '../components/ui/spinner';
import { Carousel } from '../components/ui/carousel';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ImageBanner from '../components/ImageBanner';
// import CountdownTimer from '../components/CountdownTimer';
import FloatingButtons from '../components/FloatingButtons';
import FilterModal from '../components/FilterModal';
import { fetchGames } from '../api/games';
import type { FetchGamesProps } from '../api/games';
import { useDebounce } from '../hooks/useDebounce';
import type { Game } from '../models/Game';

// Games Section with Carousel
interface GamesSectionProps {
  title: string;
  subtitle?: string;
  games: Game[];
  isPending: boolean;
  onViewAll?: () => void;
}

const GamesSection: React.FC<GamesSectionProps> = ({ title, subtitle, games, isPending, onViewAll }) => {
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
        <Carousel classNameItem="max-w-[300px] my-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </Carousel>
      )}
    </div>
  );
};

// Main Games Page
const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
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

  return (
    <>
      <Header />
      <ImageBanner />
      {/* <CountdownTimer /> */}
      <FloatingButtons />
      
      <section id="games-section" className="pb-16 pt-16 bg-zinc-950 min-h-screen">
        <header className="px-4 text-center mb-8">
          <div className="mb-6">
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
              💎 PREÇOS IMPERDÍVEIS
            </span>
          </div>
          <h2 className="text-2xl font-medium text-primary mb-6">
            CATÁLOGO DE JOGOS
          </h2>
        </header>
        
        <div className="container mx-auto px-4">
          {/* Search Bar with Filters */}
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Input
                  placeholder="Buscar jogos..."
                  className="h-12 w-full bg-zinc-900 border-gray-600 text-gray-100 placeholder:text-gray-300 pl-10 pr-4 text-lg rounded-lg"
                  value={formik.values.search}
                  onChange={(e) => formik.setFieldValue('search', e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              {/* Filter Button */}
              <Button 
                type="button"
                variant="outline" 
                size="icon"
                onClick={() => setIsFilterModalOpen(true)}
                className="h-12 w-12 border-gray-600 bg-primary text-white hover:bg-gray-800"
                title="Filtros avançados"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  RESULTADOS DA <span className="text-primary">BUSCA</span>
                </h2>
                <button 
                  onClick={handleReset}
                  className="text-xs text-red-500 hover:text-red-400 border border-red-500 hover:border-red-400 px-3 py-1 rounded-md transition-colors"
                >
                  Limpar filtros
                </button>
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
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
              />
              
              <GamesSection
                title="OFERTAS"
                subtitle="ESPECIAIS"
                games={promoGames}
                isPending={isPending}
                onViewAll={() => navigate('/all-games?type=promo')}
              />
              
              <GamesSection
                title="TODOS OS"
                subtitle="JOGOS"
                games={games}
                isPending={isPending}
                onViewAll={() => navigate('/all-games?type=all')}
              />
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default GamesPage;
