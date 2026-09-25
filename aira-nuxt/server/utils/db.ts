import seed from '../data/db.json'
import type { Camera, District, Incident, Notification, Sensor, User, Zone } from '~/types'

/** Versi skema data — bila berbeda dengan data tersimpan, database dibuat ulang dari seed. */
export const DB_VERSION = 3

export interface Database {
  meta: { anchor: string; version: number; geoSource?: string; geoFetchedAt?: string }
  zones: Zone[]
  cameras: Camera[]
  sensors: Sensor[]
  incidents: Incident[]
  districts: District[]
  users: User[]
  notifications: Notification[]
}

export type CollectionName = Exclude<keyof Database, 'meta'>

const STORAGE_KEY = 'aira-db.json'
const DATE_KEYS = new Set(['lastUpdate', 'timestamp', 'createdAt', 'time'])

let cache: Database | null = null
let queue: Promise<unknown> = Promise.resolve()

const storage = () => useStorage('aira')

/** Geser semua timestamp seed agar data terasa "baru" saat database dibuat. */
function shiftDates<T>(value: T, delta: number): T {
  if (Array.isArray(value)) return value.map((v) => shiftDates(v, delta)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    // Kejadian bertanggal nyata tidak digeser
    const fixed = (value as Record<string, unknown>).dateFixed === true
    for (const [k, v] of Object.entries(value)) {
      out[k] = !fixed && DATE_KEYS.has(k) && typeof v === 'string' ? new Date(Date.parse(v) + delta).toISOString() : shiftDates(v, delta)
    }
    return out as T
  }
  return value
}

export function freshDatabase(): Database {
  const base = structuredClone(seed) as unknown as Database
  const delta = Date.now() - Date.parse(base.meta.anchor)
  const shifted = shiftDates(base, delta)
  shifted.meta.anchor = new Date().toISOString()
  return shifted
}

export async function readDb(): Promise<Database> {
  if (cache) return cache
  const stored = await storage().getItem<Database>(STORAGE_KEY)
  if (stored && typeof stored === 'object' && stored.meta?.version === DB_VERSION && Array.isArray(stored.zones)) {
    cache = stored
  } else {
    cache = freshDatabase()
    await storage().setItem(STORAGE_KEY, cache)
  }
  return cache
}

/** Mutasi berurutan (antrean) agar penulisan file JSON tidak saling menimpa. */
export function mutateDb<R>(fn: (db: Database) => R | Promise<R>): Promise<R> {
  const run = queue.then(async () => {
    const db = await readDb()
    const result = await fn(db)
    await storage().setItem(STORAGE_KEY, db)
    return result
  })
  queue = run.catch(() => undefined)
  return run
}

export async function resetDb(): Promise<Database> {
  return mutateDb((db) => {
    const fresh = freshDatabase()
    Object.assign(db, fresh)
    return db
  })
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
