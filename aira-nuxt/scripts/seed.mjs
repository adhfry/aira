// Generator seed data AIRA → server/data/db.json
// Jalankan: npm run seed  (deterministik; butuh scripts/data/geo-sumenep.json dari fetch-geo.mjs)
//
// FONDASI DATA — studi kasus nyata Kota Sumenep:
//  [BRIDA-ITS]  "Faktor-Faktor Penyebab Banjir Perkotaan di Kabupaten Sumenep", Karaton 5(1), 2026:
//               6 titik kritis; survei lapangan 31 Okt 2025 mencatat 15 titik genangan 30–45 cm selama beberapa jam.
//  [DRAINASE]   Resmani, Andawayanti & Cahya (2017), J. Teknik Pengairan 8(2): 8 outlet, kapasitas,
//               status genangan kala ulang 5 tahun, panjang pengaruh backwater Sungai Marengan.
//  [MARENGAN]   Prosiding PSPK 3 UKWMS (2024): koordinat hulu & hilir Sungai Marengan.
//
// SUMBER KOORDINAT (semua titik ditentukan, tidak ada titik "perkiraan"):
//  - data_resmi : Pusdatin Kemendikdasmen (SDN Pajagalan I, Jl. Dr. Wahidin)
//  - penelitian : koordinat yang tertulis di publikasi (hulu/hilir Sungai Marengan)
//  - osm        : geometri jalan/sungai/desa OpenStreetMap (© kontributor OSM, ODbL)
//  - direktori  : geocode alamat usaha terdaftar (idalamat.com) pada jalan yang disebut penelitian
// Titik CCTV & sensor adalah TITIK PANTAU USULAN AIRA yang ditempatkan pada lokasi bersumber di atas.
// Nilai sensor, status, kejadian terkini, dan notifikasi = SKENARIO SIMULASI hujan sangat lebat.
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { clipNear, dist, loadJson, longest, nearestVertex, pointAt, round6 } from './lib/geo.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'server/data/db.json')
const riverOut = resolve(root, 'assets/geo/kali-marengan.json')
const geo = loadJson(resolve(root, 'scripts/data/geo-sumenep.json'))
if (!geo) throw new Error('Jalankan dulu: node scripts/fetch-geo.mjs')
const ELEV = loadJson(resolve(root, 'scripts/data/elevations.json'), {})

// ---------- PRNG deterministik ----------
let seed = 20260218
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

const ANCHOR = new Date('2026-09-24T10:24:18+07:00').getTime()
const iso = (msBefore) => new Date(ANCHOR - msBefore).toISOString()
const MIN = 60_000
const HOUR = 60 * MIN

// ---------- Akses geometri OSM ----------
const road = (name, filter = () => true) => {
  const ways = geo.roads[name]
  if (!ways) throw new Error(`Jalan tidak ada di data OSM: ${name}`)
  return ways.filter((w) => filter(w.geometry)).map((w) => w.geometry)
}
const wayCenterLng = (g) => g.reduce((a, p) => a + p[1], 0) / g.length
const place = (name) => {
  const p = geo.places.find((x) => x.name === name)
  if (!p) throw new Error(`Tempat tidak ada di data OSM: ${name}`)
  return [p.lat, p.lng]
}
const river = geo.rivers['Kali Marengan'].map((w) => w.geometry)
const riverLine = longest(river)

// ---------- Titik referensi bersumber ----------
const REF = {
  sdnPajagalan: { p: [-7.010492, 113.863241], src: 'data_resmi', note: 'SDN Pajagalan I, Jl. Dr. Wahidin — koordinat Pusdatin Kemendikdasmen (NPSN 20530026).' },
  marenganHulu: { p: [-7.00806, 113.87], src: 'penelitian', note: 'Hulu Sungai Marengan 07°00\'29" LS, 113°52\'12" BT (Prosiding PSPK 3 UKWMS, 2024).' },
  marenganHilir: { p: [-7.03611, 113.88972], src: 'penelitian', note: 'Hilir Sungai Marengan 07°02\'10" LS, 113°53\'23" BT (Prosiding PSPK 3 UKWMS, 2024).' },
  kartini: { p: [-7.0037371, 113.8646808], src: 'direktori', note: 'Jl. Kartini No. 50a, Pangarangan/Kepanjin — geocode alamat terdaftar (idalamat.com).' },
  jatiEmas: { p: [-7.0037996, 113.8706738], src: 'direktori', note: 'Jl. Jati Emas, Pangarangan — geocode alamat terdaftar (idalamat.com).' },
  pasarAnom: { p: [-7.0162642, 113.8588113], src: 'direktori', note: 'Kawasan Pasar Anom Baru, Jl. Trunojoyo, Kolor — geocode alamat terdaftar (idalamat.com).' },
  bsa: { p: place('Warunk BSA'), src: 'osm', note: 'Perum Bumi Sumekar Asri (BSA), Kolor — objek OSM "Warunk BSA" di Jl. Dewi Sartika (blok BSA).' },
  pmi: { p: [-7.01441, 113.86216], src: 'osm', note: 'Jl. Dr. Cipto No. 21 (PMI Kabupaten Sumenep) — objek OpenStreetMap.' },
  marenganLaok: { p: place('Marengan Laok'), src: 'osm', note: 'Desa Marengan Laok — node desa OpenStreetMap.' },
  marenganDaya: { p: place('Marengan Daya'), src: 'osm', note: 'Desa Marengan Daya — node desa OpenStreetMap.' },
  bandara: { p: place('Bandar Udara Trunojoyo'), src: 'osm', note: 'Kompleks Bandar Udara Trunojoyo (lokasi Stasiun Meteorologi Trunojoyo BMKG) — OpenStreetMap.' },
}

