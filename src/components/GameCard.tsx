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

  // Determinar badges baseado nos dados do jogo
  const hasPromo = originalPriceNumber && secondaryValueNumber && originalPriceNumber > secondaryValueNumber;
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
          
          <div className="mt-2">
            <p className="text-[9px] text-gray-400 text-center italic">
              Dividimos no cartão em até 12x
            </p>
          </div>
        </div>
        <AddToCartButton game={game} />
      </div>
    </div>
  );
};

export default GameCard;
