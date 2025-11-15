import React, { useState, useEffect } from 'react';
import { SilverHeart, SilverDiamond, SilverRing } from './icons';
import '../index.css';

interface CinematicIntroProps {
  show: boolean;
  onClose: () => void;
  config: any;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ show, onClose, config }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const groomName = config?.couple?.groom?.name || 'Alexander';
  const brideName = config?.couple?.bride?.name || 'Isabella';

  const scenes = [
    {
      title: 'Once Upon a Time',
      subtitle: 'Two hearts destined to meet',
      duration: 3000
    },
    {
      title: 'A Love Story',
      subtitle: 'From strangers to soulmates',
      duration: 3000
    },
    {
      title: 'The Journey',
      subtitle: 'Every moment leading to this',
      duration: 3000
    },
    {
      title: 'Forever Begins',
      subtitle: `${groomName} & ${brideName}`,
      duration: 4000
    }
  ];

  useEffect(() => {
    if (show && !isPlaying) {
      setIsPlaying(true);
      setCurrentScene(0);
    }
  }, [show, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentScene(prev => {
        if (prev >= scenes.length - 1) {
          setIsPlaying(false);
          setTimeout(onClose, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, scenes[currentScene]?.duration || 3000);

    return () => clearInterval(interval);
  }, [isPlaying, currentScene, scenes, onClose]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        if (show) {
          setIsPlaying(false);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Background Video/Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-silver rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Silver Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-silver/10 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white">
        {/* Floating Decorations */}
        <div className="absolute top-20 left-20 animate-float">
          <SilverRing size={60} className="text-primary-silver/60" />
        </div>
        <div className="absolute top-32 right-32 animate-float" style={{ animationDelay: '1s' }}>
          <SilverDiamond size={40} className="text-primary-silver/50" />
        </div>
        <div className="absolute bottom-20 left-32 animate-float" style={{ animationDelay: '2s' }}>
          <SilverHeart size={50} className="text-primary-silver/60" />
        </div>
        <div className="absolute bottom-32 right-20 animate-float" style={{ animationDelay: '1.5s' }}>
          <SilverRing size={45} className="text-primary-silver/50" />
        </div>

        {/* Scene Content */}
        <div className={`text-center px-8 max-w-4xl mx-auto transition-all duration-1000 ${
          currentScene === scenes.length - 1 ? 'scale-100 opacity-100' : 'scale-95 opacity-90'
        }`}>
          {/* Main Icon for Current Scene */}
          <div className="mb-8 flex justify-center">
            <div className={`relative transform transition-all duration-1000 ${
              isPlaying ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            }`}>
              {currentScene === 0 && <SilverHeart size={80} className="text-primary-silver drop-shadow-2xl" />}
              {currentScene === 1 && <SilverRing size={80} className="text-primary-silver drop-shadow-2xl" />}
              {currentScene === 2 && <SilverDiamond size={80} className="text-primary-silver drop-shadow-2xl" />}
              {currentScene === 3 && (
                <div className="flex space-x-4">
                  <SilverHeart size={60} className="text-primary-silver drop-shadow-2xl" />
                  <SilverHeart size={60} className="text-primary-silver drop-shadow-2xl" />
                </div>
              )}
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-2xl scale-150" />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-script text-5xl md:text-7xl lg:text-8xl mb-4 leading-none animate-fade-in-up">
            {scenes[currentScene]?.title}
          </h1>

          {/* Subtitle */}
          <p className="font-elegant text-xl md:text-2xl lg:text-3xl text-primary-silver mb-8 animate-fade-in-up delay-200">
            {scenes[currentScene]?.subtitle}
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {scenes.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentScene 
                    ? 'w-16 bg-primary-silver' 
                    : 'w-2 bg-primary-silver/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4">
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            
            <span className="font-body text-sm">
              Press ESC to skip
            </span>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => {
            setIsPlaying(false);
            onClose();
          }}
          className="absolute top-8 right-8 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
        >
          <span className="font-body text-sm">Skip</span>
        </button>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default CinematicIntro;