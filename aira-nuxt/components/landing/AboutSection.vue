<script setup lang="ts">
const facts = [
  { icon: 'fa-location-dot', box: 'bg-blue-50 text-primary', label: 'Lokasi', value: 'Kawasan Perkotaan' },
  { icon: 'fa-check-circle', box: 'bg-green-50 text-green-600', label: 'Status', value: 'Terpantau' },
]
</script>

<template>
  <section id="tentang" class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left Text -->
        <div>
          <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">TENTANG AIRA</div>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
            Sistem Cerdas untuk Pemantauan dan Peringatan Dini Banjir
          </h2>
          <p class="text-slate-600 text-lg mb-8 leading-relaxed">
            AIRA menggabungkan teknologi Computer Vision, IoT, analisis data cuaca, dan sistem informasi geografis untuk mendeteksi, menganalisis
            risiko, dan memberikan peringatan dini banjir secara real-time.
          </p>
          <NuxtLink to="/tentang" class="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition">
            Pelajari Tentang AIRA <i class="fa-solid fa-arrow-right"></i>
          </NuxtLink>
        </div>
        <!-- Right Image -->
        <div class="relative">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
            alt="Flood Monitoring"
            class="rounded-2xl shadow-xl w-full h-96 object-cover image-grayscale"
          />
          <!-- Floating Cards -->
          <div class="absolute top-8 right-2 sm:-right-8 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col gap-4 w-48">
            <div v-for="f in facts" :key="f.label" class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="f.box"><i class="fa-solid" :class="f.icon"></i></div>
              <div>
                <div class="text-[10px] text-slate-500 font-semibold">{{ f.label }}</div>
                <div class="text-xs font-bold text-slate-800">{{ f.value }}</div>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><i class="fa-solid fa-chart-line"></i></div>
              <div>
                <div class="text-[10px] text-slate-500 font-semibold">Tinggi Air</div>
                <div class="text-xs font-bold text-slate-800">+12 cm <span class="text-[9px] font-normal text-slate-400">(30 menit terakhir)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
