import React, { useState, useEffect } from 'react';
import type { Game } from '../models/Game';
import { ShoppingCart, Clock } from 'lucide-react';
import { calculateSavings } from '../utils/calculate-savings';
import { convertRealToNumber } from '../utils/convert-real-to-number';
import AddToCartModal from './cart/AddToCartModal';

interface AddToCartButtonProps {
  game: Game;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ game }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-[10px] lg:text-[12px] py-2 px-2 rounded flex items-center justify-center gap-1 w-full mt-2 bg-primary text-white hover:bg-primary/90"
      >
        <ShoppingCart size={12} />
        Adicionar ao Carrinho
      </button>

      <AddToCartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} game={game} />
    </>
  );
};

interface GameCardProps {
  game: Game;
}

const CompactCountdown: React.FC = () => {
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
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-md py-1.5 px-2 mb-2">
      <div className="flex items-center justify-center gap-1.5">
        <Clock size={12} className="text-white" />
        <span className="text-white text-[9px] font-semibold">
          Termina em:
        </span>
        <div className="flex items-center gap-1">
          <span className="text-white text-[10px] font-bold">
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const primaryValueNumber = game.primaryValue ? convertRealToNumber(game.primaryValue.toString()) : 0;
  const secondaryValueNumber = game.secondaryValue ? convertRealToNumber(game.secondaryValue.toString()): 0;
  const originalPriceNumber = game.originalPrice ? convertRealToNumber(game.originalPrice.toString()) : null;
  
  const formatCurrency = (value: number | null) => {
    if (value === null) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Determinar badges baseado nos dados do jogo
  const hasPromo = game.inPromo && originalPriceNumber && secondaryValueNumber && originalPriceNumber > secondaryValueNumber;
  const savingsPercentage = hasPromo ? calculateSavings(originalPriceNumber, secondaryValueNumber) : null;
  const isHighDiscount = game.unmissable;
  
  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden transition-transform duration-200 group hover:ring-2 hover:ring-primary">
      <div className="relative">
        <img
          src={game.imageLink}
          alt={game.game}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges no canto superior */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasPromo && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
              {savingsPercentage} OFF
            </span>
          )}
          {isHighDiscount && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
              🔥 IMPERDÍVEL
            </span>
          )}
          {game.status === 'new' && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
              NOVO
            </span>
          )}
        </div>
        {/* Badge do console no canto superior direito */}
        {game.console && (
          <span className="absolute top-2 right-2 bg-zinc-800/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md border border-zinc-700">
            {game.console}
          </span>
        )}
      </div>
      <div className="w-full p-2 lg:p-3 flex-grow">
        {game.category !== 'N/A' && !!game.category && (
          <p className="font-bold text-blue-400 text-[10px] whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">
            {game.category}
          </p>
        )}
        <p className="font-bold text-primary text-[12px] lg:text-[14px]">
          {game.gameVersion}
        </p>
        <h3 className="text-[11px] lg:text-xs font-semibold text-white mb-1.5 lg:mb-2 line-clamp-2 min-h-[2.5em]">{game.game}</h3>
        
        <div className="mb-2 lg:mb-3 mt-1">
          {/* Countdown para promoções */}
            <div className="mb-1.5 lg:mb-2">
              <CompactCountdown />
            </div>
          
          <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
            {/* Conta Primária */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-1.5 lg:p-2 border border-primary/30 shadow-sm shadow-primary/10">
              <p className="text-[9px] text-gray-400 mb-0.5 lg:mb-1 text-center">Primária</p>
              <div className="text-center">
                {/* Informação de promoção */}
                {originalPriceNumber && (
                  <div className="mb-0.5 lg:mb-1 text-[8px] lg:text-[9px] leading-tight whitespace-nowrap">
                    <span className="text-gray-400 line-through">
                      De {formatCurrency(originalPriceNumber * 0.8)}
                    </span>
                    <span className="text-green-400 font-semibold"> por</span>
                  </div>
                )}
                {/* Preço à vista em destaque */}
                <div className="mb-0.5 lg:mb-1">
                  <span className="text-primary text-[9px] lg:text-[10px]">R$</span>
                  <span className="text-white text-[16px] lg:text-[18px] font-extrabold ml-0.5">
                    {primaryValueNumber.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {/* Preço parcelado (valor + 10%) */}
                <div className="text-gray-300 text-[9px] lg:text-[11px]">
                  ou 4x de <span className="font-semibold">{formatCurrency((primaryValueNumber * 1.1) / 4)}</span>
                </div>
              </div>
            </div>
            
            {/* Conta Secundária */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-1.5 lg:p-2 border border-primary/20 shadow-sm">
              <p className="text-[9px] text-gray-400 mb-0.5 lg:mb-1 text-center">Secundária</p>
              <div className="text-center">
                {/* Informação de promoção */}
                {originalPriceNumber && (
                  <div className="mb-0.5 lg:mb-1 text-[8px] lg:text-[9px] leading-tight whitespace-nowrap">
                    <span className="text-gray-400 line-through">
                      De {formatCurrency(originalPriceNumber * 0.6)}
                    </span>
                    <span className="text-green-400 font-semibold"> por</span>
                  </div>
                )}
                {/* Preço à vista em destaque */}
                <div className="mb-0.5 lg:mb-1">
                  <span className="text-primary text-[9px] lg:text-[10px]">R$</span>
                  <span className="text-white text-[16px] lg:text-[18px] font-extrabold ml-0.5">
                    {secondaryValueNumber.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {/* Preço parcelado (valor + 10%) */}
                <div className="text-gray-300 text-[9px] lg:text-[11px]">
                  ou 4x de <span className="font-semibold">{formatCurrency((secondaryValueNumber * 1.1) / 4)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Badge de economia - mantém altura fixa */}
          <div className="flex items-center justify-center mt-1.5 lg:mt-2">
              <span className="bg-green-500/20 text-green-400 text-[8px] lg:text-[9px] font-bold px-2 py-0.5 lg:py-1 rounded-full">
                Economize {originalPriceNumber && secondaryValueNumber ? calculateSavings(originalPriceNumber, secondaryValueNumber) : "20%"}
              </span>
          </div>
        </div>
        <div className="mt-1.5 lg:mt-2">
          <AddToCartButton game={game} />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
