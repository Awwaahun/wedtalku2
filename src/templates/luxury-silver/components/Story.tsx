import React, { useState } from 'react';
import { SilverHeart, SilverDiamond, SilverStar } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface StoryProps {
  config: any;
}

interface StoryEvent {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
  type: 'first-meet' | 'first-date' | 'proposal' | 'engagement';
}

const Story: React.FC<StoryProps> = ({ config }) => {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollAnimation();

  const storyEvents: StoryEvent[] = [
    {
      id: 1,
      date: 'March 15, 2020',
      title: 'The First Meeting',
      description: 'Fate brought us together at a quaint coffee shop in downtown. A chance encounter that would change our lives forever.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
      type: 'first-meet'
    },
    {
      id: 2,
      date: 'April 22, 2020',
      title: 'Our First Date',
      description: 'A magical evening under the stars, sharing dreams and laughter. We knew from that moment that this was something special.',
      image: 'https://images.unsplash.com/photo-1516453678267-9a1e7e0747a7?w=600&h=400&fit=crop',
      type: 'first-date'
    },
    {
      id: 3,
      date: 'December 25, 2023',
      title: 'The Proposal',
      description: 'On a snowy Christmas morning, surrounded by family and love, I asked the most important question of my life.',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
      type: 'proposal'
    },
    {
      id: 4,
      date: 'January 1, 2024',
      title: 'The Engagement',
      description: 'We rang in the New Year as an engaged couple, ready to embark on our forever journey together.',
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=400&fit=crop',
      type: 'engagement'
    }
  ];

  const getEventIcon = (type: StoryEvent['type']) => {
    switch (type) {
      case 'first-meet':
        return <SilverStar size={24} className="text-primary-silver" />;
      case 'first-date':
        return <SilverHeart size={24} className="text-primary-silver" />;
      case 'proposal':
        return <SilverDiamond size={24} className="text-primary-silver" />;
      case 'engagement':
        return <SilverStar size={24} className="text-primary-silver" />;
      default:
        return <SilverHeart size={24} className="text-primary-silver" />;
    }
  };

  const StoryCard = ({ 
    event, 
    index, 
    isEven 
  }: { 
    event: StoryEvent; 
    index: number; 
    isEven: boolean 
  }) => {
    const { ref, isVisible } = useScrollAnimation();
    
    return (
      <div 
        ref={ref}
        className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Image */}
        <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
          <div 
            className="relative overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => setSelectedEvent(event.id)}
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white font-medium">View Details</p>
            </div>
            
            {/* Decorative Frame */}
            <div className="absolute -inset-2 border-2 border-primary-silver/30 rounded-lg pointer-events-none group-hover:border-primary-silver/60 transition-colors duration-300" />
          </div>
        </div>

        {/* Content */}
        <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-8' : 'md:pr-8'}`}>
          <div className="card-silver">
            <div className="flex items-center space-x-3 mb-4">
              {getEventIcon(event.type)}
              <span className="font-elegant text-silver text-sm uppercase tracking-wider">
                {event.date}
              </span>
            </div>
            <h3 className="font-heading text-2xl text-charcoal mb-3">
              {event.title}
            </h3>
            <p className="font-body text-secondary leading-relaxed mb-4">
              {event.description}
            </p>
            <button
              onClick={() => setSelectedEvent(event.id)}
              className="btn-silver text-sm font-medium"
            >
              Read More
            </button>
          </div>
        </div>

        {/* Timeline Dot */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
          <div className="w-4 h-4 bg-primary-silver rounded-full border-4 border-white shadow-medium" />
        </div>
      </div>
    );
  };

  return (
    <section id="story" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-platinum relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23C0C0C0' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverHeart size={56} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Our Love Story
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            Every chapter of our journey has brought us closer to this beautiful moment
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary-silver to-light-silver transition-all duration-1000 delay-300 ${
            timelineVisible ? 'opacity-100' : 'opacity-0'
          }`} />

          {/* Story Events */}
          {storyEvents.map((event, index) => (
            <div key={event.id} className="relative">
              <StoryCard 
                event={event} 
                index={index} 
                isEven={index % 2 === 0}
              />
            </div>
          ))}
        </div>

        {/* Promise Section */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver max-w-3xl mx-auto p-8 bg-gradient-to-br from-white to-platinum/30">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <SilverStar 
                    key={i} 
                    size={20} 
                    className="text-primary-silver" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
            <h3 className="font-heading text-2xl md:text-3xl text-charcoal mb-4">
              Our Promise
            </h3>
            <p className="font-script text-xl text-secondary leading-relaxed mb-6">
              "To love, honor, and cherish each other for all the days of our lives, through every joy and challenge, 
              growing stronger together with each passing moment."
            </p>
            <div className="flex justify-center space-x-4">
              <SilverHeart size={24} className="text-primary-silver" />
              <span className="font-elegant text-silver">Forever & Always</span>
              <SilverHeart size={24} className="text-primary-silver" />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20 hidden lg:block">
          <SilverStar size={30} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 opacity-20 hidden lg:block">
          <SilverHeart size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20 hidden lg:block">
          <SilverStar size={28} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const event = storyEvents.find(e => e.id === selectedEvent);
              if (!event) return null;
              
              return (
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 text-silver hover:text-charcoal transition-colors shadow-medium"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  
                  {/* Image */}
                  <div className="aspect-video md:aspect-[16/9]">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      {getEventIcon(event.type)}
                      <span className="font-elegant text-silver text-sm uppercase tracking-wider">
                        {event.date}
                      </span>
                    </div>
                    <h3 className="font-heading text-3xl text-charcoal mb-4">
                      {event.title}
                    </h3>
                    <p className="font-body text-secondary leading-relaxed text-lg mb-6">
                      {event.description}
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="btn-silver px-8 py-3"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Section Divider */}
      <div className="section-divider mt-16" />
    </section>
  );
};

export default Story;