import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { mapToProperty } from '../services/api';

// ─── Formatters ───────────────────────────────────────────
const formatRupiah = (n) => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2)} M`;
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
};

// ─── KOMPONEN: Sidebar Nav ────────────────────────────────
function SideNav({ active, onNavigate, notifCount }) {
  const menus = [
    { id: 'dashboard', label: 'Dashboard',         icon: '' },
    { id: 'iklan',     label: 'Iklan Saya',        icon: '' },
    { id: 'tambah',    label: 'Tambah Properti',   icon: '' },
    { id: 'notif',     label: 'Notifikasi',        icon: '', badge: notifCount },
    { id: 'profil',    label: 'Profil Saya',       icon: '' },
  ];

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 p-4 flex-shrink-0">
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-2">Menu Utama</p>
      {menus.map(m => (
        <button
          key={m.id}
          onClick={() => onNavigate(m.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 transition-all text-left ${
            active === m.id
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
          }`}
        >
          <span>{m.icon}</span>
          <span className="flex-1">{m.label}</span>
          {m.badge > 0 && (
            <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {m.badge}
            </span>
          )}
        </button>
      ))}
      <hr className="my-3 border-gray-100" />
      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-50 transition-all">
        🚪 Keluar
      </button>
    </aside>
  );
}

// ─── KOMPONEN: Stat Card ──────────────────────────────────
function StatCard({ label, value, sub, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
      <p className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-red-400'}`}>
        {sub}
      </p>
    </div>
  );
}

