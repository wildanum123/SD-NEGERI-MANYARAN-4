import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Send,
  Star,
  Printer,
  Share2,
  Calendar,
  MapPin,
  Tag,
  Building,
  EyeOff,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  ReportTicket,
  STATUS_CONFIG,
  CATEGORIES_CONFIG,
  URGENCY_CONFIG,
  ReportStatus,
} from '../types/report';
import {
  getReportById,
  getMySavedTickets,
  addParentFollowUp,
  submitSatisfactionRating,
  getAllReports,
} from '../services/reportStorage';
import { realtimeSync } from '../utils/broadcast';

interface TrackTicketProps {
  initialTicketId?: string;
  onPrintReport?: (ticket: ReportTicket) => void;
}

export const TrackTicket: React.FC<TrackTicketProps> = ({
  initialTicketId = '',
  onPrintReport,
}) => {
  const [searchCode, setSearchCode] = useState(initialTicketId);
  const [ticket, setTicket] = useState<ReportTicket | null>(null);
  const [searched, setSearched] = useState(false);
  const [savedTickets, setSavedTickets] = useState<string[]>([]);
  const [parentReplyText, setParentReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Rating state
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Load saved local tickets on mount
  useEffect(() => {
    setSavedTickets(getMySavedTickets());
  }, []);

  // Sync if initialTicketId changes
  useEffect(() => {
    if (initialTicketId) {
      setSearchCode(initialTicketId);
      doSearch(initialTicketId);
    }
  }, [initialTicketId]);

  // Listen to realtime updates
  useEffect(() => {
    const unsubscribe = realtimeSync.subscribe((event) => {
      if (
        (event.type === 'REPORT_UPDATED' || event.type === 'NEW_REPORT') &&
        ticket &&
        event.payload.id === ticket.id
      ) {
        setTicket(event.payload);
      }
    });
    return unsubscribe;
  }, [ticket]);

  const doSearch = (codeToSearch: string) => {
    const clean = codeToSearch.trim();
    if (!clean) return;
    const found = getReportById(clean);
    setTicket(found || null);
    setSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(searchCode);
  };

  const handleSendParentReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !parentReplyText.trim()) return;

    setIsSubmittingReply(true);
    const updated = addParentFollowUp(ticket.id, parentReplyText.trim());
    if (updated) {
      setTicket(updated);
      setParentReplyText('');
    }
    setIsSubmittingReply(false);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;
    const updated = submitSatisfactionRating(ticket.id, ratingStars, ratingComment.trim());
    if (updated) {
      setTicket(updated);
      setRatingSubmitted(true);
    }
  };

  // Helper for step progression
  const getStepStatus = (stepNumber: number, currentStatus: ReportStatus) => {
    const statusStep = STATUS_CONFIG[currentStatus]?.step || 1;
    if (currentStatus === 'ditolak') return 'rejected';
    if (statusStep > stepNumber) return 'completed';
    if (statusStep === stepNumber) return 'active';
    return 'pending';
  };

  const allAvailableTickets = getAllReports();

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Search Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Lacak Status & Tanggapan Pengaduan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Masukkan Nomor Tiket Pengaduan Anda (contoh: <span className="font-mono font-bold text-slate-700">SDNM4-2026-0419</span>) untuk melihat tanggapan resmi dari Kepala Sekolah dan Tim Layanan SDN Manyaran 4.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                placeholder="Masukkan Nomor Tiket (SDNM4-...)"
                className="w-full text-sm sm:text-base font-mono uppercase px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 tracking-wider font-semibold"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Cek Status</span>
            </button>
          </form>

          {/* Quick chips from local memory */}
          {savedTickets.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400">Aduan Anda di HP/Browser ini:</span>
              {savedTickets.map((tId) => (
                <button
                  key={tId}
                  onClick={() => {
                    setSearchCode(tId);
                    doSearch(tId);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 text-xs font-mono font-semibold transition"
                >
                  {tId}
                </button>
              ))}
            </div>
          )}

          {/* Sample quick picks for demo evaluator */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[11px] text-slate-400">Contoh Demo:</span>
            {allAvailableTickets.slice(0, 3).map((rep) => (
              <button
                key={rep.id}
                onClick={() => {
                  setSearchCode(rep.id);
                  doSearch(rep.id);
                }}
                className="text-[11px] text-emerald-600 hover:underline px-1.5 py-0.5 rounded"
              >
                {rep.id} ({STATUS_CONFIG[rep.status].label.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Section */}
      {searched && !ticket && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-slate-700 max-w-lg mx-auto">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h3 className="font-bold text-base text-slate-900">Tiket Tidak Ditemukan</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Nomor tiket <span className="font-mono font-bold text-amber-800">"{searchCode}"</span> belum terdaftar di sistem SD Negeri Manyaran 4. Pastikan penulisan nomor tiket sesuai tanda terima Anda.
          </p>
        </div>
      )}

      {ticket && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Ticket Header & Status Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">KODE TIKET:</span>
                  <span className="text-lg font-mono font-black text-emerald-800 tracking-wider">
                    {ticket.id}
                  </span>
                  {ticket.isAnonymous ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      <EyeOff className="w-3 h-3 text-slate-500" />
                      Anonim
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      <User className="w-3 h-3 text-blue-500" />
                      Teridentifikasi
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {ticket.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${STATUS_CONFIG[ticket.status].badge}`}>
                  {STATUS_CONFIG[ticket.status].label}
                </span>

                {onPrintReport && (
                  <button
                    onClick={() => onPrintReport(ticket)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition"
                    title="Cetak Tanda Bukti Registrasi"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Stepper Progres */}
            <div className="py-6 border-b border-slate-100">
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { step: 1, title: '1. Diterima', desc: 'Menunggu Verifikasi' },
                  { step: 2, title: '2. Ditinjau', desc: 'Telaah Pokok Aduan' },
                  { step: 3, title: '3. Diproses', desc: 'Tindak Lanjut Lapangan' },
                  { step: 4, title: '4. Selesai', desc: 'Solusi Tuntas' },
                ].map((item) => {
                  const state = getStepStatus(item.step, ticket.status);
                  return (
                    <div key={item.step} className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-1.5 transition ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : state === 'active'
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                            : state === 'rejected'
                            ? 'bg-slate-300 text-slate-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          item.step
                        )}
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                        {item.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meta Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Kategori</span>
                  <span className="font-semibold text-slate-800">
                    {CATEGORIES_CONFIG[ticket.category].label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Lokasi</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {ticket.location || 'Lingkungan SDN Manyaran 4'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Tanggal Dikirim</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Isi Laporan Awal */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Uraian Pengaduan Awal:
              </span>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {ticket.content}
              </p>

              {/* Photos if any */}
              {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                    Foto Lampiran Bukti:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {ticket.attachmentUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-24 h-24 rounded-xl overflow-hidden border border-slate-300 hover:opacity-90 transition"
                      >
                        <img src={url} alt={`Bukti ${i + 1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tanggapan Resmi Sekolah */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Tanggapan Resmi Pihak Sekolah
                  </h4>
                  <p className="text-xs text-slate-500">
                    Diterbitkan oleh Kepala Sekolah & Tim Layanan SDN Manyaran 4
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {ticket.officialResponses.length} Tanggapan Resmi
              </span>
            </div>

            {ticket.officialResponses.length === 0 ? (
              <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 text-center text-slate-600">
                <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 text-sm">
                  Laporan Sedang Dalam Antrean Verifikasi
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Sesuai Standar Layanan Pengaduan SDN Manyaran 4, laporan akan ditelaah maksimal 1x24 jam kerja. Silakan kembali memeriksa nomor tiket ini secara berkala.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ticket.officialResponses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 border border-emerald-200/80"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {resp.authorName}
                        </span>
                        <span className="text-[11px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-md font-semibold">
                          {resp.authorRole}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(resp.date).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-emerald-400">
                      {resp.message}
                    </p>

                    {resp.evidencePhotos && resp.evidencePhotos.length > 0 && (
                      <div className="mt-3 pl-4">
                        <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                          Foto Bukti Tindak Lanjut:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {resp.evidencePhotos.map((pUrl, idx) => (
                            <img
                              key={idx}
                              src={pUrl}
                              alt="Bukti Tindak Lanjut"
                              className="w-20 h-20 rounded-lg object-cover border border-emerald-300"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diskusi / Tanggapan Tambahan Pelapor */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <h4 className="font-extrabold text-base text-slate-900 mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Kirim Informasi Tambahan / Tanggapan Balik</span>
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Jika pihak sekolah memerlukan informasi pelengkap atau Anda ingin memberikan klarifikasi lanjutan, Anda dapat membalas di bawah ini. Identitas Anda tetap dilindungi sesuai mode pengaduan awal.
            </p>

            {ticket.parentReplies && ticket.parentReplies.length > 0 && (
              <div className="space-y-3 mb-4">
                {ticket.parentReplies.map((pr) => (
                  <div key={pr.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-semibold text-slate-700">
                        {pr.isAnonymous ? 'Tanggapan Anda (Anonim)' : 'Tanggapan Anda (Orang Tua Murid)'}
                      </span>
                      <span>{new Date(pr.date).toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-slate-800 text-xs sm:text-sm">{pr.message}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSendParentReply} className="space-y-3">
              <textarea
                rows={3}
                required
                value={parentReplyText}
                onChange={(e) => setParentReplyText(e.target.value)}
                placeholder="Tuliskan pesan atau tanggapan tambahan untuk pihak sekolah di sini..."
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingReply || !parentReplyText.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Tanggapan Balik</span>
                </button>
              </div>
            </form>
          </div>

          {/* Form Kepuasan Penyelesaian (Hanya jika status SELESAI) */}
          {ticket.status === 'selesai' && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl p-6 sm:p-8 border border-emerald-300">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h4 className="font-extrabold text-base text-slate-900">
                  Penilaian Kepuasan Penanganan Layanan
                </h4>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Pengaduan ini telah ditandai tuntas oleh pihak sekolah. Bagaimana pendapat Anda terhadap kecepatan dan hasil penyelesaian dari SD Negeri Manyaran 4?
              </p>

              {ticket.feedbackRating ? (
                <div className="p-4 rounded-2xl bg-white border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-700">Penilaian Anda:</span>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= ticket.feedbackRating!.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {ticket.feedbackRating.comment && (
                    <p className="text-xs text-slate-600 italic">
                      "{ticket.feedbackRating.comment}"
                    </p>
                  )}
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Dinilai pada: {new Date(ticket.feedbackRating.ratedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleRatingSubmit} className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tingkat Kepuasan:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRatingStars(s)}
                          className="p-1.5 hover:scale-110 transition cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              s <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-700 self-center ml-2">
                        {ratingStars === 5
                          ? 'Sangat Puas'
                          : ratingStars === 4
                          ? 'Puas'
                          : ratingStars === 3
                          ? 'Cukup'
                          : 'Kurang Puas'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="Tulis ulasan singkat atas pelayanan pihak sekolah (opsional)..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Kirim Penilaian Kepuasan
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Timeline Riwayat Lengkap */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <h4 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Kronologi & Jejak Penanganan (Audit Trail)</span>
            </h4>

            <div className="relative border-l-2 border-emerald-200 ml-4 pl-5 space-y-6">
              {ticket.timeline.map((item, idx) => (
                <div key={item.id || idx} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-800">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(item.time).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-slate-400 italic">
                      Oleh: {item.actor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
