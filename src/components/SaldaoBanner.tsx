import React from 'react';
import { useNavigate } from 'react-router-dom';

const SaldaoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full bg-gradient-to-r from-black via-orange-950 to-black overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-pulse"></div>
      
      {/* Moving shine effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-5 md:py-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2 md:space-y-3">
          {/* Saldao Tag */}
          <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full font-black text-xs md:text-sm shadow-lg animate-bounce">
            <span className="text-base md:text-xl">🔥</span>
            QUEIMA DE ESTOQUE
            <span className="text-base md:text-xl">🔥</span>
          </div>
          
          {/* Main message */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black animate-pulse">
            <span className="text-orange-400 drop-shadow-[0_0_25px_rgba(251,146,60,0.6)]">
              SALDÃO KONG!
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-white text-sm md:text-lg font-bold mb-2">
            💎 Estamos queimando estoque do ano todo! Preços imperdíveis!
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/saldao')}
            className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-base md:text-lg shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all transform hover:scale-105 active:scale-95"
          >
            ADQUIRA AGORA! 🎮
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default SaldaoBanner;
