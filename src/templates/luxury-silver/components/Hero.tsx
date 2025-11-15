import React, { useState, useEffect } from 'react';
import { SilverHeart, SilverDiamond, SilverRing } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface HeroProps {
  onAdminAccess: () => void;
  config: any;
}

const Hero: React.FC<HeroProps> = ({ onAdminAccess, config }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  const heroImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=800&h=600&fit=crop'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={image} 
                alt={`Wedding background ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
            </div>
          ))}
        </div>
        
        {/* Floating Silver Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-silver"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Silver Ornament Top */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <SilverDiamond size={60} className="text-white drop-shadow-lg" />
            <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl" />
          </div>
        </div>

        {/* Couple Names */}
        <div className="mb-6">
          <h1 className="font-script text-6xl md:text-7xl lg:text-8xl text-white mb-4 drop-shadow-2xl leading-none">
            {config?.couple?.groom?.name || 'Alexander'}
          </h1>
          <div className="flex justify-center items-center my-6">
            <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent w-32" />
            <SilverHeart size={32} className="mx-6 text-white drop-shadow-lg" />
            <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent w-32" />
          </div>
          <h1 className="font-script text-6xl md:text-7xl lg:text-8xl text-white mb-4 drop-shadow-2xl leading-none">
            {config?.couple?.bride?.name || 'Isabella'}
          </h1>
        </div>

        {/* Wedding Date */}
        <div className="mb-8">
          <p className="font-elegant text-xl md:text-2xl text-white/90 drop-shadow-lg mb-2">
            {config?.date?.full || 'Saturday, December 15, 2025'}
          </p>
          <div className="flex justify-center items-center space-x-4 text-white/80">
            <span className="font-body">{config?.date?.day || '15'}</span>
            <span className="text-2xl">•</span>
            <span className="font-body">{config?.date?.month || 'December'}</span>
            <span className="text-2xl">•</span>
            <span className="font-body">{config?.date?.year || '2025'}</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="font-body text-lg text-white/85 mb-12 italic drop-shadow-lg max-w-2xl mx-auto">
          "Two souls, one journey, forever bound in love and silver memories"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => scrollToSection('couple')}
            className="btn-silver px-8 py-4 text-lg font-medium shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            Our Story
          </button>
          <button
            onClick={() => scrollToSection('event')}
            className="btn-silver px-8 py-4 text-lg font-medium shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            Event Details
          </button>
        </div>

        {/* Silver Rings Decoration */}
        <div className="flex justify-center space-x-8 mb-8">
          <SilverRing size={40} className="text-white/80 drop-shadow-lg animate-pulse" />
          <SilverRing size={40} className="text-white/80 drop-shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm font-body mb-2">Scroll Down</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
            <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Admin Access Button (Hidden by default) */}
      <button
        onClick={onAdminAccess}
        className="fixed bottom-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full opacity-0 hover:opacity-100 transition-all duration-300 z-20"
        aria-label="Admin Access"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
        </svg>
      </button>

      {/* Decorative Corners */}
      <div className="absolute top-4 left-4 opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 0L0 20L20 0M80 0L60 0L80 20M80 80L80 60L60 80M0 80L20 80L0 60" stroke="url(#silverGradient)" strokeWidth="2"/>
        </svg>
      </div>
      <div className="absolute top-4 right-4 opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M80 0L80 20L60 0M0 0L20 0L0 20M0 80L0 60L20 80M80 80L60 80L80 60" stroke="url(#silverGradient)" strokeWidth="2"/>
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M0 80L0 60L20 80M80 80L60 80L80 60M80 0L80 20L60 0M0 0L20 0L0 20" stroke="url(#silverGradient)" strokeWidth="2"/>
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 opacity-30">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M80 80L80 60L60 80M0 80L20 80L0 60M0 0L0 20L20 0M80 0L60 0L80 20" stroke="url(#silverGradient)" strokeWidth="2"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;