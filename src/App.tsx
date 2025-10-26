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
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import { CartProvider, useCart } from './contexts/CartContext';

type ViewMode = 'home' | 'detail' | 'admin' | 'user-panel';

function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<WeddingTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userPurchases, setUserPurchases] = useState<string[]>([]); // Array of purchased template IDs
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseNotification, setPurchaseNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    checkAdminStatus();
    checkUserSession();
    checkRouting();
  }, []);

  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    // Load user's purchases if logged in
    if (currentUser) {
      loadUserPurchases(currentUser.id);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        loadUserPurchases(newUser.id);
      } else {
        setUserPurchases([]);
      }
    });

    return () => subscription.unsubscribe();
  };

  const loadUserPurchases = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('template_id')
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (error) throw error;
      
      const purchasedIds = data?.map(p => p.template_id) || [];
      setUserPurchases(purchasedIds);
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
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

  const handlePurchase = async (template: WeddingTemplate) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthModal(true);
      setPurchaseNotification({
        type: 'error',
        message: 'Silakan login terlebih dahulu untuk membeli template'
      });
      setTimeout(() => setPurchaseNotification(null), 3000);
      return;
    }

    setSelectedTemplate(template);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedTemplate) return;

    setPurchaseLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already purchased this template
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('template_id', selectedTemplate.id)
        .eq('status', 'completed')
        .single();

      if (existingPurchase) {
        setPurchaseNotification({
          type: 'error',
          message: 'Anda sudah membeli template ini sebelumnya. Cek di User Panel.'
        });
        setShowPurchaseModal(false);
        setTimeout(() => setPurchaseNotification(null), 4000);
        return;
      }

      // Insert purchase
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          template_id: selectedTemplate.id,
          price_paid: selectedTemplate.price,
          access_url: selectedTemplate.demo_url || selectedTemplate.thumbnail_url,
          status: 'completed'
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Update local state
      setUserPurchases([...userPurchases, selectedTemplate.id]);

      setPurchaseNotification({
        type: 'success',
        message: `Pembelian "${selectedTemplate.title}" berhasil! Cek di User Panel Anda.`
      });
      
      setShowPurchaseModal(false);
      setViewMode('home');
      setSelectedTemplate(null);

      // Auto hide notification after 5 seconds
      setTimeout(() => setPurchaseNotification(null), 5000);

    } catch (error: any) {
      console.error('Purchase error:', error);
      
      let errorMessage = 'Gagal melakukan pembelian. Silakan coba lagi.';
      
      if (error.message?.includes('sudah membeli')) {
        errorMessage = 'Anda sudah membeli template ini sebelumnya';
      } else if (error.message?.includes('duplicate')) {
        errorMessage = 'Template ini sudah ada di pembelian Anda';
      }
      
      setPurchaseNotification({
        type: 'error',
        message: errorMessage
      });
      setTimeout(() => setPurchaseNotification(null), 3000);
    } finally {
      setPurchaseLoading(false);
    }
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
          isPurchased={userPurchases.includes(selectedTemplate.id)}
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
            userPurchases={userPurchases}
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
            userPurchases={userPurchases}
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

      {/* Purchase Notification */}
      {purchaseNotification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl animate-slideIn max-w-md ${
          purchaseNotification.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-red-500 to-pink-500'
        } text-white`}>
          <div className="flex items-start space-x-3">
            {purchaseNotification.type === 'success' ? (
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
                {purchaseNotification.type === 'success' ? 'Berhasil!' : 'Gagal'}
              </p>
              <p className="text-sm opacity-90">{purchaseNotification.message}</p>
            </div>
            <button
              onClick={() => setPurchaseNotification(null)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-scaleIn">
            {/* Header */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedTemplate.thumbnail_url}
                alt={selectedTemplate.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <h3 className="text-2xl font-bold text-white mb-1">
                  Konfirmasi Pembelian
                </h3>
                <p className="text-white/80 text-sm">
                  Pastikan data pembelian sudah benar
                </p>
              </div>
              <button
                onClick={() => setShowPurchaseModal(false)}
                disabled={purchaseLoading}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Template Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-1">
                      {selectedTemplate.title}
                    </h4>
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                      {selectedTemplate.category.charAt(0).toUpperCase() + selectedTemplate.category.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Harga</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(selectedTemplate.price)}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
                  <h5 className="font-semibold text-gray-800 mb-3">Yang Akan Anda Dapatkan:</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Source Code Lengkap',
                      'Dokumentasi',
                      'Lifetime Access',
                      'Free Updates (6 Bulan)',
                      'Tutorial Video',
                      'Support'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-800 mb-1">Informasi Penting</p>
                    <p className="text-xs text-blue-700">
                      Setelah pembelian, template akan langsung tersedia di User Panel Anda. 
                      Anda dapat mengunduh source code dan mengakses semua fitur yang termasuk dalam paket ini.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  disabled={purchaseLoading}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={confirmPurchase}
                  disabled={purchaseLoading}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {purchaseLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Konfirmasi Pembelian</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Badge */}
              <div className="text-center pt-2">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Transaksi aman & terenkripsi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;