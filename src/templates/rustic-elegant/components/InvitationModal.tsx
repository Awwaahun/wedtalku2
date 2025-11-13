import React from 'react';
import { Send } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface InvitationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  config: WeddingConfig;
  guestName?: string | null;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ isOpen, onOpen, config, guestName }) => {
  if (!isOpen) return null;

  // Create a dynamic, multi-line message for WhatsApp sharing.
  const message = guestName
    ? `Yth. ${guestName},\n\nAnda diundang ke pernikahan ${config.couple.groom.name} & ${config.couple.bride.name}.\n\nBuka undangan Anda di sini:\n${window.location.href}`
    : `Anda diundang ke pernikahan ${config.couple.groom.name} & ${config.couple.bride.name}.\n\nBuka undangan Anda di sini:\n${window.location.href}`;
  
  const whatsappMessage = encodeURIComponent(message);

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black transition-opacity duration-500 ease-in-out" style={{ opacity: isOpen ? 1 : 0 }}>
       <video
        key={config.invitation.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={config.invitation.backgroundVideo}
      />
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="relative z-10 text-center text-white p-8 max-w-lg mx-auto">
        {guestName && (
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-lg font-light tracking-wider">Teruntuk Yth,</p>
            <p className="text-2xl md:text-3xl font-serif font-semibold mt-1 break-words">{guestName}</p>
          </div>
        )}
        <p className="text-lg md:text-xl font-light tracking-widest uppercase">{config.invitation.title}</p>
        <h1 className="font-serif text-5xl md:text-7xl my-6">{config.couple.groom.name} & {config.couple.bride.name}</h1>
        <p className="text-lg md:text-xl font-light">{config.invitation.subtitle}</p>

        <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={onOpen}
              className="w-full max-w-xs px-8 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:bg-rose-100 transition-all duration-300 transform hover:scale-105"
            >
              {config.invitation.buttonText}
            </button>
            
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs px-8 py-3 bg-[#25D366] text-white font-semibold rounded-full shadow-lg hover:bg-[#128C7E] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 animate-fade-in"
            >
              <Send size={18} />
              Bagikan di WhatsApp
            </a>
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;