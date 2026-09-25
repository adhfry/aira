import type { DashboardStats } from '~/types'

function weatherCondition(avgRain: number): string {
  if (avgRain <= 0.5) return 'Cerah'
  if (avgRain < 25) return 'Berawan'
  if (avgRain < 40) return 'Hujan'
  return 'Hujan Lebat'
}

export default defineEventHandler(async (): Promise<DashboardStats> => {
  const db = await readDb()

  const online = <T extends { isOnline: boolean }>(arr: T[]) => arr.filter((x) => x.isOnline)
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)

  const { river, readings } = computeBackwater(db)
  const zoneRisks = computeZoneRisks(db, readings).sort((a, b) => b.dynamic - a.dynamic)

  const rain = online(db.sensors.filter((s) => s.type === 'rainfall')).map((s) => s.value)
  const weather = online(db.sensors.filter((s) => s.type === 'weather')).map((s) => s.value)
  const tide = online(db.sensors.filter((s) => s.type === 'tide'))[0]
  const dates = [...db.cameras.map((c) => c.lastUpdate), ...db.sensors.map((s) => s.lastUpdate)].filter(Boolean)

  return {
    zones: {
      total: zoneRisks.length,
      high: zoneRisks.filter((z) => z.level === 'bahaya' || z.level === 'siaga').length,
      medium: zoneRisks.filter((z) => z.level === 'waspada').length,
      normal: zoneRisks.filter((z) => z.level === 'normal').length,
    },
    cameras: { total: db.cameras.length, online: online(db.cameras).length },
    sensors: { total: db.sensors.length, online: online(db.sensors).length },
    activeIncidents: db.incidents.filter((i) => i.status === 'aktif').length,
    weather: { temperature: Math.round(avg(weather) || 28), condition: weatherCondition(avg(rain)) },
    rainfall: { max: rain.length ? Math.max(...rain) : 0, avg: Math.round(avg(rain)) },
    tide: tide?.value ?? null,
    lastUpdate: dates.sort().at(-1) ?? new Date().toISOString(),
    zoneRisks,
    backwater: { riverLevel: river?.value ?? null, riverSensor: river?.name ?? null, readings },
    predictions: zoneRisks.map((z) => ({ zone: z.name, values: forecast(z.dynamic) })),
    weights: { ...WEIGHTS },
  }
})
