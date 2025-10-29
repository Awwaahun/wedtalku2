import { useState, useEffect, useRef } from 'react';
import { supabase, PortfolioWithUser } from '../lib/supabase';
import PortfolioCard from './PortfolioCard';
import { Loader2, Camera, ChevronLeft, ChevronRight } from 'lucide-react';

interface PortfolioGalleryProps {
  onViewDetails: (portfolio: PortfolioWithUser) => void;
  onToggleLike: (portfolioId: string) => void;
  likedPortfolioIds: string[];
}

export default function PortfolioGallery({ onViewDetails, onToggleLike, likedPortfolioIds }: PortfolioGalleryProps) {
  const [portfolios, setPortfolios] = useState<PortfolioWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolios_with_users')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(9);
      
      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 0;
      const isAtEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      setCanScrollLeft(!isAtStart);
      setCanScrollRight(!isAtEnd);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el && portfolios.length > 0) {
      checkScrollability();
      el.addEventListener('scroll', checkScrollability, { passive: true });
      window.addEventListener('resize', checkScrollability);

      return () => {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [portfolios]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gray-50" />
          <Loader2 className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 text-purple-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-medium text-sm sm:text-base">Memuat inspirasi...</p>
          <p className="text-gray-400 text-xs sm:text-sm">Tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 animate-fadeIn px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 sm:mb-6">
          <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Belum Ada Portofolio</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-500">Portofolio dari pengguna lain akan segera hadir di sini!</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth py-4 -mx-4 px-4 scrollbar-hide"
      >
        {portfolios.map((portfolio, index) => (
          <div key={portfolio.id} className="w-[90%] sm:w-[50%] lg:w-[33.33%] flex-none snap-start px-3">
            <PortfolioCard
              portfolio={portfolio}
              onViewDetails={onViewDetails}
              onToggleLike={onToggleLike}
              isLiked={likedPortfolioIds.includes(portfolio.id)}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
        aria-label="Previous portfolio"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed"
        aria-label="Next portfolio"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}