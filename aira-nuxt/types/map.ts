import type { CoordAccuracy, Status } from '~/types'
import marengan from '~/assets/geo/kali-marengan.json'

export type MarkerKind = 'zone' | 'district' | 'camera' | 'water_level' | 'river_level' | 'rainfall' | 'weather' | 'tide'

export interface MapMarker {
  id: string
  kind: MarkerKind
  lat: number
  lng: number
  status: Status
  label: string
  accuracy?: CoordAccuracy
  /** HTML popup (sudah di-escape oleh pemanggil) */
  popup?: string
}

export interface MapArea {
  id: string
  lat: number
  lng: number
  status: Status
  /** Radius (m); default mengikuti status */
  radius?: number
  dashed?: boolean
}

export interface MapLine {
  id: string
  /** Polyline atau multi-polyline [lat, lng] */
  points: [number, number][] | [number, number][][]
  color: string
  label: string
  dashed?: boolean
  weight?: number
}

export type TileMode = 'satelit' | 'hybrid' | 'peta'

/** Pusat Kota Sumenep — area studi kasus (koridor titik kritis & outlet drainase). */
export const SUMENEP_CITY_CENTER: [number, number] = [-7.0195, 113.8745]
export const SUMENEP_CITY_ZOOM = 14

/** Kali Marengan — geometri nyata OpenStreetMap (ODbL), dihasilkan oleh scripts/seed.mjs. */
export const MARENGAN_LINE: MapLine = {
  id: 'kali-marengan',
  points: marengan.lines as [number, number][][],
  color: '#38bdf8',
  label: 'Kali Marengan (geometri OpenStreetMap)',
  weight: 5,
}
