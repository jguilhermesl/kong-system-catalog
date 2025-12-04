import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShoppingCart, Clock, Star, Shield, Gamepad2, Package } from 'lucide-react';
import { fetchGameById } from '../api/games';
import { Spinner } from '../components/ui/spinner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RelatedGames from '../components/RelatedGames';
import AddToCartModal from '../components/cart/AddToCartModal';
import { convertRealToNumber } from '../utils/convert-real-to-number';
import { calculateSavings } from '../utils/calculate-savings';
import { trackGameView } from '../utils/analytics';

// Large Countdown Component for Details Page
const LargeCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 border border-red-500">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-white">
          <Clock size={24} className="animate-pulse" />
          <span className="text-sm font-semibold">⚡ OFERTA TERMINA EM:</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-white text-2xl font-bold">{formatTime(timeLeft.hours)}</span>
            <span className="text-white/80 text-xs font-semibold">HORAS</span>
          </div>
          <span className="text-white text-2xl font-bold">:</span>
          <div className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-white text-2xl font-bold">{formatTime(timeLeft.minutes)}</span>
            <span className="text-white/80 text-xs font-semibold">MIN</span>
          </div>
          <span className="text-white text-2xl font-bold">:</span>
          <div className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-white text-2xl font-bold">{formatTime(timeLeft.seconds)}</span>
            <span className="text-white/80 text-xs font-semibold">SEG</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const GameDetailsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gameId = searchParams.get('id');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'description' | 'howItWorks'>('description');

  const { data: gameData, isPending } = useQuery({
    queryFn: () => fetchGameById(gameId!),
    queryKey: ['game', gameId],
    enabled: !!gameId,
  });

  const game = gameData?.data;

  // Scroll to top when accessing the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameId]);

  // Track game view
  useEffect(() => {
    if (game) {
      const secondaryValueNumber = game.secondaryValue 
        ? convertRealToNumber(game.secondaryValue.toString()) 
        : 0;
      
      trackGameView({
        id: game.id,
        name: game.game,
        category: game.category || undefined,
        price: secondaryValueNumber,
      });
    }
  }, [game]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (isPending) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Spinner />
        </div>
        <Footer />
      </>
    );
  }

  if (!game) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Jogo não encontrado</h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary/80 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Voltar para catálogo
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const primaryValueNumber = game.primaryValue ? convertRealToNumber(game.primaryValue.toString()) : 0;
  const secondaryValueNumber = game.secondaryValue ? convertRealToNumber(game.secondaryValue.toString()) : 0;
  const originalPriceNumber = game.originalPrice ? convertRealToNumber(game.originalPrice.toString()) : null;
  const hasPromo = game.inPromo && originalPriceNumber && secondaryValueNumber && originalPriceNumber > secondaryValueNumber;
  const savingsPercentage = hasPromo ? calculateSavings(originalPriceNumber, secondaryValueNumber) : null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-zinc-950 pb-16">
        {/* Breadcrumb */}
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-primary flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              Voltar para catálogo
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Two Column Layout */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Left Column - Image & Characteristics */}
              <div className="space-y-6">
                {/* Image */}
                <div className="relative rounded-lg overflow-hidden bg-zinc-900">
                  <img
                    src={game.imageLink}
                    alt={game.game}
                    className="w-full aspect-square object-cover"
                  />
                  {/* Badges overlay */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {hasPromo && savingsPercentage && (
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-md shadow-lg">
                        {savingsPercentage} OFF
                      </span>
                    )}
                    {game.unmissable && (
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-md shadow-lg">
                        🔥 IMPERDÍVEL
                      </span>
                    )}
                    {game.status === 'new' && (
                      <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1.5 rounded-md shadow-lg">
                        NOVO
                      </span>
                    )}
                  </div>
                  {game.console && (
                    <span className="absolute top-4 right-4 bg-zinc-800/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-md border border-zinc-700">
                      {game.console}
                    </span>
                  )}
                </div>

                {/* Game Characteristics */}
                <div className="hidden lg:block bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="text-primary" size={20} />
                    Características
                  </h3>
                  <div className="space-y-3">
                    {game.category !== 'N/A' && !!game.category && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                        <div>
                          <p className="text-xs text-gray-400">Categoria</p>
                          <p className="text-sm text-white font-semibold">{game.category}</p>
                        </div>
                      </div>
                    )}
                    {game.console && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                        <div>
                          <p className="text-xs text-gray-400">Console</p>
                          <p className="text-sm text-white font-semibold">{game.console}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                      <div>
                        <p className="text-xs text-gray-400">Versão</p>
                        <p className="text-sm text-white font-semibold">{game.gameVersion}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className=" lg:grid hidden grid-cols-3 gap-3">
                  <div className="bg-zinc-900 rounded-lg p-3 text-center border border-zinc-800">
                    <Shield className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Compra Segura</p>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3 text-center border border-zinc-800">
                    <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Entrega Rápida</p>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-3 text-center border border-zinc-800">
                    <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Top Qualidade</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Title, Price & Action */}
              <div className="space-y-6">
                {/* Game Title */}
                <div>
                  {game.category !== 'N/A' && !!game.category && (
                    <p className="text-sm text-blue-400 font-semibold mb-2">
                      {game.category}
                    </p>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {game.game}
                  </h1>
                  <p className="text-xl text-primary font-semibold">
                    {game.gameVersion}
                  </p>
                </div>

                {/* Large Countdown */}
                <LargeCountdown />

                {/* Pricing Card */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl p-6 border-2 border-primary">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Primary Account */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Gamepad2 className="text-primary" size={18} />
                        <h3 className="text-base font-bold text-white">
                          Conta Primária
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">Jogue sem restrições</p>
                      
                      {originalPriceNumber && (
                        <div className="mb-2">
                          <span className="text-gray-400 line-through text-xs">
                            De {formatCurrency(originalPriceNumber * 0.8)}
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-2">
                        <span className="text-primary text-sm">R$</span>
                        <span className="text-white text-3xl font-bold ml-1">
                          {primaryValueNumber.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      
                      <div className="text-gray-300 text-xs">
                        ou <span className="font-semibold text-white">4x de {formatCurrency((primaryValueNumber * 1.1) / 4)}</span>
                      </div>
                    </div>

                    {/* Secondary Account */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="text-gray-400" size={18} />
                        <h3 className="text-base font-bold text-white">
                          Conta Secundária
                        </h3>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">Economia garantida</p>
                      
                      {originalPriceNumber && (
                        <div className="mb-2">
                          <span className="text-gray-400 line-through text-xs">
                            De {formatCurrency(originalPriceNumber * 0.6)}
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-2">
                        <span className="text-primary text-sm">R$</span>
                        <span className="text-white text-3xl font-bold ml-1">
                          {secondaryValueNumber.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      
                      <div className="text-gray-300 text-xs">
                        ou <span className="font-semibold text-white">4x de {formatCurrency((secondaryValueNumber * 1.1) / 4)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={20} />
                    Adicionar ao Carrinho
                  </button>
                </div>

                {/* Savings Badge */}
                {originalPriceNumber && secondaryValueNumber && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                    <p className="text-green-400 font-bold">
                      💰 Economize até {calculateSavings(originalPriceNumber, secondaryValueNumber)} neste jogo!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-zinc-900 rounded-lg overflow-hidden mb-12">
            <div className="border-b border-zinc-800">
              <div className="flex">
                <button
                  onClick={() => setSelectedTab('description')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    selectedTab === 'description'
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Descrição
                </button>
                <button
                  onClick={() => setSelectedTab('howItWorks')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    selectedTab === 'howItWorks'
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Como Funciona
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedTab === 'description' ? (
                <div className="text-gray-300 space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4">Sobre o Jogo</h3>
                  
                  {game.description && (
                    <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                      <div 
                        className="leading-relaxed text-gray-300"
                        dangerouslySetInnerHTML={{ __html: game.description }}
                      />
                    </div>
                  )}
                  
                  <p className="leading-relaxed">
                    Versão: <strong className="text-white">{game.gameVersion}</strong>
                  </p>
                  {game.category !== 'N/A' && !!game.category && (
                    <p className="leading-relaxed">
                      Categoria: <strong className="text-white">{game.category}</strong>
                    </p>
                  )}
                  <div className="bg-zinc-800 rounded-lg p-4 mt-6">
                    <p className="text-sm text-gray-400">
                      ⚡ Entrega imediata após confirmação do pagamento
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      🔒 Compra 100% segura e garantida
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      💬 Suporte especializado disponível
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-300 space-y-6">
                  <h3 className="text-xl font-bold text-white mb-4">Como Funciona a Kong Games</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                        Escolha seu Jogo
                      </h4>
                      <p className="text-sm text-gray-400 ml-8">
                        Navegue pelo nosso catálogo e escolha o jogo desejado. Temos mais de 2000 jogos disponíveis!
                      </p>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                        Tipo de Conta
                      </h4>
                      <p className="text-sm text-gray-400 ml-8 mb-3">
                        Escolha entre conta Primária ou Secundária:
                      </p>
                      <ul className="text-sm text-gray-400 ml-8 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <div>
                            <strong className="text-white">Primária:</strong> Você recebe uma conta PSN exclusiva com o jogo. Jogue online, ganhe troféus e aproveite todos os recursos sem restrições.
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <div>
                            <strong className="text-white">Secundária:</strong> Você compartilha uma conta com o jogo já instalado. Ideal para economia! Jogue offline e aproveite o game por um preço menor.
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                        Finalize a Compra
                      </h4>
                      <p className="text-sm text-gray-400 ml-8">
                        Adicione ao carrinho e escolha sua forma de pagamento. Aceitamos PIX, cartão de crédito e mais!
                      </p>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                        Receba Imediatamente
                      </h4>
                      <p className="text-sm text-gray-400 ml-8">
                        Após a confirmação do pagamento, você recebe os dados de acesso por e-mail e WhatsApp. É rápido e seguro!
                      </p>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                        Suporte Especializado
                      </h4>
                      <p className="text-sm text-gray-400 ml-8">
                        Conte com nossa equipe para qualquer dúvida. Estamos aqui para ajudar você a jogar!
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/50 rounded-lg p-4 mt-6">
                    <p className="text-center text-white font-semibold">
                      🎮 Mais de 2000 clientes satisfeitos jogando com a Kong Games!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Games */}
          <RelatedGames currentGameId={game.id} category={game.category} />
        </div>
      </div>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        game={game}
      />

      <Footer />
    </>
  );
};

export default GameDetailsPage;
