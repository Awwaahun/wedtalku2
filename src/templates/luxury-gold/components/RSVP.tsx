import React, { useState } from 'react';
import { Heart, Send } from 'lucide-react';
import supabase from '../../lib/supabase';

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

const RSVP: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', attending: 'yes', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const { error } = await supabase.from('rsvp').insert([{ 
            name: formData.name, 
            attending: formData.attending === 'yes',
            message: formData.message,
            // Add defaults for other fields if they are required in db
            email: `${formData.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
            guests: 1
        }]);
        if (error) throw error;
        setSubmitted(true);
      } catch (error) {
        console.error('Error submitting RSVP:', error);
      } finally {
        setSubmitting(false);
      }
    };

    if (submitted) {
        return (
            <SectionWrapper id="rsvp">
                <div className="text-center max-w-2xl mx-auto">
                    <Heart className="text-yellow-500 mx-auto mb-6" size={64} fill="currentColor" />
                    <h2 className="text-4xl text-white mb-4">Thank You!</h2>
                    <p className="text-gray-300 text-lg mb-8">Your response has been received. We can't wait to celebrate with you!</p>
                    <button onClick={() => setSubmitted(false)} className="text-yellow-500 hover:underline">Submit another RSVP</button>
                </div>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper id="rsvp">
            <SectionTitle subtitle="Please let us know if you can join our celebration by November 1st, 2025.">
                RSVP
            </SectionTitle>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#1a1a2e] text-white px-4 py-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Will you be attending?</label>
                    <div className="flex space-x-4">
                        <label className="flex-1">
                            <input type="radio" name="attending" value="yes" checked={formData.attending === 'yes'} onChange={(e) => setFormData({ ...formData, attending: e.target.value })} className="sr-only peer"/>
                            <div className="p-4 text-center border border-gray-600 rounded-md cursor-pointer peer-checked:bg-yellow-500 peer-checked:text-gray-900 peer-checked:border-yellow-500 transition-colors">Joyfully Accept</div>
                        </label>
                         <label className="flex-1">
                            <input type="radio" name="attending" value="no" checked={formData.attending === 'no'} onChange={(e) => setFormData({ ...formData, attending: e.target.value })} className="sr-only peer"/>
                            <div className="p-4 text-center border border-gray-600 rounded-md cursor-pointer peer-checked:bg-gray-600 peer-checked:border-gray-500 transition-colors">Regretfully Decline</div>
                        </label>
                    </div>
                </div>
                 <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message (Optional)</label>
                    <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full bg-[#1a1a2e] text-white px-4 py-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-yellow-500 text-gray-900 font-bold py-4 rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    <Send size={20} />
                    <span>{submitting ? 'Submitting...' : 'Submit RSVP'}</span>
                </button>
            </form>
        </SectionWrapper>
    );
};

export default RSVP;
