import React from 'react';
import { useNavigate } from 'react-router-dom';
import mikePerson from '../assets/mike-person-ny.png';

const SaldaoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full bg-gradient-to-br from-white via-amber-50 to-white overflow-hidden">
      {/* Confetti and fireworks effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-0 left-[10%] text-2xl animate-[fall_10s_linear_infinite]">🎊</div>
        <div className="absolute top-0 left-[25%] text-xl animate-[fall_13s_linear_infinite_2s]">✨</div>
        <div className="absolute top-0 left-[40%] text-2xl animate-[fall_11s_linear_infinite_4s]">🎉</div>
        <div className="absolute top-0 left-[60%] text-xl animate-[fall_14s_linear_infinite_1s]">✨</div>
        <div className="absolute top-0 left-[75%] text-2xl animate-[fall_12s_linear_infinite_3s]">🎊</div>
        <div className="absolute top-0 left-[90%] text-xl animate-[fall_15s_linear_infinite_5s]">🎉</div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-5">
          {/* Mike Person (Monkey Party) */}
          <div className="w-36 h-36 md:w-44 md:h-44 flex-shrink-0">
            <img 
              src={mikePerson} 
              alt="Kong Ano Novo" 
              className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center space-y-3 md:space-y-4 max-w-3xl">
            {/* New Year Tag */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-white px-5 md:px-6 py-2 md:py-2.5 rounded-full font-black text-sm md:text-base shadow-lg shadow-amber-300/50">
              <span className="text-lg md:text-xl">🎆</span>
              SALDÃO DE ANO NOVO
              <span className="text-lg md:text-xl">🎆</span>
            </div>
            
            {/* Main message */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
                SALDÃO KONG!
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-800 text-base md:text-xl font-bold max-w-2xl">
              🥳 Comece 2026 com jogos a partir de R$ 7,99! Ofertas explosivas! 🎮
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/saldao')}
              className="mt-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 font-black py-3 md:py-4 px-8 md:px-10 rounded-full text-base md:text-lg shadow-2xl shadow-amber-400/40 hover:shadow-amber-500/50 transition-all transform hover:scale-105 active:scale-95 border-2 border-amber-400"
            >
              VER SALDÃO AGORA! 🎉
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default SaldaoBanner;
