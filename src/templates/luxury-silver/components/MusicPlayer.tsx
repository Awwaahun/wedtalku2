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

// Konstanta untuk Tema Emas/Amber
const GOLD_GRADIENT = 'bg-gradient-to-br from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-900';
const GOLD_TEXT = 'text-amber-800';
const SOFT_BG = 'bg-amber-100';
const GOLD_BORDER = 'border-amber-400/70';

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
  const [showControls, setShowControls] = useState(true); // Default Show Controls untuk user baru

  // --- Autoplay Logic ---
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

  // --- Music Controls ---
  const toggleMusic = () => {
    if (!audioRef.current) return;
    setHasInteracted(true);
    if (isPlaying) {
      audioRef.current.pause();
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

  // --- Lyrics Sync & Typing Effect ---
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
  // --- End Lyrics Logic ---

  return (
    <>
      <audio ref={audioRef} loop src={audioSrc} preload="auto" />

      {/* Lyrics Container - POSISI KIRI BAWAH (MOBILE) */}
      <div
        className={`fixed z-40 p-4 w-full transition-all duration-500 ease-in-out pointer-events-none
          ${showLyrics ? 'bottom-20 opacity-100' : 'bottom-12 opacity-0'}
          
          /* >>> PERUBAHAN DI SINI: LEFT ALIGNMENT UNTUK MOBILE & DESKTOP <<< */
          left-6 md:left-6 w-auto p-0
        `}
      >
        <div className="flex justify-start"> {/* Diganti dari justify-center ke justify-start */}
            <div className={`bg-white/95 backdrop-blur-md ${GOLD_TEXT} text-sm rounded-2xl shadow-xl shadow-amber-900/10 px-5 py-3 border-2 ${GOLD_BORDER} text-center pointer-events-auto max-w-sm font-playfair transition-all duration-300 hover:scale-[1.02]`}>
              <span className="italic font-medium">{typedLyric || (isPlaying ? '♪ Memainkan Lagu Pernikahan...' : '♪ Sentuh ikon musik untuk memulai')}</span>
            </div>
        </div>
      </div>

      {/* Main Player Controls - POSISI KIRI BAWAH (MOBILE) */}
      <div className="fixed bottom-6 left-6 md:left-6 flex items-center z-50">
        
        {/* Main Toggle Button */}
        <button
          onClick={() => setShowControls(!showControls)}
          className={`relative w-12 h-12 flex items-center justify-center rounded-full shadow-2xl shadow-amber-900/40 transition-all duration-500 hover:scale-110 active:scale-95 ${GOLD_GRADIENT}`}
          title="Buka Kontrol Musik"
        >
          {autoplayBlocked && !hasInteracted && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
            </span>
          )}
          <div className={`text-white transition-transform duration-500 ease-in-out ${showControls ? 'rotate-180' : 'rotate-0'}`}>
            {showControls ? <X size={28} /> : <Disc3 size={28} className={isPlaying ? 'animate-spin-slow' : ''} />}
          </div>
        </button>

        {/* Collapsible secondary controls */}
        <div className={`transition-all duration-500 ease-in-out ${showControls ? 'max-w-sm opacity-100' : 'max-w-0 opacity-0'} overflow-hidden ml-3`}>
          <div className={`bg-white/90 backdrop-blur-md rounded-xl shadow-xl border ${GOLD_BORDER} flex items-center p-1 space-x-0.5`}>
            
            {/* Play/Pause Button */}
            <button
              onClick={toggleMusic}
              className={`p-2.5 rounded-lg ${GOLD_TEXT} hover:${SOFT_BG} transition-colors`}
              title={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
            </button>

            {/* Mute/Unmute Button */}
            {isPlaying && (
              <button
                onClick={toggleMute}
                className={`p-2.5 rounded-lg ${GOLD_TEXT} hover:${SOFT_BG} transition-colors`}
                title={isMuted ? 'Bunyikan' : 'Bisukan'}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            )}

            {/* Lyrics Toggle Button */}
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className={`p-2.5 rounded-lg transition-colors ${
                showLyrics ? `${GOLD_GRADIENT} text-white shadow-md` : `${GOLD_TEXT} hover:${SOFT_BG}`
              }`}
              title="Tampilkan Lirik"
            >
              <BookText size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Autoplay blocked prompt */}
      {autoplayBlocked && !hasInteracted && (
        <div className="fixed bottom-28 left-6 w-11/12 max-w-xs md:w-auto md:left-6 md:translate-x-0 z-50 animate-fade-in pointer-events-none">
          <div className="bg-white rounded-lg shadow-xl p-4 border-2 ${GOLD_BORDER} text-center md:text-left">
            <p className="text-sm ${GOLD_TEXT} font-playfair font-semibold">🎵 Sentuh ikon musik</p>
            <p className="text-xs text-gray-500 mt-1">
              Browser Anda memerlukan interaksi untuk memulai audio.
            </p>
          </div>
        </div>
      )}
      
      {/* CSS untuk Animasi Spin Disc dan Font */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>
    </>
  );
};

export default MusicPlayer;