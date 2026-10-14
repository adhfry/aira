<script setup lang="ts">
import type { Camera } from '~/types'
import { useDashboardStore } from '~/stores/dashboard'

const props = defineProps<{ cameras: Camera[]; loading?: boolean }>()

const clock = useDashboardStore()
const modal = useCameraModal()

// Kamera online diurutkan dari status paling kritis
const ranked = computed(() =>
  props.cameras.filter((c) => c.isOnline).sort((a, b) => STATUS_ORDER[b.status] - STATUS_ORDER[a.status]),
)
const selectedId = ref<string | null>(null)
const main = computed(() => ranked.value.find((c) => c.id === selectedId.value) ?? ranked.value[0])
const thumbs = computed(() => ranked.value.filter((c) => c.id !== main.value?.id).slice(0, 3))

// Rekaman menampilkan waktu perekamannya sendiri; kamera tanpa rekaman menampilkan jam dashboard.
const stamp = computed(() => {
  if (main.value?.recordedAt) return `Rekaman ${recordedLabel(main.value.recordedAt)}`
  const d = clock.now
  if (!d) return ''
  return `${d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} ${clock.timeLabel.replace(' WIB', '')}`
})
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[500px]">
    <DashboardPanelHeader title="CCTV Titik Pantau" link-to="/dashboard/cameras">
      <template #badge>
        <span class="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {{ ranked.length }} Kamera Online
        </span>
      </template>
    </DashboardPanelHeader>

    <template v-if="loading">
      <UiSkeleton class="flex-1 mb-3 rounded-xl" />
      <div class="space-y-2">
        <UiSkeleton v-for="n in 3" :key="n" class="h-20 rounded-lg" />
      </div>
    </template>

    <div v-else-if="!main" class="flex-1 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
      <i class="fa-solid fa-video-slash text-2xl"></i>
      <p class="text-xs">Tidak ada kamera online.</p>
    </div>

    <template v-else>
      <!-- Main Feed -->
      <div class="relative rounded-xl overflow-hidden flex-1 mb-3 bg-slate-200 min-h-0">
        <button type="button" class="block w-full h-full cursor-zoom-in" :aria-label="`Buka rekaman CCTV ${main.name}`" @click="modal.open(main)">
          <DashboardCameraMedia :camera="main" play :alt="`CCTV ${main.name}`" class="w-full h-full object-cover" />
        </button>
        <div v-if="!main.videoUrl" class="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">
          {{ main.code }} · {{ main.name }}<br /><span class="text-[8px] font-normal opacity-80 tabular-nums">{{ stamp }}</span>
        </div>
        <!-- Pojok kiri bawah dipakai jam OSD rekaman; status di kanan bawah. -->
        <div class="absolute bottom-3 right-3">
          <UiStatusPill :status="main.status" variant="solid" />
        </div>
        <!-- Dokumentasi titik yang sama (mis. foto banjir di ruas ini), dibuka di tab baru -->
        <div v-if="main.gallery?.length" class="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
          <a
            v-for="g in main.gallery"
            :key="g.url"
            v-tippy="g.caption"
            :href="g.url"
            target="_blank"
            rel="noopener"
            class="block w-14 h-10 rounded overflow-hidden border-2 border-white/80 shadow"
            :aria-label="g.caption"
          >
            <img :src="g.url" alt="" class="w-full h-full object-cover" loading="lazy" />
          </a>
        </div>
      </div>

      <!-- Thumbnails -->
      <div class="space-y-2 flex-shrink-0">
        <button
          v-for="c in thumbs"
          :key="c.id"
          type="button"
          class="relative block w-full rounded-lg overflow-hidden h-20 bg-slate-200 cursor-pointer border border-transparent hover:border-primary transition"
          :aria-label="`Buka rekaman CCTV ${c.name}`"
          @click="selectedId = c.id; modal.open(c)"
        >
          <img :src="c.imageUrl" class="w-full h-full object-cover" :alt="c.name" />
          <div class="absolute top-1 left-1 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">{{ c.code }} · {{ c.name }}</div>
          <div class="absolute bottom-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded" :class="statusMeta(c.status).solid">
            {{ statusMeta(c.status).label }}
          </div>
        </button>
      </div>
    </template>
  </div>
</template>
