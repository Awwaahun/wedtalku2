import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Settings,
  Plus, Edit, Trash2, Eye, Search, Filter, TrendingUp,
  DollarSign, Heart, LogOut, Menu, X, Upload, Save,
  AlertCircle, CheckCircle, Image as ImageIcon
} from 'lucide-react';
import { supabase, WeddingTemplate } from '../lib/supabase';

interface AdminStats {
  totalTemplates: number;
  activeTemplates: number;
  totalRevenue: number;
  totalPurchases: number;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'purchases' | 'users'>('dashboard');
  const [templates, setTemplates] = useState<WeddingTemplate[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalTemplates: 0,
    activeTemplates: 0,
    totalRevenue: 0,
    totalPurchases: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WeddingTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'sold'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('wedding_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (templatesError) throw templatesError;

      // Load purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select('*');

      if (purchasesError) throw purchasesError;

      setTemplates(templatesData || []);

      // Calculate stats
      const totalRevenue = purchasesData?.reduce((sum, p) => sum + Number(p.price_paid), 0) || 0;
      setStats({
        totalTemplates: templatesData?.length || 0,
        activeTemplates: templatesData?.filter(t => t.status === 'active').length || 0,
        totalRevenue,
        totalPurchases: purchasesData?.length || 0
      });
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('error', 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus template ini?')) return;

    try {
      const { error } = await supabase
        .from('wedding_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showNotification('success', 'Template berhasil dihapus');
      loadData();
    } catch (error) {
      console.error('Error deleting template:', error);
      showNotification('error', 'Gagal menghapus template');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || template.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3 animate-slideIn ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Heart className="w-8 h-8 text-purple-600" fill="currentColor" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500">Wedding Marketplace</p>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700 font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } mt-16 lg:mt-0`}>
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'templates', icon: Package, label: 'Templates' },
              { id: 'purchases', icon: ShoppingBag, label: 'Pembelian' },
              { id: 'users', icon: Users, label: 'Pengguna' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Package}
                  label="Total Templates"
                  value={stats.totalTemplates}
                  color="from-blue-500 to-cyan-500"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Active Templates"
                  value={stats.activeTemplates}
                  color="from-green-500 to-emerald-500"
                />
                <StatCard
                  icon={DollarSign}
                  label="Total Revenue"
                  value={formatPrice(stats.totalRevenue)}
                  color="from-purple-500 to-pink-500"
                />
                <StatCard
                  icon={ShoppingBag}
                  label="Total Pembelian"
                  value={stats.totalPurchases}
                  color="from-orange-500 to-red-500"
                />
              </div>

              {/* Recent Templates */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Template Terbaru</h3>
                <div className="space-y-3">
                  {templates.slice(0, 5).map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                      <div className="flex items-center space-x-4">
                        <img
                          src={template.thumbnail_url}
                          alt={template.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{template.title}</p>
                          <p className="text-sm text-gray-500">{template.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{formatPrice(template.price)}</p>
                        <p className="text-xs text-gray-500">{template.views_count} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Kelola Templates</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tambah Template</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari template..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Templates Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Template</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Harga</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Views</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTemplates.map((template) => (
                        <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={template.thumbnail_url}
                                alt={template.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-semibold text-gray-800">{template.title}</p>
                                {template.is_featured && (
                                  <span className="text-xs text-purple-600 font-medium">Featured</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                              {template.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {formatPrice(template.price)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              template.status === 'active' ? 'bg-green-100 text-green-700' :
                              template.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {template.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {template.views_count}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingTemplate(template)}
                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Riwayat Pembelian</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600">Data pembelian akan ditampilkan di sini.</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600">Data pengguna akan ditampilkan di sini.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTemplate) && (
        <TemplateFormModal
          template={editingTemplate}
          onClose={() => {
            setShowAddModal(false);
            setEditingTemplate(null);
          }}
          onSave={() => {
            loadData();
            setShowAddModal(false);
            setEditingTemplate(null);
            showNotification('success', 'Template berhasil disimpan');
          }}
        />
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Template Form Modal Component
function TemplateFormModal({ template, onClose, onSave }: {
  template: WeddingTemplate | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    title: template?.title || '',
    description: template?.description || '',
    price: template?.price || 0,
    thumbnail_url: template?.thumbnail_url || '',
    demo_url: template?.demo_url || '',
    category: template?.category || 'modern',
    is_featured: template?.is_featured || false,
    status: template?.status || 'active',
    features: template?.features || []
  });
  const [newFeature, setNewFeature] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (template) {
        // Update existing template
        const { error } = await supabase
          .from('wedding_templates')
          .update(formData)
          .eq('id', template.id);

        if (error) throw error;
      } else {
        // Insert new template
        const { error } = await supabase
          .from('wedding_templates')
          .insert([formData]);

        if (error) throw error;
      }

      onSave();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Gagal menyimpan template');
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {template ? 'Edit Template' : 'Tambah Template Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Judul Template
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harga (IDR)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimalist">Minimalist</option>
                <option value="elegant">Elegant</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Thumbnail
            </label>
            <input
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Demo
            </label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
              placeholder="https://example.com/demo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fitur
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
                placeholder="Tambah fitur..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-6 py-3 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-gray-700">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700 font-medium">Featured Template</span>
            </label>

            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 outline-none transition-colors"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}