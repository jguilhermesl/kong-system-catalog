import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 py-4 px-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-white animate-pulse" />
          <span className="text-white font-bold text-lg md:text-xl uppercase">
            ⚡ Preços mudam em:
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[60px] md:min-w-[70px]">
            <div className="text-white text-2xl md:text-3xl font-bold text-center">
              {formatTime(timeLeft.hours)}
            </div>
            <div className="text-white/80 text-xs md:text-sm uppercase text-center">
              Horas
            </div>
          </div>
          
          <div className="text-white text-2xl md:text-3xl font-bold">:</div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[60px] md:min-w-[70px]">
            <div className="text-white text-2xl md:text-3xl font-bold text-center">
              {formatTime(timeLeft.minutes)}
            </div>
            <div className="text-white/80 text-xs md:text-sm uppercase text-center">
              Min
            </div>
          </div>
          
          <div className="text-white text-2xl md:text-3xl font-bold">:</div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 md:px-4 md:py-3 min-w-[60px] md:min-w-[70px]">
            <div className="text-white text-2xl md:text-3xl font-bold text-center">
              {formatTime(timeLeft.seconds)}
            </div>
            <div className="text-white/80 text-xs md:text-sm uppercase text-center">
              Seg
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
