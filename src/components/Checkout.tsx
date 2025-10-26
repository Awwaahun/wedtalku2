// src/components/Checkout.tsx
import { useState } from 'react';
import { X, CreditCard, Building2, Smartphone, CheckCircle, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'credit_card' | 'bank_transfer' | 'e_wallet';

export default function Checkout({ onClose, onSuccess }: CheckoutProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      setStep('processing');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create purchases for each item in cart
      const purchases = cartItems.map(item => ({
        user_id: user.id,
        template_id: item.id,
        price_paid: item.price,
        purchase_date: new Date().toISOString(),
        access_url: item.demo_url || '#',
        status: 'completed'
      }));

      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert(purchases);

      if (purchaseError) throw purchaseError;

      setStep('success');
      clearCart();

      // Auto close after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Terjadi kesalahan saat memproses pembayaran');
      setStep('payment');
    } finally {
      setProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Kartu Kredit/Debit',
      icon: CreditCard,
      description: 'Visa, Mastercard, JCB',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'bank_transfer',
      name: 'Transfer Bank',
      icon: Building2,
      description: 'BCA, Mandiri, BNI, BRI',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'e_wallet',
      name: 'E-Wallet',
      icon: Smartphone,
      description: 'GoPay, OVO, DANA, ShopeePay',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-2xl">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-spin" />
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Memproses Pembayaran</h3>
          <p className="text-gray-600">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-2xl animate-scaleIn">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h3>
          <p className="text-gray-600 mb-6">Template telah ditambahkan ke akun Anda</p>
          <div className="space-y-2 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="p-3 rounded-lg bg-gray-50 text-left">
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-600">{formatPrice(item.price)}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">Mengalihkan ke User Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors sm:hidden"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
              <p className="text-sm text-gray-500">{cartItems.length} template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hidden sm:block p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Pembayaran Gagal</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-gray-600">{item.category}</p>
                    <p className="text-sm font-bold text-purple-600 mt-1">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Metode Pembayaran</h3>
            <div className="space-y-3">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;

                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">{method.name}</p>
                        <p className="text-xs text-gray-600">{method.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Info */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-800">Info Pembayaran</p>
                <p className="text-xs text-blue-700 mt-1">
                  Ini adalah demo pembayaran. Tidak ada transaksi nyata yang akan diproses. 
                  Template akan langsung tersedia di User Panel Anda setelah checkout.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-800">{formatPrice(getCartTotal())}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Biaya Admin</span>
              <span className="font-semibold text-green-600">Gratis</span>
            </div>
            <div className="pt-2 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">Total Pembayaran</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Bayar Sekarang</span>
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500">
            Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}