<script setup lang="ts">
import type { Camera } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Manajemen CCTV - AIRA', description: 'Kelola titik kamera CCTV pemantauan banjir.', robots: 'noindex' })

const crud = useCameras()
const { options: districtOptions, coordsFor } = useDistrictOptions()

const columns: CrudColumn[] = [
  { key: 'name', label: 'Kamera', sortable: true },
  { key: 'district', label: 'Kecamatan', sortable: true },
  { key: 'status', label: 'Status', sortable: true, sortValue: (i) => STATUS_ORDER[i.status as Camera['status']] },
  { key: 'isOnline', label: 'Koneksi', sortable: true, sortValue: (i) => (i.isOnline ? 1 : 0) },
  { key: 'coords', label: 'Koordinat' },
  { key: 'lastUpdate', label: 'Pembaruan', sortable: true },
]

const fields = computed<CrudField[]>(() => [
  { key: 'name', label: 'Nama Kamera', type: 'text', required: true, placeholder: 'mis. Jembatan Kali Surnenep' },
  { key: 'location', label: 'Lokasi', type: 'text', required: true, placeholder: 'mis. Jl. Trunojoyo' },
  { key: 'district', label: 'Kecamatan', type: 'select', required: true, options: districtOptions.value },
  { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTIONS },
  { key: 'lat', label: 'Latitude', type: 'number', min: -90, max: 90, placeholder: 'Otomatis', help: 'Kosongkan untuk memakai titik kecamatan.' },
  { key: 'lng', label: 'Longitude', type: 'number', min: -180, max: 180, placeholder: 'Otomatis', help: 'Kosongkan untuk memakai titik kecamatan.' },
  { key: 'imageUrl', label: 'URL Gambar / Snapshot', type: 'url', full: true, placeholder: 'https://…' },
  { key: 'isOnline', label: 'Kamera online', type: 'checkbox', full: true },
])

const filters = computed<CrudFilter[]>(() => [
  { key: 'status', label: 'Status', options: STATUS_OPTIONS },
  { key: 'district', label: 'Kecamatan', options: districtOptions.value },
  {
    key: 'isOnline',
    label: 'Koneksi',
    options: [
      { value: 'true', label: 'Online' },
      { value: 'false', label: 'Offline' },
    ],
  },
])

const defaults = (): FormModel => ({ name: '', location: '', district: '', status: 'normal', lat: '', lng: '', imageUrl: '', isOnline: true })
const toForm = (c: Camera): FormModel => ({ ...c })
function toPayload(f: FormModel) {
  const lat = optionalNumber(f.lat)
  const lng = optionalNumber(f.lng)
  const fallback = lat === undefined || lng === undefined ? coordsFor(String(f.district)) : null
  return {
    name: f.name,
    location: f.location,
    district: f.district,
    status: f.status,
    imageUrl: f.imageUrl || undefined,
    isOnline: Boolean(f.isOnline),
    lat: lat ?? fallback!.lat,
    lng: lng ?? fallback!.lng,
  }
}

const summary = computed(() => {
  const items = crud.items.value
  return [
    { label: 'Total Kamera', value: items.length, icon: 'fa-video', box: 'bg-blue-50 text-primary' },
    { label: 'Online', value: items.filter((c) => c.isOnline).length, icon: 'fa-signal', box: 'bg-green-50 text-green-600' },
    { label: 'Siaga / Bahaya', value: items.filter((c) => c.status === 'siaga' || c.status === 'bahaya').length, icon: 'fa-triangle-exclamation', box: 'bg-red-50 text-red-500' },
    { label: 'Offline', value: items.filter((c) => !c.isOnline).length, icon: 'fa-video-slash', box: 'bg-slate-100 text-slate-500' },
  ]
})
</script>

<template>
  <CrudPage
    title="Manajemen CCTV"
    subtitle="Kelola titik kamera CCTV berbasis AI di seluruh kecamatan."
    icon="fa-video"
    entity="Kamera"
    search-placeholder="Cari nama kamera, lokasi, atau kecamatan…"
    :items="crud.items.value"
    :pending="crud.pending.value"
    :error="crud.error.value"
    :columns="columns"
    :fields="fields"
    :filters="filters"
    :defaults="defaults"
    :to-form="toForm"
    :to-payload="toPayload"
    :item-label="(c) => c.name"
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
          <div class="font-bold text-slate-800 truncate">{{ item.name }}</div>
          <div class="text-[11px] text-slate-500 truncate">{{ item.location }}</div>
        </div>
      </div>
    </template>
    <template #cell-district="{ item }"><span class="text-slate-600 whitespace-nowrap">Kec. {{ item.district }}</span></template>
    <template #cell-status="{ item }"><UiStatusPill :status="item.status" /></template>
    <template #cell-isOnline="{ item }">
      <UiBadge :tone="item.isOnline ? 'green' : 'slate'">
        <i class="fa-solid fa-circle text-[6px]"></i> {{ item.isOnline ? 'Online' : 'Offline' }}
      </UiBadge>
    </template>
    <template #cell-coords="{ item }">
      <span class="text-[11px] text-slate-500 tabular-nums whitespace-nowrap">{{ item.lat.toFixed(4) }}, {{ item.lng.toFixed(4) }}</span>
    </template>
    <template #cell-lastUpdate="{ item }"><span class="text-[11px] text-slate-500 whitespace-nowrap">{{ formatDateTime(item.lastUpdate) }}</span></template>
  </CrudPage>
</template>
