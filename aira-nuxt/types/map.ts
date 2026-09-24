import type { Status } from '~/types'

export type MarkerKind = 'district' | 'camera' | 'water_level' | 'rainfall' | 'weather'

export interface MapMarker {
  id: string
  kind: MarkerKind
  lat: number
  lng: number
  status: Status
  label: string
  /** HTML popup (sudah di-escape oleh pemanggil) */
  popup?: string
}

export interface MapArea {
  id: string
  lat: number
  lng: number
  status: Status
}

export type TileMode = 'satelit' | 'hybrid' | 'peta'

export const SURNENEP_CENTER: [number, number] = [-6.975, 113.83]
