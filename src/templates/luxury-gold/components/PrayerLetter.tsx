
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
      {
        threshold: 0.1,
      }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="py-20 bg-[#FBF9F6]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-rose-100 to-orange-100 p-6 rounded-full animate-pulse-glow">
              <BookOpen className="text-rose-600" size={48} />
            </div>
          </div>
          <h2 className="py-5 text-4xl md:text-5xl font-serif text-gray-800 mb-4">Pesan dari Kami</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Terima kasih untukmu yang paling berharga sudah mempersempatkan waktu ke acara kami, semoga di berikan kesehatan, keberkahan, rejeki akan kalian dapatkan .
          </p>
        </div>

        <div
          ref={elementRef}
          className={`relative z-[30] max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-8 md:p-12 shadow-lg transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-left">
            <p className="text-lg text-gray-800 leading-relaxed mb-6 font-serif italic">
              Dearest Family and Friends,
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              As we stand on the threshold of our new life together, our hearts are overflowing with joy and gratitude. We are so blessed to be surrounded by your love and support, which has shaped us into the people we are today.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We kindly ask for your prayers as we begin our marriage. Pray that our love for each other will deepen with each passing day, rooted in patience, kindness, and understanding. Pray for wisdom to navigate the challenges that may come our way, and for a bond that is resilient and unbreakable.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              May our home be a sanctuary of peace, laughter, and love, reflecting the grace we have so freely received. Your spiritual support is a cornerstone upon which we hope to build our future, and we are eternally grateful for it.
            </p>
            <div className="border-t border-rose-200 pt-6 mt-8 text-right">
              <p className="text-lg text-gray-800 leading-relaxed">
                With love and gratitude,
              </p>
              <p className="font-serif text-3xl text-rose-600 mt-2">
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
