import React from 'react';
import { Heart, Eye } from 'lucide-react';
import type { PortfolioWithUser } from '../lib/supabase';

interface PortfolioCardProps {
  portfolio: PortfolioWithUser;
  onViewDetails: (portfolio: PortfolioWithUser) => void;
  onToggleLike: (portfolioId: string) => void;
  isLiked: boolean;
  index?: number;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolio,
  onViewDetails,
  onToggleLike,
  isLiked,
  index = 0
}) => {
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(portfolio.id);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(portfolio);
  };

  return (
    <div
      className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-pink-200/30 cursor-pointer transition-all duration-700 ease-out animate-fadeInUp"
      style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both' }}
      onClick={() => onViewDetails(portfolio)}
    >
      {/* Main image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={portfolio.couple_photo_url}
          alt={`Wedding of ${portfolio.groom_name} & ${portfolio.bride_name}`}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Subtle top gradient glow */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* Couple section */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white space-y-3 backdrop-blur-[2px]">
        {portfolio.groom_photo_url && portfolio.bride_photo_url ? (
          <div className="flex items-center justify-center gap-3 relative">
            <div className="flex flex-col items-center gap-2 w-1/2">
              <img
                src={portfolio.groom_photo_url}
                alt={portfolio.groom_name}
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-white/80 shadow-md"
              />
              <h4 className="font-semibold text-sm sm:text-base text-center truncate">{portfolio.groom_name}</h4>
            </div>

            {/* Center heart */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-3 p-2 bg-white/25 backdrop-blur-md rounded-full border border-white/40 animate-pulse">
              <Heart className="w-4 h-4 text-white fill-white drop-shadow-md" />
            </div>

            <div className="flex flex-col items-center gap-2 w-1/2">
              <img
                src={portfolio.bride_photo_url}
                alt={portfolio.bride_name}
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-white/80 shadow-md"
              />
              <h4 className="font-semibold text-sm sm:text-base text-center truncate">{portfolio.bride_name}</h4>
            </div>
          </div>
        ) : (
          <h3 className="text-lg sm:text-2xl font-bold text-center">
            {portfolio.groom_name} & {portfolio.bride_name}
          </h3>
        )}

        {/* Footer info */}
        <div className="flex justify-center items-center gap-2 text-xs sm:text-sm text-white/80 mt-2">
          <span>✨ Template:</span>
          <span className="font-semibold">{portfolio.template_title}</span>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <button
          onClick={handleLikeClick}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-full backdrop-blur-md border border-white/30 shadow-md hover:scale-110 transition-all duration-300 ${
            isLiked
              ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
          title={isLiked ? 'Batal Suka' : 'Suka'}
        >
          <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-[11px] font-semibold mt-0.5">{portfolio.likes_count || 0}</span>
        </button>

        <button
          onClick={handleViewClick}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white transition-all hover:scale-110 border border-white/30 shadow-md"
          title="Lihat Detail"
        >
          <Eye className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">{portfolio.views_count || 0}</span>
        </button>
      </div>

      {/* Soft color glow */}
      <div className="absolute -bottom-2 -right-2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-700" />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PortfolioCard;
