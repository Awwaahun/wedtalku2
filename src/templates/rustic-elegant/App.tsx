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
import FloatingNavbar from './components/FloatingNavbar';
import './index.css';

interface TemplateProps {
  invitationId: string;
}

export default function RusticElegantTemplate({ invitationId }: TemplateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showInvitation, setShowInvitation] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showClientDashboard, setShowClientDashboard] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  
  const { invitation, loading, error } = useInvitation(invitationId);
  const { config } = useWeddingConfig();
  const mergedConfig = useMergedConfig(config, invitation?.user_config as UserInvitationConfig);

  // Custom rustic-elegant configuration
  const rusticConfig = {
    ...mergedConfig,
    theme: {
      primary: '#8B4513',
      secondary: '#D2691E', 
      accent: '#DEB887',
      background: '#FFF8DC',
      text: '#8B4513',
      gold: '#B8860B'
    },
    design: {
      style: 'rustic-elegant',
      fonts: {
        heading: "'Playfair Display', serif",
        body: "'Open Sans', sans-serif"
      },
      animations: {
        fadeIn: true,
        slideIn: true,
        floating: true
      },
      decorations: {
        patterns: true,
        corners: true,
        dividers: true
      }
    }
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll to section when active section changes
    if (showInvitation && activeSection) {
      const element = document.getElementById(activeSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [activeSection, showInvitation]);

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--rustic-cream)]">
        <div className="rustic-card text-center p-8">
          <h2 className="text-2xl font-bold text-[var(--rustic-primary)] mb-4">
            Undangan Tidak Ditemukan
          </h2>
          <p className="text-[var(--rustic-secondary)] mb-6">
            Mohon periksa kembali link undangan Anda.
          </p>
          <button 
            className="rustic-btn"
            onClick={() => window.location.reload()}
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  if (showClientDashboard) {
    return (
      <ClientDashboard
        invitationId={invitationId}
        onClose={() => setShowClientDashboard(false)}
        rusticConfig={rusticConfig}
      />
    );
  }

  if (!showInvitation) {
    return (
      <>
        <CinematicIntro
          onOpen={() => setShowInvitation(true)}
          config={rusticConfig}
        />
        <MusicPlayer config={rusticConfig} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--rustic-cream)] rustic-scrollbar">
      {/* Decorative Background */}
      <FloralDecorations config={rusticConfig} />
      
      {/* Floating Navigation */}
      <FloatingNavbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        config={rusticConfig}
        onAdminClick={() => setShowClientDashboard(true)}
      />

      {/* Music Player */}
      <MusicPlayer config={rusticConfig} />

      {/* Hero Section */}
      <section id="hero">
        <Hero />
      </section>

      {/* Prayer Display */}
      <PrayerDisplay config={rusticConfig} />

      {/* Countdown Section */}
      <section id="countdown">
        <Countdown config={rusticConfig} />
      </section>

      {/* Couple Section */}
      <section id="couple">
        <Couple />
      </section>

      {/* Story Section */}
      <section id="story">
        <Story config={rusticConfig} />
      </section>

      {/* Event Details Section */}
      <section id="events">
        <EventDetails />
      </section>

      {/* Gallery Section */}
      <section id="gallery">
        <Gallery config={rusticConfig} />
      </section>

      {/* RSVP Section */}
      <section id="rsvp">
        <RSVP config={rusticConfig} />
      </section>

      {/* Gift & Donation Section */}
      <section id="gifts">
        <Donation config={rusticConfig} />
      </section>

      {/* Guest Book Section */}
      <section id="guestbook">
        <GuestBook invitationId={invitationId} config={rusticConfig} />
      </section>

      {/* Prayer Letter Section */}
      <section id="prayer">
        <PrayerLetter config={rusticConfig} />
      </section>

      {/* Footer */}
      <footer className="bg-[var(--rustic-primary)] text-[var(--rustic-cream)] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center space-x-2 mb-4">
            <Heart className="w-5 h-5" />
            <span>Terima Kasih</span>
            <Heart className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90">
            © 2024 {rusticConfig.couple.bride.name} & {rusticConfig.couple.groom.name}. 
            Dibuat dengan ❤️ untuk momen spesial kami.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <InvitationModal
        isOpen={showInvitation}
        onClose={() => setShowInvitation(false)}
        config={rusticConfig}
      />

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setShowClientDashboard(true)}
      />

      {/* Custom Styles for Rustic Theme */}
      <style jsx>{`
        :global(*) {
          --rustic-primary: ${rusticConfig.theme.primary};
          --rustic-secondary: ${rusticConfig.theme.secondary};
          --rustic-accent: ${rusticConfig.theme.accent};
          --rustic-cream: ${rusticConfig.theme.background};
          --rustic-gold: ${rusticConfig.theme.gold};
        }

        :global(body) {
          font-family: ${rusticConfig.design.fonts.body};
        }

        :global(h1, h2, h3, h4, h5, h6) {
          font-family: ${rusticConfig.design.fonts.heading};
        }
      `}</style>
    </div>
  );
}

// Export configuration for template registration
export const templateConfig = {
  name: 'Rustic Elegant',
  description: 'Template undangan dengan tema rustic namun elegan, sempurna untuk wedding outdoor atau garden party',
  category: 'elegant',
  preview: '/templates/rustic-elegant/preview.jpg',
  features: [
    'Desain rustic dengan sentuhan elegan',
    'Animasi smooth yang halus',
    'Fully responsive',
    'Music player',
    'RSVP form',
    'Photo gallery',
    'Guest book',
    'Countdown timer',
    'Gift & wishlist',
    'Google Maps integration',
    'Client dashboard',
    'Customizable colors'
  ],
  price: 1500000,
  demoUrl: 'https://demo.wedtalku.com/rustic-elegant'
};