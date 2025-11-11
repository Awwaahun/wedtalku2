
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

type Image = WeddingConfig['gallery'][number];
type FilterType = 'all' | 'portrait' | 'landscape';

interface GalleryItemProps {
  image: Image;
  index: number;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image, index, onClick }) => {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={`relative z-[30] backdrop-blur-sm group rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 animate-on-scroll ${
        isVisible ? 'visible' : ''
      } ${image.type === 'portrait' ? 'md:row-span-2' : ''}`}
      onClick={onClick}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white">
          <h3 className="text-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">{image.title}</h3>
          <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Click to view</p>
        </div>
      </div>
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-out delay-100">
        <Maximize2 size={16} className="text-rose-600" />
      </div>
    </div>
  );
};

interface GalleryProps {
  config: WeddingConfig;
}

export default function Gallery({ config }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState<FilterType>('all');
  
  const images = config.gallery;

  const filteredImages = filter === 'all' ? images : images.filter(img => img.type === filter);

  const resetZoomAndPosition = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (selectedImage === null) {
      resetZoomAndPosition();
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [selectedImage, resetZoomAndPosition]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleInteractionStart = (clientX: number, clientY: number) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: clientX - position.x, y: clientY - position.y });
    }
  };
  
  const handleInteractionMove = (clientX: number, clientY: number) => {
    if (isDragging && scale > 1) {
      setPosition({ x: clientX - dragStart.x, y: clientY - dragStart.y });
    }
  };

  const handleInteractionEnd = () => setIsDragging(false);

  const handleMouseDown = (e: React.MouseEvent) => handleInteractionStart(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) => handleInteractionMove(e.clientX, e.clientY);
  const handleTouchStart = (e: React.TouchEvent) => e.touches.length === 1 && handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => e.touches.length === 1 && handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);

  const nextImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : prev));
      resetZoomAndPosition();
    }
  }, [selectedImage, filteredImages.length, resetZoomAndPosition]);

  const prevImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      resetZoomAndPosition();
    }
  }, [selectedImage, resetZoomAndPosition]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImage === null) return;
    
    switch(e.key) {
      case 'ArrowRight': nextImage(); break;
      case 'ArrowLeft': prevImage(); break;
      case 'Escape': setSelectedImage(null); break;
      case '+':
      case '=': handleZoomIn(); break;
      case '-': handleZoomOut(); break;
    }
  }, [selectedImage, nextImage, prevImage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-serif text-gray-800 mb-4">Momen Bersama</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Koleksi momen-momen yang diabadikan, masing-masing menceritakan kisah cinta dan hubungan yang unik.</p>
        </div>
        
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {(['all', 'portrait', 'landscape'] as FilterType[]).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-5 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                filter === filterType
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-fr gap-4 max-w-7xl mx-auto">
          {filteredImages.map((image, index) => (
            <GalleryItem key={image.url} image={image} index={index} onClick={() => setSelectedImage(index)} />
          ))}
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Showing {filteredImages.length} of {images.length} photos</p>
        </div>
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
            <button onClick={(e) => { e.stopPropagation(); handleZoomOut(); }} disabled={scale <= 1} className="p-3 rounded-full text-white bg-black/30 backdrop-blur-lg hover:bg-white/20 transition disabled:opacity-50"><ZoomOut size={20} /></button>
            <button onClick={(e) => { e.stopPropagation(); handleZoomIn(); }} disabled={scale >= 3} className="p-3 rounded-full text-white bg-black/30 backdrop-blur-lg hover:bg-white/20 transition disabled:opacity-50"><ZoomIn size={20} /></button>
            <a href={filteredImages[selectedImage].url} download onClick={(e) => e.stopPropagation()} className="p-3 rounded-full text-white bg-black/30 backdrop-blur-lg hover:bg-white/20 transition"><Download size={20} /></a>
            <button onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }} className="p-3 rounded-full text-white bg-black/30 backdrop-blur-lg hover:bg-rose-500 transition"><X size={20} /></button>
          </div>

          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} disabled={selectedImage === 0} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white bg-black/30 backdrop-blur-lg hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed z-20"><ChevronLeft size={32} /></button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} disabled={selectedImage === filteredImages.length - 1} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white bg-black/30 backdrop-blur-lg hover:bg-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed z-20"><ChevronRight size={32} /></button>

          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <img
              key={selectedImage}
              src={filteredImages[selectedImage].url}
              alt={filteredImages[selectedImage].title}
              className="max-w-[90vw] max-h-[90vh] object-contain animate-scale-in select-none rounded-lg shadow-2xl"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleInteractionEnd}
              onMouseLeave={handleInteractionEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleInteractionEnd}
              draggable={false}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center z-20">
            <p className="font-semibold text-lg">{filteredImages[selectedImage].title}</p>
            <p className="text-sm opacity-80">{selectedImage + 1} / {filteredImages.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
