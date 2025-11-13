import React from 'react';
import { X, Settings, FileText, Image, Users, Heart } from 'lucide-react';

interface ClientDashboardProps {
  invitationId: string;
  onClose: () => void;
  rusticConfig?: any;
}

export default function ClientDashboard({ invitationId, onClose, rusticConfig }: ClientDashboardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="rustic-card max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b border-[var(--rustic-accent)]">
          <h2 className="text-2xl font-bold text-[var(--rustic-primary)]">
            Dashboard Admin
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--rustic-secondary)] hover:text-[var(--rustic-primary)]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rustic-card text-center p-6 bg-[var(--rustic-beige)]">
              <Users className="w-8 h-8 text-[var(--rustic-gold)] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[var(--rustic-primary)]">Total Tamu</h3>
              <p className="text-2xl text-[var(--rustic-secondary)]">150</p>
            </div>
            
            <div className="rustic-card text-center p-6 bg-[var(--rustic-beige)]">
              <Heart className="w-8 h-8 text-[var(--rustic-gold)] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[var(--rustic-primary)]">Konfirmasi</h3>
              <p className="text-2xl text-[var(--rustic-secondary)]">85</p>
            </div>
            
            <div className="rustic-card text-center p-6 bg-[var(--rustic-beige)]">
              <MessageCircle className="w-8 h-8 text-[var(--rustic-gold)] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[var(--rustic-primary)]">Ucapan</h3>
              <p className="text-2xl text-[var(--rustic-secondary)]">42</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="rustic-btn w-full flex items-center justify-center">
              <Settings className="w-5 h-5 mr-3" />
              Edit Konfigurasi
            </button>
            <button className="rustic-btn w-full flex items-center justify-center">
              <Image className="w-5 h-5 mr-3" />
              Kelola Galeri
            </button>
            <button className="rustic-btn w-full flex items-center justify-center">
              <FileText className="w-5 h-5 mr-3" />
              Lihat Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}