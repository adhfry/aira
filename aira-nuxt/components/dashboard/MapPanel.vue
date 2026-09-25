<script setup lang="ts">
import type { Camera, Sensor, Zone, ZoneRisk } from '~/types'
import { MARENGAN_LINE, type MapLine, type MapMarker } from '~/types/map'
import { STATUS_HEX } from '~/utils/status'

const props = defineProps<{ zones: Zone[]; zoneRisks: ZoneRisk[]; cameras: Camera[]; sensors: Sensor[]; loading?: boolean }>()
const emit = defineEmits<{ refresh: [] }>()

type Layer = 'semua' | 'zona' | 'cctv' | 'sensor'
const layer = ref<Layer>('semua')
const map = ref<{ zoomIn: () => void; zoomOut: () => void; resetView: () => void } | null>(null)
const refreshing = ref(false)

const riskById = computed(() => new Map(props.zoneRisks.map((r) => [r.zoneId, r])))
const zoneLevel = (z: Zone) => riskById.value.get(z.id)?.level ?? 'normal'

function accuracyNote(a: Camera['coordAccuracy'], note?: string) {
  const m = COORD_ACCURACY_META[a]
  return `<div class="text-[9px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100"><b class="text-slate-700">Sumber koordinat: ${m.label}</b>${note ? `<br>${escapeHtml(note)}` : ''}</div>`
}

function zonePopup(z: Zone) {
  const r = riskById.value.get(z.id)
  const s = statusMeta(zoneLevel(z))
  return `<div class="bg-white text-slate-800 p-2.5 rounded-lg shadow-lg text-[10px] w-56">
    <div class="text-[9px] font-bold text-slate-400">${escapeHtml(z.code)} · ${escapeHtml(ZONE_TYPE_META[z.type].label)}</div>
    <div class="font-bold text-xs mb-1">${escapeHtml(z.name)}</div>
    <span class="inline-block ${s.soft} font-bold px-1.5 py-0.5 rounded">Risiko dinamis ${r?.dynamic ?? '-'} · ${s.label}</span>
    <div class="grid grid-cols-3 gap-1 mt-2 text-center">
      <div class="bg-slate-50 rounded p-1"><div class="text-slate-400">Struktur</div><b>${r?.structural ?? '-'}</b></div>
      <div class="bg-slate-50 rounded p-1"><div class="text-slate-400">Historis</div><b>${r?.historical ?? '-'}</b></div>
      <div class="bg-slate-50 rounded p-1"><div class="text-slate-400">Real-time</div><b>${r?.realtime ?? '-'}</b></div>
    </div>
    ${r?.backwater ? '<div class="text-sky-600 font-bold mt-1.5">⟲ Potensi backwater Sungai Marengan</div>' : ''}
    ${z.elevation !== null ? `<div class="text-slate-500 mt-1">Elevasi tanah ±${z.elevation} m dpl (SRTM)</div>` : ''}
    ${accuracyNote(z.coordAccuracy, z.coordNote)}
  </div>`
}

function cameraPopup(c: Camera) {
  const s = statusMeta(c.status)
  return `<div class="bg-white text-slate-800 p-2 rounded-lg shadow-lg text-[10px] w-48">
    <img src="${escapeHtml(c.imageUrl)}" alt="" class="w-full h-20 object-cover rounded mb-2" />
    <div class="text-[9px] font-bold text-slate-400">${escapeHtml(c.code)} · Titik pantau usulan</div>
    <div class="font-bold text-xs mb-1">${escapeHtml(c.name)}</div>
    <span class="inline-block ${s.soft} font-bold px-1.5 py-0.5 rounded">${s.label}</span>
    <span class="ml-1 ${c.isOnline ? 'text-green-600' : 'text-slate-400'} font-semibold">${c.isOnline ? '● Online' : '● Offline'}</span>
    ${accuracyNote(c.coordAccuracy, c.coordNote)}
  </div>`
}

function sensorPopup(s: Sensor) {
  const m = statusMeta(s.status)
  return `<div class="bg-white text-slate-800 p-2 rounded-lg shadow-lg text-[10px] w-44">
    <div class="text-[9px] font-bold text-slate-400">${escapeHtml(s.code)} · ${escapeHtml(SENSOR_TYPE_META[s.type].label)}</div>
    <div class="font-bold text-xs mb-0.5">${escapeHtml(s.name)}</div>
    <div class="font-extrabold text-sm">${s.value} ${escapeHtml(s.unit)}${s.channelDepth ? ` <span class="text-[9px] font-semibold text-slate-400">/ ${s.channelDepth} cm (${Math.round((s.value / s.channelDepth) * 100)}%)</span>` : ''}</div>
    <div class="${m.text} font-bold">Status: ${m.label}</div>
    ${accuracyNote(s.coordAccuracy, s.coordNote)}
  </div>`
}

const markers = computed<MapMarker[]>(() => {
  const list: MapMarker[] = []
  if (layer.value === 'semua' || layer.value === 'zona') {
    list.push(...props.zones.map((z) => ({ id: z.id, kind: 'zone' as const, lat: z.lat, lng: z.lng, status: zoneLevel(z), label: z.name, accuracy: z.coordAccuracy, popup: zonePopup(z) })))
  }
  if (layer.value === 'semua' || layer.value === 'cctv') {
    list.push(...props.cameras.map((c) => ({ id: c.id, kind: 'camera' as const, lat: c.lat, lng: c.lng, status: c.status, label: c.name, accuracy: c.coordAccuracy, popup: cameraPopup(c) })))
  }
  if (layer.value === 'semua' || layer.value === 'sensor') {
    list.push(...props.sensors.map((s) => ({ id: s.id, kind: s.type, lat: s.lat, lng: s.lng, status: s.status, label: s.name, accuracy: s.coordAccuracy, popup: sensorPopup(s) })))
  }
  return list
})

