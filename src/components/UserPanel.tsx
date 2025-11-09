// src/components/UserPanel.tsx - Enhanced Version
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, ShoppingBag, Heart, Download, Settings, 
  LogOut, Package, CreditCard, Eye, Calendar,
  ArrowLeft, FileText, Mail, Phone, MapPin,
  Upload, Image as ImageIcon, Video, Music, Trash2, Copy,
  CheckCircle, AlertCircle, Loader2, X, ExternalLink,
  Share, Edit3, BookOpen, MessageSquare, Users, Send,
  PlusCircle, FileUp, UserCheck, UserX, Clock, MessageCircle
} from 'lucide-react';
import { supabase, WeddingTemplate, UserPortfolio, UserMedia } from '../lib/supabase';
import TemplateCard from './TemplateCard';
import PortfolioFormModal from './PortfolioFormModal';
import InvitationConfigModal from './InvitationConfigModal';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  storage_limit: number;
  created_at: string;
}

interface UserInvitation {
  id: string;
  template_id: string;
  price_paid: number;
  purchase_date: string;
  access_url: string;
  status: string;
  wedding_templates: {
    title: string;
    thumbnail_url: string;
    category: string;
  };
}

interface RSVPEntry {
  id: string;
  name: string;
  email: string;
  guests: number;
  attending: boolean;
  dietary_requirements: string;
  message: string;
  created_at: string;
  invitation_id: string;
}

interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
  invitation_id: string;
}

interface Guest {
  id: string;
  name: string;
  phone: string | null;
  invitation_id: string;
  created_at: string;
}

interface UserPanelProps {
  onViewDetails: (template: WeddingTemplate) => void;
  onCreateInvitation: (template: WeddingTemplate) => void;
  onToggleFavorite: (templateId: string) => void;
  favoriteIds: string[];
  createdInvitationIds: string[];
  onGoToUserPanel: () => void;
  onNavigateHome: () => void;
}

export default function UserPanel({
  onViewDetails,
  onCreateInvitation,
  onToggleFavorite,
  favoriteIds,
  createdInvitationIds,
  onGoToUserPanel,
  onNavigateHome,
}: UserPanelProps) {
  const [activeTab, setActiveTab] = useState<'invitations' | 'media' | 'favorites' | 'rsvp' | 'guestbook' | 'whatsapp' | 'profile' | 'settings'>('invitations');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [invitations, setInvitations] = useState<UserInvitation[]>([]);
  const [favoriteTemplates, setFavoriteTemplates] = useState<WeddingTemplate[]>([]);
  const [media, setMedia] = useState<UserMedia[]>([]);
  const [portfolios, setPortfolios] = useState<UserPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'music'>('all');
  
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configInvitation, setConfigInvitation] = useState<UserInvitation | null>(null);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingInvitation, setEditingInvitation] = useState<UserInvitation | null>(null);
  
  const handleOpenConfig = (invitation: UserInvitation) => {
  setConfigInvitation(invitation);
  setShowConfigModal(true);
};

const handleCloseConfig = () => {
  setConfigInvitation(null);
  setShowConfigModal(false);
};

