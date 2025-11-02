import React, { useState, useEffect } from 'react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

interface CountdownProps {
  config: WeddingConfig;
}

const Countdown: React.FC<CountdownProps> = ({ config }) => {
  const weddingDate = new Date(`${config.wedding.date}T${config.wedding.time}`).getTime();

  const [timeLeft, setTimeLeft] = useState({
    Days: 0,
    Hours: 0,
    Minutes: 0,
    Seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      setTimeLeft({
        Days: Math.max(Math.floor(distance / (1000 * 60 * 60 * 24)), 0),
        Hours: Math.max(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0),
        Minutes: Math.max(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 0),
        Seconds: Math.max(Math.floor((distance % (1000 * 60)) / 1000), 0),
      });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="py-20 bg-[#1f213a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-wider text-white mb-3">COUNTDOWN TO FOREVER</h2>
            <div className="w-24 h-px bg-yellow-500 mx-auto"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-3xl mx-auto">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div 
                className="text-5xl md:text-7xl font-semibold text-yellow-500"
                style={{ textShadow: '0 0 10px rgba(234, 179, 8, 0.5)' }}
              >
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base uppercase tracking-widest text-gray-400 mt-2">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Countdown;