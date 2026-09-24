import type { DashboardStats } from '~/types'

/** Kurva prediksi risiko 24 jam (00:00 … 24:00, tiap 4 jam) dengan puncak sore hari. */
function forecast(base: number): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const bell = Math.exp(-((i - 4) ** 2) / 4)
    return Math.min(100, Math.max(0, Math.round(base * (0.55 + 0.45 * bell))))
  })
}

function weatherCondition(avgRain: number): string {
  if (avgRain <= 0.5) return 'Cerah'
  if (avgRain < 25) return 'Berawan'
  if (avgRain < 40) return 'Hujan'
  return 'Hujan Lebat'
}

export default defineEventHandler(async (): Promise<DashboardStats> => {
  const db = await readDb()

  // "Lokasi" = titik CCTV + sensor tinggi muka air
  const locations = [...db.cameras, ...db.sensors.filter((s) => s.type === 'water_level')]
  const risk = {
    high: locations.filter((l) => l.status === 'siaga' || l.status === 'bahaya').length,
    medium: locations.filter((l) => l.status === 'waspada').length,
    normal: locations.filter((l) => l.status === 'normal').length,
  }
  const base = db.meta.baseline

  const online = <T extends { isOnline: boolean }>(arr: T[]) => arr.filter((x) => x.isOnline)
  const weatherStations = online(db.sensors.filter((s) => s.type === 'weather'))
  const rainGauges = online(db.sensors.filter((s) => s.type === 'rainfall'))
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)

  const dates = [
    ...db.cameras.map((c) => c.lastUpdate),
    ...db.sensors.map((s) => s.lastUpdate),
  ].filter(Boolean)

  return {
    risk,
    riskDelta: { high: risk.high - base.high, medium: risk.medium - base.medium, normal: risk.normal - base.normal },
    cameras: { total: db.cameras.length, online: online(db.cameras).length },
    sensors: { total: db.sensors.length, online: online(db.sensors).length },
    activeIncidents: db.incidents.filter((i) => i.status === 'aktif').length,
    weather: {
      temperature: Math.round(avg(weatherStations.map((s) => s.value)) || 28),
      condition: weatherCondition(avg(rainGauges.map((s) => s.value))),
    },
    lastUpdate: dates.sort().at(-1) ?? new Date().toISOString(),
    predictions: [...db.districts]
      .sort((a, b) => b.riskPercentage - a.riskPercentage)
      .map((d) => ({ district: d.name, values: forecast(d.riskPercentage) })),
  }
})
