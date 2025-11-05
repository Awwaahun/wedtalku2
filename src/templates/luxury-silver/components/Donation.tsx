import { useState, useEffect } from 'react';
import { Gift, Copy, Check, CreditCard, Wallet, QrCode, Heart, X, Sparkles } from 'lucide-react';

const Donation = ({ config }) => {
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrCodes, setQrCodes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const accounts = (config?.donations || []).map(account => ({
    ...account,
    icon: account.type === 'Bank Account' ? CreditCard : Wallet,
  }));

  useEffect(() => {
    const codes = {};
    for (const account of accounts) {
      const qrData = `${account.bank}|${account.accountName}|${account.accountNumber}`;
      codes[account.id] = account.qrUrl
        ? account.qrUrl
        : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    }
    setQrCodes(codes);
  }, [accounts.length]);

  const copyToClipboard = (text, accountId) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(accountId);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      {/* Floating Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-sky-400/10 blur-[200px] -translate-x-1/2" />
        <div className="absolute bottom-0 right-1/2 w-[400px] h-[400px] bg-slate-500/10 blur-[180px] translate-x-1/2" />
      </div>

      {/* Animated Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-sky-300/40 animate-pulse"
            size={12 + Math.random() * 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 mb-8">
            <Gift className="text-sky-300 animate-pulse" size={48} />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white drop-shadow mb-4">
            Beri Dukungan Istimewa
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Kehadiran Anda adalah hadiah terbaik bagi kami. Namun jika berkenan, 
            Anda juga dapat memberikan dukungan sebagai bentuk kasih dan doa.
          </p>
        </div>

        {/* Donation Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-16">
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className="group relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-400/10 to-slate-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              {/* Glass Box */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-left transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-br from-sky-500 to-slate-500 p-4 rounded-2xl shadow-lg">
                    <account.icon className="text-white" size={32} />
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">{account.type}</p>
                    <p className="text-2xl font-bold text-white">{account.bank}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-slate-300 mb-1">Nama Rekening</p>
                    <p className="text-lg font-semibold text-white">{account.accountName}</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-slate-300 mb-2">Nomor Rekening</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white font-mono text-lg">{account.accountNumber}</p>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, account.id)}
                        className={`p-2 rounded-xl transition-all ${
                          copiedAccount === account.id
                            ? 'bg-green-500 text-white'
                            : 'bg-sky-500/80 hover:bg-sky-400 text-white'
                        }`}
                      >
                        {copiedAccount === account.id ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedQR(account.id)}
                  className="w-full mt-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-slate-500 text-white font-semibold hover:scale-[1.02] transition-transform"
                >
                  <QrCode className="inline-block mr-2" size={22} />
                  Lihat QR Code
                </button>
              </div>

              {/* Hover Sparkles */}
              {hoveredCard === index && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="absolute text-sky-200 animate-ping"
                      size={12}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note Box */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-sky-400" size={28} fill="currentColor" />
            <h3 className="text-2xl font-serif text-white">Terima Kasih</h3>
            <Heart className="text-sky-400" size={28} fill="currentColor" />
          </div>
          <p className="text-slate-300 text-lg leading-relaxed">
            Dukungan dan doa Anda adalah bagian penting dari perjalanan kami.
            Terima kasih atas cinta dan perhatian yang telah diberikan 💙
          </p>
        </div>
      </div>

      {/* QR Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedQR(null)}
        >
          <div
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedQR(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30"
            >
              <X className="text-white" size={22} />
            </button>
            <h3 className="text-2xl font-serif text-white mb-6">Scan QR Code</h3>
            {qrCodes[selectedQR] && (
              <img
                src={qrCodes[selectedQR]}
                alt="QR"
                className="w-64 h-64 mx-auto rounded-2xl border border-white/20 shadow-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;
