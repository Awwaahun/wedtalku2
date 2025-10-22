import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import TemplateGrid from './components/TemplateGrid';
import TemplateModal from './components/TemplateModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { WeddingTemplate } from './lib/supabase';
import { Sparkles } from 'lucide-react';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<WeddingTemplate | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handlePurchase = (template: WeddingTemplate) => {
    alert(`Pembelian template "${template.title}" akan segera diproses. Fitur pembayaran akan segera hadir!`);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fff4bd]/10 to-[#85d2d0]/10">
      <Navbar
        onAuthClick={() => setShowAuthModal(true)}
        onCartClick={() => setShowCart(true)}
      />

      <Hero />

      <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8">
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
            onViewDetails={setSelectedTemplate}
            showFeaturedOnly={true}
          />
        </div>
      </section>

      <section id="templates" className="py-16 px-4 sm:px-6 lg:px-8">
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
            onViewDetails={setSelectedTemplate}
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

      {selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onPurchase={handlePurchase}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default App;
