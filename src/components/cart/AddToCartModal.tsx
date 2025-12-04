import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import type { Game } from '../../models/Game';
import { formatPrice } from '../../utils/format-price';
import { convertRealToNumber } from '../../utils/convert-real-to-number';
import { trackAddToCart } from '../../utils/analytics';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({ isOpen, onClose, game }) => {
  const { addToCart } = useCart();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleAddPrimary = () => {
    const price = convertRealToNumber(game.primaryValue.toString());
    
    addToCart({
      id: game.id,
      game: game.game,
      imageLink: game.imageLink,
      price: price,
      type: 'primary'
    });
    
    trackAddToCart({
      id: game.id,
      name: game.game,
      category: game.category || undefined,
      price: price,
      accountType: 'Primária',
    });
    
    onClose();
  };

  const handleAddSecondary = () => {
    const price = convertRealToNumber(game.secondaryValue.toString());
    
    addToCart({
      id: game.id,
      game: game.game,
      imageLink: game.imageLink,
      price: price,
      type: 'secondary'
    });
    
    trackAddToCart({
      id: game.id,
      name: game.game,
      category: game.category || undefined,
      price: price,
      accountType: 'Secundária',
    });
    
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-black">Adicionar ao Carrinho</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={game.imageLink}
              alt={game.game}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-medium text-gray-900">{game.game}</h3>
              <p className="text-sm text-gray-600">{game.gameVersion}</p>
              {game.category !== "N/A" && !!game.category && (
                <p className="text-xs font-bold text-[rgb(42,114,249)]">
                  {game.category}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm mb-4 text-gray-700">Escolha uma opção:</p>

          <div className="space-y-3">
            <button
              onClick={handleAddPrimary}
              className="w-full py-2 px-4 rounded flex items-center justify-between bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <span>Primária</span>
              <span className="font-bold">{formatPrice(game.primaryValue)}</span>
            </button>
            
            <button
              onClick={handleAddSecondary}
              className="w-full py-2 px-4 rounded flex items-center justify-between bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <span>Secundária</span>
              <span className="font-bold">{formatPrice(game.secondaryValue)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddToCartModal;
