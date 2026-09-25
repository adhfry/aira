<script setup lang="ts">
import type { District, Status, ZoneRisk } from '~/types'

const props = defineProps<{ zoneRisks: ZoneRisk[]; districts: District[]; loading?: boolean }>()

const mode = ref<'zona' | 'kecamatan'>('zona')

interface Row {
  id: string
  label: string
  sub: string
  level: Status
  pct: number
  backwater: boolean
  to: { path: string; query: Record<string, string> }
}

const rows = computed<Row[]>(() => {
  if (mode.value === 'zona') {
    return [...props.zoneRisks]
      .sort((a, b) => b.dynamic - a.dynamic)
      .map((z) => ({
        id: z.zoneId,
        label: z.name,
        sub: `${z.code} · S${z.structural} H${z.historical} R${z.realtime}`,
        level: z.level,
        pct: z.dynamic,
        backwater: z.backwater,
        to: { path: '/dashboard/zones', query: { q: z.code } },
      }))
  }
  return [...props.districts]
    .sort((a, b) => b.riskPercentage - a.riskPercentage)
    .map((d) => ({
      id: d.id,
      label: `Kec. ${d.name}`,
      sub: 'Estimasi regional (simulasi)',
      level: d.riskLevel,
      pct: d.riskPercentage,
      backwater: false,
      to: { path: '/dashboard/districts', query: { q: d.name } },
    }))
})
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[420px]">
    <DashboardPanelHeader :title="mode === 'zona' ? 'Risiko Dinamis per Zona' : 'Level Risiko per Kecamatan'">
      <select
        v-model="mode"
        aria-label="Tampilkan risiko per"
        class="bg-slate-50 border border-slate-200 text-[10px] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="zona">Per Zona Kritis</option>
        <option value="kecamatan">Per Kecamatan</option>
      </select>
    </DashboardPanelHeader>

    <div v-if="loading" class="space-y-4">
      <UiSkeleton v-for="n in 6" :key="n" class="h-7" />
    </div>
    <div v-else-if="!rows.length" class="flex-1 flex items-center justify-center text-xs text-slate-400">Belum ada data.</div>
    <div v-else class="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
      <NuxtLink v-for="r in rows" :key="r.id" :to="r.to" class="flex items-center gap-3 rounded-lg -mx-1 px-1 py-0.5 hover:bg-slate-50 transition">
        <div class="w-5 h-5 rounded-full flex items-center justify-center text-[8px] flex-shrink-0" :class="statusMeta(r.level).soft">
          <i class="fa-solid" :class="r.backwater ? 'fa-arrow-rotate-left' : 'fa-chevron-right'"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="grid grid-cols-[1fr_auto_2.5rem] gap-2 text-[10px] font-semibold">
            <span class="text-slate-700 truncate">{{ r.label }}</span>
            <span :class="statusMeta(r.level).text">{{ statusMeta(r.level).label }}</span>
            <span class="text-slate-800 font-bold text-right">{{ r.pct }}%</span>
          </div>
          <div class="text-[8px] text-slate-400 mb-1 truncate">{{ r.sub }}<span v-if="r.backwater" class="text-sky-600 font-bold"> · backwater</span></div>
          <div class="w-full bg-slate-100 rounded-full h-1.5">
            <div class="h-1.5 rounded-full transition-all duration-500" :class="statusMeta(r.level).bar" :style="{ width: `${r.pct}%` }"></div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
