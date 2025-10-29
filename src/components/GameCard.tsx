import React, { useState } from 'react';
import type { Game } from '../models/Game';
import { ShoppingCart } from 'lucide-react';
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
  
  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden transition-transform duration-200">
      <img
        src={game.imageLink}
        alt={game.game}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
      <div className="w-full p-3 flex-grow">
        {game.category !== 'N/A' && !!game.category && (
          <p className="font-bold text-blue-400 text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
            {game.category}
          </p>
        )}
        <p className="font-bold text-primary text-[14px]">
          {game.gameVersion}
        </p>
        <h3 className="text-xs font-semibold text-white mb-2 line-clamp-2 min-h-[2.5em]">{game.game}</h3>
        
        <div className="mb-3 mt-1">
          {originalPriceNumber && secondaryValueNumber && (
            <div className="flex items-center mb-2">
              <span className="text-[9px] text-gray-300">
                Você economiza
              </span>
              <span className="ml-1 bg-green-500/20 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
                -{calculateSavings(originalPriceNumber, secondaryValueNumber)}
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-2 border border-primary/30 shadow-sm shadow-primary/10">
              <p className="text-[9px] text-gray-400 mb-1">Primária</p>
              <p className="text-white text-xs font-bold">{formatCurrency(primaryValueNumber)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-2 border border-primary/20 shadow-sm">
              <p className="text-[9px] text-gray-400 mb-1">Secundária</p>
              <p className="text-white text-xs font-bold">{formatCurrency(secondaryValueNumber)}</p>
            </div>
          </div>
        </div>
        <AddToCartButton game={game} />
      </div>
    </div>
  );
};

export default GameCard;
