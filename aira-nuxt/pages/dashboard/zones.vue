<script setup lang="ts">
import type { DrainageStatus, Zone, ZoneType } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({
  title: 'Zona Risiko Banjir - AIRA',
  description: 'Zona titik kritis BRIDA–ITS dan outlet drainase Kota Sumenep sebagai fondasi spasial AIRA.',
  robots: 'noindex',
})

const crud = useZones()
const { data: stats } = useStats()
const { options: districtOptions } = useDistrictOptions()

const riskById = computed(() => new Map((stats.value?.zoneRisks ?? []).map((r) => [r.zoneId, r])))

const TYPE_OPTIONS = (Object.keys(ZONE_TYPE_META) as ZoneType[]).map((v) => ({ value: v, label: ZONE_TYPE_META[v].label }))
const DRAIN_OPTIONS = (Object.keys(DRAINAGE_STATUS_META) as DrainageStatus[]).map((v) => ({ value: v, label: DRAINAGE_STATUS_META[v].label }))

const columns: CrudColumn[] = [
  { key: 'name', label: 'Zona', sortable: true, sortValue: (i) => String(i.code) },
  { key: 'drainage', label: 'Drainase (kajian 2017)' },
  { key: 'risk', label: 'Risiko 3 Layer', sortable: true, sortValue: (i) => riskById.value.get(String(i.id))?.dynamic ?? 0 },
  { key: 'sources', label: 'Dasar Penelitian' },
  { key: 'coordAccuracy', label: 'Koordinat', sortable: true },
]

const fields = computed<CrudField[]>(() => [
  { key: 'code', label: 'Kode Zona', type: 'text', required: true, placeholder: 'mis. KRT-07 / OUT-02' },
  { key: 'name', label: 'Nama Zona / Koridor', type: 'text', required: true },
  { key: 'type', label: 'Jenis Zona', type: 'select', required: true, options: TYPE_OPTIONS },
  { key: 'district', label: 'Kecamatan', type: 'select', required: true, options: districtOptions.value },
  { key: 'network', label: 'Jaringan Drainase / Koridor', type: 'text', full: true, placeholder: 'mis. Wahid Hasyim → Pasar Anom → Bumi Sumekar → Satelit' },
  { key: 'outlet', label: 'Nomor Outlet', type: 'number', min: 1, max: 20, step: 1, placeholder: 'Kosong bila tidak terkait' },
  { key: 'capacity', label: 'Kapasitas Saluran (m³/s)', type: 'number', min: 0, step: 0.01 },
  { key: 'drainageStatus', label: 'Status Drainase (Q5)', type: 'select', required: true, options: DRAIN_OPTIONS },
  { key: 'backwaterLength', label: 'Panjang Backwater (m)', type: 'number', min: 0, step: 0.01 },
  { key: 'structuralRisk', label: 'Risiko Struktural (0–100)', type: 'number', required: true, min: 0, max: 100, step: 1, help: 'Layer 1: drainase, outlet, backwater, topografi, tata guna lahan.' },
  { key: 'historicalRisk', label: 'Risiko Historis (0–100)', type: 'number', required: true, min: 0, max: 100, step: 1, help: 'Layer 2: frekuensi, durasi, kedalaman kejadian.' },
  { key: 'lat', label: 'Latitude', type: 'number', required: true, min: -90, max: 90 },
  { key: 'lng', label: 'Longitude', type: 'number', required: true, min: -180, max: 180 },
  { key: 'radius', label: 'Radius Zona (m)', type: 'number', min: 50, max: 5000, step: 10 },
  { key: 'coordAccuracy', label: 'Sumber Koordinat', type: 'select', required: true, options: COORD_ACCURACY_OPTIONS },
  { key: 'coordNote', label: 'Catatan Koordinat', type: 'textarea', full: true, placeholder: 'Sumber koordinat (dokumen, objek OSM, alamat terdaftar)' },
  { key: 'elevation', label: 'Elevasi Tanah (m dpl)', type: 'number', min: -50, max: 5000, step: 1, help: 'SRTM 30 m / survei.' },
  { key: 'sources', label: 'Sumber Penelitian', type: 'tags', full: true, help: 'Pisahkan beberapa sumber dengan tanda titik koma (;).' },
  { key: 'notes', label: 'Catatan', type: 'textarea', full: true },
])