// ---------- Geometri koridor dari OSM ----------
const PATH = {
  krt01: [...road('Jalan Kyai Haji Sajad'), ...road('Jalan Dokter Wahidin Sudirohusodo'), ...road('Jalan Dokter Setiabudi')],
  bsa: [...road('Jalan Dewi Sartika'), ...road('Jalan Cendana IV'), ...road('Jalan Cempaka III')],
  satelit: road('Pesona Satelit', (g) => wayCenterLng(g) > 113.871),
  asabri: road('Pesona Satelit', (g) => wayCenterLng(g) <= 113.871),
  krt05: [[REF.kartini.p, REF.jatiEmas.p], ...road('Jalan KH. Agus Salim'), ...road('Jalan Imam Bonjol'), ...road('Jalan Pahlawan')],
  hilir: clipNear(river, REF.marenganHilir.p, 900),
  out01: [...road('Jalan Diponegoro'), ...road('Jalan Panglima Besar Sudirman'), ...road('Jalan Jenderal Achmad Yani')],
  out04: road('Jalan Dokter Cipto Mangunkusumo'),
  out05: [...road('Jalan KH. Mas Mansyur', (g) => wayCenterLng(g) < 113.884), ...road('Jalan Raung'), ...road('Jalan Jenderal Urip Sumoharjo')],
  out06: [...road('Jalan Kyai Haji Wahid Hasyim'), ...clipNear(road('Jalan Trunojoyo'), REF.pasarAnom.p, 350)],
  out07: [...road('Jalan KH. Mas Mansyur', (g) => wayCenterLng(g) >= 113.884), ...road('Jalan Yos Sudarso')],
  hulu: clipNear(river, REF.marenganHulu.p, 1200),
}

const mid = (lines) => ({ p: pointAt(longest(lines), 0.5), src: 'osm' })
const onRoadRef = (name) => ({ p: pointAt(longest(road(name)), 0.5), src: 'osm', note: `Titik tengah ruas OSM "${name}".` })

// ---------- Skor risiko berbasis aturan (transparan) ----------
// Struktural: 40 + titik kritis BRIDA–ITS (+15: kapasitas terbatas, sedimentasi, alih fungsi lahan) + tergenang Q5 (+25)
//             + backwater (+panjang/100, maks 15) + sumber backwater outlet 4–7 (+20) + kapasitas kecil (<2 m³/s +10; <5 +5) + elevasi SRTM ≤6 m (+10)
// Historis  : 30 + titik kritis BRIDA–ITS (+25) + tercatat pada 15 titik survei lapangan 31 Okt 2025 (+20) + tergenang Q5 2017 (+10)
const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)))
function scores(z) {
  const elev = ELEV[z.code]
  const structural =
    40 +
    (z.brida ? 15 : 0) +
    (z.backwaterSource ? 20 : 0) +
    (z.drainageStatus === 'tergenang' ? 25 : 0) +
    (z.backwaterLength ? Math.min(15, z.backwaterLength / 100) : 0) +
    (z.capacity !== null ? (z.capacity < 2 ? 10 : z.capacity < 5 ? 5 : 0) : 0) +
    (elev !== undefined && elev <= 6 ? 10 : 0)
  const historical = 30 + (z.brida ? 25 : 0) + (z.survey ? 20 : 0) + (z.drainageStatus === 'tergenang' ? 10 : 0)
  return { structuralRisk: clamp(structural), historicalRisk: clamp(historical) }
}

const SRC = {
  brida: 'BRIDA Sumenep × ITS (2026) — titik kritis banjir perkotaan',
  survey: 'Survei lapangan BRIDA–ITS 31 Okt 2025 — 15 titik genangan 30–45 cm',
  drain: 'Resmani dkk. (2017) — kajian kapasitas drainase Kota Sumenep (SWMM)',
  marengan: 'Prosiding PSPK 3 UKWMS (2024) — koordinat Sungai Marengan',
  osm: 'Geometri jalan/sungai: OpenStreetMap (ODbL)',
}

