<script setup lang="ts">
import type { Camera, Status } from '~/types'
import { useDashboardStore } from '~/stores/dashboard'

/** Panel kanan halaman Peta: daftar feed kamera CCTV dengan pencarian & filter status. */
const props = defineProps<{ cameras: Camera[]; loading?: boolean; activeId?: string | null }>()
const emit = defineEmits<{ select: [camera: Camera]; close: [] }>()

const clock = useDashboardStore()
const search = ref('')
const status = ref<Status | 'semua'>('semua')
const onlineOnly = ref(false)
const sortBy = ref<'status' | 'name'>('status')

const counts = computed(() => {
  const c: Record<string, number> = { semua: props.cameras.length }
  for (const s of STATUS_LIST) c[s] = props.cameras.filter((x) => x.status === s).length
  return c
})

const filters: { value: Status | 'semua'; label: string; text: string }[] = [
  { value: 'semua', label: 'Semua', text: 'text-slate-300' },
  { value: 'normal', label: 'Normal', text: 'text-slate-300' },
  { value: 'waspada', label: 'Waspada', text: 'text-yellow-400' },
  { value: 'siaga', label: 'Siaga', text: 'text-orange-400' },
  { value: 'bahaya', label: 'Bahaya', text: 'text-red-500' },
]

const visible = computed(() => {
  const q = search.value.trim().toLowerCase()
  return props.cameras
    .filter((c) => status.value === 'semua' || c.status === status.value)
    .filter((c) => !onlineOnly.value || c.isOnline)
    .filter((c) => !q || `${c.name} ${c.district} ${c.location}`.toLowerCase().includes(q))
    .sort((a, b) => (sortBy.value === 'status' ? STATUS_ORDER[b.status] - STATUS_ORDER[a.status] : a.name.localeCompare(b.name, 'id')))
})

const onlineCount = computed(() => props.cameras.filter((c) => c.isOnline).length)
</script>

<template>
  <aside class="w-full sm:w-[420px] bg-panel flex flex-col h-full border-l border-borderdark flex-shrink-0">
    <!-- Header -->
    <div class="h-20 flex items-center justify-between px-6 border-b border-borderdark flex-shrink-0">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-bold text-white">Kamera CCTV</h2>
        <div class="flex items-center gap-1.5 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/30 whitespace-nowrap">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {{ onlineCount }} Kamera Aktif
        </div>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/dashboard/cameras" class="text-xs text-primary font-semibold hover:underline flex items-center gap-1 whitespace-nowrap">
          Lihat Semua <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </NuxtLink>
        <button class="xl:hidden text-slate-400 hover:text-white" aria-label="Tutup panel kamera" @click="emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="p-4 border-b border-borderdark flex-shrink-0">
      <div class="flex gap-2 mb-4">
        <div class="relative flex-1">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Cari kamera..."
            aria-label="Cari kamera"
            class="w-full bg-slate-800/50 border border-slate-700 text-slate-300 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition placeholder-slate-500"
          />
        </div>
        <button
          class="border w-10 h-10 rounded-lg flex items-center justify-center transition"
          :class="onlineOnly ? 'bg-primary border-primary text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'"
          :title="onlineOnly ? 'Menampilkan kamera online saja' : 'Tampilkan kamera online saja'"
          :aria-pressed="onlineOnly"
          @click="onlineOnly = !onlineOnly"
        >
          <i class="fa-solid fa-filter text-sm"></i>
        </button>
        <button
          class="bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white w-10 h-10 rounded-lg flex items-center justify-center transition"
          :title="sortBy === 'status' ? 'Urut: status kritis' : 'Urut: nama A-Z'"
          @click="sortBy = sortBy === 'status' ? 'name' : 'status'"
        >
          <i class="fa-solid text-sm" :class="sortBy === 'status' ? 'fa-sliders' : 'fa-arrow-down-a-z'"></i>
        </button>
      </div>

      <!-- Status Filters -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="f in filters"
          :key="f.value"
          class="text-[10px] font-bold px-3 py-1.5 rounded-lg border transition"
          :class="status === f.value ? 'bg-blue-600 text-white border-blue-500' : ['bg-slate-800/50 border-slate-700 hover:bg-slate-700', f.text]"
          @click="status = f.value"
        >
          {{ f.label }} ({{ counts[f.value] ?? 0 }})
        </button>
      </div>
    </div>

    <!-- Feeds Grid -->
    <div class="flex-1 overflow-y-auto no-scrollbar p-4">
      <div v-if="loading" class="grid grid-cols-2 gap-3">
        <UiSkeleton v-for="n in 6" :key="n" class="h-44 rounded-xl !bg-slate-800" />
      </div>
      <div v-else-if="!visible.length" class="h-full flex flex-col items-center justify-center text-slate-500 gap-2 py-12">
        <i class="fa-solid fa-video-slash text-2xl"></i>
        <p class="text-xs">Tidak ada kamera yang cocok.</p>
      </div>
      <div v-else class="grid grid-cols-2 gap-3">
        <button
          v-for="c in visible"
          :key="c.id"
          type="button"
          class="text-left bg-slate-800 rounded-xl overflow-hidden border group cursor-pointer hover:border-primary transition"
          :class="activeId === c.id ? 'border-primary ring-1 ring-primary' : 'border-slate-700'"
          @click="emit('select', c)"
        >
          <div class="relative h-28 overflow-hidden">
            <img
              :src="c.imageUrl"
              class="w-full h-full object-cover image-grayscale group-hover:scale-105 transition duration-500"
              :class="{ 'opacity-40': !c.isOnline }"
              :alt="c.name"
              loading="lazy"
            />
            <div class="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded" :class="statusMeta(c.status).solid">
              {{ statusMeta(c.status).label }}
            </div>
            <div class="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] p-1 rounded group-hover:bg-black"><i class="fa-solid fa-expand"></i></div>
            <div v-if="!c.isOnline" class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-300">
              <i class="fa-solid fa-video-slash mr-1"></i> Offline
            </div>
          </div>
          <div class="p-2.5">
            <div class="flex items-start gap-2 mb-1">
              <span class="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" :class="c.isOnline ? 'bg-green-500' : 'bg-slate-500'"></span>
              <div class="text-[10px] font-bold text-white leading-tight">{{ c.name }}</div>
            </div>
            <div class="flex justify-between items-center text-[9px] text-slate-400 gap-2">
              <span class="truncate">Kec. {{ c.district }}</span>
              <span class="tabular-nums">{{ c.isOnline ? clock.timeLabel.replace(' WIB', '') : formatTime(c.lastUpdate) }}</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </aside>
</template>
