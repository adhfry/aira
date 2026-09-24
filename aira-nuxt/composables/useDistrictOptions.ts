import type { SelectOption } from '~/types/crud'

/** Opsi dropdown kecamatan + helper koordinat default untuk titik baru. */
export function useDistrictOptions() {
  const { items: districts } = useDistricts()

  const options = computed<SelectOption[]>(() =>
    [...districts.value].sort((a, b) => a.name.localeCompare(b.name, 'id')).map((d) => ({ value: d.name, label: `Kec. ${d.name}` })),
  )

  /** Koordinat kecamatan + sedikit pergeseran acak agar pin tidak menumpuk. */
  function coordsFor(name: string): { lat: number; lng: number } {
    const d = districts.value.find((x) => x.name === name)
    const base = d?.coordinates ?? { lat: -6.975, lng: 113.83 }
    const jitter = () => Math.round((Math.random() - 0.5) * 0.02 * 1e5) / 1e5
    return { lat: +(base.lat + jitter()).toFixed(5), lng: +(base.lng + jitter()).toFixed(5) }
  }

  return { districts, options, coordsFor }
}
