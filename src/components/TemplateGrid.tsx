import { useState, useEffect } from 'react';
import { supabase, WeddingTemplate } from '../lib/supabase';
import TemplateCard from './TemplateCard';
import { Loader2 } from 'lucide-react';

interface TemplateGridProps {
  onViewDetails: (template: WeddingTemplate) => void;
  filterCategory?: string;
  showFeaturedOnly?: boolean;
}

export default function TemplateGrid({ onViewDetails, filterCategory, showFeaturedOnly }: TemplateGridProps) {
  const [templates, setTemplates] = useState<WeddingTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, [filterCategory, showFeaturedOnly]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#887bb0]" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Tidak ada template tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
