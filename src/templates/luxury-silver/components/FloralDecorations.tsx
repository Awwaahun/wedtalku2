import React from 'react';
import { SilverFlower, SilverHeart, SilverDiamond } from './icons';
import '../index.css';

interface FloralDecorationsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'corners' | 'floating';
  density?: 'light' | 'medium' | 'heavy';
  animated?: boolean;
}

const FloralDecorations: React.FC<FloralDecorationsProps> = ({ 
  position = 'corners', 
  density = 'medium', 
  animated = true 
}) => {
  const getDensityCount = () => {
    switch (density) {
      case 'light': return 3;
      case 'medium': return 5;
      case 'heavy': return 8;
      default: return 5;
    }
  };

  const renderDecoration = (index: number, total: number) => {
    const elements = [
      <SilverFlower key={`flower-${index}`} size={20 + Math.random() * 15} />,
      <SilverHeart key={`heart-${index}`} size={18 + Math.random() * 12} />,
      <SilverDiamond key={`diamond-${index}`} size={16 + Math.random() * 10} />
    ];
    
    return elements[index % elements.length];
  };

  const getCornerDecorations = (corner: string) => {
    const count = getDensityCount();
    
    return (
      <div className={`absolute ${corner} pointer-events-none`}>
        <div className="relative">
          {/* Main decoration */}
          <div className="transform -translate-x-1/2 -translate-y-1/2">
            <div className={`relative ${animated ? 'animate-float' : ''}`} style={{ animationDelay: `${Math.random() * 2}s` }}>
              <SilverFlower size={40} className="text-primary-silver/60" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          
          {/* Surrounding decorations */}
          {[...Array(count)].map((_, index) => (
            <div
              key={index}
              className={`absolute ${animated ? 'animate-pulse' : ''}`}
              style={{
                top: `${-20 + (index * 15)}px`,
                left: `${-15 + (index * 8)}px`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              {renderDecoration(index, count)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getFloatingDecorations = () => {
    const count = getDensityCount() * 2;
    
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className={`absolute ${animated ? 'animate-float-slow' : ''}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          >
            <div className="transform rotate-45">
              {renderDecoration(index, count)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPositionalDecorations = () => {
    const count = getDensityCount();
    
    switch (position) {
      case 'top-left':
        return (
          <div className="absolute top-8 left-8 pointer-events-none">
            {[...Array(count)].map((_, index) => (
              <div
                key={index}
                className={`absolute ${animated ? 'animate-pulse' : ''}`}
                style={{
                  top: `${index * 20}px`,
                  left: `${index * 15}px`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {renderDecoration(index, count)}
              </div>
            ))}
          </div>
        );
        
      case 'top-right':
        return (
          <div className="absolute top-8 right-8 pointer-events-none">
            {[...Array(count)].map((_, index) => (
              <div
                key={index}
                className={`absolute ${animated ? 'animate-pulse' : ''}`}
                style={{
                  top: `${index * 20}px`,
                  right: `${index * 15}px`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {renderDecoration(index, count)}
              </div>
            ))}
          </div>
        );
        
      case 'bottom-left':
        return (
          <div className="absolute bottom-8 left-8 pointer-events-none">
            {[...Array(count)].map((_, index) => (
              <div
                key={index}
                className={`absolute ${animated ? 'animate-pulse' : ''}`}
                style={{
                  bottom: `${index * 20}px`,
                  left: `${index * 15}px`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {renderDecoration(index, count)}
              </div>
            ))}
          </div>
        );
        
      case 'bottom-right':
        return (
          <div className="absolute bottom-8 right-8 pointer-events-none">
            {[...Array(count)].map((_, index) => (
              <div
                key={index}
                className={`absolute ${animated ? 'animate-pulse' : ''}`}
                style={{
                  bottom: `${index * 20}px`,
                  right: `${index * 15}px`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {renderDecoration(index, count)}
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render based on position
  switch (position) {
    case 'corners':
      return (
        <>
          {getCornerDecorations('top-4 left-4')}
          {getCornerDecorations('top-4 right-4')}
          {getCornerDecorations('bottom-4 left-4')}
          {getCornerDecorations('bottom-4 right-4')}
        </>
      );
      
    case 'floating':
      return getFloatingDecorations();
      
    default:
      return renderPositionalDecorations();
  }
};

export default FloralDecorations;