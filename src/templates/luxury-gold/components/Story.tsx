
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

  const { elementRef, isVisible } = useScrollAnimation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [stories.length]);

  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Kisah Cinta Kami</h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px w-16 bg-gray-300"></div>
            <Heart className="text-rose-500" size={20} fill="currentColor" />
            <div className="h-px w-16 bg-gray-300"></div>
          </div>
        </div>

        <div 
          ref={elementRef}
          className={`relative z-[30] max-w-6xl mx-auto relative animate-on-scroll ${isVisible ? 'visible' : ''}`}
        >
          {/* Carousel Container */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: isDragging 
                  ? `translateX(calc(-${currentSlide * 100}% + ${offset}px))`
                  : `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {stories.map((story, index) => (
                <div
                  key={index}
                  className="min-w-full flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50"
                >
                  {/* Image Section */}
                  <div className="md:w-1/2 w-full">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-orange-400 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                      <img
                        src={story.image}
                        alt={story.title}
                        className="relative rounded-2xl w-full h-80 md:h-96 object-cover shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                        draggable="false"
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-1/2 w-full text-center md:text-left">
                    <div className="inline-block bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                      {story.date}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-serif text-gray-800 mb-6">
                      {story.title}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
                      <div className="h-px w-12 bg-gray-300"></div>
                      <Heart className="text-rose-400" size={16} fill="currentColor" />
                      <div className="h-px w-12 bg-gray-300"></div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10 ${
                currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
              }`}
            >
              <ChevronLeft className="text-gray-800" size={24} />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentSlide === stories.length - 1}
              className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 z-10 ${
                currentSlide === stories.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
              }`}
            >
              <ChevronRight className="text-gray-800" size={24} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center space-x-3 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? 'w-12 h-3 bg-rose-500'
                    : 'w-3 h-3 bg-gray-300 hover:bg-rose-300'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-500"
                style={{ width: `${((currentSlide + 1) / stories.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Swipe Hint */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p className="animate-pulse">← Swipe or drag to explore →</p>
          </div>
        </div>
      </div>
    </div>
  );
}
