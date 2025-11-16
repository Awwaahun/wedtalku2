import React, { useState } from 'react';
import { SilverHeart, SilverEnvelope, SilverDiamond } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface RSVPProps {
  config?: any;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  attendance: 'yes' | 'no' | '';
  guests: number;
  message: string;
  dietaryRestrictions: string;
}

const RSVP: React.FC<RSVPProps> = ({ config }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    attendance: '',
    guests: 1,
    message: '',
    dietaryRestrictions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      attendance: '',
      guests: 1,
      message: '',
      dietaryRestrictions: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <section id="rsvp" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div ref={ref} className={`max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="card-silver text-center p-12 bg-gradient-to-br from-platinum/30 to-white">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <SilverHeart size={64} className="text-primary-silver drop-shadow-lg" />
                  <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
                </div>
              </div>
              <h2 className="font-heading text-3xl text-charcoal mb-4">
                Thank You!
              </h2>
              <p className="font-body text-lg text-secondary mb-6">
                Your RSVP has been successfully submitted. We're so excited to celebrate with you!
              </p>
              <div className="bg-platinum/50 rounded-lg p-6 mb-6">
                <p className="font-elegant text-charcoal mb-2">
                  Confirmation sent to: <span className="font-medium">{formData.email}</span>
                </p>
                <p className="font-body text-silver text-sm">
                  We'll send you a reminder closer to the event date.
                </p>
              </div>
              <button
                onClick={resetForm}
                className="btn-silver px-6 py-3 font-medium"
              >
                Submit Another RSVP
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverEnvelope size={56} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            RSVP
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            Kindly respond by December 1, 2025. We look forward to celebrating with you!
          </p>
        </div>

        {/* RSVP Form */}
        <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver bg-gradient-to-br from-platinum/30 to-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-heading text-xl text-charcoal mb-4">Personal Information</h3>
                
                <div>
                  <label htmlFor="name" className="block font-body text-sm font-medium text-charcoal mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent bg-white/80 backdrop-blur-sm text-charcoal placeholder-silver/50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-charcoal mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent bg-white/80 backdrop-blur-sm text-charcoal placeholder-silver/50"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-body text-sm font-medium text-charcoal mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent bg-white/80 backdrop-blur-sm text-charcoal placeholder-silver/50"
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </div>

              {/* Attendance */}
              <div>
                <label className="block font-body text-sm font-medium text-charcoal mb-2">
                  Will you attend? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative">
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={formData.attendance === 'yes'}
                      onChange={handleInputChange}
                      required
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-primary-silver peer-checked:bg-primary-silver/10 border-silver-light bg-white/80 backdrop-blur-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <SilverHeart size={20} className="text-primary-silver" />
                        <span className="font-body text-charcoal font-medium">Yes, I'll be there!</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative">
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={formData.attendance === 'no'}
                      onChange={handleInputChange}
                      required
                      className="sr-only peer"
                    />
                    <div className="p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-primary-silver peer-checked:bg-primary-silver/10 border-silver-light bg-white/80 backdrop-blur-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 text-silver" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span className="font-body text-charcoal font-medium">Sorry, can't make it</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Number of Guests */}
              {formData.attendance === 'yes' && (
                <div>
                  <label htmlFor="guests" className="block font-body text-sm font-medium text-charcoal mb-2">
                    Number of Guests (including yourself)
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent bg-white/80 backdrop-blur-sm text-charcoal"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dietary Restrictions */}
              {formData.attendance === 'yes' && (
                <div>
                  <label htmlFor="dietaryRestrictions" className="block font-body text-sm font-medium text-charcoal mb-2">
                    Dietary Restrictions (if any)
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent bg-white/80 backdrop-blur-sm text-charcoal placeholder-silver/50"
                    placeholder="e.g., Vegetarian, Allergies, etc."
                  />
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="message" className="block font-body text-sm font-medium text-charcoal mb-2">
                  Message for the Couple (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent bg-white/80 backdrop-blur-sm text-charcoal placeholder-silver/50 resize-none"
                  placeholder="Share your wishes or memories with us..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.attendance}
                className="w-full btn-silver py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <SilverEnvelope size={20} />
                    <span>Submit RSVP</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className={`max-w-4xl mx-auto mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver bg-gradient-to-br from-white to-platinum/30 p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-charcoal" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <h4 className="font-elegant text-lg text-charcoal mb-2">Privacy Protected</h4>
                <p className="font-body text-sm text-silver">Your information is secure and will only be used for wedding purposes</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-charcoal" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="font-elegant text-lg text-charcoal mb-2">RSVP Deadline</h4>
                <p className="font-body text-sm text-silver">December 1, 2025 - helps us with proper arrangements</p>
              </div>
              
              <div>
                <div className="w-12 h-12 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-charcoal" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="font-elegant text-lg text-charcoal mb-2">Need Help?</h4>
                <p className="font-body text-sm text-silver">Contact us at rsvp@wedding.com for any questions</p>
              </div>
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

      {/* Section Divider */}
      <div className="section-divider mt-16" />
    </section>
  );
};

export default RSVP;