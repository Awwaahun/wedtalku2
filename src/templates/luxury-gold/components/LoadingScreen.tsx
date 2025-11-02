import React from 'react';
import { Heart } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#1a1a2e] flex flex-col items-center justify-center z-[100]">
      <div className="relative flex items-center justify-center">
        <Heart 
          className="text-yellow-500 absolute h-24 w-24 animate-ping opacity-50"
          style={{ filter: 'blur(10px)' }}
        />
        <Heart className="text-yellow-500 relative h-20 w-20" fill="currentColor" />
      </div>
      <p className="mt-8 text-lg text-gray-300 tracking-widest">LOADING...</p>
    </div>
  );
};

export default LoadingScreen;
