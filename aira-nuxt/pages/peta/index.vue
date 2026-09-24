<script setup lang="ts">
import type { Camera, District, Sensor, Status } from '~/types'
import type { MapMarker, TileMode } from '~/types/map'

definePageMeta({ layout: 'dashboard', theme: 'dark', fullBleed: true })
useSeoMeta({ title: 'Peta & Monitoring - AIRA', description: 'Peta monitoring banjir dan feed CCTV Kabupaten Surnenep.', robots: 'noindex' })

const { items: cameras, pending: camerasPending } = useCameras()
const { items: sensors } = useSensors()
const { items: districts } = useDistricts()

// ---------- Filter ----------
type Jenis = 'semua' | 'kecamatan' | 'camera' | 'water_level' | 'rainfall' | 'weather'
const fDistrict = ref('')
const fStatus = ref<Status | ''>('')
const fJenis = ref<Jenis>('semua')
const showRisk = ref(true)
const showBoundary = ref(true)
const showRiver = ref(true)
const showRoads = ref(false)
const tile = ref<TileMode>('satelit')
const layerMenu = ref(false)
const layers = reactive({ kecamatan: true, camera: true, rainfall: true, weather: false })

const selectClass =
  "bg-panel border border-borderdark text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_10px_center] bg-no-repeat"

function matches(item: { district: string; status: Status }) {
  return (!fDistrict.value || item.district === fDistrict.value) && (!fStatus.value || item.status === fStatus.value)
}
const want = (j: Jenis) => fJenis.value === 'semua' || fJenis.value === j

// ---------- Popup ----------
function nearestSensor(district: string, type: Sensor['type']) {
  return sensors.value.filter((s) => s.district === district && s.type === type).sort((a, b) => b.value - a.value)[0]
}

function darkPopup(img: string | null, title: string, status: Status, lines: string[]) {
  const m = statusMeta(status)
  const pill = m.label === 'Normal' ? 'bg-green-500/20 text-green-400' : m.label === 'Waspada' ? 'bg-yellow-500/20 text-yellow-400' : m.label === 'Siaga' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
  return `<div class="bg-panel/95 backdrop-blur-md border border-slate-600 rounded-xl p-3 w-64 shadow-2xl">
    <div class="flex gap-3">
      ${img ? `<img src="${escapeHtml(img)}" class="w-16 h-12 rounded object-cover flex-shrink-0" alt="" />` : ''}
      <div class="min-w-0">
        <div class="text-xs font-bold text-white mb-1">${escapeHtml(title)}</div>
        <div class="${pill} text-[9px] font-bold px-1.5 py-0.5 rounded inline-block mb-1">Risiko ${m.risk} · ${m.label}</div>
        ${lines.map((l) => `<div class="text-[10px] text-slate-300">${escapeHtml(l)}</div>`).join('')}
      </div>
    </div>
  </div>`
}

function cameraPopup(c: Camera) {
  const w = nearestSensor(c.district, 'water_level')
  const r = nearestSensor(c.district, 'rainfall')
  return darkPopup(c.imageUrl, c.name, c.status, [
    `Kec. ${c.district} · ${c.isOnline ? 'Online' : 'Offline'}`,
    ...(w ? [`Tinggi Muka Air: ${w.value} cm`] : []),
    ...(r ? [`Curah Hujan: ${r.value} mm/jam`] : []),
  ])
}

function districtPopup(d: District) {
  const w = nearestSensor(d.name, 'water_level')
  return darkPopup(null, `Kec. ${d.name}`, d.riskLevel, [
    `Persentase risiko: ${d.riskPercentage}%`,
    `Populasi: ${formatNumber(d.population)} jiwa`,
    ...(w ? [`Tinggi Muka Air: ${w.value} cm`] : []),
  ])
}

function sensorPopup(s: Sensor) {
  return darkPopup(null, s.name, s.status, [`${s.location}`, `Nilai: ${s.value} ${s.unit}`, s.isOnline ? 'Online' : 'Offline'])
}

