// src/components/ShoppingCart.tsx
import { X, Trash2, ShoppingBag, ArrowRight, Package, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

interface ShoppingCartProps {
  onClose: () => void;
  onCheckout: () => void;
}

export default function ShoppingCart({ onClose, onCheckout }: ShoppingCartProps) {
  const { cartItems, removeFromCart, clearCart, getCartTotal, getCartCount } = useCart();
  const [user, setUser] = useState<any>(null);

  useState(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk melakukan checkout');
      return;
    }
    if (cartItems.length === 0) {
      alert('Keranjang belanja Anda kosong');
      return;
    }
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:w-[480px] h-[85vh] sm:h-[90vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-slideRight">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Keranjang</h2>
              <p className="text-sm text-gray-500">{getCartCount()} item</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-cyan-100 flex items-center justify-center mb-4">
                <Package className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Keranjang Kosong</h3>
              <p className="text-gray-600 mb-6">Tambahkan template ke keranjang untuk memulai</p>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all"
              >
                Lihat Template
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all group"
                >
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors flex-shrink-0"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <span className="inline-block px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
                      {item.category}
                    </span>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {cartItems.length > 1 && (
                <button
                  onClick={clearCart}
                  className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Kosongkan Keranjang</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 sm:p-6 space-y-4 bg-gray-50">
            {/* Login Warning */}
            {!user && (
              <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-800">Login Diperlukan</p>
                  <p className="text-xs text-yellow-700 mt-0.5">Silakan login untuk melanjutkan checkout</p>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal ({getCartCount()} item)</span>
                <span className="font-semibold">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Biaya Admin</span>
                <span className="font-semibold text-green-600">Gratis</span>
              </div>
              <div className="pt-2 border-t border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 font-bold">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={!user}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
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
        @keyframes slideRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-slideRight {
          animation: slideRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}