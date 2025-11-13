import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useWeddingConfig } from '../hooks/useWeddingConfig';

export default function EventDetails() {
  const { config } = useWeddingConfig();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="rustic-section bg-[var(--rustic-beige)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-[var(--rustic-primary)] mb-4 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Detail Acara
          </h2>
          <div className="rustic-divider rustic-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          <p className={`text-lg text-[var(--rustic-secondary)] mt-6 max-w-2xl mx-auto rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {config.events.map((event, index) => (
            <div
              key={event.id}
              className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ animationDelay: `${0.4 + index * 0.2}s` }}
            >
              <div className="rustic-card h-full">
                {/* Event Header */}
                <div className="text-center mb-6">
                  <div 
                    className="inline-block px-6 py-3 rounded-full text-white font-semibold mb-4"
                    style={{ 
                      background: `var(--gradient-${event.color || 'primary'})`,
                      boxShadow: `0 4px 15px ${event.color === 'gold' ? 'rgba(184, 134, 11, 0.3)' : 'rgba(139, 69, 19, 0.3)'}`
                    }}
                  >
                    {event.title}
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--rustic-primary)]">
                    {config.couple.bride.name} & {config.couple.groom.name}
                  </h3>
                </div>

                {/* Event Details */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[var(--rustic-cream)] rounded-lg flex-shrink-0">
                      <Calendar className="w-5 h-5 text-[var(--rustic-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--rustic-primary)]">Tanggal</p>
                      <p className="text-[var(--rustic-secondary)]">{config.wedding.dateDisplay}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[var(--rustic-cream)] rounded-lg flex-shrink-0">
                      <Clock className="w-5 h-5 text-[var(--rustic-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--rustic-primary)]">Waktu</p>
                      <p className="text-[var(--rustic-secondary)]">{event.time}</p>
                      <p className="text-sm text-[var(--rustic-secondary)]">Durasi: {event.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[var(--rustic-cream)] rounded-lg flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--rustic-primary)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--rustic-primary)]">Lokasi</p>
                      <p className="text-[var(--rustic-secondary)] font-medium">{event.location}</p>
                      <p className="text-[var(--rustic-secondary)]">{event.address}</p>
                    </div>
                  </div>

                  {event.description && (
                    <div className="pt-4 border-t border-[var(--rustic-accent)]">
                      <p className="text-[var(--rustic-brown)] leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="pt-4 border-t border-[var(--rustic-accent)]">
                    <p className="text-sm font-semibold text-[var(--rustic-primary)] mb-3">Informasi Kontak</p>
                    <div className="grid grid-cols-2 gap-3">
                      {event.phone && (
                        <a
                          href={`tel:${event.phone}`}
                          className="flex items-center space-x-2 text-[var(--rustic-secondary)] hover:text-[var(--rustic-primary)] transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{event.phone}</span>
                        </a>
                      )}
                      {event.email && (
                        <a
                          href={`mailto:${event.email}`}
                          className="flex items-center space-x-2 text-[var(--rustic-secondary)] hover:text-[var(--rustic-primary)] transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm truncate">{event.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 text-center">
                  <button 
                    className="rustic-btn w-full"
                    onClick={() => {
                      // Open Google Maps
                      const encodedAddress = encodeURIComponent(event.address);
                      window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
                    }}
                  >
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Buka Peta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wedding Protocol Note */}
        <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <div className="rustic-card max-w-3xl mx-auto mt-12 bg-[var(--rustic-cream)]">
            <div className="text-center py-6">
              <p className="text-lg font-semibold text-[var(--rustic-primary)] mb-3">
                Protokol Kesehatan
              </p>
              <p className="text-[var(--rustic-secondary)] leading-relaxed">
                Demi kebaikan bersama, kami mohon kerjasama para tamu undangan untuk tetap mematuhi protokol kesehatan yang telah ditetapkan pemerintah. Gunakan masker, jaga jarak, dan cuci tangan sebelum memasuki area acara.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}