import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-400 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-extrabold text-white mb-3">
              Rumah<span className="text-amber-400">Ku.</span>
            </p>
            <p className="text-sm leading-relaxed mb-4">
              Platform properti terpercaya untuk jual, beli, dan sewa di seluruh Indonesia.
            </p>
          </div>

          {/* Properti */}
          <div>
            <p className="text-white text-sm font-bold mb-4">Properti</p>
            <ul className="space-y-2 text-sm">
              {['Rumah Dijual','Rumah Disewa','Apartemen','Tanah','Ruko'].map(item => (
                <li key={item}>
                  <Link to="/" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <p className="text-white text-sm font-bold mb-4">Layanan</p>
            <ul className="space-y-2 text-sm">
              {['Kalkulator KPR','Panduan Beli','Agen Properti','Pasang Iklan'].map(item => (
                <li key={item}>
                  <Link to="/" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <p className="text-white text-sm font-bold mb-4">Perusahaan</p>
            <ul className="space-y-2 text-sm">
              {['Tentang Kami','Karir','Blog','Hubungi Kami','Kebijakan Privasi'].map(item => (
                <li key={item}>
                  <Link to="/" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <span>© 2025 OmahKu.. Hak Cipta Dilindungi.</span>
          <span>Made in Indonesia</span>
        </div>
      </div>
    </footer>
  );
}