import React from 'react';
import { Home, Users, BookOpen, Calendar, Image, Gift, MessageSquare, BookHeart, Mail } from 'lucide-react';

interface SidebarNavProps {
  activeSection: string;
}

const navItems = [
  { id: 'hero', icon: Home, label: 'Home' },
  { id: 'couple', icon: Users, label: 'Couple' },
  { id: 'story', icon: BookOpen, label: 'Story' },
  { id: 'event', icon: Calendar, label: 'Event' },
  { id: 'gallery', icon: Image, label: 'Gallery' },
  { id: 'donation', icon: Gift, label: 'Gift' },
  { id: 'rsvp', icon: Mail, label: 'RSVP' },
  { id: 'prayer', icon: BookHeart, label: 'Prayer' },
  { id: 'guestbook', icon: MessageSquare, label: 'Guest Book' },
];

const mobileNavItems = [
  { id: 'hero', icon: Home, label: 'Home' },
  { id: 'couple', icon: Users, label: 'Couple' },
  { id: 'event', icon: Calendar, label: 'Event' },
  { id: 'gallery', icon: Image, label: 'Gallery' },
  { id: 'rsvp', icon: Mail, label: 'RSVP' },
];

const SidebarNav: React.FC<SidebarNavProps> = ({ activeSection }) => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="fixed top-0 left-0 h-full w-20 bg-[#1f213a] z-50 hidden md:flex flex-col items-center justify-center space-y-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`relative group p-3 rounded-full transition-colors duration-300 ${
              activeSection === item.id ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            aria-label={item.label}
          >
            <item.icon size={24} />
            <span className="absolute left-full ml-4 w-auto min-w-max px-3 py-1 bg-gray-900 text-white text-xs rounded-md scale-0 group-hover:scale-100 transition-transform origin-left pointer-events-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#1f213a]/80 backdrop-blur-lg border-t border-gray-700/50 p-2 z-50 md:hidden">
        <div className="flex justify-around items-center">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-md transition-colors duration-300 w-16 ${
                activeSection === item.id ? 'text-yellow-500' : 'text-gray-400'
              }`}
              aria-label={item.label}
            >
              <item.icon size={22} />
              <span className="text-[10px] mt-1 tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default SidebarNav;