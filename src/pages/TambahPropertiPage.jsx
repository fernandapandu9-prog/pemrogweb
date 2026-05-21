// src/pages/TambahPropertiPage.jsx
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ─── Konstanta ─────────────────────────────────────────────
const TIPE_PROPERTI = ['Rumah', 'Apartemen', 'Tanah', 'Ruko', 'Villa'];
const PROVINSI_LIST = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'Banten', 'Bali', 'DI Yogyakarta', 'Sumatera Utara',
  'Sulawesi Selatan', 'Kalimantan Timur',
];
const FASILITAS_LIST = [
  { icon: '🅿️', label: 'Garasi / Carport' },
  { icon: '❄️', label: 'AC Tiap Kamar' },
  { icon: '🏊', label: 'Kolam Renang' },
  { icon: '🌳', label: 'Taman' },
  { icon: '📦', label: 'Gudang' },
  { icon: '☀️', label: 'Water Heater' },
  { icon: '📡', label: 'Internet / WiFi' },
  { icon: '📷', label: 'CCTV' },
  { icon: '🔒', label: 'Keamanan 24 Jam' },
  { icon: '🏋️', label: 'Gym / Fitness' },
  { icon: '🛝', label: 'Playground' },
  { icon: '🛋️', label: 'Furnished' },
];
const PAKET_LIST = [
  {
    id: 'gratis',
    name: 'Gratis',
    price: 'Rp 0',
    desc: '7 hari tayang · Posisi standar · Maks 5 foto',
    badge: null,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 'Rp 99.000',
    desc: '30 hari tayang · Posisi tengah · Maks 15 foto',
    badge: null,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'Rp 299.000',
    desc: '30 hari · Posisi teratas · Foto unlimited · Label Featured',
    badge: '⭐ Terpopuler',
  },
];

