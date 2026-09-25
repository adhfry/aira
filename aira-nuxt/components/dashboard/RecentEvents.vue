<script setup lang="ts">
import type { Incident } from '~/types'

const props = defineProps<{ incidents: Incident[]; loading?: boolean }>()

const events = computed(() => [...props.incidents].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 6))
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[420px]">
    <DashboardPanelHeader title="Kejadian Terbaru" link-to="/dashboard/incidents" />

    <div v-if="loading" class="space-y-4">
      <div v-for="n in 5" :key="n" class="flex gap-3">
        <UiSkeleton class="w-8 h-8 rounded-full" />
        <div class="flex-1 space-y-1.5">
          <UiSkeleton class="h-3 w-3/4" />
          <UiSkeleton class="h-2.5 w-full" />
        </div>
      </div>
    </div>
    <div v-else-if="!events.length" class="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
      <i class="fa-solid fa-inbox text-2xl"></i>
      <p class="text-xs">Belum ada kejadian tercatat.</p>
    </div>
    <div v-else class="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
      <div v-for="(e, i) in events" :key="e.id" class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" :class="incidentMeta(e.type).box">
          <i class="fa-solid text-xs" :class="incidentMeta(e.type).icon"></i>
        </div>
        <div class="flex-1 min-w-0" :class="{ 'border-b border-slate-100 pb-3': i < events.length - 1 }">
          <div class="flex justify-between items-start gap-2 mb-1">
            <div class="text-xs font-bold text-slate-800">{{ e.title }}</div>
            <div class="text-[9px] text-slate-400 flex-shrink-0">{{ formatTime(e.timestamp) }}</div>
          </div>
          <div class="text-[10px] text-slate-500">{{ e.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
