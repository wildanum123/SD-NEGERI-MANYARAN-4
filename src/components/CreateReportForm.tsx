import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  UserCheck,
  EyeOff,
  Wrench,
  BookOpen,
  ShieldAlert,
  BadgeDollarSign,
  Apple,
  FileText,
  Lightbulb,
  Upload,
  AlertCircle,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Info,
  Camera,
  X,
  Sparkles,
} from 'lucide-react';
import {
  ReportCategory,
  ReportUrgency,
  CATEGORIES_CONFIG,
  URGENCY_CONFIG,
  StudentGrade,
  ReportTicket,
} from '../types/report';
import { createNewReport } from '../services/reportStorage';
import { soundNotifier } from '../utils/audio';

interface CreateReportFormProps {
  onSuccess: (ticketId: string) => void;
  onNavigateToTrack: (ticketId: string) => void;
}

const CATEGORY_ICONS: Record<ReportCategory, React.ReactNode> = {
  sarpras: <Wrench className="w-5 h-5 text-amber-600" />,
  guru_pembelajaran: <BookOpen className="w-5 h-5 text-blue-600" />,
  bullying_keamanan: <ShieldAlert className="w-5 h-5 text-rose-600" />,
  keuangan_pip: <BadgeDollarSign className="w-5 h-5 text-emerald-600" />,
  kantin_kebersihan: <Apple className="w-5 h-5 text-teal-600" />,
  layanan_administrasi: <FileText className="w-5 h-5 text-purple-600" />,
  saran_inovasi: <Lightbulb className="w-5 h-5 text-indigo-600" />,
};

