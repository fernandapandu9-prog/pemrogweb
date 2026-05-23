// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import Navbar               from './components/Navbar';
import Footer               from './components/Footer';
import HomePage             from './pages/HomePage';
import DetailPage           from './pages/DetailPage';
import TambahPropertiPage   from './pages/TambahPropertiPage';
import DashboardPage        from './pages/DashboardPage';
import NotFoundPage         from './pages/NotFoundPage';

const NO_FOOTER_ROUTES = ['/tambah-properti', '/dashboard'];

function Layout() {
  const { pathname } = useLocation();
  const showFooter   = !NO_FOOTER_ROUTES.includes(pathname);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                element={<HomePage />}           />
        <Route path="/properti/:id"    element={<DetailPage />}         />
        <Route path="/tambah-properti" element={<TambahPropertiPage />} />
        <Route path="/dashboard"       element={<DashboardPage />}      />
        <Route path="*"                element={<NotFoundPage />}       />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PropertyProvider>
          <Layout />
        </PropertyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}