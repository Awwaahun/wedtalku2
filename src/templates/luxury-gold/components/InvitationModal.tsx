import React from 'react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

interface InvitationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  config: WeddingConfig;
  guestName?: string | null;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ isOpen, onOpen, config, guestName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black animate-fade-in">
      <video
        key={config.invitation.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
        src={config.invitation.backgroundVideo}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-black/50 to-[#1a1a2e]"></div>
      
      <div className="relative z-10 text-center text-white p-8 max-w-2xl mx-auto">
        {guestName && (
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg text-gray-300 tracking-wider">Dear,</p>
            <p className="text-3xl md:text-4xl font-semibold mt-1 break-words">{guestName}</p>
          </div>
        )}
        <p className="text-xl md:text-2xl tracking-[0.2em] uppercase text-gray-300 animate-fade-in-down">
          You are invited to the wedding of
        </p>
        <h1 className="text-6xl md:text-8xl my-6 animate-fade-in" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          {config.couple.groom.name} & {config.couple.bride.name}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 animate-fade-in-up">
          {config.invitation.subtitle}
        </p>
        <button
          onClick={onOpen}
          className="mt-12 bg-yellow-500 text-gray-900 font-bold py-4 px-12 rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/20 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          {config.invitation.buttonText}
        </button>
      </div>
    </div>
  );
};

export default InvitationModal;
