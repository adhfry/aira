<script setup lang="ts">
definePageMeta({ navbar: 'dark' })

useSeoMeta({
  title: 'Teknologi AIRA - Artificial Intelligence Response Banjir',
  description:
    'Arsitektur 5-layer AIRA: sumber data, Edge/IoT, AI processing, cloud platform, hingga output & aksi — dengan multi-modal data fusion.',
  ogTitle: 'Teknologi AIRA',
  ogImage: '/AiraLogo.png',
})

const heroCards = [
  { icon: 'fa-video', title: 'CCTV', text: 'Pemantauan Visual berbasis AI', pos: 'top-10 left-0 animate-pulse' },
  { icon: 'fa-cloud-sun-rain', title: 'Sensor Cuaca', text: 'Curah hujan, suhu dan kondisi meteorologi', pos: 'top-20 right-10' },
  { icon: 'fa-water', title: 'Sensor Air', text: 'Tinggi muka air dan kualitas air', pos: 'top-1/2 right-0' },
  { icon: 'fa-wifi', title: 'Koneksi Real-time', text: '4G/LTE / LoRa ke pusat data', pos: 'bottom-10 left-10' },
]

const sources = [
  { icon: 'fa-video', title: 'CCTV', text: 'Analisis visual dengan AI' },
  { icon: 'fa-wifi', title: 'Sensor IoT', text: 'Tinggi muka air, curah hujan' },
  { icon: 'fa-cloud-sun', title: 'Data Cuaca', text: 'Informasi meteorologi' },
  { icon: 'fa-location-dot', title: 'GIS', text: 'Peta lokasi, wilayah rawan' },
  { icon: 'fa-database', title: 'Data Historis', text: 'Riwayat kejadian banjir' },
  { icon: 'fa-users', title: 'Laporan Petugas', text: 'Verifikasi kondisi lapangan' },
]

const layer1 = [
  { icon: 'fa-video', text: 'CCTV' },
  { icon: 'fa-wave-square', text: 'Sensor Tinggi Muka Air' },
  { icon: 'fa-cloud-rain', text: 'Sensor Curah Hujan' },
  { icon: 'fa-cloud-sun', text: 'Data Cuaca (API)' },
  { icon: 'fa-map', text: 'Data Geospasial (GIS)' },
  { icon: 'fa-file-alt', text: 'Laporan Petugas' },
]
const layer2 = ['Akusisi data real-time', 'Pra-pemrosesan data', 'Koneksi 4G/LTE / LoRa', 'Pengiriman ke cloud']
const layer3 = [
  { icon: 'fa-brain text-purple-600', box: 'bg-purple-50 border-purple-100', title: 'Computer Vision', text: 'Deteksi genangan, perubahan kondisi air' },
  { icon: 'fa-chart-line text-green-600', box: 'bg-green-50 border-green-100', title: 'Time-Series AI', text: 'Analisis tren tinggi air & curah hujan' },
  { icon: 'fa-shield-halved text-orange-500', box: 'bg-orange-50 border-orange-100', title: 'Risk Analysis Engine', text: 'Multi-sumber data fusion' },
  { icon: 'fa-gears text-blue-600', box: 'bg-blue-50 border-blue-100', title: 'Rule & Decision Engine', text: 'Penentuan status dan peringatan' },
]
const layer4 = [
  { icon: 'fa-database', text: 'Database terpusat' },
  { icon: 'fa-map', text: 'GIS & Peta Interaktif' },
  { icon: 'fa-mobile-screen', text: 'Manajemen perangkat' },
  { icon: 'fa-chart-pie', text: 'Analitik & visualisasi' },
  { icon: 'fa-plug', text: 'API integrasi' },
  { icon: 'fa-bell', text: 'Sistem notifikasi' },
]
const layer5 = [
  { icon: 'fa-bell text-red-500', title: 'Peringatan Dini', text: 'Notifikasi real-time' },
  { icon: 'fa-clipboard-check text-green-500', title: 'Verifikasi Petugas', text: 'Konfirmasi lapangan' },
  { icon: 'fa-truck-medical text-blue-500', title: 'Respons', text: 'Tindakan penanganan' },
  { icon: 'fa-file-invoice text-purple-500', title: 'Dokumentasi', text: 'Simpan histori kejadian' },
  { icon: 'fa-chart-line text-orange-500', title: 'Pembelajaran Sistem', text: 'Data untuk peningkatan akurasi' },
]

