import React, { useState } from 'react';
import { SilverHeart, SilverDiamond, SilverCamera } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface GalleryProps {
  config: any;
}

interface GalleryImage {
  id: number;
  url: string;
  thumbnail: string;
  title: string;
  description: string;
  category: 'pre-wedding' | 'engagement' | 'couple' | 'moments';
}

const Gallery: React.FC<GalleryProps> = ({ config }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: galleryRef, isVisible: galleryVisible } = useScrollAnimation();

  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
      title: 'Romantic Sunset',
      description: 'A beautiful moment captured during golden hour',
      category: 'pre-wedding'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop',
      title: 'The Perfect Moment',
      description: 'When he asked the most important question',
      category: 'engagement'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=1200&h=800&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1465146633011-14f8e0781093?w=400&h=300&fit=crop',
      title: 'Intimate Moments',
      description: 'Sharing quiet moments together',
      category: 'couple'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
      title: 'First Meeting',
      description: 'Where our journey began',
      category: 'pre-wedding'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1516453678267-9a1e7e0747a7?w=1200&h=800&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1516453678267-9a1e7e0747a7?w=400&h=300&fit=crop',
      title: 'First Date',
      description: 'The beginning of something beautiful',
      category: 'couple'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
      title: 'Celebration Time',
      description: 'Joy and happiness captured forever',
      category: 'moments'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=800&fit=crop&auto=format',
      thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop&auto=format',
      title: 'Engagement Bliss',
      description: 'The ring that sealed our forever',
      category: 'engagement'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=800&fit=crop&auto=format',
      thumbnail: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop&auto=format',
      title: 'Wedding Dreams',
      description: 'Preparing for our big day',
      category: 'pre-wedding'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos', icon: <SilverCamera size={16} /> },
    { id: 'pre-wedding', name: 'Pre-Wedding', icon: <SilverHeart size={16} /> },
    { id: 'engagement', name: 'Engagement', icon: <SilverDiamond size={16} /> },
    { id: 'couple', name: 'Couple', icon: <SilverHeart size={16} /> },
    { id: 'moments', name: 'Moments', icon: <SilverCamera size={16} /> }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const ImageCard = ({ image, index }: { image: GalleryImage; index: number }) => {
    const { ref, isVisible } = useScrollAnimation();
    
    return (
      <div 
        ref={ref}
        className={`transform transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="card-silver p-2 group cursor-pointer" onClick={() => setSelectedImage(image)}>
          <div className="relative overflow-hidden rounded-lg">
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300">
              <img 
                src={image.thumbnail} 
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Title on Hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h4 className="text-white font-heading text-lg drop-shadow-lg">{image.title}</h4>
              <p className="text-white/90 text-sm font-body drop-shadow-lg">{image.description}</p>
            </div>
            
            {/* Silver Frame Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-silver/50 rounded-lg transition-colors duration-300" />
          </div>
          
          {/* Category Badge */}
          <div className="mt-3 flex items-center justify-center">
            <span className="bg-platinum/50 rounded-full px-3 py-1 text-xs font-elegant text-silver">
              {image.category.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="gallery" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.3'%3E%3Cpath d='M40 30c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0 20c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm20-20c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0 20c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-20-40c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm20 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-20 80c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm20 0c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverCamera size={56} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Our Gallery
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            Capturing precious moments and memories that will last a lifetime
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-200 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-silver-gradient text-charcoal shadow-medium'
                  : 'bg-white/70 hover:bg-platinum/50 text-silver border border-silver-light'
              }`}
            >
              {category.icon}
              <span className="font-elegant text-sm capitalize">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div ref={galleryRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {filteredImages.map((image, index) => (
            <ImageCard key={image.id} image={image} index={index} />
          ))}
        </div>

        {/* Upload Section */}
        <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-500 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver bg-gradient-to-br from-platinum/30 to-white text-center p-8">
            <div className="flex justify-center mb-4">
              <SilverCamera size={48} className="text-primary-silver" />
            </div>
            <h3 className="font-heading text-2xl text-charcoal mb-4">
              Share Your Moments
            </h3>
            <p className="font-body text-secondary mb-6">
              Have photos from our events? Share them with us and be part of our beautiful memories!
            </p>
            <button className="btn-silver px-6 py-3 font-medium">
              Upload Your Photos
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
          <SilverCamera size={40} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 hidden lg:block">
          <SilverHeart size={30} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 hidden lg:block">
          <SilverCamera size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 text-silver hover:text-charcoal transition-colors shadow-medium"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            {/* Image */}
            <div className="relative">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Silver Frame */}
              <div className="absolute inset-0 border-4 border-white/30 rounded-lg pointer-events-none" />
              <div className="absolute -inset-2 border-2 border-primary-silver/50 rounded-lg pointer-events-none" />
            </div>
            
            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white font-heading text-2xl mb-2">{selectedImage.title}</h3>
              <p className="text-white/90 font-body mb-2">{selectedImage.description}</p>
              <span className="inline-block bg-primary-silver/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-elegant capitalize">
                {selectedImage.category.replace('-', ' ')}
              </span>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={() => {
                const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
                setSelectedImage(filteredImages[prevIndex]);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 text-silver hover:text-charcoal transition-colors shadow-medium"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button
              onClick={() => {
                const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
                const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
                setSelectedImage(filteredImages[nextIndex]);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 text-silver hover:text-charcoal transition-colors shadow-medium"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Section Divider */}
      <div className="section-divider mt-16" />
    </section>
  );
};

export default Gallery;