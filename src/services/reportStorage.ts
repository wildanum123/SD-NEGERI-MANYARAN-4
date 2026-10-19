import { ReportTicket, ReportStatus, OfficialResponse, InternalNote, ParentReply } from '../types/report';
import { realtimeSync } from '../utils/broadcast';

const STORAGE_KEY = 'sdn_manyaran_4_reports_db_v5';
const MY_SAVED_TICKETS_KEY = 'sdn_manyaran_4_my_saved_tickets';

export const INITIAL_REPORTS: ReportTicket[] = [
  {
    id: 'SDNM4-2026-0419',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'sarpras',
    title: 'Perbaikan Atap Teras Kelas 3 yang Bocor Saat Hujan Deras',
    content: 'Selamat pagi pihak sekolah. Kami dari perwakilan orang tua murid kelas 3 ingin menyampaikan bahwa talang dan atap teras kelas 3 sering tempias dan bocor jika hujan deras di Manyaran. Anak-anak sempat terpeleset di lantai teras yang licin. Mohon segera diperbaiki demi keselamatan siswa.',
    location: 'Teras Gedung Timur, Depan Ruang Kelas 3B',
    urgency: 'tinggi',
    isAnonymous: true,
    status: 'selesai',
    assignedTo: 'Tim Sarpras & Pemeliharaan SDN Manyaran 4',
    attachmentUrls: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80',
    ],
    officialResponses: [
      {
        id: 'resp-1',
        authorName: 'Biti Afroni, S.Pd. SD',
        authorRole: 'Kepala Sekolah',
        date: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Terima kasih atas laporannya. Informasi ini sangat penting bagi keselamatan anak-anak kita. Hari ini juga kami langsung instruksikan tim Sarpras dan tukang langganan sekolah untuk mengecek kondisi talang dan genteng di atas kelas 3.',
        statusChange: 'diproses',
      },
      {
        id: 'resp-2',
        authorName: 'Tim Sarpras SDN Manyaran 4',
        authorRole: 'Waka Sarpras',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        message: 'Laporan telah diselesaikan. Talang seng yang berkarat sudah diganti dengan talang PVC baru berdiameter lebih lebar, serta genteng yang melorot sudah diperbaiki dan diperkuat dengan semen semenanjung. Lantai teras kini aman dan tidak lagi tergenang.',
        statusChange: 'selesai',
      },
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Kepala Sekolah',
        date: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Dana perbaikan dialokasikan dari pos pemeliharaan ringan BOS Triwulan 1. Pekerjaan selesai dalam 1 hari.',
      },
    ],
    parentReplies: [
      {
        id: 'pr-1',
        date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        message: 'Alhamdulillah terima kasih banyak Bapak Kepala Sekolah dan tim sarpras SDN Manyaran 4 atas respon cepatnya. Kami sangat tenang sekarang.',
        isAnonymous: true,
      },
    ],
    feedbackRating: {
      stars: 5,
      comment: 'Pelayanan sangat memuaskan, dalam 2 hari masalah langsung tuntas!',
      ratedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    },
    timeline: [
      {
        id: 't-1',
        time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Pengaduan Diterima',
        description: 'Laporan dikirimkan melalui Ruang Pengaduan Online SDN Manyaran 4 (Anonim).',
        actor: 'Orang Tua Murid',
      },
      {
        id: 't-2',
        time: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Disposisi & Peninjauan Lokasi',
        description: 'Kepala Sekolah menugaskan Koordinator Sarpras untuk memeriksa kerusakan.',
        actor: 'Kepala Sekolah',
      },
      {
        id: 't-3',
        time: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Pengerjaan Perbaikan',
        description: 'Penggantian talang seng dengan PVC dan perapian atap genteng.',
        actor: 'Tim Sarpras & Tukang',
      },
      {
        id: 't-4',
        time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Pengaduan Selesai',
        description: 'Pekerjaan dinyatakan tuntas dan teruji kedap air hujan.',
        actor: 'Waka Sarpras',
      },
    ],
  },
  {
    id: 'SDNM4-2026-0524',
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    category: 'bullying_keamanan',
    title: 'Pencegahan Ejekan / Bullying Fisik Saat Jam Istirahat Lapangan',
    content: 'Mohon bantuan Bapak/Ibu guru piket agar meningkatkan pengawasan di area sudut lapangan dekat pohon rindang saat jam istirahat kedua. Anak saya dan beberapa temannya bercerita sering diejek dan barang mainannya diambil oleh anak kelas atas. Kami ingin lingkungan sekolah tetap ramah dan saling menghargai.',
    location: 'Area Pohon Rindang Sudut Lapangan Utama',
    urgency: 'darurat',
    isAnonymous: false,
    reporterInfo: {
      parentName: 'Ibu Ratna Dewi',
      phone: '081234567890',
      studentGrade: 'Kelas 4',
      studentName: 'Ahmad Faiz',
      relationship: 'Ibu',
    },
    status: 'diproses',
    assignedTo: 'Ibu Ika Lindawati, S.Pd. Gr (Ketua TPPK SDN Manyaran 4)',
    officialResponses: [
      {
        id: 'resp-b1',
        authorName: 'Ibu Ika Lindawati, S.Pd. Gr',
        authorRole: 'Ketua TPPK',
        date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        message: 'Terima kasih atas keberanian Ibu Ratna menyampaikan hal ini secara terbuka. Kami di SD Negeri Manyaran 4 memiliki komitmen "Sekolah Ramah Anak Tanpa Perundungan". Kami telah memanggil seluruh guru piket untuk menambah 2 pos jaga aktif saat jam istirahat kedua. Hari ini kami juga telah mengidentifikasi siswa yang bersangkutan untuk bimbingan konseling persuasif bersama orang tua masing-masing.',
        statusChange: 'diproses',
      },
    ],
    internalNotes: [
      {
        id: 'noteb-1',
        author: 'Guru BK / Kesiswaan',
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        note: 'Telah dilakukan mediasi kekeluargaan antar wali murid terkait. Siswa telah saling memaafkan dan menandatangani komitmen anti-bullying.',
      },
    ],
    timeline: [
      {
        id: 'tb-1',
        time: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Pengaduan Masuk (Prioritas Darurat)',
        description: 'Laporan perundungan masuk dengan identitas terverifikasi orang tua murid.',
        actor: 'Ibu Ratna Dewi',
      },
      {
        id: 'tb-2',
        time: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        title: 'Pemberitahuan & Tindakan Mediasi',
        description: 'Tim BK sekolah mengaktifkan pengawasan ganda guru piket dan konseling siswa.',
        actor: 'Ibu Siti Khodijah, S.Pd',
      },
    ],
  },
  {
    id: 'SDNM4-2026-0681',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: 'keuangan_pip',
    title: 'Informasi Jadwal Aktivasi & Penyaluran Buku Tabungan PIP 2026',
    content: 'Selamat siang Bapak/Ibu operator sekolah. Mohon informasi apakah siswa kelas 2 yang masuk SK Nominasi PIP Kabupaten Kediri sudah bisa melakukan aktivasi rekening SimPel di BRI Banyakan? Mohon petunjuk kelengkapan surat pengantar dari sekolah.',
    location: 'Layanan Tata Usaha',
    urgency: 'sedang',
    isAnonymous: true,
    status: 'ditinjau',
    assignedTo: 'Ibu Afra Widiyantari, S.Sos., S.Pd (Operator Pengaduan)',
    officialResponses: [
      {
        id: 'resp-p1',
        authorName: 'Afra Widiyantari, S.Sos., S.Pd',
        authorRole: 'Operator Pengaduan',
        date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        message: 'Halo Ayah/Bunda. Surat pengantar aktivasi dari Kepala Sekolah saat ini sedang dalam proses penandatanganan kolektif dan stempel basah. InsyaAllah mulai hari Senin depan wali murid dapat mengambil surat pengantar di ruang Tata Usaha SDN Manyaran 4 tanpa dipungut biaya apapun.',
        statusChange: 'ditinjau',
      },
    ],
    internalNotes: [],
    timeline: [
      {
        id: 'tp-1',
        time: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        title: 'Pertanyaan Diterima',
        description: 'Pertanyaan seputar PIP masuk ke meja Operator.',
        actor: 'Orang Tua Murid',
      },
      {
        id: 'tp-2',
        time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        title: 'Verifikasi Berkas SK Nominasi',
        description: 'Petunjuk pengambilan surat pengantar diumumkan secara tertulis.',
        actor: 'Operator Pengaduan',
      },
    ],
  },
  {
    id: 'SDNM4-2026-0733',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'saran_inovasi',
    title: 'Usulan Pengadaan Pojok Baca Digital / Buku Dongeng Cerita Rakyat',
    content: 'Usulan untuk pihak perpustakaan sekolah: anak-anak kami sangat antusias membaca, namun koleksi buku dongeng bergambar dan cerita rakyat di perpustakaan masih sangat terbatas. Jika memungkinkan, bisakah diadakan gerakan donasi buku bacaan dari alumni atau program literasi 15 menit sebelum masuk kelas? Terima kasih.',
    location: 'Perpustakaan SDN Manyaran 4',
    urgency: 'rendah',
    isAnonymous: true,
    status: 'menunggu',
    officialResponses: [],
    internalNotes: [],
    timeline: [
      {
        id: 'ts-1',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        title: 'Saran Diterima',
        description: 'Aspirasi literasi masuk ke antrean verifikasi Komite & Kepala Sekolah.',
        actor: 'Orang Tua Murid',
      },
    ],
  },
];

