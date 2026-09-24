<script setup lang="ts">
import type { Sensor, SensorType } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'
import { STATUS_HEX } from '~/utils/status'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Manajemen Sensor IoT - AIRA', description: 'Kelola sensor tinggi muka air, curah hujan, dan stasiun cuaca.', robots: 'noindex' })

const crud = useSensors()
const { options: districtOptions, coordsFor } = useDistrictOptions()

const TYPE_OPTIONS = (Object.keys(SENSOR_TYPE_META) as SensorType[]).map((v) => ({ value: v, label: SENSOR_TYPE_META[v].label }))
const TREND_OPTIONS = [
  { value: 'up', label: 'Naik' },
  { value: 'stable', label: 'Stabil' },
  { value: 'down', label: 'Turun' },
]

const columns: CrudColumn[] = [
  { key: 'name', label: 'Sensor', sortable: true },
  { key: 'type', label: 'Jenis', sortable: true },
  { key: 'district', label: 'Kecamatan', sortable: true },
  { key: 'value', label: 'Nilai', sortable: true },
  { key: 'history', label: 'Tren 12 Jam' },
  { key: 'status', label: 'Status', sortable: true, sortValue: (i) => STATUS_ORDER[i.status as Sensor['status']] },
  { key: 'isOnline', label: 'Koneksi', sortable: true, sortValue: (i) => (i.isOnline ? 1 : 0) },
]

const fields = computed<CrudField[]>(() => [
  { key: 'name', label: 'Nama Sensor', type: 'text', required: true, placeholder: 'mis. TMA Kali Surnenep' },
  { key: 'type', label: 'Jenis Sensor', type: 'select', required: true, options: TYPE_OPTIONS },
  { key: 'location', label: 'Lokasi', type: 'text', required: true },
  { key: 'district', label: 'Kecamatan', type: 'select', required: true, options: districtOptions.value },
  { key: 'value', label: 'Nilai Terkini', type: 'number', required: true, min: -50, max: 10000, help: 'Satuan otomatis: cm / mm/jam / °C.' },
  { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS },
  { key: 'trend', label: 'Tren', type: 'select', options: TREND_OPTIONS, help: 'Diperbarui otomatis saat nilai berubah.' },
  { key: 'isOnline', label: 'Sensor online', type: 'checkbox' },
  { key: 'lat', label: 'Latitude', type: 'number', min: -90, max: 90, placeholder: 'Otomatis' },
  { key: 'lng', label: 'Longitude', type: 'number', min: -180, max: 180, placeholder: 'Otomatis' },
])

const filters = computed<CrudFilter[]>(() => [
  { key: 'type', label: 'Jenis', options: TYPE_OPTIONS },
  { key: 'status', label: 'Status', options: STATUS_OPTIONS },
  { key: 'district', label: 'Kecamatan', options: districtOptions.value },
])

const defaults = (): FormModel => ({ name: '', type: 'water_level', location: '', district: '', value: '', status: 'normal', trend: '', isOnline: true, lat: '', lng: '' })
const toForm = (s: Sensor): FormModel => ({
  name: s.name,
  type: s.type,
  location: s.location,
  district: s.district,
  value: s.value,
  status: s.status,
  trend: '',
  isOnline: s.isOnline,
  lat: s.lat,
  lng: s.lng,
})
function toPayload(f: FormModel) {
  const lat = optionalNumber(f.lat)
  const lng = optionalNumber(f.lng)
  const fallback = lat === undefined || lng === undefined ? coordsFor(String(f.district)) : null
  return {
    name: f.name,
    type: f.type,
    location: f.location,
    district: f.district,
    value: Number(f.value),
    unit: SENSOR_TYPE_META[f.type as SensorType]?.unit,
    status: f.status,
    trend: f.trend || undefined,
    isOnline: Boolean(f.isOnline),
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
  return [
    { label: 'Total Sensor', value: items.length, icon: 'fa-wifi', box: 'bg-blue-50 text-primary' },
    { label: 'Tinggi Muka Air', value: items.filter((s) => s.type === 'water_level').length, icon: 'fa-water', box: 'bg-cyan-50 text-cyan-600' },
    { label: 'Curah Hujan', value: items.filter((s) => s.type === 'rainfall').length, icon: 'fa-cloud-rain', box: 'bg-purple-50 text-purple-600' },
    { label: 'Online', value: `${items.filter((s) => s.isOnline).length} / ${items.length}`, icon: 'fa-signal', box: 'bg-green-50 text-green-600' },
  ]
})
</script>

<template>
  <CrudPage
    title="Manajemen Sensor IoT"
    subtitle="Sensor tinggi muka air, curah hujan, dan stasiun cuaca otomatis."
    icon="fa-wifi"
    entity="Sensor"
    search-placeholder="Cari nama sensor, lokasi, atau kecamatan…"
    :items="crud.items.value"
    :pending="crud.pending.value"
    :error="crud.error.value"
    :columns="columns"
    :fields="fields"
    :filters="filters"
    :defaults="defaults"
    :to-form="toForm"
    :to-payload="toPayload"
    :item-label="(s) => s.name"
    :create="crud.create"
    :update="crud.update"
    :remove="crud.remove"
    :refresh="crud.refresh"
  >
    <template #summary><CrudSummaryCards :cards="summary" /></template>

    <template #cell-name="{ item }">
      <div class="flex items-center gap-3 min-w-[200px]">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="SENSOR_TYPE_META[item.type].box">
          <i class="fa-solid text-sm" :class="SENSOR_TYPE_META[item.type].icon"></i>
        </div>
        <div class="min-w-0">
          <div class="font-bold text-slate-800 truncate">{{ item.name }}</div>
          <div class="text-[11px] text-slate-500 truncate">{{ item.location }}</div>
        </div>
      </div>
    </template>
    <template #cell-type="{ item }"><span class="text-xs text-slate-600 whitespace-nowrap">{{ SENSOR_TYPE_META[item.type].label }}</span></template>
    <template #cell-district="{ item }"><span class="text-slate-600 whitespace-nowrap">Kec. {{ item.district }}</span></template>
    <template #cell-value="{ item }">
      <div class="whitespace-nowrap">
        <span class="font-extrabold text-slate-900">{{ item.value }}</span>
        <span class="text-[11px] text-slate-500"> {{ item.unit }}</span>
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
  </CrudPage>
</template>
