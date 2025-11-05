
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
        } gap-8 items-center animate-on-scroll ${isVisible ? 'visible' : ''}`}
      >
        <div className="md:w-5/12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-orange-400 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
            <img
              src={person.image}
              alt={person.name}
              className="relative rounded-2xl w-full h-96 object-cover shadow-xl transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="md:w-7/12 text-center md:text-left">
          <p className="text-rose-500 font-medium mb-2">{person.role}</p>
          <h3 className="text-4xl md:text-5xl font-serif text-gray-800 mb-2">{person.name}</h3>
          <p className="text-xl text-gray-600 mb-4 font-light">{person.fullName}</p>

          <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
            <div className="h-px w-12 bg-gray-300"></div>
            <Heart className="text-rose-400" size={16} fill="currentColor" />
            <div className="h-px w-12 bg-gray-300"></div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">{person.bio}</p>

          <p className="text-gray-500 italic mb-6">{person.parents}</p>

          <div className="flex items-center justify-center md:justify-start space-x-4">
            <a
              href={`https://instagram.com/${person.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-rose-500 transition-colors"
            >
              <Instagram size={20} />
              <span className="text-sm">{person.instagram}</span>
            </a>
            <a
              href={`mailto:${person.email}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-rose-500 transition-colors"
            >
              <Mail size={20} />
              <span className="text-sm">{person.email}</span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-20 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Perkenalkan Kami</h2>
          <p className="text-gray-600">Dua Jiwa, Satu Hati</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-20">
          <CoupleCard person={bride} />

          <div className="flex justify-center">
            <div className="bg-white rounded-full p-6 shadow-lg animate-pulse-glow">
              <Heart className="text-rose-500" size={48} fill="currentColor" />
            </div>
          </div>

          <CoupleCard person={groom} reverse />
        </div>
      </div>
    </div>
  );
}
