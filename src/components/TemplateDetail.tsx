import { useState } from 'react';
import { 
  ArrowLeft, Eye, Heart, ShoppingCart, Star, Check, Zap, 
  Shield, Palette, Code, Headphones, ExternalLink,
  Download, Sparkles, CheckCircle2, X, Monitor
} from 'lucide-react';
import { WeddingTemplate } from '../lib/supabase';

interface TemplateDetailProps {
  template: WeddingTemplate;
  onClose: () => void;
  onPurchase: (template: WeddingTemplate) => void;
}

export default function TemplateDetail({ template, onClose, onPurchase }: TemplateDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'pricing'>('features');
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryConfig = (category: string) => {
    const configs = {
      modern: { gradient: 'from-cyan-500 to-blue-500', color: 'cyan', bg: 'bg-cyan-100', text: 'text-cyan-700' },
      classic: { gradient: 'from-pink-500 to-rose-500', color: 'pink', bg: 'bg-pink-100', text: 'text-pink-700' },
      minimalist: { gradient: 'from-purple-500 to-indigo-500', color: 'purple', bg: 'bg-purple-100', text: 'text-purple-700' },
      elegant: { gradient: 'from-amber-500 to-orange-500', color: 'amber', bg: 'bg-amber-100', text: 'text-amber-700' },
    };
    return configs[category as keyof typeof configs] || configs.modern;
  };

  const galleryImages = [
    template.thumbnail_url,
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  const specifications = [
    { icon: Monitor, label: 'Responsive Design', value: 'Mobile, Tablet, Desktop' },
    { icon: Zap, label: 'Loading Speed', value: 'Ultra Fast (< 2s)' },
    { icon: Code, label: 'Technology', value: 'React + Tailwind' },
    { icon: Shield, label: 'Browser Support', value: 'All Modern Browsers' },
    { icon: Palette, label: 'Customization', value: 'Fully Customizable' },
    { icon: Headphones, label: 'Support', value: '24/7 Support' },
  ];

  const includedFeatures = [
    { icon: CheckCircle2, text: 'Source Code Lengkap' },
    { icon: CheckCircle2, text: 'Dokumentasi Instalasi' },
    { icon: CheckCircle2, text: 'Tutorial Video' },
    { icon: CheckCircle2, text: 'Free Updates (6 Bulan)' },
    { icon: CheckCircle2, text: 'Lifetime Access' },
    { icon: CheckCircle2, text: 'Consultation Support' },
  ];

  const pricingPackages = [
    {
      name: 'Basic',
      price: template.price,
      features: [
        'Source Code Template',
        'Basic Documentation',
        'Email Support',
        '3 Months Updates',
        'Single Project Use',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      price: template.price * 1.5,
      features: [
        'Source Code Template',
        'Full Documentation',
        'Priority Email Support',
        '6 Months Updates',
        'Multiple Project Use',
        'Customization Guide',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: template.price * 2,
      features: [
        'Source Code Template',
        'Premium Documentation',
        '24/7 Priority Support',
        'Lifetime Updates',
        'Unlimited Projects',
        'Custom Modifications',
        'Direct Consultation',
      ],
      popular: false,
    },
  ];

  const config = getCategoryConfig(template.category);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      {/* Header - Mobile Optimized */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-purple-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-sm sm:text-base">Kembali</span>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-1.5 sm:p-2 rounded-full border-2 transition-all ${
                  isLiked 
                    ? 'border-pink-500 text-pink-500 bg-pink-50' 
                    : 'border-gray-200 text-gray-600 hover:border-purple-500 hover:text-purple-600'
                }`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => onPurchase(template)}
                className="px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Beli</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column - Gallery */}
          <div className="space-y-4 sm:space-y-6">
            {/* Main Image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl group">
              <img
                src={galleryImages[selectedImage]}
                alt={template.title}
                className="w-full h-64 sm:h-80 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Preview Button */}
              <button
                onClick={() => setShowPreview(true)}
                className="absolute inset-0 m-auto w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </button>

              {template.is_featured && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <div className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white text-xs sm:text-sm font-bold flex items-center space-x-1 shadow-lg`}>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    <span>Featured</span>
                  </div>
                </div>
              )}

              {/* Views Counter */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs sm:text-sm font-medium flex items-center space-x-1">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">{template.views_count.toLocaleString()}</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'ring-2 sm:ring-4 ring-purple-500 scale-105'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-16 sm:h-24 object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <a
                href={template.demo_url || 'https://website-undangan01.vercel.app/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-3 sm:px-6 sm:py-4 rounded-xl border-2 border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 transition-all group text-sm sm:text-base"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                <span>Demo</span>
              </a>
              <button className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 py-3 sm:px-6 sm:py-4 rounded-xl bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 font-semibold hover:from-purple-200 hover:to-cyan-200 transition-all text-sm sm:text-base">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6 sm:space-y-8">
            {/* Title & Category */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className={`px-3 py-1 rounded-full ${config.bg} ${config.text} text-xs sm:text-sm font-bold`}>
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-current" />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">(128)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                {template.title}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
                {template.description}
              </p>

              {/* Price */}
              <div className="flex flex-col xs:flex-row xs:items-baseline gap-2 xs:gap-3 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
                <span className="text-xs sm:text-sm text-gray-600">Mulai dari</span>
                <span className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                  {formatPrice(template.price)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  {formatPrice(template.price * 1.5)}
                </span>
                <span className="ml-auto px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-bold">
                  Save 33%
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 sm:space-x-8 min-w-max px-1">
                {(['features', 'specs', 'pricing'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 sm:pb-4 font-semibold transition-all relative whitespace-nowrap text-sm sm:text-base ${
                      activeTab === tab
                        ? 'text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'features' && 'Fitur'}
                    {tab === 'specs' && 'Spesifikasi'}
                    {tab === 'pricing' && 'Paket'}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4 sm:space-y-6">
              {activeTab === 'features' && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    <span>Fitur Utama</span>
                  </h3>
                  <div className="grid gap-2 sm:gap-3">
                    {template.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
                      >
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                          <Check className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-gray-700 font-medium group-hover:text-purple-600 transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50 to-cyan-50 border border-purple-200">
                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Yang Anda Dapatkan</h4>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
                      {includedFeatures.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="flex items-center space-x-2 text-gray-700">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium">{item.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-3 sm:space-y-4 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center space-x-2">
                    <Code className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    <span>Spesifikasi</span>
                  </h3>
                  <div className="grid gap-3 sm:gap-4">
                    {specifications.map((spec, idx) => {
                      const Icon = spec.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all gap-3"
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span className="font-medium text-gray-700 text-sm sm:text-base truncate">{spec.label}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 font-semibold whitespace-nowrap">{spec.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                    <span>Pilih Paket</span>
                  </h3>
                  <div className="grid gap-4 sm:gap-6">
                    {pricingPackages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all hover:shadow-xl ${
                          pkg.popular
                            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-cyan-50'
                            : 'border-gray-200 bg-white hover:border-purple-300'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className={`px-3 sm:px-4 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-white text-xs font-bold shadow-lg whitespace-nowrap`}>
                              ⭐ POPULER
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h4 className="text-lg sm:text-xl font-bold text-gray-800">{pkg.name}</h4>
                          <div className="text-right">
                            <div className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                              {formatPrice(pkg.price)}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                          {pkg.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-start space-x-2">
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => onPurchase(template)}
                          className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all text-sm sm:text-base ${
                            pkg.popular
                              ? `bg-gradient-to-r ${config.gradient} text-white hover:shadow-xl hover:scale-105`
                              : 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50'
                          }`}
                        >
                          Pilih {pkg.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl">
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex items-center space-x-2">
              <a
                href={template.demo_url || 'https://website-undangan01.vercel.app/'}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 backdrop-blur-md text-purple-600 font-semibold hover:bg-white transition-all items-center space-x-2 shadow-lg text-sm"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Buka Tab Baru</span>
              </a>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 rounded-full bg-white/90 backdrop-blur-md text-gray-600 hover:bg-white transition-all shadow-lg"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <iframe
              src={template.demo_url || 'https://website-undangan01.vercel.app/'}
              className="w-full h-full"
              title="Template Preview"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (min-width: 475px) {
          .xs\:inline { display: inline; }
          .xs\:flex-row { flex-direction: row; }
          .xs\:items-baseline { align-items: baseline; }
          .xs\:gap-3 { gap: 0.75rem; }
          .xs\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </div>
  );
}