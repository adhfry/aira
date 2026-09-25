<script setup lang="ts">
import type { Camera, Sensor, Status, Zone } from '~/types'
import { MARENGAN_LINE, type MapLine, type MapMarker, type TileMode } from '~/types/map'
import { STATUS_HEX } from '~/utils/status'

definePageMeta({ layout: 'dashboard', theme: 'dark', fullBleed: true })
useSeoMeta({
  title: 'Peta & Monitoring - AIRA',
  description: 'Peta monitoring banjir Kota Sumenep: zona titik kritis, outlet drainase, Sungai Marengan, dan feed CCTV.',
  robots: 'noindex',
})

const { items: cameras, pending: camerasPending } = useCameras()
const { items: sensors } = useSensors()
const { items: zones } = useZones()
const { data: stats } = useStats()

// ---------- Filter ----------
type Jenis = 'semua' | 'zone' | 'camera' | 'water_level' | 'river_level' | 'rainfall' | 'weather' | 'tide'
const fZone = ref('')
const fStatus = ref<Status | ''>('')
const fJenis = ref<Jenis>('semua')
const showRisk = ref(true)
const showBoundary = ref(false)
const showRiver = ref(true)
const showRoads = ref(false)
const tile = ref<TileMode>('satelit')
const layerMenu = ref(false)
const layers = reactive({ zone: true, camera: true, water_level: true, rainfall: true, weather: false, tide: true })

const selectClass =
  "bg-panel border border-borderdark text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary appearance-none pr-8 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_10px_center] bg-no-repeat"

const riskById = computed(() => new Map((stats.value?.zoneRisks ?? []).map((r) => [r.zoneId, r])))
const zoneLevel = (z: Zone): Status => riskById.value.get(z.id)?.level ?? 'normal'
const zoneById = computed(() => new Map(zones.value.map((z) => [z.id, z])))

function matches(item: { zoneId: string; status: Status }) {
  return (!fZone.value || item.zoneId === fZone.value) && (!fStatus.value || item.status === fStatus.value)
}
const want = (j: Jenis) => fJenis.value === 'semua' || fJenis.value === j

// ---------- Popup ----------
const PILL: Record<Status, string> = {
  normal: 'bg-green-500/20 text-green-400',
  waspada: 'bg-yellow-500/20 text-yellow-400',
  siaga: 'bg-orange-500/20 text-orange-400',
  bahaya: 'bg-red-500/20 text-red-400',
}

function accuracyLine(a: Camera['coordAccuracy'], note?: string) {
  const m = COORD_ACCURACY_META[a]
  return `<div class="text-[9px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-700"><b class="text-slate-300">Sumber koordinat: ${m.label}</b>${note ? `<br>${escapeHtml(note)}` : ''}</div>`
}

function darkPopup(img: string | null, kicker: string, title: string, status: Status, badge: string, lines: string[], footer = '') {
  return `<div class="bg-panel/95 backdrop-blur-md border border-slate-600 rounded-xl p-3 w-72 shadow-2xl">
    <div class="flex gap-3">
      ${img ? `<img src="${escapeHtml(img)}" class="w-20 h-14 rounded object-cover flex-shrink-0" alt="" />` : ''}
      <div class="min-w-0">
        <div class="text-[9px] font-bold text-slate-500">${escapeHtml(kicker)}</div>
        <div class="text-xs font-bold text-white mb-1">${escapeHtml(title)}</div>
        <div class="${PILL[status]} text-[9px] font-bold px-1.5 py-0.5 rounded inline-block mb-1">${escapeHtml(badge)}</div>
        ${lines.map((l) => `<div class="text-[10px] text-slate-300">${escapeHtml(l)}</div>`).join('')}
        ${footer}
      </div>
    </div>
  </div>`
}

function zoneSensor(zoneId: string, types: Sensor['type'][]) {
  return sensors.value.filter((s) => s.zoneId === zoneId && types.includes(s.type)).sort((a, b) => b.value - a.value)[0]
}

function cameraPopup(c: Camera) {
  const z = zoneById.value.get(c.zoneId)
  const w = zoneSensor(c.zoneId, ['water_level', 'river_level'])
  return darkPopup(
    c.imageUrl,
    `${c.code} · Titik pantau usulan`,
    c.name,
    c.status,
    statusMeta(c.status).label,
    [`Zona: ${z?.name ?? '-'}`, c.isOnline ? 'Online' : 'Offline', ...(w ? [`${w.name}: ${w.value} cm`] : [])],
    accuracyLine(c.coordAccuracy, c.coordNote),
  )
}

