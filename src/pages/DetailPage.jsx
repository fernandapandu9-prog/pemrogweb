import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { mapToProperty } from '../services/api';

// ─── Helpers ──────────────────────────────────────────────
const formatRupiah = (angka) => {
  if (angka >= 1_000_000_000) return `Rp ${(angka / 1_000_000_000).toFixed(2)} M`;
  if (angka >= 1_000_000) return `Rp ${(angka / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${angka.toLocaleString('id-ID')}`;
};

const KOTA_LIST = ['Jakarta', 'Surabaya', 'Bandung', 'Bali', 'Yogyakarta', 'Medan'];
const FASILITAS = [
  'Parkir Luas', ' Keamanan 24Jam', 'Kolam Renang',
  'Taman', 'Jogging Track', 'Internet Fiber',
  'AC Tiap Kamar', 'Bathtub', 'Water Heater',
];

// ─── Komponen KPR Kalkulator ───────────────────────────────
function KPRKalkulator({ harga }) {
  const [dp, setDp] = useState(20);
  const [tenor, setTenor] = useState(15);
  const [bunga, setBunga] = useState(9.5);

  const hargaJt = harga / 1_000_000;
  const pinjamanJt = hargaJt * (1 - dp / 100);
  const r = bunga / 100 / 12;
  const n = tenor * 12;
  const cicilan = (pinjamanJt * 1_000_000 * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
      <h3 className="text-sm font-black text-gray-900 mb-4">Simulasi KPR</h3>

      {/* DP Slider */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Uang Muka (DP)</span>
          <span className="font-bold text-gray-800">{dp}% — {formatRupiah(harga * dp / 100)}</span>
        </div>
        <input
          type="range" min="10" max="50" step="5" value={dp}
          onChange={e => setDp(Number(e.target.value))}
          className="w-full accent-blue-700"
        />
      </div>

      {/* Tenor Slider */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Tenor</span>
          <span className="font-bold text-gray-800">{tenor} tahun</span>
        </div>
        <input
          type="range" min="5" max="30" step="5" value={tenor}
          onChange={e => setTenor(Number(e.target.value))}
          className="w-full accent-blue-700"
        />
      </div>

      {/* Bunga Slider */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Suku Bunga</span>
          <span className="font-bold text-gray-800">{bunga}%/tahun</span>
        </div>
        <input
          type="range" min="7" max="14" step="0.5" value={bunga}
          onChange={e => setBunga(Number(e.target.value))}
          className="w-full accent-blue-700"
        />
      </div>

      {/* Hasil */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
        <p className="text-xs text-gray-500 mb-1">Estimasi Cicilan Per Bulan</p>
        <p className="text-2xl font-black text-blue-700">
          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cicilan)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Pinjaman pokok: {formatRupiah(pinjamanJt * 1_000_000)}
        </p>
      </div>
    </div>
  );
}

// ─── Komponen Agent Card ───────────────────────────────────
function AgentCard({ property }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nama: '', telp: '', pesan: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.telp) return;
    setSent(true);
    setForm({ nama: '', telp: '', pesan: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        
      {/* Agent Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-700 to-blue-400 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
          AP
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-gray-900">Ahmad Pratama</p>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">✓ Verified</span>
          </div>
          <p className="text-xs text-gray-400">Premier Agent</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <a
        href={`https://wa.me/6285879786269?text=Halo, saya tertarik dengan properti ${property?.nama}`}
        target="_blank" rel="noreferrer"
        className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-2 transition-colors"
      >
        <i class="ri-whatsapp-line text-xl"></i> WhatsApp Agen
      </a>
      <button className="w-full border-2 border-blue-700 text-blue-700 hover:bg-blue-50 text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 mb-4 transition-colors">
        <i class="ri-phone-fill text-xl"></i> Telepon Agen
      </button>

    </div>
  );
}

// ─── Galeri Foto ───────────────────────────────────────────
function Gallery({ gambar, nama }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const photos = [gambar, gambar, gambar, gambar, gambar]; // ganti dengan array foto asli

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 mb-4">
      {/* Main Photo */}
      <div className="relative">
        <img
          src={photos[activeIdx]} alt={nama}
          className="w-full h-72 md:h-96 object-cover"
          onError={e => { e.target.src = `https://picsum.photos/seed/${activeIdx + 10}/800/400`; }}
        />
        <span className="absolute top-3 left-3 bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide">
          Dijual
        </span>
        <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
          {activeIdx + 1} / {photos.length} foto
        </span>
      </div>
      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-1 p-1">
        {photos.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`h-16 rounded-lg overflow-hidden border-2 transition-all ${
              activeIdx === i ? 'border-blue-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-90'
            }`}
          >
            <img src={src} alt="" className="w-full h-full object-cover"
              onError={e => { e.target.src = `https://picsum.photos/seed/${i + 20}/200/100`; }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── HALAMAN UTAMA ─────────────────────────────────────────
export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fav, setFav] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // useEffect: Fetch data saat ID berubah
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const [detailRes, similarRes] = await Promise.all([
          axios.get(`https://dummyjson.com/products/${id}`),
          axios.get(`https://dummyjson.com/products?limit=4&skip=${Math.floor(Math.random() * 20)}`),
        ]);
        setProperty(mapToProperty(detailRes.data));
        setSimilar(similarRes.data.products.map(mapToProperty));
      } catch (err) {
        setError('Properti tidak ditemukan atau terjadi kesalahan.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // ── Loading State ──
  if (loading) return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-48 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
        <div className="space-y-4">
          <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-48 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    </main>
  );

  // ── Error State ──
  if (error) return (
    <main className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-6xl mb-4">😔</div>
      <h2 className="text-xl font-black text-gray-800 mb-2">Properti Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-6">{error}</p>
      <button onClick={() => navigate('/')} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
        ← Kembali ke Beranda
      </button>
    </main>
  );

  const spesifikasi = [
    ['Tipe Properti', property.tipe],
    ['Luas Tanah', `${property.luas + 30} m²`],
    ['Luas Bangunan', `${property.luas} m²`],
    ['Kamar Tidur', property.kamarTidur],
    ['Kamar Mandi', property.kamarMandi],
    ['Garasi', `${Math.max(1, property.kamarTidur - 2)} mobil`],
    ['Sertifikat', 'SHM'],
    ['Kondisi', 'Sangat Baik'],
    ['Daya Listrik', '2200 VA'],
    ['Sumber Air', 'PDAM'],
    ['Lantai', property.tipe === 'Apartemen' ? `Lt. ${property.id % 20 + 1}` : '2 Lantai'],
    ['Hadap', ['Timur', 'Barat', 'Utara', 'Selatan'][property.id % 4]],
  ];

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-gray-400 flex-wrap">
          <Link to="/" className="text-blue-600 hover:underline">Beranda</Link>
          <span>›</span>
          <Link to="/" className="text-blue-600 hover:underline">{property.tipe} Dijual</Link>
          <span>›</span>
          <Link to="/" className="text-blue-600 hover:underline">{property.lokasi}</Link>
          <span>›</span>
          <span className="text-gray-700 truncate max-w-[200px]">{property.nama}</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2">

            {/* Gallery */}
            <Gallery gambar={property.gambar} nama={property.nama} />

            {/* Info Utama */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                  property.status === 'Dijual' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {property.status}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-md">
                  {property.tipe}
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md">
                  🔥 Populer
                </span>
                <span className="ml-auto text-xs text-gray-400">Diperbarui 2 jam lalu</span>
              </div>

              <h1 className="text-2xl font-black text-gray-900 mb-2 leading-snug">{property.nama}</h1>
              <p className="text-sm text-gray-500 mb-4">📍 {property.lokasi}, Indonesia — dekat pusat kota</p>
              <p className="text-3xl font-black text-blue-700 mb-1">{formatRupiah(property.harga)}</p>
              <p className="text-xs text-gray-400 mb-5">Harga dapat dinegosiasi • KPR tersedia</p>

              {/* Fitur Utama */}
                {/* Top Cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">

                    <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <i className="ri-ruler-line"></i>
                        <span>Luas Unit</span>
                    </div>

                    <p className="text-gray-900 font-bold text-lg">
                        {property.luas} m²
                    </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <i className="ri-hotel-bed-line"></i>
                        <span>Kamar Tidur / Kamar Mandi</span>
                    </div>

                    <p className="text-gray-900 font-bold text-lg">
                        {property.kamarTidur} KT / {property.kamarMandi} KM
                    </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <i className="ri-sofa-line"></i>
                        <span>Tipe Property</span>
                    </div>

                    <p className="text-gray-900 font-bold text-lg">
                      {
                        [
                          'Furnished',
                          'Semi-Furnished',
                          'Unfurnished',
                          'Full Furnished',
                          'Basic Furnished',
                          'Luxury Furnished',
                          'Ready To Move',
                          'Minimalist Interior'
                        ][property.id % 8]
                      }
                    </p>
                    </div>

                </div>
            </div>

            {/* Deskripsi */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              <h2 className="text-base font-black text-gray-900 mb-3">Deskripsi Properti</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {property.deskripsi}
              </p>
              {/* Conditional Rendering: show more */}
              {showFullDesc && (
                <p className="text-sm text-gray-600 leading-relaxed mt-3">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                  Esse quibusdam nobis obcaecati molestias, rem ratione. 
                  Animi tenetur assumenda placeat exercitationem aperiam 
                  facilis ex nemo recusandae, error, nobis unde rerum. Odit, quasi aut. Excepturi qui ipsa porro, et deleniti molestiae possimus unde sit ratione, adipisci laudantium fugit eum, perferendis vel ducimus exercitationem tenetur fuga soluta quos! Neque natus dolore, quia voluptatem deleniti alias necessitatibus eum voluptatum, distinctio laboriosam cupiditate quod sit ipsam sunt dolorum, ipsa tenetur consequuntur porro? Laborum voluptatum sint officia odio quam ullam nisi ipsum molestias consequatur consequuntur et ut nam dolore, sunt amet illum nesciunt? Voluptatem, neque.
                </p>
              )}
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-3 text-blue-600 text-sm font-bold hover:underline"
              >
                {showFullDesc ? '▲ Sembunyikan' : '▼ Selengkapnya'}
              </button>
            </section>

            {/* Spesifikasi */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              <h2 className="text-base font-black text-gray-900 mb-4">Spesifikasi Lengkap</h2>
              <div className="grid grid-cols-2 gap-x-6">
                {spesifikasi.map(([label, val]) => (
                  <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-50 text-sm">
                    <span className="text-gray-400 font-medium">{label}</span>
                    <span className="text-gray-900 font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Fasilitas */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              <h2 className="text-base font-black text-gray-900 mb-4">Fasilitas</h2>
              <div className="grid grid-cols-3 gap-2">
                {FASILITAS.map(f => (
                  <div key={f} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-600">
                    {f}
                  </div>
                ))}
              </div>
            </section>

            {/* Lokasi */}
            <section className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
              <h2 className="text-base font-black text-gray-900 mb-2"> <i class="ri-map-pin-2-line text-xl"></i> Lokasi & Peta</h2>
              <p className="text-xs text-gray-500 mb-3">
                {property.lokasi}, Indonesia — Kawasan Strategis
              </p>
              {/* Map placeholder — ganti dengan Google Maps embed */}
              <div className="w-full h-52 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border border-blue-200 text-4xl mb-3">
                🗺️
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Sekolah', 'SMA Negeri 1 — 1,2 km'],
                  ['Mall', 'Grand Mall — 2,5 km'],
                  ['RS', 'RS Umum — 3 km'],
                  ['Toll', 'Pintu Toll — 5 menit'],
                ].map(([label, val]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-sm">
                    <strong className="block text-gray-800 mb-1">{label}</strong>
                    <span className="text-gray-500 text-xs">{val}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Agent Card */}
              <AgentCard property={property} />

              {/* KPR Kalkulator */}
              <KPRKalkulator harga={property.harga} />
            </div>
          </div>

        </div>
      </main>
    </>
  );
}