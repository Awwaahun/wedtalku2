import React, { useState, useRef } from 'react';
import { Heart, ChevronDown, Sparkles } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface HeroProps {
  onAdminAccess?: () => void;
  config: WeddingConfig;
}

const Hero: React.FC<HeroProps> = ({ onAdminAccess, config }) => {
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleHeartClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }

    if (newClickCount === 3) {
      setClickCount(0);
      onAdminAccess?.();
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        setClickCount(0);
      }, 1000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF8F3]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] scale-105"
        style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#fffdf7]/80 via-[#fffaf3]/90 to-[#fef8ec]/95 backdrop-blur-[3px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_75%,rgba(0,0,0,0.08))]" />

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-amber-300/60 animate-sparkle"
            size={Math.random() * 20 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 6 + 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-12">
        <div className="animate-fade-in mb-12 bg-white/25 backdrop-blur-md border border-amber-300/40 rounded-2xl shadow-[0_0_25px_rgba(255,215,100,0.2)] p-10 inline-block">
          <p className="text-gray-700 font-serif text-lg mb-3 italic tracking-wide">The Wedding of</p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 animate-[shimmer_3s_infinite] drop-shadow-md">
            {config.couple.groom.name}
            <span className="mx-2 text-amber-600">&amp;</span>
            {config.couple.bride.name}
          </h1>
          <p className="text-gray-700 mt-6 text-lg italic">{config.hero.tagline}</p>
        </div>

        <div className="animate-fade-in-delay">
          <p className="text-xl sm:text-2xl font-light text-amber-700 mb-8 animate-fade-in-slow">
            {config.wedding.dateDisplay}
          </p>
        </div>

        <div className="mt-16 animate-slow-bounce">
          <ChevronDown size={38} className="text-amber-600 mx-auto opacity-80 hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}
      </style>
    </div>
  );
};

export default Hero;
