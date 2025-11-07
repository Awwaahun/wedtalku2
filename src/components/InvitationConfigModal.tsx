// src/components/InvitationConfigModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, Save, Heart, Calendar, Music, Image as ImageIcon, 
  Users, MapPin, Gift, Book, Palette, Loader2, AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase, UserMedia } from '../lib/supabase';

interface UserInvitation {
  id: string;
  template_id: string;
  access_url: string;
  wedding_templates: { title: string };
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

const InvitationConfigModal: React.FC<InvitationConfigModalProps> = ({ 
  invitation, 
  onClose, 
  onSave,
  userMedia 
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'couple' | 'wedding' | 'hero' | 'invitation' | 'media' | 'theme'>('couple');
  const [activeMediaPicker, setActiveMediaPicker] = useState<string | null>(null);
  
  const [config, setConfig] = useState<InvitationConfig>({
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
    
    wedding_date: '',
    wedding_date_display: '',
    wedding_time: '14:00',
    
    hero_background_image_url: '',
    hero_tagline: '',
    
    invitation_title: 'Kamu Telah Diundang Ke Pernikahan',
    invitation_subtitle: 'Kepada Teman dan Keluarga besar, Kami Mengundang',
    invitation_button_text: 'Buka Undangan',
    invitation_background_video_url: '',
    
    cinematic_video_url: '',
    cinematic_door_image_url: '',
    
    music_audio_url: '',
    
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
      const { data: { user } } = await (supabase.auth as any).getUser();
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
        setConfig({
          groom_name: data.groom_name || '',
          groom_full_name: data.groom_full_name || '',
          groom_parents: data.groom_parents || '',
          groom_instagram: data.groom_instagram || '',
          groom_email: data.groom_email || '',
          groom_bio: data.groom_bio || '',
          groom_image_url: data.groom_image_url || '',
          
          bride_name: data.bride_name || '',
          bride_full_name: data.bride_full_name || '',
          bride_parents: data.bride_parents || '',
          bride_instagram: data.bride_instagram || '',
          bride_email: data.bride_email || '',
          bride_bio: data.bride_bio || '',
          bride_image_url: data.bride_image_url || '',
          
          wedding_date: data.wedding_date || '',
          wedding_date_display: data.wedding_date_display || '',
          wedding_time: data.wedding_time || '14:00',
          
          hero_background_image_url: data.hero_background_image_url || '',
          hero_tagline: data.hero_tagline || '',
          
          invitation_title: data.invitation_title || 'Kamu Telah Diundang Ke Pernikahan',
          invitation_subtitle: data.invitation_subtitle || 'Kepada Teman dan Keluarga besar, Kami Mengundang',
          invitation_button_text: data.invitation_button_text || 'Buka Undangan',
          invitation_background_video_url: data.invitation_background_video_url || '',
          
          cinematic_video_url: data.cinematic_video_url || '',
          cinematic_door_image_url: data.cinematic_door_image_url || '',
          
          music_audio_url: data.music_audio_url || '',
          
          theme_primary: data.theme_primary || '#f43f5e',
          theme_secondary: data.theme_secondary || '#f97316',
          theme_accent: data.theme_accent || '#ec4899',
        });
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
      const { data: { user } } = await (supabase.auth as any).getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_invitation_configs')
        .upsert({
          user_id: user.id,
          purchase_id: invitation.id,
          ...config
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
      handleInputChange(activeMediaPicker as keyof InvitationConfig, url);
      setActiveMediaPicker(null);
    }
  };

  const tabs = [
    { id: 'couple', label: 'Info Pasangan', icon: Heart },
    { id: 'wedding', label: 'Tanggal & Waktu', icon: Calendar },
    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
    { id: 'invitation', label: 'Modal Undangan', icon: Book },
    { id: 'media', label: 'Media & Musik', icon: Music },
    { id: 'theme', label: 'Warna Tema', icon: Palette },
  ] as const;

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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Audio Musik</label>
                  <div className="flex items-center space-x-3">
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
                </div>
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