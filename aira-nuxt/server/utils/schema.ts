import type { CollectionName } from './db'

type FieldRule =
  | { type: 'string'; required?: boolean; max?: number; pattern?: RegExp; message?: string }
  | { type: 'number'; required?: boolean; min?: number; max?: number; nullable?: boolean }
  | { type: 'boolean'; required?: boolean }
  | { type: 'enum'; required?: boolean; values: readonly string[] }
  | { type: 'string[]'; required?: boolean }
  | { type: 'coords'; required?: boolean }

type Schema = Record<string, FieldRule & { label: string }>

const STATUS = ['normal', 'waspada', 'siaga', 'bahaya'] as const
const ACCURACY = ['data_resmi', 'penelitian', 'osm', 'direktori'] as const

export const SCHEMAS: Record<CollectionName, Schema> = {
  zones: {
    code: { type: 'string', required: true, max: 20, label: 'Kode zona' },
    name: { type: 'string', required: true, max: 120, label: 'Nama zona' },
    type: { type: 'enum', values: ['titik_kritis', 'outlet_drainase', 'sungai'], required: true, label: 'Jenis zona' },
    outlet: { type: 'number', min: 1, max: 20, nullable: true, label: 'Nomor outlet' },
    network: { type: 'string', max: 300, label: 'Jaringan / koridor' },
    district: { type: 'string', required: true, label: 'Kecamatan' },
    sources: { type: 'string[]', label: 'Sumber penelitian' },
    capacity: { type: 'number', min: 0, max: 10000, nullable: true, label: 'Kapasitas saluran' },
    drainageStatus: { type: 'enum', values: ['tergenang', 'cukup', 'tidak_dikaji'], required: true, label: 'Status drainase' },
    backwaterLength: { type: 'number', min: 0, max: 100000, nullable: true, label: 'Panjang backwater' },
    structuralRisk: { type: 'number', required: true, min: 0, max: 100, label: 'Risiko struktural' },
    historicalRisk: { type: 'number', required: true, min: 0, max: 100, label: 'Risiko historis' },
    lat: { type: 'number', required: true, min: -90, max: 90, label: 'Latitude' },
    lng: { type: 'number', required: true, min: -180, max: 180, label: 'Longitude' },
    radius: { type: 'number', min: 50, max: 5000, label: 'Radius zona' },
    coordAccuracy: { type: 'enum', values: ACCURACY, required: true, label: 'Sumber koordinat' },
    coordNote: { type: 'string', max: 500, label: 'Catatan koordinat' },
    elevation: { type: 'number', min: -50, max: 5000, nullable: true, label: 'Elevasi tanah' },
    notes: { type: 'string', max: 1000, label: 'Catatan' },
  },
  cameras: {
    code: { type: 'string', max: 20, label: 'Kode titik' },
    zoneId: { type: 'string', required: true, label: 'Zona' },
    coordAccuracy: { type: 'enum', values: ACCURACY, label: 'Sumber koordinat' },
    coordNote: { type: 'string', max: 500, label: 'Catatan koordinat' },
    name: { type: 'string', required: true, max: 120, label: 'Nama kamera' },
    location: { type: 'string', required: true, max: 160, label: 'Lokasi' },
    district: { type: 'string', required: true, label: 'Kecamatan' },
    status: { type: 'enum', values: STATUS, required: true, label: 'Status' },
    imageUrl: { type: 'string', max: 500, label: 'URL gambar' },
    lat: { type: 'number', required: true, min: -90, max: 90, label: 'Latitude' },
    lng: { type: 'number', required: true, min: -180, max: 180, label: 'Longitude' },
    isOnline: { type: 'boolean', label: 'Status online' },
  },
  sensors: {
    code: { type: 'string', max: 20, label: 'Kode sensor' },
    zoneId: { type: 'string', required: true, label: 'Zona' },
    coordAccuracy: { type: 'enum', values: ACCURACY, label: 'Sumber koordinat' },
    coordNote: { type: 'string', max: 500, label: 'Catatan koordinat' },
    channelDepth: { type: 'number', min: 1, max: 2000, nullable: true, label: 'Kedalaman saluran' },
    type: { type: 'enum', values: ['water_level', 'river_level', 'rainfall', 'weather', 'tide'], required: true, label: 'Jenis sensor' },
    name: { type: 'string', required: true, max: 120, label: 'Nama sensor' },
    location: { type: 'string', required: true, max: 160, label: 'Lokasi' },
    district: { type: 'string', required: true, label: 'Kecamatan' },
    value: { type: 'number', required: true, min: -50, max: 10000, label: 'Nilai' },
    unit: { type: 'string', max: 20, label: 'Satuan' },
    trend: { type: 'enum', values: ['up', 'down', 'stable'], label: 'Tren' },
    status: { type: 'enum', values: STATUS, required: true, label: 'Status' },
    lat: { type: 'number', required: true, min: -90, max: 90, label: 'Latitude' },
    lng: { type: 'number', required: true, min: -180, max: 180, label: 'Longitude' },
    isOnline: { type: 'boolean', label: 'Status online' },
  },
  incidents: {
    title: { type: 'string', required: true, max: 160, label: 'Judul' },
    type: { type: 'enum', values: ['peringatan', 'hujan_tinggi', 'verifikasi', 'offline', 'normal', 'backwater'], required: true, label: 'Jenis' },
    zoneId: { type: 'string', label: 'Zona' },
    district: { type: 'string', required: true, label: 'Kecamatan' },
    location: { type: 'string', required: true, max: 160, label: 'Lokasi' },
    description: { type: 'string', max: 1000, label: 'Deskripsi' },
    severity: { type: 'enum', values: STATUS, required: true, label: 'Tingkat' },
    status: { type: 'enum', values: ['aktif', 'ditangani', 'selesai'], required: true, label: 'Status' },
    timestamp: { type: 'string', label: 'Waktu' },
    reporter: { type: 'string', max: 120, label: 'Pelapor' },
  },
  districts: {
    name: { type: 'string', required: true, max: 120, label: 'Nama kecamatan' },
    riskLevel: { type: 'enum', values: STATUS, label: 'Level risiko' },
    riskPercentage: { type: 'number', required: true, min: 0, max: 100, label: 'Persentase risiko' },
    population: { type: 'number', required: true, min: 0, max: 100_000_000, label: 'Populasi' },
    coordinates: { type: 'coords', required: true, label: 'Koordinat' },
  },
  users: {
    name: { type: 'string', required: true, max: 120, label: 'Nama' },
    role: { type: 'string', required: true, max: 60, label: 'Peran' },
    email: { type: 'string', required: true, max: 160, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Format email tidak valid', label: 'Email' },
    phone: { type: 'string', max: 30, label: 'Telepon' },
    avatarUrl: { type: 'string', max: 500, label: 'URL avatar' },
    district: { type: 'string', required: true, label: 'Kecamatan' },
    status: { type: 'enum', values: ['aktif', 'nonaktif'], required: true, label: 'Status' },
  },
  notifications: {
    title: { type: 'string', required: true, max: 160, label: 'Judul' },
    message: { type: 'string', required: true, max: 1000, label: 'Pesan' },
    type: { type: 'enum', values: ['peringatan', 'informasi', 'darurat'], required: true, label: 'Jenis' },
    recipients: { type: 'string[]', required: true, label: 'Penerima' },
    status: { type: 'enum', values: ['draft', 'terkirim', 'gagal'], required: true, label: 'Status' },
  },
}

/**
 * Validasi & sanitasi body. Hanya field yang ada di skema yang diterima.
 * `partial` = true untuk update (field wajib boleh tidak dikirim).
 */
export function validateBody(collection: CollectionName, body: unknown, partial: boolean): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Body permintaan harus berupa objek JSON.' })
  }
  const input = body as Record<string, unknown>
  const schema = SCHEMAS[collection]
  const out: Record<string, unknown> = {}
  const errors: string[] = []

  for (const [key, rule] of Object.entries(schema)) {
    let value = input[key]
    const missing = value === undefined || value === null || value === ''
    if (missing && rule.type === 'number' && rule.nullable && value !== undefined) {
      out[key] = null
      continue
    }
    if (missing) {
      if (rule.required && !partial) errors.push(`${rule.label} wajib diisi.`)
      continue
    }
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') { errors.push(`${rule.label} harus berupa teks.`); break }
        value = value.trim()
        if (rule.required && !value) { errors.push(`${rule.label} wajib diisi.`); break }
        if (rule.max && (value as string).length > rule.max) errors.push(`${rule.label} maksimal ${rule.max} karakter.`)
        else if (rule.pattern && !rule.pattern.test(value as string)) errors.push(rule.message ?? `${rule.label} tidak valid.`)
        else out[key] = value
        break
      case 'number': {
        const n = typeof value === 'string' ? Number(value) : value
        if (typeof n !== 'number' || !Number.isFinite(n)) { errors.push(`${rule.label} harus berupa angka.`); break }
        if (rule.min !== undefined && n < rule.min) errors.push(`${rule.label} minimal ${rule.min}.`)
        else if (rule.max !== undefined && n > rule.max) errors.push(`${rule.label} maksimal ${rule.max}.`)
        else out[key] = n
        break
      }
      case 'boolean':
        if (typeof value !== 'boolean') errors.push(`${rule.label} harus bernilai ya/tidak.`)
        else out[key] = value
        break
      case 'enum':
        if (typeof value !== 'string' || !rule.values.includes(value)) errors.push(`${rule.label} tidak valid.`)
        else out[key] = value
        break
      case 'string[]': {
        const arr = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : null
        const clean = arr?.map((v) => String(v).trim()).filter(Boolean)
        if (!clean || (rule.required && clean.length === 0)) errors.push(`${rule.label} wajib diisi.`)
        else out[key] = clean
        break
      }
      case 'coords': {
        const c = value as { lat?: unknown; lng?: unknown }
        const lat = Number(c?.lat)
        const lng = Number(c?.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
          errors.push(`${rule.label} tidak valid.`)
        } else out[key] = { lat, lng }
        break
      }
    }
  }

  if (errors.length) {
    throw createError({ statusCode: 422, statusMessage: 'Validasi gagal', data: { errors }, message: errors.join(' ') })
  }
  return out
}
