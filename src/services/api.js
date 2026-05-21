import axios from 'axios';

// ─── Data properti dummy lokal ─────────────────────────────
const NAMA_PROPERTI = [
  'Rumah Modern Minimalis 2 Lantai BSD City',
  'Apartemen Studio Premium SCBD Jakarta',
  'Rumah Cluster 3KT Furnished Serpong',
  'Villa Mewah View Sawah Ubud Bali',
  'Ruko 3 Lantai Strategis Kelapa Gading',
  'Tanah Kavling SHM Siap Bangun Depok',
  'Rumah Subsidi 2KT Ready Stock Bekasi',
  'Apartemen 2BR City View Surabaya',
  'Rumah Hook Corner Lot Bintaro Jaya',
  'Kos Eksklusif 20 Kamar Jogja Kota',
  'Rumah Mewah Kolam Renang Kemang Jaksel',
  'Tanah Industri SHM Karawang Barat',
  'Ruko 2 Lantai Pinggir Jalan Raya Bandung',
  'Apartemen Furnished Thamrin Jakarta Pusat',
  'Rumah 4KT Garasi 2 Mobil Gading Serpong',
  'Villa 5KT Private Pool Seminyak Bali',
  'Rumah Cluster Premium Summarecon Bekasi',
  'Tanah Kavling Pantai Nusa Dua Bali',
  'Ruko 4 Lantai Komersial Sunter Jakarta',
  'Apartemen Green View Margonda Depok',
];

const GAMBAR_PROPERTI = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80', // rumah modern
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80', // apartemen interior
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&q=80', // rumah putih
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80', // villa pantai
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80', // ruko/komersial
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', // tanah/lahan
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=80', // rumah cluster
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&q=80', // apartemen eksterior
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80', // rumah mewah
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=80', // kos/kamar
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80', // rumah suburban
  'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=500&q=80', // tanah luas
  'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=500&q=80', // ruko
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=500&q=80', // apartemen dalam
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&q=80', // rumah garasi
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80', // villa mewah
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', // rumah modern
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80', // tanah kavling
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=500&q=80', // ruko komersial
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=80', // apartemen dapur
];

const KOTA_LIST   = ['Jakarta', 'Surabaya', 'Bandung', 'Bali', 'Yogyakarta', 'Medan', 'Depok', 'Bekasi'];
const TIPE_LIST   = ['Rumah', 'Apartemen', 'Ruko', 'Tanah', 'Villa'];
const STATUS_LIST = ['Dijual', 'Disewa'];

// ─── Mapping produk → properti ─────────────────────────────
export const mapToProperty = (item) => ({
  id:         item.id,
  nama:       NAMA_PROPERTI[(item.id - 1) % NAMA_PROPERTI.length],
  deskripsi:  item.description,
  harga:      item.price * 10_000_000,
  gambar:     GAMBAR_PROPERTI[(item.id - 1) % GAMBAR_PROPERTI.length],
  lokasi:     KOTA_LIST[item.id % KOTA_LIST.length],
  tipe:       TIPE_LIST[item.id % TIPE_LIST.length],
  status:     STATUS_LIST[item.id % 2],
  kamarTidur: (item.id % 4) + 1,
  kamarMandi: (item.id % 3) + 1,
  luas:       ((item.id % 10) + 5) * 12,
  rating:     item.rating,
  favorite:   false,
});

// ─── Fetch functions ───────────────────────────────────────
export const fetchProperties = async (limit = 12, skip = 0) => {
  const res = await axios.get(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  return res.data;
};

export const fetchPropertyById = async (id) => {
  const res = await axios.get(`https://dummyjson.com/products/${id}`);
  return mapToProperty(res.data);
};

export const fetchSimilar = async (skip = 0, limit = 4) => {
  const res = await axios.get(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  return res.data.products.map(mapToProperty);
};