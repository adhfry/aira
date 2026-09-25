<script setup lang="ts">
import type { LatLngExpression, LayerGroup, Map as LeafletMap, Marker, TileLayer } from 'leaflet'
import { SUMENEP_CITY_CENTER, SUMENEP_CITY_ZOOM, type MapArea, type MapLine, type MapMarker, type TileMode } from '~/types/map'
import { STATUS_HEX, statusMeta } from '~/utils/status'
import { escapeHtml } from '~/utils/html'

/**
 * Peta Leaflet AIRA. Pin dibuat sebagai divIcon agar tampil persis seperti mockup referensi.
 * - variant "dashboard": pin kecil tanpa label (dashboard-aira.html)
 * - variant "peta": pin 24px + label nama (peta-monitor-aira.html)
 * Zona berkoridor digambar sebagai garis jalan OSM (props.lines), zona titik sebagai lingkaran (props.areas).
 */
const props = withDefaults(
  defineProps<{
    markers: MapMarker[]
    areas?: MapArea[]
    lines?: MapLine[]
    variant?: 'dashboard' | 'peta'
    tile?: TileMode
    showRiskAreas?: boolean
    showBoundaries?: boolean
    showRoads?: boolean
    zoom?: number
  }>(),
  {
    areas: () => [],
    lines: () => [],
    variant: 'dashboard',
    tile: 'satelit',
    showRiskAreas: true,
    showBoundaries: false,
    showRoads: false,
    zoom: SUMENEP_CITY_ZOOM,
  },
)

const emit = defineEmits<{ select: [id: string] }>()

const el = ref<HTMLDivElement | null>(null)
let L: typeof import('leaflet') | null = null
let map: LeafletMap | null = null
let baseLayers: TileLayer[] = []
let roadsLayer: TileLayer | null = null
let markerLayer: LayerGroup | null = null
let areaLayer: LayerGroup | null = null
let boundaryLayer: LayerGroup | null = null
let lineLayer: LayerGroup | null = null
const markerIndex = new Map<string, Marker>()
let resizeObserver: ResizeObserver | null = null

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services'
const TILES: Record<TileMode, { url: string; attribution: string }[]> = {
  satelit: [{ url: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, attribution: 'Tiles &copy; Esri' }],
  hybrid: [
    { url: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, attribution: 'Tiles &copy; Esri' },
    { url: `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`, attribution: '' },
  ],
  peta: [
    {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    },
  ],
}

const STATUS_BG: Record<string, string> = {
  normal: 'bg-green-500',
  waspada: 'bg-yellow-500',
  siaga: 'bg-orange-500',
  bahaya: 'bg-red-500',
}

const KIND_STYLE: Record<string, { bg: string; icon: string }> = {
  camera: { bg: 'bg-blue-500', icon: 'fa-video' },
  water_level: { bg: 'bg-cyan-500', icon: 'fa-water' },
  rainfall: { bg: 'bg-purple-500', icon: 'fa-cloud-rain' },
  weather: { bg: 'bg-amber-500', icon: 'fa-temperature-half' },
  river_level: { bg: 'bg-sky-500', icon: 'fa-bridge-water' },
  tide: { bg: 'bg-teal-500', icon: 'fa-wave-square' },
}

const isArea = (m: MapMarker) => m.kind === 'district' || m.kind === 'zone'

function iconHtml(m: MapMarker): { html: string; size: [number, number]; anchor: [number, number] } {
  const label = escapeHtml(m.label)
  const unverified = ''
  if (props.variant === 'peta') {
    const style = isArea(m) ? { bg: STATUS_BG[m.status], icon: statusMeta(m.status).icon } : KIND_STYLE[m.kind]!
    const alert = m.kind === 'camera' && (m.status === 'bahaya' || m.status === 'siaga')
    const labelHtml = label ? `<div class="map-pin-label">${label}</div>` : ''
    const small = !isArea(m)
    return {
      html: `<div class="map-pin"><div class="map-pin-icon ${unverified} ${small ? 'map-pin-sm' : ''} ${alert ? STATUS_BG[m.status] : style!.bg}"><i class="fa-solid ${style!.icon}"></i></div>${labelHtml}</div>`,
      size: label ? [120, 44] : small ? [18, 18] : [24, 24],
      anchor: label ? [60, 12] : small ? [9, 9] : [12, 12],
    }
  }
  if (isArea(m)) {
    const danger = m.status === 'bahaya' || m.status === 'siaga'
    const size = danger ? 'w-6 h-6 text-[10px] shadow-lg animate-pulse' : 'w-5 h-5 text-[8px] shadow-md'
    return {
      html: `<div title="${label}" class="${unverified} ${size} ${STATUS_BG[m.status]} rounded-full border-2 border-white flex items-center justify-center text-white"><i class="fa-solid ${statusMeta(m.status).icon}"></i></div>`,
      size: danger ? [24, 24] : [20, 20],
      anchor: danger ? [12, 12] : [10, 10],
    }
  }
  const s = KIND_STYLE[m.kind]!
  const shape = m.kind === 'camera' ? 'rounded' : 'rounded-full'
  return {
    html: `<div title="${label}" class="${unverified} w-4 h-4 ${s.bg} ${shape} border-2 border-white shadow flex items-center justify-center text-[8px] text-white"><i class="fa-solid ${s.icon}"></i></div>`,
    size: [16, 16],
    anchor: [8, 8],
  }
}

