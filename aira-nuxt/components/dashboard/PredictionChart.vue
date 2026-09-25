<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { Line } from 'vue-chartjs'
import type { DashboardStats } from '~/types'

const props = defineProps<{ predictions: DashboardStats['predictions']; loading?: boolean }>()

const COLORS = ['#ef4444', '#f97316', '#3b82f6']
const DOTS = ['bg-red-500', 'bg-orange-500', 'bg-blue-500']
const LABELS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']

const selected = ref('')
// Default: 3 zona dengan risiko dinamis tertinggi; bila dipilih, tampilkan zona tersebut saja
const series = computed(() => {
  if (selected.value) return props.predictions.filter((p) => p.zone === selected.value)
  return props.predictions.slice(0, 3)
})

const data = computed<ChartData<'line'>>(() => ({
  labels: LABELS,
  datasets: series.value.map((s, i) => ({
    label: s.zone,
    data: s.values,
    borderColor: COLORS[i],
    backgroundColor: `${COLORS[i]}1a`,
    borderWidth: 1.5,
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 4,
  })),
}))

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#ffffff',
      titleColor: '#1e293b',
      bodyColor: '#475569',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      titleFont: { size: 10, weight: 'bold' },
      bodyFont: { size: 9 },
      padding: 8,
      boxWidth: 6,
      boxHeight: 6,
      usePointStyle: true,
      callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` },
    },
  },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 8 }, color: '#94a3b8' } },
    y: {
      min: 0,
      max: 100,
      ticks: { stepSize: 25, font: { size: 8 }, color: '#94a3b8', callback: (v) => `${v}%` },
      grid: { color: '#f1f5f9' },
      border: { display: false },
    },
  },
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[420px]">
    <div class="flex justify-between items-center gap-2 mb-4">
      <div class="flex items-center gap-2 min-w-0">
        <h3 class="font-bold text-slate-800 text-sm">Prediksi Risiko 24 Jam ke Depan</h3>
        <i
          class="fa-solid fa-circle-info text-slate-400 text-xs cursor-help"
          title="Prediksi dari risiko dinamis zona (AIRA Risk Engine) dengan pola puncak hujan sore hari — simulasi prototipe."
        ></i>
      </div>
      <select
        v-model="selected"
        aria-label="Pilih zona prediksi"
        class="bg-slate-50 border border-slate-200 text-[10px] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary max-w-[120px]"
      >
        <option value="">Pilih Zona</option>
        <option v-for="p in predictions" :key="p.zone" :value="p.zone">{{ p.zone }}</option>
      </select>
    </div>

    <div class="flex-1 relative min-h-0">
      <UiSkeleton v-if="loading" class="absolute inset-0" />
      <ClientOnly v-else>
        <Line :data="data" :options="options" />
        <template #fallback><UiSkeleton class="absolute inset-0" /></template>
      </ClientOnly>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap justify-center gap-4 text-[9px] font-semibold text-slate-600 mt-2">
      <span v-for="(s, i) in series" :key="s.zone" class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full" :class="DOTS[i]"></span> {{ s.zone }}
      </span>
    </div>
  </div>
</template>
