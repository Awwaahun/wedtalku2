import React from 'react';
import { Heart, Eye } from 'lucide-react';

interface Portfolio {
  id: string;
  groom_name: string;
  bride_name: string;
  couple_photo_url: string;
  groom_photo_url?: string;
  bride_photo_url?: string;
  wedding_date?: string;
  location?: string;
  story?: string;
  template_title: string;
  likes_count: number;
  views_count: number;
  user_name: string;
}

interface PortfolioCardProps {
  portfolio: Portfolio;
  onViewDetails: (portfolio: Portfolio) => void;
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
      {/* Main image - Aspect ratio diubah menjadi lebih tinggi */}
      <div className="relative aspect-[3/4.5] overflow-hidden">
        <img
          src={portfolio.couple_photo_url}
          alt={`Wedding of ${portfolio.groom_name} & ${portfolio.bride_name}`}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Gradient overlay - diubah untuk memberi ruang pada nama di atas */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/90" />

        {/* Nama Mempelai di Bagian Atas */}
        <div className="absolute top-0 left-0 right-0 p-5 sm:p-6 text-white space-y-2">
          <p className="text-xs sm:text-sm text-white/80 text-center font-medium tracking-wide">
            Pernikahan dari
          </p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center leading-tight">
            {portfolio.groom_name}
            <span className="block text-pink-200 text-base sm:text-lg lg:text-xl my-1">&</span>
            {portfolio.bride_name}
          </h3>
        </div>
      </div>

      {/* Foto Individu dan Info - di bagian bawah */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white space-y-3 backdrop-blur-[2px]">
        {portfolio.groom_photo_url && portfolio.bride_photo_url ? (
          <div className="flex items-center justify-center gap-4 relative">
            {/* Foto Mempelai Pria */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={portfolio.groom_photo_url}
                alt={portfolio.groom_name}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-full border-3 border-white/80 shadow-lg"
              />
              <span className="text-xs sm:text-sm font-semibold text-center">
                {portfolio.groom_name.split(' ')[0]}
              </span>
            </div>

            {/* Center heart - diperbesar */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-4 p-2.5 bg-white/30 backdrop-blur-md rounded-full border-2 border-white/50 animate-pulse">
              <Heart className="w-5 h-5 text-white fill-white drop-shadow-md" />
            </div>

            {/* Foto Mempelai Wanita */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={portfolio.bride_photo_url}
                alt={portfolio.bride_name}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-full border-3 border-white/80 shadow-lg"
              />
              <span className="text-xs sm:text-sm font-semibold text-center">
                {portfolio.bride_name.split(' ')[0]}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex justify-center items-center gap-2 text-xs sm:text-sm text-white/80 mt-2 pt-2 border-t border-white/20">
          <span>✨</span>
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