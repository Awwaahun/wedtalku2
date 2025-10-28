import { Eye, Heart, ShoppingCart, Sparkles, Star, Zap, Check } from 'lucide-react';
import { WeddingTemplate } from '../lib/supabase';
import { useState } from 'react';

interface TemplateCardProps {
  template: WeddingTemplate;
  onViewDetails: (template: WeddingTemplate) => void;
  onPurchase: (template: WeddingTemplate) => void;
  index?: number;
  viewMode?: 'grid-3' | 'grid-2';
  isPurchased?: boolean;
}

export default function TemplateCard({ template, onViewDetails, onPurchase, index = 0, viewMode = 'grid-3', isPurchased = false }: TemplateCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
        gradient: 'from-cyan-500 to-blue-500',
        bgLight: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
        glow: 'shadow-cyan-500/50'
      },
      classic: {
        gradient: 'from-pink-500 to-rose-500',
        bgLight: 'bg-pink-50',
        text: 'text-pink-700',
        border: 'border-pink-200',
        glow: 'shadow-pink-500/50'
      },
      minimalist: {
        gradient: 'from-purple-500 to-indigo-500',
        bgLight: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        glow: 'shadow-purple-500/50'
      },
      elegant: {
        gradient: 'from-amber-500 to-orange-500',
        bgLight: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        glow: 'shadow-amber-500/50'
      },
    };
    return configs[category as keyof typeof configs] || configs.modern;
  };
  
  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🛒 Purchase button clicked for:', template.title);
    console.log('🔍 onPurchase function exists?', !!onPurchase);
    
    if (onPurchase) {
      console.log('✅ Calling onPurchase...');
      onPurchase(template);
    } else {
      console.error('❌ onPurchase is undefined!');
    }
  };

  const categoryConfig = getCategoryConfig(template.category);

  // Adjust card size based on view mode
  const cardHeight = viewMode === 'grid-2' ? 'h-64 sm:h-72 lg:h-80' : 'h-56 sm:h-64 lg:h-72';
  const contentPadding = viewMode === 'grid-2' ? 'p-4 sm:p-6 lg:p-8' : 'p-4 sm:p-5 lg:p-6';
  const titleSize = viewMode === 'grid-2' ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg lg:text-xl';
  const priceSize = viewMode === 'grid-2' ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl lg:text-2xl';
  const buttonSize = viewMode === 'grid-2' ? 'px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4' : 'px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3';

  return (
    <div 
      className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl animate-fadeInUp"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {template.is_featured && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 animate-slideInLeft">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${categoryConfig.gradient} blur-lg opacity-60 animate-pulse`} />
            <div className={`relative px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full bg-gradient-to-r ${categoryConfig.gradient} text-white text-xs font-bold flex items-center space-x-1 shadow-lg`}>
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span className="hidden xs:inline">Featured</span>
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
          </div>
        </div>
      )}
      
      {/* Purchased Badge */}
      {isPurchased && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 animate-slideInRight">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-lg opacity-60 animate-pulse" />
            <div className="relative px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold flex items-center space-x-1 shadow-lg">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden xs:inline">Dibeli</span>
            </div>
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className={`relative ${cardHeight} overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200`}>
        <img
          src={template.thumbnail_url}
          alt={template.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Hover Actions */}
        <div className={`absolute inset-0 flex items-center justify-center space-x-2 sm:space-x-3 transition-all duration-500 px-4 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button
            onClick={() => onViewDetails(template)}
            className="group/btn relative px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded-full bg-white text-gray-800 font-semibold overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-xl text-xs sm:text-sm"
          >
            <span className="relative z-10 flex items-center space-x-1 sm:space-x-2">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Detail</span>
            </span>
            <div className={`absolute inset-0 bg-gradient-to-r ${categoryConfig.gradient} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`} />
          </button>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 sm:p-2.5 lg:p-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${
              isLiked 
                ? `bg-gradient-to-r ${categoryConfig.gradient} text-white shadow-lg ${categoryConfig.glow}`
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
          </button>
        </div>

        {/* Views Count Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-medium flex items-center space-x-1">
          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="hidden xs:inline">{template.views_count.toLocaleString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className={`${contentPadding} space-y-3 sm:space-y-4`}>
        {/* Category & Title */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full ${categoryConfig.bgLight} ${categoryConfig.text} text-xs font-bold border ${categoryConfig.border}`}>
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{template.category.charAt(0).toUpperCase() + template.category.slice(1)}</span>
            </span>
            
            {/* Rating Stars */}
            <div className="flex space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-current" />
              ))}
            </div>
          </div>

          <h3 className={`${titleSize} font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300 line-clamp-2`}>
            {template.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
          {template.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {template.features.slice(0, viewMode === 'grid-2' ? 3 : 2).map((feature, idx) => (
            <span
              key={idx}
              className="group/feature relative px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <span className="relative z-10 line-clamp-1">{feature}</span>
              <div className={`absolute inset-0 bg-gradient-to-r ${categoryConfig.gradient} opacity-0 group-hover/feature:opacity-10 transition-opacity duration-300`} />
            </span>
          ))}
          {template.features.length > (viewMode === 'grid-2' ? 3 : 2) && (
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs ${categoryConfig.bgLight} ${categoryConfig.text} rounded-lg font-semibold border ${categoryConfig.border}`}>
              +{template.features.length - (viewMode === 'grid-2' ? 3 : 2)}
            </span>
          )}
        </div>

        {/* Price & CTA */}
        <div className="pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <div className="text-xs text-gray-500 font-medium">Mulai dari</div>
              <div className={`${priceSize} font-bold bg-gradient-to-r ${categoryConfig.gradient} bg-clip-text text-transparent truncate`}>
                {formatPrice(template.price)}
              </div>
            </div>
            
            <button
              onClick={isPurchased ? () => onViewDetails(template) : handlePurchase}
              className={`group/cta relative ${buttonSize} rounded-full bg-gradient-to-r ${categoryConfig.gradient} text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${categoryConfig.glow} flex-shrink-0 ${isPurchased ? 'opacity-75' : ''}`}
            >
              <span className="relative z-10 flex items-center space-x-1 sm:space-x-2">
                {isPurchased ? (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-xs sm:text-sm">Lihat</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 group-hover/cta:rotate-12 transition-transform duration-300" />
                    <span className="text-xs sm:text-sm">Beli</span>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover/cta:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={`absolute -bottom-2 -right-2 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${categoryConfig.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
      <div className={`absolute -top-2 -left-2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${categoryConfig.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />

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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}