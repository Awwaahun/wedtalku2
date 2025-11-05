import { useState } from 'react';
import { Heart, Send, User, Mail, Users, Check, MessageCircle, Utensils, PartyPopper, Sparkles } from 'lucide-react';

const RSVP = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    attending: 'yes',
    dietary: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      guests: '1',
      attending: 'yes',
      dietary: '',
      message: '',
    });
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="relative py-24 md:py-32 bg-gradient-to-br from-[#0a1a2f] via-[#1b2d4a] to-[#243b55] overflow-hidden text-white">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-sky-200 animate-float"
              size={20 + Math.random() * 20}
              fill="currentColor"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto backdrop-blur-2xl bg-white/10 border border-slate-300/30 rounded-3xl shadow-2xl p-12 text-center animate-scale-in">
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 animate-ping">
                <div className="absolute inset-0 bg-emerald-400 rounded-full opacity-20" />
              </div>
              <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-6 rounded-full shadow-2xl">
                <Check size={64} className="text-white" strokeWidth={3} />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif text-silver-100 mb-4">
              Terima Kasih!
            </h2>

            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-400" />
              <Heart className="text-sky-400" size={24} fill="currentColor" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-400" />
            </div>

            <p className="text-slate-200 text-lg mb-8 leading-relaxed">
              RSVP Anda telah diterima. Kami senang bisa merayakan hari istimewa ini bersama Anda!
            </p>

            <div className="bg-gradient-to-r from-slate-700/40 to-slate-600/40 rounded-2xl p-6 mb-8 border border-slate-300/30 backdrop-blur-xl">
              <PartyPopper className="text-sky-300 mx-auto mb-3" size={32} />
              <p className="text-silver-100">
                Kami akan mengirimkan detail lebih lanjut ke email Anda segera.
              </p>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-slate-400 hover:from-sky-700 hover:to-slate-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Send size={20} />
              Kirim RSVP Lainnya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-24 md:py-32 bg-gradient-to-br from-[#0a1a2f] via-[#1b2d4a] to-[#243b55] overflow-hidden text-white">
      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <Sparkles className="text-sky-200" size={15 + Math.random() * 10} />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-600 to-slate-400 text-white rounded-full px-6 py-3 shadow-xl mb-6">
            <PartyPopper size={20} />
            <span className="font-semibold">Konfirmasi Kehadiran</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif text-silver-100 mb-6">
            RSVP
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-slate-400" />
            <Heart className="text-sky-400" size={24} fill="currentColor" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-slate-400" />
          </div>

          <p className="text-slate-200 text-xl max-w-2xl mx-auto">
            Mohon konfirmasi kehadiran Anda. Informasi ini sangat membantu kami dalam persiapan acara.
          </p>
        </div>

        {/* Form Box mirip Hero */}
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 to-slate-400 rounded-3xl blur-2xl opacity-20" />
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-300/30">
            <div className="space-y-6 text-slate-100">
              {/* Input Fields */}
              {/* Semua input tetap sama */}
              {/* Name */}
              <div className="group">
                <label className="flex items-center gap-2 font-semibold mb-3">
                  <User size={20} className="text-sky-400" />
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-400/40 bg-white/10 text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-300 focus:border-sky-400 transition-all duration-300"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="flex items-center gap-2 font-semibold mb-3">
                  <Mail size={20} className="text-sky-400" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-400/40 bg-white/10 text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-300 focus:border-sky-400 transition-all duration-300"
                  placeholder="email@example.com"
                />
              </div>

              {/* Guests */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 font-semibold mb-3">
                    <Users size={20} className="text-sky-400" />
                    Jumlah Tamu *
                  </label>
                  <select
                    required
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-400/40 bg-white/10 text-white cursor-pointer focus:ring-4 focus:ring-sky-300 focus:border-sky-400 transition-all duration-300"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num} className="text-black">
                        {num} {num === 1 ? 'Orang' : 'Orang'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 font-semibold mb-3">
                    <PartyPopper size={20} className="text-sky-400" />
                    Kehadiran *
                  </label>
                  <select
                    required
                    value={formData.attending}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border border-slate-400/40 bg-white/10 text-white cursor-pointer focus:ring-4 focus:ring-sky-300 focus:border-sky-400 transition-all duration-300"
                  >
                    <option value="yes" className="text-black">✓ Ya, Saya Akan Hadir</option>
                    <option value="no" className="text-black">✗ Maaf, Tidak Bisa Hadir</option>
                  </select>
                </div>
              </div>

              {/* Dietary */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-3">
                  <Utensils size={20} className="text-sky-400" />
                  Kebutuhan Khusus
                </label>
                <input
                  type="text"
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-400/40 bg-white/10 text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-300 focus:border-sky-400 transition-all duration-300"
                  placeholder="Vegetarian, Alergi, dll."
                />
              </div>

              {/* Message */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-3">
                  <MessageCircle size={20} className="text-sky-400" />
                  Pesan untuk Pengantin
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-400/40 bg-white/10 text-white placeholder-slate-400 focus:ring-4 focus:ring-sky-300 focus:border-sky-400 transition-all duration-300 resize-none"
                  placeholder="Bagikan harapan Anda untuk kami..."
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-sky-600 to-slate-400 hover:from-sky-700 hover:to-slate-500 text-white py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send size={24} />
                      <span>Kirim Konfirmasi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVP;
