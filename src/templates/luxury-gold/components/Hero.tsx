import React, { useState, useRef } from 'react';
import { Heart, ChevronDown, BookOpenText } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface HeroProps {
  onAdminAccess?: () => void;
  config: WeddingConfig;
}

const Hero: React.FC<HeroProps> = ({ onAdminAccess, config }) => {
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleBookClick = () => {
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

  const { groom, bride } = config.couple;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1F1E1A] font-serif">
      {/* Background: Warna Dasar Gelap untuk Kontras Mewah */}

      {/* Background Image dan Parallax (Parallax Sederhana Saat Scroll) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-[6000ms] scale-105"
        style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
      />
      
      {/* Overlay Ganda: Memberi Kedalaman dan Fokus pada Tengah */}
      {/* 1. Lapisan Gelap Tipis (Efek Matte) */}
      <div className="absolute inset-0 bg-black/50 backdrop-filter backdrop-blur-[1px]" />
      {/* 2. Gradien Radial Tengah (Fokus pada Konten) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(31,30,26,0.1)_0%,rgba(31,30,26,0.95)_75%)]" />

      {/* Secret Admin Access Button */}
      <button 
        onClick={handleBookClick}
        className="absolute bottom-4 left-4 p-2 z-50 text-amber-500/40 hover:text-amber-300/70 transition-colors"
        aria-label="Admin Access Toggle"
      >
        <BookOpenText size={24} />
      </button>

      {/* Content Tengah */}
      <div className="relative z-10 text-center px-6 py-12 max-w-lg w-full">
        
        {/* Frame Konten Utama: Lebih Berani dan Berkelas */}
        <div className="animate-fade-in bg-white/5 border border-amber-500/30 rounded-lg shadow-2xl shadow-black/70 p-10 sm:p-14 backdrop-blur-[5px] text-white/90 hero-frame">
          
          {/* Ornamen Atas (Garis Ornamen Khusus) */}
          <div className="mb-8 relative">
            <Heart size={36} className="mx-auto fill-amber-400/80 stroke-1 stroke-amber-200 mb-2 drop-shadow-lg" />
            <div className="w-1/3 h-px bg-amber-600/70 mx-auto my-3" />
          </div>

          <p className="text-amber-100 font-light text-base mb-3 tracking-widest uppercase opacity-70">The Sacred Matrimony of</p>
          
          {/* Nama Pasangan: Warna Emas & Shadow Tajam */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-playfair font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 drop-shadow-xl leading-none">
            {groom.name}
          </h1>
          
          {/* Ikon Penghubung: Font Script Mewah */}
          <p className="text-4xl sm:text-5xl text-amber-500 font-script my-4 tracking-wider font-medium">
            &amp;
          </p>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-playfair font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-100 drop-shadow-xl leading-none mb-8">
            {bride.name}
          </h1>
          
          <div className="w-2/3 h-px bg-amber-600/50 mx-auto my-8" />

          {/* Tanggal & Tagline */}
          <p className="text-2xl sm:text-3xl font-light text-amber-100 mb-4 tracking-widest">
            {config.wedding.dateDisplay}
          </p>

          <p className="text-amber-200/80 mt-4 text-base italic font-light tracking-wide">
            "{config.hero.tagline}"
          </p>
          
        </div>

        {/* Scroll Down Indicator */}
        <div className="mt-16 animate-slow-bounce">
          <ChevronDown size={50} className="text-amber-400 mx-auto opacity-80 hover:opacity-100 transition-opacity drop-shadow-md" />
          <p className="text-base text-amber-300/80 mt-2 tracking-widest">Open Invitation</p>
        </div>
      </div>

      <style>
        {`
          /* Custom Font Fallback/Class */
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-script { font-family: 'Great Vibes', cursive; }
          
          /* Keyframes for slow bounce */
          @keyframes slow-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          
          .animate-slow-bounce {
            animation: slow-bounce 3s infinite ease-in-out;
          }

          /* Animasi Fade In */
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1.5s ease-out 0.5s forwards;
            opacity: 0; /* Mulai dari tidak terlihat */
          }

          /* Filigree (Ornamen Sudut) dengan Pseudo-element */
          .hero-frame::before, .hero-frame::after {
            content: '';
            position: absolute;
            width: 30px;
            height: 30px;
            border: 2px solid #D9A844; /* Warna Emas */
            opacity: 0.8;
          }
          .hero-frame::before {
            top: -10px;
            left: -10px;
            border-right: none;
            border-bottom: none;
            border-radius: 5px 0 0 0;
            transform: rotate(45deg); /* Memberi sedikit sentuhan ornamen */
          }
          .hero-frame::after {
            bottom: -10px;
            right: -10px;
            border-left: none;
            border-top: none;
            border-radius: 0 0 5px 0;
            transform: rotate(45deg);
          }
        `}
      </style>
    </div>
  );
};

export default Hero;