import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download, Heart, Sparkles, Grid3x3, Images } from 'lucide-react';

const Gallery = ({ config }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState('all');
  const [layout, setLayout] = useState('masonry');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = config?.gallery || [];
  const filteredImages = filter === 'all' ? images : images.filter(img => img.type === filter);

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedImage]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };

  const nextImage = () => {
    if (selectedImage !== null && selectedImage < filteredImages.length - 1) {
      setSelectedImage(selectedImage + 1);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const GalleryItem = ({ image, index }) => (
    <div
      className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${
        image.type === 'portrait' && layout === 'masonry' ? 'row-span-2' : ''
      }`}
      onClick={() => setSelectedImage(index)}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="relative w-full h-full overflow-hidden bg-slate-800">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Hover Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="text-white text-xl font-semibold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {image.title}
          </h3>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            <Maximize2 size={18} className="text-white" />
            <span className="text-white text-sm">Click to view</span>
          </div>
        </div>

        {/* Top Corner Badge */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <span className="text-xs font-semibold text-sky-400 uppercase">{image.type}</span>
          </div>
        </div>

        {/* Sparkle Effect */}
        {hoveredIndex === index && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-sky-400 animate-ping"
                size={15}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Heart Icon */}
        <div className="absolute top-4 left-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
          <div className="bg-sky-500 p-2 rounded-full shadow-lg">
            <Heart size={16} fill="white" className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-24 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-400 text-white rounded-full px-6 py-3 shadow-xl mb-6">
            <Images size={20} />
            <span className="font-semibold">Photo Gallery</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-slate-100 mb-4">
            Momen Bersama
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-slate-400" />
            <Heart className="text-sky-400" size={24} fill="currentColor" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-slate-400" />
          </div>

          <p className="text-slate-300 text-xl max-w-2xl mx-auto">
            Koleksi momen-momen yang diabadikan, masing-masing menceritakan kisah cinta kami
          </p>
        </div>

        {/* Filters & Layout Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {['all', 'portrait', 'landscape'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-lg scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 shadow-sm hover:scale-105'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-slate-800 rounded-full p-2 shadow-lg">
            <button
              onClick={() => setLayout('masonry')}
              className={`p-3 rounded-full transition-all duration-300 ${
                layout === 'masonry' 
                  ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-md' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
              title="Masonry Layout"
            >
              <Grid3x3 size={20} />
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={`p-3 rounded-full transition-all duration-300 ${
                layout === 'grid' 
                  ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-md' 
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
              title="Grid Layout"
            >
              <Images size={20} />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`grid gap-4 max-w-7xl mx-auto ${
          layout === 'masonry' 
            ? 'grid-cols-2 md:grid-cols-4 auto-rows-[200px]' 
            : 'grid-cols-1 md:grid-cols-3 auto-rows-[300px]'
        }`}>
          {filteredImages.map((image, index) => (
            <GalleryItem key={index} image={image} index={index} />
          ))}
        </div>

        {/* Stats */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-slate-800 rounded-2xl px-8 py-4 shadow-lg">
            <div className="flex items-center gap-2">
              <Heart className="text-sky-400" size={20} fill="currentColor" />
              <span className="text-sm font-medium text-slate-300">
                Showing {filteredImages.length} of {images.length} photos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full p-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
              disabled={scale <= 1}
              className="p-3 rounded-full text-white hover:bg-white/20 transition disabled:opacity-30"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
              disabled={scale >= 3}
              className="p-3 rounded-full text-white hover:bg-white/20 transition disabled:opacity-30"
            >
              <ZoomIn size={20} />
            </button>
            <a
              href={filteredImages[selectedImage].url}
              download
              onClick={(e) => e.stopPropagation()}
              className="p-3 rounded-full text-white hover:bg-white/20 transition"
            >
              <Download size={20} />
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              className="p-3 rounded-full text-white hover:bg-sky-500 transition"
            >
              <X size={20} />
            </button>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            disabled={selectedImage === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white/20 transition disabled:opacity-30 z-20"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            disabled={selectedImage === filteredImages.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white/20 transition disabled:opacity-30 z-20"
          >
            <ChevronRight size={32} />
          </button>

          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredImages[selectedImage].url}
              alt={filteredImages[selectedImage].title}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl select-none"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: 'transform 0.3s ease-out',
              }}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center z-20">
            <div className="bg-black/50 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl">
              <p className="font-semibold text-white text-xl mb-1">
                {filteredImages[selectedImage].title}
              </p>
              <p className="text-white/80 text-sm">
                {selectedImage + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
