import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SaldaoCard from '../components/SaldaoCard';
import SaldaoFilters from '../components/SaldaoFilters';
import { Spinner } from '../components/ui/spinner';
import { fetchSaldaoGames } from '../api/saldao';
import FloatingButtons from '../components/FloatingButtons';
import type { SaldaoGame } from '../models/SaldaoGame';

const SaldaoPage: React.FC = () => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedConsole, setSelectedConsole] = useState('');
  
  // Filtered games state
  const [filteredGames, setFilteredGames] = useState<SaldaoGame[]>([]);

  // Fetch games data
  const { data: saldaoData, isPending, isError } = useQuery({
    queryFn: () => fetchSaldaoGames(),
    queryKey: ['saldao-games'],
  });

  const allGames = saldaoData?.data || [];

  // Apply filters whenever games or filter criteria change
  useEffect(() => {
    if (!allGames.length) {
      setFilteredGames([]);
      return;
    }

    const applyFilters = () => {
      const filtered = allGames.filter((game) => {
        // Search filter
        if (searchTerm.trim()) {
          const gameName = (game.jogo || '').toLowerCase();
          if (!gameName.includes(searchTerm.toLowerCase().trim())) {
            return false;
          }
        }

        // Console filter (uses versaoDoJogo field)
        if (selectedConsole.trim()) {
          const gameVersion = (game.versaoDoJogo || '').toUpperCase();
          if (!gameVersion.includes(selectedConsole.toUpperCase())) {
            return false;
          }
        }

        // Price filter
        if (selectedPrice.trim()) {
          const priceStr = (game.valor || '0').replace(',', '.');
          const price = parseFloat(priceStr);
          
          switch (selectedPrice) {
            case 'under15':
              if (price >= 15) return false;
              break;
            case '15-50':
              if (price < 15 || price >= 50) return false;
              break;
            case '50-100':
              if (price < 50 || price >= 100) return false;
              break;
            case 'over100':
              if (price < 100) return false;
              break;
          }
        }

        return true;
      });

      setFilteredGames(filtered);
    };

    applyFilters();
  }, [allGames, searchTerm, selectedPrice, selectedConsole]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedPrice('');
    setSelectedConsole('');
  };

  return (
    <>
      <Header showSearch={false} />
      <FloatingButtons />
      
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-black via-orange-950 to-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-pulse"></div>
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full font-black text-xs md:text-sm shadow-lg mb-4">
              <span className="text-base md:text-xl">🔥</span>
              QUEIMA DE ESTOQUE
              <span className="text-base md:text-xl">🔥</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              <span className="text-orange-400 drop-shadow-[0_0_25px_rgba(251,146,60,0.6)]">
                SALDÃO KONG!
              </span>
            </h1>
            <p className="text-white text-base md:text-lg font-bold mb-2">
              💎 Estoque do ano todo com preços imperdíveis!
            </p>
            <p className="text-gray-300 text-sm md:text-base">
              Aproveite antes que acabem! Quantidade limitada por produto.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <SaldaoFilters
        searchTerm={searchTerm}
        selectedPrice={selectedPrice}
        selectedConsole={selectedConsole}
        onSearchChange={setSearchTerm}
        onPriceChange={setSelectedPrice}
        onConsoleChange={setSelectedConsole}
        onClearFilters={handleClearFilters}
      />

      {/* Games Grid Section */}
      <section className="pb-16 bg-zinc-950 min-h-screen">
        <div className="container mx-auto px-2 md:px-4 py-8">
          {isPending ? (
            <div className="flex items-center justify-center w-full min-h-[400px]">
              <Spinner />
            </div>
          ) : isError ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg">Erro ao carregar jogos do saldão.</p>
              <p className="text-sm mt-2">Tente novamente mais tarde.</p>
            </div>
          ) : allGames.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg">Nenhum jogo disponível no saldão no momento.</p>
              <p className="text-sm mt-2">Volte em breve para conferir nossas ofertas!</p>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg">😕 Nenhum jogo encontrado com os filtros selecionados.</p>
              <p className="text-sm mt-2">Tente ajustar os filtros para ver mais opções.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  JOGOS EM <span className="text-orange-500">PROMOÇÃO</span>
                </h2>
                <p className="text-gray-400 text-sm">
                  {filteredGames.length} {filteredGames.length === 1 ? 'jogo disponível' : 'jogos disponíveis'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
                {filteredGames.map((game) => (
                  <SaldaoCard key={game.id} game={game} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default SaldaoPage;
