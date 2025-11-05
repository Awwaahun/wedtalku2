
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface CinematicIntroProps {
  show: boolean;
  onClose: () => void;
  config: WeddingConfig;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ show, onClose, config }) => {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      // Short delay to allow the component to render before starting the animation
      const openTimer = setTimeout(() => setDoorsOpen(true), 100);
      return () => {
        clearTimeout(openTimer);
      };
    } else {
      document.body.style.overflow = 'auto';
      setDoorsOpen(false); // Reset for next time
    }
  }, [show]);

  useEffect(() => {
    if (doorsOpen && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay was prevented:", error);
      });
    } else if (!doorsOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [doorsOpen]);
  
  const handleClose = () => {
    setDoorsOpen(false);
    // Delay closing the component to allow the door animation to finish
    setTimeout(onClose, 800);
  }

  if (!show) {
    return null;
  }
  
  const innerDoorPanelStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url('${config.cinematic.doorImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
      {/* Video Player */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          src={config.cinematic.videoSrc}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${doorsOpen ? 'opacity-100' : 'opacity-0'}`}
          loop
          muted
          playsInline
        />
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`absolute top-5 right-5 z-[120] text-white/70 hover:text-white transition-all duration-500 delay-1000 ${doorsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        aria-label="Close video"
      >
        <X size={32} />
      </button>

      {/* Left Door */}
      <div
        className={`fixed top-0 left-0 w-1/2 h-full z-[110] overflow-hidden transition-transform duration-1000 ease-in-out ${doorsOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div style={innerDoorPanelStyle} />
      </div>
      
      {/* Right Door */}
      <div
        className={`fixed top-0 right-0 w-1/2 h-full z-[110] overflow-hidden transition-transform duration-1000 ease-in-out ${doorsOpen ? 'translate-x-full' : 'translate-x-0'}`}
      >
        <div style={{ ...innerDoorPanelStyle, transform: 'translateX(-50vw)' }} />
      </div>
    </div>
  );
};

export default CinematicIntro;
