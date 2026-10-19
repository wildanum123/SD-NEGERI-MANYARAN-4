import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  MessageCircle,
  Send,
  UserCheck,
  EyeOff,
  User,
  ExternalLink,
  ChevronRight,
  Bell,
  RefreshCw,
  LogOut,
  Sparkles,
  Download,
  CheckCheck,
  Building,
  Wrench,
  Trash2,
  Lock,
  KeyRound,
} from 'lucide-react';
import {
  ReportTicket,
  ReportStatus,
  ReportCategory,
  ReportUrgency,
  STATUS_CONFIG,
  CATEGORIES_CONFIG,
  URGENCY_CONFIG,
  OfficialResponse,
} from '../types/report';
import {
  getAllReports,
  updateReportStatus,
  addInternalNote,
  deleteReport,
  resetToSampleData,
  simulateIncomingReport,
  generateWhatsAppNotice,
} from '../services/reportStorage';
import { realtimeSync } from '../utils/broadcast';
import { soundNotifier } from '../utils/audio';

interface AdminDashboardProps {
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (status: boolean) => void;
  onPrintReport: (ticket: ReportTicket) => void;
  onPrintRecap: (reports: ReportTicket[]) => void;
}

interface AdminProfile {
  name: string;
  role: OfficialResponse['authorRole'];
  title: string;
  nip?: string;
}

