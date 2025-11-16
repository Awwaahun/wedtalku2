import { Heart, Instagram, Mail } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface CoupleProps {
  config: WeddingConfig;
}

export default function Couple({ config }: CoupleProps) {
  const { bride, groom } = config.couple;

  // Komponen Kartu Pasangan yang Ditingkatkan
  const CoupleCard = ({ person, reverse }: { person: typeof bride; reverse?: boolean }) => {
    // Asumsi hook useScrollAnimation sudah didefinisikan
    const { elementRef, isVisible } = useScrollAnimation(); 

    // Tentukan kelas animasi masuk:
    // Jika reverse (Groom), masuk dari KIRI (translate-x negatif)
    // Jika tidak reverse (Bride), masuk dari KANAN (translate-x positif)
    const startAnimationClass = reverse 
        ? 'opacity-0 -translate-x-24' // Groom (reverse=true) starts left
        : 'opacity-0 translate-x-24';  // Bride (reverse=false) starts right
        
    const endAnimationClass = 'opacity-100 translate-x-0';


    return (
      <div
        ref={elementRef}
        // Menggunakan logika animasi horizontal baru
        className={`flex flex-col ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } gap-8 md:gap-12 items-center transition-all duration-1000 ${
          isVisible ? endAnimationClass : startAnimationClass
        }`}
      >
        {/* Kolom Gambar */}
        <div className="md:w-5/12 relative flex justify-center">
          {/* Bingkai Ornamen Gambar (Ganti blur dengan border yang elegan) */}
          <div className="absolute inset-0 top-4 left-4 right-4 bottom-4 rounded-3xl border-4 border-amber-300/60 opacity-60 transition-transform duration-700 group-hover:scale-[1.03] group-hover:opacity-80 hidden md:block" />
          
          <img
            src={person.image}
            alt={person.name}
            // Gaya Gambar: Rounded yang lebih halus, shadow yang lebih dalam
            className="relative rounded-3xl w-full h-96 object-cover shadow-2xl shadow-black/20 border-4 border-white/50 transition-transform hover:scale-[1.02] duration-700 max-w-sm md:max-w-full"
          />
        </div>

        {/* Kolom Deskripsi */}
        <div 
          className="md:w-7/12 text-center md:text-left bg-white/90 p-8 sm:p-10 rounded-2xl 
            border border-amber-500/30 
            shadow-[0_10px_30px_rgba(180,120,40,0.1)] 
            transition-all duration-500 hover:shadow-[0_15px_40px_rgba(180,120,40,0.2)]"
        >
          
          <p className="text-sm uppercase tracking-widest font-medium text-slate-600 mb-2">{person.role}</p>
          
          {/* Nama: Lebih Besar, Emas Gradien */}
          <h3 className="text-5xl md:text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800 mb-2 drop-shadow-sm">
            {person.name}
          </h3>
          
          <p className="text-xl text-gray-700 mb-4 font-script italic">{person.fullName}</p> 

          {/* Garis Dekoratif Tengah */}
          <div className={`flex items-center space-x-3 mb-6 ${reverse ? 'md:justify-end' : 'md:justify-start'} justify-center`}>
            <div className="h-px w-10 bg-slate-400" />
            <Heart className="text-slate-500" size={18} fill="currentColor" />
            <div className="h-px w-10 bg-slate-400" />
          </div>

          <p className="text-gray-700 leading-relaxed mb-4 text-base italic">{person.bio}</p>
          <p className="text-gray-500 italic mb-6 text-sm">{person.parents}</p>

          {/* Social Media Link: Lebih Rapi */}
          <div className={`flex items-center space-x-6 pt-4 border-t border-slate-200 ${reverse ? 'md:justify-end' : 'md:justify-start'} justify-center`}>
            {person.instagram && (
              <a
                href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-600 hover:text-amber-900 transition-colors group"
              >
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{person.instagram}</span>
              </a>
            )}
            {person.email && (
              <a
                href={`mailto:${person.email}`}
                className="flex items-center space-x-2 text-slate-600 hover:text-amber-900 transition-colors group"
              >
                <Mail size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Kirim Pesan</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    // Latar Belakang: Gradien Krem yang Lebih Lembut
    <div className="py-20 silver-section bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="container mx-auto px-4">
        
        {/* Judul Bagian */}
        <div className="text-center mb-16">
          <p className="text-lg text-slate-500 font-script italic mb-1">Our Journey Begins</p>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-700 mb-4">
            Perkenalkan Kami
          </h2>
          <p className="text-gray-600 text-sm tracking-wider uppercase">Dua Jiwa, Satu Hati, Satu Tujuan</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Bride Card (reverse=false) - Masuk dari KANAN */}
          <CoupleCard person={bride} />

          {/* Divider Jantung yang Lebih Berkelas */}
          <div className="flex justify-center">
            <div className="relative bg-slate-100 border border-slate-300 rounded-full p-4 shadow-xl shadow-slate-400/20 transition-transform duration-500 hover:scale-110">
              <Heart className="text-slate-600" size={36} fill="currentColor" />
              <div className="absolute inset-0 rounded-full border-4 border-double border-slate-400/40 animate-ping-slow pointer-events-none" />
            </div>
          </div>

          {/* Groom Card (reverse=true) - Masuk dari KIRI */}
          <CoupleCard person={groom} reverse />
        </div>
      </div>

      <style>
        {`
          /* Custom Font Fallback/Class */
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-script { font-family: 'Great Vibes', cursive; }

          /* Animasi Ping Lambat */
          @keyframes ping-slow {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          .animate-ping-slow {
            animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
        `}
      </style>
    </div>
  );
}