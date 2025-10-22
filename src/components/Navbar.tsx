import { Heart, ShoppingCart, User, LogOut, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onAuthClick: () => void;
  onCartClick: () => void;
}

export default function Navbar({ onAuthClick, onCartClick }: NavbarProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-[#f4b9b8]" fill="#f4b9b8" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#f4b9b8] via-[#887bb0] to-[#85d2d0] bg-clip-text text-transparent">
              Wedding Market
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-[#887bb0] transition-colors font-medium">
              Home
            </a>
            <a href="#templates" className="text-gray-700 hover:text-[#887bb0] transition-colors font-medium">
              Templates
            </a>
            <a href="#featured" className="text-gray-700 hover:text-[#887bb0] transition-colors font-medium">
              Featured
            </a>
            <a href="#about" className="text-gray-700 hover:text-[#887bb0] transition-colors font-medium">
              Tentang
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="p-2 rounded-full hover:bg-[#fff4bd]/30 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-[#85d2d0]/20">
                  <User className="w-4 h-4 text-[#887bb0]" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] text-white hover:shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">Masuk</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
