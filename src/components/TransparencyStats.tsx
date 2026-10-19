import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';
import {
  ReportTicket,
  ReportCategory,
  CATEGORIES_CONFIG,
  STATUS_CONFIG,
} from '../types/report';
import { getAllReports } from '../services/reportStorage';

export const TransparencyStats: React.FC = () => {
  const reports = getAllReports();

  const total = reports.length;
  const resolved = reports.filter((r) => r.status === 'selesai').length;
  const inProgress = reports.filter((r) => r.status === 'diproses' || r.status === 'ditinjau').length;
  const pending = reports.filter((r) => r.status === 'menunggu').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category counts
  const categoryCounts: Record<ReportCategory, number> = {
    sarpras: 0,
    guru_pembelajaran: 0,
    bullying_keamanan: 0,
    keuangan_pip: 0,
    kantin_kebersihan: 0,
    layanan_administrasi: 0,
    saran_inovasi: 0,
  };

  reports.forEach((r) => {
    if (categoryCounts[r.category] !== undefined) {
      categoryCounts[r.category]++;
    }
  });

  // Calculate average rating
  const ratings = reports
    .map((r) => r.feedbackRating?.stars)
    .filter((s): s is number => typeof s === 'number');

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : '5.0';

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Portal Transparansi Publik & Akuntabilitas Sekolah
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Statistik penanganan aspirasi orang tua murid SD Negeri Manyaran 4 Banyakan Kediri
            </p>
          </div>
        </div>

        {/* Big Key Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Tingkat Tuntas
            </span>
            <div className="text-3xl font-black text-emerald-900 mt-1">
              {resolutionRate}%
            </div>
            <span className="text-[10px] text-emerald-700 mt-0.5 block">
              {resolved} dari {total} aduan teratasi
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
              Waktu Tanggap Awal
            </span>
            <div className="text-3xl font-black text-blue-900 mt-1">
              &lt; 24 Jam
            </div>
            <span className="text-[10px] text-blue-700 mt-0.5 block">
              Sesuai standar mutu dinas
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Kepuasan Wali Murid
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-3xl font-black text-amber-900">{averageRating}</span>
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[10px] text-amber-700 mt-0.5 block">
              Berdasarkan ulasan tuntas
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Mode Anonim
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {reports.filter((r) => r.isAnonymous).length}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Aspirasi terjaga 100% rahasia
            </span>
          </div>
        </div>
      </div>

      {/* Distribution by Category */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-4 flex items-center justify-between">
          <span>Distribusi Kategori Aspirasi & Keluhan</span>
          <span className="text-xs text-slate-400 font-normal">Per Kategori</span>
        </h3>

        <div className="space-y-3.5">
          {(Object.keys(categoryCounts) as ReportCategory[]).map((catKey) => {
            const count = categoryCounts[catKey];
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            const meta = CATEGORIES_CONFIG[catKey];

            return (
              <div key={catKey} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{meta.label}</span>
                  <span className="text-slate-500 font-medium">
                    {count} laporan ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Komitmen Kepala Sekolah */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <Award className="w-10 h-10 text-amber-300 shrink-0 mt-1" />
        <div>
          <h4 className="font-extrabold text-base text-white">
            Maklumat Pelayanan SD Negeri Manyaran 4
          </h4>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed italic">
            "Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan pengaduan dan aspirasi masyarakat sesuai standar yang telah ditetapkan, serta siap menerima sanksi sesuai perundang-undangan apabila tidak menepati janji pelayanan ini."
          </p>
          <div className="mt-3 text-xs text-emerald-200 font-semibold">
            BITI AFRONI, S.Pd. SD — Kepala SD Negeri Manyaran 4 Kediri
          </div>
        </div>
      </div>
    </div>
  );
};
