import type { CoordAccuracy, DrainageStatus, IncidentStatus, IncidentType, NotificationStatus, NotificationType, SensorType, Trend, ZoneType } from '~/types'

export const INCIDENT_TYPE_META: Record<IncidentType, { label: string; icon: string; box: string }> = {
  peringatan: { label: 'Peringatan', icon: 'fa-triangle-exclamation', box: 'bg-red-100 text-red-500' },
  hujan_tinggi: { label: 'Hujan Tinggi', icon: 'fa-cloud-rain', box: 'bg-blue-100 text-primary' },
  verifikasi: { label: 'Verifikasi', icon: 'fa-clipboard-check', box: 'bg-green-100 text-green-600' },
  offline: { label: 'Perangkat Offline', icon: 'fa-video-slash', box: 'bg-slate-100 text-slate-500' },
  normal: { label: 'Status Normal', icon: 'fa-check-circle', box: 'bg-green-100 text-green-600' },
  backwater: { label: 'Backwater', icon: 'fa-arrow-rotate-left', box: 'bg-sky-100 text-sky-600' },
}

export function incidentMeta(type: string) {
  return INCIDENT_TYPE_META[type as IncidentType] ?? INCIDENT_TYPE_META.peringatan
}

export const INCIDENT_STATUS_META: Record<IncidentStatus, { label: string; tone: 'red' | 'yellow' | 'green' }> = {
  aktif: { label: 'Aktif', tone: 'red' },
  ditangani: { label: 'Ditangani', tone: 'yellow' },
  selesai: { label: 'Selesai', tone: 'green' },
}

export const SENSOR_TYPE_META: Record<SensorType, { label: string; icon: string; box: string; unit: string }> = {
  water_level: { label: 'TMA Saluran', icon: 'fa-water', box: 'bg-cyan-100 text-cyan-600', unit: 'cm' },
  river_level: { label: 'TMA Sungai', icon: 'fa-bridge-water', box: 'bg-sky-100 text-sky-600', unit: 'cm' },
  tide: { label: 'Pasang Laut', icon: 'fa-wave-square', box: 'bg-teal-100 text-teal-600', unit: 'cm' },
  rainfall: { label: 'Curah Hujan', icon: 'fa-cloud-rain', box: 'bg-purple-100 text-purple-600', unit: 'mm/jam' },
  weather: { label: 'Cuaca (Suhu)', icon: 'fa-temperature-half', box: 'bg-amber-100 text-amber-600', unit: '°C' },
}

export const TREND_META: Record<Trend, { label: string; icon: string; color: string }> = {
  up: { label: 'Naik', icon: 'fa-arrow-up', color: 'text-red-500' },
  down: { label: 'Turun', icon: 'fa-arrow-down', color: 'text-green-500' },
  stable: { label: 'Stabil', icon: 'fa-minus', color: 'text-slate-400' },
}

export const NOTIFICATION_TYPE_META: Record<NotificationType, { label: string; tone: 'red' | 'orange' | 'blue' }> = {
  darurat: { label: 'Darurat', tone: 'red' },
  peringatan: { label: 'Peringatan', tone: 'orange' },
  informasi: { label: 'Informasi', tone: 'blue' },
}

export const NOTIFICATION_STATUS_META: Record<NotificationStatus, { label: string; tone: 'slate' | 'green' | 'red' }> = {
  draft: { label: 'Draft', tone: 'slate' },
  terkirim: { label: 'Terkirim', tone: 'green' },
  gagal: { label: 'Gagal', tone: 'red' },
}

export const ZONE_TYPE_META: Record<ZoneType, { label: string; icon: string; box: string }> = {
  titik_kritis: { label: 'Titik Kritis BRIDA–ITS', icon: 'fa-triangle-exclamation', box: 'bg-red-100 text-red-600' },
  outlet_drainase: { label: 'Outlet Drainase', icon: 'fa-diagram-project', box: 'bg-blue-100 text-primary' },
  sungai: { label: 'Sungai', icon: 'fa-bridge-water', box: 'bg-sky-100 text-sky-600' },
}

export const DRAINAGE_STATUS_META: Record<DrainageStatus, { label: string; tone: 'red' | 'green' | 'slate' }> = {
  tergenang: { label: 'Tergenang (Q5)', tone: 'red' },
  cukup: { label: 'Cukup (Q5)', tone: 'green' },
  tidak_dikaji: { label: 'Tidak dikaji', tone: 'slate' },
}

export const COORD_ACCURACY_META: Record<CoordAccuracy, { label: string; tone: 'green' | 'blue' | 'purple' | 'slate'; icon: string; hint: string }> = {
  data_resmi: { label: 'Data resmi', tone: 'green', icon: 'fa-building-columns', hint: 'Koordinat dari data pemerintah (Pusdatin Kemendikdasmen)' },
  penelitian: { label: 'Penelitian', tone: 'purple', icon: 'fa-book-open', hint: 'Koordinat yang tertulis di publikasi penelitian' },
  osm: { label: 'OpenStreetMap', tone: 'blue', icon: 'fa-map', hint: 'Geometri jalan/sungai/desa OpenStreetMap (ODbL)' },
  direktori: { label: 'Direktori alamat', tone: 'slate', icon: 'fa-address-book', hint: 'Geocode alamat terdaftar pada jalan yang disebut penelitian' },
}