const stack = [
  { icon: 'fa-eye', box: 'bg-blue-50 text-primary', title: 'Computer Vision', text: 'YOLOv10 untuk deteksi genangan dan perubahan kondisi air pada CCTV.', tags: ['YOLOv10', 'OpenCV', 'Python'] },
  { icon: 'fa-chart-line', box: 'bg-green-50 text-green-600', title: 'Time-Series AI', text: 'LSTM untuk analisis tren tinggi muka air dan curah hujan.', tags: ['LSTM', 'PyTorch', 'Scikit-learn'] },
  { icon: 'fa-map', box: 'bg-purple-50 text-purple-600', title: 'Geospasial (GIS)', text: 'Visualisasi peta, analisis wilayah rawan, dan spasial data.', tags: ['Leaflet', 'PostGIS', 'QGIS'] },
  { icon: 'fa-microchip', box: 'bg-orange-50 text-orange-500', title: 'IoT & Edge Computing', text: 'Sensor tinggi muka air, rain gauge, dan perangkat IoT dengan koneksi real-time.', tags: ['ESP32', 'LoRa/4G', 'MQTT'] },
  { icon: 'fa-cloud-sun', box: 'bg-sky-50 text-sky-600', title: 'Data Cuaca', text: 'Integrasi API data cuaca untuk prediksi dan analisis risiko banjir.', tags: ['OpenWeather', 'BMKG API'] },
  { icon: 'fa-server', box: 'bg-slate-100 text-slate-600', title: 'Backend & API', text: 'Backend services untuk pengelolaan data dan analitik.', tags: ['FastAPI', 'Docker', 'PostgreSQL'] },
  { icon: 'fa-desktop', box: 'bg-teal-50 text-teal-600', title: 'Frontend Dashboard', text: 'Dashboard interaktif dengan peta dan visualisasi real-time.', tags: ['Vue.js', 'TailwindCSS', 'Chart.js'] },
  { icon: 'fa-bell', box: 'bg-red-50 text-red-500', title: 'Notifikasi & Integrasi', text: 'Multi-channel notification (WhatsApp, Email, Siren) dan integrasi sistem lain.', tags: ['WhatsApp API', 'Email', 'Webhook'] },
]

const integrasi = [
  { icon: 'fa-code', box: 'bg-blue-500/20 text-blue-400', title: 'API Terbuka', text: 'Mudah diintegrasikan dengan sistem lain.' },
  { icon: 'fa-expand', box: 'bg-purple-500/20 text-purple-400', title: 'Skalabel', text: 'Dapat dikembangkan sesuai kebutuhan.' },
  { icon: 'fa-shield-halved', box: 'bg-green-500/20 text-green-400', title: 'Aman & Andal', text: 'Menggunakan standar keamanan terkini.' },
  { icon: 'fa-building-columns', box: 'bg-orange-500/20 text-orange-400', title: 'Mendukung Standar', text: 'Sesuai dengan standar pemerintah dan keberlanjutan.' },
]