// ─── KOMPONEN: Dashboard Home ─────────────────────────────
function DashboardHome({ iklanList, onNavigate }) {
  const stats = [
    { label: 'Total Iklan',   value: iklanList.length, sub: `↑ ${iklanList.filter(i => i.status === 'Aktif').length} aktif`, trend: 'up' },
    { label: 'Total Dilihat', value: '8.4K',   sub: '↑ 18% vs bulan lalu',   trend: 'up' },
    { label: 'Leads Masuk',   value: '34',     sub: '↑ 5 leads baru',         trend: 'up' },
    { label: 'Favorit',       value: '127',    sub: '↓ 3 minggu ini',         trend: 'down' },
  ];

  const chartBars = [
    { day: 'Sen', val: 920,  pct: 65 },
    { day: 'Sel', val: 1240, pct: 88 },
    { day: 'Rab', val: 870,  pct: 62 },
    { day: 'Kam', val: 1410, pct: 100, highlight: true },
    { day: 'Jum', val: 1180, pct: 84 },
    { day: 'Sab', val: 1350, pct: 96 },
    { day: 'Min', val: 1020, pct: 72 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Dashboard Saya</h1>
        <p className="text-sm text-gray-400">Ringkasan performa iklan Anda</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
        <h3 className="text-sm font-black text-gray-900 mb-5">Statistik Penayangan — 7 Hari Terakhir</h3>
        <div className="flex items-end gap-3 h-32">
          {chartBars.map(b => (
            <div key={b.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{b.val.toLocaleString()}</span>
              <div
                className={`w-full rounded-t-lg transition-all ${b.highlight ? 'bg-blue-700' : 'bg-blue-200'}`}
                style={{ height: `${b.pct}%` }}
              />
              <span className={`text-xs font-semibold ${b.highlight ? 'text-blue-700' : 'text-gray-400'}`}>
                {b.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Iklan Table (mini) */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900">Iklan Terbaru</h3>
          <button onClick={() => onNavigate('iklan')} className="text-xs text-blue-600 font-bold hover:underline">
            Lihat Semua →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Properti', 'Harga', 'Status', 'Dilihat'].map(h => (
                  <th key={h} className="text-left text-xs font-black text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {iklanList.slice(0, 4).map(p => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.gambar} alt="" className="w-10 h-8 rounded-lg object-cover"
                        onError={e => { e.target.src = `https://picsum.photos/seed/${p.id}/80/60`; }}
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900 truncate max-w-[160px]">{p.nama}</p>
                        <p className="text-xs text-gray-400">{p.tipe} · {p.status}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-black text-blue-700 whitespace-nowrap">
                    {formatRupiah(p.harga)}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                      p.status === 'Dijual' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {p.status === 'Dijual' ? 'Aktif' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-600">
                    {(Math.random() * 1000 + 100).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── KOMPONEN: Iklan Table ────────────────────────────────
function IklanSaya({ iklanList, onDelete, onNavigate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');

  const filtered = iklanList.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchTipe   = tipeFilter ? p.tipe === tipeFilter : true;
    return matchSearch && matchTipe;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Iklan Saya</h1>
          <p className="text-sm text-gray-400">{iklanList.length} total iklan</p>
        </div>
        <button
          onClick={() => onNavigate('tambah')}
          className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          + Tambah Properti
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none bg-white focus:border-blue-500"
        >
          <option value="">Semua Status</option>
          <option>Aktif</option>
          <option>Review</option>
          <option>Nonaktif</option>
        </select>
        <select
          value={tipeFilter}
          onChange={e => setTipeFilter(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none bg-white focus:border-blue-500"
        >
          <option value="">Semua Tipe</option>
          {['Rumah', 'Apartemen', 'Tanah', 'Ruko', 'Villa'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Cari iklan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] border-2 border-gray-200 rounded-xl px-4 py-2 text-sm outline-none bg-white focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Properti', 'Harga', 'Lokasi', 'Status', 'Dilihat', 'Leads', 'Aksi'].map(h => (
                  <th key={h} className="text-left text-xs font-black text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-2"></div>
                    <p className="font-semibold">Tidak ada iklan ditemukan</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const statusList = ['Aktif', 'Aktif', 'Review', 'Nonaktif'];
                  const status = statusList[idx % statusList.length];
                  return (
                    <tr key={p.id} className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.gambar} alt="" className="w-12 h-9 rounded-xl object-cover flex-shrink-0"
                            onError={e => { e.target.src = `https://picsum.photos/seed/${p.id + 5}/100/70`; }}
                          />
                          <div>
                            <p className="text-xs font-bold text-gray-900 max-w-[150px] truncate">{p.nama}</p>
                            <p className="text-xs text-gray-400">{p.tipe} · {p.status}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-black text-blue-700 whitespace-nowrap">
                        {formatRupiah(p.harga)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{p.lokasi}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                          status === 'Aktif'    ? 'bg-green-100 text-green-800' :
                          status === 'Review'   ? 'bg-amber-100 text-amber-800' :
                                                  'bg-red-100 text-red-800'
                        }`}>{status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {(Math.round(Math.random() * 1200 + 50)).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-emerald-600">
                        {Math.round(Math.random() * 15)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            to={`/properti/${p.id}`}
                            className="text-xs border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-500 px-2.5 py-1 rounded-lg transition-colors font-semibold"
                          >
                            👁 Lihat
                          </Link>
                          <button className="text-xs border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-500 px-2.5 py-1 rounded-lg transition-colors font-semibold">
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => onDelete(p.id)}
                            className="text-xs border border-red-200 hover:bg-red-50 text-red-400 px-2.5 py-1 rounded-lg transition-colors font-semibold"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── KOMPONEN: Form Multi-Step ────────────────────────────
function TambahProperti({ onSuccess }) {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  // State per step
  const [form, setForm] = useState({
    judul: '', tipe: '', jenis: '', harga: '', nego: 'tidak',
    provinsi: '', kota: '', alamat: '', deskripsi: '',
    luasTanah: '', luasBangunan: '', lantai: '2', kt: '3', km: '2',
    garasi: '2 mobil', sertifikat: 'SHM (Hak Milik)', kondisi: 'Sangat Baik',
    listrik: '2200 VA', air: 'PDAM',
    fasilitas: ['Garasi / Carport', 'AC Tiap Kamar', 'Taman', 'Water Heater', 'Internet/WiFi', 'Furnished'],
    paket: 'gratis',
    agree: false,
  });
  const [photos, setPhotos]       = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors]       = useState({});

  const FASILITAS_LIST = [
    'Garasi / Carport', 'AC Tiap Kamar', 'Kolam Renang', 'Taman',
    'Gudang', 'Water Heater', 'Internet/WiFi', 'CCTV',
    'Keamanan 24J', 'Gym/Fitness', 'Playground', 'Furnished',
  ];

  const update = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const toggleFasilitas = (item) => {
    setForm(prev => ({
      ...prev,
      fasilitas: prev.fasilitas.includes(item)
        ? prev.fasilitas.filter(f => f !== item)
        : [...prev.fasilitas, item],
    }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.judul.trim())   newErrors.judul = 'Judul wajib diisi';
      if (!form.tipe)           newErrors.tipe = 'Pilih tipe properti';
      if (!form.jenis)          newErrors.jenis = 'Pilih jenis penawaran';
      if (!form.harga)          newErrors.harga = 'Harga wajib diisi';
      if (!form.provinsi)       newErrors.provinsi = 'Pilih provinsi';
      if (!form.alamat.trim())  newErrors.alamat = 'Alamat wajib diisi';
      if (!form.deskripsi.trim()) newErrors.deskripsi = 'Deskripsi wajib diisi';
    }
    if (step === 3) {
      if (!form.agree) newErrors.agree = 'Anda harus menyetujui syarat & ketentuan';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else {
      setShowSuccess(true);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 8 - photos.length);
    const newPhotos = files.map(f => URL.createObjectURL(f));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const stepLabels = ['Informasi Dasar', 'Detail & Spesifikasi', 'Foto & Publikasi'];

  const Field = ({ label, required, error, children }) => (
    <div>
      <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
    </div>
  );

  const inputCls = (err) =>
    `w-full border-2 ${err ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:border-blue-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors`;

  return (
    <div className="relative">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Tambah Properti Baru</h1>
        <p className="text-sm text-gray-400">Isi informasi properti Anda dengan lengkap dan benar</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* Step Indicator */}
        <div className="flex items-center px-6 py-4 border-b border-gray-100 gap-2">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const isDone   = n < step;
            const isActive = n === step;
            return (
              <div key={n} className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-all ${
                  isDone   ? 'bg-blue-700 text-white' :
                  isActive ? 'border-2 border-blue-700 text-blue-700 bg-white' :
                             'border-2 border-gray-200 text-gray-300 bg-gray-50'
                }`}>
                  {isDone ? '✓' : n}
                </div>
                <span className={`text-xs font-bold truncate hidden sm:block ${isActive || isDone ? 'text-blue-700' : 'text-gray-400'}`}>
                  {label}
                </span>
                {i < 2 && (
                  <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all ${n < step ? 'bg-blue-700' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── STEP 1: Info Dasar ── */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100">🏠 Informasi Dasar</h3>

            <Field label="Judul Iklan" required error={errors.judul}>
              <input
                type="text"
                value={form.judul}
                onChange={e => update('judul', e.target.value)}
                placeholder="Contoh: Rumah Modern 2 Lantai BSD City Serpong"
                maxLength={100}
                className={inputCls(errors.judul)}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{form.judul.length} / 100</p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tipe Properti" required error={errors.tipe}>
                <select value={form.tipe} onChange={e => update('tipe', e.target.value)} className={inputCls(errors.tipe)}>
                  <option value="">-- Pilih tipe --</option>
                  {['Rumah', 'Apartemen', 'Tanah', 'Ruko', 'Villa', 'Gudang', 'Kos-kosan'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Jenis Penawaran" required error={errors.jenis}>
                <select value={form.jenis} onChange={e => update('jenis', e.target.value)} className={inputCls(errors.jenis)}>
                  <option value="">-- Pilih jenis --</option>
                  <option>Dijual</option>
                  <option>Disewakan</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Harga (Rp)" required error={errors.harga}>
                <input
                  type="number"
                  value={form.harga}
                  onChange={e => update('harga', e.target.value)}
                  placeholder="Contoh: 1250000000"
                  className={inputCls(errors.harga)}
                />
              </Field>
              <Field label="Dapat Dinegosiasi">
                <div className="flex gap-3 mt-1">
                  {['ya', 'tidak'].map(v => (
                    <label key={v} className={`flex items-center gap-2 border-2 px-4 py-2 rounded-xl cursor-pointer text-xs font-bold transition-all ${
                      form.nego === v ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-blue-300'
                    }`}>
                      <input type="radio" name="nego" value={v} checked={form.nego === v}
                        onChange={() => update('nego', v)} className="accent-blue-700" />
                      {v === 'ya' ? 'Ya, bisa nego' : 'Harga tetap'}
                    </label>
                  ))}
                </div>
              </Field>
            </div>

            <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 pt-2">📍 Lokasi</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Provinsi" required error={errors.provinsi}>
                <select value={form.provinsi} onChange={e => update('provinsi', e.target.value)} className={inputCls(errors.provinsi)}>
                  <option value="">-- Pilih provinsi --</option>
                  {['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten', 'Bali', 'DI Yogyakarta'].map(p => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Kota / Kabupaten">
                <input type="text" value={form.kota} onChange={e => update('kota', e.target.value)}
                  placeholder="Contoh: Tangerang Selatan" className={inputCls(false)} />
              </Field>
            </div>

            <Field label="Alamat Lengkap" required error={errors.alamat}>
              <input type="text" value={form.alamat} onChange={e => update('alamat', e.target.value)}
                placeholder="Contoh: Jl. Pahlawan Seribu No. 12, BSD City" className={inputCls(errors.alamat)} />
            </Field>

            <Field label="Deskripsi Properti" required error={errors.deskripsi}>
              <textarea
                value={form.deskripsi}
                onChange={e => update('deskripsi', e.target.value)}
                placeholder="Jelaskan keunggulan properti Anda secara detail..."
                maxLength={1000}
                rows={4}
                className={`${inputCls(errors.deskripsi)} resize-none`}
              />
              <p className="text-xs text-gray-400 text-right mt-1">{form.deskripsi.length} / 1000</p>
            </Field>
          </div>
        )}

        {/* ── STEP 2: Detail & Spek ── */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100">📐 Ukuran & Kamar</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Luas Tanah (m²)">
                <input type="number" value={form.luasTanah} onChange={e => update('luasTanah', e.target.value)}
                  placeholder="150" className={inputCls(false)} />
              </Field>
              <Field label="Luas Bangunan (m²)">
                <input type="number" value={form.luasBangunan} onChange={e => update('luasBangunan', e.target.value)}
                  placeholder="120" className={inputCls(false)} />
              </Field>
              <Field label="Jumlah Lantai">
                <select value={form.lantai} onChange={e => update('lantai', e.target.value)} className={inputCls(false)}>
                  {['1 Lantai','2 Lantai','3 Lantai','4+ Lantai'].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Kamar Tidur">
                <select value={form.kt} onChange={e => update('kt', e.target.value)} className={inputCls(false)}>
                  {['1','2','3','4','5','6+'].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Kamar Mandi">
                <select value={form.km} onChange={e => update('km', e.target.value)} className={inputCls(false)}>
                  {['1','2','3','4+'].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Garasi">
                <select value={form.garasi} onChange={e => update('garasi', e.target.value)} className={inputCls(false)}>
                  {['Tidak ada','1 mobil','2 mobil','3+ mobil'].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
            </div>

            <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 pt-2">📋 Legalitas & Kondisi</h3>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Sertifikat">
                <select value={form.sertifikat} onChange={e => update('sertifikat', e.target.value)} className={inputCls(false)}>
                  {['SHM (Hak Milik)','HGB','SHGB','Girik','AJB'].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Kondisi">
                <select value={form.kondisi} onChange={e => update('kondisi', e.target.value)} className={inputCls(false)}>
                  {['Baru','Sangat Baik','Baik','Butuh Renovasi'].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Daya Listrik">
                <select value={form.listrik} onChange={e => update('listrik', e.target.value)} className={inputCls(false)}>
                  {['900 VA','1300 VA','2200 VA','3500+ VA'].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Sumber Air">
                <select value={form.air} onChange={e => update('air', e.target.value)} className={inputCls(false)}>
                  {['PDAM','Sumur','PAM'].map(v=><option key={v}>{v}</option>)}
                </select>
              </Field>
            </div>

            <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 pt-2">✨ Fasilitas Tersedia</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FASILITAS_LIST.map(item => (
                <label key={item} className={`flex items-center gap-2 border-2 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-all ${
                  form.fasilitas.includes(item)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 bg-gray-50 hover:border-blue-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={form.fasilitas.includes(item)}
                    onChange={() => toggleFasilitas(item)}
                    className="accent-blue-700"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Foto & Publikasi ── */}
        {step === 3 && (
          <div className="p-6 space-y-5">
            <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100">📸 Upload Foto Properti</h3>

            {/* Drop Zone */}
            <label
              htmlFor="photo-upload"
              className="block border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50 hover:bg-blue-100 rounded-2xl p-8 text-center cursor-pointer transition-all"
            >
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm font-bold text-blue-700 mb-1">Klik untuk upload foto</p>
              <p className="text-xs text-gray-400">atau seret & lepas · JPG, PNG, WebP · Maks 5 MB · Min 3 foto</p>
              <input id="photo-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            {/* Photo Previews — Conditional Rendering */}
            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-blue-700 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                        Utama
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 pt-2">🎯 Pengaturan Tayang</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Paket Iklan">
                <select value={form.paket} onChange={e => update('paket', e.target.value)} className={inputCls(false)}>
                  <option value="gratis">Gratis — 7 hari, posisi standar</option>
                  <option value="basic">Basic — Rp 99.000 / 30 hari</option>
                  <option value="premium">Premium — Rp 299.000 / 30 hari (posisi atas)</option>
                </select>
              </Field>
              <Field label="Tanggal Mulai Tayang">
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className={inputCls(false)} />
              </Field>
            </div>

            {/* Ringkasan */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm space-y-1">
              <p className="font-black text-blue-800 mb-2">Ringkasan Iklan</p>
              {[
                ['Judul',    form.judul || '—'],
                ['Tipe',     form.tipe || '—'],
                ['Jenis',    form.jenis || '—'],
                ['Harga',    form.harga ? formatRupiah(Number(form.harga)) : '—'],
                ['Lokasi',   [form.provinsi, form.kota].filter(Boolean).join(', ') || '—'],
                ['Fasilitas', `${form.fasilitas.length} item dipilih`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 text-xs">
                  <span className="text-gray-400 w-24 flex-shrink-0">{k}:</span>
                  <span className="font-bold text-gray-800 truncate">{v}</span>
                </div>
              ))}
            </div>

            {/* Agreement */}
            <label className={`flex items-start gap-3 border-2 px-4 py-3 rounded-xl cursor-pointer transition-all ${
              errors.agree ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300'
            }`}>
              <input
                type="checkbox"
                checked={form.agree}
                onChange={e => update('agree', e.target.checked)}
                className="accent-blue-700 mt-0.5 flex-shrink-0"
              />
              <span className="text-xs text-gray-600">
                Saya menyatakan bahwa informasi yang diisi adalah benar dan menyetujui{' '}
                <a href="#" className="text-blue-600 font-bold hover:underline">Syarat & Ketentuan</a>{' '}
                PropertiNusantara.
              </span>
            </label>
            {errors.agree && <p className="text-xs text-red-500 font-semibold">{errors.agree}</p>}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-400 font-semibold">Langkah {step} dari {TOTAL_STEPS}</span>
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="border-2 border-gray-200 hover:border-gray-400 text-gray-500 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                ← Sebelumnya
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              {step === TOTAL_STEPS ? 'Publikasikan Iklan' : 'Selanjutnya →'}
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL — Conditional Rendering */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 rounded-2xl" style={{ minHeight: 400 }}>
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Iklan Berhasil Dikirim!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Iklan Anda sedang dalam proses review oleh tim kami. Biasanya selesai dalam 1×24 jam.
            </p>
            <button
              onClick={() => { setShowSuccess(false); onSuccess(); }}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Lihat Iklan Saya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── KOMPONEN: Notifikasi ─────────────────────────────────
function Notifikasi({ onRead }) {
  const notifs = [
    { icon: '', bg: 'bg-blue-50', border: 'border-blue-500', title: 'Pesan baru dari Budi Santoso', sub: 'Tertarik dengan Rumah Modern BSD City Anda.', time: '2 mnt lalu', unread: true },
    { icon: '', bg: 'bg-green-50', border: 'border-emerald-500', title: 'Iklan Anda telah disetujui', sub: 'Apartemen SCBD Studio kini aktif dan dapat dilihat publik.', time: '1 jam lalu', unread: true },
    { icon: '', bg: 'bg-amber-50', border: 'border-amber-500', title: 'Iklan hampir kadaluarsa', sub: 'Tanah Kavling Depok akan berakhir dalam 3 hari.', time: '5 jam lalu', unread: true },
    { icon: '', bg: 'bg-gray-50',  border: '', title: '12 orang menyimpan iklan Anda', sub: 'Rumah Modern BSD City mendapat 12 simpan baru.', time: 'Kemarin', unread: false },
    { icon: '', bg: 'bg-gray-50',  border: '', title: 'Laporan mingguan tersedia', sub: 'Iklan Anda dilihat 8.400 kali minggu ini, naik 18%.', time: '2 hari lalu', unread: false },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Notifikasi</h1>
          <p className="text-sm text-gray-400">{notifs.filter(n => n.unread).length} notifikasi belum dibaca</p>
        </div>
        <button onClick={onRead} className="text-xs text-blue-600 font-bold hover:underline">
          Tandai semua dibaca
        </button>
      </div>
      <div className="space-y-3">
        {notifs.map((n, i) => (
          <div key={i} className={`flex items-start gap-3 bg-white border ${n.border || 'border-gray-200'} ${n.border ? 'border-l-4' : ''} rounded-2xl p-4 transition-all hover:shadow-md`}>
            <div className={`w-10 h-10 ${n.bg} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>{n.icon}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm mb-0.5 ${n.unread ? 'font-black text-gray-900' : 'font-semibold text-gray-700'}`}>{n.title}</p>
              <p className="text-xs text-gray-400 truncate">{n.sub}</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{n.time}</span>
            {n.unread && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KOMPONEN: Profil ─────────────────────────────────────
function ProfilSaya() {
  const [profil, setProfil] = useState({
    nama: 'Ahmad Pratama', email: 'ahmad@email.com',
    wa: '+62 812-3456-7890', kota: 'Bandung, Jawa Barat',
    bio: 'Agen properti berpengalaman 7 tahun di wilayah Jabodetabek dan Bandung.',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Profil Saya</h1>
        <p className="text-sm text-gray-400">Kelola informasi akun Anda</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-2">
          <div className="relative w-20 h-20 rounded-full bg-blue-700 flex items-center justify-center text-white text-3xl font-black cursor-pointer group">
            AP
            <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl">
              
            </div>
          </div>
          <p className="mt-3 text-base font-black text-gray-900">{profil.nama}</p>
          <p className="text-xs text-gray-400"> Premier Agent · Bergabung sejak 2018</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['Nama Lengkap', 'nama', 'text'],
            ['Email', 'email', 'email'],
            ['No. WhatsApp', 'wa', 'text'],
            ['Kota Domisili', 'kota', 'text'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
              <input
                type={type}
                value={profil[key]}
                onChange={e => setProfil(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full border-2 border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">Bio Singkat</label>
          <textarea
            value={profil.bio}
            onChange={e => setProfil(prev => ({ ...prev, bio: e.target.value }))}
            rows={3}
            className="w-full border-2 border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
          >
            Simpan Perubahan
          </button>
          {saved && (
            <span className="text-sm text-emerald-600 font-bold animate-pulse">✓ Tersimpan!</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HALAMAN UTAMA DASHBOARD ──────────────────────────────
export default function DashboardPage() {
  const navigate    = useNavigate();
  const [section, setSection]     = useState('dashboard');
  const [iklanList, setIklanList] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [notifCount, setNotifCount] = useState(3);

  // useEffect: Ambil data dari API sebagai data iklan
  useEffect(() => {
    const fetchIklan = async () => {
      try {
        const res = await axios.get('https://dummyjson.com/products?limit=8');
        setIklanList(res.data.products.map(mapToProperty));
      } catch {
        // fallback kosong
      } finally {
        setLoading(false);
      }
    };
    fetchIklan();
  }, []);

  const handleDelete = (id) => {
    setIklanList(prev => prev.filter(p => p.id !== id));
  };

  const handleAddSuccess = () => {
    setSection('iklan');
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-semibold">Memuat dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideNav active={section} onNavigate={setSection} notifCount={notifCount} />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {section === 'dashboard' && (
          <DashboardHome iklanList={iklanList} onNavigate={setSection} />
        )}
        {section === 'iklan' && (
          <IklanSaya iklanList={iklanList} onDelete={handleDelete} onNavigate={setSection} />
        )}
        {section === 'tambah' && (
          <TambahProperti onSuccess={handleAddSuccess} />
        )}
        {section === 'notif' && (
          <Notifikasi onRead={() => setNotifCount(0)} />
        )}
        {section === 'profil' && (
          <ProfilSaya />
        )}
      </main>
    </div>
  );
}