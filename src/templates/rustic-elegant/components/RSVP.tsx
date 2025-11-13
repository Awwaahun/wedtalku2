import React, { useState, useEffect } from 'react';
import { CheckCircle, Send, User, Mail, Phone, Users } from 'lucide-react';

interface RSVPProps {
  config?: any;
}

export default function RSVP({ config }: RSVPProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    attendance: 'yes',
    guests: '1',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="rustic-section bg-[var(--rustic-cream)]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="rustic-card text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-[var(--rustic-primary)] mb-4">
                Terima Kasih!
              </h2>
              <p className="text-[var(--rustic-secondary)] leading-relaxed">
                Konfirmasi kehadiran Anda telah kami terima. Kami sangat menantikan kehadiran Anda di hari bahagia kami.
              </p>
              <button 
                className="rustic-btn mt-6"
                onClick={() => setSubmitted(false)}
              >
                RSVP Lagi
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rustic-section bg-[var(--rustic-cream)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-[var(--rustic-primary)] mb-4 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            RSVP
          </h2>
          <div className="rustic-divider rustic-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          <p className={`text-lg text-[var(--rustic-secondary)] mt-6 max-w-2xl mx-auto rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Mohon konfirmasi kehadiran Anda untuk membantu kami dalam persiapan acara
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.4s' }}>
              <div className="rustic-card">
                <label className="block text-[var(--rustic-primary)] font-semibold mb-3">
                  <User className="w-4 h-4 inline mr-2" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="rustic-input"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.5s' }}>
              <div className="rustic-card">
                <label className="block text-[var(--rustic-primary)] font-semibold mb-3">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="rustic-input"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.6s' }}>
              <div className="rustic-card">
                <label className="block text-[var(--rustic-primary)] font-semibold mb-3">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="rustic-input"
                  placeholder="0812-3456-7890"
                />
              </div>
            </div>

            {/* Attendance Selection */}
            <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.7s' }}>
              <div className="rustic-card">
                <label className="block text-[var(--rustic-primary)] font-semibold mb-3">
                  Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border-2 border-[var(--rustic-accent)] rounded-lg cursor-pointer hover:bg-[var(--rustic-beige)] transition-colors">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={formData.attendance === 'yes'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-[var(--rustic-primary)]">Hadir</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-[var(--rustic-accent)] rounded-lg cursor-pointer hover:bg-[var(--rustic-beige)] transition-colors">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={formData.attendance === 'no'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <span className="text-[var(--rustic-primary)]">Tidak Hadir</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Number of Guests */}
            {formData.attendance === 'yes' && (
              <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.8s' }}>
                <div className="rustic-card">
                  <label className="block text-[var(--rustic-primary)] font-semibold mb-3">
                    <Users className="w-4 h-4 inline mr-2" />
                    Jumlah Tamu
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="rustic-input"
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3 Orang</option>
                    <option value="4">4 Orang</option>
                    <option value="5">5 Orang</option>
                  </select>
                </div>
              </div>
            )}

            {/* Message */}
            <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.9s' }}>
              <div className="rustic-card">
                <label className="block text-[var(--rustic-primary)] font-semibold mb-3">
                  Pesan untuk Mempelai
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="rustic-input resize-none"
                  placeholder="Tuliskan pesan atau ucapan selamat untuk kami..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '1s' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rustic-btn w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="rustic-loading w-5 h-5 mr-3"></div>
                    Mengirim...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-3" />
                    Kirim Konfirmasi
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className={`text-center mt-8 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1.1s' }}>
            <div className="rustic-card bg-[var(--rustic-beige)]">
              <p className="text-[var(--rustic-secondary)] leading-relaxed">
                Mohon konfirmasi kehadiran Anda paling lambat 7 hari sebelum acara. 
                Terima kasih atas partisipasi Anda!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}