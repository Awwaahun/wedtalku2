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
      setError("An unexpected error occurred. Please try again.");
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
        <h3 className="text-xl font-semibold font-serif text-text/90 mb-4">{title}</h3>
        <blockquote className="text-lg text-text/80 leading-relaxed italic">
          <p>“{body}”</p>
        </blockquote>
      </div>
    );
  };

  return (
    <section id="prayer" className="relative z-[30] py-20 md:py-32 bg-background">

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-br from-primary/20 to-secondary/20 p-5 rounded-full mb-4">
            <BookOpen className="text-primary" size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-text mb-4">Doa Untuk Kami</h2>
          <p className="text-text/80 max-w-2xl mx-auto">
            Saat kita memulai hidup bersama, kami sangat berterima kasih atas doa-doa Anda. Klik di bawah ini untuk menerima doa khusus bagi persatuan kita.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm border border-accent/20 rounded-xl shadow-lg p-8 md:p-12 min-h-[250px] flex flex-col justify-center items-center transition-all duration-500">
          {isLoading ? (
            <div className="flex flex-col items-center text-secondary">
              <Loader2 className="animate-spin" size={48} />
              <p className="mt-4 font-serif">Menerima Doa Untuk Kami..</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>{error}</p>
              <button
                onClick={handleGeneratePrayer}
                className="mt-4 px-6 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-secondary/90 transition duration-300"
              >
                Coba Lagi
              </button>
            </div>
          ) : prayer ? (
            <>
              {renderPrayer()}
              <button
                onClick={handleGeneratePrayer}
                className="mt-8 w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
              >
                <Sparkles className="mr-2" size={18} />
                Memulai Doa Lainnya
              </button>
            </>
          ) : (
            <button
              onClick={handleGeneratePrayer}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
            >
              <Sparkles className="mr-3" size={22} />
              Memulai Menerima doa
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PrayerDisplay;
