import React, { useState } from 'react';
import type { SaldaoGame } from '../models/SaldaoGame';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CompactCountdown } from './CompactCountdown';

interface SaldaoCardProps {
  game: SaldaoGame;
}

const SaldaoCard: React.FC<SaldaoCardProps> = ({ game }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const formatCurrency = (value: string | undefined) => {
    if (!value) return 'R$ 0,00';
    // Try to parse as number
    const numValue = parseFloat(value.replace(',', '.'));
    if (isNaN(numValue)) return value;
    return numValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden transition-transform duration-200 group hover:ring-2 hover:ring-orange-500 cursor-pointer">
      <div className="relative">
        <img
          src={game.imagemDoJogo || '/placeholder-game.jpg'}
          alt={game.jogo}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges no canto superior */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
            🔥 SALDÃO
          </span>
          {game.quantidade && (
            <span className="bg-zinc-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
              {game.quantidade} unid.
            </span>
          )}
        </div>
      </div>
      <div className="w-full p-2 lg:p-3 flex-grow">
        {game.tipo && (
          <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs lg:text-sm font-bold px-3 py-1.5 rounded-md mb-2 shadow-md">
            {game.tipo}
          </span>
        )}
        {game.versaoDoJogo && (
          <p className="font-bold text-primary text-[10px] lg:text-[11px] whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">
            {game.versaoDoJogo}
          </p>
        )}
        <h3 className="text-[11px] lg:text-xs font-semibold text-white mb-1.5 lg:mb-2 line-clamp-2 min-h-[2.5em]">
          {game.jogo}
        </h3>
        
        <div className="mb-2 lg:mb-3 mt-1">
          {/* Countdown timer */}
          <div className="mb-1.5 lg:mb-2">
            <CompactCountdown />
          </div>
          
          {/* Price display */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-2 lg:p-3 border border-orange-500/30 shadow-sm shadow-orange-500/10">
            <div className="text-center">
              {/* Valor de Catálogo (original) */}
              {game.valorCatalogo && (
                <div className="mb-1 text-[9px] lg:text-[10px] leading-tight">
                  <span className="text-gray-400 line-through">
                    {formatCurrency(game.valorCatalogo)}
                  </span>
                </div>
              )}
              {/* Preço de Saldão em destaque */}
              <div className="mb-1">
                <span className="text-orange-500 text-[9px] lg:text-[10px]">R$</span>
                <span className="text-white text-[18px] lg:text-[22px] font-extrabold ml-0.5">
                  {game.valor ? parseFloat(game.valor.replace(',', '.')).toFixed(2).replace('.', ',') : '0,00'}
                </span>
              </div>
              <div className="text-orange-400 text-[9px] lg:text-[10px] font-bold">
                PREÇO SALDÃO
              </div>
            </div>
          </div>
          
          {/* Badge de quantidade */}
          {game.quantidade && (
            <div className="flex items-center justify-center mt-2">
              <span className="bg-orange-500/20 text-orange-400 text-[8px] lg:text-[9px] font-bold px-2 py-0.5 lg:py-1 rounded-full">
                Apenas {game.quantidade} disponíveis
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={async (e) => {
            e.stopPropagation();
            setIsAdding(true);
            
            try {
              // Convert price string to number
              const price = game.valor ? parseFloat(game.valor.replace(',', '.')) : 0;
              
              addToCart({
                id: game.id || `saldao-${game.jogo}`,
                game: game.jogo,
                imageLink: game.imagemDoJogo || '',
                price: price,
                type: 'primary' // Use primary type for saldao items
              });
              
              // Show success feedback
              setTimeout(() => {
                setIsAdding(false);
              }, 1000);
            } catch (error) {
              console.error('Error adding to cart:', error);
              setIsAdding(false);
            }
          }}
          disabled={isAdding}
          className={`text-[10px] lg:text-[12px] py-2 px-2 rounded flex items-center justify-center gap-1 w-full mt-2 transition-colors ${
            isAdding 
              ? 'bg-green-500 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600'
          } text-white`}
        >
          <ShoppingCart size={12} />
          {isAdding ? 'Adicionado!' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  );
};

export default SaldaoCard;
