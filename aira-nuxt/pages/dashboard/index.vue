<script setup lang="ts">
import type { Sensor } from '~/types'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Dashboard AIRA - Artificial Intelligence Response Banjir', description: 'Dashboard pemantauan banjir real-time AIRA.', robots: 'noindex' })

const { data: stats, status: statsStatus, error: statsError } = useStats()
const { items: cameras, pending: camerasPending } = useCameras()
const { items: sensors, pending: sensorsPending } = useSensors()
const { items: districts, pending: districtsPending } = useDistricts()
const { items: incidents, pending: incidentsPending } = useIncidents()

const statsLoading = computed(() => statsStatus.value === 'pending' && !stats.value)

// Muat ulang data secara berkala (simulasi real-time)
const DATA_KEYS = ['stats', 'crud-cameras', 'crud-sensors', 'crud-districts', 'crud-incidents']
const reload = () => refreshNuxtData(DATA_KEYS)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => (timer = setInterval(reload, 60_000)))
onBeforeUnmount(() => clearInterval(timer))

function top(type: Sensor['type']) {
  return computed(() =>
    sensors.value.filter((s) => s.type === type && s.isOnline).sort((a, b) => b.value - a.value)[0],
  )
}
const waterSensor = top('water_level')
const rainSensor = top('rainfall')
const weatherSensor = computed(
  () => sensors.value.find((s) => s.type === 'weather' && s.isOnline && s.district === 'Kota Surnenep') ?? sensors.value.find((s) => s.type === 'weather'),
)

function deltaText(n: number) {
  return `${Math.abs(n)} dari kemarin`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Error state -->
    <div v-if="statsError" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3 text-sm">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span class="flex-1">Gagal memuat statistik dashboard.</span>
      <UiButton variant="secondary" icon="fa-rotate-right" @click="reload">Coba Lagi</UiButton>
    </div>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      <DashboardMetricCard icon="fa-triangle-exclamation" icon-box="bg-red-50 text-red-500" label="Lokasi Risiko Tinggi" :value="stats?.risk.high ?? 0" :loading="statsLoading">
        <span :class="(stats?.riskDelta.high ?? 0) > 0 ? 'text-red-500' : 'text-green-500'" class="flex items-center gap-1">
          <i class="fa-solid" :class="(stats?.riskDelta.high ?? 0) > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i> {{ deltaText(stats?.riskDelta.high ?? 0) }}
        </span>
      </DashboardMetricCard>
      <DashboardMetricCard icon="fa-circle-exclamation" icon-box="bg-orange-50 text-orange-500" label="Lokasi Risiko Sedang" :value="stats?.risk.medium ?? 0" :loading="statsLoading">
        <span :class="(stats?.riskDelta.medium ?? 0) > 0 ? 'text-red-500' : 'text-green-500'" class="flex items-center gap-1">
          <i class="fa-solid" :class="(stats?.riskDelta.medium ?? 0) > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i> {{ deltaText(stats?.riskDelta.medium ?? 0) }}
        </span>
      </DashboardMetricCard>
      <DashboardMetricCard icon="fa-shield-halved" icon-box="bg-green-50 text-green-500" label="Lokasi Normal" :value="stats?.risk.normal ?? 0" :loading="statsLoading">
        <span :class="(stats?.riskDelta.normal ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'" class="flex items-center gap-1">
          <i class="fa-solid" :class="(stats?.riskDelta.normal ?? 0) >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i> {{ deltaText(stats?.riskDelta.normal ?? 0) }}
        </span>
      </DashboardMetricCard>
      <DashboardMetricCard icon="fa-video" icon-box="bg-blue-50 text-primary" label="Total CCTV Aktif" :value="stats?.cameras.total ?? 0" :loading="statsLoading">
        <span class="text-slate-500 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Menyala {{ stats?.cameras.online }} / {{ stats?.cameras.total }}
        </span>
      </DashboardMetricCard>
      <DashboardMetricCard icon="fa-wifi" icon-box="bg-blue-50 text-primary" label="Sensor IoT Online" :value="stats?.sensors.total ?? 0" :loading="statsLoading">
        <span class="text-slate-500 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online {{ stats?.sensors.online }} / {{ stats?.sensors.total }}
        </span>
      </DashboardMetricCard>
    </div>

    <!-- Map & CCTV Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DashboardMapPanel
        :cameras="cameras"
        :sensors="sensors"
        :districts="districts"
        :loading="camerasPending && !cameras.length"
        @refresh="reload"
      />
      <DashboardCCTVPanel :cameras="cameras" :loading="camerasPending && !cameras.length" />
    </div>

    <!-- Data Sensor Real-time Section -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <DashboardPanelHeader
        title="Data Sensor Real-time"
        :subtitle="`Terakhir diperbarui: ${stats ? formatDateTime(stats.lastUpdate) : '-'}`"
        link-to="/dashboard/sensors"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" :class="{ 'animate-pulse': sensorsPending && !sensors.length }">
        <DashboardSensorChart :sensor="waterSensor" title="Tinggi Muka Air" icon="fa-water" icon-box="bg-blue-100 text-primary" color="#ef4444" />
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

    <!-- Bottom Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <DashboardRiskTable :districts="districts" :loading="districtsPending && !districts.length" />
      <DashboardPredictionChart :predictions="stats?.predictions ?? []" :loading="statsLoading" />
      <DashboardRecentEvents :incidents="incidents" :loading="incidentsPending && !incidents.length" />
    </div>
  </div>
</template>
