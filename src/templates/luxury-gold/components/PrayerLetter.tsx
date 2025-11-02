import React from 'react';
import { BookOpen } from 'lucide-react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

interface PrayerLetterProps {
  config: WeddingConfig;
}

const PrayerLetter: React.FC<PrayerLetterProps> = ({ config }) => {
  return (
    <div className="py-24 bg-[#1f213a]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="text-yellow-500 mx-auto mb-6" size={48} />
            <h2 className="text-4xl md:text-5xl text-white mb-8">A Message From Us</h2>
            
            <div className="text-gray-300 text-lg leading-relaxed space-y-6">
                <p className="italic">"{config.prayerLetter.greeting}"</p>
                <p>{config.prayerLetter.body1}</p>
                <p>{config.prayerLetter.body2}</p>
                <p>{config.prayerLetter.body3}</p>
                <div className="pt-6 border-t border-gray-700/50">
                    <p>{config.prayerLetter.closing}</p>
                    <p className="text-3xl text-white mt-4">
                        {config.couple.groom.name} & {config.couple.bride.name}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerLetter;
