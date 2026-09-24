<script setup lang="ts">
import { useSidebarStore } from '~/stores/sidebar'
import { useDashboardStore } from '~/stores/dashboard'

const props = withDefaults(defineProps<{ dark?: boolean }>(), { dark: false })

const sidebar = useSidebarStore()
const clock = useDashboardStore()
const { data: stats } = useStats()

onMounted(() => clock.startClock())
onBeforeUnmount(() => clock.stopClock())

const search = ref('')
const input = ref<HTMLInputElement | null>(null)

function submitSearch() {
  const q = search.value.trim()
  if (!q) return
  navigateTo({ path: '/dashboard/cameras', query: { q } })
}

function onShortcut(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    input.value?.focus()
  }
}
onMounted(() => window.addEventListener('keydown', onShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', onShortcut))

const placeholder = computed(() =>
  props.dark ? 'Cari lokasi, kecamatan, sungai, atau kamera...' : 'Cari lokasi, kamera, sensor, atau kejadian...',
)
</script>

<template>
  <header
    class="h-20 border-b flex items-center justify-between gap-4 px-4 sm:px-6 flex-shrink-0"
    :class="dark ? 'bg-panel border-borderdark z-20' : 'bg-white border-slate-200 z-10'"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <!-- Hamburger (mobile) -->
      <button
        class="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition"
        :class="dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'"
        aria-label="Buka menu"
        @click="sidebar.toggleMobile(true)"
      >
        <i class="fa-solid fa-bars"></i>
      </button>

      <!-- Search -->
      <form class="relative w-full md:w-96 hidden sm:block" role="search" @submit.prevent="submitSearch">
        <i
          class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-sm"
          :class="dark ? 'text-slate-500' : 'text-slate-400'"
        ></i>
        <input
          ref="input"
          v-model="search"
          type="text"
          :placeholder="placeholder"
          aria-label="Pencarian"
          class="w-full text-sm rounded-lg pl-9 pr-16 py-2.5 focus:outline-none transition"
          :class="
            dark
              ? 'bg-slate-800/50 border border-slate-700 text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-500'
              : 'bg-slate-100 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary'
          "
        />
        <div
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded"
          :class="dark ? 'bg-slate-700 text-slate-300' : 'bg-white border border-slate-200 text-slate-500'"
        >
          Ctrl + K
        </div>
      </form>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-4 sm:gap-6 flex-shrink-0">
      <!-- Icons -->
      <div v-if="!dark" class="flex items-center gap-4 text-slate-500">
        <NuxtLink to="/dashboard/incidents?status=aktif" class="relative cursor-pointer hover:text-primary transition" aria-label="Kejadian aktif">
          <i class="fa-solid fa-bell text-lg"></i>
          <span
            v-if="stats?.activeIncidents"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
          >
            {{ stats.activeIncidents > 9 ? '9+' : stats.activeIncidents }}
          </span>
        </NuxtLink>
        <NuxtLink to="/dashboard/notifications" class="cursor-pointer hover:text-primary transition hidden sm:block" aria-label="Notifikasi">
          <i class="fa-solid fa-message text-lg"></i>
        </NuxtLink>
      </div>

      <!-- Date & Time -->
      <div
        class="text-right hidden md:block"
        :class="dark ? 'border-r border-borderdark pr-6' : 'border-l border-slate-200 pl-6'"
      >
        <div class="text-xs" :class="dark ? 'text-slate-400' : 'text-slate-500'">{{ clock.dateLabel }}</div>
        <div class="text-sm font-bold tabular-nums" :class="dark ? 'text-white' : 'text-slate-800'">{{ clock.timeLabel }}</div>
      </div>

      <!-- Weather -->
      <div
        class="flex items-center rounded-xl px-3 sm:px-4 py-2"
        :class="dark ? 'gap-3 bg-slate-800/50 border border-borderdark' : 'gap-2 bg-blue-50 border border-blue-100'"
      >
        <i class="fa-solid fa-cloud-sun text-orange-400 text-xl"></i>
        <div>
          <div class="text-sm font-bold" :class="dark ? 'text-white' : 'text-slate-800'">{{ stats?.weather.temperature ?? 28 }}°C</div>
          <div class="text-[10px]" :class="dark ? 'text-slate-400' : 'text-slate-500'">{{ stats?.weather.condition ?? 'Berawan' }}</div>
        </div>
        <slot name="weather-extra" />
      </div>
    </div>
  </header>
</template>
