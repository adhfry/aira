<script setup lang="ts">
import type { Camera } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Manajemen CCTV - AIRA', description: 'Kelola titik pantau CCTV usulan AIRA di zona risiko banjir Kota Sumenep.', robots: 'noindex' })

const crud = useCameras()
const { options: zoneOptions, zoneName, coordsFor, districtOf } = useZoneOptions()

const columns: CrudColumn[] = [
  { key: 'name', label: 'Titik Pantau', sortable: true, sortValue: (i) => String(i.code) },
  { key: 'zoneId', label: 'Zona', sortable: true },
  { key: 'status', label: 'Status', sortable: true, sortValue: (i) => STATUS_ORDER[i.status as Camera['status']] },
  { key: 'isOnline', label: 'Koneksi', sortable: true, sortValue: (i) => (i.isOnline ? 1 : 0) },
  { key: 'coordAccuracy', label: 'Koordinat', sortable: true },
  { key: 'lastUpdate', label: 'Pembaruan', sortable: true },
]

const fields = computed<CrudField[]>(() => [
  { key: 'code', label: 'Kode Titik', type: 'text', placeholder: 'Otomatis (AIRA-0xx)' },
  { key: 'name', label: 'Nama Titik', type: 'text', required: true, placeholder: 'mis. Jl. Dr. Wahidin' },
  { key: 'zoneId', label: 'Zona Risiko', type: 'select', required: true, options: zoneOptions.value, full: true },
  { key: 'location', label: 'Lokasi / Keterangan', type: 'text', required: true, placeholder: 'mis. Depan SDN Pajagalan I' },
  { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS },
  { key: 'lat', label: 'Latitude', type: 'number', min: -90, max: 90, placeholder: 'Otomatis dari zona', help: 'Kosongkan untuk memakai titik tengah zona.' },
  { key: 'lng', label: 'Longitude', type: 'number', min: -180, max: 180, placeholder: 'Otomatis dari zona' },
  { key: 'coordAccuracy', label: 'Sumber Koordinat', type: 'select', required: true, options: COORD_ACCURACY_OPTIONS },
  { key: 'coordNote', label: 'Keterangan Sumber', type: 'text', placeholder: 'mis. Titik pada ruas OSM "Jalan Raung"' },
  { key: 'imageUrl', label: 'URL Gambar / Snapshot', type: 'url', full: true, placeholder: 'https://…' },
  { key: 'isOnline', label: 'Kamera online', type: 'checkbox', full: true },
])

const filters = computed<CrudFilter[]>(() => [
  { key: 'zoneId', label: 'Zona', options: zoneOptions.value },
  { key: 'status', label: 'Status', options: STATUS_OPTIONS },
  { key: 'coordAccuracy', label: 'Sumber', options: COORD_ACCURACY_OPTIONS },
  {
    key: 'isOnline',
    label: 'Koneksi',
    options: [
      { value: 'true', label: 'Online' },
      { value: 'false', label: 'Offline' },
    ],
  },
])

const defaults = (): FormModel => ({ code: '', name: '', zoneId: '', location: '', status: 'normal', lat: '', lng: '', coordAccuracy: 'osm', coordNote: '', imageUrl: '', isOnline: true })
const toForm = (c: Camera): FormModel => ({ ...c })
function toPayload(f: FormModel) {
  const zoneId = String(f.zoneId)
  const lat = optionalNumber(f.lat)
  const lng = optionalNumber(f.lng)
  const fallback = lat === undefined || lng === undefined ? coordsFor(zoneId) : null
  return {
    code: f.code || undefined,
    name: f.name,
    zoneId,
    district: districtOf(zoneId),
    location: f.location,
    status: f.status,
    coordAccuracy: fallback ? fallback.accuracy : f.coordAccuracy,
    coordNote: fallback ? 'Mengikuti titik jangkar zona.' : f.coordNote || '',
    imageUrl: f.imageUrl || undefined,
    isOnline: Boolean(f.isOnline),
    lat: lat ?? fallback!.lat,
    lng: lng ?? fallback!.lng,
  }
}

const summary = computed(() => {
  const items = crud.items.value
  return [
    { label: 'Titik CCTV Usulan', value: items.length, icon: 'fa-video', box: 'bg-blue-50 text-primary' },
    { label: 'Online', value: `${items.filter((c) => c.isOnline).length} / ${items.length}`, icon: 'fa-signal', box: 'bg-green-50 text-green-600' },
    { label: 'Siaga / Bahaya', value: items.filter((c) => c.status === 'siaga' || c.status === 'bahaya').length, icon: 'fa-triangle-exclamation', box: 'bg-red-50 text-red-500' },
    { label: 'Koordinat Data Resmi / Penelitian', value: items.filter((c) => c.coordAccuracy === 'data_resmi' || c.coordAccuracy === 'penelitian').length, icon: 'fa-location-crosshairs', box: 'bg-purple-50 text-purple-600' },
  ]
})
</script>

<template>
  <CrudPage
    title="Manajemen CCTV"
    subtitle="Titik pantau CCTV usulan AIRA pada zona titik kritis & outlet drainase Kota Sumenep."
    icon="fa-video"
    entity="Kamera"
    search-placeholder="Cari kode, nama titik, atau lokasi…"
    :items="crud.items.value"
    :pending="crud.pending.value"
    :error="crud.error.value"
    :columns="columns"
    :fields="fields"
    :filters="filters"
    :defaults="defaults"
    :to-form="toForm"
    :to-payload="toPayload"
    :item-label="(c) => `${c.code} ${c.name}`"
    :create="crud.create"
    :update="crud.update"
    :remove="crud.remove"
    :refresh="crud.refresh"
  >
    <template #summary><CrudSummaryCards :cards="summary" /></template>

    <template #cell-name="{ item }">
      <div class="flex items-center gap-3 min-w-[220px]">
        <img :src="item.imageUrl" :alt="item.name" class="w-14 h-10 rounded-lg object-cover flex-shrink-0" loading="lazy" />
        <div class="min-w-0">
          <div class="text-[10px] font-bold text-slate-400">{{ item.code }}</div>
          <div class="font-bold text-slate-800 truncate">{{ item.name }}</div>
          <div class="text-[11px] text-slate-500 truncate">{{ item.location }}</div>
        </div>
      </div>
    </template>
    <template #cell-zoneId="{ item }"><span class="text-xs text-slate-600 whitespace-nowrap">{{ zoneName(item.zoneId) }}</span></template>
    <template #cell-status="{ item }"><UiStatusPill :status="item.status" /></template>
    <template #cell-isOnline="{ item }">
      <UiBadge :tone="item.isOnline ? 'green' : 'slate'">
        <i class="fa-solid fa-circle text-[6px]"></i> {{ item.isOnline ? 'Online' : 'Offline' }}
      </UiBadge>
    </template>
    <template #cell-coordAccuracy="{ item }">
      <div class="whitespace-nowrap">
        <CrudAccuracyBadge :value="item.coordAccuracy" />
        <div class="text-[10px] text-slate-400 tabular-nums mt-0.5">{{ item.lat.toFixed(6) }}, {{ item.lng.toFixed(6) }}</div>
        <div class="text-[10px] text-slate-500 max-w-[220px] whitespace-normal line-clamp-2" :title="item.coordNote">{{ item.coordNote }}</div>
      </div>
    </template>
    <template #cell-lastUpdate="{ item }"><span class="text-[11px] text-slate-500 whitespace-nowrap">{{ formatDateTime(item.lastUpdate) }}</span></template>
  </CrudPage>
</template>
