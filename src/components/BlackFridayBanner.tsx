import React from 'react';

const BlackFridayBanner: React.FC = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-black via-red-950 to-black overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse"></div>
      
      {/* Moving shine effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-5 md:py-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2 md:space-y-3">
          {/* Black Friday Tag */}
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 md:px-5 py-1.5 md:py-2 rounded-full font-black text-xs md:text-sm shadow-lg animate-bounce">
            <span className="text-base md:text-xl">🔥</span>
            BLACK FRIDAY
            <span className="text-base md:text-xl">🔥</span>
          </div>
          
          {/* Main message */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black animate-pulse">
            <span className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]">
              ATÉ 80% OFF
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-white text-sm md:text-lg font-bold">
            🎮 Os melhores jogos com descontos imperdíveis!
          </p>
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

export default BlackFridayBanner;
