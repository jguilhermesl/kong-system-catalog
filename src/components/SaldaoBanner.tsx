import React from 'react';
import { useNavigate } from 'react-router-dom';
import mikePerson from '../assets/mike-person.png';

const SaldaoBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full bg-gradient-to-br from-red-950 via-red-800 to-red-950 overflow-hidden">
      {/* Subtle snowflakes effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 left-[15%] text-xl animate-[fall_12s_linear_infinite]">❄️</div>
        <div className="absolute top-0 left-[45%] text-lg animate-[fall_15s_linear_infinite_3s]">❄️</div>
        <div className="absolute top-0 left-[75%] text-xl animate-[fall_13s_linear_infinite_6s]">❄️</div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-5">
          {/* Mike Person (Monkey Santa) */}
          <div className="w-36 h-36 md:w-44 md:h-44 flex-shrink-0">
            <img 
              src={mikePerson} 
              alt="Kong Papai Noel" 
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center space-y-3 md:space-y-4 max-w-3xl">
            {/* Christmas Tag */}
            <div className="inline-flex items-center gap-2 bg-white text-red-700 px-5 md:px-6 py-2 md:py-2.5 rounded-full font-black text-sm md:text-base shadow-lg">
              <span className="text-lg md:text-xl">🔥</span>
              SALDÃO DE NATAL
              <span className="text-lg md:text-xl">🔥</span>
            </div>
            
            {/* Main message */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
              <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                SALDÃO KONG!
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-white text-base md:text-xl font-bold max-w-2xl">
              🎁 Jogos a partir de R$ 7,99 com preços imperdíveis para o Natal! 🎮
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/saldao')}
              className="mt-2 bg-white text-red-700 hover:bg-gray-100 font-black py-3 md:py-4 px-8 md:px-10 rounded-full text-base md:text-lg shadow-2xl hover:shadow-white/30 transition-all transform hover:scale-105 active:scale-95 border-2 border-white"
            >
              VER SALDÃO AGORA! 🎄
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(180deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

export default SaldaoBanner;
