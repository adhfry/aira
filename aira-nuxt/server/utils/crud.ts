import type { H3Event } from 'h3'
import type { Sensor, Status } from '~/types'
import { mutateDb, newId, readDb, type CollectionName, type Database } from './db'
import { validateBody } from './schema'

type Item = Database[CollectionName][number]

const PREFIX: Record<CollectionName, string> = {
  cameras: 'cam',
  sensors: 'sen',
  incidents: 'inc',
  districts: 'kec',
  users: 'usr',
  notifications: 'ntf',
}

const UNIT: Record<string, string> = { water_level: 'cm', rainfall: 'mm/jam', weather: '°C' }
const DEFAULT_CCTV_IMG = 'https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=600&auto=format&fit=crop'
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'

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

/** Isi field turunan/default sebelum disimpan. */
function applyDefaults(name: CollectionName, data: Record<string, unknown>, prev?: Item): Record<string, unknown> {
  const now = new Date().toISOString()
  switch (name) {
    case 'cameras':
      return { imageUrl: DEFAULT_CCTV_IMG, isOnline: true, ...data, lastUpdate: now }
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
      return { isOnline: true, ...data, unit: (data.unit as string) || UNIT[type] || '', trend, history, lastUpdate: now }
    }
    case 'incidents':
      return { reporter: 'Sistem AIRA', description: '', ...data, timestamp: (data.timestamp as string) || (prev as { timestamp?: string })?.timestamp || now }
    case 'districts': {
      const pct = data.riskPercentage as number | undefined
      return { ...data, ...(pct !== undefined && !data.riskLevel ? { riskLevel: riskLevelOf(pct) } : {}) }
    }
    case 'users':
      return { avatarUrl: DEFAULT_AVATAR, phone: '', ...data }
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
      const item = { id: newId(PREFIX[name]), ...applyDefaults(name, data) } as unknown as Item
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
      const next = { ...prev, ...applyDefaults(name, data, prev), id } as Item
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
      const [removed] = (db[name] as Item[]).splice(idx, 1)
      return { success: true, id: removed!.id }
    })
  })
}
