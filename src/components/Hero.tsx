import { ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#f4b9b8] via-[#887bb0] to-[#85d2d0] bg-clip-text text-transparent">
              Website Pernikahan
            </span>
            <br />
            <span className="text-gray-800">Impian Anda</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pilih dari koleksi template website pernikahan digital yang elegan dan modern.
            Siap pakai, mudah dikustomisasi, dan sempurna untuk hari istimewa Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#templates"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Jelajahi Template
            </a>
            <a
              href="#featured"
              className="px-8 py-4 rounded-full border-2 border-[#887bb0] text-[#887bb0] font-semibold hover:bg-[#887bb0] hover:text-white transition-all duration-300"
            >
              Lihat Featured
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#f4b9b8]/10 to-[#f4b9b8]/5 border border-[#f4b9b8]/20">
              <div className="text-3xl font-bold text-[#f4b9b8] mb-2">15+</div>
              <div className="text-gray-600">Template Premium</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#887bb0]/10 to-[#887bb0]/5 border border-[#887bb0]/20">
              <div className="text-3xl font-bold text-[#887bb0] mb-2">100%</div>
              <div className="text-gray-600">Customizable</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#85d2d0]/10 to-[#85d2d0]/5 border border-[#85d2d0]/20">
              <div className="text-3xl font-bold text-[#85d2d0] mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>

          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 mx-auto text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
