import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface CountdownProps {
  config: WeddingConfig;
}

export default function Countdown({ config }: CountdownProps) {
  // Mengambil tanggal dan waktu dari config
  const weddingDate = new Date(`${config.wedding.date}T${config.wedding.time}`).getTime();

  const [timeLeft, setTimeLeft] = useState({
    Hari: 0,
    Jam: 0,
    Menit: 0,
    Detik: 0,
  });

  // Logic Hitung Mundur
  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const diff = weddingDate - now;

      // Jika waktu sudah lewat, tetapkan ke 0
      if (diff <= 0) {
        setTimeLeft({ Hari: 0, Jam: 0, Menit: 0, Detik: 0 });
        return;
      }

      setTimeLeft({
        Hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
        Jam: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        Menit: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        Detik: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="relative py-20 overflow-hidden"> 
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed" // bg-fixed untuk parallax sederhana
        style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
      />
      
      {/* Overlay: Gelap/Krem Transparan untuk Kontras Teks */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fefbf5]/90 via-[#f9f4ec]/85 to-[#f7f0e7]/90 backdrop-blur-[1px]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        
        {/* Ikon dan Judul */}
        <Clock size={48} className="mx-auto mb-4 text-amber-700/90 drop-shadow-md" />
        <h2 className="text-3xl md:text-4xl font-serif text-amber-900 mb-12 tracking-wide font-medium drop-shadow-sm">
          Menghitung Mundur Menuju Hari Bahagia
        </h2>

        {/* Kotak Hitung Mundur */}
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <div
              key={unit}
              className="
                relative 
                bg-white/80 
                border-2 border-amber-500/50 
                rounded-xl 
                p-6 md:p-8 
                w-24 md:w-32 
                text-amber-900 
                shadow-xl shadow-amber-900/10 
                transition-all duration-300 
                hover:shadow-2xl hover:scale-[1.03]
                animate-fade-in-up
              "
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Nilai Waktu */}
              <div className="text-4xl md:text-6xl font-playfair font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 drop-shadow-md">
                {value.toString().padStart(2, '0')}
              </div>
              
              {/* Unit Waktu */}
              <div className="text-sm md:text-base uppercase tracking-widest font-medium text-gray-700/90">
                {unit}
              </div>
              
              {/* Dekorasi Sudut (Filigree Sederhana) */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-500/80 rounded-tl-lg" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-500/80 rounded-br-lg" />
            </div>
          ))}
        </div>
      </div>
      
      {/* CSS Khusus untuk Animasi dan Font */}
      <style>
        {`
          .font-playfair { font-family: 'Playfair Display', serif; }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0; /* Pastikan mulai dari tak terlihat */
          }
        `}
      </style>
    </div>
  );
}