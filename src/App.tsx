import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import TemplateGrid from './components/TemplateGrid';
import TemplateDetail from './components/TemplateDetail';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import CreateInvitationModal from './components/PurchaseModal';
import { WeddingTemplate, PortfolioWithUser } from './lib/supabase';
import { supabase } from './lib/supabase';
import { Camera, Sparkles, User as UserIcon } from 'lucide-react';
import PortfolioGallery from './components/PortfolioGallery';
import PortfolioDetailModal from './components/PortfolioDetailModal';

// Import Template Viewer
import TemplateViewer from './components/TemplateViewer';

type ViewMode = 'home' | 'detail' | 'admin' | 'user-panel' | 'template-view';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<WeddingTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [createdInvitationIds, setCreatedInvitationIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioWithUser | null>(null);
  const [likedPortfolioIds, setLikedPortfolioIds] = useState<string[]>([]);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Template viewing state
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
    checkUserSession();
    checkRouting();
  }, []);

  const checkUserSession = async () => {
    const { data: { session } } = await (supabase.auth as any).getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      loadUserData(currentUser.id);
    }

    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        loadUserData(newUser.id);
      } else {
        setCreatedInvitationIds([]);
        setFavoriteIds([]);
        setLikedPortfolioIds([]);
      }
    });

    return () => subscription.unsubscribe();
  };
  
  const loadUserData = (userId: string) => {
    loadUserInvitations(userId);
    loadUserFavorites(userId);
    loadUserPortfolioLikes(userId);
  };

  const loadUserInvitations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('template_id')
        .eq('user_id', userId);

      if (error) throw error;
      
      const invitationIds = data?.map(p => p.template_id) || [];
      setCreatedInvitationIds(invitationIds);
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  };

  const loadUserFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('template_id')
        .eq('user_id', userId);
      
      if (error) throw error;

      const favIds = data?.map(f => f.template_id) || [];
      setFavoriteIds(favIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadUserPortfolioLikes = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_likes')
        .select('portfolio_id')
        .eq('user_id', userId);
      if (error) throw error;
      setLikedPortfolioIds(data.map(l => l.portfolio_id));
    } catch (error) {
      console.error('Error loading portfolio likes:', error);
    }
  };
  
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleFavorite = async (templateId: string) => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) {
      setShowAuthModal(true);
      showNotification('error', 'Silakan login untuk menambahkan favorit.');
      return;
    }

    const isFavorited = favoriteIds.includes(templateId);
    
    if (isFavorited) {
      setFavoriteIds(prev => prev.filter(id => id !== templateId));
    } else {
      setFavoriteIds(prev => [...prev, templateId]);
    }

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, template_id: templateId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, template_id: templateId });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (isFavorited) {
        setFavoriteIds(prev => [...prev, templateId]);
      } else {
        setFavoriteIds(prev => prev.filter(id => id !== templateId));
      }
      showNotification('error', 'Gagal memperbarui favorit.');
    }
  };

  const handleRateTemplate = async (templateId: string, rating: number): Promise<boolean> => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) {
      setShowAuthModal(true);
      showNotification('error', 'Silakan login untuk memberikan rating.');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('template_ratings')
        .upsert(
          { 
            template_id: templateId, 
            user_id: user.id, 
            rating: rating 
          },
          { 
            onConflict: 'template_id,user_id',
            ignoreDuplicates: false 
          }
        )
        .select();

      if (error) throw error;
      return true;
      
    } catch (error: any) {
      console.error('Error in handleRateTemplate:', error);
      showNotification('error', 'Gagal menyimpan rating: ' + (error.message || 'Unknown error'));
      return false;
    }
  };

  const checkAdminStatus = async () => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(profile?.role === 'admin');
    }
  };

  const checkRouting = async () => {
    const path = window.location.pathname;
    
    if (path === '/admin') {
      await checkAdminAccess();
    } else if (path === '/user-panel') {
      await checkUserPanelAccess();
    } else if (path.startsWith('/invitations/')) {
      // Handle template viewing route
      const slug = path.split('/invitations/')[1];
      setTemplateSlug(slug);
      setViewMode('template-view');
    }
  };

  const checkAdminAccess = async () => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    
    if (!user) {
      setShowAuthModal(true);
      window.history.pushState({}, '', '/');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      setViewMode('admin');
      setIsAdmin(true);
    } else {
      alert('Anda tidak memiliki akses ke halaman admin');
      window.history.pushState({}, '', '/');
    }
  };

  const checkUserPanelAccess = async () => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    
    if (!user) {
      setShowAuthModal(true);
      window.history.pushState({}, '', '/');
      return;
    }

    setViewMode('user-panel');
  };

  const handleGoToUserPanel = () => {
    setViewMode('user-panel');
    window.history.pushState({}, '', '/user-panel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (template: WeddingTemplate) => {
    setSelectedTemplate(template);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetail = () => {
    setSelectedTemplate(null);
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateInvitation = async (template: WeddingTemplate) => {
    const { data: { user } } = await (supabase.auth as any).getUser();
    
    if (!user) {
      setShowAuthModal(true);
      showNotification('error', 'Silakan login terlebih dahulu untuk membuat undangan');
      return;
    }

    setSelectedTemplate(template);
    setShowCreateModal(true);
  };

// Perubahan pada fungsi confirmCreateInvitation di src/App.tsx

const confirmCreateInvitation = async () => {
  if (!selectedTemplate) return;

  setCreationLoading(true);
  try {
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error('User not authenticated');

    // Cek apakah user sudah membuat portfolio untuk template ini
    const { data: existingPortfolio } = await supabase
      .from('user_portfolios')
      .select('groom_name, bride_name')
      .eq('user_id', user.id)
      .eq('template_id', selectedTemplate.id)
      .single();

    let slug: string;
    
    if (existingPortfolio && existingPortfolio.groom_name && existingPortfolio.bride_name) {
      // Gunakan nama dari portfolio (ambil kata pertama/first name)
      const groomFirstName = existingPortfolio.groom_name.split(' ')[0].toLowerCase();
      const brideFirstName = existingPortfolio.bride_name.split(' ')[0].toLowerCase();
      
      // Format: namagroom-namabride (contoh: adam-sarah)
      slug = `${groomFirstName}-${brideFirstName}`;
      
      // Hapus karakter khusus dan replace spasi dengan dash
      slug = slug
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Hapus diacritics
        .replace(/[^a-z0-9-]/g, '-') // Replace karakter non-alphanumeric dengan dash
        .replace(/-+/g, '-') // Replace multiple dashes dengan single dash
        .replace(/^-|-$/g, ''); // Hapus dash di awal/akhir
    } else {
      // Fallback: gunakan format lama jika belum ada portfolio
      slug = `${selectedTemplate.title.toLowerCase().replace(/ /g, '-')}-${Date.now().toString().slice(-6)}`;
    }

    const invitationUrl = `/invitations/${slug}`;

    // Cek apakah slug sudah digunakan
    const { data: existingInvitation } = await supabase
      .from('purchases')
      .select('id')
      .eq('access_url', invitationUrl)
      .single();

    // Jika slug sudah ada, tambahkan angka random di belakang
    let finalUrl = invitationUrl;
    if (existingInvitation) {
      const randomNum = Math.floor(Math.random() * 9999);
      finalUrl = `/invitations/${slug}-${randomNum}`;
    }

    const { error: creationError } = await supabase
      .from('purchases')
      .insert({
        user_id: user.id,
        template_id: selectedTemplate.id,
        price_paid: selectedTemplate.price,
        access_url: finalUrl,
        status: 'completed'
      });

    if (creationError) throw creationError;

    setCreatedInvitationIds([...createdInvitationIds, selectedTemplate.id]);

    setNotification({
      type: 'success',
      message: `Undangan "${selectedTemplate.title}" berhasil dibuat! Cek di User Panel Anda.`
    });
    
    setShowCreateModal(false);
    setViewMode('user-panel');
    window.history.pushState({}, '', '/user-panel');
    setSelectedTemplate(null);

    setTimeout(() => setNotification(null), 5000);

  } catch (error: any) {
    console.error('Invitation creation error:', error);
    showNotification('error', 'Gagal membuat undangan. Silakan coba lagi.');
  } finally {
    setCreationLoading(false);
  }
};

  const handleViewPortfolio = (portfolio: PortfolioWithUser) => {
    setSelectedPortfolio(portfolio);
    setShowPortfolioModal(true);
  };

  const handleClosePortfolio = () => {
    setSelectedPortfolio(null);
    setShowPortfolioModal(false);
  };

  const handleTogglePortfolioLike = async (portfolioId: string) => {
    if (!user) {
      setShowAuthModal(true);
      showNotification('error', 'Silakan login untuk menyukai portofolio.');
      return;
    }

    const isLiked = likedPortfolioIds.includes(portfolioId);

    if (isLiked) {
      setLikedPortfolioIds(prev => prev.filter(id => id !== portfolioId));
      if (selectedPortfolio?.id === portfolioId) {
        setSelectedPortfolio(p => p ? { ...p, likes_count: p.likes_count - 1 } : null);
      }
    } else {
      setLikedPortfolioIds(prev => [...prev, portfolioId]);
      if (selectedPortfolio?.id === portfolioId) {
        setSelectedPortfolio(p => p ? { ...p, likes_count: p.likes_count + 1 } : null);
      }
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('portfolio_likes')
          .delete()
          .match({ user_id: user.id, portfolio_id: portfolioId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_likes')
          .insert({ user_id: user.id, portfolio_id: portfolioId });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error toggling portfolio like:", error);
      if (isLiked) {
        setLikedPortfolioIds(prev => [...prev, portfolioId]);
        if (selectedPortfolio?.id === portfolioId) {
          setSelectedPortfolio(p => p ? { ...p, likes_count: p.likes_count + 1 } : null);
        }
      } else {
        setLikedPortfolioIds(prev => prev.filter(id => id !== portfolioId));
        if (selectedPortfolio?.id === portfolioId) {
          setSelectedPortfolio(p => p ? { ...p, likes_count: p.likes_count - 1 } : null);
        }
      }
      showNotification('error', 'Gagal memperbarui like.');
    }
  };

  const renderView = () => {
    // Template viewer
    if (viewMode === 'template-view' && templateSlug) {
      return <TemplateViewer slug={templateSlug} />;
    }

    // Admin panel
    if (viewMode === 'admin') {
      return <AdminPanel />;
    }

    // User panel
    if (viewMode === 'user-panel') {
      return (
        <UserPanel
          onViewDetails={handleViewDetails}
          onCreateInvitation={handleCreateInvitation}
          onToggleFavorite={handleToggleFavorite}
          favoriteIds={favoriteIds}
          createdInvitationIds={createdInvitationIds}
          onGoToUserPanel={handleGoToUserPanel}
          onNavigateHome={() => {
            setViewMode('home');
            window.history.pushState({}, '', '/');
          }}
        />
      );
    }

    // Template detail
    if (viewMode === 'detail' && selectedTemplate) {
      return (
        <TemplateDetail
          template={selectedTemplate}
          onClose={handleCloseDetail}
          onCreateInvitation={handleCreateInvitation}
          isCreated={createdInvitationIds.includes(selectedTemplate.id)}
          onGoToUserPanel={handleGoToUserPanel}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onRateTemplate={handleRateTemplate}
        />
      );
    }

    // Home page
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#fff4bd]/10 to-[#85d2d0]/10">
        <Navbar onAuthClick={() => setShowAuthModal(true)} />
        <Hero />

        <section id="featured" className="top-10 relative pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#f4b9b8]/20 to-[#887bb0]/20 mb-4">
                <Sparkles className="w-5 h-5 text-[#887bb0]" />
                <span className="text-[#887bb0] font-semibold">Featured Templates</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Template Pilihan Terbaik</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Koleksi template premium yang paling populer dan banyak dipilih oleh pasangan
              </p>
            </div>

            <TemplateGrid
              onViewDetails={handleViewDetails}
              showFeaturedOnly={true}
              createdInvitationIds={createdInvitationIds}
              onGoToUserPanel={handleGoToUserPanel}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </section>

        <section id="portfolios" className="top-10 relative pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-smooth bg-gradient-to-r from-[#f4b9b8]/10 via-white to-[#85d2d0]/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#85d2d0]/20 to-[#fff4bd]/20 mb-4">
                <Camera className="w-5 h-5 text-[#887bb0]" />
                <span className="text-[#887bb0] font-semibold">Portfolio Inspirasi</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Kisah Nyata, Momen Indah</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Lihat bagaimana pasangan lain mewujudkan pernikahan impian mereka dengan template kami.
              </p>
            </div>
            <PortfolioGallery
              onViewDetails={handleViewPortfolio}
              onToggleLike={handleTogglePortfolioLike}
              likedPortfolioIds={likedPortfolioIds}
            />
          </div>
        </section>

        <section id="templates" className="top-10 relative pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Semua Template</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Jelajahi koleksi lengkap template undangan pernikahan digital kami
              </p>
            </div>

            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <TemplateGrid
              onViewDetails={handleViewDetails}
              filterCategory={selectedCategory}
              createdInvitationIds={createdInvitationIds}
              onGoToUserPanel={handleGoToUserPanel}
              favoriteIds={favoriteIds}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </section>

        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#f4b9b8]/10 via-[#887bb0]/10 to-[#85d2d0]/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Mengapa Memilih Kami?</h2>
            <p className="text-lg text-gray-600 mb-12">
              Kami menyediakan platform undangan pernikahan digital berkualitas tinggi yang mudah dikustomisasi
              dan siap pakai untuk hari spesial Anda.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Desain Premium</h3>
                <p className="text-gray-600">Template dirancang oleh desainer profesional dengan standar tertinggi</p>
              </div>

              <div className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#887bb0] to-[#85d2d0] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Mudah Dikustomisasi</h3>
                <p className="text-gray-600">Ubah teks, foto, dan musik sesuai keinginan Anda dengan mudah</p>
              </div>

              <div className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#85d2d0] to-[#fff4bd] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Support 24/7</h3>
                <p className="text-gray-600">Tim support kami siap membantu Anda kapan saja</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  };

  return (
    <>
      {renderView()}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      
      {showPortfolioModal && selectedPortfolio && (
        <PortfolioDetailModal
          portfolio={selectedPortfolio}
          onClose={handleClosePortfolio}
          onToggleLike={handleTogglePortfolioLike}
          isLiked={likedPortfolioIds.includes(selectedPortfolio.id)}
        />
      )}

      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl animate-slideIn max-w-md ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-red-500 to-pink-500'
        } text-white`}>
          <div className="flex items-start space-x-3">
            {notification.type === 'success' ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div className="flex-1">
              <p className="font-semibold mb-1">
                {notification.type === 'success' ? 'Berhasil!' : 'Gagal'}
              </p>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <CreateInvitationModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={confirmCreateInvitation}
        template={selectedTemplate}
        loading={creationLoading}
      />

      {isAdmin && viewMode === 'home' && (
        <button
          onClick={() => {
            setViewMode('admin');
            window.history.pushState({}, '', '/admin');
          }}
          className="fixed bottom-24 right-6 p-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all z-40"
          title="Admin Panel"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {user && viewMode === 'home' && (
        <button
          onClick={handleGoToUserPanel}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all z-40 flex items-center space-x-2"
          title="User Panel"
        >
          <UserIcon className="w-6 h-6" />
        </button>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default App;