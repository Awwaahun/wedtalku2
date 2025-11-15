import React, { useState, useEffect } from 'react';
import { SilverHeart, SilverDiamond, SilverRing } from './icons';
import '../index.css';

interface FloatingNavbarProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

const FloatingNavbar: React.FC<FloatingNavbarProps> = ({ activeSection, scrollToSection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling past hero section
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home', icon: <SilverHeart size={16} /> },
    { id: 'couple', label: 'Couple', icon: <SilverRing size={16} /> },
    { id: 'story', label: 'Story', icon: <SilverHeart size={16} /> },
    { id: 'event', label: 'Events', icon: <SilverDiamond size={16} /> },
    { id: 'gallery', label: 'Gallery', icon: <SilverDiamond size={16} /> },
    { id: 'rsvp', label: 'RSVP', icon: <SilverHeart size={16} /> }
  ];

  return (
    <>
      {/* Desktop Floating Navbar */}
      <nav 
        className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-500 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div 
          className={`bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-silver-light px-2 py-2 transition-all duration-300 ${
            isHovered ? 'scale-105 shadow-silver' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center space-x-1">
            {/* Center Logo/Brand */}
            <div className="flex items-center justify-center px-3">
              <div className="w-8 h-8 bg-silver-gradient rounded-full flex items-center justify-center">
                <SilverHeart size={16} className="text-charcoal" />
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-6 w-px bg-silver-light" />
            
            {/* Navigation Items */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 group ${
                  activeSection === item.id
                    ? 'bg-primary-silver/20 text-charcoal'
                    : 'text-silver hover:text-charcoal hover:bg-platinum/30'
                }`}
                title={item.label}
              >
                <span className={`transform transition-transform duration-200 group-hover:scale-110 ${
                  activeSection === item.id ? 'scale-110' : ''
                }`}>
                  {item.icon}
                </span>
                <span className={`font-body text-xs font-medium transition-all duration-300 ${
                  activeSection === item.id || isHovered ? 'opacity-100 max-w-20' : 'opacity-0 max-w-0 overflow-hidden'
                }`}>
                  {item.label}
                </span>
                
                {/* Active Indicator */}
                {activeSection === item.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-silver rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => {
          // Open mobile menu or scroll to top
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
          } else {
            scrollToSection('hero');
          }
        }}
        className={`fixed bottom-6 right-6 z-40 bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-silver-light p-4 transition-all duration-500 lg:hidden ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0 pointer-events-none'
        }`}
      >
        <SilverHeart size={24} className="text-primary-silver" />
      </button>

      {/* Mobile Navigation Menu */}
      <div 
        id="mobile-menu"
        className="fixed inset-0 z-50 lg:hidden hidden"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        {/* Menu Content */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-silver-light">
          <div className="p-6">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-silver-light rounded-full mx-auto mb-6" />
            
            {/* Menu Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                <SilverHeart size={32} className="text-charcoal" />
              </div>
              <h3 className="font-heading text-xl text-charcoal">Navigation</h3>
            </div>
            
            {/* Navigation Items */}
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    document.getElementById('mobile-menu')?.classList.add('hidden');
                  }}
                  className={`w-full p-4 rounded-xl transition-all duration-300 flex items-center space-x-3 ${
                    activeSection === item.id
                      ? 'bg-primary-silver/20 text-charcoal'
                      : 'text-silver hover:bg-platinum/30 hover:text-charcoal'
                  }`}
                >
                  {item.icon}
                  <span className="font-body font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-primary-silver rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')}
              className="w-full mt-6 btn-silver py-3 font-medium"
            >
              Close Menu
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => scrollToSection('hero')}
        className={`fixed bottom-6 left-6 z-40 bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-silver-light p-3 transition-all duration-500 ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-0 pointer-events-none'
        }`}
        title="Scroll to top"
      >
        <svg className="w-5 h-5 text-charcoal" viewBox="0 0 24 24" fill="none">
          <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </>
  );
};

export default FloatingNavbar;