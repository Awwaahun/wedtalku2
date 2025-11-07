

// src/components/UserPanel.tsx
import React, { useState, useEffect } from 'react';
import { 
  User, ShoppingBag, Heart, Download, Settings, 
  LogOut, Package, CreditCard, Eye, Calendar,
  ArrowLeft, FileText, Mail, Phone, MapPin,
  Upload, Image as ImageIcon, Video, Music, Trash2, Copy,
  CheckCircle, AlertCircle, Loader2, X, ExternalLink,
  Share, Edit3, BookOpen
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
  storage_limit: number; // -1 = unlimited
  created_at: string;
}

// Represents a created invitation
interface UserInvitation {
  id: string;
  template_id: string;
  price_paid: number;
  purchase_date: string; // Represents creation_date
  access_url: string;    // The unique URL
  status: string;
  wedding_templates: {
    title: string;
    thumbnail_url: string;
    category: string;
  };
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
  const [activeTab, setActiveTab] = useState<'invitations' | 'media' | 'favorites' | 'profile' | 'settings'>('invitations');
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

  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingInvitation, setEditingInvitation] = useState<UserInvitation | null>(null);

  // Helper Functions for Storage Management
  const getStorageLimit = () => {
    if (!profile) return 100 * 1024 * 1024; // 100MB default
    if (profile.storage_limit === -1) return -1; // Unlimited
    return profile.storage_limit;
  };

  const getCurrentStorageUsage = () => {
    return media.reduce((sum, m) => sum + m.file_size, 0);
  };

  const getStoragePercentage = () => {
    const limit = getStorageLimit();
    if (limit === -1) return 0; // Unlimited = 0%
    const usage = getCurrentStorageUsage();
    return Math.min((usage / limit) * 100, 100);
  };

  const isStorageFull = () => {
    const limit = getStorageLimit();
    if (limit === -1) return false; // Unlimited never full
    return getCurrentStorageUsage() >= limit;
  };

  const formatStorageLimit = () => {
    const limit = getStorageLimit();
    if (limit === -1) return 'Unlimited';
    return formatFileSize(limit);
  };

  useEffect(() => {
    loadUserData();
  }, [favoriteIds]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // FIX: Cast supabase.auth to any to bypass TypeScript error due to likely version mismatch.
      const { data: { user } } = await (supabase.auth as any).getUser();
      
      if (user) {
        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);

        // Load created invitations (from 'purchases' table)
        const { data: invitationsData } = await supabase
          .from('purchases')
          .select(`
            *,
            wedding_templates (
              title,
              thumbnail_url,
              category
            )
          `)
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false });
        
        setInvitations(invitationsData || []);

        // Load favorite templates using IDs from App.tsx
        if (favoriteIds.length > 0) {
            const { data: favTemplatesData, error: favError } = await supabase
                .from('wedding_templates')
                .select('*')
                .in('id', favoriteIds);

            if (favError) {
                console.error('Error loading favorite templates:', favError);
                setFavoriteTemplates([]);
            } else {
                // The order from .in() is not guaranteed, so we create a map for ordering
                const idOrderMap = new Map(favoriteIds.map((id, index) => [id, index]));
                const sorted = favTemplatesData.sort((a, b) => (idOrderMap.get(a.id) ?? 999) - (idOrderMap.get(b.id) ?? 999));
                setFavoriteTemplates(sorted || []);
            }
        } else {
            setFavoriteTemplates([]);
        }

        // Load portfolios
        const { data: portfoliosData } = await supabase
          .from('user_portfolios')
          .select('*')
          .eq('user_id', user.id);
        setPortfolios(portfoliosData || []);


        // Load media
        await loadMedia();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showNotification('error', 'Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
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


  const loadMedia = async () => {
    try {
      const { data: { user } } = await (supabase.auth as any).getUser();
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video' | 'music') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check storage limit (skip for admin)
    if (getStorageLimit() !== -1) {
      const currentUsage = getCurrentStorageUsage();
      const newTotalSize = currentUsage + file.size;
      
      if (newTotalSize > getStorageLimit()) {
        showNotification('error', 'Storage Anda penuh! Hapus beberapa file atau hubungi admin.');
        event.target.value = '';
        return;
      }
    }

    // Validate file size
    const maxSizes = {
      image: 5 * 1024 * 1024,  // 5MB
      video: 50 * 1024 * 1024, // 50MB
      music: 10 * 1024 * 1024  // 10MB
    };

    if (file.size > maxSizes[fileType]) {
      showNotification('error', `File terlalu besar! Maksimal ${maxSizes[fileType] / (1024 * 1024)}MB`);
      event.target.value = '';
      return;
    }

    // Validate file type
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
      const { data: { user } } = await (supabase.auth as any).getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const bucketName = `user-${fileType}s`;

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(95);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // Save metadata to database
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
    if (!confirm('Apakah Anda yakin ingin menghapus file ini?')) return;

    try {
      const { data: { user } } = await (supabase.auth as any).getUser();
      if (!user) throw new Error('User not authenticated');

      // Extract file path from URL
      const urlParts = mediaItem.file_url.split('/');
      const fileName = `${user.id}/${urlParts[urlParts.length - 1]}`;
      const bucketName = `user-${mediaItem.file_type}s`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('success', 'URL berhasil disalin!');
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSignOut = async () => {
    await (supabase.auth as any).signOut();
    window.location.href = '/';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getMediaIcon = (type: string) => {
    switch(type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'music': return Music;
      default: return FileText;
    }
  };

  const filteredMedia = mediaFilter === 'all' 
    ? media 
    : media.filter(m => m.file_type === mediaFilter);

  const navItems = [
    { id: 'invitations', icon: Package, label: 'Undangan Saya', badge: invitations.length },
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
    onClose={handleCloseConfig}
    onSave={handleSaveConfig}
    userMedia={media.filter(m => m.file_type === 'image' || m.file_type === 'video' || m.file_type === 'music')}
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
              {/* Profile Summary */}
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

              {/* Navigation */}
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

            </div>
          </main>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}