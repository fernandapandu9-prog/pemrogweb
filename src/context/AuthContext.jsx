// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'properti_nusantara_user';

// Data user dummy untuk simulasi login
const DUMMY_USERS = [
  { id: 1, nama: 'Ahmad Pratama', email: 'ahmad@email.com', password: '123456', avatar: 'AP', role: 'agen' },
  { id: 2, nama: 'Siti Rahayu',   email: 'siti@email.com',  password: '123456', avatar: 'SR', role: 'user' },
  { id: 3, nama: 'Budi Santoso',  email: 'budi@email.com',  password: '123456', avatar: 'BS', role: 'user' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setLoginError('');

    // Simulasi delay network
    await new Promise(r => setTimeout(r, 800));

    const found = DUMMY_USERS.find(
      u => u.email === email && u.password === password
    );

    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      setLoading(false);
      return true;
    } else {
      setLoginError('Email atau password salah');
      setLoading(false);
      return false;
    }
  };

  const register = async (nama, email, password) => {
    setLoading(true);
    setLoginError('');
    await new Promise(r => setTimeout(r, 800));

    const exists = DUMMY_USERS.find(u => u.email === email);
    if (exists) {
      setLoginError('Email sudah terdaftar');
      setLoading(false);
      return false;
    }

    const inisial = nama.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser = { id: Date.now(), nama, email, avatar: inisial, role: 'user' };
    DUMMY_USERS.push({ ...newUser, password });
    setUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loginError, setLoginError, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
};