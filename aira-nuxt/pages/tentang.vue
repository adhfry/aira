<script setup lang="ts">
useSeoMeta({
  title: 'Tentang AIRA - Artificial Intelligence Response Banjir',
  description:
    'Visi, misi, latar belakang, dan nilai utama AIRA — teknologi untuk daerah yang lebih siap menghadapi banjir.',
  ogTitle: 'Tentang AIRA',
  ogImage: '/AiraLogo.png',
})

const misi = [
  'Mengintegrasikan berbagai sumber data untuk pemantauan banjir secara real-time.',
  'Mengembangkan analisis risiko berbasis AI yang akurat.',
  'Menyediakan informasi peringatan dini yang cepat dan mudah diakses.',
  'Mendukung pemerintah dan masyarakat dalam respon bencana.',
]

const tantangan = [
  { icon: 'fa-clock', text: 'Informasi lapangan terbatas dan terlambat' },
  { icon: 'fa-eye-slash', text: 'Tidak semua titik rawan dapat dipantau terus-menerus' },
  { icon: 'fa-water', text: 'Perubahan kondisi dapat terjadi sangat cepat' },
  { icon: 'fa-database', text: 'Data dari berbagai sumber belum terintegrasi' },
]

const nilai = [
  { icon: 'fa-shield-halved', card: 'bg-blue-50/50 border-blue-100', box: 'bg-blue-100 text-primary', title: 'Keandalan', text: 'Informasi yang akurat dan dapat dipercaya.' },
  { icon: 'fa-users', card: 'bg-green-50/50 border-green-100', box: 'bg-green-100 text-green-600', title: 'Kolaborasi', text: 'Melibatkan pemerintah, petugas, dan masyarakat.' },
  { icon: 'fa-lightbulb', card: 'bg-orange-50/50 border-orange-100', box: 'bg-orange-100 text-orange-500', title: 'Inovasi', text: 'Memanfaatkan teknologi terkini untuk solusi nyata.' },
  { icon: 'fa-leaf', card: 'bg-purple-50/50 border-purple-100', box: 'bg-purple-100 text-purple-600', title: 'Dampak Nyata', text: 'Berorientasi pada keselamatan masyarakat dan keberlanjutan lingkungan.' },
]

