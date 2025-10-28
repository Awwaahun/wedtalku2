import React from 'react';
import type { WeddingTemplate } from '../lib/supabase';
import { Sparkles, Edit } from 'lucide-react';

interface CreateInvitationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  template: WeddingTemplate | null;
  loading: boolean;
}

const CreateInvitationModal: React.FC<CreateInvitationModalProps> = ({ show, onClose, onConfirm, template, loading }) => {
  if (!show || !template) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-scaleIn flex flex-col max-h-[90vh]">
        <div className="relative h-36 sm:h-48 overflow-hidden flex-shrink-0">
          <img
            src={template.thumbnail_url}
            alt={template.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Buat Undangan Digital Anda
            </h3>
            <p className="text-white/80 text-sm">
              Anda akan membuat undangan baru menggunakan template ini.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                    {template.title}
                  </h4>
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </span>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="text-sm text-gray-500 mb-1">Harga</p>
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(template.price)}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
                <h5 className="font-semibold text-gray-800 mb-3">Apa selanjutnya?</h5>
                <div className="space-y-2">
                  {[
                    'Undangan akan ditambahkan ke User Panel Anda.',
                    'Anda akan mendapatkan link unik untuk dibagikan.',
                    'Kustomisasi detail acara, foto, dan musik.',
                    'Kelola buku tamu dan hadiah digital.',
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

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5" />
                    <span>Buat Undangan Sekarang</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Proses aman & terenkripsi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvitationModal;
