import React from 'react';
import { X, Heart } from 'lucide-react';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: any;
}

export default function InvitationModal({ isOpen, onClose, config }: InvitationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="rustic-card max-w-md w-full">
        <div className="text-center py-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[var(--rustic-secondary)] hover:text-[var(--rustic-primary)]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <Heart className="w-12 h-12 text-[var(--rustic-gold)] mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-4">
            Undangan Pernikahan
          </h3>
          <p className="text-[var(--rustic-secondary)] mb-6 leading-relaxed">
            Kami mengundang Anda untuk hadir dalam acara pernikahan kami
          </p>
          
          <button
            onClick={onClose}
            className="rustic-btn w-full"
          >
            Buka Undangan
          </button>
        </div>
      </div>
    </div>
  );
}