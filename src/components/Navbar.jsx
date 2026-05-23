// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

const NAV_LINKS = [
  { to: '/',                 label: 'Beranda', exact: true  },
  { to: '/?jenis=dijual',    label: 'Jual',    exact: false },
  { to: '/?jenis=disewakan', label: 'Sewa',    exact: false },
  { to: '/kpr',              label: 'KPR',     exact: true  },
];

const AVATAR_COLORS = [
  'bg-blue-600', 'bg-emerald-600', 'bg-violet-600',
  'bg-rose-600',  'bg-amber-600',  'bg-cyan-600',
];
const getAvatarColor = (name = '') =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function Navbar() {
  const { pathname, search } = useLocation();
  const { user, logout }     = useAuth();

  const [mobileOpen, setMobileOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginOpen, setLoginOpen]       = useState(false);
  const [loginMode, setLoginMode]       = useState('login');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isTambahPage   = pathname === '/tambah-properti';
  const isDashboardPage = pathname === '/dashboard';

  const isActive = (link) => {
    if (link.exact) return pathname === link.to && !search.includes('jenis');
    const url = new URL(link.to, 'http://x');
    return pathname === '/' && search === url.search;
  };

  const openLogin = (mode = 'login') => {
    setLoginMode(mode);
    setLoginOpen(true);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-blue-700 flex-shrink-0">
            <p>
              Omah<span className="text-amber-400">Ku.</span>
            </p>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors pb-0.5 ${
                  isActive(link)
                    ? 'text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-500 hover:text-blue-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">

            {/* Pasang Iklan */}
            {!isTambahPage && !isDashboardPage && (
              user ? (
                <Link
                  to="/tambah-properti"
                  className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-black px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  + Pasang Iklan
                </Link>
              ) : (
                <button
                  onClick={() => openLogin('login')}
                  className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-black px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  + Pasang Iklan
                </button>
              )
            )}

            {/* Sudah Login: Avatar + Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1.5 rounded-xl transition-all"
                >
                  <div className={`w-9 h-9 rounded-full ${getAvatarColor(user.nama)} flex items-center justify-center text-white text-xs font-black ring-2 ring-white shadow-md`}>
                    {user.avatar}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-black text-gray-800 leading-tight">{user.nama}</p>
                    <p className="text-[10px] text-gray-400 leading-tight capitalize">{user.role}</p>
                  </div>
                  <span className={`text-gray-400 text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs font-black text-gray-800">{user.nama}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {[
                        { to: '/dashboard',       icon: '', label: 'Dashboard'         },
                        { to: '/tambah-properti', icon: '', label: 'Tambah Properti'   },
                        { to: '/iklan-saya',      icon: '', label: 'Iklan Saya'        },
                        { to: '/favorit',         icon: '', label: 'Properti Favorit'  },
                        { to: '/profil',          icon: '', label: 'Profil Saya'       },
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-semibold"
                        >
                          <span className="text-base">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                      >
                        <span className="text-base"></span> Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>

            ) : (
              /* Belum Login */
              <>
                <button
                  onClick={() => openLogin('login')}
                  className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  Masuk
                </button>
                <button
                  onClick={() => openLogin('register')}
                  className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  Daftar
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-600 text-2xl p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium py-2 px-3 rounded-xl ${
                  isActive(link)
                    ? 'text-blue-700 bg-blue-50 font-bold'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl mb-2">
                    <div className={`w-9 h-9 rounded-full ${getAvatarColor(user.nama)} flex items-center justify-center text-white text-xs font-black`}>
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-800">{user.nama}</p>
                      <p className="text-[11px] text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  {[
                    { to: '/dashboard',       icon: '', label: 'Dashboard'        },
                    { to: '/tambah-properti', icon: '', label: 'Tambah Properti'  },
                    { to: '/iklan-saya',      icon: '', label: 'Iklan Saya'       },
                    { to: '/favorit',         icon: '', label: 'Properti Favorit' },
                    { to: '/profil',          icon: '', label: 'Profil Saya'      },
                  ].map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-semibold py-2 px-3 rounded-xl transition-colors"
                    >
                      <span>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 font-semibold py-2 px-3 rounded-xl transition-colors"
                  >
                    <span></span> Keluar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => openLogin('login')}
                    className="w-full text-left text-sm text-gray-700 hover:text-blue-700 font-semibold py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => openLogin('register')}
                    className="w-full text-left text-sm text-amber-600 font-black py-2 px-3 rounded-xl hover:bg-amber-50 transition-colors"
                  >
                    Daftar Gratis
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        defaultMode={loginMode}
      />
    </>
  );
}