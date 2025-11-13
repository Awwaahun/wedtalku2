import React, { useState, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';

interface CinematicIntroProps {
  onOpen: () => void;
  config?: any;
}

export default function CinematicIntro({ onOpen, config }: CinematicIntroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--rustic-cream)] rustic-pattern relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-[var(--rustic-accent)] rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[var(--rustic-beige)] rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="text-center z-10 px-4">
        <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Heart className="w-16 h-16 text-[var(--rustic-gold)] mx-auto mb-8 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--rustic-primary)] mb-4">
            John &amp; Jane
          </h1>
          <div className="rustic-divider mb-6"></div>
          <p className="text-xl text-[var(--rustic-secondary)] mb-8 max-w-md mx-auto">
            Anda diundang untuk merayakan momen bahagia kami
          </p>
          
          <button
            onClick={onOpen}
            className="rustic-btn text-lg px-8 py-4 group"
          >
            <Play className="w-5 h-5 inline mr-3 group-hover:animate-pulse" />
            Buka Undangan
          </button>
        </div>
      </div>
    </section>
  );
}