import React, { useState } from 'react';
import { Play, Pause, Music, Volume2 } from 'lucide-react';

interface MusicPlayerProps {
  config?: any;
}

export default function MusicPlayer({ config }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="rustic-card p-3 flex items-center space-x-3">
        <button
          onClick={togglePlay}
          className="p-2 bg-[var(--gradient-primary)] text-white rounded-full hover:scale-110 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
        <div className="flex items-center space-x-2">
          <Music className="w-4 h-4 text-[var(--rustic-primary)]" />
          <Volume2 className="w-4 h-4 text-[var(--rustic-secondary)]" />
        </div>
      </div>
    </div>
  );
}