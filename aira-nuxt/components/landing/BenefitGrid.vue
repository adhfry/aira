<script setup lang="ts">
const benefits = [
  { icon: 'fa-bolt', box: 'bg-blue-100 text-primary', title: 'Respon Lebih Cepat', text: 'Informasi real-time memungkinkan tindakan lebih cepat dan tepat.' },
  { icon: 'fa-shield-halved', box: 'bg-green-100 text-green-600', title: 'Mengurangi Risiko', text: 'Deteksi dini membantu meminimalkan dampak banjir.' },
  { icon: 'fa-chart-pie', box: 'bg-purple-100 text-purple-600', title: 'Keputusan Berbasis Data', text: 'Pemerintah dapat mengambil keputusan berdasarkan data yang akurat.' },
  { icon: 'fa-users', box: 'bg-orange-100 text-orange-500', title: 'Masyarakat Lebih Aman', text: 'Meningkatkan kesiapsiagaan dan keselamatan masyarakat.' },
]
</script>

<template>
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandingSectionHeader
        badge="MANFAAT"
        description="AIRA membantu menciptakan daerah yang lebih aman, tangguh, dan siap menghadapi risiko banjir."
      >
        Memberikan Dampak Nyata bagi Masyarakat
      </LandingSectionHeader>

      <div class="grid lg:grid-cols-2 gap-8 items-center">
        <!-- Left Cards -->
        <div class="grid sm:grid-cols-2 gap-4">
          <div v-for="b in benefits" :key="b.title" class="bg-slate-50 p-5 rounded-xl border border-slate-100 flex gap-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="b.box">
              <i class="fa-solid" :class="b.icon"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm mb-1">{{ b.title }}</h4>
              <p class="text-xs text-slate-500 leading-relaxed">{{ b.text }}</p>
            </div>
          </div>
        </div>

        <!-- Right Image -->
        <div class="relative">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
            alt="Community Flood"
            class="rounded-2xl shadow-xl w-full h-80 object-cover image-grayscale"
          />
          <div class="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-xs flex gap-3 items-start">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-quote-left text-xs"></i>
            </div>
            <p class="text-[10px] text-slate-600 leading-relaxed font-medium">
              Teknologi untuk masyarakat yang lebih aman dan tangguh terhadap bencana.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
