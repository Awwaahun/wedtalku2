import React from 'react';
import { Heart } from 'lucide-react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

interface StoryProps {
  config: WeddingConfig;
}

const SectionWrapper: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
    <section id={id} className="py-24 px-4 container mx-auto">
        {children}
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl tracking-tight text-white">{children}</h2>
        <div className="w-24 h-px bg-yellow-500 mx-auto mt-4"></div>
    </div>
);

const Story: React.FC<StoryProps> = ({ config }) => {
  return (
    <SectionWrapper id="story">
      <SectionTitle>Our Love Story</SectionTitle>
      <div className="relative max-w-4xl mx-auto">
        {/* Timeline Line */}
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-700 hidden md:block"></div>

        {config.story.map((item, index) => (
          <div key={index} className="md:grid md:grid-cols-2 md:gap-12 mb-16 relative">
            {/* Content */}
            <div className={`flex flex-col items-center md:items-end text-center md:text-right ${index % 2 === 0 ? 'md:order-1' : 'md:order-2 md:items-start md:text-left'}`}>
              <img src={item.image} alt={item.title} className="w-full max-w-sm h-64 object-cover rounded-lg shadow-2xl mb-4 border-4 border-gray-700"/>
            </div>

             {/* Timeline Point */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#1a1a2e] border-4 border-yellow-500 rounded-full hidden md:flex items-center justify-center">
                <Heart size={14} className="text-yellow-500"/>
            </div>

            <div className={`flex flex-col justify-center ${index % 2 === 0 ? 'md:order-2 md:items-start' : 'md:order-1 md:items-end'}`}>
                 <div className="p-6">
                    <p className="text-yellow-500 font-semibold mb-2">{item.date}</p>
                    <h3 className="text-3xl text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.description}</p>
                 </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Story;