// ---------- Marker ----------
const markers = computed<MapMarker[]>(() => {
  const list: MapMarker[] = []
  if (layers.kecamatan && want('kecamatan')) {
    list.push(
      ...districts.value
        .filter((d) => (!fDistrict.value || d.name === fDistrict.value) && (!fStatus.value || d.riskLevel === fStatus.value))
        .map((d) => ({ id: d.id, kind: 'district' as const, lat: d.coordinates.lat, lng: d.coordinates.lng, status: d.riskLevel, label: `Kec. ${d.name}`, popup: districtPopup(d) })),
    )
  }
  if (layers.camera && want('camera')) {
    list.push(...cameras.value.filter(matches).map((c) => ({ id: c.id, kind: 'camera' as const, lat: c.lat, lng: c.lng, status: c.status, label: '', popup: cameraPopup(c) })))
  }
  const sensorKinds: Sensor['type'][] = []
  if (showRiver.value) sensorKinds.push('water_level')
  if (layers.rainfall) sensorKinds.push('rainfall')
  if (layers.weather) sensorKinds.push('weather')
  list.push(
    ...sensors.value
      .filter((s) => sensorKinds.includes(s.type) && want(s.type) && matches(s))
      .map((s) => ({ id: s.id, kind: s.type, lat: s.lat, lng: s.lng, status: s.status, label: '', popup: sensorPopup(s) })),
  )
  return list
})

const areas = computed(() =>
  districts.value
    .filter((d) => !fDistrict.value || d.name === fDistrict.value)
    .map((d) => ({ id: d.id, lat: d.coordinates.lat, lng: d.coordinates.lng, status: d.riskLevel })),
)

// ---------- Interaksi ----------
const map = ref<{ zoomIn: () => void; zoomOut: () => void; resetView: () => void; focus: (id: string, zoom?: number) => void } | null>(null)
const activeCamera = ref<string | null>(null)
const panelOpen = ref(false)

function selectCamera(c: Camera) {
  activeCamera.value = c.id
  panelOpen.value = false
  if (!layers.camera) layers.camera = true
  if (fJenis.value !== 'semua' && fJenis.value !== 'camera') fJenis.value = 'semua'
  nextTick(() => map.value?.focus(c.id, 15))
}

watch(fDistrict, (name) => {
  const d = districts.value.find((x) => x.name === name)
  if (d) nextTick(() => map.value?.focus(d.id, 13))
  else map.value?.resetView()
})

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
  else document.exitFullscreen?.()
}

const tiles: { value: TileMode; label: string }[] = [
  { value: 'satelit', label: 'Satelit' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'peta', label: 'Peta' },
]

const legend = [
  { dot: 'bg-green-500', label: 'Normal' },
  { dot: 'bg-yellow-500', label: 'Waspada' },
  { dot: 'bg-orange-500', label: 'Siaga' },
  { dot: 'bg-red-500', label: 'Bahaya' },
]

const layerOptions = [
  { key: 'kecamatan', label: 'Pin Kecamatan', icon: 'fa-map-pin' },
  { key: 'camera', label: 'Titik CCTV', icon: 'fa-video' },
  { key: 'rainfall', label: 'Sensor Curah Hujan', icon: 'fa-cloud-rain' },
  { key: 'weather', label: 'Stasiun Cuaca', icon: 'fa-temperature-half' },
] as const
</script>

