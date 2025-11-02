import React, { useState, useEffect, useRef } from 'react';
import type { WeddingConfig } from '../../hooks/useWeddingConfig';

import SidebarNav from './components/SidebarNav';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Couple from './components/Couple';
import Story from './components/Story';
import EventDetails from './components/EventDetails';
import Gallery from './components/Gallery';
import Donation from './components/Donation';
import RSVP from './components/RSVP';
import GuestBook from './components/GuestBook';
import PrayerDisplay from './components/PrayerDisplay';
import LoadingScreen from './components/LoadingScreen';
import InvitationModal from './components/InvitationModal';
import MusicPlayer from './components/MusicPlayer';
import CinematicIntro from './components/CinematicIntro';
import DecorativeElements from './components/DecorativeElements';
import PrayerLetter from './components/PrayerLetter';
import LoginModal from '../../components/LoginModal';
import ClientDashboard from '../../components/ClientDashboard';
import { useInvitation } from '../../hooks/useInvitation';


interface Template2AppProps {
  config: WeddingConfig;
}

const Template2App: React.FC<Template2AppProps> = ({ config: initialConfig }) => {
  const [weddingConfig, setWeddingConfig] = useState<WeddingConfig>(initialConfig);
  const [activeSection, setActiveSection] = useState('hero');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const { isLoading, showInvitation, handleOpenInvitation } = useInvitation();
  const [mainVisible, setMainVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playMusicTrigger, setPlayMusicTrigger] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);

  const [guestName, setGuestName] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get('to');
    if (guest) {
      setGuestName(guest);
    }
  }, []);

  const sections = ['hero', 'couple', 'story', 'event', 'gallery', 'donation', 'rsvp', 'prayer', 'guestbook'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    const refs = sectionRefs.current;
    Object.values(refs).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      Object.values(refs).forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [mainVisible]);

  useEffect(() => {
    if (showInvitation) setIsModalOpen(true);
  }, [showInvitation]);

  const onInvitationOpened = () => {
    handleOpenInvitation();
    setIsModalOpen(false);
    setPlayMusicTrigger(true);
    setTimeout(() => {
      setMainVisible(true);
      document.body.style.overflow = 'auto';
    }, 500);
  };

  useEffect(() => {
    if (isLoading || isModalOpen || isDashboardOpen || isLoginOpen || showCinematic) {
      document.body.style.overflow = 'hidden';
    } else if (mainVisible) {
      document.body.style.overflow = 'auto';
    }
  }, [isLoading, isModalOpen, showCinematic, isDashboardOpen, isLoginOpen, mainVisible]);

  const handleAdminAccess = () => setIsLoginOpen(true);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'wedding2025') {
      setIsLoginOpen(false);
      setIsDashboardOpen(true);
    }
  };
  
  const handleSaveConfig = (newConfig: WeddingConfig) => {
    setWeddingConfig(newConfig);
    setIsDashboardOpen(false);
  };
  
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="relative">
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} />
      <ClientDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} config={weddingConfig} onSave={handleSaveConfig} />
      <InvitationModal isOpen={isModalOpen} onOpen={onInvitationOpened} config={weddingConfig} guestName={guestName} />
      <CinematicIntro show={showCinematic} onClose={() => setShowCinematic(false)} config={weddingConfig} />

      <div className={`transition-opacity duration-1000 ${mainVisible ? 'opacity-100' : 'opacity-0'}`}>
        <SidebarNav activeSection={activeSection} />
        <DecorativeElements />
        
        <main className="md:ml-20 pb-20 md:pb-0">
          <div id="hero" ref={(el) => { sectionRefs.current['hero'] = el; }}><Hero config={weddingConfig} onAdminAccess={handleAdminAccess} /></div>
          <Countdown config={weddingConfig} />
          <div id="couple" ref={(el) => { sectionRefs.current['couple'] = el; }}><Couple config={weddingConfig} /></div>
          <div id="story" ref={(el) => { sectionRefs.current['story'] = el; }}><Story config={weddingConfig} /></div>
          <div id="event" ref={(el) => { sectionRefs.current['event'] = el; }}><EventDetails config={weddingConfig} /></div>
          <div id="gallery" ref={(el) => { sectionRefs.current['gallery'] = el; }}><Gallery config={weddingConfig} /></div>
          <PrayerLetter config={weddingConfig}/>
          <div id="donation" ref={(el) => { sectionRefs.current['donation'] = el; }}><Donation config={weddingConfig} /></div>
          <div id="rsvp" ref={(el) => { sectionRefs.current['rsvp'] = el; }}><RSVP /></div>
          <div id="prayer" ref={(el) => { sectionRefs.current['prayer'] = el; }}><PrayerDisplay /></div>
          <div id="guestbook" ref={(el) => { sectionRefs.current['guestbook'] = el; }}><GuestBook /></div>
        </main>

        <footer className="md:ml-20 bg-[#1f213a] text-center p-8 text-gray-400 text-sm">
          <p className="font-serif text-lg text-white mb-2">{weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name}</p>
          <p>Made with love for our special day</p>
          <button
            onClick={() => setShowCinematic(true)}
            className="mt-4 bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors"
            >
            Watch Our Cinematic Story
          </button>
          <p className="text-xs text-gray-500 mt-4">© 2025 {weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name} - All rights reserved</p>
        </footer>
        
        {mainVisible && (
          <MusicPlayer 
            lyrics={weddingConfig.music.lyrics}
            audioSrc={weddingConfig.music.audioSrc}
            autoPlay={playMusicTrigger}
          />
        )}
      </div>
    </div>
  );
};

export default Template2App;