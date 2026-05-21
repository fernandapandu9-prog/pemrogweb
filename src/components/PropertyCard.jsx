import { useState } from 'react';
import { Link } from 'react-router-dom';

const formatHarga = (harga) => {
  if (harga >= 1_000_000_000) return `Rp ${(harga / 1_000_000_000).toFixed(1)} M`;
  if (harga >= 1_000_000) return `Rp ${(harga / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${harga.toLocaleString('id-ID')}`;
};

export default function PropertyCard({ property }) {
  const [fav, setFav] = useState(property.favorite || false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
      
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={property.gambar}
          alt={property.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://via.placeholder.com/400x250?text=Properti'; }}
        />
        {/* Badge */}
        <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${
          property.status === 'Dijual' ? 'bg-blue-700' : 'bg-emerald-600'
        }`}>
          {property.status}
        </span>
        {/* Favorite */}
        <button
          onClick={e => { e.preventDefault(); setFav(!fav); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-base"
          aria-label="Tambah favorit"
        >
          {fav ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Body */}
      <Link to={`/properti/${property.id}`} className="block p-4">
        <div className="text-xl font-extrabold text-brand mb-1">
          {formatHarga(property.harga)}
        </div>
        <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">{property.nama}</h3>
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
          📍 {property.lokasi}
        </p>
        <div className="flex gap-3 pt-3 border-t border-gray-100 text-xs text-gray-600 font-medium flex-wrap">
          {property.kamarTidur && <span>🛏 {property.kamarTidur} KT</span>}
          {property.kamarMandi && <span>🚿 {property.kamarMandi} KM</span>}
          {property.luas && <span>📐 {property.luas} m²</span>}
          <span className="ml-auto bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{property.tipe}</span>
        </div>
      </Link>
    </div>
  );
}