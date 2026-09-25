import type { CoordAccuracy } from '~/types'
import type { SelectOption } from '~/types/crud'

/** Opsi dropdown zona risiko + helper turunan (kecamatan & koordinat default dari zona). */
export function useZoneOptions() {
  const { items: zones } = useZones()

  const options = computed<SelectOption[]>(() =>
    [...zones.value].sort((a, b) => a.code.localeCompare(b.code)).map((z) => ({ value: z.id, label: `${z.code} · ${z.name}` })),
  )

  const byId = computed(() => new Map(zones.value.map((z) => [z.id, z])))

  function zoneName(id: string): string {
    const z = byId.value.get(id)
    return z ? `${z.code} · ${z.name}` : '-'
  }

  /** Koordinat default titik baru: titik jangkar zona (sumber mengikuti sumber koordinat zona). */
  function coordsFor(zoneId: string): { lat: number; lng: number; accuracy: CoordAccuracy } {
    const z = byId.value.get(zoneId)
    return z ? { lat: z.lat, lng: z.lng, accuracy: z.coordAccuracy } : { lat: -7.010492, lng: 113.863241, accuracy: 'data_resmi' }
  }

  function districtOf(zoneId: string): string {
    return byId.value.get(zoneId)?.district ?? 'Kota Sumenep'
  }

  return { zones, options, byId, zoneName, coordsFor, districtOf }
}

export const COORD_ACCURACY_OPTIONS: SelectOption[] = [
  { value: 'data_resmi', label: 'Data resmi (pemerintah)' },
  { value: 'penelitian', label: 'Koordinat penelitian' },
  { value: 'osm', label: 'OpenStreetMap' },
  { value: 'direktori', label: 'Direktori alamat' },
]
