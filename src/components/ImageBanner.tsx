import React, { useState, useEffect } from 'react';
import { Zap, DollarSign, MessageCircle } from 'lucide-react';

const ImageBanner: React.FC = () => {
  const bannerImages = [
    'https://gmedia.playstation.com/is/image/SIEPDC/horizon-zero-dawn-remastered-keyart-01-en-27sep24?$native$',
    'https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/JKqkaz5Sy6AvH2fZAVdjTxR8.png',
    'https://gmedia.playstation.com/is/image/SIEPDC/split-fiction-key-art-no-logo-01-desktop-06dec24?$native$',
    'https://gmedia.playstation.com/is/image/SIEPDC/baldurs-gate-3-keyart-nologo-01-en-31may23?$native$',
    'https://gmedia.playstation.com/is/image/SIEPDC/god-of-war-ragnarok-keyart-01-en-07sep21?$native$',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const scrollToGames = () => {
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full h-[600px] md:h-[700px] relative overflow-hidden">
      {/* Background Image with Carousel */}
      <div className="absolute inset-0">
        <img
          src={bannerImages[currentImageIndex]}
          alt={`Banner ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-1000"
          loading="lazy"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            {/* Main Title */}
            <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
              JOGOS DIGITAIS
              <br />
              <span className="text-orange-500">PS4 & PS5</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-2xl text-gray-200 mb-4 md:mb-8 font-medium">
              Os melhores preços do mercado com entrega instantânea
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-8">
              {/* Feature 1: Entrega Express */}
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">ENTREGA EXPRESS</h3>
                    <p className="text-gray-300 text-xs">Receba em minutos</p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Economia */}
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 hover:border-green-500/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">ECONOMIA</h3>
                    <p className="text-gray-300 text-xs">Até 70% mais barato</p>
                  </div>
                </div>
              </div>

              {/* Feature 3: 100% Seguro */}
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 hover:border-blue-500/50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Envio digital</h3>
                    <p className="text-gray-300 text-xs">Por WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={scrollToGames}
              className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 text-lg shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>COMPRAR AGORA</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Additional Info */}
            <div className="mt-4 md:mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>+ de 400 jogos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Suporte 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Pagamento seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="hidden absolute  bottom-8 left-1/2 transform -translate-x-1/2 md:flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-orange-500 w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageBanner;
