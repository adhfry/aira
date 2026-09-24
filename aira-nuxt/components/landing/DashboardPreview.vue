<script setup lang="ts">
const { data: stats } = useStats()
const { items: districts } = useDistricts()

// Angka diambil dari API bila tersedia (fallback = angka referensi)
const cards = computed(() => [
  { icon: 'fa-video', value: stats.value?.cameras.total ?? 42, label: 'Titik CCTV' },
  { icon: 'fa-wifi', value: stats.value?.sensors.total ?? 28, label: 'Sensor Air' },
  { icon: 'fa-cloud-sun', value: 12, label: 'Stasiun Cuaca' },
  {
    icon: 'fa-location-dot',
    value: districts.value.length ? districts.value.filter((d) => d.riskLevel === 'bahaya' || d.riskLevel === 'siaga').length : 5,
    label: 'Wilayah Prioritas',
  },
])

const sideIcons = [
  { icon: 'fa-video', to: '/dashboard/cameras' },
  { icon: 'fa-wifi', to: '/dashboard/sensors' },
  { icon: 'fa-cloud-sun', to: '/dashboard/sensors?type=weather' },
  { icon: 'fa-file-alt', to: '/dashboard/incidents' },
]
</script>

<template>
  <section class="py-24 bg-darkbg text-white relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left Content -->
        <div>
          <div class="inline-block bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider border border-blue-500/30">
            PETA &amp; DASHBOARD
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold leading-tight mb-6">Pantau Kondisi Wilayah Secara Menyeluruh</h2>
          <p class="text-slate-400 text-lg mb-10 leading-relaxed">
            Dashboard interaktif menampilkan peta sebaran titik pemantauan, kondisi real-time, tingkat risiko, dan informasi penting lainnya
            dalam satu tampilan.
          </p>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div v-for="c in cards" :key="c.label" class="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <i class="fa-solid text-blue-400 text-xl mb-2" :class="c.icon"></i>
              <div class="text-2xl font-bold">{{ c.value }}</div>
              <div class="text-[10px] text-slate-400">{{ c.label }}</div>
            </div>
          </div>

          <NuxtLink to="/dashboard" class="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition">
            Lihat Dashboard <i class="fa-solid fa-arrow-right"></i>
          </NuxtLink>
        </div>

        <!-- Right Dashboard Mockup -->
        <div class="bg-slate-900 rounded-2xl border border-slate-700 p-2 shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-water text-blue-500"></i>
              <span class="font-bold text-sm">AIRA Monitoring Dashboard</span>
            </div>
            <div class="flex gap-2">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
          </div>
          <!-- Content -->
          <div class="flex h-80">
            <!-- Sidebar -->
            <div class="w-16 border-r border-slate-700 hidden sm:flex flex-col items-center py-4 gap-6 text-slate-500">
              <NuxtLink to="/peta" aria-label="Peta"><i class="fa-solid fa-map text-blue-500 text-lg cursor-pointer"></i></NuxtLink>
              <NuxtLink v-for="s in sideIcons" :key="s.icon" :to="s.to" :aria-label="s.icon">
                <i class="fa-solid hover:text-white text-lg cursor-pointer transition" :class="s.icon"></i>
              </NuxtLink>
              <i class="fa-solid fa-cog hover:text-white text-lg cursor-pointer transition mt-auto"></i>
            </div>
            <!-- Map Area -->
            <div class="flex-1 relative bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop"
                alt="Map"
                class="w-full h-full object-cover opacity-50 image-grayscale"
              />
              <!-- Map Pins -->
              <div class="absolute top-1/3 left-1/4 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
              <div class="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
              <div class="absolute bottom-1/4 right-1/3 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>

              <!-- Tooltip -->
              <div class="absolute top-1/3 left-1/4 mt-4 -ml-16 bg-white text-slate-800 p-2 rounded shadow-lg text-[10px] w-32 z-10">
                <div class="font-bold mb-1">Kali Surnenep</div>
                <div class="text-slate-500">Tinggi Air: 285 cm</div>
                <div class="text-red-500 font-bold">Status: Siaga</div>
              </div>

              <!-- Bottom Legend -->
              <div class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded text-[10px] flex gap-3 text-slate-300">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span> Normal</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-500"></span> Waspada</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-500"></span> Siaga</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span> Awas</span>
              </div>
            </div>
            <!-- Right Panel -->
            <div class="w-48 border-l border-slate-700 p-3 bg-slate-900 hidden sm:flex flex-col gap-3">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Informasi Lokasi</div>
              <div class="bg-slate-800 rounded-lg p-2 border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=400&auto=format&fit=crop"
                  class="w-full h-16 object-cover rounded mb-2 image-grayscale"
                  alt="Location"
                />
                <div class="text-xs font-bold text-white mb-1">Kali Surnenep</div>
                <div class="text-[9px] text-slate-400 mb-2">Kecamatan Rota Surnenep</div>
                <div class="flex items-center gap-1 text-[9px] text-red-400 bg-red-400/10 px-2 py-1 rounded w-max mb-2">
                  <i class="fa-solid fa-triangle-exclamation"></i> Risiko Tinggi
                </div>
                <div class="text-xs font-bold text-white">285 cm</div>
                <div class="text-[9px] text-slate-400">Tinggi Muka Air</div>
                <div class="text-[9px] text-red-400 mt-1"><i class="fa-solid fa-arrow-up"></i> +45 cm</div>
                <NuxtLink
                  to="/peta"
                  class="block text-center w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold py-1.5 rounded transition"
                >
                  Lihat Detail
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
