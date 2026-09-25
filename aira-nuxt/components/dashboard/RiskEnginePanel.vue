<script setup lang="ts">
import type { DashboardStats } from '~/types'

const props = defineProps<{ stats?: DashboardStats | null; loading?: boolean }>()

const top = computed(() => props.stats?.zoneRisks[0])
const weights = computed(() => props.stats?.weights ?? { structural: 0.35, historical: 0.25, realtime: 0.4 })

const layers = computed(() => [
  {
    key: 'structural',
    title: 'Layer 1 · Struktural',
    icon: 'fa-diagram-project',
    box: 'bg-blue-100 text-primary',
    bar: 'bg-primary',
    weight: weights.value.structural,
    value: top.value?.structural,
    items: 'Kapasitas drainase, outlet, DAS, backwater, titik kritis BRIDA–ITS',
  },
  {
    key: 'historical',
    title: 'Layer 2 · Historis',
    icon: 'fa-clock-rotate-left',
    box: 'bg-purple-100 text-purple-600',
    bar: 'bg-purple-500',
    weight: weights.value.historical,
    value: top.value?.historical,
    items: 'Frekuensi, durasi, kedalaman kejadian, laporan (estimasi awal)',
  },
  {
    key: 'realtime',
    title: 'Layer 3 · Real-time',
    icon: 'fa-tower-broadcast',
    box: 'bg-orange-100 text-orange-500',
    bar: 'bg-orange-500',
    weight: weights.value.realtime,
    value: top.value?.realtime,
    items: 'CCTV, TMA saluran & sungai, curah hujan, pasang',
  },
])
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
    <DashboardPanelHeader title="AIRA Risk Engine" subtitle="Struktural + Historis + Real-time → Risiko Banjir Dinamis" />

    <div v-if="loading" class="space-y-3">
      <UiSkeleton v-for="n in 3" :key="n" class="h-16" />
    </div>
    <template v-else>
      <div class="space-y-3">
        <div v-for="l in layers" :key="l.key" class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="l.box"><i class="fa-solid" :class="l.icon"></i></div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center gap-2">
              <span class="text-xs font-bold text-slate-800">{{ l.title }}</span>
              <span class="text-[10px] font-bold text-slate-500">bobot {{ Math.round(l.weight * 100) }}%</span>
            </div>
            <div class="text-[9px] text-slate-500 mb-1.5">{{ l.items }}</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-slate-200 rounded-full h-1.5"><div class="h-1.5 rounded-full" :class="l.bar" :style="{ width: `${l.value ?? 0}%` }"></div></div>
              <span class="text-[10px] font-bold text-slate-700 w-6 text-right tabular-nums">{{ l.value ?? '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="top" class="mt-4 rounded-xl p-3 flex items-center gap-3 border" :class="statusMeta(top.level).soft">
        <i class="fa-solid fa-equals text-xs opacity-60"></i>
        <div class="flex-1 min-w-0">
          <div class="text-[9px] font-semibold opacity-80">Risiko dinamis tertinggi · {{ top.code }}</div>
          <div class="text-sm font-extrabold truncate">{{ top.name }}</div>
        </div>
        <div class="text-2xl font-extrabold tabular-nums">{{ top.dynamic }}</div>
      </div>
      <p class="text-[9px] text-slate-400 mt-3 leading-relaxed">
        Contoh nilai layer di atas untuk zona risiko tertinggi. Bobot &amp; ambang adalah parameter prototipe dan perlu dikalibrasi dengan data
        kejadian BPBD/PU SDA.
      </p>
    </template>
  </div>
</template>
