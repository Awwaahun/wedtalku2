import React from 'react';

interface PrayerLetterProps {
  config?: any;
}

export default function PrayerLetter({ config }: PrayerLetterProps) {
  return (
    <section className="rustic-section bg-[var(--rustic-cream)]">
      <div className="container mx-auto px-4">
        <div className="rustic-card max-w-3xl mx-auto text-center py-12">
          <h3 className="text-3xl font-bold text-[var(--rustic-primary)] mb-6">
            Surat Cinta
          </h3>
          <p className="text-[var(--rustic-brown)] leading-relaxed text-lg italic">
            "Terima kasih telah menjadi bagian dari perjalanan cinta kami. 
            Doa dan restu Anda adalah hadiah terindah yang kami terima."
          </p>
        </div>
      </div>
    </section>
  );
}