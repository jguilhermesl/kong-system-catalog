import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import GameCard from '../components/GameCard';
import CartIcon from '../components/cart/CartIcon';
import Footer from '../components/Footer';
import { fetchGames } from '../api/games';
import type { FetchGamesProps } from '../api/games';

const CategoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category') || '';

  const { data: gamesData, isPending } = useQuery({
    queryFn: () =>
      fetchGames({
        category,
      } as FetchGamesProps),
    queryKey: ['category-games', category],
  });

  const games = gamesData?.data || [];

  return (
    <>
      <CartIcon />
      <div className="min-h-screen bg-zinc-950 pb-16">
      <div className="bg-zinc-900 py-8 px-4">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Categoria: <span className="text-primary">{category}</span>
          </h1>
          <p className="text-gray-400 mt-2">
            {games.length} {games.length === 1 ? 'jogo encontrado' : 'jogos encontrados'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {isPending ? (
          <div className="flex items-center justify-center w-full mt-8">
            <Spinner />
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">Nenhum jogo encontrado nesta categoria</p>
            <p className="text-gray-500">Tente explorar outras categorias.</p>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