// ---------- Zona risiko ----------
const zoneDefs = [
  {
    code: 'KRT-01', name: 'Dr. Wahidin – Setiabudi', type: 'titik_kritis', outlet: 3, district: 'Kota Sumenep',
    network: 'Outlet 3: Jl. KH Sajad → Jl. Dr. Wahidin; koridor Jl. Dr. Wahidin – Jl. Dr. Setiabudi (Pajagalan)',
    capacity: 2.52, drainageStatus: 'cukup', backwaterLength: null, brida: true, survey: true,
    anchor: REF.sdnPajagalan, path: PATH.krt01, radius: 250,
    notes: 'Titik kritis BRIDA–ITS; Jl. Dr. Wahidin & Jl. Setiabudi tercatat pada survei lapangan. Outlet 3 cukup pada Q5 (2017).',
  },
  {
    code: 'KRT-02', name: 'Perumahan Bumi Sumekar Asri', type: 'titik_kritis', outlet: 6, district: 'Kota Sumenep',
    network: 'Outlet 6: Wahid Hasyim → Pasar Anom → Bumi Sumekar → Satelit → Kali Marengan (blok Dewi Sartika/Cendana/Cempaka)',
    capacity: 6.2, drainageStatus: 'tergenang', backwaterLength: 507.41, brida: true, survey: true,
    anchor: REF.bsa, path: PATH.bsa, radius: 220,
    notes: 'Titik kritis BRIDA–ITS di jalur Outlet 6 (tergenang, backwater ±507 m). Alamat: Jl. Sultan Abdurrahman, Gudang, Kolor.',
  },
  {
    code: 'KRT-03', name: 'Perumahan Satelit', type: 'titik_kritis', outlet: 6, district: 'Kota Sumenep',
    network: 'Hilir jaringan Outlet 6: Bumi Sumekar → Satelit (Jl. Pesona Satelit) → Kali Marengan',
    capacity: 6.2, drainageStatus: 'tergenang', backwaterLength: 507.41, brida: true, survey: true,
    anchor: null, path: PATH.satelit, radius: 220,
    notes: 'Titik kritis BRIDA–ITS; ruas hilir Outlet 6 terdekat dengan Kali Marengan.',
  },
  {
    code: 'KRT-04', name: 'Perumahan Asabri', type: 'titik_kritis', outlet: null, district: 'Kota Sumenep',
    network: 'Jl. Argopuro Gg. 1, Desa Kolor (kompleks Perum Satelit) — saluran irigasi bocor',
    capacity: null, drainageStatus: 'tidak_dikaji', backwaterLength: null, brida: true, survey: true,
    anchor: null, path: PATH.asabri, radius: 200,
    coordNote:
      'Alamat riset: Perumahan Asabri, Jl. Argopuro Gg. 1 No. 5 Desa Kolor. Alamat publik "Perum Satelit Jl. Argopuro no. 18 Kolor" menempatkan Jl. Argopuro di kompleks Perum Satelit → dipetakan ke ruas OSM "Pesona Satelit" sisi barat (arah Kolor).',
    notes: 'BRIDA–ITS menemukan kebocoran saluran irigasi; penanganan difokuskan pada perbaikan kebocoran.',
  },
  {
    code: 'KRT-05', name: 'Kartini – Jati Emas', type: 'titik_kritis', outlet: 2, district: 'Kota Sumenep',
    network: 'Outlet 2: Imam Bonjol → KH Agus Salim → Pahlawan → Kartini; koridor Jl. Kartini – Jl. Jati Emas (Pangarangan)',
    capacity: 7.15, drainageStatus: 'tergenang', backwaterLength: null, brida: true, survey: true,
    anchor: REF.kartini, path: PATH.krt05, radius: 250,
    notes: 'Titik kritis BRIDA–ITS; Jl. Agus Salim tercatat pada survei lapangan. Outlet 2 tidak mampu menampung Q5.',
  },
  {
    code: 'KRT-06', name: 'Hilir Sungai Marengan', type: 'titik_kritis', outlet: null, district: 'Kalianget',
    network: 'Hilir Kali Marengan — penerima Outlet 4–8; DAS Marengan Q10 ±115 m³/s',
    capacity: null, drainageStatus: 'tidak_dikaji', backwaterLength: null, brida: true, survey: true, backwaterSource: true,
    anchor: REF.marenganHilir, path: PATH.hilir, radius: 350,
    notes: 'Titik kritis BRIDA–ITS; sumber backwater bagi outlet 4, 5, 6, dan 7.',
  },
  {
    code: 'OUT-01', name: 'Outlet 1 – Diponegoro', type: 'outlet_drainase', outlet: 1, district: 'Kota Sumenep',
    network: 'Jl. Diponegoro → Jl. Jenderal Sudirman → Jl. Ahmad Yani', capacity: 3.53, drainageStatus: 'tergenang', backwaterLength: null,
    brida: false, survey: false, anchor: null, path: PATH.out01, radius: 250, notes: 'Tidak mampu menampung debit rencana kala ulang 5 tahun.',
  },
  {
    code: 'OUT-04', name: 'Outlet 4 – Dr. Cipto', type: 'outlet_drainase', outlet: 4, district: 'Kota Sumenep',
    network: 'Jl. Dr. Cipto Mangunkusumo', capacity: 1.21, drainageStatus: 'tergenang', backwaterLength: 317.93,
    brida: false, survey: true, anchor: REF.pmi, path: PATH.out04, radius: 220, notes: 'Tergenang; backwater ±317,93 m. Jl. Dr. Cipto tercatat pada survei lapangan.',
  },
  {
    code: 'OUT-05', name: 'Outlet 5 – KH Mansyur – Raung – Urip Sumoharjo', type: 'outlet_drainase', outlet: 5, district: 'Kota Sumenep',
    network: 'Jl. KH Mas Mansyur → Jl. Raung → Jl. Urip Sumoharjo', capacity: 4.65, drainageStatus: 'tergenang', backwaterLength: 677.5,
    brida: false, survey: true, anchor: onRoadRef('Jalan Raung'), path: PATH.out05, radius: 250, notes: 'Tergenang; backwater ±677,50 m. Jl. Urip Sumoharjo tercatat pada survei lapangan.',
  },
  {
    code: 'OUT-06', name: 'Outlet 6 – Wahid Hasyim – Pasar Anom', type: 'outlet_drainase', outlet: 6, district: 'Kota Sumenep',
    network: 'Hulu jaringan Outlet 6: Jl. KH Wahid Hasyim → Pasar Anom (Jl. Trunojoyo)', capacity: 6.2, drainageStatus: 'tergenang', backwaterLength: 507.41,
    brida: false, survey: true, anchor: REF.pasarAnom, path: PATH.out06, radius: 220,
    notes: 'Hulu Outlet 6; Jl. Trunojoyo tercatat pada survei lapangan. Pemantauan berantai 06A → 06B → 06C.',
  },
  {
    code: 'OUT-07', name: "Outlet 7 – Kalimo'ok – Marengan Daya", type: 'outlet_drainase', outlet: 7, district: 'Kota Sumenep',
    network: "Kalimo'ok → Marengan Daya (Jl. KH Mas Mansyur timur – Jl. Yos Sudarso)", capacity: 1.47, drainageStatus: 'cukup', backwaterLength: 1523.41,
    brida: false, survey: false, anchor: null, path: PATH.out07, radius: 250, notes: 'Kapasitas cukup (2017) namun pengaruh backwater terpanjang ±1.523,41 m.',
  },
  {
    code: 'OUT-08', name: 'Outlet 8 – Marengan Laok', type: 'outlet_drainase', outlet: 8, district: 'Kalianget',
    network: 'Desa Marengan Laok', capacity: 0.6, drainageStatus: 'tergenang', backwaterLength: null,
    brida: false, survey: false, anchor: REF.marenganLaok, path: [], radius: 300, notes: 'Kapasitas terkecil (0,60 m³/s); tergenang.',
  },
  {
    code: 'SGI-01', name: 'Hulu Sungai Marengan', type: 'sungai', outlet: null, district: 'Kota Sumenep',
    network: 'Kali Marengan (hulu)', capacity: null, drainageStatus: 'tidak_dikaji', backwaterLength: null,
    brida: false, survey: false, anchor: REF.marenganHulu, path: PATH.hulu, radius: 300, notes: 'Titik pantau debit masuk untuk prediksi kenaikan muka air hilir.',
  },
]

