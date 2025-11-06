import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Image as ImageIcon, User, Calendar, MapPin, BookOpen, Trash2, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, UserPortfolio, UserMedia } from '../lib/supabase';

interface UserInvitation {
  id: string;
  template_id: string;
  access_url: string;
  wedding_templates: { title: string };
}

interface PortfolioFormModalProps {
  invitation: UserInvitation;
  existingPortfolio: UserPortfolio | null;
  userMedia: UserMedia[];
  onClose: () => void;
  onSave: () => void;
}

const PortfolioFormModal: React.FC<PortfolioFormModalProps> = ({ 
  invitation, 
  existingPortfolio, 
  userMedia, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    groom_name: '',
    bride_name: '',
    wedding_date: '',
    location: '',
    story: '',
    couple_photo_url: '',
    groom_photo_url: '',
    bride_photo_url: '',
    invitation_url: '',
    is_published: false,
  });

  const [activePhotoPicker, setActivePhotoPicker] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState('');

  useEffect(() => {
    if (existingPortfolio) {
      setFormData({
        groom_name: existingPortfolio.groom_name || '',
        bride_name: existingPortfolio.bride_name || '',
        wedding_date: existingPortfolio.wedding_date ? existingPortfolio.wedding_date.split('T')[0] : '',
        location: existingPortfolio.location || '',
        story: existingPortfolio.story || '',
        couple_photo_url: existingPortfolio.couple_photo_url || '',
        groom_photo_url: existingPortfolio.groom_photo_url || '',
        bride_photo_url: existingPortfolio.bride_photo_url || '',
        invitation_url: (existingPortfolio as any).invitation_url || invitation.access_url || '',
        is_published: existingPortfolio.is_published || false,
      });
    } else {
      setFormData(prev => ({
        ...prev,
        invitation_url: invitation.access_url || ''
      }));
    }
  }, [existingPortfolio, invitation.access_url]);

  // Generate slug ketika nama berubah
  useEffect(() => {
    if (formData.groom_name && formData.bride_name) {
      const groomFirstName = formData.groom_name.split(' ')[0].toLowerCase();
      const brideFirstName = formData.bride_name.split(' ')[0].toLowerCase();
      
      let slug = `${groomFirstName}-${brideFirstName}`;
      
      slug = slug
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setGeneratedSlug(slug);
    }
  }, [formData.groom_name, formData.bride_name]);

  const handleSelectPhoto = (url: string) => {
    if (activePhotoPicker) {
      setFormData(prev => ({ ...prev, [activePhotoPicker]: url }));
      setActivePhotoPicker(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await (supabase.auth as any).getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Generate slug dari nama
      const groomFirstName = formData.groom_name.split(' ')[0].toLowerCase();
      const brideFirstName = formData.bride_name.split(' ')[0].toLowerCase();
      
      let slug = `${groomFirstName}-${brideFirstName}`;
      
      // Bersihkan slug
      slug = slug
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const newInvitationUrl = `/invitations/${slug}`;
      
      // Cek apakah slug sudah digunakan oleh user lain
      const { data: existingInvitation } = await supabase
        .from('purchases')
        .select('id, user_id')
        .eq('access_url', newInvitationUrl)
        .single();
      
      let finalUrl = newInvitationUrl;
      
      // Jika slug sudah ada dan bukan milik user ini, tambahkan angka
      if (existingInvitation && existingInvitation.user_id !== user.id) {
        const randomNum = Math.floor(Math.random() * 9999);
        finalUrl = `/invitations/${slug}-${randomNum}`;
      }
      
      const portfolioData = {
        ...formData,
        user_id: user.id,
        template_id: invitation.template_id,
      };

      const { error: portfolioError } = await supabase
        .from('user_portfolios')
        .upsert(portfolioData, { onConflict: 'user_id,template_id' });
        
      if (portfolioError) throw portfolioError;
      
      // Update access_url di tabel purchases
      const { error: purchaseError } = await supabase
        .from('purchases')
        .update({ access_url: finalUrl })
        .eq('user_id', user.id)
        .eq('template_id', invitation.template_id);
      
      if (purchaseError) throw purchaseError;
      
      onSave();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert('Gagal menyimpan portofolio.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingPortfolio || !confirm('Apakah Anda yakin ingin menghapus portofolio ini? Tindakan ini tidak dapat dibatalkan.')) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('user_portfolios').delete().eq('id', existingPortfolio.id);
      if (error) throw error;
      onSave();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Gagal menghapus portofolio.');
    } finally {
      setDeleting(false);
    }
  };

  const PhotoInput = ({ name, label, icon: Icon }: { 
    name: keyof typeof formData, 
    label: string, 
    icon: React.ElementType 
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="aspect-square w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative group">
        {formData[name] ? (
          <img src={formData[name] as string} alt={label} className="w-full h-full object-cover rounded-xl"/>
        ) : (
          <Icon className="w-10 h-10 text-gray-400" />
        )}
        <div 
          onClick={() => setActivePhotoPicker(name)}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-xl"
        >
          <p className="text-white font-semibold">Pilih Foto</p>
        </div>
      </div>
    </div>
  );

  if (activePhotoPicker) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg">Pilih Foto</h3>
            <button onClick={() => setActivePhotoPicker(null)} className="p-2 rounded-full hover:bg-gray-100">
              <X/>
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            {userMedia.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                Anda belum mengupload gambar. Silakan upload di tab Media Saya.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {userMedia.map(media => (
                  <button 
                    key={media.id} 
                    onClick={() => handleSelectPhoto(media.file_url)} 
                    className="aspect-square rounded-lg overflow-hidden group relative"
                  >
                    <img 
                      src={media.file_url} 
                      alt={media.file_name} 
                      className="w-full h-full object-cover"
                    />
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
    );
  }

  const fullInvitationUrl = generatedSlug 
    ? `${window.location.origin}/invitations/${generatedSlug}`
    : formData.invitation_url.startsWith('http') 
      ? formData.invitation_url 
      : `${window.location.origin}${formData.invitation_url}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl animate-scaleIn flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-200 z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {existingPortfolio ? 'Edit Portofolio' : 'Buat Portofolio Baru'}
            </h3>
            <p className="text-sm text-gray-500">Untuk template: {invitation.wedding_templates.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Photos */}
            <div className="lg:col-span-1 space-y-4">
              <PhotoInput name="couple_photo_url" label="Foto Utama Pasangan" icon={ImageIcon} />
              <PhotoInput name="groom_photo_url" label="Foto Mempelai Pria" icon={User} />
              <PhotoInput name="bride_photo_url" label="Foto Mempelai Wanita" icon={User} />
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Mempelai Pria *
                  </label>
                  <input 
                    type="text" 
                    value={formData.groom_name} 
                    onChange={e => setFormData({...formData, groom_name: e.target.value})} 
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" 
                    required 
                    placeholder="contoh: Adam Kurniawan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Mempelai Wanita *
                  </label>
                  <input 
                    type="text" 
                    value={formData.bride_name} 
                    onChange={e => setFormData({...formData, bride_name: e.target.value})} 
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" 
                    required 
                    placeholder="contoh: Sarah Anggraini"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Pernikahan
                  </label>
                  <input 
                    type="date" 
                    value={formData.wedding_date} 
                    onChange={e => setFormData({...formData, wedding_date: e.target.value})} 
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    placeholder="cth. Bali, Indonesia" 
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-purple-600" />
                  Link Undangan Website (Auto-Generated)
                </label>
                <div className="space-y-2">
                  {generatedSlug && (
                    <div className="flex items-start space-x-2 p-3 rounded-lg bg-green-50 border border-green-200">
                      <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-700 flex-1">
                        <p className="font-semibold mb-1">✓ URL Otomatis Dibuat dari Nama:</p>
                        <a 
                          href={fullInvitationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline hover:text-green-800 break-all block"
                        >
                          {fullInvitationUrl}
                        </a>
                        <p className="text-xs mt-2 opacity-80">
                          URL ini dibuat otomatis dari nama panggilan: <strong>{formData.groom_name.split(' ')[0]}</strong> & <strong>{formData.bride_name.split(' ')[0]}</strong>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!generatedSlug && formData.invitation_url && (
                    <div className="flex items-start space-x-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">Current URL:</p>
                        <a 
                          href={fullInvitationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-800 break-all"
                        >
                          {fullInvitationUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cerita Pernikahan Anda
                </label>
                <textarea 
                  value={formData.story} 
                  onChange={e => setFormData({...formData, story: e.target.value})} 
                  rows={8} 
                  placeholder="Bagikan kisah indah Anda..." 
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" 
                />
              </div>

              <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <label htmlFor="is_published" className="flex items-start cursor-pointer flex-1">
                  <input 
                    type="checkbox" 
                    id="is_published" 
                    checked={formData.is_published} 
                    onChange={e => setFormData({...formData, is_published: e.target.checked})} 
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-0.5 flex-shrink-0" 
                  />
                  <div className="ml-3">
                    <span className="text-gray-700 font-medium block">
                      Publikasikan Portofolio Ini
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Jika dicentang, portofolio dan link undangan Anda akan dapat dilihat oleh pengunjung lain di halaman portfolio gallery.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 sticky bottom-0 bg-white/95 backdrop-blur-sm px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
            {existingPortfolio && (
              <button 
                type="button" 
                onClick={handleDelete} 
                disabled={deleting} 
                className="flex-1 px-6 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {deleting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Trash2 className="w-5 h-5"/>}
                <span>Hapus Portofolio</span>
              </button>
            )}
            <button 
              type="submit" 
              disabled={saving || !formData.groom_name || !formData.bride_name} 
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PortfolioFormModal;