// Zona berkoridor digambar sebagai garis jalan OSM; zona titik (desa/sungai) sebagai lingkaran
const areas = computed(() =>
  props.zones.filter((z) => !z.path?.length).map((z) => ({ id: z.id, lat: z.lat, lng: z.lng, status: zoneLevel(z), radius: z.radius })),
)
const lines = computed<MapLine[]>(() => [
  MARENGAN_LINE,
  ...(layer.value === 'semua' || layer.value === 'zona'
    ? props.zones.filter((z) => z.path?.length).map((z) => ({ id: z.id, points: z.path, color: STATUS_HEX[zoneLevel(z)], label: `${z.code} · ${z.name}`, weight: 6 }))
    : []),
])

function refresh() {
  refreshing.value = true
  emit('refresh')
  setTimeout(() => (refreshing.value = false), 800)
}

const legend = [
  { dot: 'bg-green-500', label: 'Normal' },
  { dot: 'bg-yellow-500', label: 'Waspada' },
  { dot: 'bg-orange-500', label: 'Siaga' },
  { dot: 'bg-red-500', label: 'Bahaya' },
  { dot: 'bg-blue-500', label: 'CCTV' },
  { dot: 'bg-cyan-500', label: 'TMA Saluran' },
  { dot: 'bg-sky-500', label: 'TMA Sungai' },
  { dot: 'bg-purple-500', label: 'Hujan' },
]
</script>

<template>
  <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[440px] sm:h-[500px]">
    <DashboardPanelHeader title="Peta Risiko Banjir – Kota Sumenep" subtitle="Zona titik kritis BRIDA–ITS, outlet drainase, dan titik pantau AIRA">
      <select
        v-model="layer"
        aria-label="Pilih layer peta"
        class="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="semua">Semua Layer</option>
        <option value="zona">Zona Risiko</option>
        <option value="cctv">CCTV</option>
        <option value="sensor">Sensor</option>
      </select>
      <button
        class="bg-slate-50 border border-slate-200 text-slate-500 hover:text-primary p-1.5 rounded-lg transition"
        aria-label="Muat ulang data peta"
        @click="refresh"
      >
        <i class="fa-solid fa-rotate-right text-xs" :class="{ 'fa-spin': refreshing }"></i>
      </button>
    </DashboardPanelHeader>

    <!-- Map Area -->
    <div class="flex-1 relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 isolate">
      <UiSkeleton v-if="loading" class="absolute inset-0 !bg-slate-700" />
      <MapAiraMap
        v-else
        ref="map"
        :markers="markers"
        :areas="areas"
        :lines="lines"
        variant="dashboard"
        tile="satelit"
        :show-risk-areas="layer === 'semua' || layer === 'zona'"
      />

      <!-- Map Controls -->
      <div class="absolute top-4 right-4 flex flex-col gap-1 z-[500]">
        <NuxtLink to="/peta" aria-label="Buka peta layar penuh" class="bg-white/90 backdrop-blur-sm w-8 h-8 rounded shadow flex items-center justify-center text-slate-700 hover:bg-white">
          <i class="fa-solid fa-expand text-xs"></i>
        </NuxtLink>
        <button aria-label="Perbesar" class="bg-white/90 backdrop-blur-sm w-8 h-8 rounded shadow flex items-center justify-center text-slate-700 hover:bg-white" @click="map?.zoomIn()">
          <i class="fa-solid fa-plus text-xs"></i>
        </button>
        <button aria-label="Perkecil" class="bg-white/90 backdrop-blur-sm w-8 h-8 rounded shadow flex items-center justify-center text-slate-700 hover:bg-white" @click="map?.zoomOut()">
          <i class="fa-solid fa-minus text-xs"></i>
        </button>
        <button aria-label="Pusatkan peta" class="bg-white/90 backdrop-blur-sm w-8 h-8 rounded shadow flex items-center justify-center text-slate-700 hover:bg-white" @click="map?.resetView()">
          <i class="fa-solid fa-crosshairs text-xs"></i>
        </button>
      </div>

      <!-- Legend -->
      <div
        class="absolute bottom-4 left-4 right-24 sm:right-auto bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-200 text-[9px] font-semibold text-slate-700 z-[500] max-w-md"
      >
        <div class="flex flex-wrap gap-x-3 gap-y-1">
          <span v-for="l in legend" :key="l.label" class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full" :class="l.dot"></span> {{ l.label }}</span>
        </div>
        <div class="flex flex-wrap gap-x-3 gap-y-1 mt-1 pt-1 border-t border-slate-200 text-slate-500 font-medium">
          <span class="flex items-center gap-1"><span class="w-4 h-1 rounded bg-sky-400"></span> Kali Marengan</span>
          <span class="flex items-center gap-1"><span class="w-4 h-1.5 rounded bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></span> Koridor zona (jalan OSM)</span>
        </div>
      </div>
    </div>
  </div>
</template>
