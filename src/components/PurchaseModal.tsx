import { WeddingTemplate } from '../lib/supabase';

interface PurchaseModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  template: WeddingTemplate | null;
  loading: boolean;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ show, onClose, onConfirm, template, loading }) => {
  if (!show || !template) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-scaleIn max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="relative h-32 xs:h-40 sm:h-48 overflow-hidden">
          <img
            src={template.thumbnail_url}
            alt={template.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-6 sm:right-6">
            <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-white mb-1">
              Konfirmasi Pembelian
            </h3>
            <p className="text-white/80 text-xs xs:text-sm">
              Pastikan data pembelian sudah benar
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 xs:p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Template Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col xs:flex-row items-start justify-between gap-3 xs:gap-4">
              <div className="flex-1 w-full xs:w-auto">
                <h4 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {template.title}
                </h4>
                <span className="inline-block px-2 py-0.5 xs:px-3 xs:py-1 rounded-full bg-purple-100 text-purple-700 text-xs sm:text-sm font-semibold">
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                </span>
              </div>
              <div className="text-left xs:text-right w-full xs:w-auto">
                <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">Harga</p>
                <p className="text-xl xs:text-2xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(template.price)}
                </p>
              </div>
            </div>

            <div className="p-3 xs:p-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
              <h5 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Yang Akan Anda Dapatkan:</h5>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 xs:gap-2">
                {[
                  'Source Code Lengkap',
                  'Dokumentasi',
                  'Lifetime Access',
                  'Free Updates (6 Bulan)',
                  'Tutorial Video',
                  'Support'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 xs:space-x-2 text-xs xs:text-sm">
                    <svg className="w-3 h-3 xs:w-4 xs:h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-3 xs:p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-start space-x-2 xs:space-x-3">
              <svg className="w-4 h-4 xs:w-5 xs:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-xs xs:text-sm font-semibold text-blue-800 mb-0.5 xs:mb-1">Informasi Penting</p>
                <p className="text-[10px] xs:text-xs text-blue-700">
                  Setelah pembelian, template akan langsung tersedia di User Panel Anda.
                  Anda dapat mengunduh source code dan mengakses semua fitur yang termasuk dalam paket ini.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 xs:px-6 xs:py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm xs:text-base"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 xs:px-6 xs:py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm xs:text-base"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 xs:h-5 xs:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="hidden xxs:inline">Konfirmasi Pembelian</span>
                  <span className="xxs:hidden">Konfirmasi</span>
                </>
              )}
            </button>
          </div>

          {/* Security Badge */}
          <div className="text-center pt-1 xs:pt-2">
            <div className="inline-flex items-center space-x-1.5 xs:space-x-2 text-xs xs:text-sm text-gray-600">
              <svg className="w-3 h-3 xs:w-4 xs:h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Transaksi aman & terenkripsi</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Custom breakpoint xxs (375px) */
        @media (min-width: 375px) {
          .xxs\\:inline {
            display: inline;
          }
          .xxs\\:hidden {
            display: none;
          }
        }

        /* Custom breakpoint xs (475px) */
        @media (min-width: 475px) {
          .xs\\:h-40 {
            height: 10rem;
          }
          .xs\\:p-5 {
            padding: 1.25rem;
          }
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:w-auto {
            width: auto;
          }
          .xs\\:text-right {
            text-align: right;
          }
          .xs\\:gap-4 {
            gap: 1rem;
          }
          .xs\\:text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
          .xs\\:text-xl {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
          .xs\\:text-2xl {
            font-size: 1.5rem;
            line-height: 2rem;
          }
          .xs\\:px-3 {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .xs\\:py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
          }
          .xs\\:p-4 {
            padding: 1rem;
          }
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .xs\\:gap-2 {
            gap: 0.5rem;
          }
          .xs\\:gap-3 {
            gap: 0.75rem;
          }
          .xs\\:space-x-2 > :not([hidden]) ~ :not([hidden]) {
            margin-left: 0.5rem;
          }
          .xs\\:space-x-3 > :not([hidden]) ~ :not([hidden]) {
            margin-left: 0.75rem;
          }
          .xs\\:text-sm {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }
          .xs\\:w-5 {
            width: 1.25rem;
          }
          .xs\\:h-5 {
            height: 1.25rem;
          }
          .xs\\:w-4 {
            width: 1rem;
          }
          .xs\\:h-4 {
            height: 1rem;
          }
          .xs\\:mb-1 {
            margin-bottom: 0.25rem;
          }
          .xs\\:px-6 {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .xs\\:py-3 {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .xs\\:text-base {
            font-size: 1rem;
            line-height: 1.5rem;
          }
          .xs\\:pt-2 {
            padding-top: 0.5rem;
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PurchaseModal;