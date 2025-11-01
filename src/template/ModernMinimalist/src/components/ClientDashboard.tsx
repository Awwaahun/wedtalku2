import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Users, Calendar, MapPin, Music, Image, Gift, Settings, LogOut, Heart, Sparkles, Film, FileJson, Upload, Download, Palette, Mail, BookOpen, Send, PlusCircle, Trash2, FileUp, Loader2 } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';
import supabase from '../lib/supabase';

interface ClientDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
  onSave: (newConfig: WeddingConfig) => void;
}

interface Guest {
  id: string;
  name: string;
  phone: string | null;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ isOpen, onClose, config, onSave }) => {
  const [editedConfig, setEditedConfig] = useState<WeddingConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  
  // Guest management states
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [whatsappMessage, setWhatsappMessage] = useState(
`_Assalamualaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *guestname* untuk menghadiri acara kami.

*Berikut link undangan kami*, untuk info lengkap dari acara bisa kunjungi:
link url to guest name

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

*Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.*

Terima kasih banyak atas perhatiannya.

Salam Hormat
${config.couple.groom.name} & ${config.couple.bride.name}`
  );

  useEffect(() => {
    setEditedConfig(config);
     setWhatsappMessage(prev => prev.replace(
      /Salam Hormat\n.*/,
      `Salam Hormat\n${config.couple.groom.name} & ${config.couple.bride.name}`
    ));
  }, [config]);

  const tabs = [
    { id: 'couple', label: 'Informasi', icon: Heart },
    { id: 'hero', label: 'Bagian Utama', icon: Sparkles },
    { id: 'cinematic', label: 'Sinematik', icon: Film },
    { id: 'invitation', label: 'Undangan', icon: Mail },
    { id: 'wedding', label: 'Tanggal', icon: Calendar },
    { id: 'events', label: 'Acara', icon: MapPin },
    { id: 'story', label: 'Kisah', icon: Users },
    { id: 'prayerLetter', label: 'Pesan Doa', icon: BookOpen },
    { id: 'music', label: 'Musik', icon: Music },
    { id: 'gallery', label: 'Galeri', icon: Image },
    { id: 'donations', label: 'Donasi', icon: Gift },
    { id: 'theme', label: 'Tema', icon: Palette },
    { id: 'whatsapp', label: 'Kirim Whatsapp', icon: Send },
    { id: 'json', label: 'Pengaturan & Data', icon: FileJson },
  ] as const;
  
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('couple');

  useEffect(() => {
    const fetchGuests = async () => {
        if (activeTab === 'whatsapp') {
            setLoadingGuests(true);
            try {
                const { data, error } = await supabase
                    .from('guests')
                    .select('id, name, phone')
                    .order('name', { ascending: true });
                
                if (error) {
                    throw error;
                }
                if (data) {
                    setGuests(data);
                }
            } catch (error) {
                console.error('Error fetching guests:', error);
                alert('Could not fetch guest list from Supabase.');
            } finally {
                setLoadingGuests(false);
            }
        }
    };

    if (isOpen) {
        fetchGuests();
    }
  }, [activeTab, isOpen]);

  const handleInputChange = (section: keyof WeddingConfig, field: string, value: any, index?: number) => {
    setEditedConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev)); // Deep copy
      
      if (index !== undefined && Array.isArray(newConfig[section])) {
        const arr = newConfig[section] as any[];
        arr[index] = { ...arr[index], [field]: value };
        (newConfig as any)[section] = arr;
      } else {
        // This handles both existing and optional objects like 'theme' correctly
        (newConfig as any)[section] = {
          ...((newConfig as any)[section] as object || {}),
          [field]: value
        };
      }
      
      return newConfig;
    });
    setHasChanges(true);
  };

  const handleNestedInputChange = (section: keyof WeddingConfig, parentField: string, field: string, value: any) => {
    setEditedConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev)); // Deep copy
      (newConfig as any)[section][parentField][field] = value;
      return newConfig;
    });
    setHasChanges(true);
  };
  
  const handleExport = () => {
    const jsonString = JSON.stringify(editedConfig, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'wedding-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File tidak terbaca");
        const importedConfig = JSON.parse(text);
        setEditedConfig(importedConfig);
        setHasChanges(true);
        alert("Konfigurasi berhasil diimpor! Jangan lupa simpan perubahan Anda..");
      } catch (error) {
        alert("Gagal mengimpor konfigurasi. Harap periksa apakah berkas tersebut merupakan konfigurasi JSON yang valid.");
        console.error(error);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSave(editedConfig);
    setHasChanges(false);
    alert('Konfigurasi berhasil disimpan!');
  };

  const handleLogout = () => {
    if (hasChanges) {
      if (window.confirm('Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  const handleSendWhatsapp = (guest: Guest) => {
    if (!guest.phone) {
        alert(`Nomor telepon tidak ada untuk ${guest.name}.`);
        return;
    }

    const cleanedPhone = guest.phone.replace(/[^0-9]/g, '');

    const baseUrl = window.location.origin;
    const guestUrl = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;

    const finalMessage = whatsappMessage
        .replace(/\*guestname\*/g, `*${guest.name}*`)
        .replace('link url to guest name', guestUrl);

    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(finalMessage)}`;

    window.open(whatsappUrl, '_blank');
  };
  
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
        alert('Nama tamu wajib diisi.');
        return;
    }
    setIsAdding(true);
    try {
        const { data, error } = await supabase
            .from('guests')
            .insert([{ name: newName.trim(), phone: newPhone.trim() || null }])
            .select();
        
        if (error) throw error;
        if (data) {
            setGuests(prev => [...prev, ...data].sort((a, b) => a.name.localeCompare(b.name)));
            setNewName('');
            setNewPhone('');
        }
    } catch (error) {
        console.error('Terjadi kesalahan saat menambahkan tamu:', error);
        alert('Gagal menambahkan tamu.');
    } finally {
        setIsAdding(false);
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus? ${guest.name}?`)) {
        setDeletingId(guest.id);
        try {
            const { error } = await supabase
                .from('guests')
                .delete()
                .match({ id: guest.id });

            if (error) throw error;
            setGuests(prev => prev.filter(g => g.id !== guest.id));
        } catch (error) {
            console.error('Terjadi kesalahan saat menghapus tamu:', error);
            alert('Gagal menghapus tamu.');
        } finally {
            setDeletingId(null);
        }
    }
  };

  const handleImportGuestsClick = () => {
    importFileRef.current?.click();
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target?.result as string;
            const rows = text.split('\n').filter(row => row.trim() !== '');
            const newGuests = rows.map(row => {
                const [name, phone] = row.split(',').map(field => field.trim());
                return { name, phone };
            }).filter(g => g.name);

            if (newGuests.length === 0) {
                alert('Tidak ada tamu yang valid ditemukan dalam berkas.');
                setIsImporting(false);
                return;
            }
            
            const { error } = await supabase.from('guests').insert(newGuests);
            if (error) throw error;

            const { data, error: fetchError } = await supabase
                .from('guests')
                .select('id, name, phone')
                .order('name', { ascending: true });
            
            if (fetchError) throw fetchError;
            if (data) setGuests(data);

            alert(`${newGuests.length} tamu berhasil diimpor!`);

        } catch (error) {
            console.error('Kesalahan saat mengimpor CSV:', error);
            alert('Gagal mengimpor CSV. Silakan periksa format file (Nama, Telepon) dan konsol untuk menemukan kesalahan.');
        } finally {
            setIsImporting(false);
            if (importFileRef.current) {
                importFileRef.current.value = '';
            }
        }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full"><Settings size={24} /></div>
                <div>
                  <h1 className="text-2xl font-serif font-bold">Dashboard Konfigurasi Pernikahan</h1>
                  <p className="text-sm text-white/80">Sesuaikan situs web pernikahan Anda</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <button onClick={handleSave} className="flex items-center space-x-2 bg-white text-rose-600 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors">
                    <Save size={18} /> <span className="hidden md:inline">Simpan Perubahan</span>
                  </button>
                )}
                <button onClick={handleLogout} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                  <LogOut size={18} /> <span className="hidden md:inline">Keluar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                    <tab.icon size={20} /> <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              {activeTab === 'couple' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Informasi Pasangan</h2>
                  <div className="bg-rose-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-rose-600 mb-4">Detail Pengantin Wanita</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField label="Nama" value={editedConfig.couple.bride.name} onChange={e => handleNestedInputChange('couple', 'bride', 'name', e.target.value)} />
                      <InputField label="Nama Lengkap" value={editedConfig.couple.bride.fullName} onChange={e => handleNestedInputChange('couple', 'bride', 'fullName', e.target.value)} />
                      <InputField label="Instagram" value={editedConfig.couple.bride.instagram} onChange={e => handleNestedInputChange('couple', 'bride', 'instagram', e.target.value)} />
                      <InputField label="Email" type="email" value={editedConfig.couple.bride.email} onChange={e => handleNestedInputChange('couple', 'bride', 'email', e.target.value)} />
                      <div className="md:col-span-2"><InputField label="Keluarga" value={editedConfig.couple.bride.parents} onChange={e => handleNestedInputChange('couple', 'bride', 'parents', e.target.value)} /></div>
                      <div className="md:col-span-2"><TextareaField label="Bio" value={editedConfig.couple.bride.bio} onChange={e => handleNestedInputChange('couple', 'bride', 'bio', e.target.value)} /></div>
                      <div className="md:col-span-2"><InputField label="Image URL" type="url" value={editedConfig.couple.bride.image} onChange={e => handleNestedInputChange('couple', 'bride', 'image', e.target.value)} /></div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4">Detail Pengantin Pria</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField label="Nama" value={editedConfig.couple.groom.name} onChange={e => handleNestedInputChange('couple', 'groom', 'name', e.target.value)} focusColor="focus:ring-blue-500" />
                        <InputField label="Nama Lengkap" value={editedConfig.couple.groom.fullName} onChange={e => handleNestedInputChange('couple', 'groom', 'fullName', e.target.value)} focusColor="focus:ring-blue-500"/>
                        <InputField label="Instagram" value={editedConfig.couple.groom.instagram} onChange={e => handleNestedInputChange('couple', 'groom', 'instagram', e.target.value)} focusColor="focus:ring-blue-500"/>
                        <InputField label="Email" type="email" value={editedConfig.couple.groom.email} onChange={e => handleNestedInputChange('couple', 'groom', 'email', e.target.value)} focusColor="focus:ring-blue-500"/>
                        <div className="md:col-span-2"><InputField label="Keluarga" value={editedConfig.couple.groom.parents} onChange={e => handleNestedInputChange('couple', 'groom', 'parents', e.target.value)} focusColor="focus:ring-blue-500"/></div>
                        <div className="md:col-span-2"><TextareaField label="Bio" value={editedConfig.couple.groom.bio} onChange={e => handleNestedInputChange('couple', 'groom', 'bio', e.target.value)} focusColor="focus:ring-blue-500"/></div>
                        <div className="md:col-span-2"><InputField label="Image URL" type="url" value={editedConfig.couple.groom.image} onChange={e => handleNestedInputChange('couple', 'groom', 'image', e.target.value)} focusColor="focus:ring-blue-500"/></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Bagian Utama</h2>
                  <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <InputField label="Background Image URL" type="url" value={editedConfig.hero.backgroundImage} onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)} />
                      <TextareaField label="Tagline" value={editedConfig.hero.tagline} onChange={(e) => handleInputChange('hero', 'tagline', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cinematic' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Bagian Sinematik</h2>
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <div className="space-y-4">
                      <InputField label="Video Source URL" type="url" value={editedConfig.cinematic.videoSrc} onChange={(e) => handleInputChange('cinematic', 'videoSrc', e.target.value)} />
                      <InputField label="Door Image URL" type="url" value={editedConfig.cinematic.doorImage} onChange={(e) => handleInputChange('cinematic', 'doorImage', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'invitation' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Bagian Undangan</h2>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <InputField 
                        label="Judul" 
                        value={editedConfig.invitation.title} 
                        onChange={(e) => handleInputChange('invitation', 'title', e.target.value)} 
                        focusColor="focus:ring-indigo-500"
                      />
                      <InputField 
                        label="SubJudul" 
                        value={editedConfig.invitation.subtitle} 
                        onChange={(e) => handleInputChange('invitation', 'subtitle', e.target.value)} 
                        focusColor="focus:ring-indigo-500"
                      />
                      <InputField 
                        label="Tombol Teks" 
                        value={editedConfig.invitation.buttonText} 
                        onChange={(e) => handleInputChange('invitation', 'buttonText', e.target.value)} 
                        focusColor="focus:ring-indigo-500"
                      />
                      <InputField 
                        label="Background Video URL" 
                        type="url" 
                        value={editedConfig.invitation.backgroundVideo} 
                        onChange={(e) => handleInputChange('invitation', 'backgroundVideo', e.target.value)} 
                        focusColor="focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wedding' && (
                  <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Tanggal & Waktu Pernikahan</h2>
                      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6">
                          <div className="space-y-4">
                              <InputField label="Tanggal Pernikahan" type="date" value={editedConfig.wedding.date} onChange={(e) => handleInputChange('wedding', 'date', e.target.value)} />
                              <InputField label="Tampilan Tanggal Teks" value={editedConfig.wedding.dateDisplay} onChange={(e) => handleInputChange('wedding', 'dateDisplay', e.target.value)} placeholder="e.g., Sabtu, 22 November 2025" />
                              <InputField label="Jam" type="time" value={editedConfig.wedding.time} onChange={(e) => handleInputChange('wedding', 'time', e.target.value)} />
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'events' && (
                  <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Detail Acara</h2>
                      {editedConfig.events.map((event, index) => (
                          <div key={event.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                              <h3 className="text-xl font-semibold text-gray-800 mb-4">Acara {index + 1}: {event.title}</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Judul" value={event.title} onChange={(e) => handleInputChange('events', 'title', e.target.value, index)} />
                                <InputField label="Jam" value={event.time} onChange={(e) => handleInputChange('events', 'time', e.target.value, index)} />
                                <InputField label="Durasi" value={event.duration} onChange={(e) => handleInputChange('events', 'duration', e.target.value, index)} />
                                <InputField label="Lokasi" value={event.location} onChange={(e) => handleInputChange('events', 'location', e.target.value, index)} />
                                <div className="md:col-span-2"><InputField label="Alamat" value={event.address} onChange={(e) => handleInputChange('events', 'address', e.target.value, index)} /></div>
                                <InputField label="Telepon" type="tel" value={event.phone} onChange={(e) => handleInputChange('events', 'phone', e.target.value, index)} />
                                <InputField label="Email" type="email" value={event.email} onChange={(e) => handleInputChange('events', 'email', e.target.value, index)} />
                                <div className="md:col-span-2"><TextareaField label="Deskripsi" value={event.description} onChange={(e) => handleInputChange('events', 'description', e.target.value, index)} /></div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {activeTab === 'story' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Kisah Perjalanan Kami</h2>
                    {editedConfig.story.map((storyItem, index) => (
                        <div key={`story-${index}`} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Poin Ke {index + 1}: {storyItem.title}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Judul" value={storyItem.title} onChange={(e) => handleInputChange('story', 'title', e.target.value, index)} />
                                <InputField label="Tanggal" value={storyItem.date} onChange={(e) => handleInputChange('story', 'date', e.target.value, index)} />
                                <div className="md:col-span-2"><InputField label="Image URL" type="url" value={storyItem.image} onChange={(e) => handleInputChange('story', 'image', e.target.value, index)} /></div>
                                <div className="md:col-span-2"><TextareaField label="Deskripsi" value={storyItem.description} onChange={(e) => handleInputChange('story', 'description', e.target.value, index)} /></div>
                            </div>
                        </div>
                    ))}
                </div>
              )}

              {activeTab === 'prayerLetter' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Bagian Pesan dan Doa</h2>
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">Catatan. Nama pasangan akan ditambahkan otomatis di akhir.</p>
                    <div className="space-y-4">
                      <TextareaField 
                        label="Salam Pembuka" 
                        value={editedConfig.prayerLetter?.greeting || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'greeting', e.target.value)} 
                      />
                      <TextareaField 
                        label="Paragraf ke 1" 
                        value={editedConfig.prayerLetter?.body1 || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'body1', e.target.value)} 
                      />
                      <TextareaField 
                        label="Paragraf ke 2" 
                        value={editedConfig.prayerLetter?.body2 || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'body2', e.target.value)} 
                      />
                      <TextareaField 
                        label="Paragraf ke 3" 
                        value={editedConfig.prayerLetter?.body3 || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'body3', e.target.value)} 
                      />
                      <TextareaField 
                        label="Penutup" 
                        value={editedConfig.prayerLetter?.closing || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'closing', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

               {activeTab === 'music' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Konfigurasi Musik</h2>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <InputField label="Audio Source URL" type="url" value={editedConfig.music.audioSrc} onChange={(e) => handleInputChange('music', 'audioSrc', e.target.value)} focusColor="focus:ring-purple-500" />
                      <p className="text-sm text-gray-600">Konfigurasi lirik memerlukan pengeditan kode manual dalam file Json ada di tab Pengaturan & Data.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Gambar Galeri</h2>
                    {editedConfig.gallery.map((image, index) => (
                        <div key={`gallery-${index}`} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Gambar Ke  {index + 1}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2"><InputField label="Image URL" type="url" value={image.url} onChange={(e) => handleInputChange('gallery', 'url', e.target.value, index)} /></div>
                                <InputField label="Judul" value={image.title} onChange={(e) => handleInputChange('gallery', 'title', e.target.value, index)} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                    <select
                                        value={image.type}
                                        onChange={(e) => handleInputChange('gallery', 'type', e.target.value, index)}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none`}
                                    >
                                        <option value="portrait">Portrait</option>
                                        <option value="landscape">Landscape</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              )}

              {activeTab === 'donations' && (
                  <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Akun Transaksi Pengantin</h2>
                      {editedConfig.donations.map((donation, index) => (
                          <div key={donation.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                              <h3 className="text-xl font-semibold text-green-700 mb-4">Akun {index + 1}</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Tipe" value={donation.type} onChange={(e) => handleInputChange('donations', 'type', e.target.value, index)} focusColor="focus:ring-green-500" />
                                <InputField label="Bank/E-Wallet" value={donation.bank} onChange={(e) => handleInputChange('donations', 'bank', e.target.value, index)} focusColor="focus:ring-green-500" />
                                <InputField label="Nomor Akun" value={donation.accountNumber} onChange={(e) => handleInputChange('donations', 'accountNumber', e.target.value, index)} focusColor="focus:ring-green-500" />
                                <InputField label="Nama Akun" value={donation.accountName} onChange={(e) => handleInputChange('donations', 'accountName', e.target.value, index)} focusColor="focus:ring-green-500" />
                                <div className="md:col-span-2">
                                  <InputField 
                                    label="QR Code Image URL (Optional)" 
                                    type="url" 
                                    value={donation.qrUrl || ''} 
                                    onChange={(e) => handleInputChange('donations', 'qrUrl', e.target.value, index)} 
                                    focusColor="focus:ring-green-500" 
                                    placeholder="https://example.com/qris.png"
                                  />
                                </div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Warna Tema</h2>
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-6">Sesuaikan warna utama situs web Anda. Perubahan berlaku untuk berbagai elemen seperti tombol dan sorotan.</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <ColorInputField label="Primary" value={editedConfig.theme?.primary || '#f43f5e'} onChange={e => handleInputChange('theme', 'primary', e.target.value)} />
                      <ColorInputField label="Secondary" value={editedConfig.theme?.secondary || '#f97316'} onChange={e => handleInputChange('theme', 'secondary', e.target.value)} />
                      <ColorInputField label="Accent" value={editedConfig.theme?.accent || '#ec4899'} onChange={e => handleInputChange('theme', 'accent', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Kirim Undangan WhatsApp</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                              <PlusCircle className="mr-2 text-green-600" size={22} /> Tambahkan Tamu
                          </h3>
                          <form onSubmit={handleAddGuest} className="space-y-3">
                              <InputField label="Nama Tamu" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Masukkan Nama Tamu" />
                              <InputField label="Telepon" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="e.g., 628123456789" />
                              <button type="submit" disabled={isAdding} className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:bg-gray-400">
                                  {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Save size={16} />}
                                  <span>{isAdding ? 'Proses...' : 'Tambah Tamu'}</span>
                              </button>
                          </form>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                              <FileUp className="mr-2 text-blue-600" size={22} /> Impor dari CSV
                          </h3>
                          <input type="file" ref={importFileRef} onChange={handleImportCSV} className="hidden" accept=".csv" />
                          <button onClick={handleImportGuestsClick} disabled={isImporting} className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:bg-gray-400">
                              {isImporting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={16} />}
                              <span>{isImporting ? 'Impor...' : 'Impor Tamu dari CSV'}</span>
                          </button>
                          <p className="text-xs text-gray-500 mt-3">
                              <b>Format:</b> Buat file CSV dengan dua kolom: `Name,Phone`.
                              <br />
                              Contoh: `John Doe,628123456789`
                          </p>
                      </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Pesan Template</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Tulisan ini `*guestname*` akan berubah otomatis sesuai nama tamu dan tulisan link ini juga `link url to guest name` akan otomatis berubah menjadi link untuk tamu ke web undangan.
                    </p>
                    <TextareaField 
                      label="WhatsApp Message" 
                      value={whatsappMessage} 
                      onChange={(e) => setWhatsappMessage(e.target.value)} 
                      rows={15}
                    />
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Daftar Tamu ({guests.length})</h3>
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full text-left">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="p-3 font-semibold text-sm text-gray-600">Nama</th>
                            <th className="p-3 font-semibold text-sm text-gray-600">Telepon</th>
                            <th className="p-3 font-semibold text-sm text-gray-600 text-center">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingGuests ? (
                            <tr><td colSpan={3} className="text-center p-4 text-gray-500 flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading Tamu...</td></tr>
                          ) : guests.length > 0 ? (
                            guests.map(guest => (
                              <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-3 text-gray-800">{guest.name}</td>
                                <td className="p-3 text-gray-600 font-mono">{guest.phone || 'N/A'}</td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => handleSendWhatsapp(guest)}
                                      disabled={!guest.phone || deletingId === guest.id}
                                      className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                      <Send size={14} /> <span>Kirim</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteGuest(guest)}
                                      disabled={deletingId === guest.id}
                                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
                                      title="Delete Guest"
                                    >
                                      {deletingId === guest.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={3} className="text-center p-4 text-gray-500">Tidak ada tamu yang ditemukan. Tambahkan tamu di atas atau impor berkas CSV.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'json' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Manajemen Pengaturan & Data</h2>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Impor / Ekspor</h3>
                    <div className="flex space-x-4">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                      <button onClick={handleImportClick} className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Upload size={18} /> <span>Impor JSON</span>
                      </button>
                      <button onClick={handleExport} className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Download size={18} /> <span>Ekspor JSON</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Mengimpor berkas akan menimpa perubahan yang belum disimpan saat ini.</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Live JSON Preview</h3>
                    <textarea
                      readOnly
                      value={JSON.stringify(editedConfig, null, 2)}
                      className="w-full h-96 bg-gray-900 text-green-300 font-mono text-xs rounded-lg p-4 border border-gray-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; focusColor?: string }> = 
({ label, value, onChange, type = 'text', placeholder, focusColor = 'focus:ring-rose-500' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:outline-none`}
    />
  </div>
);

const TextareaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; focusColor?: string; rows?: number }> = 
({ label, value, onChange, focusColor = 'focus:ring-rose-500', rows = 3 }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:outline-none`}
      />
    </div>
);

const ColorInputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = 
({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="p-1 h-10 w-10 block bg-white border border-gray-300 cursor-pointer rounded-lg"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none`}
      />
    </div>
  </div>
);

export default ClientDashboard;