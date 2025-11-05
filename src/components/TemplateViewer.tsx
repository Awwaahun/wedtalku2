// src/components/TemplateViewer.tsx
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Import template
import ModernMinimalistTemplate from '../templates/modern-minimalist/App';
import LuxurySilverTemplate from '../templates/luxury-silver/App';

interface TemplateViewerProps {
  slug: string;
}

const TemplateViewer: React.FC<TemplateViewerProps> = ({ slug }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Undangan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  // Render the template
  // In future, you can add logic to determine which template to load based on the slug
  return (
    <div className="relative">
      {/* Render template */}
      <ModernMinimalistTemplate />
    </div>
  );
};

export default TemplateViewer;