const zones = zoneDefs.map((d, i) => {
  const a = d.anchor ?? mid(d.path)
  const sources = [
    ...(d.brida ? [SRC.brida] : []),
    ...(d.survey ? [SRC.survey] : []),
    ...(d.outlet ? [SRC.drain] : []),
    ...(d.code === 'KRT-06' || d.code === 'SGI-01' ? [SRC.marengan] : []),
    ...(d.path.length ? [SRC.osm] : []),
  ]
  const coordNote =
    d.coordNote ??
    (d.anchor ? d.anchor.note : `Titik tengah ruas OSM terpanjang pada koridor (${d.network.split(':').pop().trim()}).`)
  const z = {
    id: `zon-${pad(i + 1)}`,
    code: d.code,
    name: d.name,
    type: d.type,
    outlet: d.outlet,
    network: d.network,
    district: d.district,
    sources,
    capacity: d.capacity,
    drainageStatus: d.drainageStatus,
    backwaterLength: d.backwaterLength,
    lat: a.p[0],
    lng: a.p[1],
    radius: d.radius,
    coordAccuracy: a.src,
    coordNote,
    elevation: ELEV[d.code] === undefined ? null : Math.max(0, ELEV[d.code]),
    path: d.path.map((l) => l.map(round6)),
    notes: d.notes,
  }
  return { ...z, ...scores({ ...d, code: d.code }) }
})
const Z = Object.fromEntries(zones.map((z) => [z.code, z]))

// ---------- Kecamatan (konteks regional — persentase risiko = simulasi) ----------
const districtsRaw = [
  ['Kota Sumenep', 85, 76_450, -7.0086, 113.8594],
  ['Kalianget', 68, 41_870, -7.0506, 113.9291],
  ['Batuan', 55, 34_110, -6.9894, 113.8321],
  ['Saronggi', 52, 39_240, -7.0741, 113.8653],
  ['Lenteng', 44, 60_330, -6.9642, 113.8032],
  ['Manding', 40, 37_780, -6.9321, 113.8702],
  ['Bluto', 38, 49_560, -7.0851, 113.7964],
  ['Batuputih', 33, 51_210, -6.9535, 113.9661],
  ['Dasuk', 30, 38_920, -6.9282, 113.8421],
  ['Ambunten', 26, 43_190, -6.8942, 113.7443],
  ['Pasongsongan', 22, 47_050, -6.9021, 113.6612],
]
const riskLevelOf = (p) => (p >= 70 ? 'bahaya' : p >= 50 ? 'siaga' : p >= 35 ? 'waspada' : 'normal')
const districts = districtsRaw.map(([name, riskPercentage, population, lat, lng], i) => ({
  id: `kec-${pad(i + 1)}`,
  name,
  riskLevel: riskLevelOf(riskPercentage),
  riskPercentage,
  population,
  coordinates: { lat, lng },
}))

// ---------- Kamera CCTV — titik pantau usulan pada lokasi bersumber ----------
const CCTV_IMG = 'https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=600&auto=format&fit=crop'
const DRONE_A = '/images/hero/sumenep-drone.jpg'
const DRONE_B = '/images/hero/sumenep-drone-1.jpg'
// Foto kondisi nyata Sumenep (public/images/sumenep) dipasang sesuai jenis lokasi & kondisi titik pantau
const IMG = {
  sungai: '/images/sumenep/sungai-meluap.jpg',
  perumahan: '/images/sumenep/banjir-perumahan.jpg',
  jalan: '/images/sumenep/banjir-jalan.jpg',
  desa: '/images/sumenep/banjir-desa-aerial.jpg',
  kota: '/images/sumenep/taman-bunga-jalan.jpg',
}
const CAMERA_IMAGE = {
  'AIRA-001': IMG.jalan, 'AIRA-002': IMG.jalan, 'AIRA-003': IMG.perumahan, 'AIRA-004': IMG.perumahan, 'AIRA-005': IMG.perumahan,
  'AIRA-006': IMG.jalan, 'AIRA-007': DRONE_B, 'AIRA-008': IMG.sungai, 'AIRA-009': IMG.jalan, 'AIRA-010': IMG.jalan,
  'AIRA-011': DRONE_A, 'AIRA-012': DRONE_B, 'AIRA-013': DRONE_A, 'AIRA-014': IMG.desa, 'AIRA-015': IMG.kota,
  'AIRA-016': IMG.sungai, 'AIRA-017': IMG.jalan, 'AIRA-018': IMG.jalan,
}

const onRoad = (name, frac = 0.5, filter) => ({ p: pointAt(longest(road(name, filter)), frac), src: 'osm', note: `Titik pada ruas OSM "${name}".` })
const onRiver = (ref) => {
  const n = nearestVertex(river, ref.p)
  return { p: n.point, src: 'osm', note: `Tepi Kali Marengan (geometri OSM), ${n.distance} m dari titik penelitian.` }
}

// [kode, nama, lokasi, zona, status, online, titik]
const cameraList = [
  ['AIRA-001', 'Jl. Dr. Wahidin', 'Depan SDN Pajagalan I', 'KRT-01', 'siaga', true, REF.sdnPajagalan],
  ['AIRA-002', 'Jl. Dr. Setiabudi', 'Koridor Setiabudi, Pajagalan', 'KRT-01', 'waspada', true, onRoad('Jalan Dokter Setiabudi')],
  ['AIRA-003', 'Perum Bumi Sumekar Asri', 'Jl. Dewi Sartika, blok BSA', 'KRT-02', 'siaga', true, REF.bsa],
  ['AIRA-004', 'Perum Satelit', 'Jl. Pesona Satelit', 'KRT-03', 'bahaya', true, onRoad('Pesona Satelit', 0.5, (g) => wayCenterLng(g) > 113.873)],
  ['AIRA-005', 'Perum Asabri', 'Jl. Argopuro, Kolor', 'KRT-04', 'waspada', true, { ...mid(PATH.asabri), note: 'Ruas OSM "Pesona Satelit" sisi barat (Jl. Argopuro, Kolor).' }],
  ['AIRA-006', 'Jl. Kartini', 'Jl. Kartini No. 50a', 'KRT-05', 'siaga', true, REF.kartini],
  ['AIRA-007', 'Jl. Jati Emas', 'Pangarangan', 'KRT-05', 'waspada', true, REF.jatiEmas],
  ['AIRA-008', 'Hilir Kali Marengan', 'Muara Marengan', 'KRT-06', 'bahaya', true, REF.marenganHilir],
  ['AIRA-009', 'Jl. Dr. Cipto', 'Depan PMI Kab. Sumenep', 'OUT-04', 'siaga', true, REF.pmi],
  ['AIRA-010', 'Jl. Raung', 'Outlet 5, Pabian', 'OUT-05', 'siaga', true, onRoad('Jalan Raung')],
  ['AIRA-011', 'Jl. KH Wahid Hasyim (CCTV-06A)', 'Hulu Outlet 6', 'OUT-06', 'waspada', true, onRoad('Jalan Kyai Haji Wahid Hasyim')],
  ['AIRA-012', 'Pasar Anom Baru (CCTV-06B)', 'Jl. Trunojoyo, Kolor', 'OUT-06', 'waspada', true, REF.pasarAnom],
  ['AIRA-013', "Kalimo'ok – Marengan Daya", 'Jl. Yos Sudarso', 'OUT-07', 'normal', false, onRoad('Jalan Yos Sudarso')],
  ['AIRA-014', 'Desa Marengan Laok', 'Outlet 8', 'OUT-08', 'siaga', true, REF.marenganLaok],
  ['AIRA-015', 'Jl. Panglima Besar Sudirman', 'Outlet 1, pusat kota', 'OUT-01', 'waspada', true, onRoad('Jalan Panglima Besar Sudirman')],
  ['AIRA-016', 'Hulu Kali Marengan', 'Hulu Marengan', 'SGI-01', 'normal', true, REF.marenganHulu],
  ['AIRA-017', 'Jl. Urip Sumoharjo', 'Outlet 5 hilir', 'OUT-05', 'siaga', true, onRoad('Jalan Jenderal Urip Sumoharjo')],
  ['AIRA-018', 'Jl. KH Agus Salim', 'Outlet 2', 'KRT-05', 'waspada', true, onRoad('Jalan KH. Agus Salim')],
]

