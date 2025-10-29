import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Image as ImageIcon, User, Calendar, MapPin, BookOpen, Trash2 } from 'lucide-react';
import { supabase, UserPortfolio, UserMedia } from '../lib/supabase';

interface UserInvitation {
  id: string;
  template_id: string;
  wedding_templates: { title: string };
}

interface PortfolioFormModalProps {
  invitation: UserInvitation;
  existingPortfolio: UserPortfolio | null;
  userMedia: UserMedia[];
  onClose: () => void;
  onSave: () => void;
}

const PortfolioFormModal: React.FC<PortfolioFormModalProps> = ({ invitation, existingPortfolio, userMedia, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    groom_name: '',
    bride_name: '',
    wedding_date: '',
    location: '',
    story: '',
    couple_photo_url: '',
    groom_photo_url: '',
    bride_photo_url: '',
    is_published: false,
  });

  const [activePhotoPicker, setActivePhotoPicker] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        is_published: existingPortfolio.is_published || false,
      });
    }
  }, [existingPortfolio]);

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
      
      const portfolioData = {
        ...formData,
        user_id: user.id,
        template_id: invitation.template_id,
      };

      const { error } = await supabase
        .from('user_portfolios')
        .upsert(portfolioData, { onConflict: 'user_id,template_id' });
        
      if (error) throw error;
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
        onSave(); // Re-triggers data load
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        alert('Gagal menghapus portofolio.');
    } finally {
        setDeleting(false);
    }
  };

  const PhotoInput = ({ name, label, icon: Icon }: { name: keyof typeof formData, label: string, icon: React.ElementType }) => (
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
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-xl">
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
            <button onClick={() => setActivePhotoPicker(null)} className="p-2 rounded-full hover:bg-gray-100"><X/></button>
          </div>
          <div className="p-4 overflow-y-auto">
            {userMedia.length === 0 ? (
                <p className="text-center text-gray-600 py-8">Anda belum mengupload gambar. Silakan upload di tab Media Saya.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {userMedia.map(media => (
                  <button key={media.id} onClick={() => handleSelectPhoto(media.file_url)} className="aspect-square rounded-lg overflow-hidden group relative">
                    <img src={media.file_url} alt={media.file_name} className="w-full h-full object-cover"/>
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl animate-scaleIn flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-200 z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{existingPortfolio ? 'Edit Portofolio' : 'Buat Portofolio Baru'}</h3>
            <p className="text-sm text-gray-500">Untuk template: {invitation.wedding_templates.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X className="w-6 h-6" /></button>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Mempelai Pria</label>
                  <input type="text" value={formData.groom_name} onChange={e => setFormData({...formData, groom_name: e.target.value})} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Mempelai Wanita</label>
                  <input type="text" value={formData.bride_name} onChange={e => setFormData({...formData, bride_name: e.target.value})} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Pernikahan</label>
                  <input type="date" value={formData.wedding_date} onChange={e => setFormData({...formData, wedding_date: e.target.value})} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="cth. Bali, Indonesia" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cerita Pernikahan Anda</label>
                <textarea value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} rows={8} placeholder="Bagikan kisah indah Anda..." className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border">
                 <label htmlFor="is_published" className="flex items-center cursor-pointer">
                    <input type="checkbox" id="is_published" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-3 text-gray-700 font-medium">Publikasikan Portofolio Ini</span>
                </label>
                 <p className="text-xs text-gray-500">Jika dicentang, portofolio Anda akan dapat dilihat oleh pengunjung lain.</p>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 sticky bottom-0 bg-white/95 backdrop-blur-sm px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
             {existingPortfolio && (
                <button type="button" onClick={handleDelete} disabled={deleting} className="flex-1 px-6 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all disabled:opacity-50 flex items-center justify-center space-x-2">
                    {deleting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Trash2 className="w-5 h-5"/>}
                    <span>Hapus Portofolio</span>
                </button>
            )}
            <button type="submit" disabled={saving} className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2">
              {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioFormModal;
