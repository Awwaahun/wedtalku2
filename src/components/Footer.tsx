import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-[#f4b9b8]" fill="#f4b9b8" />
              <span className="font-logo text-xl font-bold bg-gradient-to-r from-[#f4b9b8] via-[#887bb0] to-[#85d2d0] bg-clip-text text-transparent">
                WedTalku
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Platform terpercaya untuk membeli template website pernikahan digital yang elegan dan modern.
              Wujudkan website impian untuk hari spesial Anda.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#templates" className="text-gray-600 hover:text-[#887bb0] transition-colors">
                  Template
                </a>
              </li>
              <li>
                <a href="#featured" className="text-gray-600 hover:text-[#887bb0] transition-colors">
                  Featured
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-[#887bb0] transition-colors">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#887bb0] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-800 mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-[#887bb0] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">support@wedtalku.id</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-[#887bb0] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">+62 812-3456-7890</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-[#887bb0] flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; 2025 Wedding Market. All rights reserved. Made with{' '}
            <Heart className="w-4 h-4 inline text-[#f4b9b8]" fill="#f4b9b8" /> for your special day
          </p>
        </div>
      </div>
    </footer>
  );
}
