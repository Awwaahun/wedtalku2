import React, { useState, useEffect } from 'react';
import { SilverHeart, SilverEnvelope, SilverDiamond } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  date: string;
  avatar?: string;
}

const GuestBook: React.FC = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: messagesRef, isVisible: messagesVisible } = useScrollAnimation();
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation();

  useEffect(() => {
    // Load initial messages
    const initialMessages: GuestMessage[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        message: 'Congratulations on your wedding! May your love story continue to inspire everyone around you. Wishing you a lifetime of happiness together!',
        date: '2024-11-10',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Michael Chen',
        message: 'So happy for both of you! Your journey together has been beautiful to witness. Here\'s to many more years of love and laughter!',
        date: '2024-11-08',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      {
        id: '3',
        name: 'Emma Thompson',
        message: 'Congratulations! May your marriage be filled with all the right ingredients: a heap of love, a dash of humor, a touch of romance, and a spoonful of understanding.',
        date: '2024-11-05',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    ];
    setMessages(initialMessages);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMessage: GuestMessage = {
      id: Date.now().toString(),
      name: formData.name,
      message: formData.message,
      date: new Date().toISOString().split('T')[0]
    };
    
    setMessages(prev => [newMessage, ...prev]);
    setFormData({ name: '', message: '' });
    setIsSubmitting(false);
  };

  const MessageCard = ({ message, index }: { message: GuestMessage; index: number }) => {
    const { ref, isVisible } = useScrollAnimation();
    
    return (
      <div 
        ref={ref}
        className={`transform transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="card-silver p-6 hover:shadow-silver transition-all duration-300">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message.avatar ? (
                <img 
                  src={message.avatar} 
                  alt={message.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-silver/30"
                />
              ) : (
                <div className="w-12 h-12 bg-silver-gradient rounded-full flex items-center justify-center">
                  <span className="text-charcoal font-heading text-lg font-bold">
                    {message.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Message Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-heading text-lg text-charcoal">{message.name}</h4>
                <span className="font-body text-sm text-silver">
                  {new Date(message.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <p className="font-body text-secondary leading-relaxed">
                {message.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23C0C0C0' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverEnvelope size={56} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Guest Book
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            Leave your heartfelt wishes and memories for the happy couple
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Messages Section */}
          <div className="lg:col-span-2">
            <div ref={messagesRef} className={`transition-all duration-700 delay-200 ${messagesVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h3 className="font-heading text-2xl text-charcoal mb-6">
                Messages from Loved Ones
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <MessageCard key={message.id} message={message} index={index} />
                  ))
                ) : (
                  <div className="card-silver text-center p-8">
                    <SilverHeart size={48} className="text-primary-silver mx-auto mb-4 opacity-50" />
                    <p className="font-body text-silver">
                      No messages yet. Be the first to share your wishes!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-1">
            <div ref={formRef} className={`transition-all duration-700 delay-300 ${formVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="card-silver bg-gradient-to-br from-platinum/30 to-white">
                <h3 className="font-heading text-xl text-charcoal mb-6">
                  Share Your Wishes
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block font-body text-sm font-medium text-charcoal mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent bg-white/80 backdrop-blur-sm text-charcoal placeholder-silver/50"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-body text-sm font-medium text-charcoal mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent bg-white/80 backdrop-blur-sm text-charcoal placeholder-silver/50 resize-none"
                      placeholder="Share your heartfelt wishes for the couple..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-silver py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-charcoal"></div>
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <SilverHeart size={16} />
                        <span>Post Message</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Tips */}
                <div className="mt-6 p-4 bg-platinum/30 rounded-lg">
                  <p className="font-body text-xs text-silver leading-relaxed">
                    <span className="font-medium">Tips:</span> Share your favorite memory with the couple, 
                    offer marriage advice, or simply express your joy for their special day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-500 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-soft border border-silver-light">
            <div className="flex items-center space-x-2">
              <SilverDiamond size={20} className="text-primary-silver" />
              <span className="font-body text-charcoal">
                <span className="font-bold text-lg">{messages.length}</span> Messages
              </span>
            </div>
            <div className="h-6 w-px bg-silver-light" />
            <div className="flex items-center space-x-2">
              <SilverHeart size={20} className="text-primary-silver" />
              <span className="font-body text-charcoal">
                <span className="font-bold text-lg">∞</span> Love
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
          <SilverEnvelope size={40} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 hidden lg:block">
          <SilverHeart size={30} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 hidden lg:block">
          <SilverEnvelope size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>
    </section>
  );
};

export default GuestBook;