const cameras = cameraList.map(([code, name, location, zone, status, isOnline, pt], i) => ({
  id: `cam-${pad(i + 1)}`,
  code,
  name,
  location,
  district: Z[zone].district,
  zoneId: Z[zone].id,
  status,
  imageUrl: CAMERA_IMAGE[code] ?? CCTV_IMG,
  lat: pt.p[0],
  lng: pt.p[1],
  coordAccuracy: pt.src,
  coordNote: pt.note,
  lastUpdate: iso(isOnline ? Math.round(between(0, 40)) * 1000 : 97 * MIN),
  isOnline,
}))

// ---------- Sensor IoT ----------
function history(points, base, drift, noise, decimals = 0) {
  const arr = []
  for (let i = points - 1; i >= 0; i--) {
    const progress = (points - 1 - i) / (points - 1)
    const value = Math.max(0, base - drift * (1 - progress) + between(-noise, noise))
    arr.push({ time: iso(i * HOUR), value: round(value, decimals) })
  }
  return arr
}
const UNIT = { water_level: 'cm', river_level: 'cm', tide: 'cm', rainfall: 'mm/jam', weather: '°C' }

// Mulut outlet = ujung ruas HILIR (jalan terakhir pada urutan aliran penelitian) yang paling dekat Kali Marengan.
const outletMouth = (lines, label) => {
  let best = null
  for (const l of lines) for (const p of [l[0], l[l.length - 1]]) {
    const n = nearestVertex(river, p)
    if (!best || n.distance < best.d) best = { p, d: n.distance }
  }
  const onRiverPt = nearestVertex(river, best.p).point
  return {
    drain: { p: round6(best.p), src: 'osm', note: `Mulut outlet: ujung ruas ${label} terdekat ke Kali Marengan (${best.d} m) — geometri OSM.` },
    river: { p: onRiverPt, src: 'osm', note: `Sisi Kali Marengan di mulut outlet ${label} — vertex sungai OSM terdekat.` },
  }
}
const MOUTH = {
  o4: outletMouth(PATH.out04, 'Jl. Dr. Cipto'),
  o5: outletMouth(road('Jalan Jenderal Urip Sumoharjo'), 'Jl. Urip Sumoharjo'),
  o6: outletMouth(PATH.satelit, 'Jl. Pesona Satelit'),
  o7: outletMouth(road('Jalan Yos Sudarso'), 'Jl. Yos Sudarso (Marengan Daya)'),
}

// Status TMA dari rasio isi terhadap kedalaman saluran/tinggi tanggul:
// ≥100% meluap (bahaya) · ≥85% siaga · ≥65% waspada · lainnya normal
const fillStatus = (value, depth) => {
  const r = value / depth
  return r >= 1 ? 'bahaya' : r >= 0.85 ? 'siaga' : r >= 0.65 ? 'waspada' : 'normal'
}

