import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { useWeddingConfig } from '../hooks/useWeddingConfig';

export default function Hero() {
  const { config } = useWeddingConfig();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden rustic-pattern">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--rustic-accent)] rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[var(--rustic-beige)] rounded-full opacity-10 blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[var(--rustic-gold)] rounded-full opacity-5 blur-lg"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-[var(--rustic-gold)] rounded-full opacity-30"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Save the Date Badge */}
        <div className={`mb-8 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[var(--rustic-beige)] border-2 border-[var(--rustic-accent)]">
            <Calendar className="w-5 h-5 text-[var(--rustic-primary)]" />
            <span className="text-[var(--rustic-primary)] font-semibold text-sm uppercase tracking-wider">
              Save the Date
            </span>
          </div>
        </div>

        {/* Main Title */}
        <div className={`mb-6 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--rustic-primary)] mb-4 leading-tight">
            {config.couple.bride.name}
          </h1>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-20 h-0.5 bg-[var(--gradient-primary)]"></div>
            <Heart className="w-8 h-8 text-[var(--rustic-gold)] animate-pulse" />
            <div className="w-20 h-0.5 bg-[var(--gradient-primary)]"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[var(--rustic-primary)] leading-tight">
            {config.couple.groom.name}
          </h1>
        </div>

        {/* Wedding Date */}
        <div className={`mb-8 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <p className="text-2xl md:text-3xl text-[var(--rustic-secondary)] font-medium mb-2">
            {config.wedding.dateDisplay}
          </p>
          <div className="flex items-center justify-center space-x-2 text-[var(--rustic-primary)]">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">
              {config.events[0]?.location || 'Location'}
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <button className="rustic-btn text-lg px-8 py-4">
            Open Invitation
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[var(--rustic-cream)] to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[var(--rustic-cream)] to-transparent pointer-events-none"></div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 text-[var(--rustic-gold)] text-4xl opacity-50">
        ❦
      </div>
      <div className="absolute top-8 right-8 text-[var(--rustic-gold)] text-4xl opacity-50">
        ❦
      </div>
      <div className="absolute bottom-8 left-8 text-[var(--rustic-gold)] text-4xl opacity-50">
        ❦
      </div>
      <div className="absolute bottom-8 right-8 text-[var(--rustic-gold)] text-4xl opacity-50">
        ❦
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}