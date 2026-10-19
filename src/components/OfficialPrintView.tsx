import React from 'react';
import { Printer, ArrowLeft, Building2 } from 'lucide-react';
import {
  ReportTicket,
  STATUS_CONFIG,
  CATEGORIES_CONFIG,
  URGENCY_CONFIG,
} from '../types/report';

interface OfficialPrintViewProps {
  type: 'single' | 'recap';
  ticket?: ReportTicket;
  reports?: ReportTicket[];
  onClose: () => void;
}

export const OfficialPrintView: React.FC<OfficialPrintViewProps> = ({
  type,
  ticket,
  reports = [],
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:p-0 print:bg-white text-slate-900">
      {/* Top action toolbar (hidden on actual print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Aplikasi</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Dokumen Sekarang (PDF / Print)</span>
        </button>
      </div>

      {/* Sheet Canvas (Simulates A4 paper) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 shadow-lg border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif">
        {/* Official Letterhead (KOP SURAT DINAS PENDIDIKAN KABUPATEN KEDIRI) */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center relative">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center font-sans font-bold text-xs uppercase p-1 shrink-0">
              <Building2 className="w-8 h-8 text-slate-800" />
            </div>

            <div className="text-center font-sans">
              <h4 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-800">
                PEMERINTAH KABUPATEN KEDIRI
              </h4>
              <h3 className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-slate-900">
                DINAS PENDIDIKAN
              </h3>
              <h2 className="text-lg sm:text-2xl font-black tracking-wide uppercase text-slate-950">
                SD NEGERI MANYARAN 4 KECAMATAN BANYAKAN
              </h2>
              <p className="text-[11px] text-slate-600 font-normal">
                Alamat: Dusun Ngesong, Desa Manyaran, Kec. Banyakan, Kab. Kediri, Jawa Timur. 64157
              </p>
              <p className="text-[10px] text-slate-500 font-normal">
                NPSN: 20511832 • Surel: sdnegerimanyaran4@gmail.com • Laman: sdnmanyaran4.sch.id
              </p>
            </div>
          </div>
        </div>

        {/* Content for Single Ticket Disposition */}
        {type === 'single' && ticket && (
          <div className="space-y-6 font-sans">
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-black uppercase underline tracking-wider text-slate-900">
                LEMBAR DISPOSISI & PENANGANAN PENGADUAN
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-mono">
                NOMOR REGISTRASI: <strong>{ticket.id}</strong>
              </p>
            </div>

            {/* Metadata Table */}
            <table className="w-full border-collapse border border-slate-400 text-xs">
              <tbody>
                <tr>
                  <td className="w-40 p-2.5 font-bold bg-slate-50 border border-slate-400">
                    Tanggal Diterima
                  </td>
                  <td className="p-2.5 border border-slate-400">
                    {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="w-32 p-2.5 font-bold bg-slate-50 border border-slate-400">
                    Tingkat Urgensi
                  </td>
                  <td className="p-2.5 border border-slate-400 uppercase font-bold text-slate-900">
                    {URGENCY_CONFIG[ticket.urgency].label}
                  </td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold bg-slate-50 border border-slate-400">
                    Kategori Laporan
                  </td>
                  <td className="p-2.5 border border-slate-400">
                    {CATEGORIES_CONFIG[ticket.category].label}
                  </td>
                  <td className="p-2.5 font-bold bg-slate-50 border border-slate-400">
                    Status Akhir
                  </td>
                  <td className="p-2.5 border border-slate-400 font-bold uppercase">
                    {STATUS_CONFIG[ticket.status].label}
                  </td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold bg-slate-50 border border-slate-400">
                    Identitas Pelapor
                  </td>
                  <td colSpan={3} className="p-2.5 border border-slate-400">
                    {ticket.isAnonymous ? (
                      <span className="italic font-semibold text-slate-700">
                        ANONIM (Identitas 100% Dilindungi Berdasarkan Kebijakan Whistleblower Permendikbudristek No. 46/2023)
                      </span>
                    ) : (
                      <span>
                        <strong>{ticket.reporterInfo?.parentName}</strong> ({ticket.reporterInfo?.relationship} dari siswa {ticket.reporterInfo?.studentName || '-'}, {ticket.reporterInfo?.studentGrade}) • Telp: {ticket.reporterInfo?.phone}
                      </span>
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="p-2.5 font-bold bg-slate-50 border border-slate-400">
                    Lokasi / Objek Kejadian
                  </td>
                  <td colSpan={3} className="p-2.5 border border-slate-400">
                    {ticket.location || 'Lingkungan SDN Manyaran 4 Banyakan'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Pokok Pengaduan */}
            <div className="border border-slate-400 p-4 rounded-xs">
              <span className="font-bold text-xs uppercase tracking-wider block mb-1 text-slate-800">
                A. Pokok Aspirasi / Masalah:
              </span>
              <h4 className="font-bold text-sm text-slate-950 mb-2">
                {ticket.title}
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line text-justify">
                {ticket.content}
              </p>
            </div>

            {/* Tindak Lanjut & Tanggapan Resmi */}
            <div className="border border-slate-400 p-4 rounded-xs">
              <span className="font-bold text-xs uppercase tracking-wider block mb-2 text-slate-800">
                B. Catatan Tindak Lanjut & Tanggapan Resmi Sekolah:
              </span>
              {ticket.officialResponses.length === 0 ? (
                <p className="text-xs italic text-slate-500">
                  Belum ada tanggapan resmi tersurat. Dalam antrean investigasi tim penanganan.
                </p>
              ) : (
                <div className="space-y-3">
                  {ticket.officialResponses.map((resp, i) => (
                    <div key={i} className="text-xs border-b border-slate-200 pb-2 last:border-none">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                        <span>{resp.authorName} ({resp.authorRole})</span>
                        <span className="font-normal text-slate-500 font-mono text-[11px]">
                          {new Date(resp.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed text-justify">
                        {resp.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disposisi Penugasan */}
            <div className="border border-slate-400 p-4 rounded-xs">
              <span className="font-bold text-xs uppercase tracking-wider block mb-1 text-slate-800">
                C. Penanggung Jawab Lapangan:
              </span>
              <p className="text-xs font-semibold text-slate-900">
                {ticket.assignedTo || 'Tim Layanan Terpadu SDN Manyaran 4'}
              </p>
            </div>

            {/* Tanda Tangan Resmi */}
            <div className="pt-8 grid grid-cols-2 text-center text-xs text-slate-900">
              <div>
                <p className="font-normal">Mengetahui,</p>
                <p className="font-bold">Ketua Komite Sekolah</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">TIMOTIUS SURATNO</p>
              </div>

              <div>
                <p className="font-normal">Manyaran, {today}</p>
                <p className="font-bold">Kepala SD Negeri Manyaran 4</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">BITI AFRONI, S.Pd. SD</p>
                <p className="text-[11px]">NIP. 19850803 201101 2 018</p>
              </div>
            </div>
          </div>
        )}

        {/* Content for Recap Table */}
        {type === 'recap' && (
          <div className="space-y-6 font-sans">
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-black uppercase underline tracking-wider text-slate-900">
                REKAPITULASI PELAYANAN PENGADUAN & ASPIRASI MASYARAKAT
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Tahun Ajaran 2025/2026 • SD Negeri Manyaran 4 Kecamatan Banyakan Kabupaten Kediri
              </p>
            </div>

            {/* Summary statistics */}
            <div className="flex justify-between text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-300">
              <span>Total Laporan: {reports.length}</span>
              <span>Selesai: {reports.filter((r) => r.status === 'selesai').length}</span>
              <span>Dalam Proses: {reports.filter((r) => r.status === 'diproses' || r.status === 'ditinjau').length}</span>
              <span>Menunggu: {reports.filter((r) => r.status === 'menunggu').length}</span>
            </div>

            <table className="w-full border-collapse border border-slate-400 text-[11px]">
              <thead>
                <tr className="bg-slate-100 border border-slate-400 text-slate-800 uppercase font-bold text-center">
                  <th className="p-2 border border-slate-400 w-8">No</th>
                  <th className="p-2 border border-slate-400 w-24">Kode Tiket</th>
                  <th className="p-2 border border-slate-400 w-24">Tanggal</th>
                  <th className="p-2 border border-slate-400">Pokok Masalah</th>
                  <th className="p-2 border border-slate-400 w-24">Kategori</th>
                  <th className="p-2 border border-slate-400 w-20">Pelapor</th>
                  <th className="p-2 border border-slate-400 w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((item, idx) => (
                  <tr key={item.id} className="border border-slate-400">
                    <td className="p-1.5 border border-slate-400 text-center">{idx + 1}</td>
                    <td className="p-1.5 border border-slate-400 font-mono font-bold text-center">{item.id}</td>
                    <td className="p-1.5 border border-slate-400 text-center">
                      {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-1.5 border border-slate-400">
                      <div className="font-bold">{item.title}</div>
                      <div className="text-[10px] text-slate-600 line-clamp-1">{item.content}</div>
                    </td>
                    <td className="p-1.5 border border-slate-400 text-center">
                      {CATEGORIES_CONFIG[item.category].label}
                    </td>
                    <td className="p-1.5 border border-slate-400 text-center">
                      {item.isAnonymous ? 'Anonim' : item.reporterInfo?.parentName}
                    </td>
                    <td className="p-1.5 border border-slate-400 text-center font-bold uppercase">
                      {STATUS_CONFIG[item.status].label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Block */}
            <div className="pt-8 grid grid-cols-2 text-center text-xs text-slate-900">
              <div>
                <p className="font-normal">Mengetahui,</p>
                <p className="font-bold">Ketua Komite Sekolah</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">TIMOTIUS SURATNO</p>
              </div>

              <div>
                <p className="font-normal">Manyaran, {today}</p>
                <p className="font-bold">Kepala SD Negeri Manyaran 4</p>
                <div className="h-20" />
                <p className="font-bold underline uppercase">BITI AFRONI, S.Pd. SD</p>
                <p className="text-[11px]">NIP. 19850803 201101 2 018</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
