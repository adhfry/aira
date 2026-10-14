import type { DrainageStatus } from '~/types'

/**
 * Penjelasan istilah teknis untuk tooltip (v-tippy), ditulis untuk pembaca awam.
 * Rumus dan bobot mengikuti server/utils/risk.ts; ubah keduanya bersamaan.
 */
export const GLOSSARY = {
  structural:
    'S = Risiko Struktural (layer 1, bobot 35%). Kondisi fisik zona: kapasitas saluran, status tergenang Q5, panjang backwater, titik kritis BRIDA–ITS, dan elevasi tanah. Skor 0–100.',
  historical:
    'H = Risiko Historis (layer 2, bobot 25%). Riwayat genangan: titik kritis BRIDA–ITS, survei genangan 31 Okt 2025, dan status tergenang pada kajian drainase 2017. Skor 0–100.',
  realtime:
    'R = Risiko Real-time (layer 3, bobot 40%). Kondisi saat ini dari CCTV dan sensor muka air yang online, ditambah curah hujan, backwater, dan pasang laut. Skor 0–100.',
  dynamic:
    'Risiko Dinamis = S × 35% + H × 25% + R × 40%. Skor 0–39 Normal, 40–59 Waspada, 60–74 Siaga, 75–100 Bahaya.',
  backwaterActive:
    'Backwater aktif: muka air sungai lebih tinggi daripada muka air saluran di mulut outlet, sehingga air saluran tertahan dan tidak bisa mengalir ke sungai.',
  backwaterLength: (m: number) =>
    `Sepanjang ±${m.toLocaleString('id-ID')} m saluran terpengaruh air balik dari sungai (kajian drainase 2017).`,
  outlet: (n: number) =>
    `Outlet ${n}: titik buang jaringan saluran drainase kota. Kota Sumenep memiliki 8 outlet (Resmani dkk., 2017).`,
  capacity: (c: number) =>
    `Kapasitas saluran: mampu mengalirkan ${c.toLocaleString('id-ID')} meter kubik air per detik (1 m³ = 1.000 liter).`,
  drainage: {
    tergenang:
      'Tergenang (Q5): saluran tidak mampu menampung debit banjir kala ulang 5 tahun, yaitu hujan besar yang rata-rata terjadi sekali dalam 5 tahun.',
    cukup:
      'Cukup (Q5): saluran mampu menampung debit banjir kala ulang 5 tahun, yaitu hujan besar yang rata-rata terjadi sekali dalam 5 tahun.',
    tidak_dikaji: 'Kapasitas saluran ini tidak dikaji dalam penelitian drainase 2017.',
  } satisfies Record<DrainageStatus, string>,
} as const
