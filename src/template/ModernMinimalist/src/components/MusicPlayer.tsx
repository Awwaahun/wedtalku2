import React, { useState, useRef, useEffect } from 'react';
import { Music, BookText, Play, Pause, Volume2, VolumeX, X, Disc3 } from 'lucide-react';

interface Lyric {
  time: number;
  text: string;
}

interface MusicPlayerProps {
  lyrics: Lyric[];
  initialShowLyrics?: boolean;
  audioSrc: string;
  autoPlay?: boolean;
  autoPlayLyrics?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  lyrics,
  initialShowLyrics = false,
  audioSrc,
  autoPlay = false,
  autoPlayLyrics = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(initialShowLyrics || autoPlayLyrics);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const [typedLyric, setTypedLyric] = useState('');
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (!autoPlay || !audioRef.current || hasInteracted) return;

    const audio = audioRef.current;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((error) => {
          console.log('Autoplay blocked, waiting for user interaction:', error);
          setAutoplayBlocked(true);
          setIsPlaying(false);
        });
    }
  }, [autoPlay, hasInteracted]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Playback error:', error);
      });
    }
    // Update isPlaying state based on audio events for accuracy
    audioRef.current.onplaying = () => setIsPlaying(true);
    audioRef.current.onpause = () => setIsPlaying(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMutedState = !audioRef.current.muted;
    audioRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !showLyrics) return;
    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const newIndex = lyrics.findIndex((lyric, index) => {
        const nextLyric = lyrics[index + 1];
        return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
      });
      if (newIndex !== -1 && newIndex !== currentLyricIndex) {
        setCurrentLyricIndex(newIndex);
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [showLyrics, lyrics, currentLyricIndex]);

  useEffect(() => {
    if (currentLyricIndex < 0 || !showLyrics) return;
    const line = lyrics[currentLyricIndex].text;
    if (typedLyric === line) return;
    
    let i = 0;
    setTypedLyric('');
    const interval = setInterval(() => {
      setTypedLyric(line.slice(0, i + 1));
      i++;
      if (i > line.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [currentLyricIndex, showLyrics, lyrics]);

  return (
    <>
      <audio ref={audioRef} loop src={audioSrc} preload="auto" />

      {/* Lyrics Container - Positioned responsively */}
      <div
        className={`fixed z-40 p-4 w-full transition-all duration-500 ease-in-out pointer-events-none
          ${showLyrics ? 'bottom-20 opacity-100' : 'bottom-12 opacity-0'}
          md:left-[6rem] md:w-auto md:bottom-8 md:p-0
          ${showControls ? 'md:left-[16rem]' : 'md:left-[10rem]'}
        `}
      >
        <div className="flex justify-center md:justify-start">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-sm rounded-xl shadow-lg px-4 py-3 border border-rose-200 text-center pointer-events-auto max-w-xs md:max-w-md">
              {typedLyric || (isPlaying ? '' : '♪ Tekan Putar')}
            </div>
        </div>
      </div>

      {/* Main Player Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 flex items-center z-50">
        
        {/* Main Toggle Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="relative bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white w-16 h-16 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          title="Buka Kontrol Musik"
        >
          {autoplayBlocked && !hasInteracted && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500 border-2 border-white"></span>
            </span>
          )}
          <div className={`transition-transform duration-500 ease-in-out ${showControls ? 'rotate-180' : 'rotate-0'}`}>
            {showControls ? <X size={28} /> : <Disc3 size={28} className={isPlaying ? 'animate-spin-slow' : ''} />}
          </div>
        </button>

        {/* Collapsible secondary controls */}
        <div className={`transition-all duration-500 ease-in-out ${showControls ? 'max-w-sm opacity-100' : 'max-w-0 opacity-0'} overflow-hidden ml-3`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center p-1.5 space-x-1">
            <button
              onClick={toggleMusic}
              className="p-2.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
              title={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
            </button>

            {isPlaying && (
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-lg text-orange-600 hover:bg-orange-100 transition-colors"
                title={isMuted ? 'Bunyikan' : 'Bisukan'}
              >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
            )}

            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className={`p-2.5 rounded-lg transition-colors ${
                showLyrics ? 'bg-pink-500 text-white' : 'text-pink-600 hover:bg-pink-100'
              }`}
              title="Tampilkan Lirik"
            >
              <BookText size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Autoplay blocked prompt */}
      {autoplayBlocked && !hasInteracted && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-11/12 max-w-xs md:w-auto md:left-6 md:translate-x-0 z-50 animate-fade-in pointer-events-none">
          <div className="bg-white rounded-lg shadow-xl p-4 border-2 border-rose-300 text-center md:text-left">
            <p className="text-sm text-gray-700 font-semibold">🎵 Sentuh ikon musik</p>
            <p className="text-xs text-gray-500 mt-1">
              Browser Anda memerlukan interaksi untuk memulai audio.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;