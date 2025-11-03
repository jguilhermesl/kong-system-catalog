import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchGames } from '../api/games';
import { Spinner } from './ui/spinner';
import { Carousel } from './ui/carousel';
import GameCard from './GameCard';
import type { Game } from '../models/Game';

interface RelatedGamesProps {
  category: string;
  currentGameId?: string;
}

const RelatedGames: React.FC<RelatedGamesProps> = ({ category, currentGameId }) => {
  const navigate = useNavigate();

  const { data: gamesData, isPending } = useQuery({
    queryFn: () => fetchGames({ category }),
    queryKey: ['related-games', category],
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  const allGames = gamesData?.data || [];
  // Filtrar o jogo atual e limitar a 8 jogos relacionados
  const relatedGames = allGames
    .filter((game: Game) => game.id !== currentGameId)
    .slice(0, 8);

  if (relatedGames.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-zinc-950">
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              VOCÊ PODE <span className="text-primary">GOSTAR</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Jogos relacionados à categoria {category}
            </p>
          </div>
          <button
            onClick={() => navigate(`/category?category=${category}`)}
            className="hidden md:block text-sm text-primary hover:text-primary/80 font-medium underline"
          >
            Ver todos de {category}
          </button>
        </div>

        {/* Desktop/Tablet: Carousel */}
        <div className="hidden md:block">
          <Carousel classNameItem="max-w-[280px] my-4">
            {relatedGames.map((game: Game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </Carousel>
        </div>

        {/* Mobile: Grid */}
        <div className="md:hidden grid grid-cols-2 gap-1.5">
          {relatedGames.slice(0, 4).map((game: Game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <div className="text-center mt-6 md:hidden">
          <button
            onClick={() => navigate(`/category?category=${category}`)}
            className="text-sm text-primary hover:text-primary/80 font-medium underline"
          >
            Ver todos de {category}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RelatedGames;
