import { useState, useEffect } from 'react';
import { Heart, Send } from 'lucide-react';
import supabase from '../lib/supabase';

interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function GuestBook() {
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
      const { error } = await supabase.from('guest_book').insert([
        {
          name: name.trim(),
          message: message.trim(),
        },
      ]);

      if (error) throw error;

      setName('');
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to submit message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Buku Tamu</h2>
          <p className="text-gray-600">Tinggalkan pesan dan doa untuk pasangan yang berbahagia</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Submit Form */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-8 mb-12 hover:shadow-lg transition-shadow duration-300">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Nama Kamu"
                />
              </div>
              <div>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Apa Harapan Kamu..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
              >
                <Send size={18} />
                <span>{submitting ? 'Kirim...' : 'Kirim Harapan'}</span>
              </button>
            </div>
          </form>

          {/* Messages List */}
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:scale-102 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start">
                  <div className="bg-rose-100 p-3 rounded-full mr-4 hover:bg-rose-200 transition-colors">
                    <Heart className="text-rose-600 hover:scale-110 transition-transform" size={20} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-1">{msg.name}</h4>
                    <p className="text-gray-600 leading-relaxed">{msg.message}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(msg.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Be the first to leave a message!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
