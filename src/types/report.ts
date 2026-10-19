export type ReportCategory =
  | 'sarpras'
  | 'guru_pembelajaran'
  | 'bullying_keamanan'
  | 'keuangan_pip'
  | 'kantin_kebersihan'
  | 'layanan_administrasi'
  | 'saran_inovasi';

export type ReportUrgency = 'rendah' | 'sedang' | 'tinggi' | 'darurat';

export type ReportStatus =
  | 'menunggu'
  | 'ditinjau'
  | 'diproses'
  | 'selesai'
  | 'ditolak';

export type StudentGrade =
  | 'Kelas 1'
  | 'Kelas 2'
  | 'Kelas 3'
  | 'Kelas 4'
  | 'Kelas 5'
  | 'Kelas 6'
  | 'Umum / Tidak Disebutkan';

export interface ReporterInfo {
  parentName?: string;
  phone?: string;
  studentGrade?: StudentGrade;
  studentName?: string;
  relationship?: 'Ayah' | 'Ibu' | 'Wali' | 'Warga Sekitar';
}

export interface OfficialResponse {
  id: string;
  authorName: string;
  authorRole: 'Kepala Sekolah' | 'Operator Pengaduan' | 'Komite Sekolah' | 'Waka Sarpras' | 'Guru BK / Kesiswaan' | 'Ketua TPPK';
  date: string;
  message: string;
  statusChange?: ReportStatus;
  evidencePhotos?: string[];
}

export interface InternalNote {
  id: string;
  author: string;
  date: string;
  note: string;
  actionTaken?: string;
}

export interface ParentReply {
  id: string;
  date: string;
  message: string;
  isAnonymous: boolean;
  attachmentUrl?: string;
}

export interface ReportTicket {
  id: string; // e.g. SDNM4-2026-0842
  createdAt: string;
  updatedAt: string;
  category: ReportCategory;
  title: string;
  content: string;
  location?: string; // e.g. "Ruang Kelas 3B", "Kantin Sebelah Timur"
  urgency: ReportUrgency;
  isAnonymous: boolean;
  reporterInfo?: ReporterInfo;
  attachmentUrls?: string[];
  status: ReportStatus;
  officialResponses: OfficialResponse[];
  internalNotes: InternalNote[];
  parentReplies?: ParentReply[];
  assignedTo?: string; // e.g. "Bpk. Suwandi, S.Pd (Koord. Sarpras)"
  feedbackRating?: {
    stars: number;
    comment?: string;
    ratedAt: string;
  };
  timeline: Array<{
    id: string;
    time: string;
    title: string;
    description: string;
    actor: string;
  }>;
}

export interface CategoryMeta {
  id: ReportCategory;
  label: string;
  description: string;
  iconName: string;
  badgeColor: string;
}

export const CATEGORIES_CONFIG: Record<ReportCategory, CategoryMeta> = {
  sarpras: {
    id: 'sarpras',
    label: 'Fasilitas & Sarpras',
    description: 'Kerusakan meja, kursi, toilet, genteng bocor, pagar, halaman sekolah',
    iconName: 'Wrench',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  guru_pembelajaran: {
    id: 'guru_pembelajaran',
    label: 'Pembelajaran & Pendidik',
    description: 'Proses belajar mengajar, buku materi, jam pelajaran, penugasan',
    iconName: 'BookOpen',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  bullying_keamanan: {
    id: 'bullying_keamanan',
    label: 'Keamanan & Anti Perundungan',
    description: 'Tindakan bullying, perkelahian, keamanan gerbang, keselamatan murid',
    iconName: 'ShieldAlert',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  keuangan_pip: {
    id: 'keuangan_pip',
    label: 'BOS, PIP & Pembiayaan',
    description: 'Informasi bantuan PIP, transparansi BOS, iuran paguyuban kelas',
    iconName: 'BadgeDollarSign',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  kantin_kebersihan: {
    id: 'kantin_kebersihan',
    label: 'Kantin, Makanan & Sanitasi',
    description: 'Kebersihan jajanan kantin, ketersediaan air bersih, pemilahan sampah',
    iconName: 'Apple',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  layanan_administrasi: {
    id: 'layanan_administrasi',
    label: 'Administrasi & Surat',
    description: 'Legalisir ijazah, surat pindah, NISN, pelayanan tata usaha sekolah',
    iconName: 'FileText',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  saran_inovasi: {
    id: 'saran_inovasi',
    label: 'Saran & Inovasi Sekolah',
    description: 'Usulan program ekstrakurikuler, pembiasaan karakter, event paguyuban',
    iconName: 'Lightbulb',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
};

export const STATUS_CONFIG: Record<ReportStatus, { label: string; badge: string; step: number; color: string }> = {
  menunggu: {
    label: 'Menunggu Verifikasi',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    step: 1,
    color: '#eab308',
  },
  ditinjau: {
    label: 'Sedang Ditinjau',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    step: 2,
    color: '#3b82f6',
  },
  diproses: {
    label: 'Dalam Penanganan',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    step: 3,
    color: '#a855f7',
  },
  selesai: {
    label: 'Selesai & Teratasi',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    step: 4,
    color: '#10b981',
  },
  ditolak: {
    label: 'Diarsipkan / Tidak Sesuai',
    badge: 'bg-slate-200 text-slate-700 border-slate-300',
    step: 0,
    color: '#64748b',
  },
};

export const URGENCY_CONFIG: Record<ReportUrgency, { label: string; badge: string; dotColor: string }> = {
  rendah: {
    label: 'Biasa / Saran',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-400',
  },
  sedang: {
    label: 'Perlu Perhatian',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  tinggi: {
    label: 'Prioritas Tinggi',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    dotColor: 'bg-orange-500',
  },
  darurat: {
    label: 'Mendesak / Darurat',
    badge: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
    dotColor: 'bg-rose-600',
  },
};
