import React, { useState } from 'react';
import { BookOpen, Loader2, Sparkles } from 'lucide-react';
import { generateIslamicWeddingPrayer } from '../../geminiService';

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

const PrayerDisplay: React.FC = () => {
    const [prayer, setPrayer] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleGeneratePrayer = async () => {
      setIsLoading(true);
      setError('');
      setPrayer(null);
      try {
        const generatedPrayer = await generateIslamicWeddingPrayer();
        if (generatedPrayer.startsWith("Maaf")) {
            setError(generatedPrayer);
        } else {
            setPrayer(generatedPrayer);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    const renderPrayer = () => {
      if (!prayer) return null;
      const parts = prayer.split('\n\n');
      return (
        <div className="animate-fade-in text-center">
          <h3 className="text-2xl font-semibold text-yellow-500 mb-4">{parts[0]}</h3>
          <blockquote className="text-lg text-gray-300 leading-relaxed italic">
            <p>"{parts.slice(1).join('\n\n')}"</p>
          </blockquote>
        </div>
      );
    };

    return (
        <SectionWrapper id="prayer">
            <SectionTitle subtitle="Your prayers are a precious gift as we begin our journey. Click below to generate a blessing for our union.">
                A Prayer for Us
            </SectionTitle>
            <div className="max-w-3xl mx-auto bg-[#1f213a] border border-gray-700 rounded-lg p-8 md:p-12 min-h-[300px] flex flex-col justify-center items-center transition-all duration-500">
                {isLoading ? (
                    <div className="flex flex-col items-center text-yellow-500">
                        <Loader2 className="animate-spin" size={48} />
                        <p className="mt-4">Generating a prayer...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">
                        <p>{error}</p>
                        <button onClick={handleGeneratePrayer} className="mt-4 bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-md">Try Again</button>
                    </div>
                ) : prayer ? (
                    <>
                        {renderPrayer()}
                        <button onClick={handleGeneratePrayer} className="mt-8 bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold py-3 px-8 rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-colors flex items-center space-x-2">
                            <Sparkles size={18} />
                            <span>Generate Another Prayer</span>
                        </button>
                    </>
                ) : (
                    <button onClick={handleGeneratePrayer} className="bg-yellow-500 text-gray-900 font-bold py-4 px-10 rounded-full hover:bg-yellow-400 transition-colors flex items-center space-x-2 text-lg">
                        <Sparkles size={22} />
                        <span>Generate a Prayer</span>
                    </button>
                )}
            </div>
        </SectionWrapper>
    );
};

export default PrayerDisplay;
