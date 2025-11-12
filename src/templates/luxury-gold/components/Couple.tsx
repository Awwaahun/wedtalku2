import { Heart, Instagram, Mail } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface CoupleProps {
  config: WeddingConfig;
}

export default function Couple({ config }: CoupleProps) {
  const { bride, groom } = config.couple;

  const CoupleCard = ({ person, reverse }: { person: typeof bride; reverse?: boolean }) => {
    const { elementRef, isVisible } = useScrollAnimation();

    return (
      <div
        ref={elementRef}
        className={`flex flex-col ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } gap-10 items-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="md:w-5/12 relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-100/20 blur-xl"></div>
          <img
            src={person.image}
            alt={person.name}
            className="relative rounded-2xl w-full h-96 object-cover shadow-xl border border-amber-200/40 backdrop-blur-sm transition-transform hover:scale-105 duration-700"
          />
        </div>

        <div className="md:w-7/12 text-center md:text-left bg-white/30 backdrop-blur-md border border-amber-300/50 p-8 rounded-2xl shadow-[0_0_30px_rgba(255,215,100,0.2)]">
          <p className="text-amber-600 font-medium mb-2">{person.role}</p>
          <h3 className="text-4xl md:text-5xl font-serif text-amber-800 mb-2">{person.name}</h3>
          <p className="text-lg text-gray-600 mb-4 italic">{person.fullName}</p>

          <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
            <div className="h-px w-12 bg-amber-400/70"></div>
            <Heart className="text-amber-500" size={16} fill="currentColor" />
            <div className="h-px w-12 bg-amber-400/70"></div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">{person.bio}</p>
          <p className="text-gray-500 italic mb-6">{person.parents}</p>

          <div className="flex items-center justify-center md:justify-start space-x-4">
            {person.instagram && (
              <a
                href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Instagram size={20} />
                <span className="text-sm">{person.instagram}</span>
              </a>
            )}
            {person.email && (
              <a
                href={`mailto:${person.email}`}
                className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors"
              >
                <Mail size={20} />
                <span className="text-sm">{person.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-20 bg-gradient-to-br from-[#fff9ef] via-[#fff8e9] to-[#fff5dc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-amber-800 mb-4">
            Perkenalkan Kami
          </h2>
          <p className="text-gray-600">Dua Jiwa, Satu Hati</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-20">
          <CoupleCard person={bride} />

          <div className="flex justify-center">
            <div className="bg-white/40 backdrop-blur-md border border-amber-300/40 rounded-full p-6 shadow-[0_0_25px_rgba(255,215,100,0.3)] animate-pulse-gold">
              <Heart className="text-amber-500" size={48} fill="currentColor" />
            </div>
          </div>

          <CoupleCard person={groom} reverse />
        </div>
      </div>
    </div>
  );
}
