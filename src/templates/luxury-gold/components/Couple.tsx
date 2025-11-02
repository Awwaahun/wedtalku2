import React from 'react';
import { Heart, Instagram, Mail } from 'lucide-react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

interface CoupleProps {
  config: WeddingConfig;
}

const SectionWrapper: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
    <section id={id} className="min-h-screen py-24 px-4 container mx-auto flex flex-col justify-center">
        {children}
    </section>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl tracking-tight text-white">{children}</h2>
        <div className="w-24 h-px bg-yellow-500 mx-auto mt-4"></div>
    </div>
);


const Couple: React.FC<CoupleProps> = ({ config }) => {
    const { bride, groom } = config.couple;

    const PersonCard: React.FC<{ person: typeof bride | typeof groom, align: 'left' | 'right' }> = ({ person, align }) => {
        const alignment = align === 'left' ? 'md:text-left' : 'md:text-right';
        const itemAlignment = align === 'left' ? 'md:items-start' : 'md:items-end';

        return (
            <div className="flex flex-col items-center">
                 <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full transform scale-105 blur-md opacity-50"></div>
                    <img src={person.image} alt={person.name} className="relative w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-yellow-500 shadow-2xl" />
                 </div>
                 <div className={`text-center ${alignment} ${itemAlignment} flex flex-col`}>
                    <h3 className="text-4xl md:text-5xl text-white">{person.name}</h3>
                    <p className="text-lg text-gray-300 mt-1">{person.fullName}</p>
                    <p className="text-sm text-yellow-500 uppercase tracking-widest mt-4">{person.parents}</p>
                    <p className="text-gray-400 max-w-sm mt-4 leading-relaxed mx-auto md:mx-0">{person.bio}</p>
                    <div className={`flex items-center space-x-4 mt-6 justify-center ${align === 'left' ? 'md:justify-start' : 'md:justify-end'}`}>
                        <a href={`https://instagram.com/${person.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors"><Instagram size={20} /></a>
                        <a href={`mailto:${person.email}`} className="text-gray-400 hover:text-yellow-500 transition-colors"><Mail size={20} /></a>
                    </div>
                 </div>
            </div>
        );
    };

    return (
        <SectionWrapper id="couple">
            <SectionTitle>The Couple</SectionTitle>
            <div className="grid md:grid-cols-3 items-center gap-12 md:gap-8 max-w-6xl mx-auto">
                <PersonCard person={bride} align="right" />
                <div className="text-center text-yellow-500 my-8 md:my-0">
                    <Heart size={60} fill="currentColor" className="mx-auto animate-pulse" style={{ filter: 'drop-shadow(0 0 10px #facc15)'}} />
                </div>
                <PersonCard person={groom} align="left" />
            </div>
        </SectionWrapper>
    );
};

export default Couple;
