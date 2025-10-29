import React from 'react';
import { Heart, MessageCircle, Eye, Share2 } from 'lucide-react';
import type { PortfolioWithUser } from '../lib/supabase';

interface PortfolioCardProps {
  portfolio: PortfolioWithUser;
  onViewDetails: (portfolio: PortfolioWithUser) => void;
  onToggleLike: (portfolioId: string) => void;
  isLiked: boolean;
  index?: number;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, onViewDetails, onToggleLike, isLiked, index = 0 }) => {
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(portfolio.id);
  };
  
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(portfolio);
  }

  return (
    <div 
      className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
      onClick={() => onViewDetails(portfolio)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={portfolio.couple_photo_url}
          alt={`Wedding of ${portfolio.groom_name} & ${portfolio.bride_name}`}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white space-y-4">
        {portfolio.groom_photo_url && portfolio.bride_photo_url ? (
          <div className="flex items-center justify-center gap-2 relative">
            <div className="flex flex-col items-center gap-2 w-1/2">
              <img 
                src={portfolio.groom_photo_url} 
                alt={portfolio.groom_name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 border-white/80 shadow-lg"
              />
              <h4 className="font-bold text-sm sm:text-base text-center truncate w-full">{portfolio.groom_name}</h4>
            </div>

            <div className="absolute left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Heart className="w-4 h-4 text-white fill-white"/>
            </div>

            <div className="flex flex-col items-center gap-2 w-1/2">
               <img 
                src={portfolio.bride_photo_url} 
                alt={portfolio.bride_name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 border-white/80 shadow-lg"
              />
              <h4 className="font-bold text-sm sm:text-base text-center truncate w-full">{portfolio.bride_name}</h4>
            </div>
          </div>
        ) : (
          <h3 className="text-xl sm:text-2xl font-bold leading-tight line-clamp-2 text-center">
            {portfolio.groom_name} & {portfolio.bride_name}
          </h3>
        )}
        <p className="text-xs sm:text-sm text-center text-white/80 line-clamp-1">
          Menggunakan template: <span className="font-semibold">{portfolio.template_title}</span>
        </p>
      </div>

      <div className="absolute top-4 right-4 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleLikeClick}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${
            isLiked
              ? 'bg-pink-500/80 text-white shadow-lg'
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
          title={isLiked ? 'Batal Suka' : 'Suka'}
        >
          <Heart className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-xs font-bold mt-0.5">{portfolio.likes_count || 0}</span>
        </button>
        <button
          onClick={handleViewClick}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white transition-all hover:scale-110"
          title="Lihat Detail"
        >
          <Eye className="w-5 h-5" />
          <span className="text-xs font-bold mt-0.5">{portfolio.views_count || 0}</span>
        </button>
      </div>
      
      <div className="absolute -bottom-2 -right-2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

       <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PortfolioCard;