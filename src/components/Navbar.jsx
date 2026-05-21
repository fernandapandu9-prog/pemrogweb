import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


export default function Navbar() {
  const { pathname, search } = useLocation(); // ← ambil search juga
  const [open, setOpen] = useState(false);

  const isTambahPage = pathname === '/tambah-properti';
  const NAV_LINKS = [
    { to: '/',                  label: '', exact: true  },
  ];

  // Cek apakah link aktif
  const isActive = (link) => {
    if (link.exact) {
      // Harus cocok pathname DAN tidak ada query jenis
      return pathname === link.to && !search.includes('jenis');
    }
    // Untuk Jual/Sewa: cek query string-nya
    const url = new URL(link.to, 'http://x');
    return pathname === '/' && search === url.search;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        <Link to="/" className="flex items-center text-xl font-extrabold">
          <span className="text-blue-700 ">Omah</span>
          <span className="text-amber-400">Ku.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm font-medium transition-colors pb-0.5 ${
                isActive(link)
                  ? 'text-blue-700 border-b-2 border-blue-700'  // ← aktif
                  : 'text-gray-500 hover:text-blue-700'          // ← tidak aktif
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="md:flex items-center gap-3">
          {!isTambahPage && (
            <Link
              to="/tambah-properti"
              className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-black px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm"
            >
              + Pasang Iklan
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}