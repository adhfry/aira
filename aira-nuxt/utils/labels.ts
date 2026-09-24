import type { IncidentStatus, IncidentType, NotificationStatus, NotificationType, SensorType, Trend } from '~/types'

export const INCIDENT_TYPE_META: Record<IncidentType, { label: string; icon: string; box: string }> = {
  peringatan: { label: 'Peringatan', icon: 'fa-triangle-exclamation', box: 'bg-red-100 text-red-500' },
  hujan_tinggi: { label: 'Hujan Tinggi', icon: 'fa-cloud-rain', box: 'bg-blue-100 text-primary' },
  verifikasi: { label: 'Verifikasi', icon: 'fa-clipboard-check', box: 'bg-green-100 text-green-600' },
  offline: { label: 'Perangkat Offline', icon: 'fa-video-slash', box: 'bg-slate-100 text-slate-500' },
  normal: { label: 'Status Normal', icon: 'fa-check-circle', box: 'bg-green-100 text-green-600' },
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
  water_level: { label: 'Tinggi Muka Air', icon: 'fa-water', box: 'bg-cyan-100 text-cyan-600', unit: 'cm' },
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