function zonePopup(z: Zone) {
  const r = riskById.value.get(z.id)
  const lvl = zoneLevel(z)
  return darkPopup(
    null,
    `${z.code} · ${ZONE_TYPE_META[z.type].label}`,
    z.name,
    lvl,
    `Risiko dinamis ${r?.dynamic ?? '-'} · ${statusMeta(lvl).label}`,
    [
      `Struktural ${r?.structural ?? '-'} · Historis ${r?.historical ?? '-'} · Real-time ${r?.realtime ?? '-'}`,
      ...(z.outlet ? [`Outlet ${z.outlet}${z.capacity ? ` · kapasitas ${z.capacity} m³/s` : ''} · ${DRAINAGE_STATUS_META[z.drainageStatus].label}`] : []),
      ...(z.backwaterLength ? [`Backwater ±${z.backwaterLength.toLocaleString('id-ID')} m${r?.backwater ? ' — AKTIF' : ''}`] : []),
      ...(z.elevation !== null ? [`Elevasi tanah ±${z.elevation} m dpl (SRTM)`] : []),
    ],
    accuracyLine(z.coordAccuracy, z.coordNote),
  )
}

function sensorPopup(s: Sensor) {
  return darkPopup(
    null,
    `${s.code} · ${SENSOR_TYPE_META[s.type].label}`,
    s.name,
    s.status,
    `${s.value} ${s.unit}${s.channelDepth ? ` / ${s.channelDepth} cm (${Math.round((s.value / s.channelDepth) * 100)}%)` : ''}`,
    [s.location, s.isOnline ? 'Online' : 'Offline'],
    accuracyLine(s.coordAccuracy, s.coordNote),
  )
}

// ---------- Marker ----------
const visibleZones = computed(() =>
  zones.value.filter((z) => (!fZone.value || z.id === fZone.value) && (!fStatus.value || zoneLevel(z) === fStatus.value)),
)

const markers = computed<MapMarker[]>(() => {
  const list: MapMarker[] = []
  if (layers.zone && want('zone')) {
    list.push(
      ...visibleZones.value.map((z) => ({
        id: z.id,
        kind: 'zone' as const,
        lat: z.lat,
        lng: z.lng,
        status: zoneLevel(z),
        label: z.name,
        accuracy: z.coordAccuracy,
        popup: zonePopup(z),
      })),
    )
  }
  if (layers.camera && want('camera')) {
    list.push(
      ...cameras.value.filter(matches).map((c) => ({
        id: c.id,
        kind: 'camera' as const,
        lat: c.lat,
        lng: c.lng,
        status: c.status,
        label: '',
        accuracy: c.coordAccuracy,
        popup: cameraPopup(c),
      })),
    )
  }
  const kinds: Sensor['type'][] = []
  if (layers.water_level) kinds.push('water_level')
  if (showRiver.value) kinds.push('river_level')
  if (layers.rainfall) kinds.push('rainfall')
  if (layers.weather) kinds.push('weather')
  if (layers.tide) kinds.push('tide')
  list.push(
    ...sensors.value
      .filter((s) => kinds.includes(s.type) && want(s.type) && matches(s))
      .map((s) => ({ id: s.id, kind: s.type, lat: s.lat, lng: s.lng, status: s.status, label: '', accuracy: s.coordAccuracy, popup: sensorPopup(s) })),
  )
  return list
})

const areas = computed(() =>
  visibleZones.value.filter((z) => !z.path?.length).map((z) => ({ id: z.id, lat: z.lat, lng: z.lng, status: zoneLevel(z), radius: z.radius })),
)
const lines = computed<MapLine[]>(() => [
  ...(showRiver.value ? [MARENGAN_LINE] : []),
  ...(showRisk.value
    ? visibleZones.value.filter((z) => z.path?.length).map((z) => ({ id: z.id, points: z.path, color: STATUS_HEX[zoneLevel(z)], label: `${z.code} · ${z.name}`, weight: 6 }))
    : []),
])