const IOT_IMG = (w: number) => `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=${w}&auto=format&fit=crop`
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-darkbg relative overflow-hidden text-white">
      <LandingHeroBackground />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-block bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wider backdrop-blur-sm">
              TEKNOLOGI AIRA
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight mb-6">
              Teknologi Terintegrasi<br />untuk Peringatan Dini Banjir<br /><span class="text-blue-400">yang Lebih Akurat</span>
            </h1>
            <p class="text-slate-300 text-lg mb-8 max-w-lg leading-relaxed">
              AIRA menggabungkan Computer Vision, IoT, data cuaca, sistem informasi geografis (GIS), dan analisis risiko berbasis Artificial
              Intelligence dalam satu ekosistem yang terintegrasi.
            </p>
            <a href="#arsitektur" class="inline-flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition">
              Lihat Arsitektur Sistem <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <!-- Right Visuals -->
          <div class="relative h-96 hidden lg:block">
            <img :src="IOT_IMG(800)" alt="IoT Pole" class="absolute right-0 bottom-0 h-full object-cover opacity-80 image-grayscale rounded-2xl" />
            <div
              v-for="c in heroCards"
              :key="c.title"
              class="absolute bg-slate-800/80 backdrop-blur-md border border-slate-600 rounded-xl p-3 flex items-center gap-3 w-48"
              :class="c.pos"
            >
              <div class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <i class="fa-solid" :class="c.icon"></i>
              </div>
              <div>
                <div class="text-xs font-bold text-white">{{ c.title }}</div>
                <div class="text-[9px] text-slate-400">{{ c.text }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Multi-Modal Data Fusion Section -->
    <section class="py-20 bg-slate-50 border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-12 items-end">
          <div>
            <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">PENDEKATAN TEKNOLOGI</div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">Multi-Modal Data Fusion</h2>
            <p class="text-slate-600 leading-relaxed max-w-md">
              AIRA menggunakan pendekatan multi-modal dengan menggabungkan berbagai sumber data untuk memberikan analisis risiko banjir yang
              lebih akurat dan andal.
            </p>
          </div>
          <div class="lg:text-right">
            <div class="text-xs text-slate-400 mb-2">
              Alur Data <span class="text-primary font-bold">→</span> Pemrosesan AI <span class="text-purple-500 font-bold">→</span> Notifikasi
            </div>
          </div>
        </div>

        <!-- Diagram Flow -->
        <div class="flex flex-col items-center">
          <div class="flex flex-wrap justify-center gap-4 lg:gap-6 w-full mb-8">
            <div
              v-for="s in sources"
              :key="s.title"
              class="bg-white p-4 rounded-xl border border-slate-200 text-center w-36 shadow-sm hover:shadow-md transition"
            >
              <div class="w-10 h-10 mx-auto bg-blue-50 text-primary rounded-full flex items-center justify-center mb-2">
                <i class="fa-solid" :class="s.icon"></i>
              </div>
              <div class="text-xs font-bold text-slate-900 mb-1">{{ s.title }}</div>
              <div class="text-[10px] text-slate-500">{{ s.text }}</div>
            </div>
          </div>

          <!-- Connecting Lines -->
          <div class="hidden lg:flex justify-center w-full mb-4">
            <div class="flex gap-4 lg:gap-6">
              <div v-for="n in 6" :key="n" class="w-36 h-8 border-b-2 border-dashed border-slate-300"></div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm py-3 px-8 rounded-full shadow-lg shadow-blue-500/30 mb-4 relative z-10 text-center">
            Data Fusion &amp; Risk Analysis Engine
          </div>
          <p class="text-xs text-slate-500 text-center">Menggabungkan semua sumber data untuk menghasilkan analisis risiko yang akurat</p>
        </div>
      </div>
    </section>

    <!-- Arsitektur Sistem Section -->
    <section id="arsitektur" class="py-20 bg-white scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12">
          <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">ARSITEKTUR SISTEM</div>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">Arsitektur Teknologi AIRA</h2>
          <p class="text-slate-600 max-w-2xl leading-relaxed">
            AIRA dibangun dengan arsitektur yang modular, skalabel, dan real-time untuk memastikan sistem dapat beroperasi dengan stabil dan
            terintegrasi dengan berbagai sumber data.
          </p>
        </div>

        <!-- Architecture Diagram (5 Columns) -->
        <div class="flex flex-col lg:flex-row justify-between items-stretch gap-4 relative">
          <div class="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

          <!-- 1. Sumber Data -->
          <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
            <div class="text-xs font-bold text-slate-800 mb-4 text-center">1. Sumber Data</div>
            <div class="space-y-3 flex-1">
              <div v-for="l in layer1" :key="l.text" class="flex items-center gap-2 bg-white p-2 rounded border border-slate-100">
                <i class="fa-solid text-primary w-4 text-center" :class="l.icon"></i>
                <span class="text-[10px] font-semibold text-slate-700">{{ l.text }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center text-slate-300"><i class="fa-solid fa-arrow-right text-xl rotate-90 lg:rotate-0"></i></div>

          <!-- 2. Edge/IoT Layer -->
          <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
            <div class="text-xs font-bold text-slate-800 mb-4 text-center">2. Edge/IoT Layer</div>
            <div class="flex-1 flex flex-col items-center justify-center">
              <img :src="IOT_IMG(200)" alt="IoT Device" class="w-24 h-24 object-cover rounded-lg mb-3 image-grayscale shadow-md" />
              <div class="space-y-2 w-full">
                <div v-for="t in layer2" :key="t" class="flex items-center gap-2 text-[10px] text-slate-600">
                  <i class="fa-solid fa-check-circle text-blue-500"></i> {{ t }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center text-slate-300"><i class="fa-solid fa-arrow-right text-xl rotate-90 lg:rotate-0"></i></div>

          <!-- 3. AI Processing -->
          <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
            <div class="text-xs font-bold text-slate-800 mb-4 text-center">3. AI Processing</div>
            <div class="space-y-3 flex-1">
              <div v-for="l in layer3" :key="l.title" class="p-2 rounded border" :class="l.box">
                <div class="flex items-center gap-2 mb-1">
                  <i class="fa-solid text-xs" :class="l.icon"></i>
                  <span class="text-[10px] font-bold text-slate-800">{{ l.title }}</span>
                </div>
                <div class="text-[9px] text-slate-500">{{ l.text }}</div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center text-slate-300"><i class="fa-solid fa-arrow-right text-xl rotate-90 lg:rotate-0"></i></div>

          <!-- 4. Cloud Platform -->
          <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
            <div class="text-xs font-bold text-slate-800 mb-4 text-center">4. Cloud Platform</div>
            <div class="flex-1 flex flex-col items-center justify-center">
              <div class="w-16 h-16 rounded-full bg-blue-100 text-primary flex items-center justify-center text-2xl mb-4">
                <i class="fa-solid fa-cloud"></i>
              </div>
              <div class="space-y-2 w-full">
                <div v-for="l in layer4" :key="l.text" class="flex items-center gap-2 text-[10px] text-slate-600">
                  <i class="fa-solid text-slate-400" :class="l.icon"></i> {{ l.text }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center text-slate-300"><i class="fa-solid fa-arrow-right text-xl rotate-90 lg:rotate-0"></i></div>

          <!-- 5. Output & Aksi -->
          <div class="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
            <div class="text-xs font-bold text-slate-800 mb-4 text-center">5. Output &amp; Aksi</div>
            <div class="space-y-3 flex-1">
              <div v-for="l in layer5" :key="l.title" class="flex items-center gap-2 bg-white p-2 rounded border border-slate-100">
                <i class="fa-solid w-4 text-center" :class="l.icon"></i>
                <div>
                  <div class="text-[10px] font-bold text-slate-800">{{ l.title }}</div>
                  <div class="text-[9px] text-slate-500">{{ l.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Teknologi yang Digunakan Section -->
    <section class="py-20 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandingSplitHeader badge="TEKNOLOGI UTAMA">
          Teknologi yang Digunakan
          <template #description>
            AIRA dibangun menggunakan teknologi terkini yang telah terbukti andal dalam berbagai penelitian dan implementasi sistem peringatan
            dini.
          </template>
        </LandingSplitHeader>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="s in stack" :key="s.title" class="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-lg transition">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg" :class="s.box">
                <i class="fa-solid" :class="s.icon"></i>
              </div>
              <h3 class="font-bold text-slate-900 text-sm">{{ s.title }}</h3>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed mb-4">{{ s.text }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="t in s.tags" :key="t" class="tech-tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Integrasi & Skalabilitas CTA -->
    <section class="py-24 cta-bg-dark text-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="inline-block bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wider backdrop-blur-sm">
              INTEGRASI &amp; SKALABILITAS
            </div>
            <h2 class="text-3xl md:text-4xl font-extrabold leading-tight mb-6">Siap untuk Integrasi dan Pengembangan Lebih Lanjut</h2>
            <p class="text-slate-300 text-lg mb-10 leading-relaxed max-w-lg">
              AIRA dirancang dengan arsitektur terbuka sehingga dapat diintegrasikan dengan sistem existing pemerintah daerah dan mudah
              dikembangkan untuk kebutuhan masa depan.
            </p>
            <div class="flex flex-wrap gap-4">
              <a href="#arsitektur" class="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-semibold transition inline-flex items-center gap-2">
                Lihat Dokumentasi Teknis <i class="fa-solid fa-plus text-xs"></i>
              </a>
              <a href="#kontak" class="bg-transparent hover:bg-white/10 border border-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold transition">
                Hubungi Kami <i class="fa-solid fa-arrow-right text-xs"></i>
              </a>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <div v-for="c in integrasi" :key="c.title" class="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-4" :class="c.box">
                <i class="fa-solid" :class="c.icon"></i>
              </div>
              <h3 class="font-bold text-white text-sm mb-2">{{ c.title }}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">{{ c.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
