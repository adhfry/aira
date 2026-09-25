/** Rujukan ilmiah yang menjadi fondasi data AIRA (studi kasus Kota Sumenep). */
export interface Reference {
  key: string
  short: string
  title: string
  detail: string
  url: string
  role: string
}

export const REFERENCES: Reference[] = [
  {
    key: 'brida',
    short: 'BRIDA Sumenep × ITS (2026)',
    title: 'Faktor-Faktor Penyebab Banjir Perkotaan di Kabupaten Sumenep',
    detail: 'Karaton: Jurnal Riset dan Inovasi Sumenep, Vol. 5 No. 1 (dipublikasikan 18 Februari 2026). Metode campuran: hidrologi, evaluasi drainase, GIS/tata guna lahan, kajian kebijakan, observasi lapangan.',
    url: 'https://karaton-brida.sumenepkab.go.id/index.php/karaton/article/view/124',
    role: 'Penyebab banjir perkotaan & 6 titik kritis',
  },
  {
    key: 'drainase',
    short: 'Resmani, Andawayanti & Cahya (2017)',
    title: 'Analisa Kapasitas Tampung Saluran Drainase Akibat Pengaruh Limpasan Permukaan Kecamatan Kota Sumenep',
    detail: 'Jurnal Teknik Pengairan Vol. 8 No. 2 (2017). Pemodelan SWMM; 8 outlet jaringan drainase, kapasitas, status genangan kala ulang 5 tahun, dan panjang pengaruh backwater.',
    url: 'https://www.researchgate.net/publication/335888131_ANALISA_KAPASITAS_TAMPUNG_SALURAN_DRAINASE_AKIBAT_PENGARUH_LIMPASAN_PERMUKAAN_KECAMATAN_KOTA_SUMENEP',
    role: '8 outlet drainase & backwater',
  },
  {
    key: 'marengan',
    short: 'Prosiding PSPK 3 — UKWMS (2024)',
    title: 'Kajian Sungai Marengan (Prosiding Seminar Praktik Keinsinyuran 3)',
    detail: 'Koordinat hulu (07°00\'29" LS, 113°52\'12" BT) dan hilir (07°02\'10" LS, 113°53\'23" BT) Sungai Marengan.',
    url: 'https://repositori.ukwms.ac.id/id/eprint/42885/',
    role: 'Lapisan pemantauan Sungai Marengan',
  },
  {
    key: 'berita',
    short: 'Media Pribumi — rilis hasil kajian BRIDA–ITS',
    title: 'BRIDA dan ITS Rilis Hasil Kajian Banjir, Ungkap Titik Kritis dan Solusi Penanganan Perkotaan Sumenep',
    detail: 'Pemberitaan debit rencana Q10 DAS Sarokah (±343 m³/s), Marengan (±115 m³/s), Patrean (±122 m³/s) dan enam titik kritis.',
    url: 'https://mediapribumi.id/brida-dan-its-rilis-hasil-kajian-banjir-ungkap-titik-kritis-dan-solusi-penanganan-perkotaan-sumenep/',
    role: 'Debit DAS & daftar titik kritis',
  },
]

/** DAS utama perkotaan Sumenep (angka Q10 dari pemberitaan hasil kajian BRIDA–ITS). */
export const DAS_LIST = [
  { name: 'Sarokah', q10: 343 },
  { name: 'Marengan', q10: 115 },
  { name: 'Patrean', q10: 122 },
]

/** Rantai faktor penyebab banjir perkotaan (abstrak BRIDA–ITS). */
export const FLOOD_FACTORS = [
  { icon: 'fa-cloud-showers-heavy', label: 'Curah hujan tinggi' },
  { icon: 'fa-down-left-and-up-right-to-center', label: 'Kapasitas drainase terbatas' },
  { icon: 'fa-mound', label: 'Sedimentasi' },
  { icon: 'fa-compress', label: 'Penyempitan saluran' },
  { icon: 'fa-city', label: 'Alih fungsi lahan' },
  { icon: 'fa-road', label: 'Permukaan kedap air' },
  { icon: 'fa-mountain', label: 'Morfologi datar/cekung' },
  { icon: 'fa-water', label: 'Minim ruang retensi' },
]

/** Hasil kajian drainase 2017 — 8 outlet. */
export const OUTLETS = [
  { no: 1, network: 'Diponegoro → Jenderal Sudirman → Ahmad Yani', capacity: 3.53, flooded: true, backwater: null },
  { no: 2, network: 'Imam Bonjol → KH Agus Salim → Pahlawan → Kartini', capacity: 7.15, flooded: true, backwater: null },
  { no: 3, network: 'KH Sajad → Dr. Wahidin', capacity: 2.52, flooded: false, backwater: null },
  { no: 4, network: 'Dr. Cipto', capacity: 1.21, flooded: true, backwater: 317.93 },
  { no: 5, network: 'KH Mansyur → Raung → Urip Sumoharjo', capacity: 4.65, flooded: true, backwater: 677.5 },
  { no: 6, network: 'Wahid Hasyim → Pasar Anom → Bumi Sumekar → Satelit', capacity: 6.2, flooded: true, backwater: 507.41 },
  { no: 7, network: 'Kalimook → Marengan Daya', capacity: 1.47, flooded: false, backwater: 1523.41 },
  { no: 8, network: 'Desa Marengan Laok', capacity: 0.6, flooded: true, backwater: null },
]

export const CRITICAL_AREAS = [
  'Jalan Dr. Wahidin – Setiabudi',
  'Perumahan Bumi Sumekar',
  'Perumahan Satelit',
  'Asabri',
  'Jalan Kartini – Jati Emas',
  'Hilir Sungai Marengan',
]
