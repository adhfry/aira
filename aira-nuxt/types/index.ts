export type Status = 'normal' | 'waspada' | 'siaga' | 'bahaya'

/**
 * Sumber koordinat (semua titik ditentukan dari sumber yang dapat ditelusuri):
 * - data_resmi : data pemerintah (mis. Pusdatin Kemendikdasmen)
 * - penelitian : koordinat yang tertulis di publikasi ilmiah
 * - osm        : geometri OpenStreetMap (jalan, sungai, desa, objek)
 * - direktori  : geocode alamat terdaftar pada jalan yang disebut penelitian
 */
export type CoordAccuracy = 'data_resmi' | 'penelitian' | 'osm' | 'direktori'

export interface Camera {
  id: string
  /** Kode titik pemantauan usulan, mis. AIRA-001 */
  code: string
  name: string
  location: string
  district: string
  zoneId: string
  status: Status
  imageUrl: string
  lat: number
  lng: number
  coordAccuracy: CoordAccuracy
  coordNote: string
  lastUpdate: string
  isOnline: boolean
}

/**
 * water_level = tinggi muka air saluran drainase (outlet)
 * river_level = tinggi muka air sungai (Sungai Marengan)
 * tide        = tinggi pasang air laut di muara
 */
export type SensorType = 'water_level' | 'river_level' | 'rainfall' | 'weather' | 'tide'
export type Trend = 'up' | 'down' | 'stable'

export interface SensorPoint {
  time: string
  value: number
}

export interface Sensor {
  id: string
  code: string
  type: SensorType
  name: string
  location: string
  district: string
  zoneId: string
  value: number
  unit: string
  /** Kedalaman saluran / tinggi tanggul (cm) untuk sensor TMA — dasar status rasio isi */
  channelDepth: number | null
  trend: Trend
  status: Status
  lat: number
  lng: number
  coordAccuracy: CoordAccuracy
  coordNote: string
  isOnline: boolean
  lastUpdate: string
  history: SensorPoint[]
}

export type ZoneType = 'titik_kritis' | 'outlet_drainase' | 'sungai'
export type DrainageStatus = 'tergenang' | 'cukup' | 'tidak_dikaji'

/** Zona/koridor risiko banjir — fondasi spasial AIRA dari hasil penelitian. */
export interface Zone {
  id: string
  code: string
  name: string
  type: ZoneType
  /** Nomor outlet drainase (Resmani dkk., 2017) bila terkait */
  outlet: number | null
  /** Jalur jaringan drainase / koridor jalan */
  network: string
  district: string
  /** Sumber penelitian yang menjadi dasar zona */
  sources: string[]
  /** Kapasitas saluran (m³/s) hasil kajian SWMM 2017 */
  capacity: number | null
  drainageStatus: DrainageStatus
  /** Panjang pengaruh backwater Sungai Marengan (m) */
  backwaterLength: number | null
  /** Layer 1 — risiko struktural (0–100) */
  structuralRisk: number
  /** Layer 2 — risiko historis (0–100) */
  historicalRisk: number
  lat: number
  lng: number
  radius: number
  coordAccuracy: CoordAccuracy
  coordNote: string
  /** Elevasi tanah titik jangkar (m dpl, SRTM 30 m) */
  elevation: number | null
  /** Geometri koridor dari OpenStreetMap (multi-polyline [lat, lng]) */
  path: [number, number][][]
  notes: string
}

export type IncidentType = 'peringatan' | 'hujan_tinggi' | 'verifikasi' | 'offline' | 'normal' | 'backwater'
export type IncidentStatus = 'aktif' | 'ditangani' | 'selesai'

export interface Incident {
  id: string
  title: string
  type: IncidentType
  district: string
  zoneId: string
  location: string
  description: string
  severity: Status
  status: IncidentStatus
  timestamp: string
  reporter: string
  /** Kejadian bertanggal nyata (tidak digeser saat data dibuat ulang) */
  dateFixed?: boolean
}

export interface District {
  id: string
  name: string
  riskLevel: Status
  riskPercentage: number
  population: number
  coordinates: { lat: number; lng: number }
}

export type UserStatus = 'aktif' | 'nonaktif'

export interface User {
  id: string
  name: string
  role: string
  email: string
  phone: string
  avatarUrl: string
  district: string
  status: UserStatus
}

export type NotificationType = 'peringatan' | 'informasi' | 'darurat'
export type NotificationStatus = 'draft' | 'terkirim' | 'gagal'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  recipients: string[]
  status: NotificationStatus
  createdAt: string
}

/** Hasil AIRA Risk Engine per zona */
export interface ZoneRisk {
  zoneId: string
  code: string
  name: string
  structural: number
  historical: number
  realtime: number
  dynamic: number
  level: Status
  backwater: boolean
}

export interface BackwaterReading {
  zoneId: string
  code: string
  name: string
  outlet: number | null
  drainLevel: number
  riverLevel: number
  /** Selisih muka air sungai − saluran (cm). Positif = air sungai lebih tinggi → potensi arus balik */
  delta: number
  backwaterLength: number | null
  level: Status
  /** Posisi mulut outlet (sensor sisi sungai) */
  lat: number
  lng: number
}

export interface DashboardStats {
  zones: { total: number; high: number; medium: number; normal: number }
  cameras: { total: number; online: number }
  sensors: { total: number; online: number }
  activeIncidents: number
  weather: { temperature: number; condition: string }
  rainfall: { max: number; avg: number }
  tide: number | null
  lastUpdate: string
  zoneRisks: ZoneRisk[]
  backwater: { riverLevel: number | null; riverSensor: string | null; readings: BackwaterReading[] }
  predictions: { zone: string; values: number[] }[]
  weights: { structural: number; historical: number; realtime: number }
}
