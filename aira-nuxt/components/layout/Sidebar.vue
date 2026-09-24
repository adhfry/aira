<script setup lang="ts">
import type { User } from '~/types'
import { useSidebarStore } from '~/stores/sidebar'

interface MenuChild {
  label: string
  to: string
  icon: string
}
interface MenuGroup {
  key: string
  label: string
  icon: string
  children: MenuChild[]
}

const props = withDefaults(defineProps<{ dark?: boolean }>(), { dark: false })

const route = useRoute()
const sidebar = useSidebarStore()

const mainMenu = [
  { label: 'Dashboard', icon: 'fa-house', to: '/dashboard' },
  { label: 'Peta & Monitoring', icon: 'fa-map-location-dot', to: '/peta' },
  { label: 'CCTV', icon: 'fa-video', to: '/dashboard/cameras' },
  { label: 'Sensor IoT', icon: 'fa-wifi', to: '/dashboard/sensors' },
  { label: 'Analisis Risiko', icon: 'fa-chart-line', to: '/dashboard/districts' },
  { label: 'Prediksi & Cuaca', icon: 'fa-cloud-sun', to: '/dashboard/sensors?type=weather' },
  { label: 'Peringatan Dini', icon: 'fa-bell', to: '/dashboard/notifications?type=peringatan' },
  { label: 'Laporan Kejadian', icon: 'fa-file-invoice', to: '/dashboard/incidents' },
]

const groups: MenuGroup[] = [
  {
    key: 'data',
    label: 'Manajemen Data',
    icon: 'fa-database',
    children: [
      { label: 'Data Kecamatan', to: '/dashboard/districts', icon: 'fa-map' },
      { label: 'Data Kejadian', to: '/dashboard/incidents', icon: 'fa-file-lines' },
    ],
  },
  {
    key: 'perangkat',
    label: 'Manajemen Perangkat',
    icon: 'fa-mobile-screen',
    children: [
      { label: 'Kamera CCTV', to: '/dashboard/cameras', icon: 'fa-video' },
      { label: 'Sensor IoT', to: '/dashboard/sensors', icon: 'fa-wifi' },
    ],
  },
  {
    key: 'petugas',
    label: 'Manajemen Petugas',
    icon: 'fa-users',
    children: [{ label: 'Daftar Petugas', to: '/dashboard/users', icon: 'fa-user-shield' }],
  },
  {
    key: 'notifikasi',
    label: 'Notifikasi',
    icon: 'fa-bell',
    children: [{ label: 'Kelola Notifikasi', to: '/dashboard/notifications', icon: 'fa-paper-plane' }],
  },
  {
    key: 'pengaturan',
    label: 'Pengaturan',
    icon: 'fa-gear',
    children: [{ label: 'Reset Data Demo', to: '#reset', icon: 'fa-rotate-left' }],
  },
]

/** Menu aktif ditentukan oleh path + query yang paling spesifik. */
function isActive(to: string) {
  const [path, query] = to.split('?')
  if (path !== route.path) return false
  if (!query) return Object.keys(route.query).length === 0 || !mainMenu.some((m) => m.to.startsWith(`${path}?`) && matchesQuery(m.to))
  return matchesQuery(to)
}

function matchesQuery(to: string) {
  const query = new URLSearchParams(to.split('?')[1] ?? '')
  return [...query.entries()].every(([k, v]) => route.query[k] === v)
}

// Buka otomatis grup yang berisi halaman aktif
watch(
  () => route.fullPath,
  () => {
    sidebar.toggleMobile(false)
    for (const g of groups) if (g.children.some((c) => isActive(c.to))) sidebar.expand(g.key)
  },
  { immediate: true },
)

const { items: users } = useUsers()
const profile = computed<User | undefined>(() => users.value.find((u) => u.role === 'Administrator') ?? users.value[0])

const toast = useToast()
const resetOpen = ref(false)
const resetting = ref(false)

async function resetData() {
  resetting.value = true
  try {
    await $fetch('/api/reset', { method: 'POST' })
    await refreshNuxtData()
    toast.success('Data demo berhasil dikembalikan ke kondisi awal.')
    resetOpen.value = false
  } catch {
    toast.error('Gagal mereset data demo.')
  } finally {
    resetting.value = false
  }
}

const border = computed(() => (props.dark ? 'border-borderdark' : 'border-slate-800'))
const cardBorder = computed(() => (props.dark ? 'border-borderdark' : 'border-slate-700'))
</script>

