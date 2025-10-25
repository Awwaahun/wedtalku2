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
import { WeddingTemplate } from './lib/supabase';
import { supabase } from './lib/supabase';
import { Sparkles } from 'lucide-react';

type ViewMode = 'home' | 'detail' | 'admin' | 'user-panel';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<WeddingTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAdminStatus();
    checkUserSession();
    checkRouting();
  }, []);

  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  };

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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
    }
  };

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthModal(true);
      window.history.pushState({}, '', '/');
      return;
    }

    setViewMode('user-panel');
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

  const handlePurchase = (template: WeddingTemplate) => {
    alert(`Pembelian template "${template.title}" akan segera diproses. Fitur pembayaran akan segera hadir!`);
    setViewMode('home');
    setSelectedTemplate(null);
  };

  // Tampilkan admin panel
  if (viewMode === 'admin') {
    return <AdminPanel />;
  }

  // Tampilkan user panel
  if (viewMode === 'user-panel') {
    return <UserPanel />;
  }

  // Tampilkan halaman detail jika ada template yang dipilih
  if (viewMode === 'detail' && selectedTemplate) {
    return (
      <>
        <TemplateDetail
          template={selectedTemplate}
          onClose={handleCloseDetail}
          onPurchase={handlePurchase}
        />
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </>
    );
  }

  // Tampilkan halaman home
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fff4bd]/10 to-[#85d2d0]/10">
      <Navbar
        onAuthClick={() => setShowAuthModal(true)}
        onCartClick={() => setShowCart(true)}
      />

      <Hero />

      <section id="featured" className="top-10 relative pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-smooth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#f4b9b8]/20 to-[#887bb0]/20 mb-4">
              <Sparkles className="w-5 h-5 text-[#887bb0]" />
              <span className="text-[#887bb0] font-semibold">Featured Templates</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Template Pilihan Terbaik
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Koleksi template premium yang paling populer dan banyak dipilih oleh pasangan
            </p>
          </div>

          <TemplateGrid
            onViewDetails={handleViewDetails}
            showFeaturedOnly={true}
            featuredLayout={true}
          />
        </div>
      </section>

      <section id="templates" className="top-10 relative pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-smooth">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Semua Template
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Jelajahi koleksi lengkap template website pernikahan kami
            </p>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <TemplateGrid
            onViewDetails={handleViewDetails}
            filterCategory={selectedCategory}
          />
        </div>
      </section>

      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#f4b9b8]/10 via-[#887bb0]/10 to-[#85d2d0]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Kami menyediakan template website pernikahan berkualitas tinggi yang mudah dikustomisasi
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
              <p className="text-gray-600">Ubah teks, foto, dan warna sesuai keinginan Anda dengan mudah</p>
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

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Admin Access Button - Only visible for admin users */}
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

      {/* User Panel Access Button - Visible for logged in users */}
      {user && viewMode === 'home' && (
        <button
          onClick={() => {
            setViewMode('user-panel');
            window.history.pushState({}, '', '/user-panel');
          }}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all z-40 flex items-center space-x-2"
          title="User Panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;