import React, { useState, useEffect } from 'react';
import { SilverHeart, SilverDiamond } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface CountdownProps {
  config: any;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ config }) => {
  const { ref, isVisible } = useScrollAnimation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const weddingDate = new Date(config?.date?.full || '2025-12-15T10:00:00');
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  const TimeUnit = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
    <div 
      className={`card-silver p-6 md:p-8 text-center transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative mb-4">
        <div className="bg-silver-gradient rounded-lg p-4 shadow-silver">
          <div className="text-4xl md:text-5xl lg:text-6xl font-heading text-charcoal font-bold">
            {String(value).padStart(2, '0')}
          </div>
        </div>
        <div className="absolute -top-2 -right-2">
          <SilverDiamond size={20} className="text-primary-silver opacity-60" />
        </div>
      </div>
      <p className="font-elegant text-lg md:text-xl text-silver capitalize tracking-wide">
        {label}
      </p>
    </div>
  );

  return (
    <section ref={ref} className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-white to-platinum relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverHeart size={48} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Counting Down to Our Special Day
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            Every moment brings us closer to forever. Join us in celebrating the journey ahead.
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
          <TimeUnit value={timeLeft.days} label="Days" delay={100} />
          <TimeUnit value={timeLeft.hours} label="Hours" delay={200} />
          <TimeUnit value={timeLeft.minutes} label="Minutes" delay={300} />
          <TimeUnit value={timeLeft.seconds} label="Seconds" delay={400} />
        </div>

        {/* Progress Bar */}
        <div className={`max-w-2xl mx-auto transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-full p-1 shadow-medium border border-silver-light">
            <div className="relative h-4 bg-gradient-to-r from-primary-silver to-light-silver rounded-full overflow-hidden">
              <div 
                className="absolute inset-0 shimmer-silver rounded-full"
                style={{
                  width: `${Math.max(0, Math.min(100, ((365 - timeLeft.days) / 365) * 100))}%`,
                  transition: 'width 1s ease-in-out'
                }}
              />
            </div>
          </div>
          <p className="text-center text-sm text-silver mt-2 font-body">
            Journey Progress: {Math.round(Math.max(0, Math.min(100, ((365 - timeLeft.days) / 365) * 100)))}%
          </p>
        </div>

        {/* Motivational Message */}
        <div className={`text-center mt-12 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-soft border border-silver-light">
            <p className="font-script text-2xl text-charcoal italic">
              "The best is yet to come"
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <SilverDiamond size={30} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 opacity-20">
          <SilverHeart size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-10 left-20 opacity-20">
          <SilverHeart size={20} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Section Divider */}
      <div className="section-divider" />
    </section>
  );
};

export default Countdown;