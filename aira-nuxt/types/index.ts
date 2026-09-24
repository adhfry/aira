export type Status = 'normal' | 'waspada' | 'siaga' | 'bahaya'

export interface Camera {
  id: string
  name: string
  location: string
  district: string
  status: Status
  imageUrl: string
  lat: number
  lng: number
  lastUpdate: string
  isOnline: boolean
}

export type SensorType = 'water_level' | 'rainfall' | 'weather'
export type Trend = 'up' | 'down' | 'stable'

export interface SensorPoint {
  time: string
  value: number
}

export interface Sensor {
  id: string
  type: SensorType
  name: string
  location: string
  district: string
  value: number
  unit: string
  trend: Trend
  status: Status
  lat: number
  lng: number
  isOnline: boolean
  lastUpdate: string
  history: SensorPoint[]
}

export type IncidentType = 'peringatan' | 'hujan_tinggi' | 'verifikasi' | 'offline' | 'normal'
export type IncidentStatus = 'aktif' | 'ditangani' | 'selesai'

export interface Incident {
  id: string
  title: string
  type: IncidentType
  district: string
  location: string
  description: string
  severity: Status
  status: IncidentStatus
  timestamp: string
  reporter: string
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

export interface DashboardStats {
  risk: { high: number; medium: number; normal: number }
  riskDelta: { high: number; medium: number; normal: number }
  cameras: { total: number; online: number }
  sensors: { total: number; online: number }
  activeIncidents: number
  weather: { temperature: number; condition: string }
  lastUpdate: string
  predictions: { district: string; values: number[] }[]
}
