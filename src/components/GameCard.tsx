import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../models/Game';
import { ShoppingCart, Heart } from 'lucide-react';
import { calculateSavings } from '../utils/calculate-savings';
import { convertRealToNumber } from '../utils/convert-real-to-number';
import AddToCartModal from './cart/AddToCartModal';
import { CompactCountdown } from './CompactCountdown';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { trackGameClick } from '../utils/analytics';

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
  onAuthRequired?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onAuthRequired }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorited } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
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

  const handleCardClick = () => {
    trackGameClick({
      id: game.id,
      name: game.game,
      category: game.category || undefined,
    });
    navigate(`/game?id=${game.id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    setIsFavoriteLoading(true);
    try {
      await toggleFavorite(game.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // Determinar badges baseado nos dados do jogo
  const hasPromo = game.inPromo && originalPriceNumber && secondaryValueNumber && originalPriceNumber > secondaryValueNumber;
  const savingsPercentage = hasPromo ? calculateSavings(originalPriceNumber, secondaryValueNumber) : null;
  const isHighDiscount = game.unmissable;
  
  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden transition-transform duration-200 group hover:ring-2 hover:ring-primary cursor-pointer">
      <div className="relative" onClick={handleCardClick}>
        <img
          src={game.imageLink}
          alt={game.game}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isFavoriteLoading}
          className="absolute top-2 right-2 z-10 bg-zinc-900/80 backdrop-blur-sm p-2 rounded-full hover:bg-zinc-800 transition-colors disabled:opacity-50"
          aria-label={isFavorited(game.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isFavorited(game.id) ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>
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
      </div>
      <div className="w-full p-2 lg:p-3 flex-grow" onClick={handleCardClick}>
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
        <div className="mt-1.5 lg:mt-2" onClick={(e) => e.stopPropagation()}>
          <AddToCartButton game={game} />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
