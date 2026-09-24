<script setup lang="ts">
const stats = [
  { icon: 'fa-regular fa-clock', title: '24/7', text: 'Pemantauan Real-time' },
  { icon: 'fa-solid fa-layer-group', title: 'Multi-Sumber', text: 'Data Terintegrasi' },
  { icon: 'fa-solid fa-bolt', title: 'Respon Cepat', text: 'Untuk Masyarakat' },
]
const bars = ['bg-slate-200 h-1/4', 'bg-slate-200 h-2/4', 'bg-slate-200 h-1/4', 'bg-slate-200 h-3/4', 'bg-red-400 h-full', 'bg-red-500 h-5/6', 'bg-red-500 h-full']
</script>

<template>
  <section class="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-darkbg">
    <LandingHeroBackground />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div class="text-white">
          <div class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            AIoT • GIS • Early Warning System
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Menjaga Daerah<br />Lebih Siap Terhadap<br /><span class="text-blue-400">Banjir</span>
          </h1>
          <p class="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed">
            AIRA (Artificial Intelligence Response Banjir) adalah sistem pemantauan, analisis risiko, dan peringatan dini banjir berbasis
            Artificial Intelligence, mengintegrasikan CCTV, sensor IoT, data cuaca, dan informasi geografis untuk memberikan informasi yang
            cepat, akurat, dan dapat ditindaklanjuti.
          </p>
          <div class="flex flex-wrap gap-4 mb-12">
            <NuxtLink to="/dashboard" class="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition flex items-center gap-2">
              <i class="fa-solid fa-play"></i> Lihat Demo
            </NuxtLink>
            <a
              href="#tentang"
              class="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold transition flex items-center gap-2 backdrop-blur-sm"
            >
              Pelajari Lebih Lanjut <i class="fa-solid fa-arrow-down"></i>
            </a>
          </div>
          <!-- Stats -->
          <div class="flex flex-wrap gap-6 text-sm text-slate-300">
            <div v-for="s in stats" :key="s.title" class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><i class="text-blue-400" :class="s.icon"></i></div>
              <div><strong class="block text-white">{{ s.title }}</strong> {{ s.text }}</div>
            </div>
          </div>
        </div>

        <!-- Right Dashboard Mockup -->
        <div class="relative">
          <div class="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-lg ml-auto border border-slate-200">
            <!-- CCTV Feed -->
            <div class="relative rounded-xl overflow-hidden mb-4 h-56 bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=800&auto=format&fit=crop"
                alt="CCTV Jembatan Kali"
                class="w-full h-full object-cover image-grayscale"
              />
              <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                <i class="fa-solid fa-video text-red-500"></i> CCTV - Jembatan Kali
              </div>
              <div class="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
              </div>
              <!-- Alert Overlay -->
              <div class="absolute bottom-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                  <div class="text-[10px] opacity-80">Tinggi Resiko Banjir</div>
                  <div>Ketinggian air meningkat</div>
                </div>
              </div>
            </div>
            <!-- Water Level Card -->
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="text-xs text-slate-500 font-semibold mb-1">Tinggi Muka Air</div>
                  <div class="text-2xl font-extrabold text-slate-900">285 cm</div>
                </div>
                <div class="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-1 rounded">Siaga</div>
              </div>
              <div class="text-xs text-red-500 font-medium mb-3 flex items-center gap-1">
                <i class="fa-solid fa-arrow-up"></i> +45 cm (1 jam terakhir)
              </div>
              <!-- Simple Chart Mockup -->
              <div class="h-12 w-full flex items-end gap-1">
                <div v-for="(b, i) in bars" :key="i" class="w-full rounded-t" :class="b"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span>14:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
