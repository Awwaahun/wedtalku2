import React from 'react';

interface FloralDecorationsProps {
  config?: any;
}

export default function FloralDecorations({ config }: FloralDecorationsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 text-6xl text-[var(--rustic-gold)] opacity-10">
        ❦
      </div>
      <div className="absolute top-0 right-0 text-6xl text-[var(--rustic-gold)] opacity-10">
        ❦
      </div>
      <div className="absolute bottom-0 left-0 text-6xl text-[var(--rustic-gold)] opacity-10">
        ❦
      </div>
      <div className="absolute bottom-0 right-0 text-6xl text-[var(--rustic-gold)] opacity-10">
        ❦
      </div>
    </div>
  );
}