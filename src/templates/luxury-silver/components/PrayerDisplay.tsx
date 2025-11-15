import React, { useState, useEffect } from 'react';
import { SilverHeart, SilverDiamond, SilverStar } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface Prayer {
  id: number;
  text: string;
  source: string;
  category: 'islamic' | 'christian' | 'universal' | 'blessing';
}

const PrayerDisplay: React.FC = () => {
  const [currentPrayerIndex, setCurrentPrayerIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const prayers: Prayer[] = [
    {
      id: 1,
      text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.",
      source: "QS. Ar-Rum: 21",
      category: 'islamic'
    },
    {
      id: 2,
      text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
      source: "1 Corinthians 13:4-7",
      category: 'christian'
    },
    {
      id: 3,
      text: "May your love be as endless as your wedding rings. May your marriage be filled with all the right ingredients: a heap of love, a dash of humor, a touch of romance, and a spoonful of understanding. May your journey together be beautiful and may you grow old together happily.",
      source: "Wedding Blessing",
      category: 'blessing'
    },
    {
      id: 4,
      text: "Two souls, one heart, beating together in perfect harmony. May your love story be written in the stars and your future be as bright as the sun. May every day bring new reasons to love each other more.",
      source: "Universal Love",
      category: 'universal'
    }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPrayerIndex((prev) => (prev + 1) % prayers.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [isVisible, prayers.length]);

  const currentPrayer = prayers[currentPrayerIndex];
  const getCategoryIcon = (category: Prayer['category']) => {
    switch (category) {
      case 'islamic':
      case 'christian':
        return <SilverStar size={24} className="text-primary-silver" />;
      case 'blessing':
        return <SilverHeart size={24} className="text-primary-silver" />;
      case 'universal':
        return <SilverDiamond size={24} className="text-primary-silver" />;
      default:
        return <SilverHeart size={24} className="text-primary-silver" />;
    }
  };

  const goToPrayer = (index: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPrayerIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <section id="prayer" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${15 + (i * 15)}%`,
              top: `${10 + (i * 12)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + (i * 0.5)}s`
            }}
          >
            <SilverDiamond size={20} className="text-primary-silver opacity-30" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverStar size={56} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Prayers & Blessings
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            Sacred words and heartfelt prayers to guide your journey together
          </p>
        </div>

        {/* Main Prayer Display */}
        <div ref={ref} className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver bg-gradient-to-br from-platinum/30 to-white p-8 md:p-12 text-center">
            {/* Prayer Icon */}
            <div className={`flex justify-center mb-8 transition-all duration-500 ${isAnimating ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
              <div className="w-20 h-20 bg-silver-gradient rounded-full flex items-center justify-center">
                {getCategoryIcon(currentPrayer.category)}
              </div>
            </div>

            {/* Prayer Text */}
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <p className="font-script text-2xl md:text-3xl text-charcoal leading-relaxed mb-8">
                "{currentPrayer.text}"
              </p>
              
              {/* Source */}
              <p className="font-elegant text-lg text-silver italic mb-8">
                — {currentPrayer.source}
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mb-8">
              {prayers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPrayer(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPrayerIndex 
                      ? 'bg-primary-silver w-8' 
                      : 'bg-silver-light hover:bg-primary-silver/50'
                  }`}
                />
              ))}
            </div>

            {/* Manual Navigation */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => goToPrayer((currentPrayerIndex - 1 + prayers.length) % prayers.length)}
                className="p-3 bg-white/80 hover:bg-white border border-silver-light rounded-full transition-all duration-300 hover:shadow-medium"
              >
                <svg className="w-5 h-5 text-charcoal" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => goToPrayer((currentPrayerIndex + 1) % prayers.length)}
                className="p-3 bg-white/80 hover:bg-white border border-silver-light rounded-full transition-all duration-300 hover:shadow-medium"
              >
                <svg className="w-5 h-5 text-charcoal" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Prayer Categories */}
        <div className={`mt-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { category: 'islamic', title: 'Islamic', icon: <SilverStar size={20} />, prayers: 2 },
              { category: 'christian', title: 'Christian', icon: <SilverStar size={20} />, prayers: 1 },
              { category: 'blessing', title: 'Blessings', icon: <SilverHeart size={20} />, prayers: 1 },
              { category: 'universal', title: 'Universal', icon: <SilverDiamond size={20} />, prayers: 1 }
            ].map((item, index) => (
              <div
                key={item.category}
                className={`card-silver p-6 text-center cursor-pointer hover:shadow-silver transition-all duration-300 ${
                  currentPrayer.category === item.category ? 'ring-2 ring-primary-silver' : ''
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => {
                  const firstPrayerIndex = prayers.findIndex(p => p.category === item.category);
                  if (firstPrayerIndex !== -1) {
                    goToPrayer(firstPrayerIndex);
                  }
                }}
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-silver-gradient rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h4 className="font-heading text-lg text-charcoal mb-1">{item.title}</h4>
                <p className="font-body text-sm text-silver">{item.prayers} Prayer{item.prayers !== 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Prayer Request */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver max-w-2xl mx-auto p-8 bg-gradient-to-br from-white to-platinum/30">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <SilverStar 
                    key={i} 
                    size={16} 
                    className="text-primary-silver" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
            <h3 className="font-heading text-xl text-charcoal mb-4">
              Share Your Prayer
            </h3>
            <p className="font-body text-secondary mb-6">
              Would you like to share a personal prayer or blessing for the couple? 
              Your heartfelt words will be cherished forever.
            </p>
            <button className="btn-silver px-6 py-3 font-medium">
              Submit Prayer
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
          <SilverStar size={40} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 hidden lg:block">
          <SilverHeart size={30} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 hidden lg:block">
          <SilverStar size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Section Divider */}
      <div className="section-divider mt-16" />
    </section>
  );
};

export default PrayerDisplay;