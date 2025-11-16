import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  Users,
  Gift,
  Wallet,
  MessageCircle,
  UserCircle,
  Send,
  Menu,
  X,
} from 'lucide-react';

// Pastikan props ini disediakan saat komponen dipanggil
interface FloatingNavbarProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

export default function FloatingNavbar({ activeSection, scrollToSection }: FloatingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { icon: Heart, label: 'Home', id: 'hero' },
    { icon: UserCircle, label: 'Couple', id: 'couple' },
    { icon: Users, label: 'Story', id: 'story' },
    { icon: Calendar, label: 'Event', id: 'event' },
    { icon: Gift, label: 'Gallery', id: 'gallery' },
    { icon: Wallet, label: 'Gift', id: 'donation' },
    { icon: MessageCircle, label: 'RSVP', id: 'rsvp' },
    { icon: Send, label: 'Prayer', id: 'prayer' },
  ];

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsMenuOpen(false);
  };

  // Konstanta Warna Emas
  const SILVER_GRADIENT = 'bg-gradient-to-r from-slate-600 to-slate-800';
  const SILVER_HOVER_TEXT = 'text-slate-700';
  const SILVER_ICON = 'text-slate-600';

  return (
    <>
      {/* Desktop Floating Navigation */}
      <nav
        className={`hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ${
          scrolled ? 'scale-95' : 'scale-100'
        }`}
      >
        <div
          className={`bg-white/95 backdrop-blur-md rounded-full shadow-2xl transition-all duration-300 border-2 border-slate-300/50 shadow-slate-400/10`}
        >
          <div className="flex items-center space-x-1 px-3 py-3">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative flex flex-col items-center px-3 py-2 rounded-full transition-all duration-300 ${
                  activeSection === item.id
                    // Active State: Emas Gradien
                    ? `${SILVER_GRADIENT} text-white scale-110 shadow-lg shadow-slate-600/30`
                    // Inactive State: Krem / Amber
                    : `text-gray-600 hover:bg-[#FDF6E3] ${SILVER_HOVER_TEXT} hover:scale-105`
                }`}
                style={{ transitionDelay: `${index * 30}ms` }}
              >
                <item.icon
                  size={20}
                  className={`transition-transform duration-300 ${
                    activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
                <span
                  className={`font-medium mt-1 transition-opacity duration-300 text-xs ${
                    activeSection === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {item.label}
                </span>
                {activeSection === item.id && (
                  // Dot Indikator Emas
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Floating Button (Menu Toggle) */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`md:hidden fixed bottom-6 right-6 z-[70] w-12 h-12 rounded-full ${SILVER_GRADIENT} text-white shadow-2xl shadow-amber-900/40 transition-all duration-300 flex items-center justify-center ${
          isMenuOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'
        } hover:scale-110 active:scale-95`}
      >
        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[65] transition-all duration-500 ${
          isMenuOpen
            ? 'bg-black/40 backdrop-blur-sm pointer-events-auto'
            : 'bg-black/0 backdrop-blur-none pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu (Slide-out) */}
      <div
        className={`md:hidden fixed bottom-24 right-6 z-[65] transition-all duration-500 ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-400/20 border-2 border-slate-300/40 p-2 overflow-hidden">
          <div className="flex flex-col space-y-1 max-h-[70vh] overflow-y-auto">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeSection === item.id
                    // Active State: Emas Gradien
                    ? `${SILVER_GRADIENT} text-white scale-[1.03] shadow-lg shadow-slate-600/30`
                    // Inactive State: Krem / Amber
                    : `text-gray-700 hover:bg-[#FDF6E3] ${SILVER_HOVER_TEXT}`
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(100px)',
                }}
              >
                <item.icon
                  size={22}
                  className={`transition-transform duration-300 ${
                    activeSection === item.id ? '' : 'group-hover:scale-110'
                  }`}
                />
                <span className="font-playfair font-medium text-base">{item.label}</span>
                {activeSection === item.id && (
                  // Dot Indikator Emas
                  <span className="ml-auto w-2 h-2 bg-slate-400 rounded-full animate-pulse shadow-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Active Section Indicator (Top Left) */}
      {!isMenuOpen && (
        <div className="md:hidden fixed top-5 left-6 z-[60] bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border-2 border-slate-300/40 transition-all duration-300">
          {navItems.map((item) =>
            activeSection === item.id ? (
              <div key={item.id} className="flex items-center space-x-2">
                <item.icon size={16} className={SILVER_ICON} />
                <span className={`text-xs font-playfair font-medium ${SILVER_HOVER_TEXT}`}>{item.label}</span>
              </div>
            ) : null
          )}
        </div>
      )}

      <style>{`
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-script { font-family: 'Great Vibes', cursive; }

        /* Scrollbar untuk Mobile Menu */
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #B7873D, #D4AF37); /* Gold Scrollbar */
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}