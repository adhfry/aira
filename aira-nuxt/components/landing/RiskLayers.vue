<script setup lang="ts">
const layers = [
  {
    no: 'Layer 1',
    title: 'Structural Risk',
    icon: 'fa-diagram-project',
    box: 'bg-blue-50 text-primary',
    items: ['Kapasitas drainase', 'DAS & outlet', 'Backwater', 'Topografi', 'Tata guna lahan'],
    source: 'Kajian BRIDA–ITS & drainase 2017',
  },
  {
    no: 'Layer 2',
    title: 'Historical Risk',
    icon: 'fa-clock-rotate-left',
    box: 'bg-purple-50 text-purple-600',
    items: ['Kejadian banjir', 'Frekuensi', 'Durasi', 'Kedalaman', 'Rekaman CCTV & laporan'],
    source: 'Basis data kejadian AIRA / BPBD',
  },
  {
    no: 'Layer 3',
    title: 'Real-Time Risk',
    icon: 'fa-tower-broadcast',
    box: 'bg-orange-50 text-orange-500',
    items: ['CCTV (Computer Vision)', 'TMA saluran', 'Curah hujan & cuaca', 'TMA sungai', 'Pasang & prediksi AI'],
    source: 'Titik pantau AIRA',
  },
]

const outlet6 = ['Wahid Hasyim', 'Pasar Anom', 'Bumi Sumekar', 'Satelit', 'Sungai Marengan']
</script>

<template>
  <section class="py-20 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandingSplitHeader badge="AIRA RISK ENGINE">
        Tiga Lapis Risiko,<br />Satu Risiko Banjir Dinamis
        <template #description>
          Lebih dari sekadar mendeteksi air di jalan: AIRA menggabungkan risiko struktural hasil kajian daerah, riwayat kejadian, dan kondisi
          real-time untuk menghasilkan risiko banjir dinamis dan peringatan dini yang kontekstual dengan kondisi Sumenep.
        </template>
      </LandingSplitHeader>

      <div class="grid lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_240px] gap-4 items-stretch mb-12">
        <template v-for="(l, i) in layers" :key="l.no">
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg" :class="l.box"><i class="fa-solid" :class="l.icon"></i></div>
              <div>
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ l.no }}</div>
                <h3 class="font-bold text-slate-900 text-sm">{{ l.title }}</h3>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span v-for="it in l.items" :key="it" class="tech-tag">{{ it }}</span>
            </div>
            <div class="text-[10px] text-slate-500"><i class="fa-solid fa-database mr-1 text-slate-400"></i>{{ l.source }}</div>
          </div>
          <div class="flex items-center justify-center text-slate-300 text-xl">
            <i class="fa-solid" :class="i < layers.length - 1 ? 'fa-plus' : 'fa-arrow-right rotate-90 lg:rotate-0'"></i>
          </div>
        </template>
        <div class="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-5 flex flex-col justify-center shadow-lg shadow-blue-500/30">
          <i class="fa-solid fa-gauge-high text-2xl mb-3"></i>
          <div class="font-extrabold text-lg leading-tight mb-1">Dynamic Flood Risk</div>
          <div class="text-[11px] text-blue-100">→ Status zona &amp; peringatan dini otomatis</div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Backwater detector -->
        <div class="bg-darkbg text-white rounded-2xl p-6 relative overflow-hidden">
          <div class="inline-block bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[10px] font-bold px-3 py-1 rounded-full mb-4 tracking-wider">
            BACKWATER DETECTOR
          </div>
          <h3 class="text-xl font-bold mb-2">Arus Balik Sungai Marengan</h3>
          <p class="text-sm text-slate-400 mb-6 leading-relaxed">
            Kajian drainase 2017 menemukan pengaruh backwater pada outlet 4 (±318 m), 5 (±678 m), 6 (±507 m), dan 7 (±1.523 m). AIRA membandingkan muka
            air sungai dengan saluran untuk mendeteksinya lebih awal.
          </p>
          <div class="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 text-center">
            <div class="bg-white/5 border border-white/10 rounded-xl p-3">
              <i class="fa-solid fa-bridge-water text-sky-400 mb-1"></i>
              <div class="text-[10px] text-slate-400">Sungai</div>
              <div class="font-extrabold">1,75 m</div>
            </div>
            <i class="fa-solid fa-minus text-slate-500"></i>
            <div class="bg-white/5 border border-white/10 rounded-xl p-3">
              <i class="fa-solid fa-water text-cyan-400 mb-1"></i>
              <div class="text-[10px] text-slate-400">Saluran</div>
              <div class="font-extrabold">1,20 m</div>
            </div>
            <i class="fa-solid fa-equals text-slate-500"></i>
            <div class="bg-red-500/20 border border-red-500/40 rounded-xl p-3">
              <i class="fa-solid fa-arrow-rotate-left text-red-400 mb-1"></i>
              <div class="text-[10px] text-red-300">Δ +0,55 m</div>
              <div class="font-extrabold text-red-300 text-xs">BACKWATER</div>
            </div>
          </div>
          <p class="text-[10px] text-slate-500 mt-4">+ curah hujan + pasang laut → Backwater Risk. Contoh angka ilustratif.</p>
        </div>

        <!-- Outlet 6 chain -->
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div class="inline-block bg-blue-50 text-primary text-[10px] font-bold px-3 py-1 rounded-full mb-4 tracking-wider">PEMANTAUAN BERANTAI</div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Arah Perkembangan Genangan</h3>
          <p class="text-sm text-slate-600 mb-6 leading-relaxed">
            Titik pantau diturunkan dari jaringan drainase, bukan dipasang acak. Contoh Outlet 6: kamera &amp; sensor 06A → 06B → 06C memperlihatkan ke mana
            genangan bergerak.
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <template v-for="(n, i) in outlet6" :key="n">
              <div
                class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border"
                :class="i === outlet6.length - 1 ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-white border-slate-200 text-slate-700'"
              >
                <i class="fa-solid" :class="i === outlet6.length - 1 ? 'fa-bridge-water text-sky-500' : 'fa-video text-primary'"></i>
                {{ n }}
                <span v-if="i < 3" class="text-[9px] font-bold text-slate-400">06{{ 'ABC'[i] }}</span>
              </div>
              <i v-if="i < outlet6.length - 1" class="fa-solid fa-arrow-right text-slate-300 text-xs"></i>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
