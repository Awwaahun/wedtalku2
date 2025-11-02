import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

type Image = WeddingConfig['gallery'][number];

interface GalleryProps {
  config: WeddingConfig;
}

const SectionWrapper: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
    <section id={id} className="py-24 px-4 container mx-auto">
        {children}
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode; subtitle: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl tracking-tight text-white">{children}</h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{subtitle}</p>
        <div className="w-24 h-px bg-yellow-500 mx-auto mt-4"></div>
    </div>
);


const Gallery: React.FC<GalleryProps> = ({ config }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedImage(index);
  const closeModal = () => setSelectedImage(null);

  const nextImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev !== null ? (prev + 1) % config.gallery.length : 0));
    }
  }, [selectedImage, config.gallery.length]);

  const prevImage = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage((prev) => (prev !== null ? (prev - 1 + config.gallery.length) % config.gallery.length : 0));
    }
  }, [selectedImage, config.gallery.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (selectedImage === null) return;
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, nextImage, prevImage]);


  return (
    <SectionWrapper id="gallery">
      <SectionTitle subtitle="A collection of our cherished moments, each telling a piece of our story.">
        Our Moments
      </SectionTitle>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {config.gallery.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg break-inside-avoid cursor-pointer group relative" onClick={() => openModal(index)}>
            <img src={image.url} alt={image.title} className="w-full h-auto transition-transform duration-500 group-hover:scale-110"/>
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-semibold">{image.title}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center animate-fade-in" onClick={closeModal}>
          <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img src={config.gallery[selectedImage].url} alt={config.gallery[selectedImage].title} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"/>
            
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition"><X size={24} /></button>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition"><ChevronLeft size={32} /></button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition"><ChevronRight size={32} /></button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
                <p className="font-semibold">{config.gallery[selectedImage].title}</p>
                <p className="text-sm text-gray-300">{selectedImage + 1} / {config.gallery.length}</p>
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
};

export default Gallery;
