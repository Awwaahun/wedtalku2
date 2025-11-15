import React, { useState, useEffect, useRef } from 'react';
import { SilverMusic, SilverHeart } from './icons';
import '../index.css';

interface MusicPlayerProps {
  lyrics?: string;
  audioSrc?: string;
  initialShowLyrics?: boolean;
  autoPlay?: boolean;
  autoPlayLyrics?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  lyrics = `♪ Perfect - Ed Sheeran ♪

I found a love for me
Darling, just dive right in and follow my lead
Well, I found a girl, beautiful and sweet
Oh, I never knew you were the someone waiting for me

'Cause we were just kids when we fell in love
Not knowing what it was
I will not give you up this time
But darling, just kiss me slow, your heart is all I own
And in your eyes, you're holding mine

Baby, I'm dancing in the dark
With you between my arms
Barefoot on the grass
Listening to our favorite song

When you said you looked a mess
I whispered underneath my breath
But you heard it
Darling, you look perfect tonight

Well, I found a woman, stronger than anyone I know
She shares my dreams, I hope that someday I'll share her home
I found a love, to carry more than just my secrets
To carry love, to carry children of our own

We are still kids, but we're so in love
Fighting against all odds
I know we'll be alright this time
Darling, just hold my hand
Be my girl, I'll be your man
I see my future in your eyes

Baby, I'm dancing in the dark
With you between my arms
Barefoot on the grass
Listening to our favorite song

When I saw you in that dress, looking so beautiful
I don't deserve this, darling, you look perfect tonight

Baby, I'm dancing in the dark
With you between my arms
Barefoot on the grass
Listening to our favorite song
I have faith in what I see
Now I know I have met an angel in person
And she looks perfect
I don't deserve this
You look perfect tonight

♪ Forever and Always ♪`,
  audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  initialShowLyrics = true,
  autoPlay = false,
  autoPlayLyrics = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(initialShowLyrics);
  const [isLyricsAnimating, setIsLyricsAnimating] = useState(autoPlayLyrics);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setIsLyricsAnimating(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log('Auto-play was prevented:', error);
      });
    }

    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [autoPlay, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsLyricsAnimating(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        if (showLyrics) {
          setIsLyricsAnimating(true);
        }
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
    if (!showLyrics && isPlaying) {
      setIsLyricsAnimating(true);
    } else {
      setIsLyricsAnimating(false);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-silver-light p-4 w-80">
          {/* Player Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-silver-gradient rounded-full flex items-center justify-center">
                <SilverMusic size={20} className="text-charcoal" />
              </div>
              <div>
                <p className="font-heading text-sm text-charcoal">Our Song</p>
                <p className="font-body text-xs text-silver">Perfect - Ed Sheeran</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={toggleLyrics}
                className={`p-2 rounded-lg transition-colors ${
                  showLyrics ? 'bg-primary-silver/20 text-charcoal' : 'text-silver hover:text-charcoal'
                }`}
                title="Toggle Lyrics"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-silver-light rounded-lg appearance-none cursor-pointer slider-silver"
              style={{
                background: `linear-gradient(to right, #C0C0C0 0%, #C0C0C0 ${(currentTime / duration) * 100}%, #E5E5E5 ${(currentTime / duration) * 100}%, #E5E5E5 100%)`
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="font-body text-xs text-silver">{formatTime(currentTime)}</span>
              <span className="font-body text-xs text-silver">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.max(0, currentTime - 10);
                }
              }}
              className="p-2 text-silver hover:text-charcoal transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <polygon points="11,19 2,12 11,5" fill="currentColor"/>
                <rect x="13" y="5" width="2" height="14" fill="currentColor"/>
              </svg>
            </button>
            
            <button
              onClick={togglePlay}
              className="p-3 bg-silver-gradient rounded-full text-charcoal hover:shadow-medium transition-all duration-300"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                </svg>
              )}
            </button>
            
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Math.min(duration, currentTime + 10);
                }
              }}
              className="p-2 text-silver hover:text-charcoal transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="5" width="2" height="14" fill="currentColor"/>
                <polygon points="13,19 24,12 13,5" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-silver" viewBox="0 0 24 24" fill="none">
              <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" fill="currentColor"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-silver-light rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #C0C0C0 0%, #C0C0C0 ${volume * 100}%, #E5E5E5 ${volume * 100}%, #E5E5E5 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Lyrics Display */}
      {showLyrics && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Lyrics Header */}
            <div className="bg-silver-gradient p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SilverHeart size={24} className="text-charcoal" />
                <div>
                  <h3 className="font-heading text-lg text-charcoal">Song Lyrics</h3>
                  <p className="font-body text-sm text-charcoal/70">Perfect - Ed Sheeran</p>
                </div>
              </div>
              <button
                onClick={toggleLyrics}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5 text-charcoal" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Lyrics Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <pre 
                className={`font-elegant text-lg text-charcoal leading-relaxed whitespace-pre-wrap ${
                  isLyricsAnimating ? 'animate-pulse' : ''
                }`}
              >
                {lyrics}
              </pre>
            </div>

            {/* Footer with Controls */}
            <div className="bg-platinum/30 p-4 flex items-center justify-center space-x-4">
              <button
                onClick={togglePlay}
                className="p-2 bg-silver-gradient rounded-full text-charcoal hover:shadow-medium transition-all duration-300"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                  </svg>
                )}
              </button>
              <p className="font-body text-sm text-silver">
                {isPlaying ? 'Now Playing' : 'Paused'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioSrc} />

      {/* Custom Styles */}
      <style jsx>{`
        .slider-silver::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-silver::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: none;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #C0C0C0;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #A8A8A8;
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;