// ─── Helpers ───────────────────────────────────────────────
const formatRp = (n) => {
  const num = parseInt(n, 10);
  if (!num) return '—';
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(2)} M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${num.toLocaleString('id-ID')}`;
};

// ─── Sub-komponen: Field Wrapper ───────────────────────────
function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] text-gray-400 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] text-red-500 font-semibold mt-1 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

// ─── Sub-komponen: Input Classes ───────────────────────────
const inputCls = (err) =>
  `w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 font-[inherit] ${
    err
      ? 'border-red-300 bg-red-50 focus:border-red-400'
      : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white'
  }`;

// ─── Sub-komponen: Step Indicator ─────────────────────────
function StepBar({ step }) {
  const steps = ['Informasi Dasar', 'Detail & Fasilitas', 'Foto & Publikasi'];
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 flex items-center">
      {steps.map((label, i) => {
        const n = i + 1;
        const isDone = n < step;
        const isActive = n === step;
        return (
          <div key={n} className="flex items-center flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Circle */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-all duration-300 ${
                  isDone
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-200'
                    : isActive
                    ? 'border-2 border-blue-700 text-blue-700 bg-white'
                    : 'border-2 border-gray-200 text-gray-300 bg-gray-50'
                }`}
              >
                {isDone ? '✓' : n}
              </div>
              {/* Labels */}
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Langkah {n}
                </p>
                <p
                  className={`text-xs font-black ${
                    isDone || isActive ? 'text-blue-700' : 'text-gray-300'
                  }`}
                >
                  {label}
                </p>
              </div>
            </div>
            {/* Connector */}
            {i < 2 && (
              <div
                className={`flex-1 h-0.5 mx-4 rounded-full transition-all duration-500 ${
                  n < step ? 'bg-blue-700' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Sub-komponen: Step 1 — Informasi Dasar ───────────────
function Step1({ form, update, errors }) {
  return (
    <div className="p-6 space-y-5">
      <h3 className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
        Informasi Dasar
      </h3>

      {/* Judul */}
      <Field label="Judul Iklan" required error={errors.judul}
        hint={`${form.judul.length} / 100 karakter`}>
        <input
          type="text"
          value={form.judul}
          onChange={(e) => update('judul', e.target.value)}
          maxLength={100}
          placeholder="Contoh: Rumah Modern 2 Lantai BSD City Serpong"
          className={inputCls(errors.judul)}
        />
      </Field>

      {/* Tipe & Jenis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Tipe Properti" required error={errors.tipe}>
          <select value={form.tipe} onChange={(e) => update('tipe', e.target.value)}
            className={inputCls(errors.tipe)}>
            <option value="">-- Pilih tipe --</option>
            {TIPE_PROPERTI.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Jenis Penawaran" required error={errors.jenis}>
          <select value={form.jenis} onChange={(e) => update('jenis', e.target.value)}
            className={inputCls(errors.jenis)}>
            <option value="">-- Pilih jenis --</option>
            <option>Dijual</option>
            <option>Disewakan</option>
          </select>
        </Field>
      </div>

      {/* Harga & Negosiasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Harga (Rp)" required error={errors.harga}>
          <input
            type="number" value={form.harga}
            onChange={(e) => update('harga', e.target.value)}
            placeholder="Contoh: 1250000000"
            className={inputCls(errors.harga)}
          />
        </Field>
        <Field label="Negosiasi Harga">
          <div className="flex gap-3 mt-1 flex-wrap">
            {[{ val: 'ya', label: 'Bisa Nego' }, { val: 'tidak', label: 'Harga Tetap' }].map((opt) => (
              <label
                key={opt.val}
                className={`flex items-center gap-2 border-2 px-4 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all ${
                  form.nego === opt.val
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:border-blue-300 bg-gray-50'
                }`}
              >
                <input type="radio" name="nego" value={opt.val}
                  checked={form.nego === opt.val}
                  onChange={() => update('nego', opt.val)}
                  className="accent-blue-700" />
                {opt.label}
              </label>
            ))}
          </div>
        </Field>
      </div>

      {/* Lokasi */}
      <h3 className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2 pt-2">
        Lokasi Properti
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Provinsi" required error={errors.provinsi}>
          <select value={form.provinsi} onChange={(e) => update('provinsi', e.target.value)}
            className={inputCls(errors.provinsi)}>
            <option value="">-- Pilih provinsi --</option>
            {PROVINSI_LIST.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Kota / Kabupaten" required error={errors.kota}>
          <input type="text" value={form.kota}
            onChange={(e) => update('kota', e.target.value)}
            placeholder="Contoh: Tangerang Selatan"
            className={inputCls(errors.kota)} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Kecamatan / Kelurahan">
          <input type="text" value={form.kecamatan}
            onChange={(e) => update('kecamatan', e.target.value)}
            placeholder="Contoh: Serpong"
            className={inputCls(false)} />
        </Field>
        <Field label="Kode Pos">
          <input type="text" value={form.kodePos}
            onChange={(e) => update('kodePos', e.target.value)}
            placeholder="Contoh: 15322"
            className={inputCls(false)} />
        </Field>
      </div>

      <Field label="Alamat Lengkap" required error={errors.alamat}>
        <input type="text" value={form.alamat}
          onChange={(e) => update('alamat', e.target.value)}
          placeholder="Contoh: Jl. Pahlawan Seribu No. 12, BSD City"
          className={inputCls(errors.alamat)} />
      </Field>

      <Field label="Deskripsi Properti" required error={errors.deskripsi}
        hint={`${form.deskripsi.length} / 1000 karakter`}>
        <textarea
          value={form.deskripsi}
          onChange={(e) => update('deskripsi', e.target.value)}
          maxLength={1000} rows={4}
          placeholder="Jelaskan keunggulan properti Anda secara lengkap dan menarik..."
          className={`${inputCls(errors.deskripsi)} resize-none`}
        />
      </Field>
    </div>
  );
}

// ─── Sub-komponen: Step 2 — Detail & Fasilitas ────────────
function Step2({ form, update }) {
  const toggleFasilitas = (item) => {
    update(
      'fasilitas',
      form.fasilitas.includes(item)
        ? form.fasilitas.filter((f) => f !== item)
        : [...form.fasilitas, item]
    );
  };

  return (
    <div className="p-6 space-y-5">
      <h3 className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100">
        Ukuran & Kamar
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Luas Tanah (m²)">
          <input type="number" value={form.luasTanah}
            onChange={(e) => update('luasTanah', e.target.value)}
            placeholder="150" className={inputCls(false)} />
        </Field>
        <Field label="Luas Bangunan (m²)">
          <input type="number" value={form.luasBangunan}
            onChange={(e) => update('luasBangunan', e.target.value)}
            placeholder="120" className={inputCls(false)} />
        </Field>
        <Field label="Jumlah Lantai">
          <select value={form.lantai} onChange={(e) => update('lantai', e.target.value)}
            className={inputCls(false)}>
            {['1 Lantai', '2 Lantai', '3 Lantai', '4+ Lantai'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Kamar Tidur">
          <select value={form.kt} onChange={(e) => update('kt', e.target.value)}
            className={inputCls(false)}>
            {['1', '2', '3', '4', '5', '6+'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Kamar Mandi">
          <select value={form.km} onChange={(e) => update('km', e.target.value)}
            className={inputCls(false)}>
            {['1', '2', '3', '4+'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Kapasitas Garasi">
          <select value={form.garasi} onChange={(e) => update('garasi', e.target.value)}
            className={inputCls(false)}>
            {['Tidak ada', '1 Mobil', '2 Mobil', '3+ Mobil'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </div>

      <h3 className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100 pt-2">
        Legalitas & Kondisi
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Sertifikat">
          <select value={form.sertifikat} onChange={(e) => update('sertifikat', e.target.value)}
            className={inputCls(false)}>
            {['SHM (Hak Milik)', 'HGB', 'SHGB', 'Girik', 'AJB'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Kondisi">
          <select value={form.kondisi} onChange={(e) => update('kondisi', e.target.value)}
            className={inputCls(false)}>
            {['Baru', 'Sangat Baik', 'Baik', 'Butuh Renovasi'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Daya Listrik">
          <select value={form.listrik} onChange={(e) => update('listrik', e.target.value)}
            className={inputCls(false)}>
            {['900 VA', '1300 VA', '2200 VA', '3500+ VA'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Sumber Air">
          <select value={form.air} onChange={(e) => update('air', e.target.value)}
            className={inputCls(false)}>
            {['PDAM', 'Sumur', 'PAM'].map((v) => <option key={v}>{v}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Hadap">
          <select value={form.hadap} onChange={(e) => update('hadap', e.target.value)}
            className={inputCls(false)}>
            {['Timur', 'Barat', 'Utara', 'Selatan'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
        <Field label="Tahun Dibangun">
          <input type="number" value={form.tahun}
            onChange={(e) => update('tahun', e.target.value)}
            placeholder="Contoh: 2020" className={inputCls(false)} />
        </Field>
      </div>

      {/* Fasilitas */}
      <h3 className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100 pt-2">
        Fasilitas Tersedia
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FASILITAS_LIST.map(({ icon, label }) => {
          const checked = form.fasilitas.includes(label);
          return (
            <label
              key={label}
              className={`flex items-center gap-2.5 border-2 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-all ${
                checked
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-500 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleFasilitas(label)}
                className="accent-blue-700 flex-shrink-0"
              />
              <span>{icon}</span>
              {label}
            </label>
          );
        })}
      </div>
      <p className="text-xs text-gray-400">
        {form.fasilitas.length} fasilitas dipilih
      </p>
    </div>
  );
}

