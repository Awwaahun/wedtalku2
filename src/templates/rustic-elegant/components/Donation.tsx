import React, { useState, useEffect } from 'react';
import { Gift, Heart, Wallet, Copy } from 'lucide-react';

interface DonationProps {
  config?: any;
}

export default function Donation({ config }: DonationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const donationAccounts = [
    {
      bank: 'BCA',
      accountName: 'John Doe',
      accountNumber: '1234567890',
      logo: '🏦'
    },
    {
      bank: 'Mandiri',
      accountName: 'Jane Smith',
      accountNumber: '0987654321',
      logo: '🏛️'
    },
    {
      bank: 'DANA',
      accountName: '+62 812-3456-7890',
      accountNumber: '+62 812-3456-7890',
      logo: '💳'
    },
    {
      bank: 'GoPay',
      accountName: '+62 812-3456-7890',
      accountNumber: '+62 812-3456-7890',
      logo: '💵'
    }
  ];

  const copyToClipboard = async (accountNumber: string, bank: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(bank);
      setTimeout(() => setCopiedAccount(null), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <section className="rustic-section bg-[var(--rustic-beige)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-[var(--rustic-primary)] mb-4 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            Hadiah &amp; Donasi
          </h2>
          <div className="rustic-divider rustic-fade-in-up" style={{ animationDelay: '0.2s' }}></div>
          <p className={`text-lg text-[var(--rustic-secondary)] mt-6 max-w-2xl mx-auto rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            Kehadiran Anda adalah hadiah terindah, namun jika Anda berkenan memberikan tanda kasih, kami menyediakan beberapa opsi
          </p>
        </div>

        {/* Wedding Gift Registry */}
        <div className={`mb-16 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <div className="rustic-card max-w-4xl mx-auto">
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-[var(--rustic-gold)] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-4">
                Wedding Registry
              </h3>
              <p className="text-[var(--rustic-secondary)] mb-6">
                Kami telah membuat daftar hadiah yang kami inginkan untuk membantu Anda memilih
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border-2 border-[var(--rustic-accent)] rounded-lg hover:bg-[var(--rustic-cream)] transition-colors">
                  <div className="text-3xl mb-3">🏠</div>
                  <h4 className="font-semibold text-[var(--rustic-primary)] mb-2">Home &amp; Living</h4>
                  <p className="text-sm text-[var(--rustic-secondary)]">Peralatan rumah tangga</p>
                </div>
                <div className="text-center p-6 border-2 border-[var(--rustic-accent)] rounded-lg hover:bg-[var(--rustic-cream)] transition-colors">
                  <div className="text-3xl mb-3">✈️</div>
                  <h4 className="font-semibold text-[var(--rustic-primary)] mb-2">Honeymoon Fund</h4>
                  <p className="text-sm text-[var(--rustic-secondary)]">Dukungan bulan madu</p>
                </div>
                <div className="text-center p-6 border-2 border-[var(--rustic-accent)] rounded-lg hover:bg-[var(--rustic-cream)] transition-colors">
                  <div className="text-3xl mb-3">💝</div>
                  <h4 className="font-semibold text-[var(--rustic-primary)] mb-2">Personal Gifts</h4>
                  <p className="text-sm text-[var(--rustic-secondary)]">Hadiah pilihan Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Transfer Options */}
        <div className={`mb-16 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="rustic-card max-w-4xl mx-auto">
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-[var(--rustic-gold)] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-4">
                Transfer Bank &amp; E-Wallet
              </h3>
              <p className="text-[var(--rustic-secondary)] mb-8">
                Anda dapat mengirimkan hadiah melalui rekening berikut:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {donationAccounts.map((account, index) => (
                  <div 
                    key={account.bank}
                    className={`rustic-fade-in-up p-6 border-2 border-[var(--rustic-accent)] rounded-lg hover:border-[var(--rustic-primary)] transition-all ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{account.logo}</div>
                        <div>
                          <h4 className="font-bold text-[var(--rustic-primary)]">{account.bank}</h4>
                          <p className="text-sm text-[var(--rustic-secondary)]">{account.accountName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[var(--rustic-primary)] font-semibold">
                        {account.accountNumber}
                      </p>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, account.bank)}
                        className="p-2 bg-[var(--rustic-cream)] rounded-lg hover:bg-[var(--rustic-accent)] transition-colors"
                        title="Copy nomor rekening"
                      >
                        {copiedAccount === account.bank ? (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-green-600 font-medium">Tersalin!</span>
                          </div>
                        ) : (
                          <Copy className="w-4 h-4 text-[var(--rustic-primary)]" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Physical Gift Address */}
        <div className={`rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <div className="rustic-card max-w-2xl mx-auto bg-[var(--rustic-cream)]">
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-[var(--rustic-gold)] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-4">
                Kirim Hadiah Fisik
              </h3>
              <p className="text-[var(--rustic-secondary)] mb-6">
                Jika Anda ingin mengirim hadiah fisik, dapat dikirimkan ke alamat:
              </p>
              
              <div className="rustic-card bg-white max-w-md mx-auto">
                <address className="text-[var(--rustic-primary)] not-italic leading-relaxed">
                  <p className="font-semibold mb-2">Alamat Penerima Hadiah</p>
                  <p className="mb-1">John Doe &amp; Jane Smith</p>
                  <p className="mb-1">Jl. Kenangan Indah No. 123</p>
                  <p className="mb-1">Kelurahan Bahagia, Kecamatan Harmoni</p>
                  <p className="mb-1">Jakarta Selatan, DKI Jakarta 12345</p>
                  <p className="text-[var(--rustic-secondary)] mt-3">No. HP: +62 812-3456-7890</p>
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className={`text-center mt-16 rustic-fade-in-up ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
          <div className="rustic-card max-w-2xl mx-auto">
            <Heart className="w-10 h-10 text-[var(--rustic-gold)] mx-auto mb-6 animate-pulse" />
            <p className="text-xl text-[var(--rustic-primary)] italic leading-relaxed">
              "Terima kasih atas semua doa, restu, dan hadiah yang Anda berikan. 
              Semua ini sangat berarti bagi kami dalam memulai babak baru kehidupan kami."
            </p>
            <div className="mt-6 text-[var(--rustic-secondary)]">
              Dengan penuh kasih,
              <br />
              John &amp; Jane
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}