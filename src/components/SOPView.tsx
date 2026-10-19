import React from 'react';
import {
  ShieldCheck,
  Clock,
  HelpCircle,
  FileCheck2,
  Lock,
  PhoneCall,
  Scale,
  Users,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SOPView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Banner Utama */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
          <Scale className="w-4 h-4" />
          <span>Dasar Hukum: Permendikbudristek No. 46 Tahun 2023</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Standar Operasional Prosedur (SOP) & Perlindungan Pelapor
        </h2>
        <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
          Ruang Pengaduan SD Negeri Manyaran 4 didesain sebagai sarana komunikasi yang berkeadilan, aman, dan konstruktif antara pihak sekolah dan seluruh orang tua murid di wilayah Desa Manyaran, Kecamatan Banyakan, Kabupaten Kediri.
        </p>
      </div>

      {/* 4 Tahap Alur Penanganan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 flex items-center gap-2">
          <FileCheck2 className="w-6 h-6 text-emerald-600" />
          <span>Alur Penanganan Pengaduan (SOP 4 Tahap)</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Setiap laporan yang masuk akan ditindaklanjuti secara berjenjang dan terdokumentasi:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Penerimaan & Verifikasi Awal</h4>
                <span className="text-[11px] text-amber-700 font-medium">SLA: Maksimal 1x24 Jam</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operator Pengaduan dan Kepala Sekolah memeriksa kelengkapan isi laporan, mengklasifikasi kategori, dan memastikan laporan bukan bermuatan fitnah/hoaks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Disposisi & Investigasi Lapangan</h4>
                <span className="text-[11px] text-blue-700 font-medium">SLA: 1–2 Hari Kerja</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kepala Sekolah menugaskan penanggung jawab (misal Waka Sarpras untuk fasilitas rusak, atau Guru BK/TPPK untuk dugaan bullying) untuk memeriksa langsung ke lapangan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Eksekusi Perbaikan / Mediasi</h4>
                <span className="text-[11px] text-purple-700 font-medium">SLA: Disesuaikan Skala Masalah</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tindakan nyata dilakukan: perbaikan sarana fisik, pendampingan konseling anak, musyawarah komite, atau pembaharuan layanan administrasi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                4
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Tanggapan Resmi & Evaluasi</h4>
                <span className="text-[11px] text-emerald-700 font-medium">Transparan & Terdokumentasi</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pihak sekolah mempublikasikan respon resmi dan bukti foto perbaikan pada portal. Pelapor dapat melihat status dan memberikan umpan balik kepuasan.
            </p>
          </div>
        </div>
      </div>

      {/* Jaminan Perlindungan Pelapor (Whistleblower Protection) */}
      <div className="bg-emerald-50/80 rounded-3xl p-6 sm:p-8 border border-emerald-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-emerald-950">
              Komitmen Perlindungan Pelapor (Whistleblower Guarantee)
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900/80 mt-1 leading-relaxed">
              Dewan Guru, Tenaga Kependidikan, dan Komite <strong>SD Negeri Manyaran 4</strong> menjamin:
            </p>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-emerald-900">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Bebas Diskriminasi Akademik:</strong> Penyampaian keluhan atau saran tidak akan berdampak negatif terhadap nilai, perlakuan guru, maupun kenyamanan siswa di kelas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hak Memilih Anonim:</strong> Jika memilih mode anonim, sistem tidak menyimpan IP, nama wali, maupun identitas anak.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Kerahasiaan Dokumen:</strong> Informasi kontak pelapor yang diisi hanya dapat dibuka oleh Tim Penanganan Khusus yang ditunjuk Kepala Sekolah.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Singkat */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
              Bagaimana jika saya lupa atau kehilangan Nomor Tiket Pengaduan?
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Pada perangkat HP/browser yang sama, sistem menyimpan riwayat tiket Anda di menu <em>"Lacak Tiket"</em>. Jika Anda menggunakan perangkat lain, Anda dapat menghubungi Operator TU SDN Manyaran 4 dengan menyebutkan perkiraan tanggal dan judul laporan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
              Apakah pengaduan masalah perundungan / bullying langsung ditangani?
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ya. Pengaduan kategori keamanan dan bullying berstatus darurat/tinggi akan langsung diteruskan kepada Tim Pencegahan dan Penanganan Kekerasan (TPPK) SDN Manyaran 4 dan wali kelas terkait dalam waktu kurang dari 6 jam.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
              Apakah orang tua murid dapat mengirim foto bukti sarana rusak?
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Sangat dianjurkan. Melampirkan foto sarana yang rusak (seperti plafon bocor, kran air patah, bangku rusak) akan mempercepat tim sarana prasarana sekolah mengalokasikan tukang dan bahan perbaikan.
            </p>
          </div>
        </div>
      </div>

      {/* Kontak Sekolah & Tim Layanan */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Hotline Layanan Langsung
            </span>
            <h3 className="text-xl font-bold mt-1">
              SD Negeri Manyaran 4 Banyakan Kediri
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Dusun Ngesong, Desa Manyaran, Kec. Banyakan, Kab. Kediri, Jawa Timur. 64157
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-300">
              <span>🕒 Jam Layanan Pengaduan: Senin – Sabtu, 07.00 – 14.30 WIB</span>
              <span>📧 Email: sdnegerimanyaran4@gmail.com</span>
            </div>
          </div>

          <a
            href="https://wa.me/6285655124828?text=Halo%20Admin%20Pengaduan%20SDN%20Manyaran%204%20Kediri"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Hotline WhatsApp Sekolah</span>
          </a>
        </div>
      </div>
    </div>
  );
};
