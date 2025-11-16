import React, { useState, useEffect } from 'react';
import { SilverHeart, SilverDiamond, SilverEnvelope } from './icons';
import '../index.css';

interface InvitationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  config: any;
  guestName?: string | null;
}

const InvitationModal: React.FC<InvitationModalProps> = ({ 
  isOpen, 
  onOpen, 
  config, 
  guestName 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const groomName = config?.couple?.groom?.name || 'Alexander';
  const brideName = config?.couple?.bride?.name || 'Isabella';

  useEffect(() => {
    console.log('📨 InvitationModal mounted, isOpen:', isOpen);
    if (isOpen) {
      // Force body overflow hidden
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
      setTimeout(() => setShowContent(true), 300);
    } else {
      setShowContent(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Force render if isOpen is true
  if (!isOpen && !isAnimating) {
    console.log('❌ Modal not rendering - isOpen:', isOpen, 'isAnimating:', isAnimating);
    return null;
  }

  console.log('✅ Modal rendering - isOpen:', isOpen);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ display: 'flex' }} // Force display
    >
      {/* Debug overlay */}
      <div className="fixed top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded z-[101]">
        InvitationModal Active
      </div>

      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onOpen}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden transform transition-all duration-500 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Silver Frame Border */}
        <div className="absolute inset-0 border-4 border-primary-silver rounded-2xl pointer-events-none" />
        <div className="absolute -inset-2 border-2 border-silver-light rounded-2xl pointer-events-none" />
        
        {/* Decorative Corners */}
        <div className="absolute top-2 left-2">
          <SilverDiamond size={20} className="text-primary-silver" />
        </div>
        <div className="absolute top-2 right-2">
          <SilverDiamond size={20} className="text-primary-silver" />
        </div>
        <div className="absolute bottom-2 left-2">
          <SilverDiamond size={20} className="text-primary-silver" />
        </div>
        <div className="absolute bottom-2 right-2">
          <SilverDiamond size={20} className="text-primary-silver" />
        </div>

        {/* Header */}
        <div className="bg-silver-gradient p-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <SilverEnvelope size={32} className="text-white drop-shadow-lg" />
            </div>
          </div>
          <h2 className="font-script text-3xl text-white drop-shadow-lg mb-2">
            Wedding Invitation
          </h2>
          <p className="font-elegant text-white/90 text-sm">
            You're Invited!
          </p>
        </div>

        {/* Content */}
        <div className={`p-8 text-center transition-all duration-700 delay-200 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {/* Greeting */}
          <div className="mb-6">
            {guestName ? (
              <div>
                <p className="font-elegant text-lg text-silver mb-2">Kepada Yth.</p>
                <p className="font-heading text-2xl text-charcoal mb-2">{guestName}</p>
                <div className="w-16 h-0.5 bg-silver-gradient mx-auto"></div>
              </div>
            ) : (
              <div>
                <p className="font-script text-2xl text-charcoal mb-2">
                  Dear Valued Guest,
                </p>
                <div className="w-16 h-0.5 bg-silver-gradient mx-auto"></div>
              </div>
            )}
          </div>

          {/* Couple Names */}
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="text-center">
                <p className="font-script text-2xl text-charcoal">{groomName}</p>
              </div>
              <SilverHeart size={24} className="text-primary-silver" />
              <div className="text-center">
                <p className="font-script text-2xl text-charcoal">{brideName}</p>
              </div>
            </div>
            <p className="font-elegant text-silver italic">
              Together with their families
            </p>
          </div>

          {/* Wedding Details */}
          <div className="bg-platinum/30 rounded-lg p-4 mb-6">
            <p className="font-elegant text-charcoal mb-2">Request the pleasure of your company</p>
            <p className="font-body text-silver mb-1">Saturday, December 15, 2025</p>
            <p className="font-body text-silver">At their wedding ceremony</p>
          </div>

          {/* Message */}
          <p className="font-body text-secondary text-sm mb-8 leading-relaxed">
            Your presence is the greatest gift you could give us on our special day. 
            We look forward to celebrating this joyous occasion with you!
          </p>

          {/* Open Button */}
          <button
            onClick={onOpen}
            className="btn-silver px-8 py-4 font-medium text-lg w-full inline-flex items-center justify-center space-x-2 transform hover:scale-105 transition-all duration-300"
          >
            <span>Open Invitation</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Additional Text */}
          <p className="font-elegant text-silver text-xs mt-6">
            Click to explore our complete wedding invitation
          </p>
        </div>

        {/* Footer */}
        <div className="bg-platinum/20 p-4 text-center border-t border-silver-light">
          <div className="flex justify-center space-x-2">
            <SilverHeart size={12} className="text-primary-silver" />
            <span className="font-body text-xs text-silver">With love and gratitude</span>
            <SilverHeart size={12} className="text-primary-silver" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;