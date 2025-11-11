import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const CompactCountdown: React.FC = () => {
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
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-md py-1.5 px-2 mb-2">
      <div className="flex items-center justify-center gap-1.5">
        <Clock size={12} className="text-white" />
        <span className="text-white text-[9px] font-semibold">
          Termina em:
        </span>
        <div className="flex items-center gap-1">
          <span className="text-white text-[10px] font-bold">
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};