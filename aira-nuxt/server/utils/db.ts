import seed from '../data/db.json'
import type { Camera, District, Incident, Notification, Sensor, User } from '~/types'

export interface Database {
  meta: { anchor: string; baseline: { high: number; medium: number; normal: number } }
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
    for (const [k, v] of Object.entries(value)) {
      out[k] = DATE_KEYS.has(k) && typeof v === 'string' ? new Date(Date.parse(v) + delta).toISOString() : shiftDates(v, delta)
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
  if (stored && typeof stored === 'object' && Array.isArray(stored.cameras)) {
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
