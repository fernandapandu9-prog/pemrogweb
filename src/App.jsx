import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import Footer from './components/Footer';
import TambahPropertiPage from './pages/TambahPropertiPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/properti/:id" element={<DetailPage />} />
        <Route path="/tambah-properti" element={<TambahPropertiPage />} />  
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}