const filters = computed<CrudFilter[]>(() => [
  { key: 'type', label: 'Jenis', options: TYPE_OPTIONS },
  { key: 'drainageStatus', label: 'Drainase', options: DRAIN_OPTIONS },
  { key: 'coordAccuracy', label: 'Sumber', options: COORD_ACCURACY_OPTIONS },
  {
    key: 'level',
    label: 'Risiko',
    options: STATUS_OPTIONS,
    match: (item, v) => riskById.value.get(String(item.id))?.level === v,
  },
])

const defaults = (): FormModel => ({
  code: '',
  name: '',
  type: 'titik_kritis',
  district: 'Kota Sumenep',
  network: '',
  outlet: '',
  capacity: '',
  drainageStatus: 'tidak_dikaji',
  backwaterLength: '',
  structuralRisk: 60,
  historicalRisk: 50,
  lat: -7.0195,
  lng: 113.8725,
  radius: 300,
  coordAccuracy: 'osm',
  elevation: '',
  coordNote: '',
  sources: '',
  notes: '',
})
// Geometri koridor (path) tidak diedit lewat form — tetap tersimpan saat update
const toForm = ({ path: _path, ...z }: Zone): FormModel => ({
  ...z,
  outlet: z.outlet ?? '',
  capacity: z.capacity ?? '',
  backwaterLength: z.backwaterLength ?? '',
  elevation: z.elevation ?? '',
  sources: z.sources.join('; '),
})
const toPayload = (f: FormModel) => ({
  code: f.code,
  name: f.name,
  type: f.type,
  district: f.district,
  network: f.network ?? '',
  outlet: optionalNumber(f.outlet) ?? null,
  capacity: optionalNumber(f.capacity) ?? null,
  drainageStatus: f.drainageStatus,
  backwaterLength: optionalNumber(f.backwaterLength) ?? null,
  structuralRisk: Number(f.structuralRisk),
  historicalRisk: Number(f.historicalRisk),
  lat: Number(f.lat),
  lng: Number(f.lng),
  radius: optionalNumber(f.radius) ?? 300,
  coordAccuracy: f.coordAccuracy,
  coordNote: f.coordNote ?? '',
  elevation: optionalNumber(f.elevation) ?? null,
  sources: String(f.sources ?? '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean),
  notes: f.notes ?? '',
})

const summary = computed(() => {
  const items = crud.items.value
  return [
    { label: 'Titik Kritis BRIDA–ITS', value: items.filter((z) => z.type === 'titik_kritis').length, icon: 'fa-triangle-exclamation', box: 'bg-red-50 text-red-500' },
    { label: 'Outlet Tergenang (Q5)', value: new Set(items.filter((z) => z.drainageStatus === 'tergenang').map((z) => z.outlet)).size, icon: 'fa-diagram-project', box: 'bg-blue-50 text-primary' },
    { label: 'Outlet Berpengaruh Backwater (kajian)', value: new Set(items.filter((z) => z.backwaterLength).map((z) => z.outlet)).size, icon: 'fa-arrow-rotate-left', box: 'bg-sky-50 text-sky-600' },
    { label: 'Koridor Jalan OSM Terpetakan', value: items.filter((z) => z.path?.length).length, icon: 'fa-route', box: 'bg-purple-50 text-purple-600' },
  ]
})
</script>

<template>
  <div class="space-y-6">
    <CrudPage
      title="Zona Risiko Banjir"
      subtitle="Fondasi spasial AIRA: titik kritis BRIDA–ITS (2026) & outlet drainase Kota Sumenep (Resmani dkk., 2017)."
      icon="fa-draw-polygon"
      entity="Zona"
      search-placeholder="Cari kode, nama zona, atau jaringan drainase…"
      :items="crud.items.value"
      :pending="crud.pending.value"
      :error="crud.error.value"
      :columns="columns"
      :fields="fields"
      :filters="filters"
      :defaults="defaults"
      :to-form="toForm"
      :to-payload="toPayload"
      :item-label="(z) => `${z.code} ${z.name}`"
      :create="crud.create"
      :update="crud.update"
      :remove="crud.remove"
      :refresh="crud.refresh"
    >
      <template #summary><CrudSummaryCards :cards="summary" /></template>

      <template #cell-name="{ item }">
        <div class="flex items-start gap-3 min-w-[240px] max-w-xs">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="ZONE_TYPE_META[item.type].box">
            <i class="fa-solid text-sm" :class="ZONE_TYPE_META[item.type].icon"></i>
          </div>
          <div class="min-w-0">
            <div class="text-[10px] font-bold text-slate-400">{{ item.code }} · {{ ZONE_TYPE_META[item.type].label }}</div>
            <div class="font-bold text-slate-800">{{ item.name }}</div>
            <div class="text-[11px] text-slate-500 line-clamp-2">{{ item.network }}</div>
          </div>
        </div>
      </template>

      <template #cell-drainage="{ item }">
        <div class="text-xs space-y-1 whitespace-nowrap">
          <div class="text-slate-700 font-semibold">
            {{ item.outlet ? `Outlet ${item.outlet}` : '—' }}<span v-if="item.capacity" class="text-slate-500 font-normal"> · {{ item.capacity }} m³/s</span>
          </div>
          <UiBadge :tone="DRAINAGE_STATUS_META[item.drainageStatus].tone">{{ DRAINAGE_STATUS_META[item.drainageStatus].label }}</UiBadge>
          <div v-if="item.backwaterLength" class="text-[10px] text-sky-600 font-semibold">
            <i class="fa-solid fa-arrow-rotate-left"></i> backwater ±{{ item.backwaterLength.toLocaleString('id-ID') }} m
          </div>
        </div>
      </template>

      <template #cell-risk="{ item }">
        <div class="min-w-[170px]">
          <template v-if="riskById.get(item.id)">
            <div class="flex items-center justify-between mb-1">
              <UiStatusPill :status="riskById.get(item.id)!.level" :label="`Dinamis ${riskById.get(item.id)!.dynamic}`" />
              <span v-if="riskById.get(item.id)!.backwater" class="text-[9px] font-bold text-sky-600">BACKWATER</span>
            </div>
            <div class="space-y-0.5 text-[9px] text-slate-500">
              <div v-for="l in [
                { k: 'S', v: riskById.get(item.id)!.structural, c: 'bg-primary' },
                { k: 'H', v: riskById.get(item.id)!.historical, c: 'bg-purple-500' },
                { k: 'R', v: riskById.get(item.id)!.realtime, c: 'bg-orange-500' },
              ]" :key="l.k" class="flex items-center gap-1.5">
                <span class="w-2 font-bold">{{ l.k }}</span>
                <div class="flex-1 bg-slate-100 rounded-full h-1"><div class="h-1 rounded-full" :class="l.c" :style="{ width: `${l.v}%` }"></div></div>
                <span class="w-5 text-right tabular-nums">{{ l.v }}</span>
              </div>
            </div>
          </template>
          <span v-else class="text-[11px] text-slate-400">Menghitung…</span>
        </div>
      </template>

      <template #cell-sources="{ item }">
        <ul class="text-[10px] text-slate-600 space-y-0.5 max-w-[240px]">
          <li v-for="s in item.sources" :key="s" class="flex gap-1"><i class="fa-solid fa-book-open text-slate-300 mt-0.5"></i> <span>{{ s }}</span></li>
        </ul>
      </template>

      <template #cell-coordAccuracy="{ item }">
        <div class="max-w-[200px]">
          <CrudAccuracyBadge :value="item.coordAccuracy" />
          <div class="text-[10px] text-slate-400 tabular-nums mt-0.5">{{ item.lat.toFixed(6) }}, {{ item.lng.toFixed(6) }}<span v-if="item.elevation !== null" class="whitespace-nowrap"> · elev. {{ item.elevation }} m</span></div>
          <div class="text-[10px] text-slate-500 leading-snug line-clamp-2" :title="item.coordNote">{{ item.coordNote }}</div>
        </div>
      </template>
    </CrudPage>

    <!-- Rujukan -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h2 class="font-bold text-slate-800 text-sm mb-1">Rujukan Penelitian</h2>
      <p class="text-[11px] text-slate-500 mb-4">
        Setiap koordinat memiliki sumber yang dapat ditelusuri: data resmi (Pusdatin Kemendikdasmen), koordinat penelitian (Sungai Marengan),
        geometri jalan/sungai OpenStreetMap, atau alamat terdaftar pada jalan yang disebut penelitian. Elevasi tanah dari SRTM 30 m.
        Penelitian tidak mempublikasikan titik CCTV — kamera &amp; sensor adalah titik pantau usulan AIRA pada lokasi bersumber tersebut.
      </p>
      <div class="grid md:grid-cols-2 gap-3">
        <a
          v-for="r in REFERENCES"
          :key="r.key"
          :href="r.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-primary hover:bg-blue-50/40 transition"
        >
          <div class="text-[10px] font-bold text-primary">{{ r.short }} · {{ r.role }}</div>
          <div class="text-xs font-bold text-slate-800">{{ r.title }}</div>
          <div class="text-[10px] text-slate-500 mt-1">{{ r.detail }}</div>
        </a>
      </div>
    </div>
  </div>
</template>
