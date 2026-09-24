<script setup lang="ts">
import type { District } from '~/types'

const props = defineProps<{ districts: District[]; loading?: boolean }>()

const sort = ref<'risk' | 'name'>('risk')
const rows = computed(() =>
  [...props.districts].sort((a, b) => (sort.value === 'risk' ? b.riskPercentage - a.riskPercentage : a.name.localeCompare(b.name, 'id'))),
)
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[400px]">
    <DashboardPanelHeader title="Level Risiko per Kecamatan">
      <select
        v-model="sort"
        aria-label="Urutkan kecamatan"
        class="bg-slate-50 border border-slate-200 text-[10px] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="risk">Urut: Risiko Tertinggi</option>
        <option value="name">Urut: Nama A-Z</option>
      </select>
    </DashboardPanelHeader>

    <div v-if="loading" class="space-y-4">
      <UiSkeleton v-for="n in 6" :key="n" class="h-6" />
    </div>
    <div v-else-if="!rows.length" class="flex-1 flex items-center justify-center text-xs text-slate-400">Belum ada data kecamatan.</div>
    <div v-else class="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
      <NuxtLink
        v-for="d in rows"
        :key="d.id"
        :to="{ path: '/dashboard/districts', query: { q: d.name } }"
        class="flex items-center gap-3 rounded-lg -mx-1 px-1 py-0.5 hover:bg-slate-50 transition"
      >
        <div
          class="w-5 h-5 rounded-full flex items-center justify-center text-[8px] flex-shrink-0"
          :class="[statusMeta(d.riskLevel).soft]"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </div>
        <div class="flex-1">
          <div class="grid grid-cols-[1fr_auto_2.5rem] gap-2 text-[10px] font-semibold mb-1">
            <span class="text-slate-700 truncate">Kec. {{ d.name }}</span>
            <span :class="statusMeta(d.riskLevel).text">{{ statusMeta(d.riskLevel).risk }}</span>
            <span class="text-slate-800 font-bold text-right">{{ d.riskPercentage }}%</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5">
            <div class="h-1.5 rounded-full transition-all duration-500" :class="statusMeta(d.riskLevel).bar" :style="{ width: `${d.riskPercentage}%` }"></div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
