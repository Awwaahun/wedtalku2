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
    const update = () => {
      const now = new Date().getTime();
      const diff = weddingDate - now;
      setTimeLeft({
        Hari: Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0),
        Jam: Math.max(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0),
        Menit: Math.max(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), 0),
        Detik: Math.max(Math.floor((diff % (1000 * 60)) / 1000), 0),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="py-20 bg-gradient-to-b from-[#fffaf3] to-[#fef7e8]">
      <div className="container mx-auto px-4 text-center">
        <Clock size={48} className="mx-auto mb-4 text-amber-600" />
        <h2 className="text-3xl md:text-4xl font-serif text-amber-800 mb-12 tracking-wide">
          Menghitung Mundur Menuju Selamanya
        </h2>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <div
              key={unit}
              className="relative bg-white/20 backdrop-blur-md border border-amber-400/40 rounded-2xl p-6 md:p-8 w-24 md:w-28 text-amber-800 shadow-[0_0_20px_rgba(255,215,100,0.2)] hover:shadow-[0_0_30px_rgba(255,215,100,0.3)] transition-all duration-500 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 animate-pulse-gold">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-wider font-medium">
                {unit}
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-60 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
