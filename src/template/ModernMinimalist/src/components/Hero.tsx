import React, { useState, useRef } from 'react';
import { Heart, ChevronDown, Sparkles } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface HeroProps {
  onAdminAccess?: () => void;
  config: WeddingConfig;
}

const Hero: React.FC<HeroProps> = ({ onAdminAccess, config }) => {
  const [clickCount, setClickCount] = useState(0);
  // Fix: Use `number` for the timeout ID from `setTimeout` in a browser environment, instead of `NodeJS.Timeout`.
  const clickTimeoutRef = useRef<number | null>(null);

  const handleHeartClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (clickTimeoutRef.current) {
      // Fix: Use window.clearTimeout to ensure the function signature matches browser environments.
      window.clearTimeout(clickTimeoutRef.current);
    }

    if (newClickCount === 3) {
      setClickCount(0);
      onAdminAccess?.();
    } else {
      // Fix: Use window.setTimeout to get a `number` return type, which matches the ref's type.
      clickTimeoutRef.current = window.setTimeout(() => {
        setClickCount(0);
      }, 1000); // Reset after 1 second
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
        ></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-300 opacity-20 animate-float"
            size={Math.random() * 30 + 20}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-amber-400 opacity-40 animate-sparkle"
            size={Math.random() * 20 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-8 animate-fade-in">
          <p className="text-gray-700 font-serif text-lg mb-2">The Wedding of</p>
          <h1 className="text-6xl md:text-8xl font-serif text-gray-800 mb-4 animate-scale-in">
            {config.couple.groom.name} & {config.couple.bride.name}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <div className="h-px w-16 bg-gray-400 animate-slide-in-left"></div>
            <button
              onClick={handleHeartClick}
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer group relative"
              title="Triple click for admin access"
              aria-label="Heart icon - Triple click for admin access"
            >
              <Heart 
                className={`text-rose-500 ${clickCount > 0 ? 'animate-pulse' : 'animate-pulse-glow'}`} 
                size={24} 
                fill="currentColor" 
              />
              {clickCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                  {clickCount}
                </span>
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Triple click me! 🔐
              </span>
            </button>
            <div className="h-px w-16 bg-gray-400 animate-slide-in-right"></div>
          </div>
        </div>

        <div className="animate-fade-in-delay">
          <p className="text-2xl font-light text-gray-700 mb-8">
            {config.wedding.dateDisplay}
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {config.hero.tagline}
          </p>
        </div>

        <div className="mt-16 animate-bounce">
          <ChevronDown size={32} className="text-gray-600 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export default Hero;