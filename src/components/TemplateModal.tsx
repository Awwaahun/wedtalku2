import { X, Check, ShoppingCart, ExternalLink } from 'lucide-react';
import { WeddingTemplate } from '../lib/supabase';

interface TemplateModalProps {
  template: WeddingTemplate | null;
  onClose: () => void;
  onPurchase: (template: WeddingTemplate) => void;
}

export default function TemplateModal({ template, onClose, onPurchase }: TemplateModalProps) {
  if (!template) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-[#f4b9b8] hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative h-80 overflow-hidden bg-gray-100">
          <img
            src={template.thumbnail_url}
            alt={template.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {template.is_featured && (
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] text-white font-semibold">
              Featured Template
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {template.title}
              </h2>
              <span className="inline-block px-3 py-1 rounded-full bg-[#85d2d0]/20 text-[#887bb0] text-sm font-semibold">
                {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] bg-clip-text text-transparent">
                {formatPrice(template.price)}
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {template.description}
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Fitur Unggulan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {template.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-[#fff4bd]/20 to-transparent"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#85d2d0] to-[#887bb0] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onPurchase(template)}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-full bg-gradient-to-r from-[#f4b9b8] via-[#887bb0] to-[#85d2d0] text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Beli Template Ini</span>
            </button>
            {template.demo_url && template.demo_url !== '#' && (
              <button className="flex items-center justify-center space-x-2 px-6 py-4 rounded-full border-2 border-[#887bb0] text-[#887bb0] font-semibold hover:bg-[#887bb0] hover:text-white transition-all duration-300">
                <ExternalLink className="w-5 h-5" />
                <span>Lihat Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
