
import React from 'react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface InvitationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  config: WeddingConfig;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ isOpen, onOpen, config }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black transition-opacity duration-500 ease-in-out" style={{ opacity: isOpen ? 1 : 0 }}>
       <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://files.catbox.moe/btzeyc.mp4"
      />
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative z-10 text-center text-white p-8 max-w-lg mx-auto">
        <p className="text-lg md:text-xl font-light tracking-widest uppercase">You're Invited To The Wedding Of</p>
        <h1 className="font-serif text-5xl md:text-7xl my-6">{config.couple.groom.name} & {config.couple.bride.name}</h1>
        <p className="text-lg md:text-xl font-light">Kepada Teman dan Keluarga besar, Kami Mengundang</p>
        <button
          onClick={onOpen}
          className="mt-10 px-8 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:bg-rose-100 transition-all duration-300 transform hover:scale-105"
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
};

export default InvitationModal;
