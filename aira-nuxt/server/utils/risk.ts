import type { BackwaterReading, Sensor, Status, ZoneRisk } from '~/types'
import type { Database } from './db'

/**
 * AIRA RISK ENGINE
 *
 *   STRUCTURAL RISK (Layer 1) — kapasitas drainase, outlet, backwater, titik kritis BRIDA–ITS
 * + HISTORICAL RISK (Layer 2) — frekuensi/durasi/kedalaman kejadian (estimasi awal)
 * + REAL-TIME RISK  (Layer 3) — CCTV, TMA saluran, curah hujan, sungai, pasang
 * = DYNAMIC FLOOD RISK
 *
 * Bobot & ambang adalah parameter prototipe — perlu dikalibrasi dengan data kejadian aktual.
 */
export const WEIGHTS = { structural: 0.35, historical: 0.25, realtime: 0.4 } as const

const STATUS_SCORE: Record<Status, number> = { normal: 15, waspada: 45, siaga: 70, bahaya: 90 }

export function levelOfScore(score: number): Status {
  if (score >= 75) return 'bahaya'
  if (score >= 60) return 'siaga'
  if (score >= 40) return 'waspada'
  return 'normal'
}

/** Ambang backwater (cm): Δ = muka air sungai − muka air saluran. */
function backwaterLevel(delta: number): Status {
  if (delta >= 30) return 'bahaya'
  if (delta >= 0) return 'siaga'
  if (delta >= -20) return 'waspada'
  return 'normal'
}

const online = <T extends { isOnline: boolean }>(arr: T[]) => arr.filter((x) => x.isOnline)
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)))

/** Jarak kasar (m) antar dua titik — cukup untuk memasangkan sensor di mulut outlet. */
function meters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dy = (a.lat - b.lat) * 111_320
  const dx = (a.lng - b.lng) * 111_320 * Math.cos((a.lat * Math.PI) / 180)
  return Math.sqrt(dx * dx + dy * dy)
}

/** Sensor TMA sungai referensi (hilir) untuk ringkasan. */
function riverReference(db: Database): Sensor | undefined {
  const rivers = online(db.sensors.filter((s) => s.type === 'river_level'))
  const hilirZones = new Set(db.zones.filter((z) => /hilir/i.test(z.name)).map((z) => z.id))
  return rivers.find((r) => hilirZones.has(r.zoneId)) ?? rivers[0]
}

/**
 * Deteksi backwater per mulut outlet: pasangan sensor TMA sisi sungai (river_level) dan sisi saluran
 * (water_level) di zona yang sama, berjarak ≤ 150 m, memakai peilschaal bersama (nol = dasar pintu outlet).
 * Δ = TMA sisi sungai − TMA sisi saluran; positif = air sungai lebih tinggi → aliran saluran tertahan.
 */
export function computeBackwater(db: Database): { river: Sensor | undefined; readings: BackwaterReading[] } {
  const readings: BackwaterReading[] = []
  for (const r of online(db.sensors.filter((s) => s.type === 'river_level'))) {
    const drain = online(db.sensors.filter((s) => s.type === 'water_level' && s.zoneId === r.zoneId))
      .map((s) => ({ s, d: meters(s, r) }))
      .filter((x) => x.d <= 150)
      .sort((x, y) => x.d - y.d)[0]?.s
    if (!drain) continue
    const z = db.zones.find((x) => x.id === r.zoneId)
    if (!z) continue
    const delta = Math.round(r.value - drain.value)
    readings.push({
      zoneId: z.id,
      code: z.code,
      name: z.outlet ? `Mulut Outlet ${z.outlet} – ${drain.location}` : `${z.name} – ${drain.location}`,
      outlet: z.outlet,
      drainLevel: drain.value,
      riverLevel: r.value,
      delta,
      backwaterLength: z.backwaterLength,
      level: backwaterLevel(delta),
      lat: r.lat,
      lng: r.lng,
    })
  }
  return { river: riverReference(db), readings: readings.sort((a, b) => b.delta - a.delta) }
}

export function computeZoneRisks(db: Database, backwater: BackwaterReading[]): ZoneRisk[] {
  const rain = online(db.sensors.filter((s) => s.type === 'rainfall'))
  const maxRain = rain.length ? Math.max(...rain.map((s) => s.value)) : 0
  const rainScore = clamp(maxRain * 2) // 50 mm/jam → 100
  const tide = online(db.sensors.filter((s) => s.type === 'tide'))[0]
  // Zona terpengaruh backwater hanya bila berada dalam panjang pengaruh backwater (kajian 2017) dari mulut outlet
  const bwFor = (z: Database['zones'][number]) =>
    backwater.find((b) => {
      if (b.outlet === null ? b.zoneId !== z.id : b.outlet !== z.outlet) return false
      const reach = (b.backwaterLength ?? 0) + 50
      // Jarak terdekat dari koridor zona (geometri jalan) atau titik jangkarnya ke mulut outlet
      const pts = [{ lat: z.lat, lng: z.lng }, ...(z.path ?? []).flat().map(([lat, lng]) => ({ lat, lng }))]
      return Math.min(...pts.map((pt) => meters(pt, b))) <= reach
    })

  return db.zones.map((z) => {
    const signals = [
      ...online(db.cameras.filter((c) => c.zoneId === z.id)).map((c) => STATUS_SCORE[c.status]),
      ...online(db.sensors.filter((s) => s.zoneId === z.id && ['water_level', 'river_level'].includes(s.type))).map((s) => STATUS_SCORE[s.status]),
    ]
    const observed = signals.length ? Math.max(...signals) : 30
    const bw = bwFor(z)
    const bwBonus = bw ? (bw.level === 'bahaya' ? 15 : bw.level === 'siaga' ? 8 : 0) : 0
    const tideBonus = tide && /marengan/i.test(z.name + z.network) ? Math.max(0, Math.round((tide.value - 100) / 5)) : 0
    const realtime = clamp(0.65 * observed + 0.25 * rainScore + bwBonus + tideBonus)
    const dynamic = clamp(WEIGHTS.structural * z.structuralRisk + WEIGHTS.historical * z.historicalRisk + WEIGHTS.realtime * realtime)
    return {
      zoneId: z.id,
      code: z.code,
      name: z.name,
      structural: z.structuralRisk,
      historical: z.historicalRisk,
      realtime,
      dynamic,
      level: levelOfScore(dynamic),
      backwater: !!bw && (bw.level === 'bahaya' || bw.level === 'siaga'),
    }
  })
}

/** Prediksi 24 jam (00:00 … 24:00 tiap 4 jam) — puncak sore mengikuti pola hujan konvektif. */
export function forecast(dynamic: number): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const bell = Math.exp(-((i - 4) ** 2) / 4)
    return clamp(dynamic * (0.55 + 0.5 * bell))
  })
}
