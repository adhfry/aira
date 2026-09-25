<script setup lang="ts">
import type { DashboardStats } from '~/types'

const props = defineProps<{ backwater?: DashboardStats['backwater']; tide: number | null; loading?: boolean }>()

const readings = computed(() => props.backwater?.readings ?? [])
const maxLevel = computed(() => Math.max(props.backwater?.riverLevel ?? 0, ...readings.value.map((r) => r.drainLevel), 1))
const pctOf = (v: number) => `${Math.round((v / maxLevel.value) * 100)}%`
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
    <DashboardPanelHeader title="Deteksi Backwater Sungai Marengan" subtitle="Pasangan sensor di mulut outlet 4–7 (Resmani dkk., 2017): Δ = TMA sisi Kali Marengan − TMA sisi saluran" link-to="/dashboard/zones" />

    <div v-if="loading" class="space-y-3">
      <UiSkeleton v-for="n in 4" :key="n" class="h-12" />
    </div>
    <div v-else-if="!backwater?.riverLevel" class="py-8 text-center text-xs text-slate-400">
      <i class="fa-solid fa-bridge-water text-2xl mb-2 block"></i>
      Sensor muka air Sungai Marengan belum tersedia / offline.
    </div>
    <template v-else>
      <!-- Referensi sungai & pasang -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-sky-50 border border-sky-100 rounded-xl p-3 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-bridge-water"></i></div>
          <div class="min-w-0">
            <div class="text-[10px] text-slate-500 font-semibold truncate">{{ backwater.riverSensor }}</div>
            <div class="text-lg font-extrabold text-slate-900">{{ backwater.riverLevel }} cm</div>
          </div>
        </div>
        <div class="bg-teal-50 border border-teal-100 rounded-xl p-3 flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-wave-square"></i></div>
          <div class="min-w-0">
            <div class="text-[10px] text-slate-500 font-semibold truncate">Pasang muara Kali Marengan</div>
            <div class="text-lg font-extrabold text-slate-900">{{ tide ?? '-' }}<span v-if="tide !== null"> cm</span></div>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="r in readings" :key="r.zoneId + r.name" class="rounded-xl border p-3" :class="r.delta >= 0 ? 'border-red-100 bg-red-50/40' : 'border-slate-100 bg-slate-50/60'">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="min-w-0">
              <div class="text-xs font-bold text-slate-800 truncate">{{ r.name }}</div>
              <div class="text-[9px] text-slate-500">
                Pengaruh backwater (kajian 2017): <b>±{{ r.backwaterLength?.toLocaleString('id-ID') ?? '-' }} m</b>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-sm font-extrabold tabular-nums" :class="r.delta >= 0 ? 'text-red-600' : 'text-green-600'">Δ {{ r.delta > 0 ? '+' : '' }}{{ r.delta }} cm</div>
              <UiStatusPill :status="r.level" :label="r.delta >= 0 ? 'Backwater' : statusMeta(r.level).label" />
            </div>
          </div>
          <!-- Bar perbandingan -->
          <div class="space-y-1 text-[9px] text-slate-500">
            <div class="flex items-center gap-2">
              <span class="w-12">Sungai</span>
              <div class="flex-1 bg-slate-100 rounded-full h-1.5"><div class="h-1.5 rounded-full bg-sky-500" :style="{ width: pctOf(r.riverLevel) }"></div></div>
              <span class="w-10 text-right tabular-nums">{{ r.riverLevel }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-12">Saluran</span>
              <div class="flex-1 bg-slate-100 rounded-full h-1.5"><div class="h-1.5 rounded-full bg-cyan-500" :style="{ width: pctOf(r.drainLevel) }"></div></div>
              <span class="w-10 text-right tabular-nums">{{ r.drainLevel }}</span>
            </div>
          </div>
        </div>
      </div>
      <p class="text-[9px] text-slate-400 mt-3 leading-relaxed">
        <i class="fa-solid fa-circle-info mr-1"></i>Kedua sensor di tiap mulut outlet memakai peilschaal bersama (nol = dasar pintu outlet), sehingga Δ positif
        berarti muka air sungai lebih tinggi dan aliran saluran tertahan (backwater).
      </p>
    </template>
  </div>
</template>
