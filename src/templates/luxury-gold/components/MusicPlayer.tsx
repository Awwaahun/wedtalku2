import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  lyrics: any[]; // Kept for future use, but not implemented in this design
  audioSrc: string;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioSrc, autoPlay = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!autoPlay || !audioRef.current || hasInteracted) return;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [autoPlay, hasInteracted]);
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMutedState = !isMuted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };
  
  return (
    <>
      <audio ref={audioRef} loop src={audioSrc} preload="auto" />
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2">
        <button
          onClick={togglePlayPause}
          className="bg-yellow-500/80 text-gray-900 w-12 h-12 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm hover:bg-yellow-500 transition-all"
        >
          {isPlaying ? <Pause size={20} fill="currentColor"/> : <Play size={20} fill="currentColor" className="ml-1"/>}
        </button>
         <button
          onClick={toggleMute}
          className="bg-white/10 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg backdrop-blur-sm hover:bg-white/20 transition-all"
        >
          {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
        </button>
      </div>
    </>
  );
};

export default MusicPlayer;
