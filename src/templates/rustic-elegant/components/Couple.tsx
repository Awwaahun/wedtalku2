import React, { useState, useEffect } from 'react';
import { Heart, Instagram, Mail } from 'lucide-react';
import { useWeddingConfig } from '../hooks/useWeddingConfig';

export default function Couple() {
  const { config } = useWeddingConfig();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="rustic-section bg-[var(--rustic-cream)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-[var(--rustic-primary)] mb-4 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Mempelai
          </h2>
          <div className="rustic-divider rustic-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          <p className={`text-lg text-[var(--rustic-secondary)] mt-6 max-w-2xl mx-auto rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Dengan ridho Allah SWT, kami memohon restu Anda untuk hadir dalam acara pernikahan kami
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Bride Section */}
          <div className={`rustic-slide-in-left ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '0.4s' }}>
            <div className="rustic-card text-center">
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden rustic-image-overlay border-4 border-[var(--rustic-accent)]">
                  <img
                    src={config.couple.bride.image}
                    alt={config.couple.bride.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-[var(--gradient-gold)] text-white rounded-full">
                  <span className="text-sm font-semibold">{config.couple.bride.role}</span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-[var(--rustic-primary)] mb-2">
                {config.couple.bride.fullName}
              </h3>
              <p className="text-[var(--rustic-secondary)] mb-4">Putri dari</p>
              <p className="text-lg text-[var(--rustic-primary)] font-medium mb-4">
                {config.couple.bride.parents}
              </p>
              
              <p className="text-[var(--rustic-brown)] leading-relaxed mb-6">
                {config.couple.bride.bio}
              </p>

              <div className="flex justify-center space-x-4">
                {config.couple.bride.instagram && (
                  <a
                    href={`https://instagram.com/${config.couple.bride.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[var(--rustic-beige)] rounded-full hover:bg-[var(--rustic-accent)] transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-[var(--rustic-primary)]" />
                  </a>
                )}
                {config.couple.bride.email && (
                  <a
                    href={`mailto:${config.couple.bride.email}`}
                    className="p-3 bg-[var(--rustic-beige)] rounded-full hover:bg-[var(--rustic-accent)] transition-colors"
                  >
                    <Mail className="w-5 h-5 text-[var(--rustic-primary)]" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Groom Section */}
          <div className={`rustic-slide-in-right ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '0.6s' }}>
            <div className="rustic-card text-center">
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden rustic-image-overlay border-4 border-[var(--rustic-accent)]">
                  <img
                    src={config.couple.groom.image}
                    alt={config.couple.groom.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-[var(--gradient-gold)] text-white rounded-full">
                  <span className="text-sm font-semibold">{config.couple.groom.role}</span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-[var(--rustic-primary)] mb-2">
                {config.couple.groom.fullName}
              </h3>
              <p className="text-[var(--rustic-secondary)] mb-4">Putra dari</p>
              <p className="text-lg text-[var(--rustic-primary)] font-medium mb-4">
                {config.couple.groom.parents}
              </p>
              
              <p className="text-[var(--rustic-brown)] leading-relaxed mb-6">
                {config.couple.groom.bio}
              </p>

              <div className="flex justify-center space-x-4">
                {config.couple.groom.instagram && (
                  <a
                    href={`https://instagram.com/${config.couple.groom.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[var(--rustic-beige)] rounded-full hover:bg-[var(--rustic-accent)] transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-[var(--rustic-primary)]" />
                  </a>
                )}
                {config.couple.groom.email && (
                  <a
                    href={`mailto:${config.couple.groom.email}`}
                    className="p-3 bg-[var(--rustic-beige)] rounded-full hover:bg-[var(--rustic-accent)] transition-colors"
                  >
                    <Mail className="w-5 h-5 text-[var(--rustic-primary)]" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Love Quote */}
        <div className={`text-center mt-16 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="rustic-card max-w-2xl mx-auto py-8">
            <Heart className="w-8 h-8 text-[var(--rustic-gold)] mx-auto mb-4 animate-pulse" />
            <p className="text-xl text-[var(--rustic-primary)] italic font-medium leading-relaxed">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang."
            </p>
            <p className="text-[var(--rustic-secondary)] mt-4">
              (QS. Ar-Rum: 21)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}