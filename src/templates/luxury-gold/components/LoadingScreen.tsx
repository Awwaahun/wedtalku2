import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  "The Wedding Celebration",
  "Our Special Day",
  "Forever Begins Here",
  "Two Hearts, One Journey",
];

const LoadingScreen: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showText, setShowText] = useState(false);

  // Berganti teks tiap beberapa detik
  useEffect(() => {
    setShowText(true);
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden">
      {/* Background image + overlay gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-105"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/3182749/pexels-photo-3182749.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff7f2]/80 via-[#fef2ef]/90 to-[#fdf6f3]/95 backdrop-blur-sm"></div>

      {/* Floating petals / hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: "100vh",
              x: Math.random() * window.innerWidth,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              y: "-10vh",
              rotate: 360,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
            className="absolute text-rose-300/70"
          >
            <Heart
              className="w-5 h-5"
              fill="currentColor"
              style={{ transformOrigin: "center" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Central glowing heart */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Heart className="text-rose-400 absolute h-32 w-32 opacity-30 animate-ping" />
        <Heart
          className="text-rose-500 relative h-24 w-24 drop-shadow-[0_0_20px_rgba(255,150,150,0.6)]"
          fill="currentColor"
        />
      </motion.div>

      {/* Animated Text */}
      <AnimatePresence mode="wait">
        {showText && (
          <motion.div
            key={phraseIndex}
            className="mt-8 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1 }}
          >
            <motion.p
              className="text-2xl md:text-3xl font-serif text-gray-700 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-400 to-rose-600 animate-[shimmer_3s_infinite]"
              style={{ backgroundSize: "200% auto" }}
            >
              {phrases[phraseIndex]}
            </motion.p>

            <motion.p
              className="mt-5 text-lg font-serif text-gray-600 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.5,
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              “Loading our beautiful story...”
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* shimmer keyframe */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;
