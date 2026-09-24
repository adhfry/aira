import type { DashboardStats } from '~/types'

/** Statistik agregat dashboard (dibagi antara Topbar, kartu metrik, dan grafik). */
export function useStats() {
  return useFetch<DashboardStats>('/api/stats', { key: 'stats' })
}
