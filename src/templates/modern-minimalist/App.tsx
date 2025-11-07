// src/templates/modern-minimalist/App.tsx - Updated with config merge
import { useState, useEffect } from 'react';
import { Heart, Calendar, Users, Gift, Wallet, MessageCircle, UserCircle, Send, Film } from 'lucide-react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Couple from './components/Couple';
import Story from './components/Story';
import EventDetails from './components/EventDetails';
import Gallery from './components/Gallery';
import Donation from './components/Donation';
import RSVP from './components/RSVP';
import GuestBook from './components/GuestBook';
import LoadingScreen from './components/LoadingScreen';
import InvitationModal from './components/InvitationModal';
import FloralDecorations from './components/FloralDecorations';
import { useInvitation } from './hooks/useInvitation';
import MusicPlayer from './components/MusicPlayer';
import PrayerDisplay from './components/PrayerDisplay';
import PrayerLetter from './components/PrayerLetter';
import CinematicIntro from './components/CinematicIntro';
import { useWeddingConfig } from './hooks/useWeddingConfig';
import { useMergedConfig } from './hooks/useMergedConfig';
import { UserInvitationConfig } from '../../lib/supabase';
import LoginModal from './components/LoginModal';
import ClientDashboard from './components/ClientDashboard';
import './index.css';

interface TemplateProps {
  invitationId: string;
  userConfig?: UserInvitationConfig | null;
}

function App({ invitationId, userConfig }: TemplateProps) {
  // Get default template configuration
  const defaultConfig = useWeddingConfig();
  
  // Merge default config with user custom config
  const weddingConfig = useMergedConfig(defaultConfig, userConfig);
  
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isLoading, showInvitation, handleOpenInvitation } = useInvitation();
  const [mainVisible, setMainVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMusicButton, setShowMusicButton] = useState(false);
  const [playMusicTrigger, setPlayMusicTrigger] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);
  
  const [guestName, setGuestName] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Get guest name from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to');
    if (guest) {
      setGuestName(guest);
    }
  }, []);
  
  // Apply custom theme colors to CSS variables
  useEffect(() => {
    if (weddingConfig.theme) {
      document.documentElement.style.setProperty('--color-primary', weddingConfig.theme.primary);
      document.documentElement.style.setProperty('--color-secondary', weddingConfig.theme.secondary);
      document.documentElement.style.setProperty('--color-accent', weddingConfig.theme.accent);
    }
  }, [weddingConfig.theme]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['hero', 'couple', 'story', 'event', 'gallery', 'donation', 'rsvp', 'prayer'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            if (activeSection !== section) {
              setActiveSection(section);
            }
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  useEffect(() => {
    if (showInvitation) setIsModalOpen(true);
  }, [showInvitation]);

  const onInvitationOpened = () => {
    handleOpenInvitation();
    setIsModalOpen(false);

    // Show and trigger music player immediately after user clicks
    setShowMusicButton(true);
    setPlayMusicTrigger(true);

    // Delay main content visibility for smooth transition animation
    setTimeout(() => {
      setMainVisible(true);
      document.body.style.overflow = 'auto';
    }, 500);
  };

  useEffect(() => {
    if (isLoading || isModalOpen || isDashboardOpen || isLoginOpen) {
      document.body.style.overflow = 'hidden';
    } else if (!showCinematic) {
      document.body.style.overflow = 'auto';
    }
  }, [isLoading, isModalOpen, showCinematic, isDashboardOpen, isLoginOpen]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleAdminAccess = () => setIsLoginOpen(true);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'wedding2025') {
      setIsLoginOpen(false);
      setIsDashboardOpen(true);
    }
  };
  
  const handleSaveConfig = (newConfig: typeof weddingConfig) => {
    // Note: This is for ClientDashboard (admin panel)
    // User config is saved via InvitationConfigModal in UserPanel
    console.log('Config saved from admin dashboard:', newConfig);
    setIsDashboardOpen(false);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      <ClientDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} config={weddingConfig} onSave={handleSaveConfig} />

      <InvitationModal isOpen={isModalOpen} onOpen={onInvitationOpened} config={weddingConfig} guestName={guestName} />
      <CinematicIntro show={showCinematic} onClose={() => setShowCinematic(false)} config={weddingConfig} />

      <div className={`transition-opacity duration-1000 ease-in ${mainVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="min-h-screen bg-background text-text font-sans overflow-x-hidden relative">
          
          {mainVisible && <FloralDecorations activeSection={activeSection} />}
          
          <nav
            className={`fixed top-0 w-full z-[60] transition-all duration-300 ${
              scrolled ? 'bg-white/80 backdrop-blur-sm shadow-md py-4' : 'bg-transparent py-6'
            }`}
          >
            <div className="container mx-auto px-4">
              <div className="flex justify-center items-center space-x-3 md:space-x-6">
                {[
                  { icon: Heart, label: 'Home', id: 'hero' },
                  { icon: UserCircle, label: 'Couple', id: 'couple' },
                  { icon: Users, label: 'Story', id: 'story' },
                  { icon: Calendar, label: 'Event', id: 'event' },
                  { icon: Gift, label: 'Gallery', id: 'gallery' },
                  { icon: Wallet, label: 'Gift', id: 'donation' },
                  { icon: MessageCircle, label: 'RSVP', id: 'rsvp' },
                  { icon: Send, label: 'Prayer', id: 'prayer' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex flex-col md:flex-row items-center space-x-0 md:space-x-2 transition-colors duration-300 ${
                      scrolled ? 'text-text/80 hover:text-primary' : 'text-white/90 hover:text-white'
                    } ${activeSection === item.id ? (scrolled ? 'text-primary' : 'text-white font-bold') : ''}`}
                  >
                    <item.icon size={18} />
                    <span className="hidden md:inline text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <main>
            <div id="hero"><Hero onAdminAccess={handleAdminAccess} config={weddingConfig} /></div>
            <Countdown config={weddingConfig} />
            <div id="couple"><Couple config={weddingConfig} /></div>
            <div id="story"><Story config={weddingConfig} /></div>
            <div id="event"><EventDetails config={weddingConfig} /></div>
            <div id="gallery"><Gallery config={weddingConfig} /></div>
            <div id="donation"><Donation config={weddingConfig} /></div>
            <div id="rsvp"><RSVP /></div>
            <div id="prayer"><PrayerDisplay /></div>
            <PrayerLetter config={weddingConfig} />
            <GuestBook />
          </main>

          {showMusicButton && (
            <MusicPlayer
              lyrics={weddingConfig.music.lyrics}
              audioSrc={weddingConfig.music.audioSrc}
              initialShowLyrics={true}
              autoPlay={playMusicTrigger}
              autoPlayLyrics={playMusicTrigger}
            />
          )}

          <footer className="bg-gray-900 text-white py-12 relative z-10">
            <div className="container mx-auto px-4 text-center">
              <Heart className="inline-block text-primary mb-2" size={24} />
              <p className="font-serif text-lg">{weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name}</p>
              <p className="text-sm">Made with love for our special day</p>
              <button
                onClick={() => setShowCinematic(true)}
                className="mt-4 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
              >
                <Film size={20} />
                <span>Watch Our Cinematic Story</span>
              </button>
              <p className="text-xs text-gray-400 mt-6">© 2025 {weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name} - All rights reserved</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;