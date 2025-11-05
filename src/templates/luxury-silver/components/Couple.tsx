import { Heart, Instagram, Mail, Sparkles, Quote } from 'lucide-react';
import { useState } from 'react';

const Couple = ({ config }) => {
  const { bride, groom } = config?.couple || {};
  const [activeCard, setActiveCard] = useState(null);

  const CoupleCard = ({ person, reverse, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePosition({ x, y });
    };

    return (
      <div
        className={`flex flex-col ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } gap-8 md:gap-12 items-center mb-20`}
        onMouseEnter={() => setActiveCard(index)}
        onMouseLeave={() => setActiveCard(null)}
      >
        {/* Image Section */}
        <div className="md:w-5/12 w-full">
          <div
            className="relative group perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#0b132b] to-[#3a506b] rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />

            {/* Frame Border */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c2541] via-[#3a506b] to-[#5bc0be] rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-700" />

            {/* Image */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 border-4 border-[#c5c6c7]/30"
              style={{
                transform: isHovered
                  ? `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg) scale(1.05)`
                  : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)',
              }}
            >
              <img
                src={
                  person?.image ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
                }
                alt={person?.name}
                className="w-full h-[480px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Heart Decoration */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-[#0b132b] to-[#3a506b] p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500">
              <Heart size={28} fill="#c5c6c7" className="text-[#c5c6c7]" />
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="md:w-7/12 w-full">
          <div
            className={`text-center md:text-${
              reverse ? 'right' : 'left'
            } space-y-6`}
          >
            {/* Quote */}
            <div
              className={`flex ${
                reverse
                  ? 'justify-center md:justify-end'
                  : 'justify-center md:justify-start'
              }`}
            >
              <div className="bg-gradient-to-br from-[#1c2541] to-[#3a506b] p-4 rounded-2xl shadow-lg">
                <Quote className="text-[#5bc0be]" size={28} />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-3">
              <p className="text-[#5bc0be] font-semibold text-lg tracking-wider uppercase">
                {person?.role}
              </p>
              <h3 className="text-5xl md:text-6xl font-serif text-[#e0e0e0] mb-2 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#5bc0be] hover:to-[#c5c6c7] transition-all duration-300">
                {person?.name}
              </h3>
              <p className="text-2xl text-[#c5c6c7]/90 font-light">
                {person?.fullName}
              </p>
            </div>

            {/* Bio Box */}
            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)] transition-all duration-300">
              <p className="text-[#e0e0e0] leading-relaxed text-lg">
                {person?.bio}
              </p>
            </div>

            {/* Parents */}
            <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <p className="text-[#c5c6c7] italic text-sm mb-2">
                Putri/Putra dari:
              </p>
              <p className="text-white font-medium text-lg">
                {person?.parents}
              </p>
            </div>

            {/* Social */}
            <div
              className={`flex items-center gap-4 ${
                reverse
                  ? 'justify-center md:justify-end'
                  : 'justify-center md:justify-start'
              }`}
            >
              <a
                href={`https://instagram.com/${
                  person?.instagram?.replace('@', '') || ''
                }`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-gradient-to-r from-[#1c2541] to-[#3a506b] hover:from-[#3a506b] hover:to-[#5bc0be] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Instagram size={20} />
                <span className="font-medium">{person?.instagram}</span>
              </a>
              <a
                href={`mailto:${person?.email || ''}`}
                className="group bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 transition-all duration-300"
              >
                <Mail className="text-[#5bc0be]" size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white">
      {/* Floating Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-[#c5c6c7]/15 animate-float"
            size={24 + Math.random() * 20}
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
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full shadow-lg border border-white/20 mb-6">
            <Heart className="text-[#5bc0be]" size={24} fill="currentColor" />
            <span className="text-[#c5c6c7] font-semibold">
              Our Love Story
            </span>
            <Heart className="text-[#5bc0be]" size={24} fill="currentColor" />
          </div>

          <h2 className="text-5xl md:text-7xl font-serif text-white mb-6 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#5bc0be] hover:to-[#c5c6c7] transition-all duration-500">
            Perkenalkan Kami
          </h2>

          <p className="text-[#c5c6c7]/90 text-xl max-w-2xl mx-auto leading-relaxed">
            Dua Jiwa, Satu Hati, Satu Tujuan
          </p>
        </div>

        {/* Couple Cards */}
        <div className="max-w-7xl mx-auto space-y-20">
          <CoupleCard person={bride} index={0} />

          {/* Center Divider */}
          <div className="flex justify-center my-20">
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-full shadow-2xl border border-white/20 transform hover:scale-110 hover:rotate-12 transition-all duration-500">
                <Heart className="text-[#5bc0be]" size={64} fill="currentColor" />
              </div>
            </div>
          </div>

          <CoupleCard person={groom} reverse index={1} />
        </div>

        {/* Bottom Quote */}
        <div className="mt-24 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-3xl px-12 py-8 shadow-2xl border border-white/20 max-w-3xl">
            <Quote className="text-[#5bc0be] mx-auto mb-4" size={40} />
            <p className="text-2xl md:text-3xl font-serif text-[#c5c6c7] italic leading-relaxed">
              "Cinta sejati tidak pernah berjalan mulus, namun dengan kasih
              sayang dan pengertian, kami siap menghadapi segalanya bersama"
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Heart
                className="text-[#5bc0be]"
                size={20}
                fill="currentColor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Couple;
