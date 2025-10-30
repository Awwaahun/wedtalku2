
import { useState, useEffect } from 'react';
import { supabase, WeddingTemplate } from '../lib/supabase';
import TemplateCard from './TemplateCard';
import { Loader2, Package, Search, Filter, Grid3x3, LayoutGrid, Sparkles, X } from 'lucide-react';

interface TemplateGridProps {
  onViewDetails: (template: WeddingTemplate) => void;
  filterCategory?: string;
  showFeaturedOnly?: boolean;
  createdInvitationIds?: string[];
  onGoToUserPanel?: () => void;
  favoriteIds?: string[];
  onToggleFavorite?: (templateId: string) => void;
}

type ViewMode = 'grid-3' | 'grid-2';
type SortOption = 'newest' | 'popular' | 'price-low' | 'price-high';

export default function TemplateGrid({ 
  onViewDetails, 
  filterCategory, 
  showFeaturedOnly, 
  createdInvitationIds,
  favoriteIds,
  onToggleFavorite,
}: TemplateGridProps) {
  const [templates, setTemplates] = useState<WeddingTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<WeddingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid-3');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

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
        query = query.eq('is_featured', true).limit(6);
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

    if (searchQuery) {
      result = result.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gray-50" />
          <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-purple-500 animate-spin" />
        </div>
        <p className="text-gray-600 font-medium">Memuat template...</p>
      </div>
    );
  }
  
  const gridClass = viewMode === 'grid-3' 
    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
    : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className="space-y-8">
      {!showFeaturedOnly && (
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-gray-200 shadow-md animate-fadeIn">
          <div className="relative w-full md:flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari template impianmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full pl-9 pr-8 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all appearance-none cursor-pointer font-medium text-gray-700"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Populer</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
              </select>
            </div>

            <div className="relative flex items-center p-1 rounded-xl bg-gray-100 border-2 border-gray-200">
                <span className={`absolute top-1 bottom-1 transition-all duration-300 ease-in-out bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg shadow-md ${
                    viewMode === 'grid-3' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
                }`} />
                <button
                    onClick={() => setViewMode('grid-3')}
                    className={`relative z-10 p-2 transition-colors duration-300 ${viewMode === 'grid-3' ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}
                    aria-label="3-column grid"
                >
                    <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setViewMode('grid-2')}
                    className={`relative z-10 p-2 transition-colors duration-300 ${viewMode === 'grid-2' ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}
                    aria-label="2-column grid"
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20 animate-fadeIn px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 mb-6">
            <Package className="w-10 h-10 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {searchQuery ? 'Template Tidak Ditemukan' : 'Belum Ada Template'}
          </h3>
          <p className="text-lg text-gray-500 mb-6">
            {searchQuery 
              ? `Kami tidak bisa menemukan template untuk "${searchQuery}". Coba kata kunci lain.`
              : 'Template untuk kategori ini akan segera hadir!'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className={`grid ${gridClass} gap-6 lg:gap-8`}>
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              onViewDetails={onViewDetails}
              index={index}
              createdInvitationIds={createdInvitationIds}
              favoriteIds={favoriteIds}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
