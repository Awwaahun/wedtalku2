import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // LOGIN
        // FIX: Cast supabase.auth to any to bypass TypeScript error due to likely version mismatch.
        const { error } = await (supabase.auth as any).signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage({ type: 'success', text: 'Login berhasil!' });
        setTimeout(() => {
          onClose();
          window.location.reload(); // Reload untuk update UI
        }, 1000);
      } else {
        // SIGN UP - Metode 1: Dengan Trigger Database (Recommended)
        const { data: authData, error: signUpError } = await (supabase.auth as any).signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName, // Akan digunakan oleh trigger
            }
          }
        });

        if (signUpError) throw signUpError;

        // Tunggu sebentar untuk trigger database selesai
        await new Promise(resolve => setTimeout(resolve, 1000));

        setMessage({ 
          type: 'success', 
          text: 'Registrasi berhasil! Silakan cek email untuk verifikasi.' 
        });
        
        setTimeout(() => {
          setIsLogin(true);
          setMessage(null);
          setEmail('');
          setPassword('');
          setFullName('');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific error messages
      let errorMessage = 'Terjadi kesalahan';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email atau password salah';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'Email sudah terdaftar';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Silakan verifikasi email Anda terlebih dahulu';
      } else if (error.message?.includes('row-level security')) {
        errorMessage = 'Gagal membuat profil. Silakan hubungi admin.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] bg-clip-text text-transparent mb-2">
              {isLogin ? 'Selamat Datang' : 'Daftar Akun'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru untuk memulai'}
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#887bb0] focus:border-transparent outline-none transition-all"
                    placeholder="Nama lengkap Anda"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#887bb0] focus:border-transparent outline-none transition-all"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#887bb0] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Minimal 6 karakter
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#f4b9b8] to-[#887bb0] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                isLogin ? 'Masuk' : 'Daftar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage(null);
                setEmail('');
                setPassword('');
                setFullName('');
              }}
              className="text-[#887bb0] hover:text-[#f4b9b8] transition-colors font-medium"
            >
              {isLogin
                ? 'Belum punya akun? Daftar di sini'
                : 'Sudah punya akun? Login di sini'}
            </button>
          </div>

          {/* Info untuk development */}
          {!isLogin && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 <strong>Info:</strong> Setelah registrasi, cek email untuk verifikasi akun (jika email confirmation diaktifkan di Supabase).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
