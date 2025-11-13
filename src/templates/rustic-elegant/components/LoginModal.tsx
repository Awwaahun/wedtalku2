import React from 'react';
import { X, User, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
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
          
          <User className="w-12 h-12 text-[var(--rustic-gold)] mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-4">
            Login Admin
          </h3>
          
          <form className="space-y-4 text-left">
            <div>
              <label className="block text-[var(--rustic-primary)] font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                className="rustic-input"
                placeholder="admin@example.com"
              />
            </div>
            
            <div>
              <label className="block text-[var(--rustic-primary)] font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                className="rustic-input"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="rustic-btn w-full"
              onClick={(e) => {
                e.preventDefault();
                onSuccess();
                onClose();
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}