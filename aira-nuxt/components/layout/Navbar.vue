<script setup lang="ts">
const props = withDefaults(defineProps<{ dark?: boolean }>(), { dark: false })

const route = useRoute()
const mobileOpen = ref(false)

const links = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang', to: '/tentang' },
  { label: 'Fitur', to: '/fitur' },
  { label: 'Teknologi', to: '/teknologi' },
  { label: 'Manfaat', to: '/manfaat' },
  { label: 'Kontak', to: '#kontak' },
]

watch(() => route.fullPath, () => (mobileOpen.value = false))

function isActive(to: string) {
  return to === route.path
}

// Kelas link identik dengan referensi: beranda aktif tanpa garis bawah,
// halaman lain aktif dengan border-b-2, varian gelap (teknologi) memakai teks putih.
function linkClass(to: string) {
  if (props.dark) {
    return isActive(to) ? 'text-white border-b-2 border-primary pb-1' : 'hover:text-white transition'
  }
  if (!isActive(to)) return 'hover:text-primary transition'
  return to === '/' ? 'text-primary hover:text-primary transition' : 'text-primary border-b-2 border-primary pb-1'
}
</script>

<template>
  <nav
    class="fixed w-full z-50 border-b"
    :class="dark ? 'bg-darkbg border-slate-800' : 'bg-white/90 backdrop-blur-md border-slate-200'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <NuxtLink to="/" aria-label="AIRA Beranda">
          <LayoutBrandLogo :dark="dark" />
        </NuxtLink>
        <!-- Nav Links -->
        <div class="hidden md:flex space-x-8 text-sm font-semibold" :class="dark ? 'text-slate-300' : 'text-slate-600'">
          <NuxtLink v-for="l in links" :key="l.label" :to="l.to" :class="linkClass(l.to)">{{ l.label }}</NuxtLink>
        </div>
        <!-- CTA -->
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/dashboard"
            class="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition shadow-md shadow-blue-500/30 flex items-center gap-2"
          >
            <span class="hidden sm:inline">Akses Dashboard</span><span class="sm:hidden">Dashboard</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </NuxtLink>
          <button
            class="md:hidden w-10 h-10 rounded-lg flex items-center justify-center transition"
            :class="dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'"
            :aria-expanded="mobileOpen"
            aria-label="Buka menu"
            @click="mobileOpen = !mobileOpen"
          >
            <i class="fa-solid" :class="mobileOpen ? 'fa-xmark' : 'fa-bars'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden border-t px-4 py-3 space-y-1 text-sm font-semibold"
        :class="dark ? 'bg-darkbg border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'"
      >
        <NuxtLink
          v-for="l in links"
          :key="l.label"
          :to="l.to"
          class="block px-3 py-2.5 rounded-lg transition"
          :class="
            isActive(l.to)
              ? dark
                ? 'bg-slate-800 text-white'
                : 'bg-blue-50 text-primary'
              : dark
                ? 'hover:bg-slate-800 hover:text-white'
                : 'hover:bg-slate-50 hover:text-primary'
          "
        >
          {{ l.label }}
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>