// ---------- Interaksi ----------
const map = ref<{ zoomIn: () => void; zoomOut: () => void; resetView: () => void; focus: (id: string, zoom?: number) => void } | null>(null)
const activeCamera = ref<string | null>(null)
const panelOpen = ref(false)

function selectCamera(c: Camera) {
  activeCamera.value = c.id
  panelOpen.value = false
  if (!layers.camera) layers.camera = true
  if (fJenis.value !== 'semua' && fJenis.value !== 'camera') fJenis.value = 'semua'
  if (fZone.value && fZone.value !== c.zoneId) fZone.value = ''
  nextTick(() => map.value?.focus(c.id, 17))
}

watch(fZone, (id) => {
  if (id) nextTick(() => map.value?.focus(id, 16))
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
  { key: 'zone', label: 'Zona Risiko (label)', icon: 'fa-draw-polygon' },
  { key: 'camera', label: 'Titik CCTV', icon: 'fa-video' },
  { key: 'water_level', label: 'TMA Saluran', icon: 'fa-water' },
  { key: 'rainfall', label: 'Sensor Curah Hujan', icon: 'fa-cloud-rain' },
  { key: 'tide', label: 'Sensor Pasang', icon: 'fa-wave-square' },
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
          :lines="lines"
        />
        <!-- Overlay gradien risiko (seperti referensi) -->
        <div
          class="absolute inset-0 pointer-events-none z-[400]"
          style="background: radial-gradient(circle at 40% 40%, rgba(239, 68, 68, 0.12) 0%, rgba(249, 115, 22, 0.06) 30%, transparent 70%)"
        ></div>

        <!-- Map Filters -->
        <div class="absolute top-4 left-4 sm:left-6 right-4 sm:right-6 z-[600] flex flex-wrap gap-2">
          <select v-model="fZone" :class="selectClass" aria-label="Filter zona">
            <option value="">Semua Zona</option>
            <option v-for="z in zones" :key="z.id" :value="z.id">{{ z.code }} · {{ z.name }}</option>
          </select>
          <select v-model="fStatus" :class="selectClass" aria-label="Filter status">
            <option value="">Semua Status</option>
            <option v-for="s in STATUS_OPTIONS" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
          <select v-model="fJenis" :class="selectClass" aria-label="Filter jenis titik">
            <option value="semua">Semua Jenis</option>
            <option value="zone">Zona Risiko</option>
            <option value="camera">CCTV</option>
            <option value="water_level">TMA Saluran</option>
            <option value="river_level">TMA Sungai</option>
            <option value="rainfall">Sensor Hujan</option>
            <option value="tide">Sensor Pasang</option>
            <option value="weather">Stasiun Cuaca</option>
          </select>

          <label class="hidden md:flex items-center gap-2 bg-panel border border-borderdark rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition">
            <input v-model="showRisk" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary h-3 w-3" />
            <span class="text-xs text-slate-300">Area Risiko</span>
          </label>
          <label class="hidden md:flex items-center gap-2 bg-panel border border-borderdark rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition">
            <input v-model="showBoundary" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary h-3 w-3" />
            <span class="text-xs text-slate-300">Buffer Zona</span>
          </label>
          <label class="hidden md:flex items-center gap-2 bg-panel border border-borderdark rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-800 transition">
            <input v-model="showRiver" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary h-3 w-3" />
            <span class="text-xs text-slate-300">Sungai Marengan</span>
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
                  <input v-model="showRisk" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary h-3 w-3" /> Area Risiko
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs text-slate-300">
                  <input v-model="showBoundary" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary h-3 w-3" /> Buffer Zona
                </label>
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs text-slate-300">
                  <input v-model="showRiver" type="checkbox" class="rounded bg-slate-700 border-slate-600 text-primary h-3 w-3" /> Sungai Marengan
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
          <div class="text-xs font-bold text-white mb-2 sm:mb-3">Risiko Dinamis Zona</div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-300">
            <div v-for="l in legend" :key="l.label" class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full" :class="l.dot"></span> {{ l.label }}</div>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-700">
            <span class="flex items-center gap-1.5"><span class="w-4 h-1 rounded bg-sky-400"></span> Kali Marengan (OSM)</span>
            <span class="flex items-center gap-1.5"><span class="w-4 h-1.5 rounded bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></span> Koridor zona (jalan OSM)</span>
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