// TMA saluran = tinggi air dari dasar saluran (cm); channelDepth = kedalaman saluran (cm).
// Pasangan di mulut outlet 4–7 memakai peilschaal yang sama (nol = dasar pintu outlet):
// Δ = TMA sisi sungai − TMA sisi saluran → positif = backwater.
// [kode, tipe, nama, lokasi, zona, nilai, kedalaman|null, tren, status|null(auto), online, titik]
const sensorList = [
  ['SNS-01', 'water_level', 'TMA Saluran Outlet 1', 'Jl. Diponegoro', 'OUT-01', 84, 120, 'up', null, true, onRoad('Jalan Diponegoro')],
  ['SNS-02', 'water_level', 'TMA Saluran Outlet 2', 'Jl. KH Agus Salim', 'KRT-05', 90, 100, 'up', null, true, onRoad('Jalan KH. Agus Salim', 0.7)],
  ['SNS-03', 'water_level', 'TMA Saluran Outlet 3', 'Jl. Dr. Wahidin (SDN Pajagalan I)', 'KRT-01', 110, 80, 'up', null, true, REF.sdnPajagalan],
  ['SNS-04', 'water_level', 'TMA Mulut Outlet 4 – sisi saluran', 'Jl. Dr. Cipto', 'OUT-04', 132, 150, 'up', null, true, MOUTH.o4.drain],
  ['SNS-05', 'river_level', 'TMA Mulut Outlet 4 – sisi sungai', 'Kali Marengan', 'OUT-04', 177, 250, 'up', null, true, MOUTH.o4.river],
  ['SNS-06', 'water_level', 'TMA Mulut Outlet 5 – sisi saluran', 'Jl. Urip Sumoharjo', 'OUT-05', 118, 150, 'up', null, true, MOUTH.o5.drain],
  ['SNS-07', 'river_level', 'TMA Mulut Outlet 5 – sisi sungai', 'Kali Marengan', 'OUT-05', 143, 250, 'up', null, true, MOUTH.o5.river],
  ['SNS-08', 'water_level', 'TMA Outlet 6A – Wahid Hasyim', 'Jl. KH Wahid Hasyim', 'OUT-06', 72, 100, 'up', null, true, onRoad('Jalan Kyai Haji Wahid Hasyim', 0.3)],
  ['SNS-09', 'water_level', 'TMA Outlet 6B – Bumi Sumekar', 'Jl. Dewi Sartika (blok BSA)', 'KRT-02', 96, 100, 'up', null, true, onRoad('Jalan Dewi Sartika')],
  ['SNS-10', 'water_level', 'TMA Outlet 6C – Satelit (mulut, sisi saluran)', 'Jl. Pesona Satelit', 'KRT-03', 160, 120, 'up', null, true, MOUTH.o6.drain],
  ['SNS-11', 'river_level', 'TMA Mulut Outlet 6 – sisi sungai', 'Kali Marengan', 'KRT-03', 168, 250, 'up', null, true, MOUTH.o6.river],
  ['SNS-12', 'water_level', 'TMA Mulut Outlet 7 – sisi saluran', 'Jl. Yos Sudarso', 'OUT-07', 95, 150, 'stable', null, true, MOUTH.o7.drain],
  ['SNS-13', 'river_level', 'TMA Mulut Outlet 7 – sisi sungai', 'Kali Marengan', 'OUT-07', 80, 250, 'stable', null, true, MOUTH.o7.river],
  ['SNS-14', 'water_level', 'TMA Saluran Outlet 8', 'Desa Marengan Laok', 'OUT-08', 74, 80, 'up', null, true, REF.marenganLaok],
  ['SNS-15', 'water_level', 'TMA Saluran Irigasi Asabri', 'Jl. Argopuro, Kolor', 'KRT-04', 49, 60, 'stable', null, true, { ...mid(PATH.asabri), note: 'Ruas OSM "Pesona Satelit" sisi barat (Jl. Argopuro, Kolor).' }],
  ['SNS-16', 'river_level', 'TMA Kali Marengan Hulu', 'Hulu Marengan', 'SGI-01', 215, 300, 'up', null, true, onRiver(REF.marenganHulu)],
  ['SNS-17', 'river_level', 'TMA Kali Marengan Hilir', 'Hilir Marengan', 'KRT-06', 285, 280, 'up', null, true, REF.marenganHilir],
  ['SNS-18', 'tide', 'Pasang Muara Marengan', 'Muara Kali Marengan', 'KRT-06', 132, null, 'up', 'siaga', true, { p: round6(riverLine[riverLine.length - 1]), src: 'osm', note: 'Ujung hilir geometri OSM Kali Marengan (muara).' }],
  ['SNS-19', 'rainfall', 'ARG Pajagalan', 'SDN Pajagalan I', 'KRT-01', 45, null, 'up', 'bahaya', true, REF.sdnPajagalan],
  ['SNS-20', 'rainfall', 'ARG Bandara Trunojoyo', 'Stasiun Meteorologi Trunojoyo', 'OUT-07', 38, null, 'up', 'siaga', true, REF.bandara],
  ['SNS-21', 'rainfall', 'ARG Marengan Laok', 'Desa Marengan Laok', 'OUT-08', 24, null, 'stable', 'waspada', false, REF.marenganLaok],
  ['SNS-22', 'weather', 'AWS Pusat Kota', 'RSUD dr. H. Moh. Anwar', 'OUT-06', 28, null, 'stable', 'normal', true, { p: place('RSUD Dr. H. Moh. Anwar'), src: 'osm', note: 'RSUD dr. H. Moh. Anwar — objek OpenStreetMap.' }],
  ['SNS-23', 'weather', 'AWS Bandara Trunojoyo', 'Stasiun Meteorologi Trunojoyo', 'OUT-07', 29, null, 'up', 'normal', true, REF.bandara],
]

const usedPoints = new Map()
const sensors = sensorList.map(([code, type, name, location, zone, value, depth, trend, status, isOnline, pt], i) => {
  const drift = trend === 'up' ? value * 0.22 : trend === 'down' ? -value * 0.15 : 0
  const noise = type === 'weather' ? 0.8 : value * 0.03
  const hist = history(12, value, drift, noise, type === 'weather' ? 1 : 0)
  hist[hist.length - 1].value = value
  // Perangkat yang berbagi tiang/lokasi yang sama digeser ±4 m agar pin tidak menumpuk
  const key = pt.p.join(',')
  const n = usedPoints.get(key) ?? 0
  usedPoints.set(key, n + 1)
  const offset = n * 0.00004
  return {
    id: `sen-${pad(i + 1)}`,
    code,
    type,
    name,
    location,
    district: Z[zone].district,
    zoneId: Z[zone].id,
    value,
    unit: UNIT[type],
    channelDepth: depth,
    trend,
    status: status ?? fillStatus(value, depth),
    lat: round(pt.p[0] + offset, 6),
    lng: round(pt.p[1] + offset, 6),
    coordAccuracy: pt.src,
    coordNote: n ? `${pt.note} (satu tiang dengan perangkat lain, offset ±${Math.round(n * 4)} m)` : pt.note,
    isOnline,
    lastUpdate: iso(isOnline ? Math.round(between(0, 30)) * 1000 : 95 * MIN),
    history: hist,
  }
})

// Status kamera konsisten dengan sensor TMA terdekat di zona yang sama (≤ 600 m); bila tidak ada, pakai status awal.
const ORDER = { normal: 0, waspada: 1, siaga: 2, bahaya: 3 }
for (const c of cameras) {
  const near = sensors
    .filter((s) => s.zoneId === c.zoneId && (s.type === 'water_level' || s.type === 'river_level') && s.isOnline)
    .map((s) => ({ s, d: dist([c.lat, c.lng], [s.lat, s.lng]) }))
    .filter((x) => x.d <= 600)
    .sort((a, b) => a.d - b.d)[0]
  if (near) c.status = near.s.status
  else if (ORDER[c.status] === undefined) c.status = 'normal'
}

