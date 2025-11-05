
import { useMemo } from 'react';

export interface WeddingConfig {
  // Couple Information
  couple: {
    bride: {
      name: string;
      fullName: string;
      role: string;
      image: string;
      bio: string;
      parents: string;
      instagram: string;
      email: string;
    };
    groom: {
      name: string;
      fullName: string;
      role: string;
      image: string;
      bio: string;
      parents: string;
      instagram: string;
      email: string;
    };
  };

  // Wedding Date & Time
  wedding: {
    date: string; // Format: 'YYYY-MM-DD'
    dateDisplay: string; // Format for display
    time: string;
  };

  // Event Details
  events: Array<{
    id: string;
    title: string;
    time: string;
    duration: string;
    location: string;
    address: string;
    description: string;
    phone: string;
    email: string;
    color: string;
    bgColor: string;
    iconColor: string;
    ringColor: string;
  }>;

  // Story Timeline
  story: Array<{
    title: string;
    date: string;
    description: string;
    image: string;
  }>;

  // Music Player
  music: {
    audioSrc: string;
    lyrics: Array<{
      time: number;
      text: string;
    }>;
  };

  // Gallery Images
  gallery: Array<{
    url: string;
    type: 'portrait' | 'landscape';
    title: string;
  }>;

  // Donation/Gift Accounts
  donations: Array<{
    id: string;
    type: string;
    bank: string;
    accountNumber: string;
    accountName: string;
    qrUrl: string;
  }>;

  // Hero Section
  hero: {
    backgroundImage: string;
    tagline: string;
  };

  // Cinematic Video
  cinematic: {
    videoSrc: string;
    doorImage: string;
  };
  
  // Invitation Modal
  invitation: {
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundVideo: string;
  };
  
    // Prayer Letter
  prayerLetter: {
    greeting: string;
    body1: string;
    body2: string;
    body3: string;
    closing: string;
  };
  
