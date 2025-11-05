import React, { useState, useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface PrayerLetterProps {
  config: WeddingConfig;
}

const PrayerLetter: React.FC<PrayerLetterProps> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div className="relative py-20 bg-gradient-to-b from-[#0d1a33] via-[#1a2c55] to-[#223b6c] overflow-hidden">
      {/* efek cahaya lembut */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-2xl"
            style={{
              width: `${20 + Math.random() * 50}px`,
              height: `${20 + Math.random() * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* icon atas */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-slate-200/30 to-sky-300/30 p-6 rounded-full shadow-inner backdrop-blur-md animate-pulse-glow">
              <BookOpen className="text-sky-300" size={48} />
            </div>
          </div>

          <h2 className="py-5 text-4xl md:text-5xl font-serif text-slate-100 mb-4">
            Pesan dari Kami
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Terima kasih atas kehadiran dan doa terbaik Anda di hari bahagia kami.
            Semoga Tuhan membalas dengan limpahan berkah, rezeki, dan kebahagiaan untuk kita semua.
          </p>
        </div>

        {/* box utama */}
        <div
          ref={elementRef}
          className={`relative z-[30] max-w-4xl mx-auto backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* efek glow pinggir seperti RSVP */}
          <div className="absolute -inset-4 bg-gradient-to-r from-slate-300/20 via-sky-200/20 to-slate-100/10 rounded-3xl blur-2xl opacity-40" />

          <div className="relative text-left text-slate-100">
            <p className="text-lg leading-relaxed mb-6 font-serif italic text-slate-200">
              {config.prayerLetter.greeting}
            </p>
            <p className="leading-relaxed mb-4 text-slate-200">
              {config.prayerLetter.body1}
            </p>
            <p className="leading-relaxed mb-4 text-slate-200">
              {config.prayerLetter.body2}
            </p>
            <p className="leading-relaxed mb-6 text-slate-200">
              {config.prayerLetter.body3}
            </p>

            <div className="border-t border-slate-400/40 pt-6 mt-8 text-right">
              <p className="text-lg text-slate-100 leading-relaxed">
                {config.prayerLetter.closing}
              </p>
              <p className="font-serif text-3xl text-sky-300 mt-2">
                {config.couple.groom.name} & {config.couple.bride.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerLetter;
