import type { LiveWeather } from '~/types'

/**
 * Cuaca nyata Kota Sumenep dari Open-Meteo (data model cuaca publik, tanpa kunci API).
 * Dipakai untuk tampilan suhu & kondisi; nilai sensor banjir tetap skenario simulasi.
 * Cache 10 menit agar tidak membebani layanan; bila gagal, kembali ke data terakhir atau null.
 */
const SUMENEP = { latitude: -7.0086, longitude: 113.8594 } // pusat Kota Sumenep (data kecamatan)
const TTL = 10 * 60_000

// Kode cuaca WMO yang dipakai Open-Meteo -> label dan ikon Font Awesome.
const WMO: Record<number, [string, string]> = {
  0: ['Cerah', 'fa-sun'],
  1: ['Cerah Berawan', 'fa-cloud-sun'],
  2: ['Berawan', 'fa-cloud-sun'],
  3: ['Mendung', 'fa-cloud'],
  45: ['Berkabut', 'fa-smog'],
  48: ['Berkabut', 'fa-smog'],
  51: ['Gerimis Ringan', 'fa-cloud-rain'],
  53: ['Gerimis', 'fa-cloud-rain'],
  55: ['Gerimis Lebat', 'fa-cloud-rain'],
  61: ['Hujan Ringan', 'fa-cloud-rain'],
  63: ['Hujan Sedang', 'fa-cloud-rain'],
  65: ['Hujan Lebat', 'fa-cloud-showers-heavy'],
  80: ['Hujan Lokal Ringan', 'fa-cloud-sun-rain'],
  81: ['Hujan Lokal Sedang', 'fa-cloud-showers-heavy'],
  82: ['Hujan Lokal Lebat', 'fa-cloud-showers-heavy'],
  95: ['Hujan Petir', 'fa-cloud-bolt'],
  96: ['Hujan Petir', 'fa-cloud-bolt'],
  99: ['Hujan Petir', 'fa-cloud-bolt'],
}

interface OpenMeteo {
  current: { time: string; temperature_2m: number; relative_humidity_2m: number; weather_code: number }
  hourly: { time: string[]; temperature_2m: number[] }
}

// Waktu Open-Meteo dikirim dalam zona Asia/Jakarta tanpa offset.
const wib = (t: string) => new Date(`${t}:00+07:00`).toISOString()

let cached: { at: number; value: LiveWeather } | null = null

export async function liveWeather(): Promise<LiveWeather | null> {
  if (cached && Date.now() - cached.at < TTL) return cached.value
  try {
    const r = await $fetch<OpenMeteo>('https://api.open-meteo.com/v1/forecast', {
      query: {
        ...SUMENEP,
        current: 'temperature_2m,relative_humidity_2m,weather_code',
        hourly: 'temperature_2m',
        past_hours: 12,
        forecast_hours: 1,
        timezone: 'Asia/Jakarta',
      },
      timeout: 4000,
    })
    const [condition, icon] = WMO[r.current.weather_code] ?? ['Berawan', 'fa-cloud-sun']
    const value: LiveWeather = {
      temperature: Math.round(r.current.temperature_2m),
      condition,
      icon,
      humidity: r.current.relative_humidity_2m,
      observedAt: wib(r.current.time),
      history: r.hourly.time.map((t, i) => ({ time: wib(t), value: r.hourly.temperature_2m[i] ?? 0 })),
    }
    cached = { at: Date.now(), value }
    return value
  } catch {
    return cached?.value ?? null
  }
}
