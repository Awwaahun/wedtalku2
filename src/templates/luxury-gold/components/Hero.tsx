import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

interface HeroProps {
  config: WeddingConfig;
  onAdminAccess?: () => void;
}

const Hero: React.FC<HeroProps> = ({ config, onAdminAccess }) => {
  // Fix: Add admin access functionality to match template 1
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleAdminClick = () => {
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
      }, 1000); // Reset after 1 second
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white text-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent"></div>

      <div className="relative z-10 p-4">
        <h2 className="text-2xl md:text-3xl tracking-[0.2em] uppercase text-gray-300 mb-4 animate-fade-in-down">
          We are getting married
        </h2>
        <h1 className="text-6xl md:text-9xl text-white animate-fade-in" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {config.couple.groom.name}
        </h1>
        <div 
          onClick={handleAdminClick}
          className="my-4 md:my-8 text-4xl md:text-6xl text-yellow-500 animate-fade-in-up cursor-pointer group relative" 
          style={{ animationDelay: '0.5s', textShadow: '0 0 15px rgba(234, 179, 8, 0.7)' }}
          title="Triple click for admin access"
          aria-label="Ampersand - Triple click for admin access"
        >
          &
          {clickCount > 0 && (
            <span className="absolute -top-2 right-1/2 translate-x-1/2 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
              {clickCount}
            </span>
          )}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Triple click me! 🔐
          </span>
        </div>
        <h1 className="text-6xl md:text-9xl text-white animate-fade-in-up" style={{ animationDelay: '0.8s', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {config.couple.bride.name}
        </h1>
        <p className="mt-8 text-xl md:text-2xl tracking-widest text-gray-300 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          {config.wedding.dateDisplay}
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown size={32} />
      </div>
    </div>
  );
};

export default Hero;