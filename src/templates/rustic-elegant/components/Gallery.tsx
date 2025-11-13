import React, { useState, useEffect } from 'react';
import { Camera, Heart } from 'lucide-react';

interface GalleryProps {
  config?: any;
}

export default function Gallery({ config }: GalleryProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Placeholder gallery images - these would come from config
  const galleryImages = [
    { id: 1, caption: 'Pre-wedding photoshoot', category: 'couple' },
    { id: 2, caption: 'Engagement moment', category: 'engagement' },
    { id: 3, caption: 'Family portrait', category: 'family' },
    { id: 4, caption: 'Romantic dinner', category: 'couple' },
    { id: 5, caption: 'Wedding venue', category: 'venue' },
    { id: 6, caption: 'Decoration preview', category: 'decoration' },
    { id: 7, caption: 'Bridal portrait', category: 'couple' },
    { id: 8, caption: 'Groom preparation', category: 'preparation' }
  ];

  return (
    <section className="rustic-section bg-[var(--rustic-beige)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-[var(--rustic-primary)] mb-4 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Galeri Foto
          </h2>
          <div className="rustic-divider rustic-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          <p className={`text-lg text-[var(--rustic-secondary)] mt-6 max-w-2xl mx-auto rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Kenangan indah yang akan kami abadikan selamanya
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className={`rustic-fade-in-up ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                onClick={() => setSelectedImage(image.id)}
              >
                <div className="rustic-card p-2 cursor-pointer hover:scale-105 transition-transform duration-300">
                  <div className="aspect-square rounded-lg overflow-hidden rustic-image-overlay relative group">
                    {/* Placeholder Image */}
                    <div className="w-full h-full bg-gradient-to-br from-[var(--rustic-accent)] to-[var(--rustic-beige)] flex items-center justify-center">
                      <Camera className="w-12 h-12 text-[var(--rustic-primary)] opacity-50" />
                    </div>
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-[var(--rustic-primary)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">{image.caption}</p>
                    </div>

                    {/* Heart Icon */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Heart className="w-4 h-4 text-[var(--rustic-primary)]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className={`mt-16 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
          <div className="rustic-card bg-[var(--rustic-cream)] max-w-4xl mx-auto">
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-6">
                Video Pernikahan
              </h3>
              <div className="aspect-video rounded-lg overflow-hidden rustic-image-overlay bg-gradient-to-br from-[var(--rustic-secondary)] to-[var(--rustic-primary)] flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Camera className="w-10 h-10" />
                  </div>
                  <p className="text-lg font-medium">Video Highlights</p>
                  <p className="text-sm opacity-80 mt-2">Klik untuk memutar video</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Gallery */}
        <div className={`mt-16 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1.4s' }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-4">
              Ikuti Perjalanan Kami
            </h3>
            <p className="text-[var(--rustic-secondary)]">
              Tag foto Anda dengan hashtag kami
            </p>
          </div>
          
          <div className="rustic-card bg-[var(--rustic-cream)] max-w-2xl mx-auto py-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[var(--gradient-gold)] text-white font-semibold">
                <Heart className="w-5 h-5" />
                <span>#WeddingRusticElegant2024</span>
              </div>
              <p className="text-[var(--rustic-secondary)] mt-4">
                Bagikan momen spesial Anda dengan kami
              </p>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="rustic-card max-w-4xl max-h-[90vh] overflow-auto">
              <div className="aspect-video rounded-lg overflow-hidden rustic-image-overlay bg-gradient-to-br from-[var(--rustic-accent)] to-[var(--rustic-beige)] flex items-center justify-center">
                <Camera className="w-16 h-16 text-[var(--rustic-primary)] opacity-50" />
              </div>
              <div className="p-4 text-center">
                <p className="text-[var(--rustic-primary)] font-medium">
                  {galleryImages.find(img => img.id === selectedImage)?.caption}
                </p>
                <button 
                  className="mt-4 rustic-btn"
                  onClick={() => setSelectedImage(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}