function renderBase() {
  if (!L || !map) return
  baseLayers.forEach((l) => l.remove())
  baseLayers = TILES[props.tile].map((t) => L!.tileLayer(t.url, { attribution: t.attribution, maxZoom: 18, subdomains: 'abcd' }).addTo(map!))
}

function renderRoads() {
  if (!L || !map) return
  roadsLayer?.remove()
  roadsLayer = null
  if (props.showRoads) {
    roadsLayer = L.tileLayer(`${ESRI}/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 18, opacity: 0.9 }).addTo(map)
  }
}

function renderMarkers() {
  if (!L || !map || !markerLayer) return
  markerLayer.clearLayers()
  markerIndex.clear()
  for (const m of props.markers) {
    const { html, size, anchor } = iconHtml(m)
    const marker = L.marker([m.lat, m.lng], {
      icon: L.divIcon({ html, className: '', iconSize: size, iconAnchor: anchor, popupAnchor: [0, -anchor[1]] }),
      riseOnHover: true,
      // Pin kecamatan (berlabel) di atas; pin kamera/sensor di bawahnya
      zIndexOffset: isArea(m) ? 1000 : 0,
    })
    if (m.popup) marker.bindPopup(m.popup, { className: 'aira-popup', closeButton: false, maxWidth: 280, minWidth: 200 })
    marker.on('click', () => emit('select', m.id))
    marker.addTo(markerLayer)
    markerIndex.set(m.id, marker)
  }
}

function renderLines() {
  if (!L || !map || !lineLayer) return
  lineLayer.clearLayers()
  for (const line of props.lines) {
    L.polyline(line.points as LatLngExpression[][], { color: line.color, weight: line.weight ?? 4, opacity: 0.9, dashArray: line.dashed ? '8 6' : undefined, lineCap: 'round', lineJoin: 'round' })
      .bindTooltip(escapeHtml(line.label), { sticky: true })
      .addTo(lineLayer)
  }
}

function renderAreas() {
  if (!L || !map || !areaLayer || !boundaryLayer) return
  areaLayer.clearLayers()
  boundaryLayer.clearLayers()
  for (const a of props.areas) {
    const radius = a.radius ?? 2200 + (a.status === 'bahaya' ? 1400 : a.status === 'siaga' ? 900 : 400)
    if (props.showRiskAreas) {
      L.circle([a.lat, a.lng], {
        radius,
        color: STATUS_HEX[a.status],
        weight: a.dashed ? 1.5 : 0,
        dashArray: a.dashed ? '5 5' : undefined,
        fillOpacity: a.status === 'normal' ? 0.14 : 0.26,
        interactive: false,
      }).addTo(areaLayer)
    }
    if (props.showBoundaries) {
      L.circle([a.lat, a.lng], { radius: radius * 1.6, color: '#94a3b8', weight: 1, dashArray: '4 4', fill: false, interactive: false }).addTo(boundaryLayer)
    }
  }
}

onMounted(async () => {
  L = await import('leaflet')
  if (!el.value) return
  map = L.map(el.value, { zoomControl: false, attributionControl: true, center: SUMENEP_CITY_CENTER, zoom: props.zoom })
  map.attributionControl.setPrefix(false)
  if (props.variant === 'dashboard') L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map)
  boundaryLayer = L.layerGroup().addTo(map)
  areaLayer = L.layerGroup().addTo(map)
  lineLayer = L.layerGroup().addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  renderBase()
  renderRoads()
  renderAreas()
  renderLines()
  renderMarkers()
  // Kontainer bisa berubah ukuran (sidebar/panel) → sesuaikan peta
  resizeObserver = new ResizeObserver(() => map?.invalidateSize())
  resizeObserver.observe(el.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  map?.remove()
  map = null
})

watch(() => props.tile, renderBase)
watch(() => props.showRoads, renderRoads)
watch(() => [props.areas, props.showRiskAreas, props.showBoundaries], renderAreas, { deep: true })
watch(() => props.markers, renderMarkers, { deep: true })
watch(() => props.lines, renderLines, { deep: true })

defineExpose({
  zoomIn: () => map?.zoomIn(),
  zoomOut: () => map?.zoomOut(),
  resetView: () => map?.flyTo(SUMENEP_CITY_CENTER, props.zoom, { duration: 0.8 }),
  flyTo: (lat: number, lng: number, zoom = 16) => map?.flyTo([lat, lng], zoom, { duration: 0.8 }),
  focus(id: string, zoom = 16) {
    const marker = markerIndex.get(id)
    if (!marker || !map) return
    map.flyTo(marker.getLatLng(), zoom, { duration: 0.8 })
    map.once('moveend', () => marker.openPopup())
  },
})
</script>

<template>
  <div ref="el" class="w-full h-full isolate z-0"></div>
</template>
