<script setup lang="ts">
import type { Sensor } from '~/types'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Dashboard AIRA - Artificial Intelligence Response Banjir', description: 'Dashboard pemantauan banjir Kota Sumenep.', robots: 'noindex' })

const { data: stats, status: statsStatus, error: statsError } = useStats()
const { items: zones, pending: zonesPending } = useZones()
const { items: cameras, pending: camerasPending } = useCameras()
const { items: sensors, pending: sensorsPending } = useSensors()
const { items: districts } = useDistricts()
const { items: incidents, pending: incidentsPending } = useIncidents()

const statsLoading = computed(() => statsStatus.value === 'pending' && !stats.value)

// Muat ulang data secara berkala (simulasi real-time)
const DATA_KEYS = ['stats', 'crud-zones', 'crud-cameras', 'crud-sensors', 'crud-districts', 'crud-incidents']
const reload = () => refreshNuxtData(DATA_KEYS)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => (timer = setInterval(reload, 60_000)))
onBeforeUnmount(() => clearInterval(timer))

function top(type: Sensor['type']) {
  return computed(() => sensors.value.filter((s) => s.type === type && s.isOnline).sort((a, b) => b.value - a.value)[0])
}
// Saluran paling kritis = rasio isi (TMA / kedalaman saluran) tertinggi
const drainSensor = computed(() =>
  sensors.value
    .filter((s) => s.type === 'water_level' && s.isOnline && s.channelDepth)
    .sort((a, b) => b.value / (b.channelDepth ?? 1) - a.value / (a.channelDepth ?? 1))[0],
)
const rainSensor = top('rainfall')
const weatherSensor = computed(
  () => sensors.value.find((s) => s.type === 'weather' && s.isOnline && s.district === 'Kota Sumenep') ?? sensors.value.find((s) => s.type === 'weather'),
)

const backwaterCount = computed(() => stats.value?.backwater.readings.filter((r) => r.delta >= 0).length ?? 0)
</script>

<template>
  <div class="space-y-6">
    <DashboardFloodAlarm :stats="stats" />
    <DashboardDataNotice />

    <!-- Error state -->
    <div v-if="statsError" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3 text-sm">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span class="flex-1">Gagal memuat statistik dashboard.</span>
      <UiButton variant="secondary" icon="fa-rotate-right" @click="reload">Coba Lagi</UiButton>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      <DashboardMetricCard icon="fa-triangle-exclamation" icon-box="bg-red-50 text-red-500" label="Zona Siaga / Bahaya" :value="stats?.zones.high ?? 0" :loading="statsLoading">
        <span class="text-slate-500">dari {{ stats?.zones.total }} zona kritis &amp; outlet</span>
      </DashboardMetricCard>
      <DashboardMetricCard icon="fa-circle-exclamation" icon-box="bg-yellow-50 text-yellow-500" label="Zona Waspada" :value="stats?.zones.medium ?? 0" :loading="statsLoading">
        <span class="text-slate-500">Normal: {{ stats?.zones.normal }} zona</span>
      </DashboardMetricCard>
      <DashboardMetricCard icon="fa-arrow-rotate-left" icon-box="bg-sky-50 text-sky-600" label="Backwater Terdeteksi" :value="backwaterCount" :loading="statsLoading">
        <span class="text-slate-500">Sungai Marengan {{ stats?.backwater.riverLevel ?? '-' }} cm</span>
      </DashboardMetricCard>
      <DashboardMetricCard icon="fa-video" icon-box="bg-blue-50 text-primary" label="CCTV Titik Pantau" :value="stats?.cameras.total ?? 0" :loading="statsLoading">
        <span class="text-slate-500 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Menyala {{ stats?.cameras.online }} / {{ stats?.cameras.total }}
        </span>
      </DashboardMetricCard>
      <DashboardMetricCard icon="fa-wifi" icon-box="bg-blue-50 text-primary" label="Sensor IoT" :value="stats?.sensors.total ?? 0" :loading="statsLoading">
        <span class="text-slate-500 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online {{ stats?.sensors.online }} / {{ stats?.sensors.total }}
        </span>
      </DashboardMetricCard>
    </div>

    <!-- Map & CCTV Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DashboardMapPanel
        :zones="zones"
        :zone-risks="stats?.zoneRisks ?? []"
        :cameras="cameras"
        :sensors="sensors"
        :loading="zonesPending && !zones.length"
        @refresh="reload"
      />
      <DashboardCCTVPanel :cameras="cameras" :loading="camerasPending && !cameras.length" />
    </div>

    <!-- Data Sensor Real-time Section -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <DashboardPanelHeader
        title="Data Sensor Real-time"
        :subtitle="`Terakhir diperbarui: ${stats ? formatDateTime(stats.lastUpdate) : '-'} · skenario simulasi`"
        link-to="/dashboard/sensors"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" :class="{ 'animate-pulse': sensorsPending && !sensors.length }">
        <DashboardSensorChart :sensor="drainSensor" title="TMA Saluran Paling Kritis" icon="fa-water" icon-box="bg-blue-100 text-primary" color="#ef4444" />
        <DashboardSensorChart :sensor="rainSensor" title="Curah Hujan" icon="fa-cloud-rain" icon-box="bg-blue-100 text-primary" color="#3b82f6" chart="bar" />
        <DashboardSensorChart
          :sensor="weatherSensor"
          title="Suhu & Cuaca"
          icon="fa-temperature-half"
          icon-box="bg-orange-100 text-orange-500"
          color="#f97316"
          :subtitle="stats?.weather.condition ?? 'Berawan'"
        />
      </div>
    </div>

    <!-- Backwater & Risk Engine -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="lg:col-span-3">
        <DashboardBackwaterPanel :backwater="stats?.backwater" :tide="stats?.tide ?? null" :loading="statsLoading" />
      </div>
      <div class="lg:col-span-2">
        <DashboardRiskEnginePanel :stats="stats" :loading="statsLoading" />
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DashboardRiskTable :zone-risks="stats?.zoneRisks ?? []" :districts="districts" :loading="statsLoading" />
      <DashboardPredictionChart :predictions="stats?.predictions ?? []" :loading="statsLoading" />
      <DashboardRecentEvents :incidents="incidents" :loading="incidentsPending && !incidents.length" />
    </div>
  </div>
</template>
