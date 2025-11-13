import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Heart } from 'lucide-react';

interface CountdownProps {
  config?: any;
}

export default function Countdown({ config }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  // Default wedding date - this should come from config
  const weddingDate = config?.wedding?.date || '2024-12-31';

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const wedding = new Date(weddingDate).getTime();
      const difference = wedding - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    // Trigger visibility animation
    setTimeout(() => setIsVisible(true), 100);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Hari', icon: Calendar },
    { value: timeLeft.hours, label: 'Jam', icon: Clock },
    { value: timeLeft.minutes, label: 'Menit', icon: Clock },
    { value: timeLeft.seconds, label: 'Detik', icon: Heart }
  ];

  return (
    <section className="rustic-section relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 rustic-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold text-[var(--rustic-primary)] mb-4 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Hitung Mundur
          </h2>
          <div className="rustic-divider rustic-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          <p className={`text-lg text-[var(--rustic-secondary)] mt-6 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Menuju hari bahagia kami
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {timeUnits.map((unit, index) => {
              const Icon = unit.icon;
              return (
                <div
                  key={unit.label}
                  className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="rustic-card text-center p-6 h-full flex flex-col justify-between">
                    <div className="mb-4">
                      <Icon className="w-8 h-8 text-[var(--rustic-gold)] mx-auto mb-2" />
                      <div className="text-4xl md:text-5xl font-bold text-[var(--rustic-primary)]">
                        {String(unit.value).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-lg md:text-xl text-[var(--rustic-secondary)] font-medium">
                      {unit.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Love Message */}
        <div className={`text-center mt-12 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="rustic-card max-w-2xl mx-auto bg-[var(--rustic-beige)]">
            <Heart className="w-8 h-8 text-[var(--rustic-gold)] mx-auto mb-4 animate-pulse" />
            <p className="text-xl text-[var(--rustic-primary)] italic leading-relaxed">
              "Setiap detik yang tersisa semakin mendekatkan kami pada momen sakral bersama."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}