import React, { useEffect, useState } from 'react';
import { SilverHeart, SilverDiamond, SilverRing } from './icons';
import '../index.css';

const LoadingScreen: React.FC = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingTexts = [
      'Preparing your invitation...',
      'Loading beautiful memories...',
      'Setting the mood...',
      'Almost ready...',
      'Welcome to our special day!'
    ];

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingTexts.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingTexts.length;
        return loadingTexts[nextIndex];
      });
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-platinum z-50 flex flex-col items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-md w-full">
        {/* Animated Logo */}
        <div className="mb-8 relative">
          <div className="flex justify-center items-center space-x-4">
            <SilverRing size={48} className="text-primary-silver animate-pulse" />
            <div className="relative">
              <SilverHeart size={64} className="text-primary-silver drop-shadow-lg animate-pulse" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150 animate-pulse" />
            </div>
            <SilverRing size={48} className="text-primary-silver animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Floating Diamonds */}
          <div className="absolute -top-4 -left-4 animate-float">
            <SilverDiamond size={20} className="text-primary-silver/60" />
          </div>
          <div className="absolute -top-2 -right-6 animate-float" style={{ animationDelay: '1s' }}>
            <SilverDiamond size={16} className="text-primary-silver/40" />
          </div>
          <div className="absolute -bottom-4 left-2 animate-float" style={{ animationDelay: '1.5s' }}>
            <SilverDiamond size={18} className="text-primary-silver/50" />
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="font-script text-3xl md:text-4xl text-charcoal mb-2 animate-fade-in">
          {loadingText}
        </h1>
        
        {/* Couple Names */}
        <p className="font-elegant text-lg text-silver mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Alexander & Isabella
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto mb-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-silver-light">
            <div 
              className="h-full bg-gradient-to-r from-primary-silver to-light-silver rounded-full transition-all duration-500 ease-out shimmer-silver"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="font-body text-sm text-silver mt-2">
            {Math.round(loadingProgress)}%
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-primary-silver rounded-full animate-bounce"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 text-silver/60">
          <SilverDiamond size={16} />
          <span className="font-elegant text-sm">Preparing something special</span>
          <SilverDiamond size={16} />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;