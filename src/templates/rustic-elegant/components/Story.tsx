import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import type { WeddingConfig } from "../hooks/useWeddingConfig";

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
  const { elementRef, isVisible } = useScrollAnimation();

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - touchStart;
    setOffset(diff);
    setTouchEnd(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    setOffset(0);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && currentSlide < stories.length - 1)
      setCurrentSlide(currentSlide + 1);
    if (distance < -minSwipeDistance && currentSlide > 0)
      setCurrentSlide(currentSlide - 1);
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
    if (distance > minSwipeDistance && currentSlide < stories.length - 1)
      setCurrentSlide(currentSlide + 1);
    if (distance < -minSwipeDistance && currentSlide > 0)
      setCurrentSlide(currentSlide - 1);
  };

  const nextSlide = () =>
    currentSlide < stories.length - 1 && setCurrentSlide(currentSlide + 1);
  const prevSlide = () =>
    currentSlide > 0 && setCurrentSlide(currentSlide - 1);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % stories.length),
      6000
    );
    return () => clearInterval(timer);
  }, [stories.length]);

  return (
    <div className="py-20 bg-gradient-to-b from-[#fffaf3] to-[#fff5e4] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-amber-800 mb-4">
            Kisah Cinta Kami
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px w-16 bg-amber-300/70"></div>
            <Heart className="text-amber-500" size={20} fill="currentColor" />
            <div className="h-px w-16 bg-amber-300/70"></div>
          </div>
        </div>

        <div
          ref={elementRef}
          className={`relative max-w-6xl mx-auto animate-on-scroll ${
            isVisible ? "visible" : ""
          }`}
        >
          {/* Carousel */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-3xl border border-amber-300/40 shadow-[0_0_30px_rgba(255,215,100,0.25)] bg-white/30 backdrop-blur-md cursor-grab active:cursor-grabbing transition-all duration-700"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: isDragging
                  ? `translateX(calc(-${currentSlide * 100}% + ${offset}px))`
                  : `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {stories.map((story, i) => (
                <div
                  key={i}
                  className="min-w-full flex flex-col md:flex-row items-center gap-10 p-10 md:p-14 bg-gradient-to-br from-white/50 to-amber-50/40"
                >
                  {/* Image */}
                  <div className="md:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-2xl blur-xl"></div>
                    <img
                      src={story.image}
                      alt={story.title}
                      className="relative w-full h-80 md:h-96 rounded-2xl object-cover shadow-xl border border-amber-200/40 transition-transform duration-700 hover:scale-105"
                      draggable="false"
                    />
                  </div>

                  {/* Text */}
                  <div className="md:w-1/2 text-center md:text-left bg-white/40 backdrop-blur-md border border-amber-300/40 rounded-2xl p-8 shadow-[0_0_20px_rgba(255,215,100,0.15)]">
                    <div className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-5 py-2 rounded-full text-sm font-medium mb-4 shadow-md">
                      {story.date}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-serif text-amber-800 mb-4">
                      {story.title}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
                      <div className="h-px w-12 bg-amber-400/60"></div>
                      <Heart
                        className="text-amber-500"
                        size={16}
                        fill="currentColor"
                      />
                      <div className="h-px w-12 bg-amber-400/60"></div>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 border border-amber-300/50 p-3 rounded-full shadow-lg transition-all duration-300 ${
                currentSlide === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:scale-110"
              }`}
            >
              <ChevronLeft className="text-amber-700" size={24} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === stories.length - 1}
              className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 border border-amber-300/50 p-3 rounded-full shadow-lg transition-all duration-300 ${
                currentSlide === stories.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:scale-110"
              }`}
            >
              <ChevronRight className="text-amber-700" size={24} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center items-center space-x-3 mt-8">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === i
                    ? "w-10 h-3 bg-gradient-to-r from-amber-500 to-yellow-400"
                    : "w-3 h-3 bg-amber-200 hover:bg-amber-300"
                }`}
              />
            ))}
          </div>

          {/* Progress */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="h-1 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{
                  width: `${((currentSlide + 1) / stories.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Hint */}
          <div className="text-center mt-6 text-sm text-amber-700/70 italic">
            <p className="animate-pulse">← Geser untuk melihat kisah selanjutnya →</p>
          </div>
        </div>
      </div>
    </div>
  );
}
