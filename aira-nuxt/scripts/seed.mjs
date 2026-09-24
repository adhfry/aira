// Generator seed data AIRA → server/data/db.json
// Jalankan: npm run seed  (deterministik: output selalu sama)
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'server/data/db.json')

// ---------- PRNG deterministik ----------
let seed = 20260924
function rand() {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const between = (min, max) => min + rand() * (max - min)
const round = (n, d = 0) => Math.round(n * 10 ** d) / 10 ** d
const pad = (n, l = 3) => String(n).padStart(l, '0')

// Jangkar waktu seed. Saat database pertama kali dibuat, seluruh timestamp
// digeser agar kejadian terbaru jatuh pada waktu sekarang.
const ANCHOR = new Date('2026-09-24T10:24:18+07:00').getTime()
const iso = (msBefore) => new Date(ANCHOR - msBefore).toISOString()
const MIN = 60_000
const HOUR = 60 * MIN

// ---------- Kecamatan (11) ----------
const districtsRaw = [
  ['Kota Surnenep', 85, 76_450, -7.0086, 113.8594],
  ['Batupatih', 78, 51_210, -6.9535, 113.9661],
  ['Dasuk', 72, 38_920, -6.9282, 113.8421],
  ['Kalianget', 65, 41_870, -7.0506, 113.9291],
  ['Lenteng', 58, 60_330, -6.9642, 113.8032],
  ['Batuan', 52, 34_110, -6.9894, 113.8321],
  ['Manding', 46, 37_780, -6.9321, 113.8702],
  ['Bluto', 41, 49_560, -7.0851, 113.7964],
  ['Saronggi', 33, 39_240, -7.0741, 113.8653],
  ['Ambunten', 28, 43_190, -6.8942, 113.7443],
  ['Pasongsongan', 22, 47_050, -6.9021, 113.6612],
]

export function riskLevelOf(p) {
  if (p >= 70) return 'bahaya'
  if (p >= 50) return 'siaga'
  if (p >= 35) return 'waspada'
  return 'normal'
}

const districts = districtsRaw.map(([name, riskPercentage, population, lat, lng], i) => ({
  id: `kec-${pad(i + 1)}`,
  name,
  riskLevel: riskLevelOf(riskPercentage),
  riskPercentage,
  population,
  coordinates: { lat, lng },
}))
const byName = Object.fromEntries(districts.map((d) => [d.name, d]))
const near = (d, spread = 0.018) => ({
  lat: round(d.coordinates.lat + between(-spread, spread), 5),
  lng: round(d.coordinates.lng + between(-spread, spread), 5),
})

// ---------- Kamera CCTV (42) ----------
const CCTV_IMG = 'https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=600&auto=format&fit=crop'
const FLOOD_IMG = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop'
const RIVER_IMG = 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=600&auto=format&fit=crop'

// [nama, lokasi, kecamatan, status, online]
const cameraList = [
  ['Jembatan Kali Surnenep', 'Jl. Trunojoyo, Bangselok', 'Kota Surnenep', 'bahaya', true],
  ['Pintu Air Dasuk', 'Desa Dasuk Laok', 'Dasuk', 'bahaya', true],
  ['Kali Batuan', 'Desa Batuan', 'Batuan', 'siaga', true],
  ['Kali Lenteng', 'Desa Lenteng Timur', 'Lenteng', 'siaga', true],
  ['Kali Batupatih Hulu', 'Desa Bantelan', 'Batupatih', 'siaga', true],
  ['Bendung Kalianget', 'Desa Kalianget Barat', 'Kalianget', 'siaga', true],
  ['Kali Kebun Agung', 'Kel. Kebun Agung', 'Kota Surnenep', 'waspada', true],
  ['Kali Batupatih', 'Desa Batupatih', 'Batupatih', 'waspada', true],
  ['Kali Saronggi', 'Desa Saroka', 'Saronggi', 'waspada', true],
  ['Saluran Primer Pajagalan', 'Kel. Pajagalan', 'Kota Surnenep', 'waspada', true],
  ['Muara Kalianget', 'Desa Kalianget Timur', 'Kalianget', 'waspada', true],
  ['Kali Dasuk', 'Desa Dasuk Daya', 'Dasuk', 'waspada', true],
  ['Simpang Lenteng', 'Jl. Raya Lenteng', 'Lenteng', 'waspada', true],
  ['Jembatan Bluto', 'Desa Bluto', 'Bluto', 'waspada', true],
  ['Jembatan Manding', 'Desa Manding Laok', 'Manding', 'normal', true],
  ['Kali Gading', 'Desa Gadding', 'Manding', 'normal', false],
  ['Pasar Anom', 'Kel. Pangarangan', 'Kota Surnenep', 'normal', true],
  ['Taman Bunga', 'Kel. Pangarangan', 'Kota Surnenep', 'normal', true],
  ['Pintu Air Marengan', 'Desa Marengan Daya', 'Kota Surnenep', 'normal', true],
  ['Terminal Arya Wiraraja', 'Desa Pabian', 'Kota Surnenep', 'normal', true],
  ['Kali Anom', 'Desa Kolor', 'Kota Surnenep', 'normal', true],
  ['Pelabuhan Kalianget', 'Desa Kalianget Timur', 'Kalianget', 'normal', true],
  ['Jembatan Karang Anyar', 'Desa Karang Anyar', 'Kalianget', 'normal', true],
  ['Kali Gunting', 'Desa Gunggung', 'Batuan', 'normal', true],
  ['Simpang Batuan', 'Desa Babbalan', 'Batuan', 'normal', true],
  ['Bendung Lenteng', 'Desa Lenteng Barat', 'Lenteng', 'normal', true],
  ['Pasar Lenteng', 'Desa Lenteng Timur', 'Lenteng', 'normal', true],
  ['Pantai Lombang', 'Desa Lombang', 'Batupatih', 'normal', true],
  ['Simpang Batupatih', 'Desa Batupatih Laok', 'Batupatih', 'normal', true],
  ['Jembatan Dasuk', 'Desa Dasuk Timur', 'Dasuk', 'normal', true],
  ['Pasar Manding', 'Desa Manding Daya', 'Manding', 'normal', true],
  ['Kali Bluto', 'Desa Pakandangan', 'Bluto', 'normal', true],
  ['Pasar Bluto', 'Desa Bluto', 'Bluto', 'normal', true],
  ['Pelabuhan Bluto', 'Desa Aeng Dake', 'Bluto', 'normal', false],
  ['Jembatan Saronggi', 'Desa Saronggi', 'Saronggi', 'normal', true],
  ['Tambak Saronggi', 'Desa Talang', 'Saronggi', 'normal', true],
  ['Kali Ambunten', 'Desa Ambunten Timur', 'Ambunten', 'normal', true],
  ['Pelabuhan Ambunten', 'Desa Ambunten Tengah', 'Ambunten', 'normal', true],
  ['Jembatan Ambunten', 'Desa Ambunten Barat', 'Ambunten', 'normal', true],
  ['Kali Pasongsongan', 'Desa Pasongsongan', 'Pasongsongan', 'normal', true],
  ['Pantai Pasongsongan', 'Desa Padangdangan', 'Pasongsongan', 'normal', true],
  ['Simpang Pasongsongan', 'Desa Panaongan', 'Pasongsongan', 'normal', true],
]

const cameras = cameraList.map(([name, location, district, status, isOnline], i) => ({
  id: `cam-${pad(i + 1)}`,
  name,
  location,
  district,
  status,
  imageUrl: i % 7 === 5 ? FLOOD_IMG : i % 11 === 9 ? RIVER_IMG : CCTV_IMG,
  ...near(byName[district]),
  lastUpdate: iso(isOnline ? Math.round(between(0, 40)) * 1000 : Math.round(between(60, 120)) * MIN),
  isOnline,
}))

// ---------- Sensor IoT (28) ----------
function history(points, base, drift, noise, decimals = 0) {
  const arr = []
  for (let i = points - 1; i >= 0; i--) {
    const progress = (points - 1 - i) / (points - 1)
    const value = Math.max(0, base - drift * (1 - progress) + between(-noise, noise))
    arr.push({ time: iso(i * HOUR), value: round(value, decimals) })
  }
  return arr
}

// [tipe, nama, lokasi, kecamatan, nilai, tren, status, online]
const sensorList = [
  ['water_level', 'TMA Kali Surnenep', 'Jembatan Kali Surnenep', 'Kota Surnenep', 285, 'up', 'bahaya', true],
  ['water_level', 'TMA Pintu Air Dasuk', 'Pintu Air Dasuk', 'Dasuk', 262, 'up', 'bahaya', true],
  ['water_level', 'TMA Kali Batupatih', 'Desa Bantelan', 'Batupatih', 238, 'up', 'siaga', true],
  ['water_level', 'TMA Kali Lenteng', 'Desa Lenteng Timur', 'Lenteng', 221, 'up', 'siaga', true],
  ['water_level', 'TMA Bendung Kalianget', 'Desa Kalianget Barat', 'Kalianget', 214, 'stable', 'siaga', true],
  ['water_level', 'TMA Kali Batuan', 'Desa Batuan', 'Batuan', 196, 'up', 'waspada', true],
  ['water_level', 'TMA Kali Kebun Agung', 'Kel. Kebun Agung', 'Kota Surnenep', 188, 'stable', 'waspada', true],
  ['water_level', 'TMA Kali Manding', 'Desa Manding Laok', 'Manding', 176, 'up', 'waspada', true],
  ['water_level', 'TMA Jembatan Bluto', 'Desa Bluto', 'Bluto', 164, 'stable', 'waspada', true],
  ['water_level', 'TMA Kali Saronggi', 'Desa Saroka', 'Saronggi', 132, 'down', 'normal', true],
  ['water_level', 'TMA Kali Gunting', 'Desa Gunggung', 'Batuan', 118, 'down', 'normal', true],
  ['water_level', 'TMA Kali Ambunten', 'Desa Ambunten Timur', 'Ambunten', 104, 'stable', 'normal', true],
  ['water_level', 'TMA Kali Pasongsongan', 'Desa Pasongsongan', 'Pasongsongan', 96, 'down', 'normal', true],
  ['water_level', 'TMA Kali Gading', 'Desa Gadding', 'Manding', 88, 'stable', 'normal', false],
  ['rainfall', 'ARG Kota Surnenep', 'Kantor BPBD', 'Kota Surnenep', 45, 'up', 'bahaya', true],
  ['rainfall', 'ARG Dasuk', 'Kantor Kecamatan Dasuk', 'Dasuk', 38, 'up', 'siaga', true],
  ['rainfall', 'ARG Batupatih', 'Kantor Kecamatan Batupatih', 'Batupatih', 31, 'up', 'siaga', true],
  ['rainfall', 'ARG Lenteng', 'Kantor Kecamatan Lenteng', 'Lenteng', 24, 'stable', 'waspada', true],
  ['rainfall', 'ARG Kalianget', 'Kantor Kecamatan Kalianget', 'Kalianget', 18, 'stable', 'waspada', true],
  ['rainfall', 'ARG Bluto', 'Kantor Kecamatan Bluto', 'Bluto', 9, 'down', 'normal', true],
  ['rainfall', 'ARG Saronggi', 'Kantor Kecamatan Saronggi', 'Saronggi', 6, 'down', 'normal', true],
  ['rainfall', 'ARG Ambunten', 'Kantor Kecamatan Ambunten', 'Ambunten', 4, 'stable', 'normal', false],
  ['weather', 'AWS Kota Surnenep', 'Stasiun Meteorologi Trunojoyo', 'Kota Surnenep', 28, 'stable', 'normal', true],
  ['weather', 'AWS Kalianget', 'Pelabuhan Kalianget', 'Kalianget', 29, 'up', 'normal', true],
  ['weather', 'AWS Lenteng', 'Desa Lenteng Barat', 'Lenteng', 27, 'down', 'normal', true],
  ['weather', 'AWS Batupatih', 'Pantai Lombang', 'Batupatih', 28, 'stable', 'normal', true],
  ['weather', 'AWS Bluto', 'Desa Pakandangan', 'Bluto', 30, 'up', 'normal', true],
  ['weather', 'AWS Pasongsongan', 'Desa Padangdangan', 'Pasongsongan', 27, 'stable', 'normal', true],
]

const UNIT = { water_level: 'cm', rainfall: 'mm/jam', weather: '°C' }

const sensors = sensorList.map(([type, name, location, district, value, trend, status, isOnline], i) => {
  const drift = trend === 'up' ? value * 0.18 : trend === 'down' ? -value * 0.15 : 0
  const noise = type === 'weather' ? 0.8 : value * 0.04
  const hist = history(12, value, drift, noise, type === 'weather' ? 1 : 0)
  hist[hist.length - 1].value = value
  return {
    id: `sen-${pad(i + 1)}`,
    type,
    name,
    location,
    district,
    value,
    unit: UNIT[type],
    trend,
    status,
    ...near(byName[district], 0.012),
    isOnline,
    lastUpdate: iso(isOnline ? Math.round(between(0, 30)) * 1000 : 95 * MIN),
    history: hist,
  }
})

// ---------- Kejadian (20) ----------
// [judul, tipe, kecamatan, lokasi, deskripsi, tingkat, status, menitLalu, pelapor]
const incidentList = [
  ['Peringatan Dini - Risiko Tinggi', 'peringatan', 'Kota Surnenep', 'Kali Surnenep', 'Kenaikan tinggi muka air di Kali Surnenep', 'bahaya', 'aktif', 0, 'Sistem AIRA'],
  ['Curah Hujan Tinggi', 'hujan_tinggi', 'Kota Surnenep', 'ARG Kota Surnenep', 'Intensitas 45 mm/jam di Kec. Kota Surnenep', 'siaga', 'aktif', 12, 'Sistem AIRA'],
  ['Verifikasi Lapangan', 'verifikasi', 'Saronggi', 'Jembatan Saronggi', 'Petugas melakukan pengecekan di Jembatan Saronggi', 'waspada', 'ditangani', 39, 'Rizky Maulana'],
  ['Kamera Offline', 'offline', 'Manding', 'Kali Gading', 'CCTV Kali Gading tidak merespons', 'waspada', 'aktif', 63, 'Sistem AIRA'],
  ['Status Normal', 'normal', 'Lenteng', 'Kali Lenteng', 'Tinggi muka air di Kali Lenteng kembali normal', 'normal', 'selesai', 108, 'Sistem AIRA'],
  ['Genangan Terdeteksi', 'peringatan', 'Dasuk', 'Pintu Air Dasuk', 'Computer Vision mendeteksi genangan 30 cm di sekitar pintu air', 'bahaya', 'ditangani', 150, 'Sistem AIRA'],
  ['Curah Hujan Tinggi', 'hujan_tinggi', 'Batupatih', 'ARG Batupatih', 'Intensitas 31 mm/jam di Kec. Batupatih', 'siaga', 'ditangani', 190, 'Sistem AIRA'],
  ['Verifikasi Lapangan', 'verifikasi', 'Kota Surnenep', 'Kali Kebun Agung', 'Petugas mengonfirmasi luapan kecil di bantaran Kali Kebun Agung', 'waspada', 'selesai', 240, 'Siti Nurhaliza'],
  ['Peringatan Dini - Siaga', 'peringatan', 'Kalianget', 'Bendung Kalianget', 'Tinggi muka air mendekati ambang siaga', 'siaga', 'ditangani', 300, 'Sistem AIRA'],
  ['Sensor Offline', 'offline', 'Ambunten', 'ARG Ambunten', 'Sensor curah hujan Ambunten tidak mengirim data', 'waspada', 'aktif', 360, 'Sistem AIRA'],
  ['Status Normal', 'normal', 'Bluto', 'Jembatan Bluto', 'Kondisi aliran sungai kembali stabil', 'normal', 'selesai', 480, 'Sistem AIRA'],
  ['Genangan Jalan', 'peringatan', 'Lenteng', 'Simpang Lenteng', 'Genangan setinggi 20 cm menghambat lalu lintas', 'siaga', 'selesai', 620, 'Dimas Pratama'],
  ['Verifikasi Lapangan', 'verifikasi', 'Batuan', 'Kali Batuan', 'Pembersihan sampah penyumbat aliran oleh petugas', 'waspada', 'selesai', 760, 'Rizky Maulana'],
  ['Curah Hujan Tinggi', 'hujan_tinggi', 'Dasuk', 'ARG Dasuk', 'Intensitas 38 mm/jam di Kec. Dasuk', 'siaga', 'selesai', 900, 'Sistem AIRA'],
  ['Peringatan Dini - Waspada', 'peringatan', 'Manding', 'Jembatan Manding', 'Kenaikan muka air 25 cm dalam 2 jam', 'waspada', 'selesai', 1_100, 'Sistem AIRA'],
  ['Kamera Offline', 'offline', 'Bluto', 'Pelabuhan Bluto', 'CCTV Pelabuhan Bluto terputus dari jaringan', 'waspada', 'aktif', 1_300, 'Sistem AIRA'],
  ['Status Normal', 'normal', 'Kalianget', 'Muara Kalianget', 'Air laut surut, aliran muara kembali normal', 'normal', 'selesai', 1_500, 'Sistem AIRA'],
  ['Banjir Rob', 'peringatan', 'Kalianget', 'Pelabuhan Kalianget', 'Banjir rob menggenangi area pelabuhan', 'siaga', 'selesai', 2_000, 'Siti Nurhaliza'],
  ['Verifikasi Lapangan', 'verifikasi', 'Pasongsongan', 'Kali Pasongsongan', 'Pengecekan tanggul pasca hujan deras', 'normal', 'selesai', 2_600, 'Dimas Pratama'],
  ['Status Normal', 'normal', 'Saronggi', 'Kali Saronggi', 'Tinggi muka air stabil di bawah ambang waspada', 'normal', 'selesai', 3_200, 'Sistem AIRA'],
]

const incidents = incidentList.map(
  ([title, type, district, location, description, severity, status, minutes, reporter], i) => ({
    id: `inc-${pad(i + 1)}`,
    title,
    type,
    district,
    location,
    description,
    severity,
    status,
    timestamp: iso(minutes * MIN),
    reporter,
  }),
)

// ---------- Petugas (5) ----------
const avatar = (id) => `https://images.unsplash.com/photo-${id}?q=80&w=100&auto=format&fit=crop`
const users = [
  ['Ahda Barori', 'Administrator', 'ahda.barori@surnenepkab.go.id', '0812-3456-7890', '1507003211169-0a1dd7228f2d', 'Kota Surnenep', 'aktif'],
  ['Siti Nurhaliza', 'Operator', 'siti.nurhaliza@surnenepkab.go.id', '0813-2211-4455', '1494790108377-be9c29b29330', 'Kota Surnenep', 'aktif'],
  ['Rizky Maulana', 'Petugas Lapangan', 'rizky.maulana@surnenepkab.go.id', '0857-3344-1122', '1500648767791-00dcc994a43e', 'Saronggi', 'aktif'],
  ['Dimas Pratama', 'Petugas Lapangan', 'dimas.pratama@surnenepkab.go.id', '0821-7788-9900', '1472099645785-5658abf4ff4e', 'Lenteng', 'aktif'],
  ['Nabila Putri', 'Analis Data', 'nabila.putri@surnenepkab.go.id', '0838-5566-7788', '1438761681033-6461ffad8d80', 'Kalianget', 'nonaktif'],
].map(([name, role, email, phone, img, district, status], i) => ({
  id: `usr-${pad(i + 1)}`,
  name,
  role,
  email,
  phone,
  avatarUrl: avatar(img),
  district,
  status,
}))

// ---------- Notifikasi ----------
const notifications = [
  ['Peringatan Dini Banjir - Kali Surnenep', 'Terjadi kenaikan tinggi muka air di Kali Surnenep. Status BAHAYA. Segera lakukan pengecekan lapangan.', 'darurat', ['Petugas Lapangan', 'Masyarakat Kota Surnenep'], 'terkirim', 1],
  ['Curah Hujan Tinggi - Kota Surnenep', 'Intensitas hujan 45 mm/jam terdeteksi. Waspadai genangan di area rendah.', 'peringatan', ['Petugas Lapangan', 'Operator'], 'terkirim', 13],
  ['Kamera CCTV Offline', 'CCTV Kali Gading tidak merespons. Mohon pengecekan perangkat.', 'informasi', ['Operator'], 'terkirim', 64],
  ['Siaga Bendung Kalianget', 'Tinggi muka air Bendung Kalianget mendekati ambang siaga.', 'peringatan', ['Petugas Lapangan', 'Masyarakat Kalianget'], 'gagal', 301],
  ['Genangan Pintu Air Dasuk', 'Genangan 30 cm terdeteksi di sekitar Pintu Air Dasuk. Hindari jalur tersebut.', 'darurat', ['Masyarakat Dasuk', 'Petugas Lapangan'], 'terkirim', 151],
  ['Uji Coba Sirene Publik', 'Uji coba sirene peringatan dini akan dilakukan Sabtu pukul 09.00 WIB.', 'informasi', ['Masyarakat Kab. Surnenep'], 'draft', 20],
  ['Status Normal - Kali Lenteng', 'Tinggi muka air di Kali Lenteng kembali normal.', 'informasi', ['Masyarakat Lenteng'], 'terkirim', 109],
  ['Laporan Harian Banjir', 'Rekap kondisi banjir harian telah tersedia di dashboard.', 'informasi', ['Administrator', 'Analis Data'], 'draft', 5],
].map(([title, message, type, recipients, status, minutes], i) => ({
  id: `ntf-${pad(i + 1)}`,
  title,
  message,
  type,
  recipients,
  status,
  createdAt: iso(minutes * MIN),
}))

// ---------- Baseline "kemarin" untuk delta kartu metrik ----------
const all = [...cameras, ...sensors.filter((s) => s.type === 'water_level')]
const count = (fn) => all.filter(fn).length
const today = {
  high: count((x) => x.status === 'siaga' || x.status === 'bahaya'),
  medium: count((x) => x.status === 'waspada'),
  normal: count((x) => x.status === 'normal'),
}

const db = {
  meta: {
    anchor: new Date(ANCHOR).toISOString(),
    baseline: { high: today.high - 2, medium: today.medium - 3, normal: today.normal + 5 },
  },
  cameras,
  sensors,
  incidents,
  districts,
  users,
  notifications,
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `${JSON.stringify(db, null, 2)}\n`)
console.log(
  `Seed ditulis ke ${out}: ${cameras.length} kamera, ${sensors.length} sensor, ${incidents.length} kejadian, ` +
    `${districts.length} kecamatan, ${users.length} petugas, ${notifications.length} notifikasi`,
)
