
import React, { useEffect, useState } from 'react';

interface FloralDecorationsProps {
  activeSection: string;
}

const SVG_URL = 'https://files.catbox.moe/e2qiff.svg';

export default function FloralDecorations({ activeSection }: FloralDecorationsProps) {
  const [showTopLeft, setShowTopLeft] = useState(false);
  const [showTopRight, setShowTopRight] = useState(false);
  const [showBottomLeft, setShowBottomLeft] = useState(false);
  const [showBottomRight, setShowBottomRight] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    setShowTopLeft(false);
    const timer = setTimeout(() => setShowTopLeft(true), 250);
    return () => clearTimeout(timer);
  }, [activeSection]);

  useEffect(() => {
    setShowTopRight(false);
    const timer = setTimeout(() => setShowTopRight(true), 400);
    return () => clearTimeout(timer);
  }, [activeSection]);

  useEffect(() => {
    setShowBottomLeft(false);
    const timer = setTimeout(() => setShowBottomLeft(true), 550);
    return () => clearTimeout(timer);
  }, [activeSection]);

  useEffect(() => {
    setShowBottomRight(false);
    const timer = setTimeout(() => setShowBottomRight(true), 700);
    return () => clearTimeout(timer);
  }, [activeSection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPetals(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Top Left Corner */}
      <div
        className={`fixed -left-5 -top-5 z-30 pointer-events-none transition-all duration-1000 ease-out ${
          showTopLeft ? '-translate-x-20 opacity-100' : '-translate-x-full -translate-y-full opacity-0'
        }`}
      >
        <img src={SVG_URL} alt="Floral decoration" className="w-60 h-60 md:w-64 md:h-64 opacity-70" />
      </div>

      {/* Top Right Corner */}
      <div
        className={`fixed -right-5 -top-5 z-30 pointer-events-none transition-all duration-1000 ease-out ${
          showTopRight ? 'translate-x-20 opacity-100' : 'translate-x-full -translate-y-full opacity-0'
        }`}
      >
        <img src={SVG_URL} alt="Floral decoration" className="w-60 h-60 md:w-64 md:h-64 transform -scale-x-100 opacity-70" />
      </div>

      {/* Bottom Left Corner */}
      <div
        className={`fixed -left-5 -bottom-5 z-30 pointer-events-none transition-all duration-1000 ease-out ${
          showBottomLeft ? '-translate-x-20 opacity-100' : '-translate-x-full translate-y-full opacity-0'
        }`}
      >
        <img src={SVG_URL} alt="Floral decoration" className="w-60 h-60 md:w-64 md:h-64 transform -scale-y-100 opacity-70" />
      </div>

      {/* Bottom Right Corner */}
      <div
        className={`fixed -right-5 -bottom-5 z-30 pointer-events-none transition-all duration-1000 ease-out ${
          showBottomRight ? 'translate-x-20 opacity-100' : 'translate-x-full translate-y-full opacity-0'
        }`}
      >
        <img src={SVG_URL} alt="Floral decoration" className="w-60 h-60 md:w-64 md:h-64 transform -scale-x-100 -scale-y-100 opacity-70" />
      </div>

      {/* Floating petals effect */}
      {showPetals && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute animate-float-petal"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <ellipse
                  cx="10"
                  cy="10"
                  rx={4 + Math.random() * 2}
                  ry={8 + Math.random() * 2}
                  fill="#FDB9C8"
                  opacity="0.4"
                  transform={`rotate(${Math.random() * 360} 10 10)`}
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
