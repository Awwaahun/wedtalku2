import React, { useState, useEffect } from 'react';
import { Heart, MapPin } from 'lucide-react';

interface StoryProps {
  config?: any;
}

export default function Story({ config }: StoryProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const storyTimeline = [
    {
      date: 'Januari 2020',
      title: 'Pertemuan Pertama',
      description: 'Takdir mempertemukan kami di sebuah kafe di Jakarta. Senyum pertama yang mengubah segalanya.',
      icon: '❦'
    },
    {
      date: 'Februari 2021',
      title: 'Kencan Pertama',
      description: 'Malam yang tak terlupakan di tepi pantai, di bawah cahaya bulan purnama.',
      icon: '💕'
    },
    {
      date: 'Desember 2022',
      title: 'Lamaran',
      description: 'Satu kata "YA" yang membuka babak baru dalam hidup kami. Di tempat paling berkesan.',
      icon: '💍'
    },
    {
      date: 'Juli 2024',
      title: 'Hari Pernikahan',
      description: 'Momen di mana kami bersatu dalam ikatan suci pernikahan, didampingi keluarga dan sahabat.',
      icon: '👰🤵'
    }
  ];

  return (
    <section className="rustic-section bg-[var(--rustic-cream)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-[var(--rustic-primary)] mb-4 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Cerita Cinta Kami
          </h2>
          <div className="rustic-divider rustic-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          <p className={`text-lg text-[var(--rustic-secondary)] mt-6 max-w-2xl mx-auto rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Perjalanan cinta kami dimulai dari sebuah takdir yang indah
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[var(--gradient-primary)]"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {storyTimeline.map((story, index) => (
                <div
                  key={index}
                  className={`relative flex items-center rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ 
                    animationDelay: `${0.4 + index * 0.2}s`,
                    justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'
                  }}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-5/12">
                    <div className="rustic-card">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{story.icon}</div>
                        <div className="text-sm text-[var(--rustic-gold)] font-semibold mb-2 uppercase tracking-wider">
                          {story.date}
                        </div>
                        <h3 className="text-xl font-bold text-[var(--rustic-primary)] mb-3">
                          {story.title}
                        </h3>
                        <p className="text-[var(--rustic-secondary)] leading-relaxed">
                          {story.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[var(--rustic-gold)] rounded-full border-4 border-[var(--rustic-cream)] z-10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Love Quote */}
        <div className={`text-center mt-16 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
          <div className="rustic-card max-w-3xl mx-auto bg-[var(--rustic-beige)]">
            <div className="text-center py-8">
              <Heart className="w-10 h-10 text-[var(--rustic-gold)] mx-auto mb-6 animate-pulse" />
              <p className="text-2xl text-[var(--rustic-primary)] italic font-medium leading-relaxed mb-4">
                "Cinta kami bukan tentang seberapa sempurna kita, 
                tapi tentang seberapa sempurna kita bersama."
              </p>
              <div className="flex items-center justify-center space-x-4 text-[var(--rustic-secondary)]">
                <MapPin className="w-5 h-5" />
                <span>Jakarta, Indonesia</span>
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Photo Montage Placeholder */}
        <div className={`mt-16 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1.4s' }}>
          <div className="rustic-card bg-[var(--rustic-beige)]">
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-6">
                Momen-momen Indah
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden rustic-image-overlay border-2 border-[var(--rustic-accent)]">
                    <div className="w-full h-full bg-[var(--rustic-cream)] flex items-center justify-center">
                      <Heart className="w-8 h-8 text-[var(--rustic-gold)] opacity-50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}