export function getAllReports(): ReportTicket[] {
  if (typeof window === 'undefined') return INITIAL_REPORTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveReports(reports: ReportTicket[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to save reports to localStorage', err);
  }
}

export function getReportById(id: string): ReportTicket | undefined {
  const reports = getAllReports();
  const searchClean = id.trim().toUpperCase();
  return reports.find(
    (r) => r.id.toUpperCase() === searchClean || r.id.toUpperCase().replace(/-/g, '') === searchClean.replace(/-/g, '')
  );
}

export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SDNM4-${year}-${randomNum}`;
}

export function createNewReport(payload: Omit<ReportTicket, 'id' | 'createdAt' | 'updatedAt' | 'officialResponses' | 'internalNotes' | 'timeline' | 'status'> & { id?: string }): ReportTicket {
  const reports = getAllReports();
  const newId = payload.id || generateTicketId();
  const now = new Date().toISOString();

  const newTicket: ReportTicket = {
    ...payload,
    id: newId,
    createdAt: now,
    updatedAt: now,
    status: 'menunggu',
    officialResponses: [],
    internalNotes: [],
    parentReplies: [],
    timeline: [
      {
        id: `t-${Date.now()}`,
        time: now,
        title: 'Pengaduan Dibuat & Diterima Sistem',
        description: payload.isAnonymous
          ? 'Laporan dikirim secara Anonim. Identitas pelapor dilindungi penuh.'
          : `Laporan dikirim oleh ${payload.reporterInfo?.parentName || 'Orang Tua'} (${payload.reporterInfo?.studentGrade || 'Murid SDN Manyaran 4'}).`,
        actor: payload.isAnonymous ? 'Pelapor (Anonim)' : payload.reporterInfo?.parentName || 'Orang Tua Murid',
      },
    ],
  };

  const updatedReports = [newTicket, ...reports];
  saveReports(updatedReports);

  // Remember ticket on this device for parent easy tracking
  saveMyTicketLocally(newTicket.id);

  // Broadcast to all tabs/listeners
  realtimeSync.broadcast({ type: 'NEW_REPORT', payload: newTicket });

  return newTicket;
}

export function updateReportStatus(
  id: string,
  newStatus: ReportStatus,
  authorInfo: {
    name: string;
    role: OfficialResponse['authorRole'];
    message: string;
    evidencePhotos?: string[];
  },
  assignedTo?: string
): ReportTicket | null {
  const reports = getAllReports();
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = reports[index];
  const now = new Date().toISOString();

  const newResponse: OfficialResponse = {
    id: `resp-${Date.now()}`,
    authorName: authorInfo.name,
    authorRole: authorInfo.role,
    date: now,
    message: authorInfo.message,
    statusChange: newStatus,
    evidencePhotos: authorInfo.evidencePhotos,
  };

  const statusLabelMap: Record<ReportStatus, string> = {
    menunggu: 'Menunggu Verifikasi',
    ditinjau: 'Sedang Ditinjau',
    diproses: 'Dalam Penanganan / Tindak Lanjut',
    selesai: 'Selesai & Teratasi',
    ditolak: 'Diarsipkan / Tidak Sesuai Kriteria',
  };

  const timelineEvent = {
    id: `tl-${Date.now()}`,
    time: now,
    title: `Status Diperbarui: ${statusLabelMap[newStatus]}`,
    description: authorInfo.message.length > 90 ? authorInfo.message.slice(0, 90) + '...' : authorInfo.message,
    actor: `${authorInfo.name} (${authorInfo.role})`,
  };

  const updated: ReportTicket = {
    ...current,
    status: newStatus,
    updatedAt: now,
    assignedTo: assignedTo !== undefined ? assignedTo : current.assignedTo,
    officialResponses: [newResponse, ...current.officialResponses],
    timeline: [...current.timeline, timelineEvent],
  };

  reports[index] = updated;
  saveReports(reports);

  realtimeSync.broadcast({ type: 'REPORT_UPDATED', payload: updated });

  return updated;
}

export function addInternalNote(id: string, noteText: string, author: string, assignedTo?: string): ReportTicket | null {
  const reports = getAllReports();
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = reports[index];
  const now = new Date().toISOString();

  const noteItem: InternalNote = {
    id: `note-${Date.now()}`,
    author,
    date: now,
    note: noteText,
  };

  const updated: ReportTicket = {
    ...current,
    updatedAt: now,
    assignedTo: assignedTo || current.assignedTo,
    internalNotes: [...current.internalNotes, noteItem],
  };

  reports[index] = updated;
  saveReports(reports);
  realtimeSync.broadcast({ type: 'REPORT_UPDATED', payload: updated });
  return updated;
}

export function addParentFollowUp(id: string, message: string, attachmentUrl?: string): ReportTicket | null {
  const reports = getAllReports();
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = reports[index];
  const now = new Date().toISOString();

  const replyItem: ParentReply = {
    id: `reply-${Date.now()}`,
    date: now,
    message,
    isAnonymous: current.isAnonymous,
    attachmentUrl,
  };

  const timelineEvent = {
    id: `tl-p-${Date.now()}`,
    time: now,
    title: 'Tanggapan Balik dari Pelapor',
    description: message.length > 80 ? message.slice(0, 80) + '...' : message,
    actor: current.isAnonymous ? 'Pelapor (Anonim)' : 'Orang Tua Murid',
  };

  const updated: ReportTicket = {
    ...current,
    updatedAt: now,
    parentReplies: [...(current.parentReplies || []), replyItem],
    timeline: [...current.timeline, timelineEvent],
  };

  reports[index] = updated;
  saveReports(reports);
  realtimeSync.broadcast({ type: 'REPORT_UPDATED', payload: updated });
  return updated;
}

export function submitSatisfactionRating(id: string, stars: number, comment?: string): ReportTicket | null {
  const reports = getAllReports();
  const index = reports.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = reports[index];
  const updated: ReportTicket = {
    ...current,
    feedbackRating: {
      stars,
      comment,
      ratedAt: new Date().toISOString(),
    },
  };

  reports[index] = updated;
  saveReports(reports);
  realtimeSync.broadcast({ type: 'REPORT_UPDATED', payload: updated });
  return updated;
}

export function deleteReport(id: string): boolean {
  const reports = getAllReports();
  const filtered = reports.filter((r) => r.id !== id);
  if (filtered.length !== reports.length) {
    saveReports(filtered);
    realtimeSync.broadcast({ type: 'REPORT_DELETED', payload: { id } });
    return true;
  }
  return false;
}

export function resetToSampleData(): ReportTicket[] {
  saveReports(INITIAL_REPORTS);
  realtimeSync.broadcast({ type: 'REPORT_UPDATED', payload: INITIAL_REPORTS[0] });
  return INITIAL_REPORTS;
}

export function saveMyTicketLocally(ticketId: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(MY_SAVED_TICKETS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(ticketId)) {
      list.unshift(ticketId);
      localStorage.setItem(MY_SAVED_TICKETS_KEY, JSON.stringify(list.slice(0, 10)));
    }
  } catch {
    // ignore
  }
}

export function getMySavedTickets(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MY_SAVED_TICKETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function generateWhatsAppNotice(ticket: ReportTicket): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sdnmanyaran4.sch.id';
  const text = `*PEMBERITAHUAN PENGADUAN BARU - SDN MANYARAN 4 KEDIRI*\n\n` +
    `📌 *Kode Tiket:* ${ticket.id}\n` +
    `⚡ *Tingkat Urgensi:* ${ticket.urgency.toUpperCase()}\n` +
    `📁 *Kategori:* ${ticket.category}\n` +
    `📝 *Judul:* ${ticket.title}\n` +
    `👤 *Status Pelapor:* ${ticket.isAnonymous ? 'Anonim (Rahasia)' : `${ticket.reporterInfo?.parentName} (${ticket.reporterInfo?.studentGrade})`}\n` +
    `📍 *Lokasi:* ${ticket.location || 'Lingkungan SDN Manyaran 4'}\n\n` +
    `Cek & tangani segera melalui portal:\n${baseUrl}?tab=lacak&ticket=${ticket.id}`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function simulateIncomingReport(): ReportTicket {
  const sampleIssues = [
    {
      category: 'sarpras' as const,
      title: 'Pintu Kamar Mandi Siswa Kelas 1 Bagian Bawah Rapuh',
      content: 'Kait gerendel pintu toilet siswa sebelah selatan sudah longgar dan anak-anak sering terkunci dari dalam. Mohon segera diperbaiki oleh tim sekolah agar anak tidak takut ke belakang.',
      urgency: 'sedang' as const,
      isAnonymous: true,
      location: 'Toilet Siswa Sisi Selatan',
    },
    {
      category: 'bullying_keamanan' as const,
      title: 'Pengawasan Saat Jam Penjemputan Pulang Sekolah di Depan Gerbang',
      content: 'Banyak kendaraan motor dan mobil yang berhenti sembarangan di depan gerbang jalan raya Manyaran saat jam kepulangan pukul 12.30. Mohon bantuan bapak penjaga sekolah atau guru piket untuk membantu menyeberangkan siswa.',
      urgency: 'darurat' as const,
      isAnonymous: false,
      reporterInfo: {
        parentName: 'Pak Wahyudi',
        phone: '085712349988',
        studentGrade: 'Kelas 2' as const,
        studentName: 'Dimas',
        relationship: 'Ayah' as const,
      },
      location: 'Gerbang Depan SDN Manyaran 4, Jl. Raya Manyaran Banyakan',
    },
    {
      category: 'kantin_kebersihan' as const,
      title: 'Saran Penyediaan Sabun Cuci Tangan di Setiap Wastafel Kelas',
      content: 'Kami menyarankan agar botol sabun cuci tangan diisi kembali secara berkala, terutama menjelang jam makan bekal anak-anak. Menjaga kebersihan sangat penting agar anak-anak tidak mudah tertular batuk pilek.',
      urgency: 'rendah' as const,
      isAnonymous: true,
      location: 'Wastafel Depan Selasar Kelas 1-6',
    },
  ];

  const pick = sampleIssues[Math.floor(Math.random() * sampleIssues.length)];
  return createNewReport(pick);
}
