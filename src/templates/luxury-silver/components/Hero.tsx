import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles, Calendar, MapPin, ChevronDown } from 'lucide-react';

interface HeroProps {
  onAdminAccess?: () => void;
  config: {
    hero: {
      backgroundImage: string;
      tagline: string;
    };
    couple: {
      groom: { name: string };
      bride: { name: string };
    };
    wedding: {
      dateDisplay: string;
      date: string;
      time: string;
    };
    events: Array<{
      location: string;
      address: string;
    }>;
  };
}

const Hero: React.FC<HeroProps> = ({ onAdminAccess, config }) => {
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<number | null>(null);
  const [offsetY, setOffsetY] = useState(0);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY * 0.4);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeartClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0b1a34] via-[#1b2d4f] to-[#dfe4ea] text-gray-100">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-90 will-change-transform"
        style={{
          backgroundImage: `url(${config.hero.backgroundImage})`,
          transform: `translateY(${offsetY * 0.3}px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a34]/90 via-[#1b2d4f]/70 to-[#dfe4ea]/40 backdrop-blur-sm" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 md:px-10 max-w-3xl animate-fade-in">
        {/* Pre-title */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 shadow-md mb-6 animate-fade-up">
          <Sparkles className="text-slate-200" size={20} />
          <span className="text-slate-100 font-semibold text-sm tracking-wide">
            The Wedding of
          </span>
        </div>

        {/* Names */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-slate-50 leading-tight mb-2 drop-shadow-lg">
          {config.couple.groom.name}
        </h1>

        <div className="flex items-center justify-center gap-4 my-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-300" />
          <button
            onClick={handleHeartClick}
            className="relative transition-transform hover:scale-110 active:scale-95 cursor-pointer group"
            title="Triple click for admin access"
          >
            <Heart
              className={`text-slate-200 transition-all ${
                clickCount > 0
                  ? 'animate-pulse scale-110'
                  : 'opacity-80 group-hover:opacity-100'
              }`}
              size={36}
              fill="currentColor"
            />
            {clickCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce">
                {clickCount}
              </span>
            )}
          </button>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-300" />
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-slate-50 leading-tight mb-6 drop-shadow-lg">
          {config.couple.bride.name}
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-xl mx-auto mb-8">
          {config.hero.tagline}
        </p>

        {/* Event Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-md">
            <div className="bg-gradient-to-br from-[#1b2d4f] to-[#4b5f7a] p-3 rounded-xl">
              <Calendar className="text-slate-100" size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-300 font-medium">Tanggal</p>
              <p className="text-sm font-bold text-slate-100">{config.wedding.dateDisplay}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-md">
            <div className="bg-gradient-to-br from-[#4b5f7a] to-[#8b9cb2] p-3 rounded-xl">
              <MapPin className="text-slate-100" size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-300 font-medium">Lokasi</p>
              <p className="text-sm font-bold text-slate-100 truncate max-w-[150px] sm:max-w-[200px]">
                {config.events[0]?.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator (Centered Perfectly) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-full">
        <div className="flex flex-col items-center gap-2 text-slate-200">
          <span className="text-sm font-medium">Scroll untuk info lebih lanjut</span>
          <ChevronDown size={28} className="animate-pulse" />
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#a1b2c3]/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-40 h-40 bg-[#8fa2b8]/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
};

export default Hero;