// ---------- Kejadian ----------
// dateFixed: tanggal nyata (tidak digeser); lainnya = skenario simulasi relatif terhadap waktu sekarang.
// [judul, tipe, zona|null, kecamatan, lokasi, deskripsi, tingkat, status, menitLalu|tanggal, pelapor]
const incidentList = [
  ['Backwater Kali Marengan', 'backwater', 'OUT-04', null, 'Mulut Outlet 4 – Jl. Dr. Cipto', 'TMA sisi Kali Marengan 45 cm di atas TMA sisi saluran di mulut Outlet 4 — aliran saluran tertahan (pengaruh backwater ±318 m)', 'bahaya', 'aktif', 0, 'AIRA Risk Engine'],
  ['Genangan Perum Satelit', 'peringatan', 'KRT-03', null, 'Jl. Pesona Satelit', 'CCTV AIRA-004 mendeteksi genangan ±40 cm; saluran mulut Outlet 6C meluap (TMA 160 cm pada kedalaman 120 cm) dan tertahan backwater Δ +8 cm', 'bahaya', 'aktif', 6, 'AIRA Risk Engine'],
  ['Hujan Sangat Lebat', 'hujan_tinggi', 'KRT-01', null, 'ARG Pajagalan', 'Intensitas 45 mm/jam (kategori BMKG: sangat lebat >20 mm/jam)', 'siaga', 'aktif', 12, 'Sistem AIRA'],
  ['Genangan Bergerak ke Hilir Outlet 6', 'peringatan', 'KRT-02', null, 'Perum Bumi Sumekar Asri', 'Kenaikan berurutan TMA 06A Wahid Hasyim → 06B BSA → 06C Satelit', 'siaga', 'aktif', 18, 'AIRA Risk Engine'],
  ['Verifikasi Lapangan', 'verifikasi', 'KRT-01', null, 'Jl. Dr. Wahidin', 'Petugas mengonfirmasi genangan ±30 cm di depan SDN Pajagalan I (saluran 80 cm meluap, TMA 110 cm)', 'siaga', 'ditangani', 25, 'Rizky Maulana'],
  ['Kamera Offline', 'offline', 'OUT-07', null, 'Jl. Yos Sudarso', "CCTV AIRA-013 Kalimo'ok – Marengan Daya tidak merespons", 'waspada', 'aktif', 63, 'Sistem AIRA'],
  ['Pasang Tinggi di Muara', 'backwater', 'KRT-06', null, 'Muara Kali Marengan', 'Pasang 132 cm bersamaan debit sungai tinggi — waspada arus balik outlet 4–7', 'siaga', 'ditangani', 75, 'AIRA Risk Engine'],
  ['Sensor Offline', 'offline', 'OUT-08', null, 'Desa Marengan Laok', 'Penakar hujan ARG Marengan Laok tidak mengirim data', 'waspada', 'aktif', 90, 'Sistem AIRA'],
  ['Luapan Saluran Jl. Kartini', 'peringatan', 'KRT-05', null, 'Jl. Kartini No. 50a', 'Saluran Outlet 2 meluap ke badan jalan', 'siaga', 'ditangani', 110, 'Dimas Pratama'],
  ['Kebocoran Saluran Irigasi Asabri', 'verifikasi', 'KRT-04', null, 'Jl. Argopuro Gg. 1, Kolor', 'Pemeriksaan kebocoran saluran irigasi (temuan BRIDA–ITS) — rembesan ke permukiman', 'waspada', 'ditangani', 180, 'Rizky Maulana'],
  ['Status Normal', 'normal', 'SGI-01', null, 'Hulu Kali Marengan', 'Debit hulu stabil', 'normal', 'selesai', 260, 'Sistem AIRA'],
  ['Pembersihan Sedimentasi Outlet 6', 'verifikasi', 'OUT-06', null, 'Jl. KH Wahid Hasyim', 'Pengerukan sedimen saluran (faktor penyebab menurut BRIDA–ITS)', 'waspada', 'selesai', 1_440, 'Dimas Pratama'],
  ['Genangan Desa Marengan Laok', 'peringatan', 'OUT-08', null, 'Desa Marengan Laok', 'Genangan akibat pasang & kapasitas Outlet 8 yang hanya 0,60 m³/s', 'siaga', 'selesai', 2_880, 'Siti Nurhaliza'],
  ['Genangan Jl. Dr. Cipto', 'peringatan', 'OUT-04', null, 'Jl. Dr. Cipto', 'Backwater menyebabkan saluran tidak dapat mengalir ke sungai', 'bahaya', 'selesai', 4_320, 'Rizky Maulana'],
  // Kejadian nyata (tanggal tetap) — survei & publikasi kajian
  ['Survei Lapangan Titik Rawan Banjir BRIDA–ITS', 'verifikasi', 'KRT-06', null, 'Kota Sumenep & sekitarnya', '15 titik genangan 30–45 cm selama beberapa jam, antara lain Jl. Dr. Wahidin, Jl. Setiabudi, Jl. Dr. Cipto, Jl. Trunojoyo, Jl. Urip Sumoharjo, Jl. Agus Salim, Perum BSA, Satelit, Asabri, dan hilir Sungai Marengan', 'siaga', 'selesai', '2025-10-31T09:00:00+07:00', 'BRIDA Sumenep × ITS'],
  ['Genangan Desa Patean', 'peringatan', null, 'Batuan', 'Desa Patean', 'Salah satu dari 15 titik genangan hasil survei BRIDA–ITS (luar kota)', 'waspada', 'selesai', '2025-10-31T11:00:00+07:00', 'BRIDA Sumenep × ITS'],
  ['Genangan Desa Nambakor & Muangan', 'peringatan', null, 'Saronggi', 'Desa Nambakor & Desa Muangan', 'Titik genangan hasil survei BRIDA–ITS di Kecamatan Saronggi', 'waspada', 'selesai', '2025-10-31T13:00:00+07:00', 'BRIDA Sumenep × ITS'],
  ['Genangan Desa Sendir', 'peringatan', null, 'Lenteng', 'Desa Sendir', 'Titik genangan hasil survei BRIDA–ITS di Kecamatan Lenteng', 'waspada', 'selesai', '2025-10-31T15:00:00+07:00', 'BRIDA Sumenep × ITS'],
  ['Rilis Hasil Kajian Banjir Perkotaan', 'normal', 'KRT-01', null, 'BRIDA Kabupaten Sumenep', 'Publikasi kajian faktor penyebab banjir perkotaan (Karaton Vol. 5 No. 1)', 'normal', 'selesai', '2026-02-18T09:00:00+07:00', 'BRIDA Sumenep × ITS'],
]
const incidents = incidentList.map(([title, type, zone, district, location, description, severity, status, when, reporter], i) => ({
  id: `inc-${pad(i + 1)}`,
  title,
  type,
  district: zone ? Z[zone].district : district,
  zoneId: zone ? Z[zone].id : '',
  location,
  description,
  severity,
  status,
  timestamp: typeof when === 'string' ? new Date(when).toISOString() : iso(when * MIN),
  reporter,
  ...(typeof when === 'string' ? { dateFixed: true } : {}),
}))

