import React, { useState } from 'react';
import { SilverCalendar, SilverLocation, SilverHeart, SilverDiamond } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface EventDetailsProps {
  config: any;
}

interface Event {
  id: string;
  type: 'akad' | 'reception';
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  description: string;
  dressCode?: string;
  mapUrl?: string;
  image: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ config }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: eventsRef, isVisible: eventsVisible } = useScrollAnimation();

  const events: Event[] = [
    {
      id: 'akad',
      type: 'akad',
      title: 'Akad Nikah',
      date: 'Sabtu, 15 Desember 2025',
      time: '09:00 - 10:00 WIB',
      location: 'Gedung Serbaguna Permata',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12345',
      description: 'Acara sakral pernikahan yang akan disaksikan oleh keluarga dan sahabat terdekat.',
      dressCode: 'Formal (Batik/Kebaya)',
      mapUrl: 'https://maps.google.com/?q=Gedung+Serbaguna+Permata',
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=600&fit=crop'
    },
    {
      id: 'reception',
      type: 'reception',
      title: 'Resepsi Pernikahan',
      date: 'Sabtu, 15 Desember 2025',
      time: '11:00 - 14:00 WIB',
      location: 'Ballroom Hotel Grand Palace',
      address: 'Jl. Gatot Subroto No. 45, Jakarta Pusat, DKI Jakarta 10110',
      description: 'Merayakan kebahagiaan bersama keluarga, kerabat, dan sahabat dalam pesta yang meriah.',
      dressCode: 'Semi-Formal',
      mapUrl: 'https://maps.google.com/?q=Ballroom+Hotel+Grand+Palace',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop'
    }
  ];

  const EventCard = ({ event, index }: { event: Event; index: number }) => {
    const { ref, isVisible } = useScrollAnimation();
    
    return (
      <div 
        ref={ref}
        className={`transform transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
        style={{ transitionDelay: `${index * 200}ms` }}
      >
        <div className="card-silver overflow-hidden group">
          {/* Event Image */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Event Type Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-medium">
              <span className="font-elegant text-sm text-charcoal capitalize">
                {event.type === 'akad' ? 'Sacred Ceremony' : 'Wedding Reception'}
              </span>
            </div>
            
            {/* Decorative Corner */}
            <div className="absolute top-4 right-4">
              <SilverDiamond size={24} className="text-white/80 drop-shadow-lg" />
            </div>
          </div>

          {/* Event Content */}
          <div className="p-6">
            <h3 className="font-heading text-2xl text-charcoal mb-4">
              {event.title}
            </h3>

            {/* Date & Time */}
            <div className="flex items-center space-x-3 mb-4">
              <SilverCalendar size={20} className="text-primary-silver" />
              <div>
                <p className="font-body text-charcoal font-medium">{event.date}</p>
                <p className="font-body text-silver text-sm">{event.time}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start space-x-3 mb-4">
              <SilverLocation size={20} className="text-primary-silver mt-1" />
              <div className="flex-1">
                <p className="font-body text-charcoal font-medium">{event.location}</p>
                <p className="font-body text-silver text-sm">{event.address}</p>
              </div>
            </div>

            {/* Description */}
            <p className="font-body text-secondary leading-relaxed mb-4">
              {event.description}
            </p>

            {/* Dress Code */}
            {event.dressCode && (
              <div className="bg-platinum/50 rounded-lg p-3 mb-4">
                <p className="font-body text-sm text-silver">
                  <span className="font-medium">Dress Code:</span> {event.dressCode}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSelectedEvent(event)}
                className="btn-silver flex-1 text-sm font-medium"
              >
                View Details
              </button>
              {event.mapUrl && (
                <a
                  href={event.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-silver flex-1 text-sm font-medium text-center inline-flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="10" r="3" fill="currentColor"/>
                  </svg>
                  Get Directions
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="event" className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            Event Details
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            We would be honored to have you celebrate this special day with us
          </p>
        </div>

        {/* Events Grid */}
        <div ref={eventsRef} className="grid md:grid-cols-2 gap-8 mb-12">
          {events.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {/* Important Information */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-500 ${eventsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver bg-gradient-to-br from-platinum/30 to-white">
            <h3 className="font-heading text-2xl text-charcoal mb-6 text-center">
              Important Information
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Health Protocols */}
              <div className="text-center">
                <div className="w-16 h-16 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-charcoal" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <h4 className="font-elegant text-lg text-charcoal mb-2">Health Protocol</h4>
                <p className="font-body text-sm text-silver">
                  Please follow health guidelines and wear masks when necessary
                </p>
              </div>

              {/* Gift Information */}
              <div className="text-center">
                <div className="w-16 h-16 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-charcoal" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="font-elegant text-lg text-charcoal mb-2">Gift Policy</h4>
                <p className="font-body text-sm text-silver">
                  Your presence is the greatest gift. Digital gifts preferred
                </p>
              </div>

              {/* RSVP Reminder */}
              <div className="text-center">
                <div className="w-16 h-16 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-charcoal" viewBox="0 0 24 24" fill="none">
                    <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="font-elegant text-lg text-charcoal mb-2">RSVP</h4>
                <p className="font-body text-sm text-silver">
                  Kindly confirm your attendance by December 1, 2025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Counting Down Message */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${eventsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-lg px-8 py-4 shadow-soft border border-silver-light">
            <p className="font-script text-2xl text-charcoal italic">
              "Looking forward to celebrating our love story with you"
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
          <SilverCalendar size={40} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 hidden lg:block">
          <SilverLocation size={30} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
          <SilverHeart size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 hidden lg:block">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
              <div className="h-64 md:h-80">
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 className="font-heading text-3xl text-charcoal mb-4">
                  {selectedEvent.title}
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <SilverCalendar size={20} className="text-primary-silver" />
                    <div>
                      <p className="font-body text-charcoal font-medium">{selectedEvent.date}</p>
                      <p className="font-body text-silver">{selectedEvent.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <SilverLocation size={20} className="text-primary-silver mt-1" />
                    <div className="flex-1">
                      <p className="font-body text-charcoal font-medium">{selectedEvent.location}</p>
                      <p className="font-body text-silver">{selectedEvent.address}</p>
                    </div>
                  </div>
                </div>

                <p className="font-body text-secondary leading-relaxed text-lg mb-6">
                  {selectedEvent.description}
                </p>

                {selectedEvent.dressCode && (
                  <div className="bg-platinum/50 rounded-lg p-4 mb-6">
                    <p className="font-body text-charcoal">
                      <span className="font-medium">Dress Code:</span> {selectedEvent.dressCode}
                    </p>
                  </div>
                )}

                {selectedEvent.mapUrl && (
                  <div className="flex justify-center">
                    <a
                      href={selectedEvent.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-silver px-8 py-3"
                    >
                      Get Directions on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Divider */}
      <div className="section-divider mt-16" />
    </section>
  );
};

export default EventDetails;