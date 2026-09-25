<script setup lang="ts">
import type { DashboardStats } from '~/types'

/**
 * Alarm banjir: muncul bila ada zona berstatus BAHAYA atau backwater terdeteksi.
 * Foto indikator: air sungai meluap (dokumentasi Sumenep).
 * Dapat ditutup; muncul lagi bila daftar zona bahaya berubah.
 */
const props = defineProps<{ stats?: DashboardStats | null }>()

const danger = computed(() => (props.stats?.zoneRisks ?? []).filter((z) => z.level === 'bahaya'))
const backwater = computed(() => (props.stats?.backwater.readings ?? []).filter((r) => r.delta >= 0))
const signature = computed(() => [...danger.value.map((z) => z.code), ...backwater.value.map((b) => b.code)].join('|'))
const active = computed(() => danger.value.length > 0 || backwater.value.some((b) => b.level === 'bahaya'))

const dismissed = useState<string>('aira-alarm-dismissed', () => '')
const visible = computed(() => active.value && dismissed.value !== signature.value)
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <section
      v-if="visible"
      role="alert"
      aria-live="assertive"
      class="relative overflow-hidden rounded-xl border border-red-300 bg-red-600 text-white shadow-lg shadow-red-500/30"
    >
      <!-- Foto indikator (air sungai meluap) -->
      <img src="/images/sumenep/sungai-meluap.jpg" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div class="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600/90 to-red-600/40"></div>

      <div class="relative flex flex-col lg:flex-row gap-4 p-4 sm:p-5">
        <div class="flex items-start gap-4 flex-1 min-w-0">
          <div class="relative flex-shrink-0">
            <span class="absolute inset-0 rounded-full bg-white/40 animate-ping"></span>
            <div class="relative w-12 h-12 rounded-full bg-white text-red-600 flex items-center justify-center text-xl">
              <i class="fa-solid fa-bell"></i>
            </div>
          </div>
          <div class="min-w-0">
            <div class="text-[10px] font-bold tracking-wider uppercase text-red-100">Alarm Peringatan Dini Banjir</div>
            <h2 class="text-lg font-extrabold leading-tight">
              {{ danger.length }} zona BAHAYA<span v-if="backwater.length"> · backwater di {{ backwater.length }} mulut outlet</span>
            </h2>
            <p class="text-xs text-red-50 mt-1">
              Indikator: air meluap dari saluran/sungai. Hujan maks. {{ stats?.rainfall.max ?? '-' }} mm/jam · TMA hilir Kali Marengan
              {{ stats?.backwater.riverLevel ?? '-' }} cm · pasang {{ stats?.tide ?? '-' }} cm.
            </p>
            <div class="flex flex-wrap gap-1.5 mt-2">
              <NuxtLink
                v-for="z in danger"
                :key="z.zoneId"
                :to="{ path: '/dashboard/zones', query: { q: z.code } }"
                class="text-[10px] font-bold bg-white/15 hover:bg-white/25 border border-white/30 rounded-full px-2.5 py-1 transition"
              >
                {{ z.code }} · {{ z.name }} ({{ z.dynamic }})
              </NuxtLink>
              <span
                v-for="b in backwater"
                :key="b.code + b.name"
                class="text-[10px] font-bold bg-sky-500/40 border border-sky-200/40 rounded-full px-2.5 py-1"
              >
                <i class="fa-solid fa-arrow-rotate-left"></i> {{ b.name }} Δ +{{ b.delta }} cm
              </span>
            </div>
          </div>
        </div>
        <div class="flex lg:flex-col gap-2 flex-shrink-0 lg:justify-center">
          <NuxtLink to="/peta" class="inline-flex items-center justify-center gap-2 bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-bold transition">
            <i class="fa-solid fa-map-location-dot"></i> Lihat Peta
          </NuxtLink>
          <NuxtLink
            to="/dashboard/notifications"
            class="inline-flex items-center justify-center gap-2 bg-red-800/60 hover:bg-red-800 border border-white/30 px-4 py-2 rounded-lg text-xs font-bold transition"
          >
            <i class="fa-solid fa-paper-plane"></i> Kirim Peringatan
          </NuxtLink>
          <button
            class="inline-flex items-center justify-center gap-2 text-red-100 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
            @click="dismissed = signature"
          >
            <i class="fa-solid fa-xmark"></i> Tutup
          </button>
        </div>
      </div>
    </section>
  </Transition>
</template>
