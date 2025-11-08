// src/components/InvitationConfigModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, Save, Heart, Calendar, Music, Image as ImageIcon, 
  MapPin, Gift, Book, Palette, Loader2, AlertCircle,
  CheckCircle, PenTool // Menambahkan PenTool untuk Theme/Palette
} from 'lucide-react';
import { supabase, UserMedia } from '../lib/supabase';

interface UserInvitation {
  id: string;
  template_id: string;
  access_url: string;
  wedding_templates: { title: string };
}

// Interface untuk item array (asumsi ini adalah struktur array minimal)
interface SimpleItem {
  id: string; 
  title: string;
  // field lain jika perlu
}

// Interface baru untuk item lirik
interface LyricItem {
  id: string; // Tambahkan ID untuk key dan operasi delete
  time: string; // Format 'menit:detik' atau 'detik'
  text: string;
}

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
  
  // Cinematic
  cinematic_video_url: string;
  cinematic_door_image_url: string;
  
  // Music
  music_audio_url: string;
  music_lyrics: LyricItem[] | any; // <-- GANTI DENGAN ARRAY BARU

  // Prayer Letter <-- NEW FIELDS
  prayer_greeting: string;
  prayer_body1: string;
  prayer_body2: string;
  prayer_body3: string;
  prayer_closing: string;

  // Array Content (Dibiarkan sebagai 'any' di config modal karena tidak diedit di sini, 
  // tetapi harus ada untuk proses save/load)
  events: SimpleItem[] | any; 
  story: SimpleItem[] | any;
  gallery: SimpleItem[] | any;
  donations: SimpleItem[] | any;
  
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

// Definisikan tipe untuk Tab
type TabId = 'couple' | 'wedding' | 'hero' | 'invitation' | 'media' | 'prayer' | 'theme';

