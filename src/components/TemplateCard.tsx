import { Eye, Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { WeddingTemplate } from '../lib/supabase';

interface TemplateCardProps {
  template: WeddingTemplate;
  onViewDetails: (template: WeddingTemplate) => void;
}

export default function TemplateCard({ template, onViewDetails }: TemplateCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      modern: 'bg-[#85d2d0] text-white',
      classic: 'bg-[#f4b9b8] text-white',
      minimalist: 'bg-[#887bb0] text-white',
      elegant: 'bg-[#fff4bd] text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.modern;
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {template.is_featured && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] text-white text-xs font-semibold">
          Featured
        </div>
      )}

      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={template.thumbnail_url}
          alt={template.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => onViewDetails(template)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white text-gray-800 hover:bg-[#fff4bd] transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Detail</span>
            </button>
            <button className="p-2 rounded-full bg-white text-gray-800 hover:bg-[#f4b9b8] hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(template.category)}`}>
            {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
          </span>
          <div className="flex items-center space-x-1 text-gray-500 text-sm">
            <Eye className="w-4 h-4" />
            <span>{template.views_count}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#887bb0] transition-colors">
          {template.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {template.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {template.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg"
            >
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">
              +{template.features.length - 3} lainnya
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] bg-clip-text text-transparent">
              {formatPrice(template.price)}
            </div>
          </div>
          <button
            onClick={() => onViewDetails(template)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#85d2d0] to-[#887bb0] text-white hover:shadow-lg transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Beli</span>
          </button>
        </div>
      </div>
    </div>
  );
}
