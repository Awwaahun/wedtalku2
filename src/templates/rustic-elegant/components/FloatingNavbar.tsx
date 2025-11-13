import React from 'react';
import { Heart, Calendar, Users, Camera, Gift, MessageCircle } from 'lucide-react';

interface FloatingNavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  config?: any;
  onAdminClick?: () => void;
}

export default function FloatingNavbar({ activeSection, onSectionChange, config, onAdminClick }: FloatingNavbarProps) {
  const navItems = [
    { id: 'hero', label: 'Beranda', icon: Heart },
    { id: 'couple', label: 'Mempelai', icon: Users },
    { id: 'events', label: 'Acara', icon: Calendar },
    { id: 'gallery', label: 'Galeri', icon: Camera },
    { id: 'rsvp', label: 'RSVP', icon: MessageCircle },
    { id: 'gifts', label: 'Hadiah', icon: Gift }
  ];

  return (
    <nav className="fixed top-1/2 right-6 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="rustic-card p-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                activeSection === item.id
                  ? 'bg-[var(--gradient-primary)] text-white'
                  : 'bg-[var(--rustic-cream)] text-[var(--rustic-primary)] hover:bg-[var(--rustic-beige)]'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}