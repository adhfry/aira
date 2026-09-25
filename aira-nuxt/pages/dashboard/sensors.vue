<script setup lang="ts">
import type { Sensor, SensorType } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'
import { STATUS_HEX } from '~/utils/status'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({
  title: 'Manajemen Sensor IoT - AIRA',
  description: 'Sensor TMA saluran outlet, TMA Sungai Marengan, pasang, curah hujan, dan stasiun cuaca.',
  robots: 'noindex',
})

const crud = useSensors()
const { options: zoneOptions, zoneName, coordsFor, districtOf } = useZoneOptions()

const TYPE_OPTIONS = (Object.keys(SENSOR_TYPE_META) as SensorType[]).map((v) => ({ value: v, label: SENSOR_TYPE_META[v].label }))
const TREND_OPTIONS = [
  { value: 'up', label: 'Naik' },
  { value: 'stable', label: 'Stabil' },
  { value: 'down', label: 'Turun' },
]

const columns: CrudColumn[] = [
  { key: 'name', label: 'Sensor', sortable: true, sortValue: (i) => String(i.code) },
  { key: 'type', label: 'Jenis', sortable: true },
  { key: 'zoneId', label: 'Zona', sortable: true },
  { key: 'value', label: 'Nilai', sortable: true },
  { key: 'history', label: 'Tren 12 Jam' },
  { key: 'status', label: 'Status', sortable: true, sortValue: (i) => STATUS_ORDER[i.status as Sensor['status']] },
  { key: 'isOnline', label: 'Koneksi', sortable: true, sortValue: (i) => (i.isOnline ? 1 : 0) },
  { key: 'coordAccuracy', label: 'Koordinat', sortable: true },
]

const fields = computed<CrudField[]>(() => [
  { key: 'code', label: 'Kode Sensor', type: 'text', placeholder: 'Otomatis (SNS-xx)' },
  { key: 'name', label: 'Nama Sensor', type: 'text', required: true, placeholder: 'mis. TMA Saluran Outlet 4' },
  { key: 'type', label: 'Jenis Sensor', type: 'select', required: true, options: TYPE_OPTIONS },
  { key: 'zoneId', label: 'Zona Risiko', type: 'select', required: true, options: zoneOptions.value },
  { key: 'location', label: 'Lokasi', type: 'text', required: true, full: true },
  { key: 'value', label: 'Nilai Terkini', type: 'number', required: true, min: -50, max: 10000, help: 'TMA: tinggi air dari dasar saluran/peilschaal (cm).' },
  { key: 'channelDepth', label: 'Kedalaman Saluran / Tinggi Tanggul (cm)', type: 'number', min: 1, max: 2000, step: 1, help: 'Untuk TMA: status otomatis dari rasio isi (≥100% meluap).' },
  { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS },
  { key: 'trend', label: 'Tren', type: 'select', options: TREND_OPTIONS, help: 'Diperbarui otomatis saat nilai berubah.' },
  { key: 'isOnline', label: 'Sensor online', type: 'checkbox' },
  { key: 'lat', label: 'Latitude', type: 'number', min: -90, max: 90, placeholder: 'Otomatis dari zona' },
  { key: 'lng', label: 'Longitude', type: 'number', min: -180, max: 180, placeholder: 'Otomatis dari zona' },
  { key: 'coordAccuracy', label: 'Sumber Koordinat', type: 'select', required: true, options: COORD_ACCURACY_OPTIONS },
  { key: 'coordNote', label: 'Keterangan Sumber', type: 'text', placeholder: 'mis. Mulut outlet — geometri OSM' },
])

const filters = computed<CrudFilter[]>(() => [
  { key: 'type', label: 'Jenis', options: TYPE_OPTIONS },
  { key: 'zoneId', label: 'Zona', options: zoneOptions.value },
  { key: 'status', label: 'Status', options: STATUS_OPTIONS },
])

const defaults = (): FormModel => ({
  code: '',
  name: '',
  type: 'water_level',
  zoneId: '',
  location: '',
  value: '',
  status: 'normal',
  trend: '',
  isOnline: true,
  lat: '',
  lng: '',
  coordAccuracy: 'osm',
  coordNote: '',
  channelDepth: '',
})
const toForm = (s: Sensor): FormModel => ({
  code: s.code,
  name: s.name,
  type: s.type,
  zoneId: s.zoneId,
  location: s.location,
  value: s.value,
  status: s.status,
  trend: '',
  isOnline: s.isOnline,
  lat: s.lat,
  lng: s.lng,
  coordAccuracy: s.coordAccuracy,
  coordNote: s.coordNote,
  channelDepth: s.channelDepth ?? '',
})
function toPayload(f: FormModel) {
  const zoneId = String(f.zoneId)
  const lat = optionalNumber(f.lat)
  const lng = optionalNumber(f.lng)
  const fallback = lat === undefined || lng === undefined ? coordsFor(zoneId) : null
  return {
    code: f.code || undefined,
    name: f.name,
    type: f.type,
    zoneId,
    district: districtOf(zoneId),
    location: f.location,
    value: Number(f.value),
    unit: SENSOR_TYPE_META[f.type as SensorType]?.unit,
    status: f.status,
    trend: f.trend || undefined,
    isOnline: Boolean(f.isOnline),
    coordAccuracy: fallback ? fallback.accuracy : f.coordAccuracy,
    coordNote: fallback ? 'Mengikuti titik jangkar zona.' : f.coordNote || '',
    channelDepth: optionalNumber(f.channelDepth) ?? null,
    lat: lat ?? fallback!.lat,
    lng: lng ?? fallback!.lng,
  }
}