const handleSaveConfig = () => {
  handleCloseConfig();
  showNotification('success', 'Konfigurasi undangan berhasil disimpan!');
};

  // RSVP State
  const [rsvpData, setRsvpData] = useState<RSVPEntry[]>([]);
  const [loadingRSVP, setLoadingRSVP] = useState(false);
  const [selectedInvitationForRSVP, setSelectedInvitationForRSVP] = useState<string | null>(null);

  // Guest Book State
  const [guestBookData, setGuestBookData] = useState<GuestBookEntry[]>([]);
  const [loadingGuestBook, setLoadingGuestBook] = useState(false);
  const [selectedInvitationForGuestBook, setSelectedInvitationForGuestBook] = useState<string | null>(null);

  // WhatsApp State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [selectedInvitationForWhatsApp, setSelectedInvitationForWhatsApp] = useState<string | null>(null);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  
  const [whatsappMessage, setWhatsappMessage] = useState(
    `_Assalamualaikum Warahmatullahi Wabarakatuh_\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *[GUEST_NAME]* untuk menghadiri acara kami.\n\n*Berikut link undangan kami:*\n[INVITATION_URL]\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\n*Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.*\n\nTerima kasih banyak atas perhatiannya.`
  );

  // Helper Functions
  const getStorageLimit = () => {
    if (!profile) return 100 * 1024 * 1024;
    if (profile.storage_limit === -1) return -1;
    return profile.storage_limit;
  };

  const getCurrentStorageUsage = () => {
    return media.reduce((sum, m) => sum + m.file_size, 0);
  };

  const getStoragePercentage = () => {
    const limit = getStorageLimit();
    if (limit === -1) return 0;
    const usage = getCurrentStorageUsage();
    return Math.min((usage / limit) * 100, 100);
  };

  const isStorageFull = () => {
    const limit = getStorageLimit();
    if (limit === -1) return false;
    return getCurrentStorageUsage() >= limit;
  };

  const formatStorageLimit = () => {
    const limit = getStorageLimit();
    if (limit === -1) return 'Unlimited';
    return formatFileSize(limit);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('success', 'URL berhasil disalin!');
  };

  const handleOpenPortfolioForm = (invitation: UserInvitation) => {
    setEditingInvitation(invitation);
    setShowPortfolioForm(true);
  };

  const handleClosePortfolioForm = () => {
    setEditingInvitation(null);
    setShowPortfolioForm(false);
  };

  const handleSavePortfolio = () => {
    loadUserData(); // Reload all data to reflect changes
    handleClosePortfolioForm();
    showNotification('success', 'Portofolio berhasil disimpan!');
  };

  // Load Data Functions
  useEffect(() => {
    loadUserData();
  }, [favoriteIds]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);

        const { data: invitationsData } = await supabase
          .from('purchases')
          .select(`*, wedding_templates (title, thumbnail_url, category)`)
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false });
        
        setInvitations(invitationsData || []);

        if (favoriteIds.length > 0) {
          const { data: favTemplatesData, error: favError } = await supabase
            .from('wedding_templates')
            .select('*')
            .in('id', favoriteIds);

          if (!favError) {
            const idOrderMap = new Map(favoriteIds.map((id, index) => [id, index]));
            const sorted = favTemplatesData.sort((a, b) => (idOrderMap.get(a.id) ?? 999) - (idOrderMap.get(b.id) ?? 999));
            setFavoriteTemplates(sorted || []);
          }
        } else {
          setFavoriteTemplates([]);
        }

        const { data: portfoliosData } = await supabase
          .from('user_portfolios')
          .select('*')
          .eq('user_id', user.id);
        setPortfolios(portfoliosData || []);

        await loadMedia();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showNotification('error', 'Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const loadMedia = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_media')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error loading media:', error);
      showNotification('error', 'Gagal memuat media');
    }
  };

  // RSVP Functions
  const loadRSVPData = async (invitationId: string) => {
    setLoadingRSVP(true);
    try {
      const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRsvpData(data || []);
    } catch (error) {
      console.error('Error loading RSVP:', error);
      showNotification('error', 'Gagal memuat data RSVP');
    } finally {
      setLoadingRSVP(false);
    }
  };

  const deleteRSVPEntry = async (id: string) => {
    if (!confirm('Hapus entri RSVP ini?')) return;
    
    try {
      const { error } = await supabase
        .from('rsvp')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRsvpData(prev => prev.filter(r => r.id !== id));
      showNotification('success', 'RSVP berhasil dihapus');
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      showNotification('error', 'Gagal menghapus RSVP');
    }
  };

  const exportRSVP = () => {
    if (rsvpData.length === 0) {
      showNotification('error', 'Tidak ada data untuk diekspor');
      return;
    }

    const csvContent = [
      ['Nama', 'Email', 'Jumlah Tamu', 'Kehadiran', 'Kebutuhan Diet', 'Pesan', 'Tanggal'].join(','),
      ...rsvpData.map(r => [
        r.name,
        r.email,
        r.guests,
        r.attending ? 'Hadir' : 'Tidak Hadir',
        r.dietary_requirements || '-',
        `"${r.message.replace(/"/g, '""')}"`,
        new Date(r.created_at).toLocaleDateString('id-ID')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rsvp_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Guest Book Functions
  const loadGuestBookData = async (invitationId: string) => {
    setLoadingGuestBook(true);
    try {
      const { data, error } = await supabase
        .from('guest_book')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuestBookData(data || []);
    } catch (error) {
      console.error('Error loading guest book:', error);
      showNotification('error', 'Gagal memuat buku tamu');
    } finally {
      setLoadingGuestBook(false);
    }
  };

  const deleteGuestBookEntry = async (id: string) => {
    if (!confirm('Hapus pesan ini?')) return;
    
    try {
      const { error } = await supabase
        .from('guest_book')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setGuestBookData(prev => prev.filter(g => g.id !== id));
      showNotification('success', 'Pesan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting guest book:', error);
      showNotification('error', 'Gagal menghapus pesan');
    }
  };

  const exportGuestBook = () => {
    if (guestBookData.length === 0) {
      showNotification('error', 'Tidak ada data untuk diekspor');
      return;
    }

    const csvContent = [
      ['Nama', 'Pesan', 'Tanggal'].join(','),
      ...guestBookData.map(g => [
        g.name,
        `"${g.message.replace(/"/g, '""')}"`,
        new Date(g.created_at).toLocaleDateString('id-ID')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `guest_book_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // WhatsApp Functions
  const loadGuests = async (invitationId: string) => {
    setLoadingGuests(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('name', { ascending: true });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error loading guests:', error);
      showNotification('error', 'Gagal memuat daftar tamu');
    } finally {
      setLoadingGuests(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !selectedInvitationForWhatsApp) {
      showNotification('error', 'Nama tamu wajib diisi');
      return;
    }

    setIsAddingGuest(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([{ 
          name: newGuestName.trim(), 
          phone: newGuestPhone.trim() || null,
          invitation_id: selectedInvitationForWhatsApp
        }])
        .select();

      if (error) throw error;
      if (data) {
        setGuests(prev => [...prev, ...data].sort((a, b) => a.name.localeCompare(b.name)));
        setNewGuestName('');
        setNewGuestPhone('');
        showNotification('success', 'Tamu berhasil ditambahkan');
      }
    } catch (error) {
      console.error('Error adding guest:', error);
      showNotification('error', 'Gagal menambahkan tamu');
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    if (!confirm(`Hapus ${guest.name}?`)) return;

    setDeletingId(guest.id);
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .match({ id: guest.id });

      if (error) throw error;
      setGuests(prev => prev.filter(g => g.id !== guest.id));
      showNotification('success', 'Tamu berhasil dihapus');
    } catch (error) {
      console.error('Error deleting guest:', error);
      showNotification('error', 'Gagal menghapus tamu');
    } finally {
      setDeletingId(null);
    }
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedInvitationForWhatsApp) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const newGuests = rows.map(row => {
          const [name, phone] = row.split(',').map(field => field.trim());
          return { 
            name, 
            phone: phone || null,
            invitation_id: selectedInvitationForWhatsApp
          };
        }).filter(g => g.name);

        if (newGuests.length === 0) {
          showNotification('error', 'Tidak ada tamu valid dalam file');
          setIsImporting(false);
          return;
        }

        const { error } = await supabase
          .from('guests')
          .insert(newGuests);

        if (error) throw error;

        await loadGuests(selectedInvitationForWhatsApp);
        showNotification('success', `${newGuests.length} tamu berhasil diimpor!`);
      } catch (error) {
        console.error('Error importing CSV:', error);
        showNotification('error', 'Gagal mengimpor CSV');
      } finally {
        setIsImporting(false);
        if (importFileRef.current) {
          importFileRef.current.value = '';
        }
      }
    };

    reader.readAsText(file);
  };

  const handleSendWhatsApp = (guest: Guest) => {
    if (!guest.phone) {
      showNotification('error', `Nomor telepon tidak ada untuk ${guest.name}`);
      return;
    }

    const invitation = invitations.find(i => i.id === selectedInvitationForWhatsApp);
    if (!invitation) return;

    const cleanedPhone = guest.phone.replace(/[^0-9]/g, '');
    const invitationUrl = `${window.location.origin}${invitation.access_url}?to=${encodeURIComponent(guest.name)}`;

    const finalMessage = whatsappMessage
      .replace('[GUEST_NAME]', guest.name)
      .replace('[INVITATION_URL]', invitationUrl);

    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Media Upload Functions (keeping existing code)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video' | 'music') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (getStorageLimit() !== -1) {
      const currentUsage = getCurrentStorageUsage();
      const newTotalSize = currentUsage + file.size;
      
      if (newTotalSize > getStorageLimit()) {
        showNotification('error', 'Storage penuh! Hapus file atau hubungi admin.');
        event.target.value = '';
        return;
      }
    }

    const maxSizes = {
      image: 5 * 1024 * 1024,
      video: 50 * 1024 * 1024,
      music: 10 * 1024 * 1024
    };

    if (file.size > maxSizes[fileType]) {
      showNotification('error', `File terlalu besar! Maksimal ${maxSizes[fileType] / (1024 * 1024)}MB`);
      event.target.value = '';
      return;
    }

    const validTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/ogg'],
      music: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
    };

    if (!validTypes[fileType].includes(file.type)) {
      showNotification('error', 'Format file tidak didukung!');
      event.target.value = '';
      return;
    }

    setUploadingMedia(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const bucketName = `user-${fileType}s`;

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(95);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('user_media')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl,
          file_type: fileType,
          file_size: file.size,
          mime_type: file.type
        });

      if (dbError) throw dbError;

      setUploadProgress(100);
      showNotification('success', 'File berhasil diupload!');
      await loadMedia();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      showNotification('error', error.message || 'Gagal mengupload file');
    } finally {
      setUploadingMedia(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  const handleDeleteMedia = async (mediaItem: UserMedia) => {
    if (!confirm('Hapus file ini?')) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const urlParts = mediaItem.file_url.split('/');
      const fileName = `${user.id}/${urlParts[urlParts.length - 1]}`;
      const bucketName = `user-${mediaItem.file_type}s`;

      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('user_media')
        .delete()
        .eq('id', mediaItem.id);

      if (dbError) throw dbError;

      showNotification('success', 'File berhasil dihapus!');
      await loadMedia();
    } catch (error: any) {
      console.error('Error deleting media:', error);
      showNotification('error', error.message || 'Gagal menghapus file');
    }
  };

  const getMediaIcon = (type: string) => {
    switch(type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'music': return Music;
      default: return FileText;
    }
  };

  const filteredMedia = mediaFilter === 'all' ? media : media.filter(m => m.file_type === mediaFilter);

  const navItems = [
    { id: 'invitations', icon: Package, label: 'Undangan Saya', badge: invitations.length },
    { id: 'rsvp', icon: UserCheck, label: 'RSVP', badge: undefined },
    { id: 'guestbook', icon: MessageSquare, label: 'Buku Tamu', badge: undefined },
    { id: 'whatsapp', icon: Send, label: 'WhatsApp Blast', badge: undefined },
    { id: 'media', icon: Upload, label: 'Media Saya', badge: media.length },
    { id: 'favorites', icon: Heart, label: 'Favorit', badge: favoriteTemplates.length },
    { id: 'profile', icon: User, label: 'Profil Saya' },
    { id: 'settings', icon: Settings, label: 'Pengaturan' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3 animate-slideIn ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {showPortfolioForm && editingInvitation && (
        <PortfolioFormModal
          invitation={editingInvitation}
          existingPortfolio={portfolios.find(p => p.template_id === editingInvitation.template_id) || null}
          userMedia={media.filter(m => m.file_type === 'image')}
          onClose={handleClosePortfolioForm}
          onSave={handleSavePortfolio}
        />
      )}
      
      {showConfigModal && configInvitation && (
        <InvitationConfigModal
          invitation={configInvitation}
          onClose={() => { setShowConfigModal(false); setConfigInvitation(null); }}
          onSave={() => { setShowConfigModal(false); setConfigInvitation(null); showNotification('success', 'Konfigurasi berhasil disimpan!'); }}
          userMedia={media}
        />
      )}

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onNavigateHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Kembali ke Home</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100">
                <User className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-800">{profile?.full_name || profile?.email}</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{profile?.full_name || 'User'}</h3>
                <p className="text-sm text-gray-500 truncate">{profile?.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  profile?.role === 'admin' 
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {profile?.role === 'admin' ? '👑 Admin' : 'Customer'}
                </span>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          activeTab === item.id ? 'bg-white/20' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil Saya</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600">Nama Lengkap</label>
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-800">{profile?.full_name || '-'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600">Email</label>
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-800 truncate">{profile?.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600">Bergabung Sejak</label>
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-800">{formatDate(profile?.created_at || '')}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-600">Status Akun</label>
                      <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-800 font-semibold">Aktif</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
                    <h3 className="font-bold text-gray-800 mb-4">Statistik Akun</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                          {invitations.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Undangan Dibuat</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                          {media.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Media</div>
                      </div>
                      <div className="text-center">
                        {profile?.role === 'admin' ? (
                          <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                            ∞
                          </div>
                        ) : (
                          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent truncate">
                            {formatFileSize(getCurrentStorageUsage())}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 mt-1">
                          {profile?.role === 'admin' ? 'Unlimited' : 'Storage'}
                        </div>
                      </div>
                    </div>

                    {profile?.role === 'admin' && (
                      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                        <div className="flex items-center justify-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-amber-600" />
                          <span className="font-semibold text-amber-800">Admin Account - Unlimited Storage</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invitations Tab */}
              {activeTab === 'invitations' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Undangan Saya</h2>
                    <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold">
                      {invitations.length} Undangan
                    </span>
                  </div>

                  {invitations.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Undangan</h3>
                      <p className="text-gray-600 mb-6">Jelajahi template kami dan buat undangan pertama Anda!</p>
                      <button
                        onClick={onNavigateHome}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all"
                      >
                        Buat Undangan Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {invitations.map((invitation) => {
                        const portfolio = portfolios.find(p => p.template_id === invitation.template_id);
                        return (
                          <div
                            key={invitation.id}
                            className="bg-white rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-purple-300 hover:shadow-lg"
                          >
                            <div className="flex flex-col sm:flex-row gap-4">
                              <img
                                src={invitation.wedding_templates.thumbnail_url}
                                alt={invitation.wedding_templates.title}
                                className="w-full sm:w-40 h-40 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                                  <div>
                                    <h3 className="font-bold text-gray-800 text-lg">
                                      {invitation.wedding_templates.title}
                                    </h3>
                                    <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mt-1">
                                      {invitation.wedding_templates.category}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500 flex items-center space-x-1 flex-shrink-0">
                                    <Calendar className="w-3 h-3" />
                                    <span>Dibuat: {formatDate(invitation.purchase_date)}</span>
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-600">Link Undangan Anda:</label>
                                  <div className="flex items-center">
                                    <input
                                      type="text"
                                      readOnly
                                      value={`${window.location.origin}${invitation.access_url}`}
                                      className="w-full p-2 rounded-l-lg bg-gray-100 border border-gray-200 text-sm text-gray-700 outline-none"
                                      onClick={(e) => e.currentTarget.select()}
                                    />
                                    <button
                                      onClick={() => copyToClipboard(`${window.location.origin}${invitation.access_url}`)}
                                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-r-lg transition-colors"
                                      title="Copy Link"
                                    >
                                      <Copy className="w-4 h-4 text-gray-700" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                  <a
                                    href={invitation.access_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all text-sm"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>Lihat Undangan</span>
                                  </a>
                                  <button
                                    onClick={() => handleOpenPortfolioForm(invitation)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 transition-all text-sm"
                                  >
                                    <BookOpen className="w-4 h-4" />
                                    <span>{portfolio ? 'Edit Portofolio' : 'Buat Portofolio'}</span>
                                  </button>
                                  
                                <button
  onClick={() => handleOpenConfig(invitation)}
  className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 transition-all text-sm"
>
  <Settings className="w-4 h-4" />
  <span>Konfigurasi</span>
</button>  
                                  
                                  <button
                                    onClick={() => setActiveTab('media')}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-all text-sm"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Kelola Media</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Media Saya</h2>
                    <div className="flex items-center space-x-2">
                      <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                        {media.length} File
                      </span>
                      {profile?.role === 'admin' ? (
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm">
                          ∞ Unlimited
                        </span>
                      ) : (
                        <span className="px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-sm">
                          {formatFileSize(getCurrentStorageUsage())}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <label className={`relative group ${isStorageFull() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" disabled={uploadingMedia || isStorageFull()} />
                      <div className={`p-6 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 transition-all text-center ${!isStorageFull() && 'hover:bg-purple-100 group-hover:border-purple-500'}`}>
                        <ImageIcon className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Upload Gambar</h3>
                        <p className="text-xs text-gray-600">JPG, PNG, GIF, WEBP</p>
                        <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                      </div>
                    </label>
                    <label className={`relative group ${isStorageFull() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                      <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" disabled={uploadingMedia || isStorageFull()} />
                      <div className={`p-6 rounded-xl border-2 border-dashed border-cyan-300 bg-cyan-50 transition-all text-center ${!isStorageFull() && 'hover:bg-cyan-100 group-hover:border-cyan-500'}`}>
                        <Video className="w-12 h-12 text-cyan-500 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Upload Video</h3>
                        <p className="text-xs text-gray-600">MP4, WEBM, OGG</p>
                        <p className="text-xs text-gray-500 mt-1">Max 50MB</p>
                      </div>
                    </label>
                    <label className={`relative group ${isStorageFull() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                      <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, 'music')} className="hidden" disabled={uploadingMedia || isStorageFull()} />
                      <div className={`p-6 rounded-xl border-2 border-dashed border-pink-300 bg-pink-50 transition-all text-center ${!isStorageFull() && 'hover:bg-pink-100 group-hover:border-pink-500'}`}>
                        <Music className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-800 mb-1">Upload Musik</h3>
                        <p className="text-xs text-gray-600">MP3, WAV, OGG</p>
                        <p className="text-xs text-gray-500 mt-1">Max 10MB</p>
                      </div>
                    </label>
                  </div>

                  {isStorageFull() && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-red-800 mb-1">Storage Penuh!</h4>
                          <p className="text-sm text-red-700">Anda telah mencapai batas storage. Hapus file atau hubungi admin.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadingMedia && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                        <span className="text-sm font-semibold text-gray-800">Mengupload file...</span>
                        <span className="ml-auto text-sm font-bold text-purple-600">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
                    {[{ id: 'all', label: 'Semua', icon: FileText }, { id: 'image', label: 'Gambar', icon: ImageIcon }, { id: 'video', label: 'Video', icon: Video }, { id: 'music', label: 'Musik', icon: Music }].map((filter) => {
                      const Icon = filter.icon;
                      const count = filter.id === 'all' ? media.length : media.filter(m => m.file_type === filter.id).length;
                      return (
                        <button key={filter.id} onClick={() => setMediaFilter(filter.id as any)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${mediaFilter === filter.id ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}>
                          <Icon className="w-4 h-4" />
                          <span>{filter.label}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${mediaFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'}`}>{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {filteredMedia.length === 0 ? (
                    <div className="text-center py-12">
                      <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Media</h3>
                      <p className="text-gray-600">Upload media untuk memulai!</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMedia.map((item) => {
                        const Icon = getMediaIcon(item.file_type);
                        return (
                          <div key={item.id} className="group relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
                            <div className="relative aspect-video bg-gray-100">
                              {item.file_type === 'image' && <img src={item.file_url} alt={item.file_name} className="w-full h-full object-cover" loading="lazy" />}
                              {item.file_type === 'video' && <video src={item.file_url} className="w-full h-full object-cover" controls preload="metadata" />}
                              {item.file_type === 'music' && <div className="absolute inset-0 flex items-center justify-center bg-pink-100"><Music className="w-16 h-16 text-pink-400" /></div>}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                <button onClick={() => copyToClipboard(item.file_url)} className="p-3 rounded-full bg-white/90 hover:bg-white text-purple-600 transition-all hover:scale-110" title="Copy URL"><Copy className="w-5 h-5" /></button>
                                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/90 hover:bg-white text-cyan-600 transition-all hover:scale-110" title="Buka"><ExternalLink className="w-5 h-5" /></a>
                                <button onClick={() => handleDeleteMedia(item)} className="p-3 rounded-full bg-white/90 hover:bg-white text-red-600 transition-all hover:scale-110" title="Hapus"><Trash2 className="w-5 h-5" /></button>
                              </div>
                              <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${item.file_type === 'image' ? 'bg-purple-500' : item.file_type === 'video' ? 'bg-cyan-500' : 'bg-pink-500'}`}><Icon className="w-3 h-3 inline mr-1" />{item.file_type.toUpperCase()}</div>
                            </div>
                            <div className="p-4 bg-white">
                              <h4 className="font-semibold text-gray-800 text-sm truncate mb-2" title={item.file_name}>{item.file_name}</h4>
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                                <span className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{formatDate(item.created_at)}</span></span>
                                <span className="font-semibold text-purple-600">{formatFileSize(item.file_size)}</span>
                              </div>
                              <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <input type="text" value={item.file_url} readOnly className="flex-1 text-xs text-gray-600 bg-transparent outline-none truncate" onClick={(e) => e.currentTarget.select()} />
                                  <button onClick={() => copyToClipboard(item.file_url)} className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors" title="Copy URL"><Copy className="w-3 h-3 text-gray-600" /></button>
                                </div>
                              </div>
                              {item.file_type === 'music' && <div className="mt-3"><audio src={item.file_url} controls className="w-full" style={{ height: '40px' }} preload="metadata" /></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 flex items-center">Penggunaan Storage {profile?.role === 'admin' && <span className="ml-2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">∞ UNLIMITED</span>}</h4>
                      <span className="text-sm font-semibold text-purple-600">{formatFileSize(getCurrentStorageUsage())} {getStorageLimit() !== -1 && `/ ${formatStorageLimit()}`}</span>
                    </div>
                    {getStorageLimit() === -1 ? <div className="w-full bg-amber-200 rounded-full h-2 mb-4 overflow-hidden"><div className="h-full bg-amber-500 animate-pulse" style={{ width: '100%' }} /></div> : <div className="w-full bg-gray-200 rounded-full h-2 mb-4"><div className={`h-2 rounded-full transition-all ${getStoragePercentage() >= 90 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${getStoragePercentage()}%` }} /></div>}
                  </div>
                  
                  <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center"><AlertCircle className="w-5 h-5 text-blue-600 mr-2" />Cara Menggunakan Media</h4>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start"><span className="font-bold text-blue-600 mr-2">1.</span><span>Upload gambar, video, atau musik di atas.</span></li>
                      <li className="flex items-start"><span className="font-bold text-blue-600 mr-2">2.</span><span>Salin URL yang tersedia di setiap kartu media.</span></li>
                      <li className="flex items-start"><span className="font-bold text-blue-600 mr-2">3.</span><span>Gunakan URL ini di editor undangan Anda untuk menambahkan konten pribadi (foto, musik, dll).</span></li>
                      <li className="flex items-start"><span className="font-bold text-blue-600 mr-2">4.</span><span>Jadikan undangan Anda lebih personal dan unik dengan media Anda sendiri!</span></li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === 'favorites' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Template Favorit</h2>
                    <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold">
                      {favoriteTemplates.length} Favorit
                    </span>
                  </div>
                  {favoriteTemplates.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Favorit</h3>
                      <p className="text-gray-600 mb-6">Template yang Anda favoritkan akan muncul di sini.</p>
                      <button onClick={onNavigateHome} className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all">Jelajahi Template</button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {favoriteTemplates.map((template, index) => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          onViewDetails={onViewDetails}
                          favoriteIds={favoriteIds}
                          onToggleFavorite={onToggleFavorite}
                          createdInvitationIds={createdInvitationIds}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Akun</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer"><div className="flex items-center justify-between"><div><h3 className="font-bold text-gray-800 mb-1">Ubah Password</h3><p className="text-sm text-gray-600">Perbarui password akun Anda.</p></div><ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" /></div></div>
                    <div className="p-4 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all cursor-pointer"><div className="flex items-center justify-between"><div><h3 className="font-bold text-red-600 mb-1">Hapus Akun</h3><p className="text-sm text-gray-600">Hapus akun dan semua data secara permanen.</p></div><ArrowLeft className="w-5 h-5 text-red-400 rotate-180" /></div></div>
                  </div>
                </div>
              )}
              
              {/* RSVP Tab */}
              {activeTab === 'rsvp' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <UserCheck className="w-6 h-6 mr-2 text-purple-600" />
                      Data RSVP
                    </h2>
                  </div>

                  {/* Invitation Selector */}
                  <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-4 border border-purple-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pilih Undangan
                    </label>
                    <select
                      value={selectedInvitationForRSVP || ''}
                      onChange={(e) => {
                        setSelectedInvitationForRSVP(e.target.value);
                        if (e.target.value) loadRSVPData(e.target.value);
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none"
                    >
                      <option value="">-- Pilih Undangan --</option>
                      {invitations.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.wedding_templates.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedInvitationForRSVP && (
                    <>
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Hadir</p>
                              <p className="text-2xl font-bold text-green-600">
                                {rsvpData.filter(r => r.attending).length}
                              </p>
                            </div>
                            <UserCheck className="w-8 h-8 text-green-600" />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Tidak Hadir</p>
                              <p className="text-2xl font-bold text-red-600">
                                {rsvpData.filter(r => !r.attending).length}
                              </p>
                            </div>
                            <UserX className="w-8 h-8 text-red-600" />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Total Tamu</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {rsvpData.reduce((sum, r) => sum + (r.attending ? r.guests : 0), 0)}
                              </p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>
                      </div>

                      {/* Export Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={exportRSVP}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
                      </div>

                      {/* RSVP List */}
                      {loadingRSVP ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        </div>
                      ) : rsvpData.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600">Belum ada RSVP untuk undangan ini</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">NAMA</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">EMAIL</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">TAMU</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">STATUS</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">TANGGAL</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">AKSI</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {rsvpData.map(rsvp => (
                                <tr key={rsvp.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <div>
                                      <p className="font-medium text-gray-800">{rsvp.name}</p>
                                      {rsvp.message && (
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{rsvp.message}</p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{rsvp.email}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                      {rsvp.guests}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    {rsvp.attending ? (
                                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        Hadir
                                      </span>
                                    ) : (
                                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                        Tidak Hadir
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {new Date(rsvp.created_at).toLocaleDateString('id-ID')}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      onClick={() => deleteRSVPEntry(rsvp.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Hapus"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Guest Book Tab */}
              {activeTab === 'guestbook' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <MessageSquare className="w-6 h-6 mr-2 text-purple-600" />
                      Buku Tamu
                    </h2>
                  </div>

                  {/* Invitation Selector */}
                  <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-4 border border-purple-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pilih Undangan
                    </label>
                    <select
                      value={selectedInvitationForGuestBook || ''}
                      onChange={(e) => {
                        setSelectedInvitationForGuestBook(e.target.value);
                        if (e.target.value) loadGuestBookData(e.target.value);
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none"
                    >
                      <option value="">-- Pilih Undangan --</option>
                      {invitations.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.wedding_templates.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedInvitationForGuestBook && (
                    <>
                      {/* Stats and Export */}
                      <div className="flex items-center justify-between">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center space-x-3">
                            <MessageCircle className="w-8 h-8 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-600">Total Pesan</p>
                              <p className="text-2xl font-bold text-purple-600">{guestBookData.length}</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={exportGuestBook}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
                      </div>

                      {/* Guest Book Messages */}
                      {loadingGuestBook ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        </div>
                      ) : guestBookData.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600">Belum ada pesan di buku tamu</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {guestBookData.map((entry, index) => (
                            <div
                              key={entry.id}
                              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                      {entry.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-800">{entry.name}</h4>
                                      <p className="text-xs text-gray-500">
                                        {formatDate(entry.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed ml-13">
                                    {entry.message}
                                  </p>
                                </div>
                                <button
                                  onClick={() => deleteGuestBookEntry(entry.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* WhatsApp Tab */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <Send className="w-6 h-6 mr-2 text-green-600" />
                      WhatsApp Blast
                    </h2>
                  </div>

                  {/* Invitation Selector */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pilih Undangan
                    </label>
                    <select
                      value={selectedInvitationForWhatsApp || ''}
                      onChange={(e) => {
                        setSelectedInvitationForWhatsApp(e.target.value);
                        if (e.target.value) loadGuests(e.target.value);
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-400 outline-none"
                    >
                      <option value="">-- Pilih Undangan --</option>
                      {invitations.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.wedding_templates.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedInvitationForWhatsApp && (
                    <>
                      {/* Add Guest and Import */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <PlusCircle className="w-5 h-5 mr-2 text-green-600" />
                            Tambah Tamu
                          </h3>
                          <form onSubmit={handleAddGuest} className="space-y-3">
                            <input
                              type="text"
                              value={newGuestName}
                              onChange={(e) => setNewGuestName(e.target.value)}
                              placeholder="Nama Tamu"
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-400 outline-none"
                            />
                            <input
                              type="text"
                              value={newGuestPhone}
                              onChange={(e) => setNewGuestPhone(e.target.value)}
                              placeholder="Nomor WhatsApp (628xxx)"
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-400 outline-none"
                            />
                            <button
                              type="submit"
                              disabled={isAddingGuest}
                              className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                            >
                              {isAddingGuest ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                              <span>{isAddingGuest ? 'Menambah...' : 'Tambah Tamu'}</span>
                            </button>
                          </form>
                        </div>

                        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FileUp className="w-5 h-5 mr-2 text-blue-600" />
                            Import CSV
                          </h3>
                          <input
                            type="file"
                            ref={importFileRef}
                            onChange={handleImportCSV}
                            accept=".csv"
                            className="hidden"
                          />
                          <button
                            onClick={() => importFileRef.current?.click()}
                            disabled={isImporting}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                          >
                            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            <span>{isImporting ? 'Mengimpor...' : 'Import dari CSV'}</span>
                          </button>
                          <p className="text-xs text-gray-500 mt-2">
                            Format: Nama,Nomor (contoh: John Doe,628123456789)
                          </p>
                        </div>
                      </div>

                      {/* Message Template */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Template Pesan</h3>
                        <textarea
                          value={whatsappMessage}
                          onChange={(e) => setWhatsappMessage(e.target.value)}
                          rows={8}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          <strong>Placeholder:</strong> [GUEST_NAME] akan diganti dengan nama tamu, [INVITATION_URL] akan diganti dengan link undangan
                        </p>
                      </div>

                      {/* Guest List */}
                      <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Daftar Tamu ({guests.length})
                        </h3>
                        
                        {loadingGuests ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                          </div>
                        ) : guests.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Belum ada tamu. Tambahkan tamu di atas.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">NAMA</th>
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">TELEPON</th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">AKSI</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {guests.map(guest => (
                                  <tr key={guest.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-800">{guest.name}</td>
                                    <td className="px-4 py-3 text-gray-600 font-mono text-sm">
                                      {guest.phone || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center justify-center space-x-2">
                                        <button
                                          onClick={() => handleSendWhatsApp(guest)}
                                          disabled={!guest.phone || deletingId === guest.id}
                                          className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 text-xs"
                                        >
                                          <Send className="w-3 h-3" />
                                          <span>Kirim</span>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteGuest(guest)}
                                          disabled={deletingId === guest.id}
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                          {deletingId === guest.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                          ) : (
                                            <Trash2 className="w-4 h-4" />
                                          )}
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}