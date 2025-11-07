// src/components/TemplateViewer.tsx
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Lazy load templates
const ModernMinimalistTemplate = lazy(() => import('../templates/modern-minimalist/App'));
import { supabase, UserInvitationConfig } from '../lib/supabase';

// Template registry - maps template_code to component
const TEMPLATE_REGISTRY: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'modern-minimalist': ModernMinimalistTemplate,
  // Add more templates here as you create them:
  // 'classic-elegance': lazy(() => import('../templates/classic-elegance/App')),
  // 'minimal-chic': lazy(() => import('../templates/minimal-chic/App')),
};

interface TemplateViewerProps {
  slug: string;
}

interface InvitationData {
  id: string;
  user_id: string;
  template_id: string;
  access_url: string;
  wedding_templates: {
    id: string;
    title: string;
    template_code: string;
  };
}

const TemplateViewer: React.FC<TemplateViewerProps> = ({ slug }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [userConfig, setUserConfig] = useState<UserInvitationConfig | null>(null);

  useEffect(() => {
    loadInvitationData();
  }, [slug]);

const loadInvitationData = async () => {
  try {
    setLoading(true);
    setError(null);

    // Find the invitation by access_url (slug)
    const { data, error: fetchError } = await supabase
      .from('purchases')
      .select(`
        id,
        user_id,
        template_id,
        access_url,
        wedding_templates (
          id,
          title,
          template_code
        )
      `)
      .eq('access_url', `/invitations/${slug}`)
      .single();

    if (fetchError) throw fetchError;
    if (!data) throw new Error('Undangan tidak ditemukan');

    setInvitationData(data as any);

    // Load user configuration
    const { data: configData } = await supabase
      .from('user_invitation_configs')
      .select('*')
      .eq('purchase_id', data.id)
      .single();

    if (configData) {
      setUserConfig(configData);
    }

  } catch (err: any) {
    console.error('Error loading invitation:', err);
    setError(err.message || 'Gagal memuat undangan');
  } finally {
    setLoading(false);
  }
};

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-rose-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  if (error || !invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Undangan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error || 'Undangan yang Anda cari tidak tersedia'}</p>
          <button
            onClick={handleBackToHome}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Get template component from registry
  const templateCode = invitationData.wedding_templates.template_code;
  const TemplateComponent = TEMPLATE_REGISTRY[templateCode];

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Template Tidak Tersedia</h2>
          <p className="text-gray-600 mb-6">Template "{templateCode}" belum tersedia di sistem</p>
          <button
            onClick={handleBackToHome}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Render the template
  return (
    <div className="relative">

      {/* Render template with Suspense for lazy loading */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-rose-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Memuat template...</p>
            </div>
          </div>
        }
      >
        <TemplateComponent 
        invitationId={invitationData.id} 
        userConfig={userConfig}
        />
        
      </Suspense>
    </div>
  );
};

export default TemplateViewer;