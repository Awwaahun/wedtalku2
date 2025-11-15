import React from 'react';

// Silver-themed Heart Icon
export const SilverHeart = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C0C0C0" />
        <stop offset="50%" stopColor="#E5E5E5" />
        <stop offset="100%" stopColor="#A8A8A8" />
      </linearGradient>
    </defs>
    <path 
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
      fill="url(#silverGradient)"
      stroke="#808080"
      strokeWidth="0.5"
    />
  </svg>
);

// Silver Diamond Icon
export const SilverDiamond = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E5E5" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#D3D3D3" />
      </linearGradient>
    </defs>
    <path 
      d="M6 3h12l4 6-10 12L2 9z" 
      fill="url(#diamondGradient)"
      stroke="#808080"
      strokeWidth="0.5"
    />
  </svg>
);

// Silver Ring Icon
export const SilverRing = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D3D3D3" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#A8A8A8" />
      </linearGradient>
    </defs>
    <circle 
      cx="12" 
      cy="12" 
      r="8" 
      fill="none" 
      stroke="url(#ringGradient)" 
      strokeWidth="3"
    />
    <path 
      d="M12 2l2 4h-4z" 
      fill="url(#ringGradient)"
    />
  </svg>
);

// Silver Star Icon
export const SilverStar = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F0F0F0" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#E5E5E5" />
      </linearGradient>
    </defs>
    <path 
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
      fill="url(#starGradient)"
      stroke="#808080"
      strokeWidth="0.5"
    />
  </svg>
);

// Silver Flower Icon
export const SilverFlower = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="flowerGradient">
        <stop offset="0%" stopColor="#F0F0F0" />
        <stop offset="100%" stopColor="#C0C0C0" />
      </radialGradient>
    </defs>
    <circle cx="12" cy="8" r="3" fill="url(#flowerGradient)" opacity="0.8"/>
    <circle cx="8" cy="12" r="3" fill="url(#flowerGradient)" opacity="0.8"/>
    <circle cx="16" cy="12" r="3" fill="url(#flowerGradient)" opacity="0.8"/>
    <circle cx="12" cy="16" r="3" fill="url(#flowerGradient)" opacity="0.8"/>
    <circle cx="12" cy="12" r="2" fill="#A8A8A8"/>
  </svg>
);

// Silver Calendar Icon
export const SilverCalendar = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="calendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E5E5" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#D3D3D3" />
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="url(#calendarGradient)" stroke="#808080" strokeWidth="0.5"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="#808080" strokeWidth="2"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="#808080" strokeWidth="2"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="#808080" strokeWidth="0.5"/>
  </svg>
);

// Silver Location Icon
export const SilverLocation = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="locationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C0C0C0" />
        <stop offset="50%" stopColor="#E5E5E5" />
        <stop offset="100%" stopColor="#A8A8A8" />
      </linearGradient>
    </defs>
    <path 
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" 
      fill="url(#locationGradient)"
      stroke="#808080"
      strokeWidth="0.5"
    />
    <circle cx="12" cy="10" r="3" fill="#808080"/>
  </svg>
);

// Silver Gift Icon
export const SilverGift = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="giftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E5E5" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#D3D3D3" />
      </linearGradient>
    </defs>
    <rect x="3" y="11" width="18" height="10" rx="2" fill="url(#giftGradient)" stroke="#808080" strokeWidth="0.5"/>
    <rect x="11" y="3" width="2" height="18" fill="#808080"/>
    <path d="M12 3a4 4 0 0 1 4 4v1H8V7a4 4 0 0 1 4-4z" fill="url(#giftGradient)" stroke="#808080" strokeWidth="0.5"/>
  </svg>
);

// Silver Music Note Icon
export const SilverMusic = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="musicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C0C0C0" />
        <stop offset="50%" stopColor="#E5E5E5" />
        <stop offset="100%" stopColor="#A8A8A8" />
      </linearGradient>
    </defs>
    <path 
      d="M9 18V5l12-2v13" 
      fill="none" 
      stroke="url(#musicGradient)" 
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="6" cy="18" r="3" fill="url(#musicGradient)"/>
    <circle cx="18" cy="16" r="3" fill="url(#musicGradient)"/>
  </svg>
);

// Silver Camera Icon
export const SilverCamera = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E5E5E5" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#D3D3D3" />
      </linearGradient>
    </defs>
    <path 
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" 
      fill="url(#cameraGradient)"
      stroke="#808080"
      strokeWidth="0.5"
    />
    <circle cx="12" cy="13" r="4" fill="#808080"/>
  </svg>
);

// Silver Envelope Icon
export const SilverEnvelope = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="envelopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C0C0C0" />
        <stop offset="50%" stopColor="#E5E5E5" />
        <stop offset="100%" stopColor="#A8A8A8" />
      </linearGradient>
    </defs>
    <path 
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" 
      fill="none" 
      stroke="url(#envelopeGradient)" 
      strokeWidth="2"
    />
    <polyline points="22,6 12,13 2,6" fill="none" stroke="url(#envelopeGradient)" strokeWidth="2"/>
  </svg>
);

// Decorative Silver Ornament
export const SilverOrnament = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ornamentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F0F0F0" />
        <stop offset="50%" stopColor="#C0C0C0" />
        <stop offset="100%" stopColor="#E5E5E5" />
      </linearGradient>
    </defs>
    <path 
      d="M12 2C12 2 8 6 8 10c0 2.21 1.79 4 4 4s4-1.79 4-4c0-4-4-8-4-8zm0 18c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z" 
      fill="url(#ornamentGradient)"
      stroke="#808080"
      strokeWidth="0.5"
    />
  </svg>
);