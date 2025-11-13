import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--rustic-cream)]">
      <div className="text-center">
        <div className="rustic-loading w-16 h-16 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-[var(--rustic-primary)] mb-2">
          Memuat Undangan...
        </h2>
        <p className="text-[var(--rustic-secondary)]">
          Mohon tunggu sebentar
        </p>
      </div>
    </div>
  );
}