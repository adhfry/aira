<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { Bar, Line } from 'vue-chartjs'
import type { Sensor } from '~/types'

const props = withDefaults(
  defineProps<{
    sensor?: Sensor
    title: string
    icon: string
    iconBox: string
    color: string
    chart?: 'line' | 'bar'
    subtitle?: string
  }>(),
  { sensor: undefined, chart: 'line', subtitle: undefined },
)

const history = computed(() => props.sensor?.history ?? [])
const delta = computed(() => {
  const h = history.value
  if (h.length < 2) return 0
  return Math.round((h[h.length - 1]!.value - h[h.length - 2]!.value) * 10) / 10
})

const deltaLabel = computed(() => {
  if (!props.sensor) return ''
  const sign = delta.value > 0 ? '+' : ''
  return `${sign}${delta.value} ${props.sensor.unit === 'mm/jam' ? 'mm' : props.sensor.unit} (1 jam)`
})

const labels = computed(() => history.value.map((p) => formatTime(p.time)))
const values = computed(() => history.value.map((p) => p.value))

const lineData = computed<ChartData<'line'>>(() => ({
  labels: labels.value,
  datasets: [
    {
      data: values.value,
      borderColor: props.color,
      backgroundColor: `${props.color}1a`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 3,
    },
  ],
}))

const barData = computed<ChartData<'bar'>>(() => {
  const max = Math.max(...values.value, 1)
  return {
    labels: labels.value,
    datasets: [
      {
        data: values.value,
        // gradasi biru seperti mockup referensi (bg-blue-200 … bg-blue-600)
        backgroundColor: values.value.map((v) => {
          const r = v / max
          return r > 0.85 ? '#2563eb' : r > 0.65 ? '#3b82f6' : r > 0.45 ? '#60a5fa' : r > 0.25 ? '#93c5fd' : '#bfdbfe'
        }),
        borderRadius: { topLeft: 4, topRight: 4 },
        borderSkipped: 'bottom',
        categoryPercentage: 0.9,
        barPercentage: 0.9,
      },
    ],
  }
})

const sparkOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 400 },
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: { label: (ctx: { parsed: { y: number | null } }) => `${ctx.parsed.y} ${props.sensor?.unit ?? ''}` },
    },
  },
  scales: { x: { display: false }, y: { display: false, beginAtZero: props.chart === 'bar' } },
}))
</script>

<template>
  <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
    <div class="flex items-start gap-3 mb-4">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="iconBox">
        <i class="fa-solid" :class="icon"></i>
      </div>
      <div class="min-w-0">
        <div class="text-[10px] text-slate-500 font-semibold">{{ title }}</div>
        <template v-if="sensor">
          <div class="text-xl font-extrabold text-slate-900">{{ sensor.value }}{{ sensor.unit === '°C' ? '' : ' ' }}{{ sensor.unit }}</div>
          <div v-if="subtitle" class="text-[10px] text-slate-500 font-medium mt-0.5">{{ subtitle }}</div>
          <div
            v-else
            class="text-[10px] font-medium flex items-center gap-1 mt-0.5"
            :class="delta > 0 ? 'text-red-500' : delta < 0 ? 'text-green-500' : 'text-slate-500'"
          >
            <i class="fa-solid" :class="delta > 0 ? 'fa-arrow-up' : delta < 0 ? 'fa-arrow-down' : 'fa-minus'"></i> {{ deltaLabel }}
          </div>
          <div class="text-[9px] text-slate-400 truncate">
            {{ sensor.name }}<span v-if="sensor.channelDepth"> · isi {{ Math.round((sensor.value / sensor.channelDepth) * 100) }}% dari {{ sensor.channelDepth }} cm</span>
          </div>
        </template>
        <template v-else>
          <UiSkeleton class="h-6 w-24 my-1" />
          <UiSkeleton class="h-3 w-16" />
        </template>
      </div>
    </div>
    <div class="h-12 w-full relative">
      <ClientOnly>
        <Bar v-if="chart === 'bar'" :data="barData" :options="(sparkOptions as ChartOptions<'bar'>)" />
        <Line v-else :data="lineData" :options="(sparkOptions as ChartOptions<'line'>)" />
        <template #fallback><UiSkeleton class="h-full w-full" /></template>
      </ClientOnly>
    </div>
  </div>
</template>
