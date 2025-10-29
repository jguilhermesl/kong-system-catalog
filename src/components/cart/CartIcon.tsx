import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartModal from './CartModal';

const CartIcon: React.FC = () => {
  const { totalItems } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Abrir carrinho"
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      <CartModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

export default CartIcon;
