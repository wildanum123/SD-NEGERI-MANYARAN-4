import React from 'react';
import { Volume2, VolumeX, Shield, Bell, PlusCircle, Search, FileText, BarChart3, Lock, School } from 'lucide-react';
import { soundNotifier } from '../utils/audio';

interface HeaderProps {
  activeTab: 'buat' | 'lacak' | 'sop' | 'statistik' | 'admin';
  setActiveTab: (tab: 'buat' | 'lacak' | 'sop' | 'statistik' | 'admin') => void;
  isAdminLoggedIn: boolean;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  unreadCount,
}) => {
  const [soundEnabled, setSoundEnabled] = React.useState(soundNotifier.enabled);

  const toggleSound = () => {
    const next = !soundEnabled;
    soundNotifier.enabled = next;
    setSoundEnabled(next);
    if (next) {
      soundNotifier.playSuccessChime();
    }
  };

  return (
    <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-lg sticky top-0 z-40 print:hidden">
      {/* Top Banner Notice */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 px-4 py-1.5 text-xs text-emerald-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">Kanal Resmi Layanan Aspirasi & Pengaduan Masyarakat</span>
            <span className="hidden sm:inline text-emerald-400/60">•</span>
            <span className="hidden sm:inline">Pemerintah Kabupaten Kediri — Dinas Pendidikan</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-300/80 hidden md:inline">
              Kode Sekolah NPSN: 20511832
            </span>
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Matikan Suara Notifikasi' : 'Nyalakan Suara Notifikasi'}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 transition text-xs"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Suara: Aktif</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span>Suara: Mati</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Branding */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('buat')}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md flex items-center justify-center shrink-0 border border-emerald-300/30">
              <div className="w-full h-full bg-slate-900/50 rounded-[14px] flex flex-col items-center justify-center text-center p-1">
                <School className="w-6 h-6 text-emerald-300" />
                <span className="text-[9px] font-black tracking-tighter text-emerald-200 leading-none mt-0.5">SDN 4</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-700/50">
                  Ruang Pengaduan
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline-flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Privasi & Anonimitas Terjamin
                </span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white mt-0.5">
                SD NEGERI MANYARAN 4
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
                Kecamatan Banyakan, Kabupaten Kediri — Jawa Timur
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('buat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                activeTab === 'buat'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Kirim Laporan</span>
            </button>

            <button
              onClick={() => setActiveTab('lacak')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                activeTab === 'lacak'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Lacak Tiket</span>
            </button>

            <button
              onClick={() => setActiveTab('sop')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                activeTab === 'sop'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>SOP & Privasi</span>
            </button>

            <button
              onClick={() => setActiveTab('statistik')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                activeTab === 'statistik'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Transparansi</span>
              <span className="sm:hidden">Statistik</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shrink-0 ${
                activeTab === 'admin'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'bg-white/10 text-amber-200 hover:bg-white/20 border border-amber-300/30'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Panel Admin' : 'Masuk Admin'}</span>
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-bold animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
