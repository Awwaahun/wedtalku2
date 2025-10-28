import { useState, useEffect } from 'react';
import { supabase, WeddingTemplate } from '../lib/supabase';
import TemplateCard from './TemplateCard';
import { Loader2, Package, Search, Filter, Grid3x3, LayoutGrid, Sparkles } from 'lucide-react';

interface TemplateGridProps {
  onViewDetails: (template: WeddingTemplate) => void;
  onCreateInvitation?: (template: WeddingTemplate) => void;
  filterCategory?: string;
  showFeaturedOnly?: boolean;
  featuredLayout?: boolean;
  createdInvitationIds?: string[];
  onGoToUserPanel?: () => void;
  favoriteIds?: string[];
  onToggleFavorite?: (templateId: string) => void;
}

type ViewMode = 'grid-3' | 'grid-2';
type SortOption = 'newest' | 'popular' | 'price-low' | 'price-high';

export default function TemplateGrid({ 
  onViewDetails, 
  onCreateInvitation,
  filterCategory, 
  showFeaturedOnly, 
  featuredLayout,
  createdInvitationIds,
  onGoToUserPanel,
  favoriteIds,
  onToggleFavorite,
}: TemplateGridProps) {
  const [templates, setTemplates] = useState<WeddingTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<WeddingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, [filterCategory, showFeaturedOnly]);

  useEffect(() => {
    filterAndSortTemplates();
  }, [templates, searchQuery, sortBy]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('wedding_templates')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filterCategory && filterCategory !== 'all') {
        query = query.eq('category', filterCategory);
      }

      if (showFeaturedOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTemplates = () => {
    let result = [...templates];

    // Search filter
    if (searchQuery) {
      result = result.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.views_count - a.views_count);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredTemplates(result);
  };

  const handleSearch = (value: string) => {
    setIsSearching(true);
    setSearchQuery(value);
    setTimeout(() => setIsSearching(false), 300);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-white" />
          <Loader2 className="absolute inset-0 m-auto w-6 h-6 sm:w-8 sm:h-8 text-purple-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-medium text-sm sm:text-base">Memuat template...</p>
          <p className="text-gray-400 text-xs sm:text-sm">Tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 animate-fadeIn px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 sm:mb-6">
          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Tidak Ada Template</h3>
        <p className="text-sm sm:text-base lg:text-lg text-gray-500">Template untuk kategori ini akan segera hadir</p>
      </div>
    );
  }

  const gridClass = featuredLayout 
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    : viewMode === 'grid-3' 
      ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' 
      : 'grid-cols-2 lg:grid-cols-2';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toolbar - Mobile Optimized - Hide for Featured Layout */}
      {!featuredLayout && (
        <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white via-purple-50/30 to-cyan-50/30 border border-purple-100/50 shadow-lg backdrop-blur-sm animate-fadeIn">
          
          <div className="relative w-full group">
            <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
              isSearching ? 'text-purple-500 scale-110' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Cari template..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3">
            
            <div className="relative flex-1 group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm appearance-none cursor-pointer font-medium text-gray-700 hover:border-purple-300 text-sm sm:text-base"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Terpopuler</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-center xs:justify-start gap-1 sm:gap-2 p-1 rounded-lg sm:rounded-xl bg-white/80 backdrop-blur-sm border-2 border-gray-200">
              <button
                onClick={() => setViewMode('grid-3')}
                className={`p-2 sm:p-2 rounded-md sm:rounded-lg transition-all duration-300 ${
                  viewMode === 'grid-3'
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title="Grid 3 kolom"
              >
                <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid-2')}
                className={`p-2 sm:p-2 rounded-md sm:rounded-lg transition-all duration-300 ${
                  viewMode === 'grid-2'
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title="Grid 2 kolom"
              >
                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!featuredLayout && (
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-0 px-2 animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
            <span className="text-gray-600 font-medium text-sm sm:text-base">
              {filteredTemplates.length} dari {templates.length} template
            </span>
          </div>
          
          {searchQuery && (
            <div className="px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium">
              "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 sm:py-20 animate-fadeIn px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 mb-4 sm:mb-6">
            <Search className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Tidak Ditemukan</h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-500 mb-4 sm:mb-6">
            Maaf, kami tidak menemukan template yang sesuai
          </p>
          <button
            onClick={() => handleSearch('')}
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className={`grid ${gridClass} gap-4 sm:gap-6 lg:gap-8 transition-all duration-500`}>
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              onViewDetails={onViewDetails}
              onCreateInvitation={onCreateInvitation}
              index={index}
              viewMode={viewMode}
              createdInvitationIds={createdInvitationIds}
              onGoToUserPanel={onGoToUserPanel}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {filteredTemplates.length > 0 && filteredTemplates.length === templates.length && (
        <div className="text-center py-6 sm:py-8 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
            <span className="text-purple-700 font-medium text-xs sm:text-sm">Semua template telah ditampilkan</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #06b6d4);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #0891b2);
        }

        @media (min-width: 475px) {
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:items-center {
            align-items: center;
          }
          .xs\\:justify-start {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
