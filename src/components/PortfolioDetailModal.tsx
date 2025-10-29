import React from 'react';
import { X, Heart, Calendar, MapPin, Sparkles, User, ThumbsUp } from 'lucide-react';
import { PortfolioWithUser } from '../lib/supabase';

interface PortfolioDetailModalProps {
  portfolio: PortfolioWithUser | null;
  onClose: () => void;
  onToggleLike: (portfolioId: string) => void;
  isLiked: boolean;
}

const PortfolioDetailModal: React.FC<PortfolioDetailModalProps> = ({ portfolio, onClose, onToggleLike, isLiked }) => {
  if (!portfolio) return null;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(portfolio.id);
  };
  
  const formatDate = (date: string | undefined) => {
    if (!date) return 'Tanggal tidak diketahui';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-200 z-10">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
              {portfolio.groom_name.charAt(0)}&{portfolio.bride_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {portfolio.groom_name} & {portfolio.bride_name}
              </h2>
              <p className="text-sm text-gray-500">Oleh: {portfolio.user_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="relative rounded-2xl overflow-hidden h-80 sm:h-96">
            <img
              src={portfolio.couple_photo_url}
              alt="Couple"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
                <h3 className="font-bold text-gray-800 mb-3">Detail Pernikahan</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>{formatDate(portfolio.wedding_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>{portfolio.location || 'Lokasi tidak diketahui'}</span>
                  </div>
                   <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Template: {portfolio.template_title}</span>
                  </div>
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                {portfolio.groom_photo_url && (
                  <div className="text-center">
                    <img src={portfolio.groom_photo_url} alt="Groom" className="w-full aspect-square object-cover rounded-xl shadow-md mb-2"/>
                    <p className="font-semibold text-gray-700">{portfolio.groom_name}</p>
                  </div>
                )}
                 {portfolio.bride_photo_url && (
                  <div className="text-center">
                    <img src={portfolio.bride_photo_url} alt="Bride" className="w-full aspect-square object-cover rounded-xl shadow-md mb-2"/>
                    <p className="font-semibold text-gray-700">{portfolio.bride_name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
               <div className="p-4 rounded-xl bg-white border-2 border-gray-200">
                <h3 className="font-bold text-gray-800 mb-3">Kisah Mereka</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {portfolio.story || 'Tidak ada cerita yang dibagikan.'}
                </p>
              </div>

               <div className="flex items-center justify-center">
                  <button
                    onClick={handleLikeClick}
                    className={`group relative flex items-center space-x-3 px-8 py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden ${
                      isLiked 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                     <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-current' : ''}`} />
                    <span>{isLiked ? 'Disukai' : 'Suka Cerita Ini'}</span>
                     <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${isLiked ? 'bg-white/20' : 'bg-gray-300'}`}>
                      {portfolio.likes_count || 0}
                    </span>
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailModal;