export const CreateReportForm: React.FC<CreateReportFormProps> = ({
  onNavigateToTrack,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [category, setCategory] = useState<ReportCategory>('sarpras');
  const [urgency, setUrgency] = useState<ReportUrgency>('sedang');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');

  // Non-anonymous fields
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentGrade, setStudentGrade] = useState<StudentGrade>('Kelas 3');
  const [studentName, setStudentName] = useState('');
  const [relationship, setRelationship] = useState<'Ayah' | 'Ibu' | 'Wali' | 'Warga Sekitar'>('Ibu');

  // Attachments
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Success dialog state
  const [createdTicket, setCreatedTicket] = useState<ReportTicket | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick preset samples for quick testing
  const handleQuickPreset = (presetType: 'sarpras' | 'bullying' | 'pip') => {
    if (presetType === 'sarpras') {
      setIsAnonymous(true);
      setCategory('sarpras');
      setUrgency('tinggi');
      setTitle('Plafon Dekat Meja Guru Kelas 5 Berlubang');
      setLocation('Ruang Kelas 5A SDN Manyaran 4');
      setContent('Mohon perhatian bapak kepala sekolah dan komite, plafon triplek di atas meja guru kelas 5A sudah agak lapuk karena rembesan hujan kemarin. Dikhawatirkan sewaktu-waktu runtuh saat jam KBM berlangsung.');
      setAttachmentUrls(['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80']);
      setAgreed(true);
    } else if (presetType === 'bullying') {
      setIsAnonymous(false);
      setParentName('Bpk. Hendra Kusuma');
      setPhone('082199887766');
      setStudentGrade('Kelas 4');
      setStudentName('Bagas');
      setRelationship('Ayah');
      setCategory('bullying_keamanan');
      setUrgency('darurat');
      setTitle('Laporan Perundungan & Ancaman Uang Saku Saat Pulang');
      setLocation('Jalan samping musholla menuju pintu gerbang');
      setContent('Anak saya bercerita beberapa kali dihadang siswa kelas atas saat hendak mengambil sepeda di samping musholla dan dimintai uang jajan secara paksa. Mohon guru piket membantu pengawasan dan penanganan secara arif tanpa saling menyudutkan.');
      setAgreed(true);
    } else {
      setIsAnonymous(true);
      setCategory('keuangan_pip');
      setUrgency('sedang');
      setTitle('Pertanyaan Verifikasi Berkas Penerima Dana PIP Siswa');
      setLocation('Kantor TU SDN Manyaran 4');
      setContent('Selamat pagi, apakah surat pernyataan rekening aktif dari bank penyalur BRI Banyakan perlu dilegalisir ulang oleh pihak sekolah? Mohon konfirmasi jadwal pelayanan staf TU.');
      setAgreed(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachmentUrls((prev) => [...prev, reader.result as string]);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = (index: number) => {
    setAttachmentUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newTicket = createNewReport({
      category,
      urgency,
      title: title.trim(),
      location: location.trim() || 'Lingkungan SDN Manyaran 4',
      content: content.trim(),
      isAnonymous,
      reporterInfo: isAnonymous
        ? undefined
        : {
            parentName: parentName.trim() || 'Wali Murid',
            phone: phone.trim(),
            studentGrade,
            studentName: studentName.trim(),
            relationship,
          },
      attachmentUrls,
    });

    // Sound chime and celebration confetti
    soundNotifier.playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setCreatedTicket(newTicket);
  };

  const copyTicketId = () => {
    if (!createdTicket) return;
    navigator.clipboard.writeText(createdTicket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareViaWhatsApp = () => {
    if (!createdTicket) return;
    const url = window.location.origin;
    const text = `Halo, ini adalah nomor tiket pengaduan saya di SD Negeri Manyaran 4 Kediri:\n*Kode Tiket:* ${createdTicket.id}\n*Judul:* ${createdTicket.title}\n*Tanggal:* ${new Date(createdTicket.createdAt).toLocaleDateString('id-ID')}\n\nSaya dapat memantau respon resmi dan perkembangan tindak lanjut melalui portal:\n${url}?ticket=${createdTicket.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Intro & Whistleblower Reassurance Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Layanan Terbuka & Ramah Anak
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sampaikan Aspirasi, Keluhan, atau Saran Anda
          </h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            SD Negeri Manyaran 4 berkomitmen mendengarkan setiap masukan dari orang tua murid secara transparan, bertanggung jawab, dan bebas dari rasa khawatir. Anda dapat memilih untuk mengirim secara <strong>100% Anonim</strong>.
          </p>

          {/* Quick preset buttons for convenience / demo */}
          <div className="mt-5 pt-4 border-t border-emerald-700/50 flex flex-wrap items-center gap-2">
            <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Contoh Aduan Siap Coba:
            </span>
            <button
              type="button"
              onClick={() => handleQuickPreset('sarpras')}
              className="text-xs bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 px-3 py-1 rounded-lg border border-emerald-600/50 transition cursor-pointer"
            >
              🛠️ Plafon Kelas Lapuk (Anonim)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('bullying')}
              className="text-xs bg-emerald-950/70 hover:bg-emerald-900 text-rose-200 px-3 py-1 rounded-lg border border-rose-500/40 transition cursor-pointer"
            >
              🚨 Bullying / Uang Saku (Dengan Kontak)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('pip')}
              className="text-xs bg-emerald-950/70 hover:bg-emerald-900 text-amber-200 px-3 py-1 rounded-lg border border-amber-500/40 transition cursor-pointer"
            >
              💰 Pertanyaan Bantuan PIP
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
        {/* Step 1: Privacy & Anonymity Mode */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            1. Pilihan Mode Identitas & Kerahasiaan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Mode Anonim */}
            <button
              type="button"
              onClick={() => setIsAnonymous(true)}
              className={`p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                isAnonymous
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isAnonymous ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">Mode Anonim (Rahasia Penuh)</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Paling Aman
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Identitas dan nama anak <strong>tidak dicatat sama sekali</strong>. Anda akan memperoleh Kode Tiket unik untuk melihat perkembangan respon sekolah.
                  </p>
                </div>
              </div>
            </button>

            {/* Mode Teridentifikasi */}
            <button
              type="button"
              onClick={() => setIsAnonymous(false)}
              className={`p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                !isAnonymous
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    !isAnonymous ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">Sertakan Identitas / Kontak</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Komunikasi Cepat
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Mencantumkan nama & nomor kontak WhatsApp agar guru piket atau kepala sekolah dapat menghubungi Anda secara langsung jika diperlukan.
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Form identitas jika non-anonim */}
          {!isAnonymous && (
            <div className="mt-4 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Orang Tua / Wali <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required={!isAnonymous}
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Contoh: Bpk. Sugiono / Ibu Fitri"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required={!isAnonymous}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tingkat Kelas Siswa <span className="text-rose-500">*</span>
                </label>
                <select
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value as StudentGrade)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600"
                >
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 4">Kelas 4</option>
                  <option value="Kelas 5">Kelas 5</option>
                  <option value="Kelas 6">Kelas 6</option>
                  <option value="Umum / Tidak Disebutkan">Umum / Tidak Disebutkan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Siswa & Hubungan (Opsional)
                </label>
                <div className="flex gap-2">
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-28 text-sm px-2.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 shrink-0"
                  >
                    <option value="Ayah">Ayah</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Wali">Wali</option>
                    <option value="Warga Sekitar">Warga</option>
                  </select>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Nama anak (opsional)"
                    className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Kategori Pengaduan */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            2. Pilih Kategori Laporan / Usulan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.keys(CATEGORIES_CONFIG) as ReportCategory[]).map((catKey) => {
              const cfg = CATEGORIES_CONFIG[catKey];
              const isSelected = category === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCategory(catKey)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/90 shadow-sm ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                      {CATEGORY_ICONS[catKey]}
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {cfg.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Tingkat Urgensi */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-slate-800">
              3. Tingkat Urgensi Penanganan
            </label>
            <span className="text-xs text-slate-400">
              Pilih sesuai dampak terhadap siswa
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['rendah', 'sedang', 'tinggi', 'darurat'] as ReportUrgency[]).map((lvl) => {
              const cfg = URGENCY_CONFIG[lvl];
              const isSelected = urgency === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgency(lvl)}
                  className={`py-2.5 px-3 rounded-xl border text-center font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                    isSelected
                      ? `${cfg.badge} border-2 shadow-sm font-bold`
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dotColor}`} />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
          {urgency === 'darurat' && (
            <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>
                <strong>Prioritas Darurat:</strong> Pengaduan ini akan langsung memicu notifikasi peringatan berprioritas tinggi kepada Kepala Sekolah & Tim TPPK SDN Manyaran 4 untuk penanganan maksimal 3–6 jam.
              </span>
            </div>
          )}
        </div>

        {/* Step 4: Detail Laporan */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-800">
            4. Detail Pengaduan / Masukan
          </label>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Pengaduan / Pokok Masalah <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Perbaikan atap teras kelas yang bocor / Usulan buku perpustakaan"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lokasi / Bagian Sekolah Terkait
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Ruang Kelas 4B, Halaman Parkir Belakang, Kantin Barat, dll."
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Uraian Lengkap Keluhan / Masukan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jelaskan kronologi, kondisi yang terjadi, dampak terhadap murid, dan harapan perbaikan yang diinginkan secara santun dan jelas..."
              className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-600 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Minimal cantumkan fakta yang Anda ketahui. Hindari penggunaan kata kasar atau fitnah.
            </p>
          </div>

          {/* Lampiran Foto / Bukti */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Lampiran Foto / Bukti Pendukung (Opsional)</span>
              <span className="text-[11px] text-slate-400">Mendukung format JPG, PNG</span>
            </label>

            {/* List attached photos */}
            {attachmentUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {attachmentUrls.map((url, idx) => (
                  <div key={idx} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                    <img src={url} alt={`Lampiran ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2.5 items-center">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>{isUploading ? 'Memproses Foto...' : 'Pilih / Ambil Foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setAttachmentUrls((prev) => [...prev, 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80'])}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Sampel Foto Fasilitas Sekolah</span>
              </button>
            </div>
          </div>
        </div>

        {/* Commitment Statement */}
        <div className="pt-2 border-t border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 shrink-0"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Saya menyatakan bahwa informasi yang saya sampaikan adalah benar demi kebaikan bersama dan kemajuan mutu pendidikan di <strong>SD Negeri Manyaran 4 Kecamatan Banyakan Kabupaten Kediri</strong>, serta bersedia mematuhi etika penyampaian informasi yang santun.
            </span>
          </label>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kode Tiket pelacakan akan otomatis diterbitkan setelah dikirim.</span>
          </div>

          <button
            type="submit"
            disabled={!agreed}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Kirim Pengaduan Sekarang</span>
          </button>
        </div>
      </form>

      {/* Success Modal with Ticket Code & Actions */}
      {createdTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 mb-2">
                Pengaduan Berhasil Terkirim
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Laporan Anda Diterima Sistem
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Terima kasih telah berkontribusi bagi kemajuan <strong>SDN Manyaran 4 Banyakan</strong>. Simpan Nomor Tiket Anda di bawah ini untuk melacak status dan tanggapan resmi dari pihak sekolah:
              </p>
            </div>

            {/* Ticket Box */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Nomor Tiket Pengaduan Anda
              </span>
              <div className="text-2xl sm:text-3xl font-black tracking-wider text-emerald-800 my-1 font-mono select-all">
                {createdTicket.id}
              </div>
              <p className="text-[11px] text-slate-500">
                {createdTicket.isAnonymous
                  ? '🔒 Dikirim Secara Anonim (Identitas 100% Rahasia)'
                  : `👤 Dikirim oleh: ${createdTicket.reporterInfo?.parentName} (${createdTicket.reporterInfo?.studentGrade})`}
              </p>

              <button
                type="button"
                onClick={copyTicketId}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-xs transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Salin Nomor Tiket</span>
                  </>
                )}
              </button>
            </div>

            {/* Next Action Buttons */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  const id = createdTicket.id;
                  setCreatedTicket(null);
                  onNavigateToTrack(id);
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Lacak Status Pengaduan Saya Sekarang</span>
              </button>

              <button
                type="button"
                onClick={shareViaWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Kirim Bukti Tiket ke WhatsApp Pribadi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCreatedTicket(null);
                  setTitle('');
                  setContent('');
                  setLocation('');
                  setAttachmentUrls([]);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium transition"
              >
                Tutup & Tulis Pengaduan Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
