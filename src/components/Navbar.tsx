import { Heart, ShoppingCart, User, LogOut, LogIn, Menu, X, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onAuthClick: () => void;
  onCartClick: () => void;
}

export default function Navbar({ onAuthClick, onCartClick }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'templates', label: 'Templates', href: '#templates' },
    { id: 'featured', label: 'Featured', href: '#featured' },
    { id: 'about', label: 'Tentang', href: '#about' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <Heart 
                  className={`w-9 h-9 text-[#f4b9b8] transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                    isScrolled ? 'animate-pulse' : ''
                  }`} 
                  fill="#f4b9b8" 
                />
                <Sparkles className="w-4 h-4 text-[#fff4bd] absolute -top-1 -right-1 animate-bounce" />
              </div>
              <span className="font-logo text-2xl font-bold bg-gradient-to-r from-[#f4b9b8] via-[#887bb0] to-[#85d2d0] bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-105">
                WedTalku
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setActiveLink(link.id)}
                  className={`relative px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                    activeLink === link.id
                      ? 'text-white'
                      : 'text-gray-700 hover:text-[#887bb0]'
                  }`}
                >
                  {activeLink === link.id && (
                    <span className="absolute inset-0 bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] rounded-full animate-[fadeIn_0.3s_ease-in-out]" />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {activeLink === link.id && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-bounce" />
                  )}
                </a>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative p-3 rounded-full bg-gradient-to-r from-[#fff4bd]/20 to-[#85d2d0]/20 hover:from-[#fff4bd]/40 hover:to-[#85d2d0]/40 transition-all duration-300 hover:scale-110 group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-[#887bb0] transition-colors" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                  0
                </span>
              </button>

              {/* User Section */}
              {user ? (
                <div className="flex items-center space-x-2 animate-[slideIn_0.3s_ease-out]">
    <button
      onClick={() => {
        window.location.href = '/user-panel';
      }}
      className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#85d2d0]/20 to-[#887bb0]/20 border border-[#887bb0]/20 hover:border-[#887bb0]/40 transition-all duration-300"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] flex items-center justify-center">
        <User className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-semibold text-gray-700">
        {user.email?.split('@')[0]}
      </span>
    </button>
    <button
      onClick={handleSignOut}
      className="p-2.5 rounded-full bg-red-50 hover:bg-red-100 transition-all duration-300 hover:scale-110 group"
      title="Keluar"
    >
      <LogOut className="w-5 h-5 text-red-600 group-hover:rotate-12 transition-transform" />
    </button>
  </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span className="font-semibold">Masuk</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-2 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
            {navLinks.map((link, index) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeLink === link.id
                    ? 'bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen ? 'slideDown 0.3s ease-out forwards' : 'none'
                }}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 space-y-3 border-t border-gray-200">
              <button
                onClick={() => {
                  onCartClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#fff4bd]/20 to-[#85d2d0]/20 text-gray-700 hover:from-[#fff4bd]/40 hover:to-[#85d2d0]/40 transition-all"
              >
                <span className="font-medium">Keranjang</span>
                <ShoppingCart className="w-5 h-5" />
              </button>

              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#85d2d0]/20 to-[#887bb0]/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Keluar</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] text-white hover:shadow-lg transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-semibold">Masuk</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}