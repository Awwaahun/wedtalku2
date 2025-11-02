import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

interface EventDetailsProps {
  config: WeddingConfig;
}

const SectionWrapper: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
    <section id={id} className="min-h-screen py-24 px-4 container mx-auto flex flex-col justify-center">
        {children}
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode; subtitle: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl tracking-tight text-white">{children}</h2>
         <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{subtitle}</p>
        <div className="w-24 h-px bg-yellow-500 mx-auto mt-4"></div>
    </div>
);

const EventDetails: React.FC<EventDetailsProps> = ({ config }) => {
  return (
    <SectionWrapper id="event">
      <SectionTitle subtitle="Join us as we celebrate the beginning of our forever.">
        The Wedding Event
      </SectionTitle>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {config.events.map((event) => (
          <div key={event.id} className="bg-[#1f213a] border border-gray-700/50 rounded-lg p-8 text-center flex flex-col items-center">
            <div className="border-2 border-yellow-500 rounded-full p-5 mb-6">
                {event.id === 'akad' ? <Calendar className="text-yellow-500" size={40} /> : <Clock className="text-yellow-500" size={40}/>}
            </div>
            <h3 className="text-4xl text-white mb-2">{event.title}</h3>
            <p className="text-lg font-semibold text-yellow-500 mb-4">{`${config.wedding.dateDisplay} • ${event.time}`}</p>
            <div className="flex items-center text-gray-400 mb-4">
                <MapPin size={16} className="mr-2"/>
                <span>{event.location}</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">{event.description}</p>
            <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto inline-block bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-8 rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-colors"
            >
                View Map
            </a>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default EventDetails;
