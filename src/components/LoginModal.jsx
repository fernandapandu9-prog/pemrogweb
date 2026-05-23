// src/components/LoginModal.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
  const { login, register, loginError, setLoginError, loading } = useAuth();
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama]       = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [localError, setLocalError] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Reset form saat modal dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      setEmail(''); setPassword(''); setNama(''); setKonfirmasi('');
      setLocalError(''); setLoginError('');
    }
  }, [isOpen, mode]);

  // Tutup modal dengan Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (mode === 'login') {
      if (!email || !password) { setLocalError('Email dan password wajib diisi'); return; }
      const ok = await login(email, password);
      if (ok) onClose();

    } else {
      if (!nama || !email || !password) { setLocalError('Semua field wajib diisi'); return; }
      if (password.length < 6) { setLocalError('Password minimal 6 karakter'); return; }
      if (password !== konfirmasi) { setLocalError('Konfirmasi password tidak cocok'); return; }
      const ok = await register(nama, email, password);
      if (ok) onClose();
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setLocalError(''); setLoginError('');
  };

  const errorMsg = localError || loginError;

  const inputCls = 'w-full border-2 border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all';

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 pt-8 pb-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-sm transition-all"
          >
            ✕
          </button>
          <div className="text-3xl mb-3">🏠</div>
          <h2 className="text-xl font-black mb-1">
            {mode === 'login' ? 'Selamat Datang Kembali!' : 'Buat Akun Baru'}
          </h2>
          <p className="text-blue-200 text-sm">
            {mode === 'login'
              ? 'Masuk untuk mengelola properti Anda'
              : 'Bergabung dan mulai pasang iklan gratis'}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">

          {/* Demo hint */}
          {mode === 'login' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-xs text-amber-700">
              <strong>Demo:</strong> gunakan email <code className="bg-amber-100 px-1 rounded">ahmad@email.com</code> password <code className="bg-amber-100 px-1 rounded">123456</code>
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              ⚠ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama — hanya register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                  Nama Lengkap *
                </label>
                <input
                  type="text" value={nama}
                  onChange={e => setNama(e.target.value)}
                  placeholder="Contoh: Ahmad Pratama"
                  className={inputCls}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                Email *
              </label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className={inputCls}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password — hanya register */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-1.5">
                  Konfirmasi Password *
                </label>
                <input
                  type="password" value={konfirmasi}
                  onChange={e => setKonfirmasi(e.target.value)}
                  placeholder="Ulangi password"
                  className={inputCls}
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-black py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                mode === 'login' ? '🔑 Masuk' : '✨ Buat Akun'
              )}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
            {' '}
            <button
              onClick={switchMode}
              className="text-blue-600 font-black hover:underline"
            >
              {mode === 'login' ? 'Daftar gratis' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}