import React, { useState, useRef, useEffect } from 'react';
import { Music, BookText } from 'lucide-react';

interface Lyric {
  time: number;
  text: string;
}

interface MusicPlayerProps {
  lyrics: Lyric[];
  initialShowLyrics?: boolean;
  audioSrc: string;
  autoPlay?: boolean;       // Trigger musik
  autoPlayLyrics?: boolean; // Trigger lirik otomatis
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  lyrics,
  initialShowLyrics = false,
  audioSrc,
  autoPlay = false,
  autoPlayLyrics = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showLyrics, setShowLyrics] = useState(initialShowLyrics || autoPlayLyrics);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [typedLyric, setTypedLyric] = useState('');

  // Autoplay musik
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch((err) => console.log('Autoplay blocked:', err));
      setIsPlaying(true);
    }
  }, [autoPlay]);

  // Toggle musik
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch((e) => console.error('Playback error:', e));
    setIsPlaying(!isPlaying);
  };

  // Sync lyrics dengan audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !showLyrics) return;

    const interval = setInterval(() => {
      const currentTime = audio.currentTime;
      let nextIndex = -1;

      for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
          nextIndex = i;
          break;
        }
      }

      if (nextIndex !== currentLyricIndex && nextIndex >= 0) {
        setCurrentLyricIndex(nextIndex);
        setTypedLyric('');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentLyricIndex, showLyrics, lyrics]);

  // Typewriter effect
  useEffect(() => {
    if (currentLyricIndex < 0 || !showLyrics) return;
    const line = lyrics[currentLyricIndex].text;
    let i = 0;
    const interval = setInterval(() => {
      setTypedLyric(line.slice(0, i + 1));
      i++;
      if (i >= line.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [currentLyricIndex, showLyrics, lyrics]);

  return (
    <>
      <div className="fixed bottom-6 right-6 flex items-center space-x-3 z-50">
        {/* Lirik typewriter */}
        <div
          className={`transition-all duration-700 ease-in-out overflow-hidden ${
            showLyrics ? 'opacity-100 translate-x-0 max-w-xs' : 'opacity-0 translate-x-20 max-w-0'
          }`}
        >
          <div className="bg-white/90 backdrop-blur-md text-gray-800 text-sm rounded-xl shadow-lg px-4 py-3 border border-rose-200 w-48 animate-fade-slide whitespace-pre-line">
            {typedLyric}
          </div>
        </div>

        {/* Tombol Lirik */}
        <button
          onClick={() => setShowLyrics(!showLyrics)}
          className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
        >
          <BookText size={22} />
        </button>

        {/* Tombol Musik */}
        <button
          onClick={toggleMusic}
          className="bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110"
        >
          <Music size={24} className={`${isPlaying ? 'animate-spin-slow text-yellow-200' : ''}`} />
        </button>

        <audio ref={audioRef} loop src={audioSrc} />
      </div>
    </>
  );
};

export default MusicPlayer;
