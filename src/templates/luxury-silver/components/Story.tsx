import { Heart, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const Story = ({ config }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState('next');
  
  const stories = config?.story || [];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setDirection('next');
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [stories.length, isAutoPlaying]);

  const nextSlide = () => {
    setDirection('next');
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setDirection('prev');
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 'next' : 'prev');
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  return (
    <div className="relative py-24 md:py-32 bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#3a506b] text-white overflow-hidden">
      {/* Floating Decorative Hearts & Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          i % 2 === 0 ? (
            <Heart
              key={i}
              className="absolute text-[#c5c6c7]/20 animate-float"
              size={20 + Math.random() * 20}
              fill="currentColor"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ) : (
            <Sparkles
              key={i}
              className="absolute text-[#c5c6c7]/30 animate-ping"
              size={15 + Math.random() * 10}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          )
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 shadow-lg mb-6 border border-white/20">
            <Heart size={20} fill="#c5c6c7" />
            <span className="font-semibold text-[#c5c6c7]">Our Journey</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif mb-6 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#5bc0be] hover:to-[#c5c6c7] transition-all duration-500">
            Kisah Cinta Kami
          </h2>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#5bc0be]/50 to-transparent rounded-full" />
            <Heart className="text-[#5bc0be]" size={24} fill="currentColor" />
            <div className="h-1 w-24 bg-gradient-to-l from-transparent via-[#5bc0be]/50 to-transparent rounded-full" />
          </div>

          <p className="text-[#c5c6c7]/90 text-xl">Setiap bab membawa kami lebih dekat</p>
        </div>

        {/* Main Carousel */}
        <div className="max-w-7xl mx-auto relative">
          <div className="relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
            {stories.map((story, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 scale-100'
                    : direction === 'next'
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="relative h-full flex flex-col md:flex-row bg-gradient-to-br from-[#1c2541] via-[#0b132b] to-[#3a506b] rounded-3xl overflow-hidden">
                  {/* Image Section */}
                  <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden group">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                  </div>

                  {/* Content Section */}
                  <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="relative z-10">
                      {/* Date Badge */}
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-[#c5c6c7] rounded-full px-6 py-3 shadow-lg mb-6 border border-white/20">
                        <Calendar size={18} />
                        <span className="font-semibold text-sm">{story.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight text-[#c5c6c7]">
                        {story.title}
                      </h3>

                      {/* Decorative Line */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-1 w-16 bg-gradient-to-r from-[#5bc0be]/50 to-transparent rounded-full" />
                        <Heart className="text-[#5bc0be]" size={20} fill="currentColor" />
                        <div className="h-1 w-16 bg-gradient-to-l from-[#5bc0be]/50 to-transparent rounded-full" />
                      </div>

                      {/* Description Box */}
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
                        <p className="text-[#c5c6c7] text-lg md:text-xl leading-relaxed">{story.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="text-[#c5c6c7]" size={28} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="text-[#c5c6c7]" size={28} />
          </button>

          {/* Dots */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? 'w-16 h-4 bg-gradient-to-r from-[#5bc0be] to-[#c5c6c7] shadow-lg'
                    : 'w-4 h-4 bg-[#c5c6c7]/30 hover:bg-[#5bc0be]/50 hover:scale-125'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="max-w-3xl mx-auto mt-6">
            <div className="h-2 bg-[#c5c6c7]/30 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#5bc0be] to-[#c5c6c7] transition-all duration-300 relative"
                style={{ width: `${((currentSlide + 1) / stories.length) * 100}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/30" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-[#c5c6c7]/70">
              <span>Chapter {currentSlide + 1}</span>
              <span>{stories.length} Chapters</span>
            </div>
          </div>

          {/* Auto Play Control */}
          <div className="text-center mt-8">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 border border-white/20"
            >
              <div className={`w-3 h-3 rounded-full ${isAutoPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium text-[#c5c6c7]">
                {isAutoPlaying ? 'Auto Playing' : 'Paused'}
              </span>
            </button>
          </div>

          {/* Swipe Hint */}
          <div className="text-center mt-8">
            <p className="text-[#c5c6c7]/50 text-sm animate-pulse">
              ← Swipe atau gunakan tombol navigasi →
            </p>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="max-w-7xl mx-auto mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-serif mb-8 text-center text-[#c5c6c7]">Timeline Perjalanan Kami</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.map((story, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    currentSlide === index 
                      ? 'ring-4 ring-[#5bc0be]/50 shadow-2xl scale-105' 
                      : 'hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-xs font-semibold mb-1">{story.date}</p>
                      <p className="text-white font-serif text-lg">{story.title}</p>
                    </div>

                    {currentSlide === index && (
                      <div className="absolute top-4 right-4 bg-[#5bc0be] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        Now Playing
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
