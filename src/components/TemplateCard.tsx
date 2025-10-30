
import React from 'react';
import { Eye, Heart, Sparkles, Star, Zap, CheckCircle2, BookOpen } from 'lucide-react';
import { WeddingTemplate } from '../lib/supabase';

interface TemplateCardProps {
  template: WeddingTemplate;
  onViewDetails: (template: WeddingTemplate) => void;
  index?: number;
  createdInvitationIds?: string[];
  favoriteIds?: string[];
  onToggleFavorite?: (templateId: string) => void;
}

const RatingDisplay = ({ rating, count }: { rating: number; count: number }) => {
  const fullStars = Math.round(rating);

  if (count === 0) {
    return (
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4 text-gray-300" />
        <span className="text-xs text-gray-500 font-medium">Baru</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={`star-${i}`} className={`w-4 h-4 ${i < fullStars ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
        ))}
      </div>
      <span className="text-xs text-gray-600 font-semibold">{rating.toFixed(1)}</span>
      <span className="text-xs text-gray-400">({count})</span>
    </div>
  );
};

export default function TemplateCard({ 
  template, 
  onViewDetails, 
  index = 0, 
  createdInvitationIds,
  favoriteIds,
  onToggleFavorite,
}: TemplateCardProps) {
  const isCreated = createdInvitationIds?.includes(template.id);
  const isFavorited = favoriteIds?.includes(template.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryConfig = (category: string) => {
    const configs = {
      modern: { gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-100', text: 'text-cyan-700', glow: 'shadow-cyan-500/50' },
      classic: { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-100', text: 'text-pink-700', glow: 'shadow-pink-500/50' },
      minimalist: { gradient: 'from-purple-500 to-indigo-500', bg: 'bg-purple-100', text: 'text-purple-700', glow: 'shadow-purple-500/50' },
      elegant: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-100', text: 'text-amber-700', glow: 'shadow-amber-500/50' },
    };
    return configs[category as keyof typeof configs] || configs.modern;
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(template.id);
  };

  const categoryConfig = getCategoryConfig(template.category);

  return (
    <div 
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-200/50 animate-fadeInUp cursor-pointer"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
      onClick={() => onViewDetails(template)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={template.thumbnail_url}
          alt={template.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {template.is_featured && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold flex items-center space-x-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </div>
        )}
        
        {isCreated ? (
           <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xs font-bold flex items-center space-x-1 shadow-lg">
            <CheckCircle2 className="w-3 h-3" />
            <span>Dimiliki</span>
          </div>
        ) : (
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{template.views_count.toLocaleString()}</span>
            </div>
            {(template.portfolio_count || 0) > 0 && (
              <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium flex items-center space-x-1">
                <BookOpen className="w-3 h-3" />
                <span>{template.portfolio_count} Portofolio</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleToggleFavorite}
          aria-label={isFavorited ? "Hapus dari favorit" : "Tambah ke favorit"}
          className={`absolute bottom-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 transform-gpu hover:scale-110 ${
            isFavorited 
              ? `bg-gradient-to-r ${categoryConfig.gradient} text-white shadow-lg ${categoryConfig.glow}`
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full ${categoryConfig.bg} ${categoryConfig.text} text-xs font-bold`}>
            <Zap className="w-3 h-3" />
            <span>{template.category.charAt(0).toUpperCase() + template.category.slice(1)}</span>
          </span>
          <RatingDisplay rating={template.avg_rating || 0} count={template.rating_count || 0} />
        </div>

        <h3 className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300 line-clamp-2 h-8">
          {template.title}
        </h3>

        <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500">Harga</p>
            <p className="text-2xl font-bold text-gray-800">
              {formatPrice(template.price)}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${categoryConfig.gradient} text-white font-semibold flex items-center space-x-2 transition-all duration-300 group-hover:shadow-lg ${categoryConfig.glow}`}>
            <Eye className="w-4 h-4" />
            <span>Detail</span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
