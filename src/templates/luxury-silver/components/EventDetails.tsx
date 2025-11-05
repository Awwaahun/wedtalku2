import { Calendar, MapPin, Clock, Navigation, Phone, Mail, Car, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Event {
  id: string;
  title: string;
  time: string;
  duration: string;
  location: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  color: string;
  bgColor: string;
  iconColor: string;
  ringColor: string;
}

interface WeddingConfig {
  events: Event[];
}

interface EventDetailsProps {
  config: WeddingConfig;
}

const useScrollAnimation = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return { elementRef, isVisible };
};

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
    <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#0b1a34] via-[#1b2d4f] to-[#dfe4ea] overflow-hidden relative">
      {/* Floating Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#a1b2c3]/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#8fa2b8]/30 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-block mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 shadow-md border border-white/30">
              <span className="text-slate-200 font-semibold text-sm">Informasi Acara</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-100 mb-3 sm:mb-4 drop-shadow-lg">Kapan & Dimana</h2>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
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
                  <div className="absolute inset-x-0 h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-full shadow-inner"></div>
                  
                  {/* Animated Progress Track */}
                  <div 
                    className="absolute h-3 bg-gradient-to-r from-[#3a506b] via-[#5bc0be] to-[#c5c6c7] rounded-full shadow-lg transition-all duration-300 ease-out"
                    style={{ 
                      width: `${progress}%`,
                      boxShadow: '0 0 20px rgba(91, 192, 190, 0.5)'
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
                            <div className="w-full h-full rounded-full bg-gradient-to-r from-[#5bc0be] to-[#c5c6c7] opacity-40 animate-ping"></div>
                          </div>
                        )}
                        
                        {/* Main Marker */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#1b2d4f] to-[#3a506b] p-1 shadow-2xl border-2 border-white/30">
                          <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                            <Icon 
                              className={`${activeEvent === index ? 'text-[#5bc0be]' : 'text-slate-300'} transition-colors`} 
                              size={window.innerWidth < 640 ? 20 : window.innerWidth < 1024 ? 24 : 32} 
                            />
                          </div>
                        </div>

                        {/* Time Badge */}
                        <div className={`absolute -bottom-14 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                          activeEvent === index ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-1'
                        }`}>
                          <div className="bg-gradient-to-r from-[#3a506b] to-[#5bc0be] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap border border-white/30">
                            {event.time}
                          </div>
                        </div>

                        {/* Title Label */}
                        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-center whitespace-nowrap transition-all duration-300 ${
                          activeEvent === index ? 'opacity-100' : 'opacity-60'
                        }`}>
                          <span className="text-xs sm:text-sm font-semibold text-slate-200">{event.title}</span>
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
                      <div className="absolute inset-0 bg-[#5bc0be] rounded-full filter blur-md opacity-50 animate-pulse"></div>
                      {/* Vehicle */}
                      <div className="relative bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-full shadow-2xl ring-2 ring-[#5bc0be] border border-white/30 animate-bounce">
                        <Car className="text-[#5bc0be]" size={window.innerWidth < 640 ? 16 : 20} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Percentage */}
                <div className="text-center mt-16 sm:mt-20">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 shadow-md border border-white/20">
                    <Navigation className="text-[#5bc0be]" size={16} />
                    <span className="text-sm font-semibold text-slate-200">
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
                      ? 'bg-gradient-to-br from-[#1b2d4f] to-[#3a506b] text-white shadow-xl scale-105 ring-4 ring-[#5bc0be]/30 border border-white/20'
                      : 'bg-white/10 backdrop-blur-sm text-slate-300 shadow-md hover:shadow-lg border border-white/10'
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
                className={`group bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden transition-all duration-500 cursor-pointer border border-white/20 ${
                  activeEvent === index 
                    ? 'scale-100 sm:scale-105 shadow-2xl ring-4 ring-[#5bc0be]/30' 
                    : 'hover:scale-102 hover:shadow-2xl opacity-90 hover:opacity-100'
                }`}
              >
                {/* Card Header */}
                <div className="relative bg-gradient-to-br from-[#1b2d4f] to-[#3a506b] p-6 sm:p-8 text-white overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px] animate-pulse"></div>
                  </div>

                  {/* Decorative Circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full opacity-10"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl group-hover:scale-110 transition-transform border border-white/30">
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
                <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-transparent to-white/5">
                  {/* Location */}
                  <div className="flex items-start space-x-3 group/item">
                    <div className="bg-[#5bc0be]/20 p-2.5 rounded-xl group-hover/item:scale-110 transition-transform border border-[#5bc0be]/30">
                      <MapPin className="text-[#5bc0be]" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-100 text-sm sm:text-base">{event.location}</p>
                      <p className="text-slate-300 text-xs sm:text-sm mt-0.5 line-clamp-2">{event.address}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed pl-12">
                    {event.description}
                  </p>

                  {/* Contact Actions */}
                  <div className="flex items-center gap-3 pl-12 pt-2">
                    <a 
                      href={`tel:${event.phone}`}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#5bc0be] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone size={14} />
                      <span className="hidden sm:inline">Telepon</span>
                    </a>
                    <div className="w-px h-4 bg-slate-600"></div>
                    <a 
                      href={`mailto:${event.email}`}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#5bc0be] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail size={14} />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3">
                    <button 
                      className="bg-gradient-to-r from-[#3a506b] to-[#5bc0be] text-white py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 border border-white/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MapPin size={16} />
                      <span>Petunjuk</span>
                    </button>
                    <button 
                      className="bg-white/10 backdrop-blur-sm text-slate-200 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center justify-center gap-2 border border-white/20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Calendar size={16} />
                      <span>Simpan</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1.5 sm:h-2 bg-gradient-to-r from-[#3a506b] via-[#5bc0be] to-[#c5c6c7]"></div>
              </div>
            )})}
          </div>

          {/* Info Cards - Responsive Stack */}
          <div className="space-y-4 sm:space-y-6">
            {/* Timeline Summary */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-6 lg:p-8 border border-white/20">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-center">
                <div className="flex items-center gap-3">
                  <div className="bg-[#5bc0be]/20 p-3 rounded-xl border border-[#5bc0be]/30">
                    <Clock className="text-[#5bc0be]" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-100 text-sm sm:text-base">Jadwal Acara</p>
                    <p className="text-xs sm:text-sm text-slate-300">20:00 - 12:00</p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-12 bg-slate-600"></div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#c5c6c7]/20 p-3 rounded-xl border border-[#c5c6c7]/30">
                    <Navigation className="text-[#c5c6c7]" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-100 text-sm sm:text-base">Jarak</p>
                    <p className="text-xs sm:text-sm text-slate-300">~5 KM</p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-12 bg-slate-600"></div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#3a506b]/20 p-3 rounded-xl border border-[#3a506b]/30">
                    <Car className="text-[#3a506b]" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-100 text-sm sm:text-base">Waktu Perjalanan</p>
                    <p className="text-xs sm:text-sm text-slate-300">~15 Menit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation Note */}
            <div className="bg-gradient-to-br from-[#1b2d4f]/50 to-[#3a506b]/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-l-4 border-[#5bc0be] shadow-md">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-[#5bc0be] text-white p-2.5 sm:p-3 rounded-xl shrink-0 shadow-lg">
                  <Info size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-100 mb-2 text-sm sm:text-base">Catatan Transportasi</h4>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
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