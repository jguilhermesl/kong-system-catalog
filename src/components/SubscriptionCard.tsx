import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import AddToCartModal from './cart/AddToCartModal';
import type { Game } from '../models/Game';

interface SubscriptionCardProps {
  title: string;
  duration: string;
  cashPrice: string;
  installmentPrice: string;
  installments: string;
  savings?: string;
  imageUrl: string;
  game: Game;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  duration,
  cashPrice,
  installmentPrice,
  installments,
  savings,
  imageUrl,
  game,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full bg-zinc-900 rounded-lg overflow-hidden transition-transform duration-200 group hover:ring-2 hover:ring-primary cursor-pointer">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Badge no canto superior */}
          <div className="absolute top-2 left-2">
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
              ASSINATURA
            </span>
          </div>
        </div>

        <div className="w-full p-2 lg:p-3 flex-grow">
          <p className="font-bold text-blue-400 text-[10px] whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">
            ESSENTIAL
          </p>
          <p className="font-bold text-primary text-[12px] lg:text-[14px]">
            {title}
          </p>
          <h3 className="text-[11px] lg:text-xs font-semibold text-white mb-1.5 lg:mb-2">
            {duration}
          </h3>

          <div className="mb-2 lg:mb-3 mt-1">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg p-2 lg:p-3 border border-primary/30 shadow-sm shadow-primary/10">
              <div className="text-center">
                {/* Preço à vista em destaque */}
                <div className="mb-1">
                  <span className="text-primary text-[9px] lg:text-[10px]">
                    R$
                  </span>
                  <span className="text-white text-[16px] lg:text-[18px] font-extrabold ml-0.5">
                    {cashPrice}
                  </span>
                  <span className="text-gray-400 text-[9px] lg:text-[10px] ml-1">
                    à vista
                  </span>
                </div>
                {/* Preço parcelado */}
                <div className="text-gray-300 text-[9px] lg:text-[11px]">
                  ou {installments} de{' '}
                  <span className="font-semibold">R$ {installmentPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badge de economia */}
          {savings && (
            <div className="flex items-center justify-center mt-1.5 lg:mt-2">
              <span className="bg-green-500/20 text-green-400 text-[8px] lg:text-[9px] font-bold px-2 py-0.5 lg:py-1 rounded-full">
                💰 Economize até {savings} neste plano!
              </span>
            </div>
          )}

          <div className="mt-1.5 lg:mt-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] lg:text-[12px] py-2 px-2 rounded flex items-center justify-center gap-1 w-full mt-2 bg-primary text-white hover:bg-primary/90"
            >
              <ShoppingCart size={12} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        game={game}
      />
    </>
  );
};

export default SubscriptionCard;
