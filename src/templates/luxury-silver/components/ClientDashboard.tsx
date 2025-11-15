import React, { useState } from 'react';
import { SilverHeart, SilverDiamond, SilverGift, SilverCamera } from './icons';
import '../index.css';

interface WeddingConfig {
  couple: {
    groom: { name: string; parents: { father: string; mother: string } };
    bride: { name: string; parents: { father: string; mother: string } };
  };
  date: {
    full: string;
    day: string;
    month: string;
    year: string;
  };
  music: {
    audioSrc: string;
    lyrics: string;
  };
}

interface ClientDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
  onSave: (config: WeddingConfig) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  onSave 
}) => {
  const [formData, setFormData] = useState<WeddingConfig>(config);
  const [activeTab, setActiveTab] = useState('couple');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof WeddingConfig],
        ...(typeof prev[section as keyof WeddingConfig] === 'object' && field.includes('.')) 
          ? {
              ...prev[section as keyof WeddingConfig],
              [field.split('.')[0]]: {
                ...(prev[section as keyof WeddingConfig] as any)[field.split('.')[0]],
                [field.split('.')[1]]: value
              }
            }
          : { [field]: value }
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(formData);
    setIsSaving(false);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'couple', label: 'Couple Info', icon: <SilverHeart size={16} /> },
    { id: 'date', label: 'Date & Time', icon: <SilverDiamond size={16} /> },
    { id: 'music', label: 'Music', icon: <SilverGift size={16} /> },
    { id: 'gallery', label: 'Gallery', icon: <SilverCamera size={16} /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Silver Frame Border */}
        <div className="absolute inset-0 border-4 border-primary-silver rounded-2xl pointer-events-none" />
        <div className="absolute -inset-2 border-2 border-silver-light rounded-2xl pointer-events-none" />

        {/* Header */}
        <div className="bg-silver-gradient p-6 text-center relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          <h2 className="font-heading text-2xl text-white drop-shadow-lg mb-2">
            Wedding Dashboard
          </h2>
          <p className="font-elegant text-white/90 text-sm">
            Customize your wedding invitation
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-platinum/30 border-b border-silver-light">
          <div className="flex space-x-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-silver text-charcoal shadow-medium'
                    : 'text-silver hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span className="font-body text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {/* Couple Info Tab */}
          {activeTab === 'couple' && (
            <div className="space-y-6">
              <h3 className="font-heading text-xl text-charcoal mb-4">Couple Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-elegant text-lg text-primary-silver">Groom</h4>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.couple.groom.name}
                      onChange={(e) => handleInputChange('couple', 'groom.name', e.target.value)}
                      className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-2">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={formData.couple.groom.parents.father}
                      onChange={(e) => handleInputChange('couple', 'groom.parents.father', e.target.value)}
                      className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-2">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={formData.couple.groom.parents.mother}
                      onChange={(e) => handleInputChange('couple', 'groom.parents.mother', e.target.value)}
                      className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-elegant text-lg text-primary-silver">Bride</h4>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.couple.bride.name}
                      onChange={(e) => handleInputChange('couple', 'bride.name', e.target.value)}
                      className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-2">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      value={formData.couple.bride.parents.father}
                      onChange={(e) => handleInputChange('couple', 'bride.parents.father', e.target.value)}
                      className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium text-charcoal mb-2">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      value={formData.couple.bride.parents.mother}
                      onChange={(e) => handleInputChange('couple', 'bride.parents.mother', e.target.value)}
                      className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Date & Time Tab */}
          {activeTab === 'date' && (
            <div className="space-y-6">
              <h3 className="font-heading text-xl text-charcoal mb-4">Wedding Date & Time</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal mb-2">
                    Full Date
                  </label>
                  <input
                    type="text"
                    value={formData.date.full}
                    onChange={(e) => handleInputChange('date', 'full', e.target.value)}
                    className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    placeholder="Saturday, December 15, 2025"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal mb-2">
                    Day
                  </label>
                  <input
                    type="text"
                    value={formData.date.day}
                    onChange={(e) => handleInputChange('date', 'day', e.target.value)}
                    className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal mb-2">
                    Month
                  </label>
                  <input
                    type="text"
                    value={formData.date.month}
                    onChange={(e) => handleInputChange('date', 'month', e.target.value)}
                    className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    placeholder="December"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-charcoal mb-2">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.date.year}
                    onChange={(e) => handleInputChange('date', 'year', e.target.value)}
                    className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                    placeholder="2025"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Music Tab */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              <h3 className="font-heading text-xl text-charcoal mb-4">Music Settings</h3>
              
              <div>
                <label className="block font-body text-sm font-medium text-charcoal mb-2">
                  Audio File URL
                </label>
                <input
                  type="text"
                  value={formData.music.audioSrc}
                  onChange={(e) => handleInputChange('music', 'audioSrc', e.target.value)}
                  className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent"
                  placeholder="https://example.com/music.mp3"
                />
              </div>
              
              <div>
                <label className="block font-body text-sm font-medium text-charcoal mb-2">
                  Song Lyrics
                </label>
                <textarea
                  value={formData.music.lyrics}
                  onChange={(e) => handleInputChange('music', 'lyrics', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-silver-light rounded-lg focus:ring-2 focus:ring-primary-silver focus:border-transparent resize-none"
                  placeholder="Enter song lyrics here..."
                />
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <h3 className="font-heading text-xl text-charcoal mb-4">Gallery Management</h3>
              
              <div className="text-center py-12 bg-platinum/20 rounded-lg border-2 border-dashed border-silver-light">
                <SilverCamera size={48} className="text-primary-silver mx-auto mb-4" />
                <p className="font-body text-charcoal mb-2">Gallery Management</p>
                <p className="font-body text-sm text-silver">
                  Upload and manage your wedding photos
                </p>
                <button className="btn-silver mt-4">
                  Coming Soon
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-platinum/20 p-4 border-t border-silver-light">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="font-body text-silver hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setFormData(config)}
                className="px-4 py-2 border border-silver-light rounded-lg font-body text-silver hover:bg-platinum/50 transition-colors"
              >
                Reset
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-silver px-6 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-charcoal"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;