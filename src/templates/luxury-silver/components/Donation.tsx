import React, { useState } from 'react';
import { SilverGift, SilverHeart, SilverDiamond } from './icons';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../index.css';

interface DonationProps {
  config: any;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  logo: string;
}

const Donation: React.FC<DonationProps> = ({ config }) => {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: banksRef, isVisible: banksVisible } = useScrollAnimation();

  const bankAccounts: BankAccount[] = [
    {
      id: 'bca',
      bankName: 'Bank Central Asia',
      accountNumber: '1234567890',
      accountName: 'Alexander William',
      logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png'
    },
    {
      id: 'mandiri',
      bankName: 'Bank Mandiri',
      accountNumber: '0987654321',
      accountName: 'Isabella Rose',
      logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png'
    },
    {
      id: 'bri',
      bankName: 'Bank BRI',
      accountNumber: '1122334455',
      accountName: 'Alexander & Isabella',
      logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/6/68/BANK_BRI_logo.svg/2560px-BANK_BRI_logo.svg.png'
    }
  ];

  const copyToClipboard = async (text: string, bankId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(bankId);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const BankCard = ({ bank, index }: { bank: BankAccount; index: number }) => {
    const { ref, isVisible } = useScrollAnimation();
    
    return (
      <div 
        ref={ref}
        className={`transform transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="card-silver p-6 hover:shadow-silver transition-all duration-300">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4 shadow-soft border border-silver-light">
              <img 
                src={bank.logo} 
                alt={bank.bankName}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h3 className="font-heading text-lg text-charcoal">{bank.bankName}</h3>
              <p className="font-body text-sm text-silver">{bank.accountName}</p>
            </div>
          </div>
          
          <div className="bg-platinum/50 rounded-lg p-4 mb-4">
            <p className="font-body text-sm text-silver mb-1">Account Number</p>
            <div className="flex items-center justify-between">
              <p className="font-elegant text-lg text-charcoal font-medium">{bank.accountNumber}</p>
              <button
                onClick={() => copyToClipboard(bank.accountNumber, bank.id)}
                className="text-primary-silver hover:text-dark-silver transition-colors"
                title="Copy account number"
              >
                {copiedAccount === bank.id ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedBank(bank.id)}
            className="btn-silver w-full text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <section id="donation" className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C0C0C0' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <SilverGift size={56} className="text-primary-silver drop-shadow-lg" />
              <div className="absolute inset-0 bg-primary-silver/20 rounded-full blur-xl scale-150" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-charcoal mb-4">
            Wedding Gift
          </h2>
          <p className="font-body text-lg text-silver max-w-2xl mx-auto">
            Your presence is the greatest gift, but if you wish to bless us further, we accept digital gifts with gratitude
          </p>
        </div>

        {/* Wedding Gift Message */}
        <div className={`max-w-3xl mx-auto mb-12 transition-all duration-700 delay-200 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver bg-gradient-to-br from-platinum/30 to-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <SilverHeart 
                    key={i} 
                    size={20} 
                    className="text-primary-silver" 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
            <h3 className="font-script text-2xl md:text-3xl text-charcoal mb-4 italic">
              "Your love and presence are the most precious gifts"
            </h3>
            <p className="font-body text-secondary leading-relaxed mb-4">
              We believe that the best gift you can give us is your presence and prayers on our special day. 
              However, for those who wish to bless us with a wedding gift, we have provided several convenient options below.
            </p>
            <p className="font-elegant text-silver">
              Thank you for your love and support on our journey together.
            </p>
          </div>
        </div>

        {/* Bank Accounts */}
        <div ref={banksRef} className="grid md:grid-cols-3 gap-6 mb-12">
          {bankAccounts.map((bank, index) => (
            <BankCard key={bank.id} bank={bank} index={index} />
          ))}
        </div>

        {/* Alternative Gift Options */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-500 ${banksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card-silver bg-gradient-to-br from-white to-platinum/30">
            <h3 className="font-heading text-2xl text-charcoal mb-6 text-center">
              Other Ways to Give
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Gift Registry */}
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-charcoal" viewBox="0 0 24 24" fill="none">
                    <path d="M9 2v20M15 2v20M2 9h20M2 15h20" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="font-elegant text-lg text-charcoal mb-2">Gift Registry</h4>
                <p className="font-body text-sm text-silver mb-4">
                  Choose from our curated selection of home items and experiences
                </p>
                <button className="btn-silver text-sm font-medium">
                  View Registry
                </button>
              </div>

              {/* Digital Wallet */}
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-silver-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-charcoal" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="font-elegant text-lg text-charcoal mb-2">Digital Wallet</h4>
                <p className="font-body text-sm text-silver mb-4">
                  Send your blessings through various digital payment platforms
                </p>
                <button className="btn-silver text-sm font-medium">
                  View Options
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${banksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block bg-white/80 backdrop-blur-sm rounded-lg px-8 py-4 shadow-soft border border-silver-light">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <SilverDiamond size={20} className="text-primary-silver" />
              <span className="font-script text-xl text-charcoal italic">
                With love and gratitude,
              </span>
              <SilverDiamond size={20} className="text-primary-silver" />
            </div>
            <p className="font-elegant text-silver">
              Alexander & Isabella
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
          <SilverGift size={40} className="text-primary-silver animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20 hidden lg:block">
          <SilverHeart size={30} className="text-primary-silver animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
          <SilverDiamond size={35} className="text-primary-silver animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 hidden lg:block">
          <SilverGift size={25} className="text-primary-silver animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Bank Detail Modal */}
      {selectedBank && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBank(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const bank = bankAccounts.find(b => b.id === selectedBank);
              if (!bank) return null;
              
              return (
                <div className="p-8">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedBank(null)}
                    className="float-right text-silver hover:text-charcoal transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  
                  {/* Bank Logo */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-medium border border-silver-light">
                      <img 
                        src={bank.logo} 
                        alt={bank.bankName}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <h3 className="font-heading text-xl text-charcoal">{bank.bankName}</h3>
                  </div>
                  
                  {/* Account Details */}
                  <div className="space-y-4">
                    <div className="bg-platinum/50 rounded-lg p-4">
                      <p className="font-body text-sm text-silver mb-2">Account Name</p>
                      <p className="font-elegant text-lg text-charcoal font-medium">{bank.accountName}</p>
                    </div>
                    
                    <div className="bg-platinum/50 rounded-lg p-4">
                      <p className="font-body text-sm text-silver mb-2">Account Number</p>
                      <div className="flex items-center justify-between">
                        <p className="font-elegant text-lg text-charcoal font-medium">{bank.accountNumber}</p>
                        <button
                          onClick={() => copyToClipboard(bank.accountNumber, bank.id)}
                          className="btn-silver text-sm px-3 py-1"
                        >
                          {copiedAccount === bank.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedBank(null)}
                    className="w-full btn-silver mt-6"
                  >
                    Close
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Section Divider */}
      <div className="section-divider mt-16" />
    </section>
  );
};

export default Donation;