import React, { useState } from 'react';
import { SilverHeart, SilverRing, SilverDiamond } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface CoupleProps {
  config: any;
}

const Couple: React.FC<CoupleProps> = ({ config }) => {
  const [selectedPerson, setSelectedPerson] = useState<'groom' | 'bride' | null>(null);
  const { ref: groomRef, isVisible: groomVisible } = useScrollAnimation();
  const { ref: brideRef, isVisible: brideVisible } = useScrollAnimation();
  const { ref: dividerRef, isVisible: dividerVisible } = useScrollAnimation();

  const groomData = {
    name: config?.couple?.groom?.name || 'Alexander William',
    title: 'The Groom',
    parents: config?.couple?.groom?.parents || { father: 'Robert William', mother: 'Elizabeth William' },
    bio: config?.couple?.groom?.bio || 'A kind-hearted soul with a passion for adventure and bringing joy to everyone around him.',
    education: config?.couple?.groom?.education || 'Master of Business Administration',
    occupation: config?.couple?.groom?.occupation || 'Software Engineer',
    image: config?.couple?.groom?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face'
  };

  const brideData = {
    name: config?.couple?.bride?.name || 'Isabella Rose',
    title: 'The Bride',
    parents: config?.couple?.bride?.parents || { father: 'Michael Rose', mother: 'Sarah Rose' },
    bio: config?.couple?.bride?.bio || 'A graceful and compassionate soul who fills every room with warmth and laughter.',
    education: config?.couple?.bride?.education || 'Master of Fine Arts',
    occupation: config?.couple?.bride?.occupation || 'Creative Director',
    image: config?.couple?.bride?.image || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face'
  };

  const PersonCard = ({ 
    person, 
    isVisible, 
    side 
  }: { 
    person: typeof groomData; 
    isVisible: boolean; 
    side: 'left' | 'right' 
  }) => (
    <div 
      className={`transform transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : `${side === 'left' ? 'opacity-0 -translate-x-20' : 'opacity-0 translate-x-20'}`
      }`}
    >
      <div className="card-silver max-w-md mx-auto group">
        {/* Image Container */}
        <div className="relative mb-6 overflow-hidden rounded-lg">
          <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300">
            <img 
              src={person.image} 
              alt={person.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Decorative Frame */}
          <div className="absolute inset-0 border-4 border-white/30 pointer-events-none" />
          <div className="absolute -inset-2 border-2 border-primary-silver/20 rounded-lg pointer-events-none" />
        </div>

        {/* Name and Title */}
        <div className="text-center mb-4">
          <h3 className="font-heading text-2xl md:text-3xl text-charcoal mb-2">
            {person.name}
          </h3>
          <p className="font-elegant text-lg text-silver italic mb-3">
            {person.title}
          </p>
          <div className="flex justify-center mb-4">
            <SilverRing size={24} className="text-primary-silver" />
          </div>
        </div>

        {/* Parents */}
        <div className="bg-platinum/50 rounded-lg p-4 mb-4">
          <p className="font-body text-sm text-silver mb-2 text-center">Son of</p>
          <p className="font-elegant text-base text-charcoal text-center">
            {person.parents.father} & {person.parents.mother}
          </p>
        </div>

        {/* Bio */}
        <p className="font-body text-sm text-secondary leading-relaxed mb-4 text-center">
          {person.bio}
        </p>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <SilverDiamond size={16} className="text-primary-silver opacity-60" />
            <span className="font-body text-sm text-silver">{person.education}</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <SilverDiamond size={16} className="text-primary-silver opacity-60" />
            <span className="font-body text-sm text-silver">{person.occupation}</span>
          </div>
        </div>

        {/* Interactive Button */}
        <button
          onClick={() => setSelectedPerson(side === 'left' ? 'groom' : 'bride')}
          className="w-full mt-4 btn-silver text-sm font-medium group-hover:shadow-medium"
        >
          Learn More
        </button>
      </div>
    </div>
  );

  return (
    <section id="couple" className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.3'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={dividerRef} className={`text-center mb-16 transition-all duration-700 ${dividerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverHeart size={56} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Happy Couple
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            Two hearts, one love, forever bound together in matrimony
          </p>
        </div>

        {/* Couple Cards */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">
          <div ref={groomRef}>
            <PersonCard person={groomData} isVisible={groomVisible} side="left" />
          </div>
          
          {/* Center Divider */}
          <div ref={dividerRef} className={`hidden md:flex flex-col items-center space-y-4 transition-all duration-1000 delay-300 ${dividerVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary-silver to-transparent" />
            <SilverHeart size={32} className="text-primary-silver drop-shadow-lg animate-pulse" />
            <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary-silver to-transparent" />
          </div>

          <div ref={brideRef}>
            <PersonCard person={brideData} isVisible={brideVisible} side="right" />
          </div>
        </div>

        {/* Mobile Divider */}
        <div className={`md:hidden flex justify-center items-center space-x-4 my-8 ${dividerVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-px bg-gradient-to-r from-transparent via-primary-silver to-transparent w-20" />
          <SilverHeart size={24} className="text-primary-silver" />
          <div className="h-px bg-gradient-to-r from-transparent via-primary-silver to-transparent w-20" />
        </div>

        {/* Love Quote */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${dividerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver max-w-3xl mx-auto p-8 bg-gradient-to-br from-platinum/30 to-white">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <SilverHeart 
                    key={i} 
                    size={20} 
                    className="text-primary-silver" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
            <p className="font-script text-2xl md:text-3xl text-charcoal italic mb-4">
              "From the first hello to forever, every moment with you is a blessing"
            </p>
            <p className="font-elegant text-silver">— {groomData.name} & {brideData.name}</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
          <SilverRing size={40} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 hidden lg:block">
          <SilverDiamond size={30} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 hidden lg:block">
          <SilverRing size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPerson && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPerson(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-4 right-4 text-silver hover:text-charcoal transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <div className="text-center">
              <h3 className="font-heading text-3xl text-charcoal mb-4">
                {selectedPerson === 'groom' ? groomData.name : brideData.name}
              </h3>
              <p className="font-script text-xl text-silver mb-6">
                {selectedPerson === 'groom' ? groomData.title : brideData.title}
              </p>
              <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                <img 
                  src={selectedPerson === 'groom' ? groomData.image : brideData.image}
                  alt={selectedPerson === 'groom' ? groomData.name : brideData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-body text-secondary leading-relaxed mb-6">
                {selectedPerson === 'groom' ? groomData.bio : brideData.bio}
              </p>
              <button
                onClick={() => setSelectedPerson(null)}
                className="btn-silver px-6 py-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Divider */}
      <div className="section-divider mt-16" />
    </section>
  );
};

export default Couple;