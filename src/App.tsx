import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CreateReportForm } from './components/CreateReportForm';
import { TrackTicket } from './components/TrackTicket';
import { AdminDashboard } from './components/AdminDashboard';
import { SOPView } from './components/SOPView';
import { TransparencyStats } from './components/TransparencyStats';
import { OfficialPrintView } from './components/OfficialPrintView';
import { getAllReports } from './services/reportStorage';
import { realtimeSync } from './utils/broadcast';
import { ReportTicket } from './types/report';
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  School,
  Heart,
  ChevronUp,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'buat' | 'lacak' | 'sop' | 'statistik' | 'admin'>('buat');
  const [targetTicketId, setTargetTicketId] = useState<string>('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Print view state
  const [printState, setPrintState] = useState<{
    isOpen: boolean;
    type: 'single' | 'recap';
    ticket?: ReportTicket;
    reports?: ReportTicket[];
  }>({
    isOpen: false,
    type: 'single',
  });

  // Calculate unread / pending count
  const updatePendingCount = () => {
    const list = getAllReports();
    const pending = list.filter((r) => r.status === 'menunggu').length;
    setUnreadCount(pending);
  };

  useEffect(() => {
    updatePendingCount();

    // Check URL parameters for direct ticket links
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ticketParam = params.get('ticket');
      const tabParam = params.get('tab');

      if (ticketParam) {
        setTargetTicketId(ticketParam);
        setActiveTab('lacak');
      } else if (tabParam && ['buat', 'lacak', 'sop', 'statistik', 'admin'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }

    // Subscribe to realtime updates
    const unsubscribe = realtimeSync.subscribe(() => {
      updatePendingCount();
    });

    return unsubscribe;
  }, []);

  const handleNavigateToTrack = (ticketId: string) => {
    setTargetTicketId(ticketId);
    setActiveTab('lacak');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintSingle = (ticket: ReportTicket) => {
    setPrintState({
      isOpen: true,
      type: 'single',
      ticket,
    });
  };

  const handlePrintRecap = (reports: ReportTicket[]) => {
    setPrintState({
      isOpen: true,
      type: 'recap',
      reports,
    });
  };

  // If in Print View Mode, render the official print sheet
  if (printState.isOpen) {
    return (
      <OfficialPrintView
        type={printState.type}
        ticket={printState.ticket}
        reports={printState.reports}
        onClose={() => setPrintState({ isOpen: false, type: 'single' })}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'buat' && (
          <CreateReportForm
            onSuccess={(id) => handleNavigateToTrack(id)}
            onNavigateToTrack={handleNavigateToTrack}
          />
        )}

        {activeTab === 'lacak' && (
          <TrackTicket
            initialTicketId={targetTicketId}
            onPrintReport={handlePrintSingle}
          />
        )}

        {activeTab === 'sop' && <SOPView />}

        {activeTab === 'statistik' && <TransparencyStats />}

        {activeTab === 'admin' && (
          <AdminDashboard
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            onPrintReport={handlePrintSingle}
            onPrintRecap={handlePrintRecap}
          />
        )}
      </main>

      {/* Official School Footer */}
      <footer className="bg-slate-900 text-white pt-12 pb-8 border-t border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Col 1: Identity */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white tracking-wide">
                    SD NEGERI MANYARAN 4
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium">
                    Kecamatan Banyakan, Kabupaten Kediri
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                Portal resmi penampungan aspirasi, saran, dan pengaduan orang tua murid secara aman dan berkeadilan. Dilengkapi sistem anonimitas berstandar perlindungan saksi/pelapor guna mewujudkan satuan pendidikan yang ramah anak, bersih, dan berprestasi.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>NPSN: 20511832 • Akreditasi B • Kurikulum Merdeka</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                Navigasi Layanan
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('buat');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition cursor-pointer"
                  >
                    • Buat Pengaduan Anonim / Terbuka
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('lacak');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition cursor-pointer"
                  >
                    • Lacak Status Nomor Tiket
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('sop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition cursor-pointer"
                  >
                    • SOP Penanganan & Jaminan Perlindungan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('statistik');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 transition cursor-pointer"
                  >
                    • Data Transparansi & Akuntabilitas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 text-amber-400 font-semibold transition cursor-pointer"
                  >
                    • Masuk Dashboard Admin / Pejabat
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Address & Contact */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                Alamat & Kontak Sekolah
              </h4>
              <div className="space-y-2 text-slate-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dusun Ngesong, Desa Manyaran, Kec. Banyakan, Kab. Kediri, Jawa Timur. 64157</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hotline: 0856-5512-4828</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>sdnegerimanyaran4@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright bottom */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <p>
              © {new Date().getFullYear()} SD Negeri Manyaran 4 Kecamatan Banyakan Kabupaten Kediri. Hak Cipta Dilindungi.
            </p>
            <p className="flex items-center gap-1">
              <span>Dibina oleh Dinas Pendidikan Pemerintah Kabupaten Kediri</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