const ADMIN_PROFILES: AdminProfile[] = [
  {
    name: 'Biti Afroni, S.Pd. SD',
    role: 'Kepala Sekolah',
    title: 'Kepala SD Negeri Manyaran 4',
    nip: '19850803 201101 2 018',
  },
  {
    name: 'Afra Widiyantari, S.Sos., S.Pd',
    role: 'Operator Pengaduan',
    title: 'Staf Administrasi & Layanan Pengaduan',
    nip: '-',
  },
  {
    name: 'Ika Lindawati, S.Pd. Gr',
    role: 'Ketua TPPK',
    title: 'Ketua Tim Pencegahan & Penanganan Kekerasan (TPPK)',
    nip: '19780520 200801 1 012',
  },
  {
    name: 'Timotius Suratno',
    role: 'Komite Sekolah',
    title: 'Ketua Komite SDN Manyaran 4',
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  onPrintReport,
  onPrintRecap,
}) => {
  const [reports, setReports] = useState<ReportTicket[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportTicket | null>(null);
  const [activeProfile, setActiveProfile] = useState<AdminProfile>(ADMIN_PROFILES[0]);

  // Login form state
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Response Form in detail modal
  const [newStatus, setNewStatus] = useState<ReportStatus>('diproses');
  const [responseMessage, setResponseMessage] = useState('');
  const [assignedPerson, setAssignedPerson] = useState('');
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  // Internal Note form
  const [internalNoteText, setInternalNoteText] = useState('');

  // Live Toast for new complaints
  const [liveToast, setLiveToast] = useState<{ id: string; title: string; urgency: string } | null>(null);

  // Load data
  const refreshReports = () => {
    const list = getAllReports();
    setReports(list);
    if (selectedReport) {
      const refreshed = list.find((r) => r.id === selectedReport.id);
      if (refreshed) setSelectedReport(refreshed);
    }
  };

  useEffect(() => {
    refreshReports();
  }, []);

  // Listen to realtime events
  useEffect(() => {
    const unsubscribe = realtimeSync.subscribe((event) => {
      refreshReports();
      if (event.type === 'NEW_REPORT') {
        soundNotifier.playNewReportChime();
        setLiveToast({
          id: event.payload.id,
          title: event.payload.title,
          urgency: event.payload.urgency,
        });
        setTimeout(() => setLiveToast(null), 6000);
      }
    });
    return unsubscribe;
  }, [selectedReport]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '123456' || pinInput.trim() === 'admin' || pinInput.trim() === '') {
      setIsAdminLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleQuickDemoLogin = (profile: AdminProfile) => {
    setActiveProfile(profile);
    setIsAdminLoggedIn(true);
  };

  const handleSimulateReport = () => {
    const sim = simulateIncomingReport();
    soundNotifier.playNewReportChime();
    setLiveToast({
      id: sim.id,
      title: sim.title,
      urgency: sim.urgency,
    });
    setTimeout(() => setLiveToast(null), 6000);
  };

  const handleOpenDetail = (rep: ReportTicket) => {
    setSelectedReport(rep);
    setNewStatus(rep.status === 'menunggu' ? 'ditinjau' : rep.status);
    setResponseMessage('');
    setAssignedPerson(rep.assignedTo || '');
    setEvidencePhotoUrl('');
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !responseMessage.trim()) return;

    setIsSubmittingResponse(true);
    const updated = updateReportStatus(
      selectedReport.id,
      newStatus,
      {
        name: activeProfile.name,
        role: activeProfile.role,
        message: responseMessage.trim(),
        evidencePhotos: evidencePhotoUrl.trim() ? [evidencePhotoUrl.trim()] : undefined,
      },
      assignedPerson.trim() || undefined
    );

    if (updated) {
      setSelectedReport(updated);
      setResponseMessage('');
      setEvidencePhotoUrl('');
      refreshReports();
    }
    setIsSubmittingResponse(false);
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !internalNoteText.trim()) return;

    const updated = addInternalNote(
      selectedReport.id,
      internalNoteText.trim(),
      `${activeProfile.name} (${activeProfile.role})`,
      assignedPerson.trim() || undefined
    );
    if (updated) {
      setSelectedReport(updated);
      setInternalNoteText('');
      refreshReports();
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus arsip pengaduan ${id}?`)) {
      deleteReport(id);
      setSelectedReport(null);
      refreshReports();
    }
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (filterUrgency !== 'all' && r.urgency !== filterUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = r.id.toLowerCase().includes(q);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchContent = r.content.toLowerCase().includes(q);
      const matchParent = r.reporterInfo?.parentName?.toLowerCase().includes(q);
      return matchId || matchTitle || matchContent || matchParent;
    }
    return true;
  });

  // Calculate metrics
  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'menunggu').length;
  const processingCount = reports.filter((r) => r.status === 'diproses' || r.status === 'ditinjau').length;
  const resolvedCount = reports.filter((r) => r.status === 'selesai').length;
  const emergencyCount = reports.filter((r) => r.urgency === 'darurat' && r.status !== 'selesai').length;

  // Render Login Screen if not authenticated
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Autentikasi Internal
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-2">
              Masuk Dashboard Pengaduan
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              SD Negeri Manyaran 4 Kecamatan Banyakan Kabupaten Kediri
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIN Akses Pejabat / Pengelola Sekolah
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN Default: 123456"
                  className="w-full text-sm font-mono px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-widest text-center"
                />
              </div>
              {loginError && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  PIN salah. Gunakan PIN default 123456 atau klik profil di bawah.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Buka Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-3">
              Akses Cepat Penguji / Peran:
            </span>
            <div className="space-y-2">
              {ADMIN_PROFILES.map((prof, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickDemoLogin(prof)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 transition flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-slate-800 group-hover:text-emerald-800 block">
                      {prof.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {prof.title} ({prof.role})
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Live Toast Notification */}
      {liveToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-emerald-400">PENGADUAN BARU MASUK!</span>
              <span className="text-[10px] bg-rose-600 px-1.5 rounded text-white font-mono">
                {liveToast.id}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium truncate mt-0.5">
              {liveToast.title}
            </p>
            <span className="text-[10px] text-slate-400">
              Urgensi: {liveToast.urgency.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setLiveToast(null)}
            className="text-slate-400 hover:text-white text-xs p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Admin Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-base shadow">
            {activeProfile.name.split(' ')[0][0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                {activeProfile.name}
              </span>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                {activeProfile.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {activeProfile.title} {activeProfile.nip && `• NIP. ${activeProfile.nip}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Change Role Selector */}
          <select
            value={activeProfile.name}
            onChange={(e) => {
              const found = ADMIN_PROFILES.find((p) => p.name === e.target.value);
              if (found) setActiveProfile(found);
            }}
            className="text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-700"
          >
            {ADMIN_PROFILES.map((p, idx) => (
              <option key={idx} value={p.name}>
                Ganti Akun: {p.role} - {p.name.split(',')[0]}
              </option>
            ))}
          </select>

          {/* Test Realtime Simulation Button */}
          <button
            type="button"
            onClick={handleSimulateReport}
            title="Simulasikan masuknya laporan baru dari orang tua murid untuk menguji lonceng notifikasi dan pembaruan real-time"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulasi Aduan Masuk</span>
          </button>

          {/* Print Recap */}
          <button
            type="button"
            onClick={() => onPrintRecap(reports)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap Resmi</span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={() => setIsAdminLoggedIn(false)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 block">Total Pengaduan</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Akumulasi aspirasi</span>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs transition ${
          pendingCount > 0
            ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-300/40'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Menunggu Verifikasi</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Perlu telaah awal</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 block">Dalam Penanganan</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
            {processingCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Disposisi lapangan</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 block">Selesai & Teratasi</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            {resolvedCount}
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">
            {totalCount > 0 ? `${Math.round((resolvedCount / totalCount) * 100)}% terselesaikan` : '0%'}
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Darurat / Mendesak</span>
            {emergencyCount > 0 && (
              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full animate-pulse">
                PERHATIAN
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">
            {emergencyCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Target respon &lt; 6 jam</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3.5">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode tiket, judul, orang tua, kata kunci..."
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu Verifikasi</option>
              <option value="ditinjau">Sedang Ditinjau</option>
              <option value="diproses">Dalam Penanganan</option>
              <option value="selesai">Selesai & Teratasi</option>
              <option value="ditolak">Diarsipkan / Ditolak</option>
            </select>

            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Semua Urgensi</option>
              <option value="darurat">Mendesak / Darurat</option>
              <option value="tinggi">Prioritas Tinggi</option>
              <option value="sedang">Perlu Perhatian</option>
              <option value="rendah">Biasa / Saran</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">Semua Kategori</option>
              {Object.keys(CATEGORIES_CONFIG).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORIES_CONFIG[cat as ReportCategory].label}
                </option>
              ))}
            </select>

            <button
              onClick={refreshReports}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition"
              title="Perbarui Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick status tabs */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 text-xs">
          {[
            { id: 'all', label: 'Semua Laporan' },
            { id: 'menunggu', label: `Menunggu (${pendingCount})` },
            { id: 'diproses', label: `Diproses (${processingCount})` },
            { id: 'selesai', label: `Selesai (${resolvedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table / List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700">Tidak ada pengaduan yang sesuai filter</h4>
            <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Kode & Tanggal</th>
                  <th className="py-3.5 px-4">Pokok Pengaduan</th>
                  <th className="py-3.5 px-4">Kategori & Urgensi</th>
                  <th className="py-3.5 px-4">Pelapor</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Disposisi</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition cursor-pointer group"
                    onClick={() => handleOpenDetail(item)}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-emerald-800 text-xs">
                        {item.id}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs sm:max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                        {item.title}
                      </div>
                      <div className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                        {item.content}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        📍 {item.location || 'SDN Manyaran 4'}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold border mb-1 ${CATEGORIES_CONFIG[item.category].badgeColor}`}>
                        {CATEGORIES_CONFIG[item.category].label}
                      </span>
                      <div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 rounded-full border ${URGENCY_CONFIG[item.urgency].badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${URGENCY_CONFIG[item.urgency].dotColor}`} />
                          {URGENCY_CONFIG[item.urgency].label}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          <EyeOff className="w-3 h-3 text-slate-500" />
                          Anonim
                        </span>
                      ) : (
                        <div>
                          <div className="font-semibold text-slate-800 text-[11px]">
                            {item.reporterInfo?.parentName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {item.reporterInfo?.studentGrade} {item.reporterInfo?.studentName ? `• ${item.reporterInfo.studentName}` : ''}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_CONFIG[item.status].badge}`}>
                        {STATUS_CONFIG[item.status].label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {item.assignedTo ? (
                        <span className="line-clamp-1">{item.assignedTo.split('(')[0]}</span>
                      ) : (
                        <span className="text-slate-400 italic">Belum ditunjuk</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition inline-flex items-center gap-1"
                      >
                        <span>Tanggapi</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Action Modal Drawer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-bold text-sm tracking-wider">
                    {selectedReport.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${URGENCY_CONFIG[selectedReport.urgency].badge}`}>
                    {URGENCY_CONFIG[selectedReport.urgency].label}
                  </span>
                  <span className="text-slate-400 text-xs">
                    • {new Date(selectedReport.createdAt).toLocaleString('id-ID')}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                  {selectedReport.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPrintReport(selectedReport)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition"
                  title="Cetak Lembar Disposisi"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Reporter Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Data Pelapor
                  </span>
                  {selectedReport.isAnonymous ? (
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <EyeOff className="w-4 h-4 text-emerald-600" />
                      <span>Pelapor Anonim (Kerahasiaan Dilindungi SOP & Regulasi)</span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedReport.reporterInfo?.parentName}
                      </span>
                      <span className="text-slate-500 ml-1">
                        ({selectedReport.reporterInfo?.relationship} dari {selectedReport.reporterInfo?.studentName || 'siswa'} - {selectedReport.reporterInfo?.studentGrade})
                      </span>
                      <div className="text-slate-600 font-mono mt-0.5">
                        📞 {selectedReport.reporterInfo?.phone}
                      </div>
                    </div>
                  )}
                </div>

                {/* WhatsApp button if phone exists */}
                {!selectedReport.isAnonymous && selectedReport.reporterInfo?.phone && (
                  <a
                    href={`https://wa.me/${selectedReport.reporterInfo.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selectedReport.reporterInfo.parentName || '')}%2C%20kami%20dari%20SD%20Negeri%20Manyaran%204%20Kediri%20menindaklanjuti%20pengaduan%20Anda%20dengan%20nomor%20tiket%20${selectedReport.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Hubungi Ortu via WA</span>
                  </a>
                )}

                {/* Forward to school hotline */}
                <a
                  href={generateWhatsAppNotice(selectedReport)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition shrink-0"
                  title="Bagikan ringkasan pengaduan ke grup WA dewan guru/piket"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Teruskan ke Guru Piket</span>
                </a>
              </div>

              {/* Isi Keluhan Awal */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Uraian Lengkap Pengaduan:
                </span>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {selectedReport.content}
                </div>
                {selectedReport.attachmentUrls && selectedReport.attachmentUrls.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                      Foto Lampiran dari Pelapor:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.attachmentUrls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer">
                          <img src={url} alt={`Lampiran ${i + 1}`} className="w-24 h-24 rounded-xl object-cover border border-slate-300 shadow-xs hover:opacity-90" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Tulis Tanggapan Resmi Sekolah */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Tulis Tanggapan Resmi & Perbarui Status
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-medium">
                    Tanggapan akan tampil di halaman pelacakan orang tua murid
                  </span>
                </div>

                <form onSubmit={handleSubmitResponse} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pilih Status Baru <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="ditinjau">🔍 Sedang Ditinjau</option>
                        <option value="diproses">⚙️ Dalam Penanganan / Tindak Lanjut</option>
                        <option value="selesai">✅ Selesai & Teratasi</option>
                        <option value="ditolak">📁 Diarsipkan / Ditolak</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Petugas Penanggung Jawab / Disposisi
                      </label>
                      <input
                        type="text"
                        value={assignedPerson}
                        onChange={(e) => setAssignedPerson(e.target.value)}
                        placeholder="Contoh: Bpk. Bambang (Waka Sarpras)"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pesan Tanggapan Resmi (atas nama {activeProfile.name} - {activeProfile.role}) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Tuliskan respon resmi sekolah, tindakan yang telah diambil atau rencana waktu pengerjaan perbaikan..."
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lampiran Foto Hasil Perbaikan / Dokumen Tindak Lanjut (Opsional)
                    </label>
                    <input
                      type="text"
                      value={evidencePhotoUrl}
                      onChange={(e) => setEvidencePhotoUrl(e.target.value)}
                      placeholder="Masukkan URL foto bukti perbaikan (cth: https://...)"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmittingResponse || !responseMessage.trim()}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publikasikan Tanggapan Resmi</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Catatan Internal Khusus Guru/Admin */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="text-xs font-bold text-amber-900 block mb-1">
                  🔒 Catatan Internal Tim Sekolah (Hanya Terlihat Guru / Kepala Sekolah)
                </span>
                <p className="text-[11px] text-amber-700 mb-3">
                  Gunakan untuk mencatat hasil koordinasi dewan guru, rincian biaya BOS, atau memo investigasi tertutup.
                </p>

                {selectedReport.internalNotes.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {selectedReport.internalNotes.map((note) => (
                      <div key={note.id} className="p-2.5 rounded-lg bg-white border border-amber-200 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                          <span className="font-bold text-slate-700">{note.author}</span>
                          <span>{new Date(note.date).toLocaleString('id-ID')}</span>
                        </div>
                        <p className="text-slate-800">{note.note}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAddInternalNote} className="flex gap-2">
                  <input
                    type="text"
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    placeholder="Tulis memo internal tim..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!internalNoteText.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition disabled:opacity-50"
                  >
                    Simpan Memo
                  </button>
                </form>
              </div>

              {/* Hapus Arsip */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Manajemen Arsip Sistem
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(selectedReport.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Laporan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