const InvitationConfigModal: React.FC<InvitationConfigModalProps> = ({ 
  invitation, 
  onClose, 
  onSave,
  userMedia 
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('couple'); // Menggunakan TabId
  const [activeMediaPicker, setActiveMediaPicker] = useState<string | null>(null);
  
  const [config, setConfig] = useState<InvitationConfig>({
    // Couple Info
    groom_name: '',
    groom_full_name: '',
    groom_parents: '',
    groom_instagram: '',
    groom_email: '',
    groom_bio: '',
    groom_image_url: '',
    
    bride_name: '',
    bride_full_name: '',
    bride_parents: '',
    bride_instagram: '',
    bride_email: '',
    bride_bio: '',
    bride_image_url: '',
    
    // Wedding Info
    wedding_date: '',
    wedding_date_display: '',
    wedding_time: '14:00',
    
    // Hero
    hero_background_image_url: '',
    hero_tagline: '',
    
    // Invitation Modal
    invitation_title: 'Kamu Telah Diundang Ke Pernikahan',
    invitation_subtitle: 'Kepada Teman dan Keluarga besar, Kami Mengundang',
    invitation_button_text: 'Buka Undangan',
    invitation_background_video_url: '',
    
    // Cinematic
    cinematic_video_url: '',
    cinematic_door_image_url: '',
    
    // Music
    music_audio_url: '',
    music_lyrics: [], // <-- DEFAULT ARRAY BARU

    // Prayer Letter <-- DEFAULT PRAYER LETTER
    prayer_greeting: 'Dear Our Beloved Friends & Family,',
    prayer_body1: 'Dengan penuh rasa syukur dan sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami.',
    prayer_body2: 'Merupakan suatu kehormatan bagi kami menerima restu dan doa dari Anda.',
    prayer_body3: 'Besar harapan kami agar Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.',
    prayer_closing: 'Hormat kami,',

    // Array Content Defaults (Dibiarkan kosong)
    events: [],
    story: [],
    gallery: [],
    donations: [],
    
    // Theme
    theme_primary: '#f43f5e',
    theme_secondary: '#f97316',
    theme_accent: '#ec4899',
  });

  useEffect(() => {
    loadConfig();
  }, [invitation.id]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      // Perubahan: Menggunakan supabase.auth.getUser() yang lebih standar
      const { data: { user } } = await supabase.auth.getUser(); 
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_invitation_configs')
        .select('*')
        .eq('purchase_id', invitation.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: baris tidak ditemukan
        throw error;
      }

      if (data) {
        setConfig(prevConfig => ({
          ...prevConfig, // Gunakan prevConfig untuk memastikan nilai default tetap ada jika data dari DB null
          
          // Couple Info
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
          
          // Wedding Info
          wedding_date: data.wedding_date || prevConfig.wedding_date,
          wedding_date_display: data.wedding_date_display || prevConfig.wedding_date_display,
          wedding_time: data.wedding_time || prevConfig.wedding_time,
          
          // Hero
          hero_background_image_url: data.hero_background_image_url || prevConfig.hero_background_image_url,
          hero_tagline: data.hero_tagline || prevConfig.hero_tagline,
          
          // Invitation Modal
          invitation_title: data.invitation_title || prevConfig.invitation_title,
          invitation_subtitle: data.invitation_subtitle || prevConfig.invitation_subtitle,
          invitation_button_text: data.invitation_button_text || prevConfig.invitation_button_text,
          invitation_background_video_url: data.invitation_background_video_url || prevConfig.invitation_background_video_url,
          
          // Cinematic
          cinematic_video_url: data.cinematic_video_url || prevConfig.cinematic_video_url,
          cinematic_door_image_url: data.cinematic_door_image_url || prevConfig.cinematic_door_image_url,
          
          // Music
          music_audio_url: data.music_audio_url || prevConfig.music_audio_url,
          music_lyrics: data.music_lyrics || prevConfig.music_lyrics, // <-- MAPPING ARRAY BARU

          // Prayer Letter <-- NEW MAPPING
          prayer_greeting: data.prayer_greeting || prevConfig.prayer_greeting,
          prayer_body1: data.prayer_body1 || prevConfig.prayer_body1,
          prayer_body2: data.prayer_body2 || prevConfig.prayer_body2,
          prayer_body3: data.prayer_body3 || prevConfig.prayer_body3,
          prayer_closing: data.prayer_closing || prevConfig.prayer_closing,

          // Array Content 
          events: data.events || prevConfig.events, 
          story: data.story || prevConfig.story,
          gallery: data.gallery || prevConfig.gallery,
          donations: data.donations || prevConfig.donations,
          
          // Theme
          theme_primary: data.theme_primary || prevConfig.theme_primary,
          theme_secondary: data.theme_secondary || prevConfig.theme_secondary,
          theme_accent: data.theme_accent || prevConfig.theme_accent,
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
      // Perubahan: Menggunakan supabase.auth.getUser() yang lebih standar
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Filter array content agar tidak mengirim array kosong jika tidak diubah di modal ini
      // Ini adalah contoh bagaimana data array (events, story, etc.) harus disimpan
      const configToSave = {
        ...config,
        // Pastikan array content dikirim sebagai array atau string JSON jika diperlukan oleh DB
        events: config.events && config.events.length > 0 ? config.events : null,
        story: config.story && config.story.length > 0 ? config.story : null,
        gallery: config.gallery && config.gallery.length > 0 ? config.gallery : null,
        donations: config.donations && config.donations.length > 0 ? config.donations : null,
        music_lyrics: config.music_lyrics && (config.music_lyrics as LyricItem[]).length > 0 ? config.music_lyrics : null, // <-- LOGIC BARU
      };

      const { error } = await supabase
        .from('user_invitation_configs')
        .upsert({
          user_id: user.id,
          purchase_id: invitation.id,
          ...configToSave // Menggunakan configToSave yang telah dimodifikasi
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
    // Karena kita hanya menangani string di InputField, ini aman.
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectMedia = (url: string) => {
    if (activeMediaPicker) {
      // Type assertion yang aman karena kita tahu activeMediaPicker berasal dari InvitationConfig keys
      handleInputChange(activeMediaPicker as keyof InvitationConfig, url); 
      setActiveMediaPicker(null);
    }
  };
  
  // Tiga fungsi baru untuk menangani array lirik
  const handleAddLyric = () => {
    setConfig(prev => ({
      ...prev,
      music_lyrics: [...(prev.music_lyrics as LyricItem[] || []), { id: Date.now().toString(), time: '00:00', text: '' }]
    }));
  };

  const handleUpdateLyric = (id: string, field: 'time' | 'text', value: string) => {
    setConfig(prev => ({
      ...prev,
      music_lyrics: (prev.music_lyrics as LyricItem[] || []).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleRemoveLyric = (id: string) => {
    setConfig(prev => ({
      ...prev,
      music_lyrics: (prev.music_lyrics as LyricItem[] || []).filter(item => item.id !== id)
    }));
  };

  // Perbarui daftar tabs
  const tabs: { id: TabId; label: string; icon: React.FC<any> }[] = [
    { id: 'couple', label: 'Info Pasangan', icon: Heart },
    { id: 'wedding', label: 'Tanggal & Waktu', icon: Calendar },
    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
    { id: 'invitation', label: 'Modal Undangan', icon: Book },
    { id: 'media', label: 'Media & Musik', icon: Music },
    { id: 'prayer', label: 'Surat Doa', icon: Gift }, // <-- NEW TAB
    { id: 'theme', label: 'Warna Tema', icon: Palette },
  ];

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
      {notification && (
        <div className={`fixed top-4 right-4 z-[80] px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slideIn ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {activeMediaPicker && (
        // Media Picker Modal - Logic dan UI tidak berubah
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
                if (activeMediaPicker.includes('video')) return m.file_type === 'video';
                if (activeMediaPicker.includes('audio') || activeMediaPicker.includes('music')) return m.file_type === 'music';
                return m.file_type === 'image';
              }).length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  Tidak ada media yang sesuai. Silakan upload di tab Media Saya terlebih dahulu.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {userMedia.filter(m => {
                    if (activeMediaPicker.includes('video')) return m.file_type === 'video';
                    if (activeMediaPicker.includes('audio') || activeMediaPicker.includes('music')) return m.file_type === 'music';
                    return m.file_type === 'image';
                  }).map(media => (
                    <button
                      key={media.id}
                      onClick={() => handleSelectMedia(media.file_url)}
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
          {/* Header */}
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

          {/* Tabs */}
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

            {activeTab === 'media' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-600 mb-4">Video & Audio</h3>
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
                
                {/* Audio Musik dan Lirik - BAGIAN YANG BERUBAH */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Audio Musik</label>
                  <div className="flex items-center space-x-3 mb-8">
                    <input
                      type="url"
                      value={config.music_audio_url}
                      onChange={e => handleInputChange('music_audio_url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={() => setActiveMediaPicker('music_audio_url')}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                    >
                      Pilih Audio
                    </button>
                  </div>
                  
                  {/* Lyrics Array UI */}
                  <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-between">
                    Lirik Lagu (Sinkronisasi Teks & Waktu)
                    <button
                      onClick={handleAddLyric}
                      className="text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      + Tambah Baris
                    </button>
                  </h4>
                  <div className="space-y-3">
                    {/* Pastikan config.music_lyrics adalah array sebelum map */}
                    {(config.music_lyrics as LyricItem[] || []).map((lyric, index) => (
                      <div key={lyric.id} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg border">
                        <span className="text-sm font-semibold text-gray-500 pt-2">{index + 1}.</span>
                        <div className="w-24 flex-shrink-0">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Waktu (00:00)</label>
                          <input
                            type="text"
                            value={lyric.time}
                            onChange={e => handleUpdateLyric(lyric.id, 'time', e.target.value)}
                            placeholder="00:00"
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Teks Lirik</label>
                          <input
                            type="text"
                            value={lyric.text}
                            onChange={e => handleUpdateLyric(lyric.id, 'text', e.target.value)}
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
                    {(config.music_lyrics as LyricItem[] || []).length === 0 && (
                      <p className="text-center text-gray-500 py-4 border-dashed border-2 rounded-lg">
                        Klik "+ Tambah Baris" untuk mulai menambahkan lirik lagu.
                      </p>
                    )}
                  </div>
                  <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mt-4 text-sm text-gray-600 italic">
                    Gunakan format **menit:detik** (misal: 01:25) di kolom Waktu agar lirik muncul sesuai dengan detik lagu.
                  </blockquote>
                </div>
              </div>
            )}
            
            {/* NEW TAB: PRAYER LETTER */}
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
    </>
  );
};

// --- Helper Components (Tidak Berubah) ---

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