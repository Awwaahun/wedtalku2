
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface CountdownProps {
  config: WeddingConfig;
}

export default function Countdown({ config }: CountdownProps) {
  const weddingDate = new Date(`${config.wedding.date}T${config.wedding.time}`).getTime();

  const [timeLeft, setTimeLeft] = useState({
    Hari: 0,
    Jam: 0,
    Menit: 0,
    Detik: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      setTimeLeft({
        Hari: Math.max(Math.floor(distance / (1000 * 60 * 60 * 24)), 0),
        Jam: Math.max(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0),
        Menit: Math.max(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 0),
        Detik: Math.max(Math.floor((distance % (1000 * 60)) / 1000), 0),
      });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="py-16 bg-gradient-to-r from-rose-500 to-orange-500">
      <div className="container mx-auto px-4 text-center text-white">
        <Clock size={48} className="mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-serif mb-12">Menghitung Mundur Menuju Selamanya</h2>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <div
              key={unit}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 md:p-8 w-20 md:w-28 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up flex flex-col items-center justify-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 transition-transform duration-300">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-wider">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
