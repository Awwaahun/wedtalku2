import React, { useState } from 'react';
import { Eye, Heart, Sparkles, Star, Zap, CheckCircle2, BookOpen, TrendingUp, Award } from 'lucide-react';
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
        <span className="text-xs text-gray-500 font-medium">Belum ada rating</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1.5">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={`star-${i}`} 
            className={`w-4 h-4 transition-all duration-300 ${
              i < fullStars 
                ? 'text-amber-400 fill-current scale-110' 
                : 'text-gray-300'
            }`} 
          />
        ))}
      </div>
      <span className="text-xs text-gray-700 font-bold">{rating.toFixed(1)}</span>
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
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
      modern: { 
        gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        glow: 'shadow-cyan-500/30',
        icon: Zap
      },
      classic: { 
        gradient: 'from-pink-500 via-rose-500 to-red-500',
        bg: 'bg-pink-50',
        text: 'text-pink-700',
        border: 'border-pink-200',
        glow: 'shadow-pink-500/30',
        icon: Award
      },
      minimalist: { 
        gradient: 'from-purple-500 via-indigo-500 to-blue-500',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        glow: 'shadow-purple-500/30',
        icon: Sparkles
      },
      elegant: { 
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        glow: 'shadow-amber-500/30',
        icon: Award
      },
    };
    return configs[category as keyof typeof configs] || configs.modern;
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(template.id);
  };

  const categoryConfig = getCategoryConfig(template.category);
  const CategoryIcon = categoryConfig.icon;

  // Calculate popularity score
  const popularityScore = template.views_count > 1000 ? 'trending' : 
                         template.views_count > 500 ? 'popular' : null;

  return (
    <div 
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ease-out animate-fadeInUp cursor-pointer border-2 border-transparent hover:border-purple-200"
      style={{ 
        animationDelay: `${index * 80}ms`, 
        animationFillMode: 'both',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)'
      }}
      onClick={() => onViewDetails(template)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <img
          src={template.thumbnail_url}
          alt={template.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${isHovered ? 'scale-110 rotate-1' : 'scale-100 rotate-0'}`}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`} />

        {/* Top Badges Row */}
        <div className="absolute bottom-4 left-4 right-4 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
            {template.is_featured && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-lg animate-pulse">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Featured</span>
              </div>
            )}
            
            {popularityScore === 'trending' && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-lg">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending</span>
              </div>
            )}
          </div>

          {isCreated ? (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xs font-bold shadow-lg backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dimiliki</span>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium shadow-lg">
                <Eye className="w-3.5 h-3.5" />
                <span>{template.views_count.toLocaleString()}</span>
              </div>
              
              {(template.portfolio_count || 0) > 0 && (
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-purple-500/90 backdrop-blur-md text-white text-xs font-medium shadow-lg">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{template.portfolio_count}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            aria-label={isFavorited ? "Hapus dari favorit" : "Tambah ke favorit"}
            className={`group/heart p-3 rounded-full backdrop-blur-md transition-all duration-300 transform-gpu ${
              isFavorited 
                ? `bg-gradient-to-r ${categoryConfig.gradient} text-white shadow-lg ${categoryConfig.glow} scale-110`
                : 'bg-white/95 text-gray-700 hover:bg-white hover:scale-110 shadow-md'
            }`}
          >
            <Heart 
              className={`w-3 h-3 transition-all duration-300 ${
                isFavorited ? 'fill-current scale-110' : 'group-hover/heart:scale-110'
              }`} 
            />
          </button>

          {/* Quick View Button */}
          <div className={`overflow-hidden transition-all duration-500 ${
            isHovered ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0'
          }`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(template);
              }}
              className={`flex items-center space-x-2 px-4 py-3 rounded-full bg-gradient-to-r ${categoryConfig.gradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 whitespace-nowrap`}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Detail</span>
            </button>
          </div>
        </div>

        {/* Hover Info Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="text-center text-white px-6">
            <p className="text-sm font-medium mb-2 opacity-90">Klik untuk melihat detail</p>
            <div className="flex items-center justify-center space-x-4 text-xs opacity-75">
              <span className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>{template.avg_rating?.toFixed(1) || '0.0'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{template.views_count}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between gap-3">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${categoryConfig.bg} ${categoryConfig.text} border ${categoryConfig.border} transition-all duration-300 hover:scale-105`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">
              {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
            </span>
          </div>
          
          <RatingDisplay 
            rating={template.avg_rating || 0} 
            count={template.rating_count || 0} 
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 transition-all duration-300 line-clamp-2 min-h-[1.5rem] hover:text-transparent hover:bg-gradient-to-r hover:bg-clip-text hover:from-pink-500 hover:to-purple-500">
          {template.title}
        </h3>

        {/* Description - Only show on hover */}
        <div className={`overflow-hidden transition-all duration-500 ${
          isHovered ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <p className="text-sm text-gray-600 line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Price & CTA Section */}
        <div className="pt-4 border-t border-gray-100 flex items-end justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Harga</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {formatPrice(template.price)}
              </p>
              {template.price > 0 && (
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(template.price * 1.5)}
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(template);
            }}
            className={`group/btn flex items-center space-x-2 px-5 py-3 rounded-full bg-gradient-to-r ${categoryConfig.gradient} text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${categoryConfig.glow}`}
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span className="text-sm">Lihat</span>
          </button>
        </div>

        {/* Features Preview - Show on hover */}
        {template.features && template.features.length > 0 && (
          <div className={`overflow-hidden transition-all duration-500 ${
            isHovered ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
          }`}>
            <div className="flex flex-wrap gap-1.5">
              {template.features.slice(0, 3).map((feature, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
                >
                  {feature}
                </span>
              ))}
              {template.features.length > 3 && (
                <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-bold">
                  +{template.features.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Decorative Glow Effect */}
      <div className={`absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br ${categoryConfig.gradient} rounded-full blur-3xl transition-opacity duration-700 ${
        isHovered ? 'opacity-20' : 'opacity-0'
      }`} />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}