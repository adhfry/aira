import type { H3Event } from 'h3'
import type { Sensor, Status } from '~/types'
import { mutateDb, newId, readDb, type CollectionName, type Database } from './db'
import { validateBody } from './schema'

type Item = Database[CollectionName][number]

const PREFIX: Record<CollectionName, string> = {
  zones: 'zon',
  cameras: 'cam',
  sensors: 'sen',
  incidents: 'inc',
  districts: 'kec',
  users: 'usr',
  notifications: 'ntf',
}

const UNIT: Record<string, string> = { water_level: 'cm', river_level: 'cm', tide: 'cm', rainfall: 'mm/jam', weather: '°C' }
const DEFAULT_CCTV_IMG = 'https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=600&auto=format&fit=crop'
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'

/** Status TMA dari rasio isi: ≥100% meluap (bahaya) · ≥85% siaga · ≥65% waspada. */
export function fillStatus(value: number, depth: number): Status {
  const r = value / depth
  return r >= 1 ? 'bahaya' : r >= 0.85 ? 'siaga' : r >= 0.65 ? 'waspada' : 'normal'
}

export function riskLevelOf(p: number): Status {
  if (p >= 70) return 'bahaya'
  if (p >= 50) return 'siaga'
  if (p >= 35) return 'waspada'
  return 'normal'
}

function list(db: Database, name: CollectionName): Item[] {
  return db[name] as Item[]
}

function findIndexOr404(db: Database, name: CollectionName, id: string): number {
  const idx = list(db, name).findIndex((x) => x.id === id)
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Data tidak ditemukan.' })
  return idx
}

/** Kode berikutnya, mis. AIRA-017 / SNS-20. */
function nextCode(items: { code?: string }[], prefix: string, width: number): string {
  const max = items.reduce((m, i) => {
    const n = Number(String(i.code ?? '').replace(`${prefix}-`, ''))
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `${prefix}-${String(max + 1).padStart(width, '0')}`
}

/** Pastikan zoneId merujuk ke zona yang ada. */
function assertZone(db: Database, data: Record<string, unknown>) {
  if (data.zoneId !== undefined && data.zoneId !== '' && !db.zones.some((z) => z.id === data.zoneId)) {
    throw createError({ statusCode: 422, statusMessage: 'Validasi gagal', message: 'Zona tidak ditemukan.', data: { errors: ['Zona tidak ditemukan.'] } })
  }
}

/** Isi field turunan/default sebelum disimpan. */
function applyDefaults(name: CollectionName, data: Record<string, unknown>, db: Database, prev?: Item): Record<string, unknown> {
  const now = new Date().toISOString()
  switch (name) {
    case 'zones':
      return prev ? data : { sources: [], radius: 300, coordNote: '', notes: '', network: '', outlet: null, capacity: null, backwaterLength: null, elevation: null, path: [], ...data }
    case 'cameras':
      return {
        ...(prev
          ? {}
          : { imageUrl: DEFAULT_CCTV_IMG, isOnline: true, coordAccuracy: 'osm', coordNote: '', code: (data.code as string) || nextCode(db.cameras, 'AIRA', 3) }),
        ...data,
        lastUpdate: now,
      }
    case 'sensors': {
      const p = prev as Sensor | undefined
      const type = (data.type ?? p?.type) as string
      const value = (data.value ?? p?.value) as number
      let history = p?.history ?? []
      let trend = (data.trend ?? p?.trend ?? 'stable') as Sensor['trend']
      if (!p || data.value !== undefined) {
        history = [...history, { time: now, value }].slice(-12)
        if (p && data.trend === undefined) trend = value > p.value ? 'up' : value < p.value ? 'down' : 'stable'
      }
      // Status TMA otomatis dari rasio isi bila nilai/kedalaman berubah dan status tidak dikirim
      const depth = (data.channelDepth !== undefined ? data.channelDepth : p?.channelDepth) as number | null | undefined
      const autoStatus =
        data.status === undefined && depth && (type === 'water_level' || type === 'river_level') && (data.value !== undefined || data.channelDepth !== undefined)
          ? { status: fillStatus(value, depth) }
          : {}
      return {
        ...(p ? {} : { isOnline: true, coordAccuracy: 'osm', coordNote: '', channelDepth: null, code: (data.code as string) || nextCode(db.sensors, 'SNS', 2) }),
        ...data,
        ...autoStatus,
        unit: (data.unit as string) || UNIT[type] || '',
        trend,
        history,
        lastUpdate: now,
      }
    }
    case 'incidents':
      return {
        ...(prev ? {} : { reporter: 'Sistem AIRA', description: '', zoneId: '' }),
        ...data,
        timestamp: (data.timestamp as string) || (prev as { timestamp?: string })?.timestamp || now,
      }
    case 'districts': {
      const pct = data.riskPercentage as number | undefined
      return { ...data, ...(pct !== undefined && !data.riskLevel ? { riskLevel: riskLevelOf(pct) } : {}) }
    }
    case 'users':
      return prev ? data : { avatarUrl: DEFAULT_AVATAR, phone: '', ...data }
    case 'notifications':
      return prev ? data : { ...data, createdAt: now }
  }
}

export function listHandler(name: CollectionName) {
  return defineEventHandler(async (event) => {
    const db = await readDb()
    const query = getQuery(event)
    const q = typeof query.q === 'string' ? query.q.trim().toLowerCase() : ''
    const filters = Object.entries(query).filter(([k, v]) => k !== 'q' && typeof v === 'string' && v !== '')

    return list(db, name).filter((item) => {
      const record = item as unknown as Record<string, unknown>
      if (q && !JSON.stringify(record).toLowerCase().includes(q)) return false
      return filters.every(([k, v]) => !(k in record) || String(record[k]) === v)
    })
  })
}

export function getHandler(name: CollectionName) {
  return defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id') ?? ''
    const db = await readDb()
    return list(db, name)[findIndexOr404(db, name, id)]
  })
}

export function createHandler(name: CollectionName) {
  return defineEventHandler(async (event: H3Event) => {
    const data = validateBody(name, await readBody(event), false)
    const created = await mutateDb((db) => {
      assertZone(db, data)
      const item = { id: newId(PREFIX[name]), ...applyDefaults(name, data, db) } as unknown as Item
      ;(db[name] as Item[]).unshift(item)
      return item
    })
    setResponseStatus(event, 201)
    return created
  })
}

export function updateHandler(name: CollectionName) {
  return defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id') ?? ''
    const data = validateBody(name, await readBody(event), true)
    return mutateDb((db) => {
      const idx = findIndexOr404(db, name, id)
      const prev = list(db, name)[idx]!
      assertZone(db, data)
      const next = { ...prev, ...applyDefaults(name, data, db, prev), id } as Item
      ;(db[name] as Item[])[idx] = next
      return next
    })
  })
}

export function deleteHandler(name: CollectionName) {
  return defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id') ?? ''
    return mutateDb((db) => {
      const idx = findIndexOr404(db, name, id)
      if (name === 'zones') {
        const used = db.cameras.filter((c) => c.zoneId === id).length + db.sensors.filter((x) => x.zoneId === id).length
        if (used) {
          throw createError({
            statusCode: 409,
            statusMessage: 'Zona masih dipakai',
            message: `Zona masih dipakai oleh ${used} kamera/sensor. Pindahkan perangkat ke zona lain terlebih dahulu.`,
          })
        }
      }
      const [removed] = (db[name] as Item[]).splice(idx, 1)
      return { success: true, id: removed!.id }
    })
  })
}
