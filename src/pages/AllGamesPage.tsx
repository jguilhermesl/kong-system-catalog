import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import SortOptions, { type SortOption } from '../components/SortOptions';
import { fetchGames } from '../api/games';
import { sortGames } from '../utils/sort-games';
import type { FetchGamesProps } from '../api/games';

const AllGamesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') || 'all';
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const { data: gamesData, isPending } = useQuery({
    queryFn: () =>
      fetchGames({ 
        complete: true,
        search: searchParams.get('search') || ''
      } as FetchGamesProps),
    queryKey: ['all-games', type, searchParams.get('search')],
  });

  const getGames = () => {
    if (!gamesData) return [];
    
    switch (type) {
      case 'unmissable':
        return gamesData.unmissableGames || [];
      case 'promo':
        return gamesData.promoGames || [];
      case 'all':
      default:
        return gamesData.data || [];
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'unmissable':
        return 'Jogos Imperdíveis';
      case 'promo':
        return 'Ofertas Especiais';
      case 'all':
      default:
        return 'Todos os Jogos';
    }
  };

  const games = getGames();
  const title = getTitle();

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  return (
    <>
      <Header 
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />
      <div className="min-h-screen bg-zinc-950 pb-16">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-8 px-4">
        <div className="container mx-auto">
          <Breadcrumbs items={[{ label: title }]} />
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-primary">{title}</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {games.length} {games.length === 1 ? 'jogo disponível' : 'jogos disponíveis'}
              </p>
            </div>
            {games.length > 0 && (
              <SortOptions value={sortBy} onChange={setSortBy} />
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-4 mt-4 md:mt-8">
        {isPending ? (
          <div className="flex items-center justify-center w-full mt-8">
            <Spinner />
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 md:gap-6">
            {sortGames(games, sortBy).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">Nenhum jogo encontrado</p>
            <p className="text-gray-500">Tente voltar mais tarde.</p>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
};

export default AllGamesPage;
