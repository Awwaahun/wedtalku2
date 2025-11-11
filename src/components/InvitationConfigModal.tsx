// src/components/InvitationConfigModal.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'; 
import { 
  X, Save, Heart, Calendar, Music, Image as ImageIcon, 
  MapPin, Gift, Book, Palette, Loader2, AlertCircle,
  CheckCircle, PenTool, Play, Pause, RotateCcw, Plus, Trash2, 
  ChevronDown, ChevronUp // Ikon untuk array editors
} from 'lucide-react';
import { supabase, UserMedia } from '../lib/supabase';

// Helper to convert seconds (number) to MM:SS string
const formatTime = (totalSeconds: number): string => {
  if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Helper to convert MM:SS string (atau seconds string) to seconds number
const parseTime = (timeString: string): number => {
  if (!timeString) return 0;
  // Menghapus karakter non-digit dan non-titik dua
  timeString = timeString.replace(/[^\d:]/g, ''); 
  
  const parts = timeString.split(':').map(p => parseInt(p, 10));

  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  // Fallback jika hanya detik yang dimasukkan
  if (parts.length === 1 && !isNaN(parts[0])) {
    return parts[0];
  }

  return 0;
};

interface UserInvitation {
  id: string;
  template_id: string;
  access_url: string;
  wedding_templates: { title: string };
}

// --- Interface Data Array Baru ---
interface EventItem {
  id: string; 
  title: string;
  time: string; // Misal: "10:00"
  location: string;
  address: string;
  description: string;
}

interface StoryItem {
  id: string; 
  title: string;
  date: string; // Misal: "2019" atau "Pertemuan Pertama"
  description: string;
  image: string; // URL Gambar
}

interface GalleryItem {
  id: string; 
  url: string;
  type: 'portrait' | 'landscape' | 'square'; 
  title: string;
}

interface DonationItem {
  id: string;
  type: string; // 'Bank Account' | 'E-Wallet'
  bank: string;
  accountNumber: string;
  accountName: string;
  qrUrl: string; // URL QR Code
}

interface LyricItem {
  id: string; 
  time: number; // Dalam detik
  text: string;
}

// --- Interface Konfigurasi Utama ---
interface InvitationConfig {
  // Couple Info
  groom_name: string;
  groom_full_name: string;
  groom_parents: string;
  groom_instagram: string;
  groom_email: string;
  groom_bio: string;
  groom_image_url: string;
  
  bride_name: string;
  bride_full_name: string;
  bride_parents: string;
  bride_instagram: string;
  bride_email: string;
  bride_bio: string;
  bride_image_url: string;
  
  // Wedding Info
  wedding_date: string;
  wedding_date_display: string;
  wedding_time: string;
  
  // Hero
  hero_background_image_url: string;
  hero_tagline: string;
  
  // Invitation Modal
  invitation_title: string;
  invitation_subtitle: string;
  invitation_button_text: string;
  invitation_background_video_url: string;
  
  // Cinematic & Music (Dipindahkan ke tab 'content')
  cinematic_video_url: string;
  cinematic_door_image_url: string;
  music_audio_url: string;
  music_lyrics: LyricItem[]; 

  // Prayer Letter
  prayer_greeting: string;
  prayer_body1: string;
  prayer_body2: string;
  prayer_body3: string;
  prayer_closing: string;

  // Array Content BARU
  events: EventItem[]; 
  story: StoryItem[];
  gallery: GalleryItem[];
  donations: DonationItem[];
  
  // Theme
  theme_primary: string;
  theme_secondary: string;
  theme_accent: string;
}

interface InvitationConfigModalProps {
  invitation: UserInvitation;
  onClose: () => void;
  onSave: () => void;
  userMedia: UserMedia[];
}

type TabId = 'couple' | 'wedding' | 'hero' | 'invitation' | 'content' | 'prayer' | 'theme';

const InvitationConfigModal: React.FC<InvitationConfigModalProps> = ({ 
  invitation, 
  onClose, 
  onSave,
  userMedia 
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('couple'); 
  // State untuk sub-tab di dalam tab 'content'
  const [activeContentSection, setActiveContentSection] = useState<'media' | 'event' | 'story' | 'gallery' | 'donation'>('media'); 
  const [activeMediaPicker, setActiveMediaPicker] = useState<string | null>(null);
  
  // Audio state and ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); 
  
  const [config, setConfig] = useState<InvitationConfig>({
    groom_name: '', groom_full_name: '', groom_parents: '', groom_instagram: '', groom_email: '', groom_bio: '', groom_image_url: '',
    bride_name: '', bride_full_name: '', bride_parents: '', bride_instagram: '', bride_email: '', bride_bio: '', bride_image_url: '',
    wedding_date: '', wedding_date_display: '', wedding_time: '14:00',
    hero_background_image_url: '', hero_tagline: '',
    invitation_title: 'Kamu Telah Diundang Ke Pernikahan', invitation_subtitle: 'Kepada Teman dan Keluarga besar, Kami Mengundang', invitation_button_text: 'Buka Undangan', invitation_background_video_url: '',
    cinematic_video_url: '', cinematic_door_image_url: '',
    music_audio_url: '', music_lyrics: [],
    prayer_greeting: 'Dear Our Beloved Friends & Family,', prayer_body1: 'Dengan penuh rasa syukur dan sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami.', prayer_body2: 'Merupakan suatu kehormatan bagi kami menerima restu dan doa dari Anda.', prayer_body3: 'Besar harapan kami agar Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.', prayer_closing: 'Hormat kami,',
    events: [], story: [], gallery: [], donations: [],
    theme_primary: '#f43f5e', theme_secondary: '#f97316', theme_accent: '#ec4899',
  });

  // Effect to load configuration data
  useEffect(() => {
    loadConfig();
  }, [invitation.id]);
  
  // Effect to stop music when URL changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0); 
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [config.music_audio_url]);


  const loadConfig = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser(); 
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_invitation_configs')
        .select('*')
        .eq('purchase_id', invitation.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig(prevConfig => ({
          ...prevConfig, 
          // ... (Mapping field tunggal) ...
          groom_name: data.groom_name || prevConfig.groom_name,
          groom_full_name: data.groom_full_name || prevConfig.groom_full_name,
          groom_parents: data.groom_parents || prevConfig.groom_parents,
          groom_instagram: data.groom_instagram || prevConfig.groom_instagram,
          groom_email: data.groom_email || prevConfig.groom_email,
          groom_bio: data.groom_bio || prevConfig.groom_bio,
          groom_image_url: data.groom_image_url || prevConfig.groom_image_url,
          bride_name: data.bride_name || prevConfig.bride_name,
          bride_full_name: data.bride_full_name || prevConfig.bride_full_name,
          bride_parents: data.bride_parents || prevConfig.bride_parents,
          bride_instagram: data.bride_instagram || prevConfig.bride_instagram,
          bride_email: data.bride_email || prevConfig.bride_email,
          bride_bio: data.bride_bio || prevConfig.bride_bio,
          bride_image_url: data.bride_image_url || prevConfig.bride_image_url,
          wedding_date: data.wedding_date || prevConfig.wedding_date,
          wedding_date_display: data.wedding_date_display || prevConfig.wedding_date_display,
          wedding_time: data.wedding_time || prevConfig.wedding_time,
          hero_background_image_url: data.hero_background_image_url || prevConfig.hero_background_image_url,
          hero_tagline: data.hero_tagline || prevConfig.hero_tagline,
          invitation_title: data.invitation_title || prevConfig.invitation_title,
          invitation_subtitle: data.invitation_subtitle || prevConfig.invitation_subtitle,
          invitation_button_text: data.invitation_button_text || prevConfig.invitation_button_text,
          invitation_background_video_url: data.invitation_background_video_url || prevConfig.invitation_background_video_url,
          cinematic_video_url: data.cinematic_video_url || prevConfig.cinematic_video_url,
          cinematic_door_image_url: data.cinematic_door_image_url || prevConfig.cinematic_door_image_url,
          music_audio_url: data.music_audio_url || prevConfig.music_audio_url,
          prayer_greeting: data.prayer_greeting || prevConfig.prayer_greeting,
          prayer_body1: data.prayer_body1 || prevConfig.prayer_body1,
          prayer_body2: data.prayer_body2 || prevConfig.prayer_body2,
          prayer_body3: data.prayer_body3 || prevConfig.prayer_body3,
          prayer_closing: data.prayer_closing || prevConfig.prayer_closing,
          theme_primary: data.theme_primary || prevConfig.theme_primary,
          theme_secondary: data.theme_secondary || prevConfig.theme_secondary,
          theme_accent: data.theme_accent || prevConfig.theme_accent,
          
          // Mapping array, pastikan array kosong jika data null
          music_lyrics: data.music_lyrics || [], 
          events: data.events || [], 
          story: data.story || [],
          gallery: data.gallery || [],
          donations: data.donations || [],
        }));
      }
    } catch (error) {
      console.error('Error loading config:', error);
      showNotification('error', 'Gagal memuat konfigurasi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      // Mengubah array kosong menjadi null saat disimpan agar Supabase tidak menyimpan array kosong
      const configToSave = {
        ...config,
        events: config.events && config.events.length > 0 ? config.events : null,
        story: config.story && config.story.length > 0 ? config.story : null,
        gallery: config.gallery && config.gallery.length > 0 ? config.gallery : null,
        donations: config.donations && config.donations.length > 0 ? config.donations : null,
        music_lyrics: config.music_lyrics && config.music_lyrics.length > 0 ? config.music_lyrics : null, 
      };

      const { error } = await supabase
        .from('user_invitation_configs')
        .upsert({
          user_id: user.id,
          purchase_id: invitation.id,
          ...configToSave 
        }, {
          onConflict: 'purchase_id'
        });

      if (error) throw error;

      showNotification('success', 'Konfigurasi berhasil disimpan!');
      setTimeout(() => {
        onSave();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving config:', error);
      showNotification('error', error.message || 'Gagal menyimpan konfigurasi');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (field: keyof InvitationConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectMedia = (url: string) => {
    if (activeMediaPicker) {
      // Logic ini hanya untuk field non-array
      handleInputChange(activeMediaPicker as keyof InvitationConfig, url); 
      setActiveMediaPicker(null);
    }
  };
  
  // --- Audio Handlers ---
  const handlePlay = useCallback(() => {
    if (!config.music_audio_url || !audioRef.current) return;
    
    if (audioRef.current.readyState < 2) {
      audioRef.current.load();
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error("Error playing audio:", error);
      showNotification('error', 'Gagal memutar audio. Pastikan URL valid dan didukung browser.');
      setIsPlaying(false); 
    });
  }, [config.music_audio_url]);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleRestart = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        handlePlay();
      } else {
        setCurrentTime(0); 
      }
    }
  }, [isPlaying, handlePlay]);
  
  // --- Lirik Handlers ---
  const handleAddLyric = () => {
    setConfig(prev => ({
      ...prev,
      music_lyrics: [...(prev.music_lyrics || []), { id: Date.now().toString(), time: 0, text: '' }]
    }));
  };

  const handleUpdateLyricText = (id: string, textValue: string) => {
    setConfig(prev => ({
      ...prev,
      music_lyrics: (prev.music_lyrics || []).map(item => 
        item.id === id ? { ...item, text: textValue } : item
      )
    }));
  };

  const handleUpdateLyricTime = (id: string, timeString: string) => {
    const newTimeNumber = parseTime(timeString);
    
    setConfig(prev => ({
        ...prev,
        music_lyrics: (prev.music_lyrics || []).map(item => 
          item.id === id ? { ...item, time: newTimeNumber } : item 
        )
    }));
  };

  const handleRemoveLyric = (id: string) => {
    setConfig(prev => ({
      ...prev,
      music_lyrics: (prev.music_lyrics || []).filter(item => item.id !== id)
    }));
  };
  
  // --- Event Handlers ---
  const handleAddEvent = () => {
    setConfig(prev => ({
      ...prev,
      events: [...(prev.events || []), { 
        id: Date.now().toString(), 
        title: 'Acara Baru',
        time: '10:00',
        location: 'Nama Lokasi',
        address: 'Alamat Lengkap',
        description: '',
      } as EventItem]
    }));
  };
  const handleUpdateEvent = <K extends keyof EventItem>(id: string, field: K, value: EventItem[K]) => {
    setConfig(prev => ({
      ...prev,
      events: (prev.events || []).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };
  const handleRemoveEvent = (id: string) => {
    setConfig(prev => ({
      ...prev,
      events: (prev.events || []).filter(item => item.id !== id)
    }));
  };
  
  // --- Story Handlers ---
  const handleAddStory = () => {
    setConfig(prev => ({
      ...prev,
      story: [...(prev.story || []), { 
        id: Date.now().toString(), 
        title: 'Judul Kisah Baru',
        date: new Date().getFullYear().toString(),
        description: '',
        image: '',
      } as StoryItem]
    }));
  };
  const handleUpdateStory = <K extends keyof StoryItem>(id: string, field: K, value: StoryItem[K]) => {
    setConfig(prev => ({
      ...prev,
      story: (prev.story || []).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };
  const handleRemoveStory = (id: string) => {
    setConfig(prev => ({
      ...prev,
      story: (prev.story || []).filter(item => item.id !== id)
    }));
  };
  
  // --- Gallery Handlers ---
  const handleAddGallery = () => {
    setConfig(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), { 
        id: Date.now().toString(), 
        url: '',
        type: 'portrait',
        title: 'Foto Baru',
      } as GalleryItem]
    }));
  };
  const handleUpdateGallery = <K extends keyof GalleryItem>(id: string, field: K, value: GalleryItem[K]) => {
    setConfig(prev => ({
      ...prev,
      gallery: (prev.gallery || []).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };
  const handleRemoveGallery = (id: string) => {
    setConfig(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter(item => item.id !== id)
    }));
  };
  
  // --- Donations Handlers ---
  const handleAddDonation = () => {
    setConfig(prev => ({
      ...prev,
      donations: [...(prev.donations || []), { 
        id: Date.now().toString(), 
        type: 'Bank Account',
        bank: 'BCA',
        accountNumber: '',
        accountName: '',
        qrUrl: '',
      } as DonationItem]
    }));
  };
  const handleUpdateDonation = <K extends keyof DonationItem>(id: string, field: K, value: DonationItem[K]) => {
    setConfig(prev => ({
      ...prev,
      donations: (prev.donations || []).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };
  const handleRemoveDonation = (id: string) => {
    setConfig(prev => ({
      ...prev,
      donations: (prev.donations || []).filter(item => item.id !== id)
    }));
  };

  // --- Tabs Definition ---
  const tabs: { id: TabId; label: string; icon: React.FC<any> }[] = [
    { id: 'couple', label: 'Info Pasangan', icon: Heart },
    { id: 'wedding', label: 'Tanggal & Waktu', icon: Calendar },
    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
    { id: 'invitation', label: 'Modal Undangan', icon: Book },
    { id: 'content', label: 'Konten & Media', icon: PenTool }, // Tab Baru
    { id: 'prayer', label: 'Surat Doa', icon: Gift },
    { id: 'theme', label: 'Warna Tema', icon: Palette },
  ];
  
  // --- Components Pembantu Baru (Array Editors) ---

  // Event Item Editor
  const EventItemEditor: React.FC<{ item: EventItem; onUpdate: (id: string, field: keyof EventItem, value: any) => void; onRemove: (id: string) => void }> = useMemo(() => ({ item, onUpdate, onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border border-purple-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex items-center justify-between p-3 bg-purple-50">
          <h5 className="font-semibold text-purple-800">{item.title || 'Acara Baru'}</h5>
          <div className="flex space-x-2">
            <button onClick={() => setIsOpen(!isOpen)} className="text-purple-600 hover:text-purple-800 p-1">
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-1">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <InputField label="Judul Acara" value={item.title} onChange={e => onUpdate(item.id, 'title', e.target.value)} />
            <InputField label="Waktu (HH:MM)" value={item.time} onChange={e => onUpdate(item.id, 'time', e.target.value)} placeholder="08:00" />
            <InputField label="Lokasi Singkat" value={item.location} onChange={e => onUpdate(item.id, 'location', e.target.value)} />
            <InputField label="Alamat Lengkap" value={item.address} onChange={e => onUpdate(item.id, 'address', e.target.value)} />
            <div className="md:col-span-2">
              <TextareaField label="Deskripsi" value={item.description} onChange={e => onUpdate(item.id, 'description', e.target.value)} />
            </div>
          </div>
        )}
      </div>
    );
  }, []);

  // Story Item Editor
  const StoryItemEditor: React.FC<{ item: StoryItem; onUpdate: (id: string, field: keyof StoryItem, value: any) => void; onRemove: (id: string) => void }> = useMemo(() => ({ item, onUpdate, onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border border-pink-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex items-center justify-between p-3 bg-pink-50">
          <h5 className="font-semibold text-pink-800">{item.title || 'Kisah Baru'}</h5>
          <div className="flex space-x-2">
            <button onClick={() => setIsOpen(!isOpen)} className="text-pink-600 hover:text-pink-800 p-1">
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-1">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="p-4 space-y-4">
            <InputField label="Judul Kisah" value={item.title} onChange={e => onUpdate(item.id, 'title', e.target.value)} />
            <InputField label="Tahun/Waktu" value={item.date} onChange={e => onUpdate(item.id, 'date', e.target.value)} placeholder="Musim Semi 2019 / 2023" />
            <TextareaField label="Deskripsi" value={item.description} onChange={e => onUpdate(item.id, 'description', e.target.value)} />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Gambar</label>
              <div className="flex items-center space-x-3">
                <input
                  type="url"
                  value={item.image}
                  onChange={e => onUpdate(item.id, 'image', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
                <button
                  // Gunakan string unik sebagai identifier media picker
                  onClick={() => setActiveMediaPicker(`story_image_url_${item.id}`)} 
                  className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200"
                >
                  Pilih Media
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, []);

  // Gallery Item Editor
  const GalleryItemEditor: React.FC<{ item: GalleryItem; onUpdate: (id: string, field: keyof GalleryItem, value: any) => void; onRemove: (id: string) => void }> = useMemo(() => ({ item, onUpdate, onRemove }) => {
    return (
      <div className="border border-cyan-200 rounded-lg overflow-hidden bg-white shadow-sm p-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {item.url ? <img src={item.url} alt={item.title} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-400" />}
          </div>
          <div className="flex-1 space-y-2">
            <InputField label="URL Gambar" value={item.url} onChange={e => onUpdate(item.id, 'url', e.target.value)} />
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Judul/Deskripsi</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={e => onUpdate(item.id, 'title', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
              <div className="w-28 flex-shrink-0">
                <label className="block text-xs font-medium text-gray-500 mb-1">Tipe</label>
                <select
                  value={item.type}
                  onChange={e => onUpdate(item.id, 'type', e.target.value as GalleryItem['type'])}
                  className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveMediaPicker(`gallery_url_${item.id}`)}
                className="flex-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 text-sm"
              >
                Pilih Media
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors border rounded-lg"
                title="Hapus Gambar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, []);

  // Donation Item Editor
  const DonationItemEditor: React.FC<{ item: DonationItem; onUpdate: (id: string, field: keyof DonationItem, value: any) => void; onRemove: (id: string) => void }> = useMemo(() => ({ item, onUpdate, onRemove }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border border-green-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex items-center justify-between p-3 bg-green-50">
          <h5 className="font-semibold text-green-800">{item.bank || 'Donasi Baru'} ({item.accountName || 'Nama Penerima'})</h5>
          <div className="flex space-x-2">
            <button onClick={() => setIsOpen(!isOpen)} className="text-green-600 hover:text-green-800 p-1">
              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-1">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Akun</label>
              <select
                value={item.type}
                onChange={e => onUpdate(item.id, 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="Bank Account">Bank Account</option>
                <option value="E-Wallet">E-Wallet (No. HP)</option>
              </select>
            </div>
            <InputField label="Nama Bank/E-Wallet" value={item.bank} onChange={e => onUpdate(item.id, 'bank', e.target.value)} />
            <InputField label="Nomor Rekening/HP" value={item.accountNumber} onChange={e => onUpdate(item.id, 'accountNumber', e.target.value)} />
            <InputField label="Atas Nama" value={item.accountName} onChange={e => onUpdate(item.id, 'accountName', e.target.value)} />
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL QR Code (Opsional)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="url"
                  value={item.qrUrl}
                  onChange={e => onUpdate(item.id, 'qrUrl', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button
                  onClick={() => setActiveMediaPicker(`donation_qr_url_${item.id}`)}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  Pilih QR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, []);
  
  // Media Picker Adapter (disederhanakan)
  const MediaPickerAdapter: React.FC<{ onSelect: (url: string) => void; userMedia: UserMedia[] }> = useMemo(() => ({ onSelect, userMedia }) => {
    return null; 
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat konfigurasi...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[80] px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slideIn ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Media Picker Modal */}
      {activeMediaPicker && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Pilih Media</h3>
              <button onClick={() => setActiveMediaPicker(null)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              {userMedia.filter(m => {
                const isVideo = activeMediaPicker.includes('video');
                const isAudio = activeMediaPicker.includes('audio') || activeMediaPicker.includes('music');
                const isImage = !isVideo && !isAudio;
                
                if (isVideo) return m.file_type === 'video';
                if (isAudio) return m.file_type === 'music';
                return m.file_type === 'image';
              }).length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  Tidak ada media yang sesuai. Silakan upload di tab Media Saya terlebih dahulu.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {userMedia.filter(m => {
                    const isVideo = activeMediaPicker.includes('video');
                    const isAudio = activeMediaPicker.includes('audio') || activeMediaPicker.includes('music');
                    const isImage = !isVideo && !isAudio;

                    if (isVideo) return m.file_type === 'video';
                    if (isAudio) return m.file_type === 'music';
                    return m.file_type === 'image';
                  }).map(media => (
                    <button
                      key={media.id}
                      onClick={() => {
                        // Logic untuk array item (story, gallery, donation)
                        if (activeMediaPicker.includes('_url_')) {
                          const [prefix, id] = activeMediaPicker.split('_url_');
                          if (prefix === 'story_image') handleUpdateStory(id, 'image', media.file_url as string);
                          else if (prefix === 'gallery') handleUpdateGallery(id, 'url', media.file_url as string);
                          else if (prefix === 'donation_qr') handleUpdateDonation(id, 'qrUrl', media.file_url as string);
                        } else {
                          // Logic untuk field tunggal
                          handleSelectMedia(media.file_url);
                        }
                        setActiveMediaPicker(null);
                      }}
                      className="aspect-square rounded-lg overflow-hidden group relative"
                    >
                      {media.file_type === 'image' ? (
                        <img src={media.file_url} alt={media.file_name} className="w-full h-full object-cover" />
                      ) : media.file_type === 'video' ? (
                        <video src={media.file_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-pink-100 flex items-center justify-center">
                          <Music className="w-12 h-12 text-pink-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white font-semibold">Pilih</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Configuration Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-scaleIn my-8">
          {/* Header & Tabs */}
          <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Konfigurasi Undangan</h2>
                <p className="text-sm opacity-90">Template: {invitation.wedding_templates.title}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-shrink-0 border-b border-gray-200 px-6 overflow-x-auto">
            <div className="flex space-x-1 min-w-max">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-purple-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {activeTab === 'couple' && (
              <div className="space-y-6">
                {/* Mempelai Wanita */}
                <div className="bg-rose-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-rose-600 mb-4">Mempelai Wanita</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Nama Panggilan *" value={config.bride_name} onChange={e => handleInputChange('bride_name', e.target.value)} required />
                    <InputField label="Nama Lengkap" value={config.bride_full_name} onChange={e => handleInputChange('bride_full_name', e.target.value)} />
                    <InputField label="Instagram" value={config.bride_instagram} onChange={e => handleInputChange('bride_instagram', e.target.value)} placeholder="@username" />
                    <InputField label="Email" type="email" value={config.bride_email} onChange={e => handleInputChange('bride_email', e.target.value)} />
                    <div className="md:col-span-2">
                      <InputField label="Orang Tua" value={config.bride_parents} onChange={e => handleInputChange('bride_parents', e.target.value)} placeholder="Putri dari Bapak ... & Ibu ..." />
                    </div>
                    <div className="md:col-span-2">
                      <TextareaField label="Bio" value={config.bride_bio} onChange={e => handleInputChange('bride_bio', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Foto</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="url"
                          value={config.bride_image_url}
                          onChange={e => handleInputChange('bride_image_url', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                          placeholder="URL foto"
                        />
                        <button
                          onClick={() => setActiveMediaPicker('bride_image_url')}
                          className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                        >
                          Pilih dari Media
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mempelai Pria */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-blue-600 mb-4">Mempelai Pria</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField label="Nama Panggilan *" value={config.groom_name} onChange={e => handleInputChange('groom_name', e.target.value)} required />
                    <InputField label="Nama Lengkap" value={config.groom_full_name} onChange={e => handleInputChange('groom_full_name', e.target.value)} />
                    <InputField label="Instagram" value={config.groom_instagram} onChange={e => handleInputChange('groom_instagram', e.target.value)} placeholder="@username" />
                    <InputField label="Email" type="email" value={config.groom_email} onChange={e => handleInputChange('groom_email', e.target.value)} />
                    <div className="md:col-span-2">
                      <InputField label="Orang Tua" value={config.groom_parents} onChange={e => handleInputChange('groom_parents', e.target.value)} placeholder="Putra dari Bapak ... & Ibu ..." />
                    </div>
                    <div className="md:col-span-2">
                      <TextareaField label="Bio" value={config.groom_bio} onChange={e => handleInputChange('groom_bio', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Foto</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="url"
                          value={config.groom_image_url}
                          onChange={e => handleInputChange('groom_image_url', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="URL foto"
                        />
                        <button
                          onClick={() => setActiveMediaPicker('groom_image_url')}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          Pilih dari Media
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wedding' && (
              <div className="space-y-4">
                <InputField label="Tanggal Pernikahan *" type="date" value={config.wedding_date} onChange={e => handleInputChange('wedding_date', e.target.value)} required />
                <InputField label="Tampilan Tanggal (Text)" value={config.wedding_date_display} onChange={e => handleInputChange('wedding_date_display', e.target.value)} placeholder="Sabtu, 22 November 2025" />
                <InputField label="Waktu" type="time" value={config.wedding_time} onChange={e => handleInputChange('wedding_time', e.target.value)} />
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background Image</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={config.hero_background_image_url}
                      onChange={e => handleInputChange('hero_background_image_url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={() => setActiveMediaPicker('hero_background_image_url')}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      Pilih dari Media
                    </button>
                  </div>
                </div>
                <TextareaField label="Tagline" value={config.hero_tagline} onChange={e => handleInputChange('hero_tagline', e.target.value)} />
              </div>
            )}

            {activeTab === 'invitation' && (
              <div className="space-y-4">
                <InputField label="Judul" value={config.invitation_title} onChange={e => handleInputChange('invitation_title', e.target.value)} />
                <InputField label="Subjudul" value={config.invitation_subtitle} onChange={e => handleInputChange('invitation_subtitle', e.target.value)} />
                <InputField label="Teks Tombol" value={config.invitation_button_text} onChange={e => handleInputChange('invitation_button_text', e.target.value)} />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background Video</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={config.invitation_background_video_url}
                      onChange={e => handleInputChange('invitation_background_video_url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={() => setActiveMediaPicker('invitation_background_video_url')}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      Pilih Video
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'prayer' && (
              <div className="space-y-4 bg-lime-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-lime-700 mb-4">🙏 Konfigurasi Surat Doa/Kata Sambutan</h3>
                <InputField 
                  label="Salam Pembuka (Greeting)" 
                  value={config.prayer_greeting} 
                  onChange={e => handleInputChange('prayer_greeting', e.target.value)} 
                />
                <TextareaField 
                  label="Paragraf Isi 1" 
                  value={config.prayer_body1} 
                  onChange={e => handleInputChange('prayer_body1', e.target.value)} 
                />
                <TextareaField 
                  label="Paragraf Isi 2" 
                  value={config.prayer_body2} 
                  onChange={e => handleInputChange('prayer_body2', e.target.value)} 
                />
                <TextareaField 
                  label="Paragraf Isi 3" 
                  value={config.prayer_body3} 
                  onChange={e => handleInputChange('prayer_body3', e.target.value)} 
                />
                <InputField 
                  label="Salam Penutup (Closing)" 
                  value={config.prayer_closing} 
                  onChange={e => handleInputChange('prayer_closing', e.target.value)} 
                />
                <blockquote className="border-l-4 border-lime-300 pl-4 py-2 text-sm text-gray-600 italic">
                  Teks-teks ini akan mengisi bagian 'Kata Sambutan' atau 'Surat Doa' di template Anda.
                </blockquote>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="grid md:grid-cols-3 gap-6">
                <ColorField label="Primary" value={config.theme_primary} onChange={e => handleInputChange('theme_primary', e.target.value)} />
                <ColorField label="Secondary" value={config.theme_secondary} onChange={e => handleInputChange('theme_secondary', e.target.value)} />
                <ColorField label="Accent" value={config.theme_accent} onChange={e => handleInputChange('theme_accent', e.target.value)} />
              </div>
            )}
            
            {/* Tab Konten & Media Baru */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Sub-Tabs/Navigation */}
                <div className="flex flex-wrap border-b border-gray-200">
                  <ContentSubTab id="media" label="Media & Musik" icon={Music} active={activeContentSection} onClick={setActiveContentSection} />
                  <ContentSubTab id="event" label="Acara/Event" icon={MapPin} active={activeContentSection} onClick={setActiveContentSection} />
                  <ContentSubTab id="story" label="Kisah Kami" icon={Heart} active={activeContentSection} onClick={setActiveContentSection} />
                  <ContentSubTab id="gallery" label="Galeri Foto" icon={ImageIcon} active={activeContentSection} onClick={setActiveContentSection} />
                  <ContentSubTab id="donation" label="Hadiah/Donasi" icon={Gift} active={activeContentSection} onClick={setActiveContentSection} />
                </div>
                
                {/* Content Sections */}
                
                {activeContentSection === 'media' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-purple-600">Video & Audio</h3>
                        {/* Video Sinematik */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Video Sinematik</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="url"
                              value={config.cinematic_video_url}
                              onChange={e => handleInputChange('cinematic_video_url', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            <button
                              onClick={() => setActiveMediaPicker('cinematic_video_url')}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                            >
                              Pilih Video
                            </button>
                          </div>
                        </div>
                        {/* Gambar Pintu Cinematic */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Gambar Pintu (Cinematic)</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="url"
                              value={config.cinematic_door_image_url}
                              onChange={e => handleInputChange('cinematic_door_image_url', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            <button
                              onClick={() => setActiveMediaPicker('cinematic_door_image_url')}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                            >
                              Pilih Gambar
                            </button>
                          </div>
                        </div>
                        
                        {/* Audio Musik dan Lirik */}
                        <div className="pt-4 border-t border-gray-100">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Audio Musik (URL)</label>
                          <div className="flex items-center space-x-3 mb-3">
                            <input
                              type="url"
                              value={config.music_audio_url}
                              onChange={e => handleInputChange('music_audio_url', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                              placeholder="URL audio dari media Anda atau link eksternal"
                            />
                            <button
                              onClick={() => setActiveMediaPicker('music_audio_url')}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                            >
                              Pilih Audio
                            </button>
                          </div>

                          {/* Audio Player Control */}
                          <div className="mb-8 flex flex-wrap items-center space-x-3 sm:space-x-4">
                            
                            <button
                              onClick={handlePlay}
                              disabled={!config.music_audio_url || isPlaying}
                              className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center space-x-2 text-sm ${
                                !config.music_audio_url || isPlaying
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600 text-white'
                              }`}
                            >
                              <Play className="w-4 h-4" />
                              <span>Lanjut</span>
                            </button>
                            
                            <button
                              onClick={handlePause}
                              disabled={!config.music_audio_url || !isPlaying}
                              className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center space-x-2 text-sm ${
                                !config.music_audio_url || !isPlaying
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-500 hover:bg-red-600 text-white'
                              }`}
                            >
                              <Pause className="w-4 h-4" />
                              <span>Stop</span>
                            </button>
                            
                            <button
                              onClick={handleRestart}
                              disabled={!config.music_audio_url}
                              className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center space-x-2 text-sm ${
                                !config.music_audio_url
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              }`}
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Ulang</span>
                            </button>

                            {config.music_audio_url && (
                                <div className={`font-mono text-lg font-bold ml-auto ${isPlaying ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            )}
                          </div>
                          
                          {/* Lyrics Array UI */}
                          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-between">
                            Lirik Lagu (Sinkronisasi Teks & Waktu)
                            <button
                              onClick={handleAddLyric}
                              className="text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Tambah Baris</span>
                            </button>
                          </h4>
                          <div className="space-y-3">
                            {(config.music_lyrics || []).map((lyric, index) => (
                              <div key={lyric.id} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg border">
                                <span className="text-sm font-semibold text-gray-500 pt-2">{index + 1}.</span>
                                <div className="w-24 flex-shrink-0">
                                  <label className="block text-xs font-medium text-gray-500 mb-1">Waktu (MM:SS)</label>
                                  <input
                                    type="text"
                                    value={formatTime(lyric.time)} 
                                    onChange={e => handleUpdateLyricTime(lyric.id, e.target.value)} 
                                    placeholder="00:00"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs font-medium text-gray-500 mb-1">Teks Lirik</label>
                                  <input
                                    type="text"
                                    value={lyric.text}
                                    onChange={e => handleUpdateLyricText(lyric.id, e.target.value)} 
                                    placeholder="Masukkan baris lirik di sini"
                                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                                  />
                                </div>
                                <button
                                  onClick={() => handleRemoveLyric(lyric.id)}
                                  className="mt-5 p-1 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                                  title="Hapus Baris"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {(config.music_lyrics || []).length === 0 && (
                              <p className="text-center text-gray-500 py-4 border-dashed border-2 rounded-lg">
                                Klik "+ Tambah Baris" untuk mulai menambahkan lirik lagu.
                              </p>
                            )}
                          </div>
                          <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mt-4 text-sm text-gray-600 italic">
                            Masukkan waktu dalam format **MM:SS** (misal: 01:25).
                          </blockquote>
                        </div>
                    </div>
                )}
                
                {activeContentSection === 'event' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-purple-600 flex items-center justify-between">
                            Daftar Acara
                            <button
                                onClick={handleAddEvent}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-1 text-sm font-semibold"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Acara</span>
                            </button>
                        </h3>
                        <div className="space-y-4">
                            {(config.events || []).map(event => (
                                <EventItemEditor key={event.id} item={event} onUpdate={handleUpdateEvent} onRemove={handleRemoveEvent} />
                            ))}
                            {(config.events || []).length === 0 && (
                                <p className="text-center text-gray-500 py-4 border-dashed border-2 rounded-lg">
                                    Belum ada acara. Klik "Tambah Acara" untuk memulai.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {activeContentSection === 'story' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-purple-600 flex items-center justify-between">
                            Kisah Perjalanan Cinta
                            <button
                                onClick={handleAddStory}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-1 text-sm font-semibold"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Kisah</span>
                            </button>
                        </h3>
                        <div className="space-y-4">
                            {(config.story || []).map(story => (
                                <StoryItemEditor key={story.id} item={story} onUpdate={handleUpdateStory} onRemove={handleRemoveStory} />
                            ))}
                            {(config.story || []).length === 0 && (
                                <p className="text-center text-gray-500 py-4 border-dashed border-2 rounded-lg">
                                    Belum ada kisah. Klik "Tambah Kisah" untuk memulai.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {activeContentSection === 'gallery' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-purple-600 flex items-center justify-between">
                            Galeri Foto
                            <button
                                onClick={handleAddGallery}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-1 text-sm font-semibold"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Foto</span>
                            </button>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(config.gallery || []).map(photo => (
                                <GalleryItemEditor key={photo.id} item={photo} onUpdate={handleUpdateGallery} onRemove={handleRemoveGallery} />
                            ))}
                            {(config.gallery || []).length === 0 && (
                                <p className="text-center text-gray-500 py-4 border-dashed border-2 rounded-lg col-span-full">
                                    Belum ada foto di galeri. Klik "Tambah Foto" untuk memulai.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {activeContentSection === 'donation' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-purple-600 flex items-center justify-between">
                            Hadiah & Sumbangan
                            <button
                                onClick={handleAddDonation}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-1 text-sm font-semibold"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah Akun</span>
                            </button>
                        </h3>
                        <div className="space-y-4">
                            {(config.donations || []).map(donation => (
                                <DonationItemEditor key={donation.id} item={donation} onUpdate={handleUpdateDonation} onRemove={handleRemoveDonation} />
                            ))}
                            {(config.donations || []).length === 0 && (
                                <p className="text-center text-gray-500 py-4 border-dashed border-2 rounded-lg">
                                    Belum ada detail hadiah/donasi. Klik "Tambah Akun" untuk memulai.
                                </p>
                            )}
                        </div>
                        <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mt-4 text-sm text-gray-600 italic">
                            Informasi ini akan ditampilkan di bagian 'Kirim Hadiah' atau 'Amplop Digital' di undangan Anda.
                        </blockquote>
                    </div>
                )}

              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !config.groom_name || !config.bride_name}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Simpan Konfigurasi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden Audio Element for Preview */}
      <audio 
        ref={audioRef} 
        src={config.music_audio_url}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {setIsPlaying(false); setCurrentTime(0);}} 
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} 
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} 
        onError={(e) => {
          console.error("Audio Load Error:", e);
          setIsPlaying(false);
          setDuration(0);
        }}
      />
    </>
  );
};

// --- Helper Components ---

const ContentSubTab: React.FC<{
    id: string;
    label: string;
    icon: React.FC<any>;
    active: string;
    onClick: (id: any) => void;
}> = ({ id, label, icon: Icon, active, onClick }) => (
    <button
        onClick={() => onClick(id)}
        className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors relative text-sm ${
            active === id
                ? 'text-purple-600 bg-purple-50 rounded-t-lg'
                : 'text-gray-600 hover:text-gray-800'
        }`}
    >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
        {active === id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
        )}
    </button>
);


const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}> = ({ label, value, onChange, type = 'text', placeholder, required }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);

const TextareaField: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}> = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
    />
  </div>
);

const ColorField: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
      />
    </div>
  </div>
);

export default InvitationConfigModal;