// ---------- Petugas ----------
const avatar = (id) => (id.startsWith('/') ? id : `https://images.unsplash.com/photo-${id}?q=80&w=100&auto=format&fit=crop`)
const users = [
  ['Ahda Firly Barori', 'Administrator', 'ahda.barori@sumenepkab.go.id', '0812-3456-7890', '/images/team/ahda-firly-barori.jpg', 'Kota Sumenep', 'aktif'],
  ['Siti Nurhaliza', 'Operator', 'siti.nurhaliza@sumenepkab.go.id', '0813-2211-4455', '1494790108377-be9c29b29330', 'Kota Sumenep', 'aktif'],
  ['Rizky Maulana', 'Petugas Lapangan', 'rizky.maulana@sumenepkab.go.id', '0857-3344-1122', '1500648767791-00dcc994a43e', 'Kota Sumenep', 'aktif'],
  ['Dimas Pratama', 'Petugas Lapangan', 'dimas.pratama@sumenepkab.go.id', '0821-7788-9900', '1472099645785-5658abf4ff4e', 'Kalianget', 'aktif'],
  ['Nabila Putri', 'Analis Data', 'nabila.putri@sumenepkab.go.id', '0838-5566-7788', '1438761681033-6461ffad8d80', 'Kota Sumenep', 'nonaktif'],
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
  ['BAHAYA – Backwater Outlet 4 & 5', 'Muka air Kali Marengan di atas mulut Outlet 4 (Jl. Dr. Cipto) dan Outlet 5 (KH Mansyur – Raung – Urip Sumoharjo). Siagakan pompa & tutup pintu air.', 'darurat', ['Petugas Lapangan', 'Dinas PU SDA'], 'terkirim', 1],
  ['Peringatan Dini – Perum Satelit', 'Genangan ±40 cm terdeteksi di Jl. Pesona Satelit (hilir Outlet 6). Warga diimbau memindahkan kendaraan & barang berharga.', 'darurat', ['Warga Perum Satelit', 'Warga Perum Asabri', 'Petugas Lapangan'], 'terkirim', 7],
  ['Hujan Sangat Lebat – Kota Sumenep', 'Intensitas 45 mm/jam di Pajagalan. Koridor Dr. Wahidin – Setiabudi dan Kartini – Jati Emas berpotensi tergenang 30–45 cm.', 'peringatan', ['Petugas Lapangan', 'Operator'], 'terkirim', 13],
  ['Waspada Perum Bumi Sumekar Asri', 'Kenaikan berurutan TMA Outlet 6A → 6B. Genangan diperkirakan mencapai blok BSA dalam 30–60 menit.', 'peringatan', ['Warga Perum Bumi Sumekar Asri'], 'gagal', 19],
  ['Kamera AIRA-013 Offline', "CCTV Kalimo'ok – Marengan Daya (Jl. Yos Sudarso) tidak merespons. Mohon pengecekan perangkat.", 'informasi', ['Operator'], 'terkirim', 64],
  ['Jadwal Pengerukan Outlet 6', 'Pengerukan sedimen saluran Jl. KH Wahid Hasyim – Pasar Anom dijadwalkan pekan depan.', 'informasi', ['Dinas PU SDA', 'Pedagang Pasar Anom Baru'], 'draft', 30],
  ['Uji Coba Sirene Marengan', 'Uji coba sirene peringatan dini di Desa Marengan Daya & Marengan Laok Sabtu pukul 09.00 WIB.', 'informasi', ['Warga Marengan Daya', 'Warga Marengan Laok'], 'draft', 45],
  ['Laporan Harian Banjir', 'Rekap kondisi 13 zona risiko (6 titik kritis BRIDA–ITS + outlet drainase) tersedia di dashboard AIRA.', 'informasi', ['Administrator', 'Analis Data'], 'draft', 5],
].map(([title, message, type, recipients, status, minutes], i) => ({
  id: `ntf-${pad(i + 1)}`,
  title,
  message,
  type,
  recipients,
  status,
  createdAt: iso(minutes * MIN),
}))

// ---------- Validasi logika sederhana ----------
for (const c of [...cameras, ...sensors]) {
  const z = zones.find((x) => x.id === c.zoneId)
  const d = Math.round(dist([c.lat, c.lng], [z.lat, z.lng]))
  if (d > 2500) console.warn(`PERINGATAN: ${c.code} berjarak ${d} m dari zona ${z.code}`)
}

const db = {
  meta: { anchor: new Date(ANCHOR).toISOString(), version: 3, geoSource: geo.source, geoFetchedAt: geo.fetchedAt },
  zones,
  cameras,
  sensors,
  incidents,
  districts,
  users,
  notifications,
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `${JSON.stringify(db, null, 2)}\n`)
mkdirSync(dirname(riverOut), { recursive: true })
writeFileSync(riverOut, `${JSON.stringify({ source: geo.source, name: 'Kali Marengan', lines: river.map((l) => l.map(round6)) })}\n`)
console.log(
  `Seed ditulis ke ${out}: ${zones.length} zona, ${cameras.length} kamera, ${sensors.length} sensor, ` +
    `${incidents.length} kejadian, ${districts.length} kecamatan, ${users.length} petugas, ${notifications.length} notifikasi`,
)
console.table(zones.map((z) => ({ code: z.code, lat: z.lat, lng: z.lng, src: z.coordAccuracy, elev: z.elevation, S: z.structuralRisk, H: z.historicalRisk, paths: z.path.length })))
