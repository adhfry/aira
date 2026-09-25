<script setup lang="ts">
import type { Incident, IncidentStatus, IncidentType } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Laporan Kejadian - AIRA', description: 'Pencatatan dan verifikasi kejadian banjir.', robots: 'noindex' })

const crud = useIncidents()
const { options: districtOptions } = useDistrictOptions()
const { options: zoneOptions, zoneName, districtOf } = useZoneOptions()

const TYPE_OPTIONS = (Object.keys(INCIDENT_TYPE_META) as IncidentType[]).map((v) => ({ value: v, label: INCIDENT_TYPE_META[v].label }))
const STATUS_OPTS = (Object.keys(INCIDENT_STATUS_META) as IncidentStatus[]).map((v) => ({ value: v, label: INCIDENT_STATUS_META[v].label }))

const columns: CrudColumn[] = [
  { key: 'title', label: 'Kejadian', sortable: true },
  { key: 'type', label: 'Jenis', sortable: true },
  { key: 'district', label: 'Lokasi', sortable: true },
  { key: 'severity', label: 'Tingkat', sortable: true, sortValue: (i) => STATUS_ORDER[i.severity as Incident['severity']] },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'timestamp', label: 'Waktu', sortable: true },
  { key: 'reporter', label: 'Pelapor', sortable: true },
]

const fields = computed<CrudField[]>(() => [
  { key: 'title', label: 'Judul Kejadian', type: 'text', required: true, full: true, placeholder: 'mis. Peringatan Dini - Risiko Tinggi' },
  { key: 'type', label: 'Jenis', type: 'select', required: true, options: TYPE_OPTIONS },
  { key: 'severity', label: 'Tingkat', type: 'select', required: true, options: STATUS_OPTIONS },
  { key: 'zoneId', label: 'Zona Risiko', type: 'select', options: [{ value: '', label: '— Di luar zona pantau —' }, ...zoneOptions.value], full: true, help: 'Kecamatan terisi otomatis dari zona.' },
  { key: 'district', label: 'Kecamatan', type: 'select', options: districtOptions.value, help: 'Wajib bila kejadian di luar zona pantau.' },
  { key: 'location', label: 'Lokasi', type: 'text', required: true, placeholder: 'mis. Jl. Dr. Wahidin' },
  { key: 'status', label: 'Status Penanganan', type: 'select', required: true, options: STATUS_OPTS },
  { key: 'timestamp', label: 'Waktu Kejadian', type: 'datetime', required: true },
  { key: 'reporter', label: 'Pelapor', type: 'text', placeholder: 'Sistem AIRA', full: true },
  { key: 'description', label: 'Deskripsi', type: 'textarea', full: true },
])

const filters = computed<CrudFilter[]>(() => [
  { key: 'type', label: 'Jenis', options: TYPE_OPTIONS },
  { key: 'severity', label: 'Tingkat', options: STATUS_OPTIONS },
  { key: 'status', label: 'Status', options: STATUS_OPTS },
  { key: 'zoneId', label: 'Zona', options: zoneOptions.value },
])

const defaults = (): FormModel => ({
  title: '',
  type: 'peringatan',
  severity: 'waspada',
  zoneId: '',
  district: '',
  location: '',
  status: 'aktif',
  timestamp: toDatetimeLocal(new Date().toISOString()),
  reporter: '',
  description: '',
})
const toForm = (i: Incident): FormModel => ({ ...i, timestamp: toDatetimeLocal(i.timestamp) })
const toPayload = (f: FormModel) => ({
  title: f.title,
  type: f.type,
  severity: f.severity,
  zoneId: f.zoneId || '',
  district: f.zoneId ? districtOf(String(f.zoneId)) : f.district || 'Kota Sumenep',
  location: f.location,
  status: f.status,
  timestamp: new Date(String(f.timestamp)).toISOString(),
  reporter: f.reporter || undefined,
  description: f.description ?? '',
})

const summary = computed(() => {
  const items = crud.items.value
  const count = (s: IncidentStatus) => items.filter((i) => i.status === s).length
  return [
    { label: 'Total Kejadian', value: items.length, icon: 'fa-file-invoice', box: 'bg-blue-50 text-primary' },
    { label: 'Aktif', value: count('aktif'), icon: 'fa-bell', box: 'bg-red-50 text-red-500' },
    { label: 'Ditangani', value: count('ditangani'), icon: 'fa-person-running', box: 'bg-yellow-50 text-yellow-600' },
    { label: 'Selesai', value: count('selesai'), icon: 'fa-circle-check', box: 'bg-green-50 text-green-600' },
  ]
})
</script>

<template>
  <CrudPage
    title="Laporan Kejadian"
    subtitle="Catat, verifikasi, dan pantau penanganan kejadian banjir."
    icon="fa-file-invoice"
    entity="Kejadian"
    search-placeholder="Cari judul, lokasi, atau pelapor…"
    :items="crud.items.value"
    :pending="crud.pending.value"
    :error="crud.error.value"
    :columns="columns"
    :fields="fields"
    :filters="filters"
    :defaults="defaults"
    :to-form="toForm"
    :to-payload="toPayload"
    :item-label="(i) => i.title"
    :create="crud.create"
    :update="crud.update"
    :remove="crud.remove"
    :refresh="crud.refresh"
  >
    <template #summary><CrudSummaryCards :cards="summary" /></template>

    <template #cell-title="{ item }">
      <div class="flex items-start gap-3 min-w-[240px]">
        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" :class="incidentMeta(item.type).box">
          <i class="fa-solid text-xs" :class="incidentMeta(item.type).icon"></i>
        </div>
        <div class="min-w-0">
          <div class="font-bold text-slate-800">{{ item.title }}</div>
          <div class="text-[11px] text-slate-500 line-clamp-1">{{ item.description }}</div>
        </div>
      </div>
    </template>
    <template #cell-type="{ item }"><span class="text-xs text-slate-600 whitespace-nowrap">{{ incidentMeta(item.type).label }}</span></template>
    <template #cell-district="{ item }">
      <div class="whitespace-nowrap">
        <div class="text-slate-700 text-xs font-semibold">{{ item.location }}</div>
        <div class="text-[11px] text-slate-500">{{ item.zoneId ? zoneName(item.zoneId) : `Kec. ${item.district}` }}</div>
      </div>
    </template>
    <template #cell-severity="{ item }"><UiStatusPill :status="item.severity" /></template>
    <template #cell-status="{ item }">
      <UiBadge :tone="INCIDENT_STATUS_META[item.status].tone">{{ INCIDENT_STATUS_META[item.status].label }}</UiBadge>
    </template>
    <template #cell-timestamp="{ item }"><span class="text-[11px] text-slate-500 whitespace-nowrap">{{ formatDateTime(item.timestamp) }}</span></template>
    <template #cell-reporter="{ item }"><span class="text-xs text-slate-600 whitespace-nowrap">{{ item.reporter }}</span></template>
  </CrudPage>
</template>