// ─── Sub-komponen: Step 3 — Foto & Publikasi ──────────────
function Step3({ form, update, photos, setPhotos, errors }) {
  const fileRef = useRef();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files
      .slice(0, 12 - photos.length)
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = '';
  };

  const removePhoto = (i) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="p-6 space-y-5">
      {/* Upload */}
      <h3 className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100">
        Upload Foto Properti
      </h3>

      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50 hover:bg-blue-100 rounded-2xl p-10 text-center cursor-pointer transition-all group"
      >
        <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📷</div>
        <p className="text-sm font-bold text-blue-700 mb-1">Klik untuk memilih foto</p>
        <p className="text-xs text-gray-400">
          atau seret & lepas · JPG, PNG, WebP · Maks 5 MB per foto
        </p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {/* Preview Grid — Conditional Rendering */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-200 group bg-gray-100">
              <img
                src={photo.url} alt={photo.name}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Remove Button */}
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold"
              >
                ✕
              </button>
              {/* Main Badge */}
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 bg-blue-700 text-white text-[9px] px-1.5 py-0.5 rounded font-black">
                  UTAMA
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo count hint */}
      <p className={`text-xs font-semibold ${photos.length >= 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
        {photos.length === 0
          ? 'Belum ada foto — upload setidaknya 3 foto'
          : photos.length < 3
          ? `${photos.length} foto dipilih — tambah ${3 - photos.length} lagi`
          : `✓ ${photos.length} foto dipilih`}
      </p>

      {/* Paket */}
      <h3 className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100 pt-2">
        Pilih Paket Tayang
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PAKET_LIST.map((paket) => (
          <label
            key={paket.id}
            className={`relative border-2 rounded-2xl p-4 cursor-pointer transition-all block ${
              form.paket === paket.id
                ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-100'
                : 'border-gray-200 hover:border-blue-300 bg-white'
            }`}
          >
            {paket.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-[10px] font-black px-3 py-0.5 rounded-full whitespace-nowrap">
                {paket.badge}
              </span>
            )}
            <input
              type="radio" name="paket" value={paket.id}
              checked={form.paket === paket.id}
              onChange={() => update('paket', paket.id)}
              className="sr-only"
            />
            <p className="text-sm font-black text-gray-900 mb-1">{paket.name}</p>
            <p className="text-xl font-black text-blue-700 mb-2">{paket.price}</p>
            <p className="text-xs text-gray-500 leading-relaxed">{paket.desc}</p>
            {form.paket === paket.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Tanggal Tayang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Tanggal Mulai Tayang">
          <input type="date" value={form.tanggalTayang}
            onChange={(e) => update('tanggalTayang', e.target.value)}
            className={inputCls(false)} />
        </Field>
        <Field label="Kontak WhatsApp">
          <input type="tel" value={form.whatsapp}
            onChange={(e) => update('whatsapp', e.target.value)}
            placeholder="+62 812-xxxx-xxxx"
            className={inputCls(false)} />
        </Field>
      </div>

      {/* Ringkasan */}
      <h3 className="text-sm font-black text-gray-900 pb-3 border-b border-gray-100 pt-2">
        Ringkasan Iklan
      </h3>
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2">
        <p className="text-xs font-black text-blue-800 mb-3">Pratinjau Sebelum Tayang</p>
        {[
          ['Judul', form.judul || '—'],
          ['Tipe', form.tipe || '—'],
          ['Jenis', form.jenis || '—'],
          ['Harga', formatRp(form.harga)],
          ['Lokasi', [form.provinsi, form.kota].filter(Boolean).join(', ') || '—'],
          ['Foto', photos.length > 0 ? `${photos.length} foto siap upload` : 'Belum ada foto'],
          ['Paket', PAKET_LIST.find((p) => p.id === form.paket)?.name || '—'],
        ].map(([key, val]) => (
          <div key={key} className="flex gap-3 text-xs">
            <span className="text-gray-400 w-16 flex-shrink-0 font-semibold">{key}:</span>
            <span className="font-bold text-gray-800 truncate">{val}</span>
          </div>
        ))}
      </div>

      {/* Agreement */}
      <label
        className={`flex items-start gap-3 border-2 px-4 py-3.5 rounded-xl cursor-pointer transition-all ${
          errors.agree ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300 bg-gray-50'
        }`}
      >
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => update('agree', e.target.checked)}
          className="accent-blue-700 mt-0.5 flex-shrink-0 w-4 h-4"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          Saya menyatakan bahwa informasi yang diisi adalah{' '}
          <strong>benar dan akurat</strong>, serta menyetujui{' '}
          <a href="#" className="text-blue-600 font-bold hover:underline">
            Syarat & Ketentuan
          </a>{' '}
          dan{' '}
          <a href="#" className="text-blue-600 font-bold hover:underline">
            Kebijakan Privasi
          </a>{' '}
          PropertiNusantara.
        </span>
      </label>
      {errors.agree && (
        <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
          ⚠ {errors.agree}
        </p>
      )}
    </div>
  );
}

// ─── Sub-komponen: Success Modal ──────────────────────────
function SuccessModal({ onGoHome, onAddMore }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-10 text-center max-w-sm w-full shadow-2xl animate-bounce-in">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="text-xl font-black text-gray-900 mb-3">Iklan Berhasil Dikirim!</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-7">
          Iklan Anda sedang dalam proses review oleh tim kami.
          Biasanya selesai dalam <strong>1×24 jam</strong>.
          Kami akan notifikasi via email setelah iklan aktif.
        </p>
        <button
          onClick={onGoHome}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-2xl mb-3 transition-colors text-sm"
        >
          🏠 Kembali ke Beranda
        </button>
        <button
          onClick={onAddMore}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-2xl transition-colors text-sm"
        >
          + Tambah Properti Lain
        </button>
      </div>
    </div>
  );
}

// ─── DEFAULT STATE ─────────────────────────────────────────
const defaultForm = () => ({
  // Step 1
  judul: '', tipe: '', jenis: '', harga: '', nego: 'tidak',
  provinsi: '', kota: '', kecamatan: '', kodePos: '', alamat: '', deskripsi: '',
  // Step 2
  luasTanah: '', luasBangunan: '', lantai: '2 Lantai', kt: '3', km: '2',
  garasi: '2 Mobil', sertifikat: 'SHM (Hak Milik)', kondisi: 'Sangat Baik',
  listrik: '2200 VA', air: 'PDAM', hadap: 'Timur', tahun: '',
  fasilitas: ['Garasi / Carport', 'AC Tiap Kamar', 'Taman', 'Water Heater', 'Internet / WiFi'],
  // Step 3
  paket: 'gratis',
  tanggalTayang: new Date().toISOString().split('T')[0],
  whatsapp: '',
  agree: false,
});

// ─── HALAMAN UTAMA ─────────────────────────────────────────
export default function TambahPropertiPage() {
  const navigate = useNavigate();
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState(defaultForm());
  const [photos, setPhotos]       = useState([]);
  const [errors, setErrors]       = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Helper update satu field
  const update = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // Validasi per step
  const validate = (n) => {
    const newErrors = {};
    const req = (key, label) => {
      if (!form[key]?.toString().trim()) newErrors[key] = `${label} wajib diisi`;
    };
    if (n === 1) {
      req('judul', 'Judul');
      req('tipe', 'Tipe properti');
      req('jenis', 'Jenis penawaran');
      req('harga', 'Harga');
      req('provinsi', 'Provinsi');
      req('kota', 'Kota');
      req('alamat', 'Alamat');
      req('deskripsi', 'Deskripsi');
    }
    if (n === 3) {
      if (!form.agree) newErrors.agree = 'Anda harus menyetujui syarat & ketentuan';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate(step)) return;
    if (step < 3) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowSuccess(true);
    }
  };

  const handlePrev = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setShowSuccess(false);
    setStep(1);
    setForm(defaultForm());
    setPhotos([]);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link to="/" className="text-blue-600 hover:underline font-semibold">Beranda</Link>
          <span>›</span>
          <span className="text-gray-700 font-semibold">Tambah Properti</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-20">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Tambah Properti Baru</h1>
          <p className="text-sm text-gray-500">
            Isi data properti Anda dengan lengkap agar lebih mudah ditemukan calon pembeli/penyewa.
          </p>
        </div>

        {/* Step Indicator */}
        <StepBar step={step} />

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Step Content — Conditional Rendering */}
          {step === 1 && <Step1 form={form} update={update} errors={errors} />}
          {step === 2 && <Step2 form={form} update={update} />}
          {step === 3 && (
            <Step3
              form={form}
              update={update}
              photos={photos}
              setPhotos={setPhotos}
              errors={errors}
            />
          )}

          {/* Footer Navigation */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-400 font-semibold">
              Langkah {step} dari 3
            </span>
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={handlePrev}
                  className="border-2 border-gray-200 hover:border-gray-400 text-gray-500 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
                >
                  ← Sebelumnya
                </button>
              )}
              <button
                onClick={handleNext}
                className="bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-200"
              >
                {step === 3 ? 'Publikasikan Iklan' : 'Selanjutnya →'}
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Success Modal — Conditional Rendering */}
      {showSuccess && (
        <SuccessModal
          onGoHome={() => navigate('/')}
          onAddMore={handleReset}
        />
      )}
    </>
  );
}