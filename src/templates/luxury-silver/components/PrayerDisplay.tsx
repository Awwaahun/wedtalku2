import React, { useState } from 'react';
import { BookOpen, Loader2, Sparkles } from 'lucide-react';
import { generateIslamicWeddingPrayer } from '../services/geminiService';

const PrayerDisplay: React.FC = () => {
  const [prayer, setPrayer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePrayer = async () => {
    setIsLoading(true);
    setError('');
    setPrayer(null);
    try {
      const generatedPrayer = await generateIslamicWeddingPrayer();
      if (generatedPrayer.startsWith("Maaf")) {
        setError(generatedPrayer);
      } else {
        setPrayer(generatedPrayer);
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPrayer = () => {
    if (!prayer) return null;
    const parts = prayer.split('\n\n');
    const title = parts[0];
    const body = parts.slice(1).join('\n\n');
    return (
      <div className="animate-fade-in text-center">
        <h3 className="text-2xl md:text-3xl font-semibold font-serif text-white mb-4">
          {title}
        </h3>
        <blockquote className="text-lg md:text-xl text-slate-100 leading-relaxed italic">
          <p>“{body}”</p>
        </blockquote>
      </div>
    );
  };

  return (
    <section
      id="prayer"
      className="relative py-24 md:py-32 bg-gradient-to-b from-[#0d1a33] via-[#142850] to-[#1e3765] overflow-hidden"
    >
      {/* background efek bokeh */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-2xl"
            style={{
              width: `${10 + Math.random() * 60}px`,
              height: `${10 + Math.random() * 60}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* konten utama */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#223b6c] to-[#476cc8] text-white rounded-full px-6 py-3 shadow-xl mb-6">
            <BookOpen size={22} />
            <span className="font-semibold">Doa Pernikahan Islami</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 drop-shadow-md">
            Doa Untuk Kami
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-slate-300/50" />
            <Sparkles className="text-sky-400" size={24} />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-slate-300/50" />
          </div>

          <p className="text-slate-200 text-lg max-w-2xl mx-auto">
            Doakan kami agar pernikahan ini menjadi awal perjalanan yang penuh berkah dan cinta abadi.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* glow pinggir box seperti RSVP */}
          <div className="absolute -inset-4 bg-gradient-to-r from-slate-300/20 via-sky-200/20 to-slate-100/10 rounded-3xl blur-2xl opacity-30" />

          {/* box utama */}
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl p-8 md:p-12 text-center transition-all duration-500 hover:shadow-[0_0_30px_rgba(180,200,255,0.3)]">
            {isLoading ? (
              <div className="flex flex-col items-center text-slate-200">
                <Loader2 className="animate-spin" size={48} />
                <p className="mt-4 font-serif">Menerima doa terbaik untuk kami...</p>
              </div>
            ) : error ? (
              <div className="text-center text-red-400">
                <p>{error}</p>
                <button
                  onClick={handleGeneratePrayer}
                  className="mt-4 px-8 py-3 bg-gradient-to-r from-[#2b4ea2] to-[#476cc8] hover:from-[#385cb4] hover:to-[#5574d8] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Coba Lagi
                </button>
              </div>
            ) : prayer ? (
              <>
                {renderPrayer()}
                <button
                  onClick={handleGeneratePrayer}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-[#2b4ea2] to-[#476cc8] hover:from-[#385cb4] hover:to-[#5574d8] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto"
                >
                  <Sparkles size={20} />
                  Doa Lainnya
                </button>
              </>
            ) : (
              <button
                onClick={handleGeneratePrayer}
                className="px-8 py-4 bg-gradient-to-r from-[#2b4ea2] to-[#476cc8] hover:from-[#385cb4] hover:to-[#5574d8] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles size={22} />
                Mulai Terima Doa
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrayerDisplay;
