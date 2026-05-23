// src/context/PropertyContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const PropertyContext = createContext();

// Key untuk localStorage
const STORAGE_KEY = 'properti_nusantara_listings';

export function PropertyProvider({ children }) {

  // Ambil data dari localStorage saat pertama load
  const [userProperties, setUserProperties] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Simpan ke localStorage setiap kali userProperties berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userProperties));
  }, [userProperties]);

  // ─── Tambah properti baru dari form TambahPropertiPage ──
  const addProperty = (formData, photos = []) => {
    const newProperty = {
      id: `user_${Date.now()}`,

      // Data dari form
      nama:        formData.judul        || 'Properti Tanpa Judul',
      deskripsi:   formData.deskripsi    || '',
      harga:       Number(formData.harga) || 0,
      lokasi:      formData.kota         || formData.provinsi || 'Indonesia',
      tipe:        formData.tipe         || 'Rumah',
      status:      formData.jenis === 'Disewakan' ? 'Disewa' : 'Dijual',

      // Foto: pakai foto pertama yang diupload, fallback ke Unsplash
      gambar: photos.length > 0
        ? photos[0].url
        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80',

      // Detail kamar & ukuran
      kamarTidur:  Number(formData.kt)           || 0,
      kamarMandi:  Number(formData.km)           || 0,
      luas:        Number(formData.luasBangunan) || 0,
      luasTanah:   Number(formData.luasTanah)    || 0,
      garasi:      formData.garasi               || 'Tidak ada',

      // Info tambahan
      fasilitas:   formData.fasilitas    || [],
      sertifikat:  formData.sertifikat   || 'SHM (Hak Milik)',
      kondisi:     formData.kondisi      || 'Baik',
      listrik:     formData.listrik      || '',
      air:         formData.air          || '',
      hadap:       formData.hadap        || '',
      tahun:       formData.tahun        || '',
      provinsi:    formData.provinsi     || '',
      alamat:      formData.alamat       || '',
      nego:        formData.nego         || 'tidak',
      whatsapp:    formData.whatsapp     || '',
      paket:       formData.paket        || 'gratis',

      // Metadata
      rating:         5.0,
      favorite:       false,
      isUserListing:  true,                        // penanda iklan dari user
      createdAt:      new Date().toISOString(),
    };

    // Tambahkan di paling depan agar muncul pertama di katalog
    setUserProperties(prev => [newProperty, ...prev]);
    return newProperty;
  };

  // ─── Hapus properti berdasarkan ID ──────────────────────
  const deleteProperty = (id) => {
    setUserProperties(prev => prev.filter(p => p.id !== id));
  };

  // ─── Update properti ────────────────────────────────────
  const updateProperty = (id, updatedData) => {
    setUserProperties(prev =>
      prev.map(p => p.id === id ? { ...p, ...updatedData } : p)
    );
  };

  // ─── Toggle favorit ─────────────────────────────────────
  const toggleFavorite = (id) => {
    setUserProperties(prev =>
      prev.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p)
    );
  };

  // ─── Reset semua data user (untuk testing) ──────────────
  const clearAll = () => {
    setUserProperties([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PropertyContext.Provider
      value={{
        userProperties,
        addProperty,
        deleteProperty,
        updateProperty,
        toggleFavorite,
        clearAll,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

// ─── Custom hook ────────────────────────────────────────────
export const useProperty = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperty harus dipakai di dalam PropertyProvider');
  return ctx;
};