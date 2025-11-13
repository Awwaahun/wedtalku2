import React from 'react';

interface PrayerDisplayProps {
  config?: any;
}

export default function PrayerDisplay({ config }: PrayerDisplayProps) {
  return (
    <section className="rustic-section bg-[var(--rustic-beige)] py-12">
      <div className="container mx-auto px-4">
        <div className="rustic-card max-w-2xl mx-auto text-center py-8">
          <h3 className="text-2xl font-bold text-[var(--rustic-primary)] mb-4">
            Doa untuk Kedua Mempelai
          </h3>
          <p className="text-[var(--rustic-brown)] leading-relaxed italic">
            "Semoga Allah memberkati pernikahan ini, membimbing langkah kalian, 
            dan menjadikan keluarga kalian sumber cinta dan kasih sayang yang abadi."
          </p>
        </div>
      </div>
    </section>
  );
}