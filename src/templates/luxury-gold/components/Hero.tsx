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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* Background Image + Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 animate-slow-zoom"
        style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-300 opacity-25 animate-float"
            size={Math.random() * 25 + 20}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 8}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-amber-400 opacity-40 animate-sparkle"
            size={Math.random() * 20 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 6 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-10">
        <div className="animate-fade-in mb-10">
          <p className="text-gray-700 font-serif text-lg mb-3 italic tracking-wide">
            The Wedding of
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif text-gray-900 drop-shadow-sm animate-scale-in tracking-wide">
            {config.couple.groom.name}
            <span className="text-rose-500 mx-2">&amp;</span>
            {config.couple.bride.name}
          </h1>
          <div className="flex items-center justify-center space-x-4 mt-6 text-gray-600">
            <div className="h-px w-16 bg-gray-400/60 animate-slide-in-left"></div>
            <button
              onClick={handleHeartClick}
              className="relative focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
              title="Triple click for admin access"
            >
              <Heart
                className={`text-rose-500 drop-shadow-md transition-all ${
                  clickCount > 0
                    ? 'animate-heart-glow scale-110'
                    : 'opacity-80 group-hover:opacity-100'
                }`}
                size={28}
                fill="currentColor"
              />
              {clickCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                  {clickCount}
                </span>
              )}
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Triple click me 💖
              </span>
            </button>
            <div className="h-px w-16 bg-gray-400/60 animate-slide-in-right"></div>
          </div>
        </div>

        <div className="animate-fade-in-delay">
          <p className="text-xl sm:text-2xl font-light text-gray-700 mb-6 animate-fade-in-slow">
            {config.wedding.dateDisplay}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-base sm:text-lg italic animate-fade-up">
            {config.hero.tagline}
          </p>
        </div>

        <div className="mt-16 animate-slow-bounce">
          <ChevronDown
            size={36}
            className="text-gray-600 mx-auto drop-shadow-md opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
