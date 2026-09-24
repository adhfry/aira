<script setup lang="ts">
import type { District, Status } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Analisis Risiko Kecamatan - AIRA', description: 'Kelola data kecamatan dan tingkat risiko banjir.', robots: 'noindex' })

const crud = useDistricts()
const { items: cameras } = useCameras()
const { items: sensors } = useSensors()

/** Aturan level risiko dari persentase (sama dengan server). */
function levelOf(p: number): Status {
  if (p >= 70) return 'bahaya'
  if (p >= 50) return 'siaga'
  if (p >= 35) return 'waspada'
  return 'normal'
}

const columns: CrudColumn[] = [
  { key: 'name', label: 'Kecamatan', sortable: true },
  { key: 'riskPercentage', label: 'Persentase Risiko', sortable: true },
  { key: 'riskLevel', label: 'Level', sortable: true, sortValue: (i) => STATUS_ORDER[i.riskLevel as Status] },
  { key: 'population', label: 'Populasi', sortable: true },
  { key: 'devices', label: 'Perangkat' },
  { key: 'coordinates', label: 'Koordinat' },
]

const fields: CrudField[] = [
  { key: 'name', label: 'Nama Kecamatan', type: 'text', required: true, placeholder: 'mis. Kota Surnenep' },
  { key: 'population', label: 'Populasi (jiwa)', type: 'number', required: true, min: 0, step: 1 },
  { key: 'riskPercentage', label: 'Persentase Risiko (%)', type: 'number', required: true, min: 0, max: 100, step: 1 },
  {
    key: 'riskLevel',
    label: 'Level Risiko',
    type: 'select',
    options: [{ value: 'auto', label: 'Otomatis dari persentase' }, ...STATUS_OPTIONS],
    help: '≥70 Bahaya · ≥50 Siaga · ≥35 Waspada · lainnya Normal',
  },
  { key: 'lat', label: 'Latitude', type: 'number', required: true, min: -90, max: 90 },
  { key: 'lng', label: 'Longitude', type: 'number', required: true, min: -180, max: 180 },
]

const filters: CrudFilter[] = [{ key: 'riskLevel', label: 'Level', options: STATUS_OPTIONS }]

const defaults = (): FormModel => ({ name: '', population: '', riskPercentage: '', riskLevel: 'auto', lat: -6.975, lng: 113.83 })
const toForm = (d: District): FormModel => ({
  name: d.name,
  population: d.population,
  riskPercentage: d.riskPercentage,
  riskLevel: d.riskLevel === levelOf(d.riskPercentage) ? 'auto' : d.riskLevel,
  lat: d.coordinates.lat,
  lng: d.coordinates.lng,
})
const toPayload = (f: FormModel) => {
  const pct = Number(f.riskPercentage)
  return {
    name: f.name,
    population: Number(f.population),
    riskPercentage: pct,
    riskLevel: f.riskLevel === 'auto' || !f.riskLevel ? levelOf(pct) : f.riskLevel,
    coordinates: { lat: Number(f.lat), lng: Number(f.lng) },
  }
}

const deviceCount = (name: string) => ({
  cameras: cameras.value.filter((c) => c.district === name).length,
  sensors: sensors.value.filter((s) => s.district === name).length,
})

const summary = computed(() => {
  const items = crud.items.value
  const count = (s: Status) => items.filter((d) => d.riskLevel === s).length
  return [
    { label: 'Total Kecamatan', value: items.length, icon: 'fa-map', box: 'bg-blue-50 text-primary' },
    { label: 'Bahaya', value: count('bahaya'), icon: 'fa-triangle-exclamation', box: 'bg-red-50 text-red-500' },
    { label: 'Siaga', value: count('siaga'), icon: 'fa-circle-exclamation', box: 'bg-orange-50 text-orange-500' },
    { label: 'Waspada / Normal', value: count('waspada') + count('normal'), icon: 'fa-shield-halved', box: 'bg-green-50 text-green-600' },
  ]
})
</script>

<template>
  <CrudPage
    title="Analisis Risiko Kecamatan"
    subtitle="Data kecamatan, persentase risiko, dan level status banjir."
    icon="fa-chart-line"
    entity="Kecamatan"
    search-placeholder="Cari nama kecamatan…"
    :items="crud.items.value"
    :pending="crud.pending.value"
    :error="crud.error.value"
    :columns="columns"
    :fields="fields"
    :filters="filters"
    :defaults="defaults"
    :to-form="toForm"
    :to-payload="toPayload"
    :item-label="(d) => `Kec. ${d.name}`"
    :create="crud.create"
    :update="crud.update"
    :remove="crud.remove"
    :refresh="crud.refresh"
  >
    <template #summary><CrudSummaryCards :cards="summary" /></template>

    <template #cell-name="{ item }">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="statusMeta(item.riskLevel).soft">
          <i class="fa-solid fa-location-dot text-sm"></i>
        </div>
        <span class="font-bold text-slate-800 whitespace-nowrap">Kec. {{ item.name }}</span>
      </div>
    </template>
    <template #cell-riskPercentage="{ item }">
      <div class="flex items-center gap-3 min-w-[160px]">
        <div class="flex-1 bg-slate-100 rounded-full h-1.5">
          <div class="h-1.5 rounded-full" :class="statusMeta(item.riskLevel).bar" :style="{ width: `${item.riskPercentage}%` }"></div>
        </div>
        <span class="text-xs font-bold text-slate-800 w-9 text-right">{{ item.riskPercentage }}%</span>
      </div>
    </template>
    <template #cell-riskLevel="{ item }"><UiStatusPill :status="item.riskLevel" /></template>
    <template #cell-population="{ item }"><span class="text-xs text-slate-600 tabular-nums">{{ formatNumber(item.population) }}</span></template>
    <template #cell-devices="{ item }">
      <div class="flex gap-2 text-[11px] text-slate-600 whitespace-nowrap">
        <span><i class="fa-solid fa-video text-primary mr-1"></i>{{ deviceCount(item.name).cameras }}</span>
        <span><i class="fa-solid fa-wifi text-cyan-600 mr-1"></i>{{ deviceCount(item.name).sensors }}</span>
      </div>
    </template>
    <template #cell-coordinates="{ item }">
      <span class="text-[11px] text-slate-500 tabular-nums whitespace-nowrap">{{ item.coordinates.lat.toFixed(4) }}, {{ item.coordinates.lng.toFixed(4) }}</span>
    </template>
  </CrudPage>
</template>
