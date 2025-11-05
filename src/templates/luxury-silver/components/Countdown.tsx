import { useState, useEffect } from 'react';
import { Clock, Heart } from 'lucide-react';

const Countdown = ({ config }) => {
  const weddingDate = new Date(`${config?.wedding?.date || '2025-11-22'}T${config?.wedding?.time || '14:00:00'}`).getTime();

  const [timeLeft, setTimeLeft] = useState({
    Hari: 0,
    Jam: 0,
    Menit: 0,
    Detik: 0,
  });

  const [previousTime, setPreviousTime] = useState(timeLeft);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      const newTime = {
        Hari: Math.max(Math.floor(distance / (1000 * 60 * 60 * 24)), 0),
        Jam: Math.max(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0),
        Menit: Math.max(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 0),
        Detik: Math.max(Math.floor((distance % (1000 * 60)) / 1000), 0),
      };

      setPreviousTime(timeLeft);
      setTimeLeft(newTime);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {/* Background Gradient: Navy to Silver */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1a34] via-[#1b2d4f] to-[#dfe4ea]">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:50px_50px]" />
        </div>
      </div>

      <div className="container mx-auto px-4 text-center text-white relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-slate-400/30">
              <Clock size={40} className="text-slate-200" />
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif mb-4 text-slate-100 drop-shadow-lg">
            Menghitung Mundur Menuju Selamanya
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Setiap detik membawa kami lebih dekat ke momen terindah dalam hidup kami
          </p>
        </div>

        {/* Countdown Cards */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-5xl mx-auto mb-8">
          {Object.entries(timeLeft).map(([unit, value], index) => {
            const hasChanged = previousTime[unit] !== value;

            return (
              <div key={unit} className="group relative" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Glow */}
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-3xl group-hover:bg-white/20 transition-all duration-300" />

                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-[#1b2d4f]/90 to-[#a1b2c3]/40 backdrop-blur-lg rounded-3xl p-6 md:p-8 w-24 md:w-36 shadow-2xl border border-white/40 hover:scale-110 hover:-rotate-2 transition-all duration-500">
                  {/* Corner dot */}
                  <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-[#b0c4de] to-[#dee2e6] rounded-full" />

                  {/* Value */}
                  <div
                    className={`text-5xl md:text-7xl font-bold mb-3 transition-all duration-300 ${
                      hasChanged ? 'animate-pulse text-sky-300' : 'text-slate-50'
                    }`}
                  >
                    {value.toString().padStart(2, '0')}
                  </div>

                  {/* Label */}
                  <div className="relative">
                    <div className="text-xs md:text-sm uppercase tracking-wider font-semibold text-slate-200">
                      {unit}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-slate-300 via-sky-200 to-slate-300 rounded-full" />
                  </div>
                </div>

                {/* Border hover ring */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-slate-200/40 transition-all duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-white/30">
            <div
              className="h-full bg-gradient-to-r from-slate-200 via-sky-200 to-slate-300 animate-pulse"
              style={{
                width: `${((timeLeft.Detik % 60) / 60) * 100}%`,
                transition: 'width 1s linear',
              }}
            />
          </div>
        </div>

        {/* Footer Message */}
        <div className="relative">
          <div className="inline-block bg-white/80 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl border border-white/50">
            <div className="flex items-center gap-3">
              <Heart className="text-sky-500" size={24} fill="currentColor" />
              <p className="text-slate-700 font-medium text-lg">
                Setiap momen berharga menuju hari bahagia kami
              </p>
              <Heart className="text-sky-500" size={24} fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Silver Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </div>
  );
};

export default Countdown;
