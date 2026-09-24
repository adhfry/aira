<script setup lang="ts">
import type { Camera, District, Sensor } from '~/types'
import type { MapMarker } from '~/types/map'

const props = defineProps<{ cameras: Camera[]; sensors: Sensor[]; districts: District[]; loading?: boolean }>()
const emit = defineEmits<{ refresh: [] }>()

type Layer = 'semua' | 'cctv' | 'sensor' | 'risiko'
const layer = ref<Layer>('semua')
const map = ref<{ zoomIn: () => void; zoomOut: () => void; resetView: () => void } | null>(null)
const refreshing = ref(false)

function cameraPopup(c: Camera) {
  const s = statusMeta(c.status)
  return `<div class="bg-white text-slate-800 p-2 rounded-lg shadow-lg text-[10px] w-44">
    <img src="${escapeHtml(c.imageUrl)}" alt="" class="w-full h-16 object-cover rounded mb-2 image-grayscale" />
    <div class="font-bold text-xs mb-0.5">${escapeHtml(c.name)}</div>
    <div class="text-slate-500 mb-1">Kec. ${escapeHtml(c.district)}</div>
    <span class="inline-block ${s.soft} font-bold px-1.5 py-0.5 rounded">${s.label}</span>
    <span class="ml-1 ${c.isOnline ? 'text-green-600' : 'text-slate-400'} font-semibold">${c.isOnline ? '● Online' : '● Offline'}</span>
  </div>`
}

function sensorPopup(s: Sensor) {
  const m = statusMeta(s.status)
  return `<div class="bg-white text-slate-800 p-2 rounded-lg shadow-lg text-[10px] w-40">
    <div class="font-bold text-xs mb-0.5">${escapeHtml(s.name)}</div>
    <div class="text-slate-500 mb-1">${escapeHtml(s.location)}</div>
    <div class="font-extrabold text-sm">${s.value} ${escapeHtml(s.unit)}</div>
    <div class="${m.text} font-bold">Status: ${m.label}</div>
  </div>`
}

function districtPopup(d: District) {
  const m = statusMeta(d.riskLevel)
  return `<div class="bg-white text-slate-800 p-2 rounded-lg shadow-lg text-[10px] w-36">
    <div class="font-bold text-xs mb-0.5">Kec. ${escapeHtml(d.name)}</div>
    <div class="text-slate-500">Risiko: <b class="text-slate-800">${d.riskPercentage}%</b></div>
    <div class="${m.text} font-bold">Status: ${m.label}</div>
  </div>`
}

const markers = computed<MapMarker[]>(() => {
  const list: MapMarker[] = []
  if (layer.value === 'semua' || layer.value === 'risiko') {
    list.push(
      ...props.districts.map((d) => ({
        id: d.id,
        kind: 'district' as const,
        lat: d.coordinates.lat,
        lng: d.coordinates.lng,
        status: d.riskLevel,
        label: `Kec. ${d.name}`,
        popup: districtPopup(d),
      })),
    )
  }
  if (layer.value === 'semua' || layer.value === 'cctv') {
    list.push(...props.cameras.map((c) => ({ id: c.id, kind: 'camera' as const, lat: c.lat, lng: c.lng, status: c.status, label: c.name, popup: cameraPopup(c) })))
  }
  if (layer.value === 'semua' || layer.value === 'sensor') {
    list.push(...props.sensors.map((s) => ({ id: s.id, kind: s.type, lat: s.lat, lng: s.lng, status: s.status, label: s.name, popup: sensorPopup(s) })))
  }
  return list
})

const areas = computed(() => props.districts.map((d) => ({ id: d.id, lat: d.coordinates.lat, lng: d.coordinates.lng, status: d.riskLevel })))

async function refresh() {
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
  { dot: 'bg-cyan-500', label: 'Sensor Air' },
  { dot: 'bg-purple-500', label: 'Sensor Hujan' },
]
</script>

<template>
  <div class="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[420px] sm:h-[500px]">
    <DashboardPanelHeader title="Peta Risiko Banjir" subtitle="Sebaran titik pemantauan, status risiko, dan kondisi real-time">
      <select
        v-model="layer"
        aria-label="Pilih layer peta"
        class="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="semua">Semua Layer</option>
        <option value="cctv">CCTV</option>
        <option value="sensor">Sensor</option>
        <option value="risiko">Risiko Kecamatan</option>
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
      <MapAiraMap v-else ref="map" :markers="markers" :areas="areas" variant="dashboard" tile="satelit" grayscale :show-risk-areas="layer !== 'cctv' && layer !== 'sensor'" />

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
      </div>

      <!-- Legend -->
      <div
        class="absolute bottom-4 left-4 right-24 sm:right-auto bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-slate-200 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-semibold text-slate-700 z-[500]"
      >
        <span v-for="l in legend" :key="l.label" class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full" :class="l.dot"></span> {{ l.label }}</span>
      </div>
    </div>
  </div>
</template>