function sparkPoints(s: Sensor) {
  const vals = s.history.map((h) => h.value)
  if (vals.length < 2) return ''
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const span = max - min || 1
  return vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${28 - ((v - min) / span) * 24}`).join(' ')
}

const summary = computed(() => {
  const items = crud.items.value
  const count = (t: SensorType) => items.filter((s) => s.type === t).length
  return [
    { label: 'Total Sensor', value: items.length, icon: 'fa-wifi', box: 'bg-blue-50 text-primary' },
    { label: 'TMA Saluran Outlet', value: count('water_level'), icon: 'fa-water', box: 'bg-cyan-50 text-cyan-600' },
    { label: 'Sungai & Pasang', value: count('river_level') + count('tide'), icon: 'fa-bridge-water', box: 'bg-sky-50 text-sky-600' },
    { label: 'Online', value: `${items.filter((s) => s.isOnline).length} / ${items.length}`, icon: 'fa-signal', box: 'bg-green-50 text-green-600' },
  ]
})
</script>

<template>
  <CrudPage
    title="Manajemen Sensor IoT"
    subtitle="TMA saluran tiap outlet, TMA Sungai Marengan, pasang, curah hujan, dan stasiun cuaca."
    icon="fa-wifi"
    entity="Sensor"
    search-placeholder="Cari kode, nama sensor, atau lokasi…"
    :items="crud.items.value"
    :pending="crud.pending.value"
    :error="crud.error.value"
    :columns="columns"
    :fields="fields"
    :filters="filters"
    :defaults="defaults"
    :to-form="toForm"
    :to-payload="toPayload"
    :item-label="(s) => `${s.code} ${s.name}`"
    :create="crud.create"
    :update="crud.update"
    :remove="crud.remove"
    :refresh="crud.refresh"
  >
    <template #summary><CrudSummaryCards :cards="summary" /></template>

    <template #cell-name="{ item }">
      <div class="flex items-center gap-3 min-w-[210px]">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="SENSOR_TYPE_META[item.type].box">
          <i class="fa-solid text-sm" :class="SENSOR_TYPE_META[item.type].icon"></i>
        </div>
        <div class="min-w-0">
          <div class="text-[10px] font-bold text-slate-400">{{ item.code }}</div>
          <div class="font-bold text-slate-800 truncate">{{ item.name }}</div>
          <div class="text-[11px] text-slate-500 truncate">{{ item.location }}</div>
        </div>
      </div>
    </template>
    <template #cell-type="{ item }"><span class="text-xs text-slate-600 whitespace-nowrap">{{ SENSOR_TYPE_META[item.type].label }}</span></template>
    <template #cell-zoneId="{ item }"><span class="text-xs text-slate-600 whitespace-nowrap">{{ zoneName(item.zoneId) }}</span></template>
    <template #cell-value="{ item }">
      <div class="whitespace-nowrap">
        <span class="font-extrabold text-slate-900">{{ item.value }}</span>
        <span class="text-[11px] text-slate-500"> {{ item.unit }}</span>
        <span v-if="item.channelDepth" class="text-[10px] text-slate-400"> / {{ item.channelDepth }} ({{ Math.round((item.value / item.channelDepth) * 100) }}%)</span>
        <i class="fa-solid text-[10px] ml-1" :class="[TREND_META[item.trend].icon, TREND_META[item.trend].color]" :title="TREND_META[item.trend].label"></i>
      </div>
    </template>
    <template #cell-history="{ item }">
      <svg class="w-24 h-8" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
        <polyline :points="sparkPoints(item)" fill="none" :stroke="STATUS_HEX[item.status]" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </template>
    <template #cell-status="{ item }"><UiStatusPill :status="item.status" /></template>
    <template #cell-isOnline="{ item }">
      <UiBadge :tone="item.isOnline ? 'green' : 'slate'">
        <i class="fa-solid fa-circle text-[6px]"></i> {{ item.isOnline ? 'Online' : 'Offline' }}
      </UiBadge>
    </template>
    <template #cell-coordAccuracy="{ item }">
      <div class="whitespace-nowrap">
        <CrudAccuracyBadge :value="item.coordAccuracy" />
        <div class="text-[10px] text-slate-400 tabular-nums mt-0.5" :title="item.coordNote">{{ item.lat.toFixed(6) }}, {{ item.lng.toFixed(6) }}</div>
      </div>
    </template>
  </CrudPage>
</template>
