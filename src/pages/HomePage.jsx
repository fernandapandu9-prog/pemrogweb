import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { mapToProperty } from '../services/api';

const KATEGORI = [
  { icon: '🏠', label: 'Rumah', count: '28.400', color: 'bg-blue-50', tipe: 'Rumah' },
  { icon: '🏢', label: 'Apartemen', count: '12.800', color: 'bg-green-50', tipe: 'Apartemen' },
  { icon: '🌍', label: 'Tanah', count: '7.200', color: 'bg-yellow-50', tipe: 'Tanah' },
  { icon: '🏪', label: 'Ruko', count: '4.100', color: 'bg-pink-50', tipe: 'Ruko' },
];

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [tipeFilter, setTipeFilter] = useState('');
  const [tabMode, setTabMode] = useState('Semua');
  const [hargaMin, setHargaMin] = useState('');
  const [hargaMax, setHargaMax] = useState('');
  const LIMIT = 10;

  const fetchData = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const skip = reset ? 0 : page * LIMIT;
      const res = await axios.get(`https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`);
      const mapped = res.data.products.map(mapToProperty);
      setProperties(prev => reset ? mapped : [...prev, ...mapped]);
      setHasMore(res.data.total > (skip + LIMIT));
      if (!reset) setPage(p => p + 1);
    } catch (err) {
      setError('Gagal memuat data properti. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

 const filtered = properties.filter(p => {
  const matchSearch = search
    ? p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.lokasi.toLowerCase().includes(search.toLowerCase())
    : true;

  const matchTipe = tipeFilter ? p.tipe === tipeFilter : true;

  const matchMin = hargaMin 
    ? p.harga >= Number(hargaMin) * 1_000_000 
    : true;
    
  const matchMax = hargaMax 
    ? p.harga <= Number(hargaMax) * 1_000_000 
    : true;

  // filter status kalau tab Sewa atau Beli dipilih
  // Tab 'KPR' dan default tidak memfilter status
  const matchMode = 
    tabMode === 'Sewa' ? p.status === 'Disewa' :
    tabMode === 'Beli' ? p.status === 'Dijual' :
    true; // ← KPR atau tab lain = tampilkan semua

  return matchSearch && matchTipe && matchMin && matchMax && matchMode;
});


  

  return (
    <>
      {/* HERO */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 pt-16 pb-0 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-5 uppercase">
            Platform Properti #1 Indonesia
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Temukan Rumah <span className="text-amber-400">Impian</span> Anda
          </h1>
          

        </div>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-t-2xl max-w-5xl mx-auto px-6 pt-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-5">
         {/* Tab buttons */}
              {['Semua', 'Beli', 'Sewa'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTabMode(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                    tabMode === tab
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
          </div>
          {/* Form */}
          <form className="grid grid-cols-1 md:grid-cols-5 gap-3 pb-6" onSubmit={e => e.preventDefault()}>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Cari Lokasi</label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Ketik lokasi ..."
                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-gray-50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tipe Properti</label>
              <select
                value={tipeFilter}
                onChange={e => setTipeFilter(e.target.value)}
                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-gray-50 transition-colors"
              >
                <option value="">Semua Tipe</option>
                {['Rumah', 'Apartemen', 'Tanah', 'Ruko', 'Villa'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Harga Min (Jt)</label>
              <input
                type="number"
                min="0"
                value={hargaMin}
                onChange={e => setHargaMin(e.target.value)}
                placeholder="Min..."
                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-gray-50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Harga Maks (Jt)</label>
              <input
                type="number"
                min="0"
                value={hargaMax}
                onChange={e => setHargaMax(e.target.value)}
                placeholder="Maks..."
                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-gray-50 transition-colors"
              />
            </div>
            <div className="md:col-span-5 flex justify-end">
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <i className="ri-search-line text-xl"> Cari</i>
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-12">

        {/* Kategori */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-gray-800 mb-1">Kategori Properti</h2>
          <p className="text-sm text-gray-500 mb-6">Pilih kategori sesuai kebutuhan Anda</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {KATEGORI.map(k => (
              <button
                key={k.label}
                onClick={() => setTipeFilter(k.tipe === tipeFilter ? '' : k.tipe)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 ${
                  tipeFilter === k.tipe ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className={`w-12 h-12 ${k.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {k.icon}
                </div>
                <div>
                  <strong className="text-sm font-bold text-gray-800 block">{k.label}</strong>
                  <span className="text-xs text-gray-500">{k.count} listing</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Properti Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-800">Properti Unggulan</h2>
              <p className="text-sm text-gray-500">
                {loading && properties.length === 0 ? 'Memuat...' : `${filtered.length} properti ditemukan`}
              </p>
            </div>
            <Link to="/semua" className="text-sm text-blue-700 font-bold hover:underline">
              Lihat Semua →
            </Link>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
              <p className="text-red-600 font-semibold">{error}</p>
              <button onClick={() => fetchData(true)} className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition">
                Coba Lagi
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && properties.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                  <div className="h-52 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 animate-pulse rounded w-2/3" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏚</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">Properti tidak ditemukan</h3>
              <p className="text-sm text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
              <button onClick={() => { setSearch(''); setTipeFilter(''); setHargaMin(''); setHargaMax(''); }}
                className="mt-4 bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-800 transition">
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}

          {/* Load More */}
          {!loading && hasMore && filtered.length > 0 && (
            <div className="text-center mt-10">
              <button
                onClick={() => fetchData()}
                disabled={loading}
                className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold px-10 py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? 'Memuat...' : 'Muat Lebih Banyak ↓'}
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}