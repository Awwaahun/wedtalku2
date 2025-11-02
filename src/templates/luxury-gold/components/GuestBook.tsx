import React, { useState, useEffect } from 'react';
import { Heart, Send } from 'lucide-react';
import supabase from '../../lib/supabase';

interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const SectionWrapper: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
    <section id={id} className="py-24 px-4 container mx-auto">
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

const GuestBook: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
  
    useEffect(() => {
      fetchMessages();
    }, []);
  
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('guest_book')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
  
      if (!error && data) {
        setMessages(data);
      }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !message.trim()) return;
  
      setSubmitting(true);
  
      try {
        const { error } = await supabase.from('guest_book').insert([{ name: name.trim(), message: message.trim() }]);
        if (error) throw error;
        setName('');
        setMessage('');
        fetchMessages();
      } catch (error) {
        console.error('Error submitting message:', error);
      } finally {
        setSubmitting(false);
      }
    };

    return (
        <SectionWrapper id="guestbook">
            <SectionTitle subtitle="Leave your blessings and warm wishes for us to cherish forever.">
                Guest Book
            </SectionTitle>
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-[#1f213a] border border-gray-700 rounded-lg p-8 mb-12">
                    <div className="space-y-4">
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#1a1a2e] text-white px-4 py-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Your Name"
                        />
                        <textarea
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full bg-[#1a1a2e] text-white px-4 py-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Your message..."
                        ></textarea>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-md hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            <Send size={18} />
                            <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className="border-l-4 border-yellow-500 pl-6 py-2">
                             <p className="text-gray-300 leading-relaxed italic">"{msg.message}"</p>
                             <p className="text-white font-semibold mt-3">- {msg.name}</p>
                             <p className="text-xs text-gray-500 mt-1">
                                {new Date(msg.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
};

export default GuestBook;
