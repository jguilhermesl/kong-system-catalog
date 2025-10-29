import React from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format-price';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    // Format the message for WhatsApp
    const phoneNumber = '+5581997893024';
    const message = items
      .map(
        (item) =>
          `${item.game} (${item.type === 'primary' ? 'Primária' : 'Secundária'}) - ${formatPrice(item.price)}`
      )
      .join('\n');
    
    const totalMessage = `\n\nTotal: ${formatPrice(totalPrice)}`;
    
    const encodedMessage = encodeURIComponent(`Olá, gostaria de comprar os seguintes jogos:\n${message}${totalMessage}`);
    
    // Open WhatsApp with the prepared message
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Close the modal and clear the cart
    onClose();
    clearCart();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center text-gray-900">
            <ShoppingCart className="mr-2" size={20} />
            Carrinho de Compras
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Seu carrinho está vazio</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.type}`}
                  className="flex items-center gap-3 border-b pb-3"
                >
                  <img
                    src={item.imageLink}
                    alt={item.game}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm text-gray-900">{item.game}</h3>
                    <p className="text-xs text-gray-600">
                      {item.type === 'primary' ? 'Primária' : 'Secundária'}
                    </p>
                    <p className="font-bold text-primary">{formatPrice(item.price)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remover item"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-lg text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