<template>
  <div class="contents">
    <!-- Backdrop mobile -->
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
      <div v-if="sidebar.mobileOpen" class="fixed inset-0 bg-slate-900/60 z-30 lg:hidden" @click="sidebar.toggleMobile(false)"></div>
    </Transition>

    <aside
      class="w-64 text-slate-300 flex flex-col h-full border-r flex-shrink-0 z-40 fixed inset-y-0 left-0 lg:static transition-transform duration-200 lg:translate-x-0"
      :class="[dark ? 'bg-panel' : 'bg-sidebar', border, sidebar.mobileOpen ? 'translate-x-0' : '-translate-x-full']"
    >
      <!-- Logo -->
      <div class="h-20 flex items-center justify-between px-6 border-b flex-shrink-0" :class="border">
        <NuxtLink to="/" aria-label="Kembali ke beranda AIRA">
          <LayoutBrandLogo variant="sidebar" />
        </NuxtLink>
        <button class="lg:hidden text-slate-400 hover:text-white" aria-label="Tutup menu" @click="sidebar.toggleMobile(false)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-1">
        <NuxtLink
          v-for="item in mainMenu"
          :key="item.label"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition"
          :class="isActive(item.to) ? 'bg-primary text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'"
        >
          <i class="fa-solid w-5 text-center" :class="item.icon"></i>
          {{ item.label }}
        </NuxtLink>

        <div class="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Manajemen</div>

        <div v-for="g in groups" :key="g.key">
          <button
            type="button"
            class="w-full flex items-center justify-between px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg text-sm font-medium transition"
            :aria-expanded="sidebar.expanded.includes(g.key)"
            @click="sidebar.toggleGroup(g.key)"
          >
            <div class="flex items-center gap-3">
              <i class="fa-solid w-5 text-center" :class="g.icon"></i>
              {{ g.label }}
            </div>
            <i class="fa-solid fa-chevron-down text-[10px] transition-transform" :class="{ 'rotate-180': sidebar.expanded.includes(g.key) }"></i>
          </button>
          <div v-show="sidebar.expanded.includes(g.key)" class="mt-1 ml-5 pl-3 border-l space-y-1" :class="cardBorder">
            <template v-for="c in g.children" :key="c.label">
              <button
                v-if="c.to === '#reset'"
                type="button"
                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition text-slate-400 hover:bg-slate-800 hover:text-white font-medium"
                @click="resetOpen = true"
              >
                <i class="fa-solid w-4 text-center text-[11px]" :class="c.icon"></i>
                {{ c.label }}
              </button>
              <NuxtLink
                v-else
                :to="c.to"
                class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition"
                :class="isActive(c.to) ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'"
              >
                <i class="fa-solid w-4 text-center text-[11px]" :class="c.icon"></i>
                {{ c.label }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>

      <!-- Bottom Profile -->
      <div class="p-4 border-t space-y-3 flex-shrink-0" :class="border">
        <div class="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border" :class="cardBorder">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=100&auto=format&fit=crop"
            alt="Kab. Surnenep"
            class="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <div class="text-xs font-bold text-white">Kab. Surnenep</div>
            <div class="text-[10px] text-slate-400">Sistem Pemantauan Banjir</div>
          </div>
        </div>
        <NuxtLink
          to="/dashboard/users"
          class="flex items-center justify-between gap-3 bg-slate-800/50 p-3 rounded-xl border cursor-pointer hover:bg-slate-800 transition"
          :class="cardBorder"
        >
          <div class="flex items-center gap-3 min-w-0">
            <img
              :src="profile?.avatarUrl ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'"
              :alt="profile?.name ?? 'Administrator'"
              class="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div class="min-w-0">
              <div class="text-xs font-bold text-white truncate">{{ profile?.name ?? 'Ahda Barori' }}</div>
              <div class="text-[10px] text-slate-400">{{ profile?.role ?? 'Administrator' }}</div>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-slate-500 text-xs"></i>
        </NuxtLink>
      </div>
    </aside>

    <UiConfirmDialog
      :open="resetOpen"
      title="Reset Data Demo"
      message="Semua perubahan data (CCTV, sensor, kejadian, kecamatan, petugas, notifikasi) akan dikembalikan ke data awal. Lanjutkan?"
      confirm-label="Ya, Reset"
      :loading="resetting"
      @close="resetOpen = false"
      @confirm="resetData"
    />
  </div>
</template>
