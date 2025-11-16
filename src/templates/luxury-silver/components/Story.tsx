import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface StoryProps {
  config: WeddingConfig;
}

export default function Story({ config }: StoryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const stories = config.story;

  const minSwipeDistance = 50;

  // --- Handlers for Swipe/Drag (TIDAK BERUBAH) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.touches[0].clientX;
    const diff = currentTouch - touchStart;
    setOffset(diff);
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setOffset(0);

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < stories.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - touchStart;
    setOffset(diff);
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setOffset(0);

    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < stories.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const nextSlide = () => {
    if (currentSlide < stories.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  // --- End Handlers ---

  const { elementRef, isVisible } = useScrollAnimation();

  // Auto-slide logic (dipertahankan)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [stories.length]);

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed" // bg-fixed untuk parallax sederhana
        style={{ backgroundImage: `url(${config.hero.backgroundImage})` }}
      />
      
      {/* Overlay: Gelap/Krem Transparan untuk Kontras Teks */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fefbf5]/90 via-[#f9f4ec]/85 to-[#f7f0e7]/90 backdrop-blur-[1px]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-lg text-amber-600 font-script italic mb-1 drop-shadow-sm">Our Milestones</p>
          <h2 className="text-4xl md:text-5xl font-playfair font-extrabold text-amber-900 mb-4 drop-shadow-md">
            Kisah Cinta Kami
          </h2>
          {/* Divider bertema emas */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px w-16 bg-amber-400/70"></div>
            <Heart className="text-amber-700 drop-shadow-sm" size={20} fill="currentColor" />
            <div className="h-px w-16 bg-amber-400/70"></div>
          </div>
        </div>

        <div 
          ref={elementRef}
          className={`relative z-20 max-w-6xl mx-auto transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Carousel Container: Lebih Mewah */}
          <div
            ref={containerRef}
            // Shadow dan Border Lebih Kuat & Ganda
            className="relative overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(31,30,26,0.2)] cursor-grab active:cursor-grabbing border-4 border-double border-amber-400/70"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="flex transition-transform duration-700 ease-out" // Durasi transisi diperlambat sedikit
              style={{
                transform: isDragging 
                  ? `translateX(calc(-${currentSlide * 100}% + ${offset}px))`
                  : `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {stories.map((story, index) => (
                <div
                  key={index}
                  // Latar belakang slide dengan subtle gradient
                  className="min-w-full flex flex-col md:flex-row items-center gap-10 p-10 md:p-16 bg-white/95"
                >
                  {/* Image Section */}
                  <div className="md:w-1/2 w-full order-1 md:order-none">
                    <div className="relative group">
                      {/* Bingkai Emas dengan Posisi yang sedikit offset */}
                      <div className="absolute inset-4 bg-amber-400/50 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500 shadow-md"></div>
                      <img
                        src={story.image}
                        alt={story.title}
                        // Gambar lebih menonjol dengan border ganda
                        className="relative rounded-2xl w-full h-80 md:h-96 object-cover shadow-2xl shadow-black/30 border-4 border-amber-100/80 transform group-hover:scale-[1.03] transition-transform duration-500"
                        draggable="false"
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-1/2 w-full text-center md:text-left order-2 md:order-none">
                    {/* Badge Tanggal dengan efek 3D */}
                    <div className="inline-block bg-amber-700 text-white px-5 py-2 rounded-full text-sm font-medium mb-4 shadow-lg border-b-4 border-amber-900/50 uppercase tracking-widest">
                      {story.date}
                    </div>
                    {/* Judul dengan Gradien Emas Penuh */}
                    <h3 className="text-4xl md:text-5xl font-playfair font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 mb-6 drop-shadow-md">
                      {story.title}
                    </h3>
                    {/* Divider bertema emas */}
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
                      <div className="h-px w-12 bg-amber-500/80"></div>
                      <Heart className="text-amber-700 drop-shadow-sm" size={18} fill="currentColor" />
                      <div className="h-px w-12 bg-amber-500/80"></div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed italic border-l-4 border-amber-300/80 pl-4">
                      {story.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows: Lebih Mewah (Tombol Besar, Sudut Penuh, Warna Solid) */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-amber-800/80 hover:bg-amber-700 p-4 rounded-r-full shadow-2xl transition-all duration-300 z-30 ${
                currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-x-105 text-white'
              }`}
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === stories.length - 1}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-amber-800/80 hover:bg-amber-700 p-4 rounded-l-full shadow-2xl transition-all duration-300 z-30 ${
                currentSlide === stories.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-x-105 text-white'
              }`}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Dots Indicator: Lebih Interaktif */}
          <div className="flex justify-center items-center space-x-3 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full border border-amber-300 shadow-md ${
                  currentSlide === index
                    ? 'w-10 h-3 bg-amber-700 dot-active-pulse' // Efek pulse pada dot aktif
                    : 'w-3 h-3 bg-amber-300 hover:bg-amber-500' 
                }`}
              />
            ))}
          </div>

          {/* Progress Bar: Lebih Tebal */}
          <div className="mt-6 max-w-sm mx-auto">
            <div className="h-2 bg-amber-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-800 transition-all duration-700"
                style={{ width: `${((currentSlide + 1) / stories.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Swipe Hint */}
          <div className="text-center mt-6 text-sm text-amber-800/90 tracking-wider">
            <p className="animate-pulse-slow">← Swipe or drag to explore →</p>
          </div>
        </div>
      </div>
      
      {/* CSS Khusus untuk Font dan Animasi */}
      <style>
        {`
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-script { font-family: 'Great Vibes', cursive; }

          /* Animasi Pulse Lambat untuk Swipe Hint */
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          /* Animasi Pulse Cepat untuk Dot Aktif */
          @keyframes dot-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .dot-active-pulse {
            animation: dot-pulse 1.5s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}