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

    if (!error && data) setMessages(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from('guest_book').insert([
        { name: name.trim(), message: message.trim() },
      ]);

      if (error) throw error;

      setName('');
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Gagal mengirim pesan. Coba lagi nanti.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0d1a33] via-[#1a2c55] to-[#223b6c] overflow-hidden">
      {/* efek lembut background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 blur-2xl"
            style={{
              width: `${20 + Math.random() * 50}px`,
              height: `${20 + Math.random() * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4 z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-br from-slate-200/30 to-sky-300/30 p-5 rounded-full mb-4 shadow-inner backdrop-blur-md">
            <Heart className="text-sky-300" size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-slate-100 mb-4">
            Buku Tamu
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Tinggalkan pesan dan doa terbaik untuk pasangan yang berbahagia.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* form box */}
          <form
            onSubmit={handleSubmit}
            className="relative backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl p-8 mb-12 shadow-2xl transition-all duration-500 hover:scale-[1.01]"
          >
            <div className="absolute -inset-3 bg-gradient-to-r from-slate-200/20 via-sky-200/10 to-slate-100/20 rounded-3xl blur-2xl opacity-40" />
            <div className="relative space-y-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-slate-400/30 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Nama Kamu"
              />
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-slate-400/30 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Tuliskan pesan & doa terbaikmu..."
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
              >
                <Send size={18} />
                <span>{submitting ? 'Mengirim...' : 'Kirim Harapan'}</span>
              </button>
            </div>
          </form>

          {/* daftar pesan */}
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className="relative backdrop-blur-lg bg-white/10 border border-slate-400/30 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-300/10 via-sky-300/10 to-slate-200/10 rounded-2xl blur-lg opacity-40" />
                <div className="relative flex items-start">
                  <div className="bg-sky-300/20 p-3 rounded-full mr-4">
                    <Heart
                      className="text-sky-300"
                      size={20}
                      fill="currentColor"
                    />
                  </div>
                  <div className="flex-1 text-slate-100">
                    <h4 className="font-medium text-sky-200 mb-1">{msg.name}</h4>
                    <p className="text-slate-100/90 leading-relaxed">
                      {msg.message}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', {
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
              <div className="text-center py-12 text-slate-400">
                Jadilah yang pertama meninggalkan pesan ❤️
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
