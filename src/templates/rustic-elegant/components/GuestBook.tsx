import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Heart } from 'lucide-react';

interface GuestBookProps {
  invitationId: string;
  config?: any;
}

export default function GuestBook({ invitationId, config }: GuestBookProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      message: 'Selamat atas pernikahan kalian! Semoga menjadi keluarga yang bahagia selamanya.',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Michael Chen',
      message: 'Wah akhirnya! Selamat menempuh hidup baru ya John dan Jane. Semoga sakinah mawaddah warahmah.',
      date: '2024-01-14'
    },
    {
      id: 3,
      name: 'Andi Wijaya',
      message: 'Keren banget acaranya! Sukses selalu untuk pernikahan kalian.',
      date: '2024-01-13'
    }
  ]);
  const [newMessage, setNewMessage] = useState({
    name: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.name.trim() || !newMessage.message.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const messageToAdd = {
      id: messages.length + 1,
      name: newMessage.name,
      message: newMessage.message,
      date: new Date().toISOString().split('T')[0]
    };
    
    setMessages([messageToAdd, ...messages]);
    setNewMessage({ name: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <section className="rustic-section bg-[var(--rustic-cream)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-[var(--rustic-primary)] mb-4 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Buku Tamu
          </h2>
          <div className="rustic-divider rustic-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          <p className={`text-lg text-[var(--rustic-secondary)] mt-6 max-w-2xl mx-auto rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Tinggalkan pesan dan ucapan untuk kami
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Message Form */}
          <div className={`mb-12 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <div className="rustic-card">
              <h3 className="text-xl font-bold text-[var(--rustic-primary)] mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-[var(--rustic-gold)]" />
                Tulis Ucapan
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[var(--rustic-primary)] font-semibold mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nama
                  </label>
                  <input
                    type="text"
                    value={newMessage.name}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, name: e.target.value }))}
                    className="rustic-input"
                    placeholder="Nama Anda"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[var(--rustic-primary)] font-semibold mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Pesan / Ucapan
                  </label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="rustic-input resize-none"
                    placeholder="Tuliskan ucapan selamat atau pesan untuk mempelai..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rustic-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="rustic-loading w-5 h-5 mr-3"></div>
                      Mengirim...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="w-5 h-5 mr-3" />
                      Kirim Ucapan
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-6">
            <h3 className={`text-2xl font-bold text-[var(--rustic-primary)] mb-8 text-center rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              Ucapan dari Tamu Undangan
            </h3>
            
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`rustic-card rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--rustic-accent)] to-[var(--rustic-beige)] rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-[var(--rustic-primary)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-[var(--rustic-primary)]">{message.name}</h4>
                      <span className="text-sm text-[var(--rustic-secondary)]">{message.date}</span>
                    </div>
                    <p className="text-[var(--rustic-brown)] leading-relaxed">{message.message}</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-[var(--rustic-gold)]" />
                      <span className="text-sm text-[var(--rustic-secondary)]">Suka</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button className="rustic-btn" disabled>
              Muat Lebih Banyak
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}