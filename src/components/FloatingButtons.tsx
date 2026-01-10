import React from 'react';
import { MessageCircle } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';

const FloatingButtons: React.FC = () => {
  const whatsappNumber = '5581993040761'; // Substitua pelo número correto
  const instagramUsername = 'konggamesoficial'; // Substitua pelo username correto

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      'Olá! Gostaria de saber mais sobre os jogos disponíveis.'
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleInstagramClick = () => {
    window.open(`https://instagram.com/${instagramUsername}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Fale conosco no WhatsApp
        </span>

        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
      </button>

      {/* Instagram Button */}
      <button
        onClick={handleInstagramClick}
        className="group relative bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Siga-nos no Instagram"
      >
        <FaInstagram className="h-6 w-6" />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Siga-nos no Instagram
        </span>
      </button>
    </div>
  );
};

export default FloatingButtons;
