import React from 'react';
import { Heart } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#FBF9F6] flex flex-col items-center justify-center z-[100]">
      <div className="relative flex items-center justify-center">
        <Heart className="text-rose-500 animate-ping absolute h-24 w-24 opacity-75" />
        <Heart className="text-rose-500 relative h-20 w-20" fill="currentColor" />
      </div>
      <p className="mt-6 text-lg text-gray-700 font-serif">Loading Our Special Day...</p>
    </div>
  );
};

export default LoadingScreen;
