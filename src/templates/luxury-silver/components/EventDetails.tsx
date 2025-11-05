
import { Calendar, MapPin, Clock, Navigation, Phone, Mail, Car, Info } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';

interface EventDetailsProps {
  config: WeddingConfig;
}

export default function EventDetails({ config }: EventDetailsProps) {
  const [activeEvent, setActiveEvent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const events = config.events;

  useEffect(() => {
    if (!isAnimating) return;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.5;
        if (newProgress >= 100) {
          setTimeout(() => setProgress(0), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [isAnimating]);

  useEffect(() => {
    if (progress > 50) {
      setActiveEvent(1);
    } else if (progress < 50) {
      setActiveEvent(0);
    }
  }, [progress]);

  const { elementRef, isVisible } = useScrollAnimation();
  
  const getIconForEvent = (title: string) => {
    if (title.toLowerCase().includes('akad')) return Calendar;
    if (title.toLowerCase().includes('resepsi')) return Clock;
    return Info;
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 overflow-hidden relative">
      {/* Floating Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-rose-300 rounded-full filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-300 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-block mb-4">
            <div className="bg-white rounded-full px-6 py-2 shadow-md">
              <span className="text-rose-600 font-semibold text-sm">Informasi Acara</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-3 sm:mb-4">Kapan & Dimana</h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Ikuti perjalanan kami melalui hari yang sempurna
          </p>
        </div>

        <div 
          ref={elementRef}
          className={`max-w-7xl mx-auto animate-on-scroll ${isVisible ? 'visible' : ''}`}
        >
          {/* Interactive Timeline Map */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            {/* Desktop & Tablet Timeline */}
            <div className="hidden sm:block">
              <div className="relative px-4 sm:px-8 lg:px-12 py-8">
                {/* Main Track */}
                <div className="relative h-24 sm:h-32 flex items-center">
                  {/* Background Track */}
                  <div className="absolute inset-x-0 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-inner"></div>
                  
                  {/* Animated Progress Track */}
                  <div 
                    className="absolute h-3 bg-gradient-to-r from-rose-500 via-pink-400 to-orange-500 rounded-full shadow-lg transition-all duration-300 ease-out"
                    style={{ 
                      width: `${progress}%`,
                      boxShadow: '0 0 20px rgba(244, 63, 94, 0.5)'
                    }}
                  >
                    {/* Glowing End */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full animate-pulse"></div>
                  </div>

                  {/* Event Markers */}
                  {events.map((event, index) => {
                    const Icon = getIconForEvent(event.title);
                    return (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveEvent(index);
                        setIsAnimating(false);
                        setTimeout(() => setIsAnimating(true), 3000);
                      }}
                      className={`absolute z-10 transition-all duration-500 transform ${
                        index === 0 ? 'left-0' : 'right-0'
                      } ${activeEvent === index ? 'scale-110' : 'scale-100 hover:scale-105'}`}
                    >
                      {/* Marker Container */}
                      <div className="relative">
                        {/* Pulse Ring */}
                        {activeEvent === index && (
                          <div className="absolute inset-0 -m-2">
                            <div className={`w-full h-full rounded-full bg-gradient-to-r ${event.color} opacity-40 animate-ping`}></div>
                          </div>
                        )}
                        
                        {/* Main Marker */}
                        <div className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br ${event.color} p-1 shadow-2xl`}>
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                            <Icon 
                              className={`${activeEvent === index ? event.iconColor : 'text-gray-400'} transition-colors`} 
                              size={window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 24 : 32} 
                            />
                          </div>
                        </div>

                        {/* Time Badge */}
                        <div className={`absolute -bottom-14 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                          activeEvent === index ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'
                        }`}>
                          <div className={`bg-gradient-to-r ${event.color} text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap`}>
                            {event.time}
                          </div>
                        </div>

                        {/* Title Label */}
                        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap transition-all duration-300 ${
                          activeEvent === index ? 'opacity-100' : 'opacity-60'
                        }`}>
                          <span className="text-xs sm:text-sm font-semibold text-gray-700">{event.title}</span>
                        </div>
                      </div>
                    </button>
                  )})}

                  {/* Moving Vehicle */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ease-out z-20"
                    style={{ left: `${progress}%` }}
                  >
                    <div className="relative">
                      {/* Vehicle Shadow */}
                      <div className="absolute inset-0 bg-rose-500 rounded-full filter blur-md opacity-50 animate-pulse"></div>
                      {/* Vehicle */}
                      <div className="relative bg-white p-2.5 sm:p-3 rounded-full shadow-2xl ring-2 ring-rose-400 animate-bounce">
                        <Car className="text-rose-600" size={window.innerWidth < 640 ? 16 : 20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Percentage */}
                <div className="text-center mt-16 sm:mt-20">
                  <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md">
                    <Navigation className="text-rose-600" size={16} />
                    <span className="text-sm font-semibold text-gray-700">
                      Perjalanan: {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Quick Switcher */}
            <div className="sm:hidden flex gap-3 px-4 mb-8">
              {events.map((event, index) => {
                 const Icon = getIconForEvent(event.title);
                 return (
                <button
                  key={index}
                  onClick={() => setActiveEvent(index)}
                  className={`flex-1 py-4 rounded-2xl transition-all duration-300 ${
                    activeEvent === index
                      ? `bg-gradient-to-br ${event.color} text-white shadow-xl scale-105 ring-4 ${event.ringColor} ring-opacity-30`
                      : 'bg-white text-gray-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Icon className="mx-auto mb-2" size={24} />
                  <div className="text-xs font-bold">{event.time}</div>
                  <div className="text-[10px] opacity-80">{event.duration}</div>
                </button>
              )})}
            </div>
          </div>

          {/* Event Cards - Responsive Grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {events.map((event, index) => {
              const Icon = getIconForEvent(event.title);
              return (
              <div
                key={index}
                onClick={() => setActiveEvent(index)}
                className={`group bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 cursor-pointer ${
                  activeEvent === index 
                    ? `scale-100 sm:scale-105 shadow-2xl ring-4 ${event.ringColor}` 
                    : 'hover:scale-102 hover:shadow-2xl opacity-90 hover:opacity-100'
                }`}
              >
                {/* Card Header */}
                <div className={`relative bg-gradient-to-br ${event.color} p-6 sm:p-8 text-white overflow-hidden`}>
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px] animate-pulse"></div>
                  </div>

                  {/* Decorative Circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full opacity-10"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl group-hover:scale-110 transition-transform">
                        <Icon size={28} />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-bold tracking-tight">{event.time}</div>
                        <div className="text-sm opacity-90 mt-1">{event.duration}</div>
                      </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">{event.title}</h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Location */}
                  <div className="flex items-start space-x-3 group/item">
                    <div className={`${event.bgColor} p-2.5 rounded-xl group-hover/item:scale-110 transition-transform`}>
                      <MapPin className={event.iconColor} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm sm:text-base">{event.location}</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-0.5 line-clamp-2">{event.address}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed pl-12">
                    {event.description}
                  </p>

                  {/* Contact Actions */}
                  <div className="flex items-center gap-3 pl-12 pt-2">
                    <a 
                      href={`tel:${event.phone}`}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-rose-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={14} />
                      <span className="hidden sm:inline">Telepon</span>
                    </a>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <a 
                      href={`mailto:${event.email}`}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-rose-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail size={14} />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3">
                    <button 
                      className={`bg-gradient-to-r ${event.color} text-white py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MapPin size={16} />
                      <span>Petunjuk</span>
                    </button>
                    <button 
                      className="bg-gray-100 text-gray-800 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:bg-gray-200 hover:scale-105 flex items-center justify-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Calendar size={16} />
                      <span>Simpan</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${event.color}`}></div>
              </div>
            )})}
          </div>

          {/* Info Cards - Responsive Stack */}
          <div className="space-y-4 sm:space-y-6">
            {/* Timeline Summary */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 lg:p-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-center">
                <div className="flex items-center gap-3">
                  <div className="bg-rose-100 p-3 rounded-xl">
                    <Clock className="text-rose-600" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm sm:text-base">Jadwal Acara</p>
                    <p className="text-xs sm:text-sm text-gray-600">20:00 - 12:00</p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <Navigation className="text-orange-600" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm sm:text-base">Jarak</p>
                    <p className="text-xs sm:text-sm text-gray-600">~5 KM</p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-3 rounded-xl">
                    <Car className="text-pink-600" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800 text-sm sm:text-base">Waktu Perjalanan</p>
                    <p className="text-xs sm:text-sm text-gray-600">~15 Menit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation Note */}
            <div className="bg-gradient-to-br from-rose-100 via-pink-100 to-orange-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-l-4 border-rose-500 shadow-md">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-rose-500 text-white p-2.5 sm:p-3 rounded-xl shrink-0">
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Catatan Transportasi</h4>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                    Layanan antar-jemput tersedia antar lokasi. Tempat parkir gratis di kedua venue. 
                    Kami sarankan tiba 15 menit lebih awal untuk kenyamanan Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
