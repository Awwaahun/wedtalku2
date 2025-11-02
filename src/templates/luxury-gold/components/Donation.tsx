import React, { useState, useMemo } from 'react';
import { Gift, Copy, Check, QrCode } from 'lucide-react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

interface DonationProps {
  config: WeddingConfig;
}

const SectionWrapper: React.FC<{ children: React.ReactNode; id: string }> = ({ children, id }) => (
    <section id={id} className="min-h-screen py-24 px-4 container mx-auto flex flex-col justify-center">
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


const Donation: React.FC<DonationProps> = ({ config }) => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = (text: string, accountId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(accountId);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const accounts = useMemo(() => config.donations, [config.donations]);

  return (
    <SectionWrapper id="donation">
      <SectionTitle subtitle="Your presence is the greatest gift, but should you wish to give another, we would be overjoyed.">
        Wedding Gift
      </SectionTitle>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {accounts.map((account) => (
          <div key={account.id} className="bg-[#1f213a] border border-gray-700 rounded-lg p-6 flex flex-col">
            <div className="flex-grow">
                <h3 className="text-2xl font-semibold text-white">{account.bank}</h3>
                <p className="text-yellow-500 mb-4">{account.type}</p>
                <p className="text-gray-400 text-sm">A.N.</p>
                <p className="text-white text-lg mb-4">{account.accountName}</p>
                <p className="text-gray-400 text-sm">No. Rekening</p>
                <div className="flex items-center justify-between bg-[#1a1a2e] p-3 rounded-md mt-1">
                    <p className="font-mono text-lg text-white">{account.accountNumber}</p>
                    <button
                        onClick={() => copyToClipboard(account.accountNumber, account.id)}
                        className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                        title="Copy"
                    >
                        {copiedAccount === account.id ? <Check className="text-green-500" size={18} /> : <Copy className="text-gray-400" size={18} />}
                    </button>
                </div>
            </div>
            {account.qrUrl && (
                <button className="w-full mt-6 bg-yellow-500 text-gray-900 font-bold py-3 rounded-md hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2">
                    <QrCode size={20}/>
                    <span>Show QR Code</span>
                </button>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Donation;
