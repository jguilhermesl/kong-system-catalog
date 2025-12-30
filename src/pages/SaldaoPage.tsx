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
import mikePerson from '../assets/mike-person.png';

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
      
      {/* Hero Section - New Year Theme */}
      <div className="relative w-full bg-gradient-to-br from-white via-amber-50 to-white overflow-hidden">
        {/* Confetti and fireworks effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
          <div className="absolute top-0 left-[10%] text-2xl animate-[fall_10s_linear_infinite]">🎊</div>
          <div className="absolute top-0 left-[25%] text-xl animate-[fall_13s_linear_infinite_2s]">✨</div>
          <div className="absolute top-0 left-[40%] text-2xl animate-[fall_11s_linear_infinite_4s]">🎉</div>
          <div className="absolute top-0 left-[60%] text-xl animate-[fall_14s_linear_infinite_1s]">✨</div>
          <div className="absolute top-0 left-[75%] text-2xl animate-[fall_12s_linear_infinite_3s]">🎊</div>
          <div className="absolute top-0 left-[90%] text-xl animate-[fall_15s_linear_infinite_5s]">🎉</div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col items-center justify-center text-center space-y-5 md:space-y-6">
            {/* Mike Person (Monkey Party) */}
            <div className="w-40 h-40 md:w-52 md:h-52 flex-shrink-0">
              <img 
                src={mikePerson} 
                alt="Kong Ano Novo" 
                className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center space-y-3 md:space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-full font-black text-sm md:text-base shadow-lg shadow-amber-300/50">
                <span className="text-lg md:text-xl">🎆</span>
                SALDÃO DE ANO NOVO
                <span className="text-lg md:text-xl">🎆</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
                  SALDÃO KONG!
                </span>
              </h1>
              <p className="text-gray-800 text-base md:text-xl font-bold max-w-2xl">
                🥳 Comece 2025 com jogos a partir de R$ 7,99! Ofertas explosivas! 🎮
              </p>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes fall {
            0% {
              transform: translateY(-50px) rotate(0deg);
              opacity: 0.9;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0.2;
            }
          }
        `}</style>
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
                className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg border-2 border-amber-400"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  🎉 JOGOS EM <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400">PROMOÇÃO DE ANO NOVO</span> 🎆
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
