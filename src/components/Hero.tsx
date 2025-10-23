import { ArrowDown, Sparkles, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const showcaseTemplates = [
  {
    id: 1,
    title: 'Elegant Rose',
    category: 'Elegant',
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'from-pink-400/30 to-purple-400/30',
  },
  {
    id: 2,
    title: 'Modern Minimalist',
    category: 'Minimalist',
    image: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'from-cyan-400/30 to-blue-400/30',
  },
  {
    id: 3,
    title: 'Classic Romance',
    category: 'Classic',
    image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'from-rose-400/30 to-pink-400/30',
  },
  {
    id: 4,
    title: 'Luxury Gold',
    category: 'Premium',
    image: 'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: 'from-amber-400/30 to-yellow-400/30',
  },
];

const floatingIcons = [
  { icon: Heart, delay: '0s', duration: '20s', x: '10%', y: '20%' },
  { icon: Star, delay: '2s', duration: '25s', x: '80%', y: '30%' },
  { icon: Sparkles, delay: '4s', duration: '22s', x: '15%', y: '70%' },
  { icon: Heart, delay: '6s', duration: '24s', x: '85%', y: '60%' },
  { icon: Star, delay: '3s', duration: '26s', x: '50%', y: '15%' },
  { icon: Sparkles, delay: '5s', duration: '23s', x: '60%', y: '80%' },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [offsetY, setOffsetY] = useState(0);

  // Auto play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseTemplates.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Scroll parallax listener
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY * 0.2);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % showcaseTemplates.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + showcaseTemplates.length) % showcaseTemplates.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section id="home" className="top-10 relative pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-smooth">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-purple-50 to-cyan-50" />

      {/* Floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="absolute opacity-20"
              style={{
                left: item.x,
                top: item.y,
                animation: `float ${item.duration} ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            >
              <Icon className="w-8 h-8 text-pink-400" />
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 lg:gap-x-12 items-center">
          {/* LEFT CONTENT */}
          <div className="text-center space-y-8 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-pink-200 shadow-sm transition hover:shadow-md">
              <Sparkles className="w-4 h-4 text-pink-500 animate-spin-slow" />
              <span className="text-sm font-semibold text-pink-600">
                Platform Undangan #1 di Indonesia
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-gray-800">
              Buat{' '}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                Website Pernikahan
              </span>{' '}
              Impianmu
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              Ciptakan undangan digital yang elegan dan tak terlupakan — cukup pilih template,
              sesuaikan, dan bagikan dengan mudah dalam hitungan menit.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#templates"
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold transition-all duration-500 hover:shadow-lg hover:scale-[1.04]"
              >
                <span className="span-hero1 flex items-center gap-2 relative z-10">
                  Jelajahi Template
                  <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              </a>

              <a
                href="#featured"
                className="px-8 py-4 rounded-full border-2 border-purple-400 text-purple-600 font-semibold transition-all duration-500 hover:bg-purple-500 hover:text-white hover:shadow-lg"
              >
                <span className="span-hero2 flex items-center gap-2">
                  Lihat Featured
                  <Star className="w-5 h-5" />
                </span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 max-w-md mx-auto">
              {[
                { num: '15+', text: 'Template Premium' },
                { num: '100%', text: 'Customizable' },
                { num: '24/7', text: 'Support' },
              ].map((item, idx) => (
                <div key={idx} className="text-center space-y-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {item.num}
                  </div>
                  <div className="text-sm text-gray-600">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT - PARALLAX CAROUSEL */}
          <div className="relative animate-fadeInRight">
            <div
              className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[580px] rounded-3xl overflow-hidden shadow-2xl group"
              style={{ transform: `translateY(${offsetY * 0.3}px)` }}
            >
              {showcaseTemplates.map((template, index) => (
                <div
                  key={template.id}
                  className={`absolute inset-0 transition-all duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95'
                  }`}
                >
                  <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${template.color} via-transparent to-transparent`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-sm">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-white/20 text-white rounded-full backdrop-blur-sm">
                      {template.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-2">{template.title}</h3>
                  </div>
                </div>
              ))}

              {/* Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
                {showcaseTemplates.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === currentSlide
                        ? 'w-8 h-2 bg-white'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center mt-12 lg:mt-8 animate-fadeIn mx-auto">
            <a href="#templates" aria-label="Scroll to templates">
              <span className="text-sm text-gray-500 font-medium mb-2 block">
                Gulir ke bawah
              </span>
              <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce mx-auto" />
            </a>
        </div>
      </div>

      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(8deg); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          animation: gradient 6s ease infinite;
          background-size: 200% 200%;
        }

        .animate-fadeInUp { animation: fadeInUp 1s ease-out; }
        .animate-fadeInRight { animation: fadeInRight 1s ease-out; }
        .animate-spin-slow { animation: spin 5s linear infinite; }
      `}</style>
    </section>
  );
}
