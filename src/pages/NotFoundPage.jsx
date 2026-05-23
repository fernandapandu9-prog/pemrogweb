// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-7xl mb-6">🏚</div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">404 — Halaman Tidak Ditemukan</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-md">
        Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        Silakan kembali ke beranda dan coba lagi.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/"
          className="bg-blue-700 hover:bg-blue-800 text-white font-black px-8 py-3 rounded-2xl text-sm transition-all"
        >
          Kembali ke Beranda
        </Link>
        <Link
          to="/tambah-properti"
          className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-bold px-8 py-3 rounded-2xl text-sm transition-all"
        >
          + Tambah Properti
        </Link>
      </div>
    </main>
  );
}