<template>
  <div class="flex-1 flex h-full min-w-0">
    <!-- Main Content (Map Area) -->
    <main class="flex-1 flex flex-col relative h-full bg-slate-900 border-r border-borderdark min-w-0">
      <LayoutTopbar dark>
        <template #weather-extra>
          <button class="text-slate-400 text-xs ml-2 hover:text-white hidden sm:inline" aria-label="Layar penuh" @click="toggleFullscreen">
            <i class="fa-solid fa-expand"></i>
          </button>
        </template>
      </LayoutTopbar>

      <!-- Map Area -->
      <div class="flex-1 relative overflow-hidden isolate bg-slate-900">
        <MapAiraMap
          ref="map"
          :markers="markers"
          :areas="areas"
          variant="peta"
          :tile="tile"
          :show-risk-areas="showRisk"
          :show-boundaries="showBoundary"
          :show-roads="showRoads"
          :zoom="11"
        />
        <!-- Overlay gradien risiko (seperti referensi) -->
        <div
          class="absolute inset-0 pointer-events-none z-[400]"
          style="background: radial-gradient(circle at 40% 40%, rgba(239, 68, 68, 0.12) 0%, rgba(249, 115, 22, 0.06) 30%, transparent 70%)"
        ></div>

        <!-- Map Filters -->
        <div class="absolute top-4 left-4 sm:left-6 right-4 sm:right-6 z-[600] flex flex-wrap gap-2">
          <select v-model="fDistrict" :class="selectClass" aria-label="Filter kecamatan">
            <option value="">Semua Kecamatan</option>
            <option v-for="d in districts" :key="d.id" :value="d.name">Kec. {{ d.name }}</option>
          </select>
          <select v-model="fStatus" :class="selectClass" aria-label="Filter status">
            <option value="">Semua Status</option>
            <option v-for="s in STATUS_OPTIONS" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <select v-model="fJenis" :class="selectClass" aria-label="Filter jenis titik">
            <option value="semua">Semua Jenis</option>
            <option value="kecamatan">Kecamatan</option>
            <option value="camera">CCTV</option>
            <option value="water_level">Sensor Air</option>
            <option value="rainfall">Sensor Hujan</option>
            <option value="weather">Stasiun Cuaca</option>
          </select>

          <label class="hidden md:flex items-center gap-2 bg-panel border border-borderdark rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition">
            <input v-model="showRisk" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary h-3 w-3" />
            <span class="text-xs text-slate-300">Risiko Banjir</span>
          </label>
          <label class="hidden md:flex items-center gap-2 bg-panel border border-borderdark rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition">
            <input v-model="showBoundary" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary h-3 w-3" />
            <span class="text-xs text-slate-300">Batas Wilayah</span>
          </label>
          <label class="hidden md:flex items-center gap-2 bg-panel border border-borderdark rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition">
            <input v-model="showRiver" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary h-3 w-3" />
            <span class="text-xs text-slate-300">Sungai</span>
          </label>
          <label class="hidden md:flex items-center gap-2 bg-panel border border-borderdark rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition">
            <input v-model="showRoads" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary h-3 w-3" />
            <span class="text-xs text-slate-300">Jalan</span>
          </label>
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 bg-panel border border-borderdark rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition"
              :aria-expanded="layerMenu"
              @click="layerMenu = !layerMenu"
            >
              <i class="fa-solid fa-layer-group text-slate-400 text-xs"></i>
              <span class="text-xs text-slate-300">Layer Peta</span>
            </button>
            <div v-if="layerMenu" class="absolute right-0 sm:left-0 sm:right-auto mt-2 w-52 bg-panel border border-borderdark rounded-xl shadow-2xl p-2 space-y-1">
              <label v-for="o in layerOptions" :key="o.key" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs text-slate-300">
                <input v-model="layers[o.key]" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary h-3 w-3" />
                <i class="fa-solid w-4 text-center text-slate-400" :class="o.icon"></i> {{ o.label }}
              </label>
              <div class="md:hidden border-t border-borderdark pt-1 mt-1 space-y-1">
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs text-slate-300">
                  <input v-model="showRisk" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary h-3 w-3" /> Risiko Banjir
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs text-slate-300">
                  <input v-model="showBoundary" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary h-3 w-3" /> Batas Wilayah
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs text-slate-300">
                  <input v-model="showRiver" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary h-3 w-3" /> Sungai
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs text-slate-300">
                  <input v-model="showRoads" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary h-3 w-3" /> Jalan
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Map Controls -->
        <div class="absolute bottom-40 sm:bottom-24 right-4 sm:right-6 flex flex-col gap-2 z-[600]">
          <button class="bg-panel/80 backdrop-blur-md w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-white shadow-lg" aria-label="Kembali ke utara / tampilan awal" @click="map?.resetView()">
            <i class="fa-regular fa-compass text-lg"></i>
          </button>
          <button class="bg-panel/90 backdrop-blur-md w-10 h-10 rounded-lg border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition shadow-lg" aria-label="Pengaturan layer" @click="layerMenu = !layerMenu">
            <i class="fa-solid fa-gear text-sm"></i>
          </button>
          <button class="bg-panel/90 backdrop-blur-md w-10 h-10 rounded-lg border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition shadow-lg" aria-label="Perbesar" @click="map?.zoomIn()">
            <i class="fa-solid fa-plus text-sm"></i>
          </button>
          <button class="bg-panel/90 backdrop-blur-md w-10 h-10 rounded-lg border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition shadow-lg" aria-label="Perkecil" @click="map?.zoomOut()">
            <i class="fa-solid fa-minus text-sm"></i>
          </button>
        </div>

        <!-- Map Legend (Bottom Left) -->
        <div class="absolute bottom-6 left-4 sm:left-6 bg-panel/90 backdrop-blur-md border border-slate-600 rounded-xl p-3 sm:p-4 z-[600] shadow-lg">
          <div class="text-xs font-bold text-white mb-2 sm:mb-3">Tingkat Risiko Banjir</div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-300">
            <div v-for="l in legend" :key="l.label" class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full" :class="l.dot"></span> {{ l.label }}</div>
          </div>
        </div>

        <!-- Map Type & Controls (Bottom Right) -->
        <div class="absolute bottom-24 sm:bottom-6 right-4 sm:right-6 flex items-center gap-3 z-[600]">
          <div class="bg-panel/90 backdrop-blur-md border border-slate-600 rounded-lg p-1 flex gap-1 shadow-lg">
            <button
              v-for="t in tiles"
              :key="t.value"
              class="text-[10px] font-bold px-3 py-1.5 rounded transition"
              :class="tile === t.value ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'"
              @click="tile = t.value"
            >
              {{ t.label }}
            </button>
          </div>
          <button
            class="bg-panel/90 backdrop-blur-md border border-slate-600 rounded-lg w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition shadow-lg"
            aria-label="Pusatkan peta"
            @click="map?.resetView()"
          >
            <i class="fa-solid fa-crosshairs text-xs"></i>
          </button>
          <button
            class="xl:hidden bg-primary rounded-lg h-8 px-3 flex items-center gap-2 text-white text-[10px] font-bold shadow-lg"
            @click="panelOpen = true"
          >
            <i class="fa-solid fa-video"></i> Kamera
          </button>
        </div>
      </div>
    </main>

    <!-- Right Panel (CCTV Feed) -->
    <div class="hidden xl:flex h-full">
      <DashboardCCTVFeedPanel :cameras="cameras" :loading="camerasPending && !cameras.length" :active-id="activeCamera" @select="selectCamera" />
    </div>

    <!-- Drawer panel kamera (layar < xl) -->
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div v-if="panelOpen" class="xl:hidden fixed inset-0 z-[700] flex justify-end">
        <div class="absolute inset-0 bg-black/60" @click="panelOpen = false"></div>
        <div class="relative h-full w-full sm:w-auto">
          <DashboardCCTVFeedPanel :cameras="cameras" :active-id="activeCamera" @select="selectCamera" @close="panelOpen = false" />
        </div>
      </div>
    </Transition>
  </div>
</template>
