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
  Film,
  Menu,
  X,
} from 'lucide-react';

function FloatingNavbar({ activeSection, scrollToSection }) {
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

  return (
    <>
      {/* Desktop Floating Navigation */}
      <nav
        className={`hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 ${
          scrolled ? 'scale-95' : 'scale-100'
        }`}
      >
        <div
          className={`bg-white/90 backdrop-blur-md rounded-full shadow-2xl border-2 transition-all duration-300 ${
            scrolled ? 'border-silver shadow-blue-200/50' : 'border-white/50'
          }`}
        >
          <div className="flex items-center space-x-1 px-3 py-3">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative flex flex-col items-center px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-[#1B2A49] to-[#3A4F7A] text-white scale-110 shadow-lg'
                    : 'text-gray-600 hover:bg-[#E5E7EB] hover:text-[#1B2A49] hover:scale-105'
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
                  className={`text-xs font-medium mt-1 transition-opacity duration-300 ${
                    activeSection === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {item.label}
                </span>
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`md:hidden fixed bottom-6 right-6 z-[70] w-11 h-11 rounded-full bg-gradient-to-r from-[#1B2A49] to-[#3A4F7A] text-white shadow-2xl transition-all duration-300 flex items-center justify-center ${
          isMenuOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'
        } hover:scale-110 active:scale-95`}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[65] transition-all duration-500 ${
          isMenuOpen
            ? 'bg-black/50 backdrop-blur-sm pointer-events-auto'
            : 'bg-black/0 backdrop-blur-none pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed bottom-24 right-6 z-[65] transition-all duration-500 ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-silver p-2 overflow-hidden">
          <div className="flex flex-col space-y-1 max-h-[70vh] overflow-y-auto">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group flex items-center space-x-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-[#1B2A49] to-[#3A4F7A] text-white scale-105 shadow-lg'
                    : 'text-gray-700 hover:bg-silver/30 hover:text-[#1B2A49]'
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
                <span className="font-medium text-sm">{item.label}</span>
                {activeSection === item.id && (
                  <span className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Active Section Indicator */}
      {!isMenuOpen && (
        <div className="md:hidden fixed top-5 left-6 z-[60] bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border-2 border-silver transition-all duration-300">
          {navItems.map((item) =>
            activeSection === item.id ? (
              <div key={item.id} className="flex items-center space-x-2">
                <item.icon size={16} className="text-[#1B2A49]" />
                <span className="text-xs font-medium text-gray-700">{item.label}</span>
              </div>
            ) : null
          )}
        </div>
      )}

      <style>{`
        @keyframes float-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #1B2A49, #3A4F7A);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

export default FloatingNavbar;
