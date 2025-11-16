
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
  
  fonts?: {
    heading: string;
    body: string;
    script?: string;
  };
  
}

export const useWeddingConfig = (): WeddingConfig => {
  const config = useMemo<WeddingConfig>(() => ({
    couple: {
      bride: {
        name: 'Sarah',
        fullName: 'Sarah Anggraini',
        role: 'Mempelai Wanita',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/1acef5c0-3015-4baa-9fcd-bf499db50436/1761360042561.png',
        bio: 'Seorang arsitek penuh semangat yang mencintai seni, kopi, dan menjelajahi tempat-tempat tersembunyi di seluruh dunia.',
        parents: 'Putri dari Bapak Dedy & Ibu Martina',
        instagram: '@sarahanggraini',
        email: 'sarah@example.com',
      },
      groom: {
        name: 'Adam',
        fullName: 'Adam Kurniawan',
        role: 'Mempelai Pria',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/1acef5c0-3015-4baa-9fcd-bf499db50436/1761360103526.png',
        bio: 'Seorang Software Engineer yang gemar mendaki, fotografi, dan memasak resep-resep baru.',
        parents: 'Putra dari Bapak Martono & Ibu Widya',
        instagram: '@adamkurniawan',
        email: 'adam@example.com',
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
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/1acef5c0-3015-4baa-9fcd-bf499db50436/1761360226419.jpg',
      },
      {
        title: 'Kencan Pertama',
        date: 'Musim Panas 2019',
        description: 'Kencan resmi pertama kami adalah jalan-jalan di kebun raya.',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/1acef5c0-3015-4baa-9fcd-bf499db50436/1761360138736.jpg',
      },
      {
        title: 'Lamaran',
        date: 'Musim Dingin 2023',
        description: 'Di bawah langit berbintang di atas gedung rooftop yang indah, Adam berlutut.',
        image: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/1acef5c0-3015-4baa-9fcd-bf499db50436/1761360170523.jpg',
      },
    ],

    music: {
      audioSrc: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-musics/1acef5c0-3015-4baa-9fcd-bf499db50436/1761362901387.mp3',
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
      { url: 'https://picsum.photos/seed/gal1/600/800', type: 'portrait', title: 'Couple by the Sea' },
      { url: 'https://picsum.photos/seed/gal2/800/600', type: 'landscape', title: 'Lakeside Vows' },
      { url: 'https://picsum.photos/seed/gal3/600/800', type: 'portrait', title: 'First Dance' },
      { url: 'https://picsum.photos/seed/gal4/800/600', type: 'landscape', title: 'Sunset Kiss' },
      { url: 'https://picsum.photos/seed/gal5/600/800', type: 'portrait', title: 'Bridal Portrait' },
      { url: 'https://picsum.photos/seed/gal6/800/600', type: 'landscape', title: 'Walk to Remember' },
      { url: 'https://picsum.photos/seed/gal7/600/800', type: 'portrait', title: 'Joyful Embrace' },
      { url: 'https://picsum.photos/seed/gal8/800/600', type: 'landscape', title: 'Autumn Love' },
      { url: 'https://picsum.photos/seed/gal9/600/800', type: 'portrait', title: 'Candid Laughter' },
      { url: 'https://picsum.photos/seed/gal10/800/600', type: 'landscape', title: 'Beach Romance' },
      { url: 'https://picsum.photos/seed/gal11/600/800', type: 'portrait', title: 'Shared Secrets' },
      { url: 'https://picsum.photos/seed/gal12/800/600', type: 'landscape', title: 'Holding Hands' },
    ],

    donations: [
      {
        id: 'BCA1',
        type: 'Bank Account',
        bank: 'Bank Central Asia',
        accountNumber: '1234567890',
        accountName: 'Sarah Anggraini',
        qrUrl: '',
      },
      {
        id: 'BCA2',
        type: 'Bank Account',
        bank: 'Bank Central Asia',
        accountNumber: '0987654321',
        accountName: 'Adam Kurniawan',
        qrUrl: '',
      },
      {
        id: 'ewallet1',
        type: 'E-Wallet',
        bank: 'OVO',
        accountNumber: '+62-555-0123',
        accountName: 'Sarah Anggraini',
        qrUrl: '',
      },
      {
        id: 'ewallet2',
        type: 'E-Wallet',
        bank: 'GoPay',
        accountNumber: '+62-555-0124',
        accountName: 'Adam Kurniawan',
        qrUrl: '',
      },
    ],

    hero: {
      backgroundImage: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-images/1acef5c0-3015-4baa-9fcd-bf499db50436/1761360273278.jpg',
      tagline: 'Bersama keluarga kami, kami mengundang Anda untuk merayakan cinta kami',
    },

    cinematic: {
      videoSrc: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-videos/1acef5c0-3015-4baa-9fcd-bf499db50436/1761361327872.mp4',
      doorImage: 'https://files.catbox.moe/iix5a0.svg',
    },
    
    invitation: {
      title: "Kamu Telah Diundang Ke Pernikahan",
      subtitle: 'Kepada Teman dan Keluarga besar, Kami Mengundang',
      buttonText: 'Buka Undangan',
      backgroundVideo: 'https://pdjgcmcpdyosofpbjqfp.supabase.co/storage/v1/object/public/user-videos/1acef5c0-3015-4baa-9fcd-bf499db50436/1761361327872.mp4',
    },
    
      prayerLetter: {
      greeting: 'Keluarga dan Sahabat Tersayang,',
      body1: 'Memulai hidup baru bersama ini rasanya luar biasa. Hati kami penuh kebahagiaan dan rasa syukur. Kami sangat berterima kasih atas semua cinta dan dukungan kalian; tanpa kalian, kami tidak akan menjadi seperti sekarang ini',
      body2: 'Kami memohon doa kalian di awal perjalanan pernikahan ini. Doakanlah agar cinta kami tidak hanya tumbuh, tetapi benar-benar menjadi landasan yang kokoh. Doakan agar kasih kami diwujudkan dalam tindakan nyata: kesabaran yang tak terputus, kebaikan hati yang melayani, dan pengertian yang mendalam, bahkan saat kami diuji. Berdoalah agar kami mampu melewati semua',
      body3: 'Semoga rumah kita benar-benar menjadi tempat di mana setiap hari kita bisa menemukan ketenangan setelah lelah beraktivitas, di mana canda tawa kita terdengar nyaring, dan di mana cinta kita terlihat dari tindakan saling menghargai. Kita akan berupaya untuk menjalani ini sebagai cerminan rasa syukur atas segala kebaikan yang kita terima. Komitmen dan upaya kita, yang didasari oleh iman, adalah pondasi nyata untuk membangun masa depan bersama.',
      closing: 'Dengan cinta dan rasa syukur,',
    },
    
    theme: {
      primary: '#94a3b8', // slate-400
      secondary: '#64748b', // slate-500
      accent: '#e2e8f0', // slate-200
    },
    
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Montserrat, sans-serif',
      script: 'Great Vibes, cursive',
    },
    
  }), []);

  return config;
};