  // Theme Colors (optional - for future customization)
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const useWeddingConfig = (): WeddingConfig => {
  const config = useMemo<WeddingConfig>(() => ({
    couple: {
      bride: {
        name: 'Putri',
        fullName: 'Bunga Sariputri',
        role: 'Mempelai Wanita',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250582504.png?auto=compress&cs=tinysrgb&w=800',
        bio: 'Seorang arsitek penuh semangat yang mencintai seni, kopi, dan menjelajahi tempat-tempat tersembunyi di seluruh dunia.',
        parents: 'Putri dari Bapak Dedy & Ibu Martina',
        instagram: '@bungasariputri',
        email: 'putri@example.com',
      },
      groom: {
        name: 'Budi',
        fullName: 'Budi Laksono',
        role: 'Mempelai Pria',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250574822.png?auto=compress&cs=tinysrgb&w=800',
        bio: 'Seorang Software Engineer yang gemar mendaki, fotografi, dan memasak resep-resep baru.',
        parents: 'Putra dari Bapak Martono & Ibu Widya',
        instagram: '@budilaksono',
        email: 'budi@example.com',
      },
    },

    wedding: {
      date: '2025-11-22',
      dateDisplay: 'Sabtu, 22 November 2025',
      time: '14:00:00',
    },

    events: [
      {
        id: 'akad',
        title: 'Akad Nikah',
        time: '20:00',
        duration: '1 Jam',
        location: 'Rumah Mempelai Wanita',
        address: 'Jl. Raya Temoran Omben, Kab. Sampang',
        description: 'Bergabunglah dengan kami saat kami mengucapkan janji pernikahan di hadapan orang-orang yang kami cintai',
        phone: '+62 875-1263-4567',
        email: 'ceremony@wedding.com',
        color: 'from-rose-500 via-pink-500 to-rose-600',
        bgColor: 'bg-rose-50',
        iconColor: 'text-rose-600',
        ringColor: 'ring-rose-400',
      },
      {
        id: 'reception',
        title: 'Resepsi',
        time: '08:00',
        duration: '4 Jam',
        location: 'Grand Hotel Ballroom',
        address: 'Jl. Jendral Sudirman, No 55 Grand Hotel Ballroom',
        description: 'Rayakan bersama kami dengan makan malam, berdansa, dan kenangan yang tak terlupakan dan beri keseruan bersama',
        phone: '+62 875-2987-6543',
        email: 'reception@wedding.com',
        color: 'from-orange-500 via-amber-500 to-orange-600',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
        ringColor: 'ring-orange-400',
      },
    ],

    story: [
      {
        title: 'Pertemuan Pertama',
        date: 'Musim Semi 2019',
        description: 'Kisah kami bermula di sebuah kedai kopi yang nyaman di suatu sore yang hujan.',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250606108.png?auto=compress&cs=tinysrgb&w=800',
      },
      {
        title: 'Kencan Pertama',
        date: 'Musim Panas 2019',
        description: 'Kencan resmi pertama kami adalah jalan-jalan di kebun raya.',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250618766.png?auto=compress&cs=tinysrgb&w=800',
      },
      {
        title: 'Lamaran',
        date: 'Musim Dingin 2023',
        description: 'Di bawah langit berbintang di atas gedung rooftop yang indah, Adam berlutut.',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250633509.png?auto=compress&cs=tinysrgb&w=800',
      },
    ],

    music: {
      audioSrc: 'https://files.catbox.moe/phz0pi.mp3',
      lyrics: [
        { time: 19, text: "Your morning eyes, I could stare like watching stars" },
        { time: 26, text: "I could walk you by, and I'll tell without a thought" },
        { time: 32, text: "You'd be mine, would you mind if I took your hand tonight?" },
        { time: 40, text: "Know you're all that I want this life" },
        { time: 48, text: "I'll imagine we fell in love" },
        { time: 51, text: "I'll nap under moonlight skies with you" },
        { time: 54, text: "I think I'll picture us, you with the waves" },
        { time: 58, text: "The ocean's colors on your face" },
        { time: 62, text: "I'll leave my heart with your air" },
        { time: 66, text: "So let me fly with you" },
        { time: 69, text: "Will you be forever with me?" },
        { time: 107, text: "My love will always stay by you" },
        { time: 112, text: "I'll keep it safe, so don't you worry a thing,  I'll tell you I love you more" },
        { time: 122, text: "It's stuck with you forever, so promise you won't let it go" },
        { time: 128, text: "I'll trust the universe will always bring me to you" },
        { time: 137, text: "I'll imagine we fell in love" },
        { time: 139, text: "I'll nap under moonlight skies with you" },
        { time: 143, text: "I think I'll picture us, you with the waves" },
        { time: 147, text: "The ocean's colors on your face" },
        { time: 151, text: "I'll leave my heart with your air" },
        { time: 155, text: "So let me fly with you" },
        { time: 158, text: "Will you be forever with me?" },
      ],
    },

    gallery: [
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250867425.png?auto=compress&cs=tinysrgb&w=800&h=600', type: 'landscape', title: 'Rekonsilisasi' },
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250857894.png?auto=compress&cs=tinysrgb&w=800&h=600', type: 'landscape', title: 'Pertemuan Keluarga' },
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250847153.png?auto=compress&cs=tinysrgb&w=800&h=600', type: 'landscape', title: 'Momen Santai' },
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250831745.png?auto=compress&cs=tinysrgb&w=800&h=600', type: 'landscape', title: 'Pegunungan' },
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250815277.png?auto=compress&cs=tinysrgb&w=800&h=600', type: 'landscape', title: 'Persiapan Pernikahan' },
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250801930.png?auto=compress&cs=tinysrgb&w=600&h=800', type: 'portrait', title: 'Makan Bersama' },
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250786526.png?auto=compress&cs=tinysrgb&w=600&h=800', type: 'portrait', title: 'Liburan Pantai' },
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250756921.png?auto=compress&cs=tinysrgb&w=600&h=800', type: 'portrait', title: 'Kiss Love' },
      { url: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250650392.png?auto=compress&cs=tinysrgb&w=600&h=800', type: 'portrait', title: 'Belajar Bersama' },
    ],

    donations: [
      {
        id: 'BCA1',
        type: 'Bank Account',
        bank: 'Bank Central Asia',
        accountNumber: '1234567890',
        accountName: 'Bunga Sariputri',
        qrUrl: '',
      },
      {
        id: 'BCA2',
        type: 'Bank Account',
        bank: 'Bank Central Asia',
        accountNumber: '0987654321',
        accountName: 'Budi Laksono',
        qrUrl: '',
      },
      {
        id: 'ewallet1',
        type: 'E-Wallet',
        bank: 'OVO',
        accountNumber: '+62-555-0123',
        accountName: 'Bunga Sariputri',
        qrUrl: '',
      },
      {
        id: 'ewallet2',
        type: 'E-Wallet',
        bank: 'GoPay',
        accountNumber: '+62-555-0124',
        accountName: 'Budi Laksono',
        qrUrl: '',
      },
    ],

    hero: {
      backgroundImage: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/bce5e8b9-a9e5-4092-ba5a-6d20c534a01c/1762250466395.png?auto=compress&cs=tinysrgb&w=600&h=800',
      tagline: 'Bersama keluarga kami, kami mengundang Anda untuk merayakan cinta kami',
    },

    cinematic: {
      videoSrc: 'https://files.catbox.moe/btzeyc.mp4',
      doorImage: 'https://files.catbox.moe/iix5a0.svg',
    },
    
    invitation: {
      title: "Kamu Telah Diundang Ke Pernikahan",
      subtitle: 'Kepada Teman dan Keluarga besar, Kami Mengundang',
      buttonText: 'Buka Undangan',
      backgroundVideo: 'https://files.catbox.moe/btzeyc.mp4',
    },
    
      prayerLetter: {
      greeting: 'Keluarga dan Sahabat Tersayang,',
      body1: 'Memulai hidup baru bersama ini rasanya luar biasa. Hati kami penuh kebahagiaan dan rasa syukur. Kami sangat berterima kasih atas semua cinta dan dukungan kalian; tanpa kalian, kami tidak akan menjadi seperti sekarang ini',
      body2: 'Kami memohon doa kalian di awal perjalanan pernikahan ini. Doakanlah agar cinta kami tidak hanya tumbuh, tetapi benar-benar menjadi landasan yang kokoh. Doakan agar kasih kami diwujudkan dalam tindakan nyata: kesabaran yang tak terputus, kebaikan hati yang melayani, dan pengertian yang mendalam, bahkan saat kami diuji. Berdoalah agar kami mampu melewati semua',
      body3: 'Semoga rumah kita benar-benar menjadi tempat di mana setiap hari kita bisa menemukan ketenangan setelah lelah beraktivitas, di mana canda tawa kita terdengar nyaring, dan di mana cinta kita terlihat dari tindakan saling menghargai. Kita akan berupaya untuk menjalani ini sebagai cerminan rasa syukur atas segala kebaikan yang kita terima. Komitmen dan upaya kita, yang didasari oleh iman, adalah pondasi nyata untuk membangun masa depan bersama.',
      closing: 'Dengan cinta dan rasa syukur,',
    },
    
    theme: {
      primary: '#f43f5e', // rose-500
      secondary: '#f97316', // orange-500
      accent: '#ec4899', // pink-500
    },
  }), []);

  return config;
};