const teknologi = [
  { icon: 'fa-video', title: 'CCTV', text: 'Analisis visual dengan Computer Vision' },
  { icon: 'fa-wifi', title: 'Sensor IoT', text: 'Tinggi muka air dan curah hujan' },
  { icon: 'fa-cloud-sun', title: 'Data Cuaca', text: 'Informasi meteorologi real-time' },
  { icon: 'fa-location-dot', title: 'Data Geospasial', text: 'Peta rawan banjir dan kondisi wilayah' },
  { icon: 'fa-database', title: 'Data Historis', text: 'Riwayat kejadian banjir' },
  { icon: 'fa-users', title: 'Laporan Petugas', text: 'Verifikasi dan respon di lapangan' },
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <LandingPageHero
      badge="Tentang AIRA"
      description="AIRA (Artificial Intelligence Response Banjir) adalah sistem pemantauan, analisis risiko, dan peringatan dini banjir berbasis Artificial Intelligence yang mengintegrasikan CCTV, sensor IoT, data cuaca, dan informasi geografis untuk memberikan informasi yang cepat, akurat, dan dapat ditindaklanjuti."
    >
      <template #title>Teknologi untuk<br />Daerah yang Lebih<br /><span class="text-primary">Siap Menghadapi Banjir</span></template>
      <img
        src="https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=800&auto=format&fit=crop"
        alt="CCTV Monitoring"
        class="rounded-2xl shadow-xl w-full h-[400px] object-cover image-grayscale"
      />
      <!-- Floating Card -->
      <div class="absolute bottom-8 left-2 sm:-left-8 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs animate-float">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-check-circle"></i>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-sm mb-1">Pemantauan Real-time</h4>
            <p class="text-xs text-slate-500 leading-relaxed">CCTV, sensor air, dan curah hujan terintegrasi untuk memantau kondisi lapangan 24/7.</p>
          </div>
        </div>
      </div>
    </LandingPageHero>

    <!-- Visi & Misi Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandingSplitHeader badge="VISI &amp; MISI">
          Komitmen Kami untuk<br />Lingkungan yang Lebih Aman
          <template #description>
            AIRA dikembangkan dengan tujuan menciptakan sistem peringatan dini banjir yang andal, terintegrasi, dan berdampak nyata bagi
            keselamatan masyarakat serta keberlanjutan lingkungan.
          </template>
        </LandingSplitHeader>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Visi Card -->
          <div class="border border-slate-200 rounded-2xl p-6 sm:p-8 flex gap-6 items-start hover:shadow-lg transition">
            <div class="w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-bullseye text-2xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Visi</h3>
              <p class="text-slate-600 leading-relaxed text-sm">
                Menjadi platform terdepan dalam pemantauan dan peringatan dini banjir berbasis AI yang mendukung terwujudnya daerah yang
                aman, tangguh, dan berkelanjutan.
              </p>
            </div>
          </div>

          <!-- Misi Card -->
          <div class="border border-slate-200 rounded-2xl p-6 sm:p-8 flex gap-6 items-start hover:shadow-lg transition">
            <div class="w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-flag text-2xl"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">Misi</h3>
              <ul class="text-slate-600 text-sm space-y-2">
                <li v-for="m in misi" :key="m" class="flex items-start gap-2">
                  <i class="fa-solid fa-check-circle text-blue-500 mt-0.5"></i>
                  <span>{{ m }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latar Belakang Section -->
    <section class="py-20 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">LATAR BELAKANG</div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">Mengapa AIRA<br />Dikembangkan?</h2>
            <p class="text-slate-600 leading-relaxed text-lg">
              Banjir merupakan salah satu permasalahan yang dapat mengganggu aktivitas masyarakat, transportasi, pelayanan publik,
              perekonomian, serta infrastruktur daerah. Informasi kondisi lapangan yang cepat dan akurat sangat dibutuhkan untuk menentukan
              tindakan yang tepat.
            </p>
          </div>

          <!-- Right Image with Overlay -->
          <div class="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
              alt="Flood Background"
              class="w-full h-[400px] object-cover image-grayscale"
            />
            <div class="absolute inset-0 bg-slate-900/70 p-6 sm:p-8 flex flex-col justify-center">
              <h3 class="text-white text-xl font-bold mb-6 border-b border-slate-600 pb-4">Tantangan yang Dihadapi</h3>
              <ul class="space-y-5">
                <li v-for="t in tantangan" :key="t.text" class="flex items-start gap-4">
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-blue-400">
                    <i class="fa-solid" :class="t.icon"></i>
                  </div>
                  <div>
                    <h4 class="text-white text-sm font-semibold">{{ t.text }}</h4>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nilai Utama Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12">
          <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">NILAI UTAMA</div>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">Prinsip yang Kami Junjung</h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="n in nilai" :key="n.title" class="p-6 rounded-2xl border flex flex-col items-center text-center" :class="n.card">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-4" :class="n.box">
              <i class="fa-solid" :class="n.icon"></i>
            </div>
            <h3 class="font-bold text-slate-900 mb-2">{{ n.title }}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">{{ n.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Teknologi & Pendekatan Section -->
    <section class="py-20 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12">
          <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">TEKNOLOGI &amp; PENDEKATAN</div>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">Menggabungkan Berbagai Sumber Data</h2>
          <p class="text-slate-600 text-lg">AIRA menggunakan pendekatan multi-modal data fusion dengan menggabungkan teknologi mutakhir.</p>
        </div>

        <!-- Tech Stack Flow -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap justify-between items-center gap-2">
          <template v-for="(t, i) in teknologi" :key="t.title">
            <div class="bg-white p-4 rounded-xl border border-slate-200 text-center w-full lg:w-40 flex-shrink-0">
              <div class="w-10 h-10 mx-auto bg-blue-50 text-primary rounded-full flex items-center justify-center mb-2">
                <i class="fa-solid" :class="t.icon"></i>
              </div>
              <div class="text-xs font-bold text-slate-900 mb-1">{{ t.title }}</div>
              <div class="text-[10px] text-slate-500">{{ t.text }}</div>
            </div>
            <div v-if="i < teknologi.length - 1" class="text-slate-400 font-bold text-xl hidden lg:block"><i class="fa-solid fa-plus"></i></div>
          </template>
        </div>
      </div>
    </section>

    <!-- Tujuan Akhir Section (CTA) -->
    <LandingCTASection
      badge="TUJUAN AKHIR"
      description="AIRA hadir sebagai bagian dari upaya menciptakan sistem peringatan dini yang terintegrasi, kolaboratif, dan berkelanjutan untuk melindungi masyarakat dan lingkungan kita."
      :primary="{ label: 'Lihat Fitur AIRA', to: '/fitur' }"
    >
      Bersama Mewujudkan Daerah<br />yang Lebih Siap dan Tangguh terhadap Banjir
    </LandingCTASection>
  </div>
</template>
