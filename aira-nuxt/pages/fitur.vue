<script setup lang="ts">
useSeoMeta({
  title: 'Fitur AIRA - Artificial Intelligence Response Banjir',
  description:
    'Enam fitur utama AIRA: CCTV berbasis AI, integrasi sensor IoT, prediksi cuaca, peta interaktif, peringatan dini, dan manajemen kejadian.',
  ogTitle: 'Fitur AIRA',
  ogImage: '/AiraLogo.png',
})

const CCTV = (w: number) => `https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=${w}&auto=format&fit=crop`
const MAP = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop'

const heroBars = ['bg-slate-600 h-1/4', 'bg-slate-600 h-2/4', 'bg-slate-600 h-1/4', 'bg-slate-600 h-3/4', 'bg-red-500 h-full', 'bg-red-500 h-5/6', 'bg-red-500 h-full']
const sensorBars = ['bg-slate-200 h-1/4', 'bg-slate-200 h-2/4', 'bg-slate-200 h-1/4', 'bg-slate-200 h-3/4', 'bg-red-400 h-full', 'bg-red-500 h-5/6']
const statBars = ['h-1/4', 'h-2/4', 'h-1/4', 'h-3/4', 'h-full', 'h-5/6', 'h-1/4', 'h-2/4', 'h-3/4', 'h-full', 'h-1/4', 'h-2/4']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const thumbs = [
  { time: '14:30', label: 'Siaga', color: 'bg-red-500' },
  { time: '12:30', label: 'Waspada', color: 'bg-orange-500' },
  { time: '10:30', label: 'Normal', color: 'bg-green-500' },
]

const layers = [
  { label: 'Titik CCTV', checked: true },
  { label: 'Sensor Air', checked: true },
  { label: 'Curah Hujan', checked: true },
  { label: 'Daerah Rawan Banjir', checked: false },
  { label: 'Batas Kecamatan', checked: true },
]

const events = [
  { name: 'Kali Surnenep', status: 'Siaga', badge: 'bg-red-100 text-red-600', time: '24 Sep 2026, 14:30' },
  { name: 'Kali Anom', status: 'Waspada', badge: 'bg-orange-100 text-orange-600', time: '24 Sep 2026, 11:20' },
  { name: 'Kali Gunting', status: 'Normal', badge: 'bg-green-100 text-green-600', time: '23 Sep 2026, 16:45' },
]

const periode = ref('Harian')
</script>

<template>
  <div>
    <!-- Hero Section -->
    <LandingPageHero
      badge="FITUR AIRA"
      description="AIRA menghadirkan berbagai fitur terintegrasi berbasis Artificial Intelligence, IoT, data cuaca, dan GIS untuk memberikan informasi kondisi banjir secara cepat, akurat, dan dapat ditindaklanjuti."
    >
      <template #title>Fitur Lengkap untuk<br />Pemantauan dan<br /><span class="text-primary">Peringatan Dini Banjir</span></template>

      <div class="bg-slate-900 rounded-2xl shadow-2xl p-2 w-full max-w-xl ml-auto border border-slate-700">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-2 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-water text-blue-500 text-sm"></i>
            <span class="font-bold text-xs text-white">AIRA Monitoring Dashboard</span>
          </div>
          <div class="flex gap-1.5">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
        </div>
        <!-- Content -->
        <div class="flex h-80 relative">
          <div class="w-16 border-r border-slate-700 hidden sm:flex flex-col items-center py-4 gap-5 text-slate-500">
            <i class="fa-solid fa-chart-pie text-blue-500 text-sm cursor-pointer"></i>
            <i v-for="ic in ['fa-map', 'fa-video', 'fa-wifi', 'fa-cloud-sun', 'fa-file-alt']" :key="ic" class="fa-solid hover:text-white text-sm cursor-pointer transition" :class="ic"></i>
          </div>

          <!-- Map Area -->
          <div class="flex-1 relative bg-slate-800 overflow-hidden">
            <img :src="MAP" alt="Map" class="w-full h-full object-cover opacity-40 image-grayscale" />
            <div class="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse z-10"></div>
            <div class="absolute top-1/2 left-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white z-10"></div>
            <div class="absolute bottom-1/3 right-1/4 w-3 h-3 bg-green-500 rounded-full border-2 border-white z-10"></div>
            <div class="absolute top-1/3 left-1/3 mt-2 -ml-16 bg-white text-slate-800 p-2 rounded shadow-lg text-[10px] w-32 z-20">
              <div class="font-bold mb-1">Kali Surnenep</div>
              <div class="text-slate-500">Tinggi Air: 285 cm</div>
              <div class="text-red-500 font-bold">Status: Siaga</div>
            </div>
            <div class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded text-[9px] flex gap-3 text-slate-300 z-10">
              <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Normal</span>
              <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Waspada</span>
              <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Siaga</span>
              <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Awas</span>
            </div>
          </div>

          <!-- Right Panel (CCTV & Water Level) -->
          <div class="w-56 border-l border-slate-700 p-3 bg-slate-900 hidden sm:flex flex-col gap-3 z-20">
            <div class="relative rounded-lg overflow-hidden h-28 bg-slate-800">
              <img :src="CCTV(400)" alt="CCTV" class="w-full h-full object-cover image-grayscale" />
              <div class="absolute top-1 left-1 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <i class="fa-solid fa-video text-red-500"></i> CCTV - Jembatan Kali
              </div>
              <div class="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <span class="w-1 h-1 bg-white rounded-full animate-pulse"></span> Live
              </div>
            </div>
            <div class="bg-slate-800 rounded-lg p-2 border border-slate-700">
              <div class="text-[9px] text-slate-400 mb-1">Tinggi Muka Air</div>
              <div class="flex justify-between items-end mb-2">
                <div class="text-lg font-extrabold text-white">285 cm</div>
                <div class="bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">Siaga</div>
              </div>
              <div class="text-[9px] text-red-400 font-medium mb-2 flex items-center gap-1"><i class="fa-solid fa-arrow-up"></i> +45 cm (1 jam terakhir)</div>
              <div class="h-8 w-full flex items-end gap-0.5">
                <div v-for="(b, i) in heroBars" :key="i" class="w-full rounded-t" :class="b"></div>
              </div>
              <div class="flex justify-between text-[7px] text-slate-500 mt-1">
                <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingPageHero>

    <!-- Fitur Utama Header -->
    <section class="pt-20 pb-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandingSplitHeader badge="FITUR UTAMA" spacing="">
          Solusi End-to-End<br />untuk Penanganan Banjir
          <template #description>
            Dari pemantauan kondisi lapangan hingga respons, semua terintegrasi dalam satu platform. Setiap fitur dirancang untuk saling
            terhubung sehingga menghasilkan informasi yang lebih akurat dan bermanfaat bagi pemerintah, petugas, dan masyarakat.
          </template>
        </LandingSplitHeader>
      </div>
    </section>

    <!-- Feature 1: CCTV Berbasis AI -->
    <LandingFeatureRow
      number="01"
      title="Pemantauan CCTV Berbasis AI"
      description="Analisis kondisi visual secara real-time menggunakan teknologi Computer Vision untuk mendeteksi genangan, kenaikan muka air, dan perubahan kondisi lingkungan."
      :points="['Deteksi genangan secara otomatis', 'Analisis tinggi muka air dari video', 'Monitoring multi-titik CCTV', 'Snapshot & video rekaman kejadian']"
      :cta="{ label: 'Lihat Contoh Deteksi', to: '/dashboard/cameras' }"
    >
      <div class="bg-slate-100 rounded-2xl p-4 border border-slate-200">
        <div class="flex gap-4">
          <div class="flex-1 relative rounded-xl overflow-hidden h-64 bg-slate-300">
            <img :src="CCTV(600)" alt="CCTV Main" class="w-full h-full object-cover image-grayscale" />
            <div class="absolute top-1/2 left-1/4 w-1/3 h-1/3 border-2 border-red-500 bg-red-500/20 rounded flex items-end p-1">
              <span class="text-[10px] font-bold text-red-600 bg-white/80 px-1 rounded">Genangan Terdeteksi</span>
            </div>
            <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
              <i class="fa-solid fa-video text-red-500"></i> CCTV - Jembatan Kali Surnenep
            </div>
            <div class="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Live
            </div>
            <div class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded">Tinggi Air: 285 cm</div>
          </div>
          <div class="w-24 hidden sm:flex flex-col gap-2">
            <div v-for="t in thumbs" :key="t.time" class="relative rounded-lg overflow-hidden h-20 bg-slate-300 border-2 border-transparent hover:border-primary cursor-pointer">
              <img :src="CCTV(200)" class="w-full h-full object-cover image-grayscale" alt="Thumb" />
              <div class="absolute top-1 left-1 text-white text-[8px] font-bold px-1 py-0.5 rounded" :class="t.color">{{ t.time }}</div>
              <div class="absolute bottom-1 left-1 text-white text-[8px] font-bold px-1 py-0.5 rounded" :class="t.color">{{ t.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </LandingFeatureRow>

    <!-- Feature 2: Integrasi Sensor IoT -->
    <LandingFeatureRow
      number="02"
      title="Integrasi Sensor IoT"
      description="Terhubung dengan sensor tinggi muka air, sensor curah hujan, dan perangkat IoT lainnya untuk memperoleh data lapangan secara real-time."
      :points="['Tinggi muka air (water level sensor)', 'Curah hujan (rain gauge)', 'Monitoring kondisi perangkat', 'Peringatan saat terjadi anomali data']"
      :cta="{ label: 'Lihat Data Sensor', to: '/dashboard/sensors' }"
      reverse
      tinted
    >
      <div class="relative">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
          alt="IoT Sensor"
          class="rounded-2xl shadow-xl w-full h-80 object-cover image-grayscale"
        />
        <div class="absolute top-8 right-2 sm:-right-8 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 w-64">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-xs font-bold text-green-600">Sensor Aktif</span>
            <span class="text-[10px] text-slate-400 ml-auto">Mengirim data setiap 5 menit</span>
          </div>
          <div class="text-xs text-slate-500 font-semibold mb-1">Tinggi Muka Air</div>
          <div class="text-2xl font-extrabold text-slate-900 mb-1">285 cm</div>
          <div class="text-[10px] text-red-500 font-medium mb-3 flex items-center gap-1"><i class="fa-solid fa-arrow-up"></i> +45 cm (1 jam terakhir)</div>
          <div class="h-10 w-full flex items-end gap-1">
            <div v-for="(b, i) in sensorBars" :key="i" class="w-full rounded-t" :class="b"></div>
          </div>
          <div class="flex justify-between text-[8px] text-slate-400 mt-1">
            <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span>
          </div>
        </div>
      </div>
    </LandingFeatureRow>

    <!-- Feature 3: Data Cuaca dan Analisis Prediksi -->
    <LandingFeatureRow
      number="03"
      title="Data Cuaca dan Analisis Prediksi"
      description="Mengintegrasikan data cuaca dari sumber terpercaya dan menggunakan model AI untuk memprediksi potensi risiko banjir beberapa jam ke depan."
      :points="['Data cuaca real-time', 'Prediksi curah hujan', 'Analisis risiko berbasis AI', 'Visualisasi tren dan historis']"
      :cta="{ label: 'Lihat Prediksi Cuaca', to: '/dashboard/sensors?type=weather' }"
    >
      <div class="bg-slate-900 rounded-2xl p-4 border border-slate-700 relative overflow-hidden">
        <div class="relative rounded-xl overflow-hidden h-64 bg-slate-800">
          <img
            src="https://images.unsplash.com/photo-1561484930-998b6a7b22e8?q=80&w=800&auto=format&fit=crop"
            alt="Weather Map"
            class="w-full h-full object-cover opacity-60 image-grayscale"
          />
          <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded">Prediksi Curah Hujan</div>
          <div class="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 w-56 border border-slate-200">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center">
                <i class="fa-solid fa-cloud-showers-heavy"></i>
              </div>
              <div>
                <div class="text-[10px] text-slate-500 font-semibold">Kecamatan Kota Surnenep</div>
                <div class="text-xs font-bold text-slate-900">Potensi Hujan Tinggi</div>
              </div>
            </div>
            <div class="text-[10px] text-slate-500 mb-3">2-6 jam ke depan</div>
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="bg-slate-50 p-2 rounded">
                <div class="text-[9px] text-slate-500">Intensitas</div>
                <div class="text-xs font-bold text-slate-800">45 mm/jam</div>
              </div>
              <div class="bg-slate-50 p-2 rounded">
                <div class="text-[9px] text-slate-500">Probabilitas</div>
                <div class="text-xs font-bold text-slate-800">78%</div>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-red-50 p-2 rounded border border-red-100">
              <i class="fa-solid fa-triangle-exclamation text-red-500 text-xs"></i>
              <div>
                <div class="text-[9px] text-red-500 font-semibold">Tingkat Risiko</div>
                <div class="text-xs font-bold text-red-600">Siaga</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingFeatureRow>

    <!-- Feature 4: Peta Interaktif dan Analisis Risiko -->
    <LandingFeatureRow
      number="04"
      title="Peta Interaktif dan Analisis Risiko"
      description="Visualisasi kondisi wilayah, titik pemantauan, dan tingkat risiko banjir dalam peta interaktif berbasis GIS."
      :points="['Peta sebaran titik CCTV & sensor', 'Layer daerah rawan banjir', 'Analisis risiko multi-sumber data', 'Informasi detail setiap lokasi']"
      :cta="{ label: 'Lihat Peta Interaktif', to: '/peta' }"
      reverse
      tinted
    >
      <div class="bg-slate-200 rounded-2xl p-4 border border-slate-300 relative h-80 overflow-hidden">
        <img :src="MAP" alt="Map" class="absolute inset-0 w-full h-full object-cover opacity-50 image-grayscale" />
        <div class="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2 w-40 sm:w-48 z-10">
          <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
          <input type="text" placeholder="Cari lokasi..." aria-label="Cari lokasi" class="text-xs outline-none w-full text-slate-600" />
        </div>
        <div class="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 w-44 z-10">
          <div class="text-[10px] font-bold text-slate-800 mb-2 border-b pb-1">Layer Peta</div>
          <div class="space-y-2">
            <label v-for="l in layers" :key="l.label" class="flex items-center gap-2 text-[10px] text-slate-600 cursor-pointer">
              <input type="checkbox" :checked="l.checked" class="rounded text-primary focus:ring-primary h-3 w-3" /> {{ l.label }}
            </label>
          </div>
        </div>
        <div class="absolute bottom-1/3 left-1/4 sm:left-1/3 bg-white rounded-lg shadow-lg p-3 w-40 z-10 border-l-4 border-red-500">
          <div class="text-xs font-bold text-slate-800 mb-1">Kali Surnenep</div>
          <div class="text-[10px] text-slate-500 mb-2">Status: Siaga</div>
          <div class="text-[10px] text-slate-500 mb-1">Tinggi Air: 285 cm</div>
          <div class="text-[10px] text-red-500 font-bold">Risiko: Tinggi</div>
        </div>
      </div>
    </LandingFeatureRow>

    <!-- Feature 5: Peringatan Dini dan Notifikasi -->
    <LandingFeatureRow
      number="05"
      title="Peringatan Dini dan Notifikasi"
      description="Sistem peringatan otomatis yang mengirimkan notifikasi kepada petugas dan masyarakat melalui berbagai kanal."
      :points="['Notifikasi Dashboard', 'WhatsApp Gateway', 'Email Notifikasi', 'Integrasi Siren/Publik']"
      :cta="{ label: 'Lihat Mekanisme Peringatan', to: '/dashboard/notifications' }"
    >
      <div class="relative flex items-center justify-center min-h-80">
        <!-- Popup Card -->
        <div class="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 w-56 sm:w-64 border border-slate-200 z-20">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">
              <i class="fa-solid fa-bell"></i>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center mb-1">
                <h4 class="font-bold text-slate-900 text-sm">Peringatan Dini Banjir</h4>
                <i class="fa-solid fa-xmark text-slate-400 text-xs cursor-pointer"></i>
              </div>
              <div class="text-[10px] text-slate-500 mb-2">Hari ini, 14:30</div>
              <p class="text-xs text-slate-600 leading-relaxed mb-3">
                Terjadi kenaikan tinggi muka air di Kali Surnenep. Status SIAGA. Segera lakukan pengecekan lapangan.
              </p>
              <NuxtLink
                to="/dashboard/notifications"
                class="block text-center w-full bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-1.5 rounded transition border border-red-200"
              >
                Lihat Detail
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Smartphone Mockup -->
        <div class="relative w-64 h-80 bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 shadow-2xl overflow-hidden ml-auto z-10">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-30"></div>
          <div class="bg-slate-50 w-full h-full pt-8 px-4 pb-4 flex flex-col">
            <div class="flex justify-between text-[10px] text-slate-800 font-semibold mb-4 px-2">
              <span>14:30</span>
              <div class="flex gap-1">
                <i class="fa-solid fa-signal"></i>
                <i class="fa-solid fa-wifi"></i>
                <i class="fa-solid fa-battery-full"></i>
              </div>
            </div>
            <div class="flex items-center gap-2 mb-4">
              <img src="/aira-mark.png" alt="Logo AIRA" class="w-6 h-6 object-contain" />
              <span class="font-bold text-slate-800 text-xs">AIRA</span>
            </div>
            <div class="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex-1">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-[8px]">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <span class="text-[10px] font-bold text-slate-800">Peringatan Dini Banjir</span>
              </div>
              <div class="text-[10px] font-bold text-slate-800 mb-1">Kali Surnenep</div>
              <div class="text-[9px] text-slate-500 space-y-1 mb-3">
                <div>Tinggi Air: 285 cm</div>
                <div>Status: <span class="text-red-500 font-bold">SIAGA</span></div>
                <div>Waktu: 24 Sep 2025 14:30</div>
              </div>
              <p class="text-[9px] text-slate-500 leading-relaxed border-t pt-2 border-slate-100">Segera lakukan pengecekan lapangan.</p>
            </div>
          </div>
        </div>
      </div>
    </LandingFeatureRow>

    <!-- Feature 6: Manajemen Kejadian dan Laporan -->
    <LandingFeatureRow
      number="06"
      title="Manajemen Kejadian dan Laporan"
      description="Pencatatan kejadian banjir, verifikasi petugas, dan laporan lengkap untuk evaluasi dan pengambilan keputusan."
      :points="['Pencatatan kejadian secara otomatis', 'Verifikasi dan catatan respons petugas', 'Laporan statistik dan histori', 'Ekspor data dan laporan']"
      :cta="{ label: 'Lihat Contoh Laporan', to: '/dashboard/incidents' }"
      reverse
      tinted
    >
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 h-80 flex flex-col">
        <div class="flex gap-4 h-full">
          <div class="flex-1 flex flex-col min-w-0">
            <div class="text-xs font-bold text-slate-800 mb-3">Statistik Kejadian Banjir</div>
            <div class="flex flex-wrap gap-2 mb-4">
              <button
                v-for="p in ['Harian', 'Mingguan', 'Bulanan', 'Tahunan']"
                :key="p"
                class="text-[10px] px-2 py-1 rounded transition"
                :class="periode === p ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'"
                @click="periode = p"
              >
                {{ p }}
              </button>
            </div>
            <div class="flex-1 flex items-end gap-1 pb-4 border-b border-slate-100 relative">
              <div class="absolute top-1/3 left-1/4 bg-slate-800 text-white text-[8px] px-2 py-1 rounded -translate-x-1/2">
                Mar 2026<br /><span class="font-bold">12 Kejadian</span>
              </div>
              <div v-for="(h, i) in statBars" :key="i" class="w-full bg-slate-200 rounded-t" :class="h"></div>
            </div>
            <div class="flex justify-between text-[8px] text-slate-400 mt-1 px-1">
              <span v-for="m in months" :key="m">{{ m }}</span>
            </div>
          </div>
          <div class="w-48 border-l border-slate-100 pl-4 hidden sm:flex flex-col">
            <div class="flex justify-between items-center mb-3">
              <div class="text-xs font-bold text-slate-800">Kejadian Terbaru</div>
              <NuxtLink to="/dashboard/incidents" class="text-[9px] text-primary font-semibold cursor-pointer">Lihat Semua</NuxtLink>
            </div>
            <div class="space-y-3 flex-1 overflow-y-auto custom-scroll">
              <div v-for="e in events" :key="e.name" class="bg-slate-50 p-2 rounded border border-slate-100">
                <div class="flex justify-between items-start mb-1">
                  <span class="text-[10px] font-bold text-slate-800">{{ e.name }}</span>
                  <span class="text-[8px] font-bold px-1.5 py-0.5 rounded" :class="e.badge">{{ e.status }}</span>
                </div>
                <div class="text-[9px] text-slate-500">{{ e.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingFeatureRow>

    <!-- CTA Section -->
    <LandingCTASection
      badge="FITUR AIRA"
      description="Manfaatkan seluruh fitur AIRA untuk pemantauan, peringatan dini, dan respons banjir yang lebih cepat, akurat, dan terkoordinasi."
      :primary="{ label: 'Akses Dashboard', to: '/dashboard' }"
      :secondary="{ label: 'Hubungi Kami', to: '#kontak' }"
    >
      Teknologi Terintegrasi<br />untuk Wilayah yang Lebih Aman
    </LandingCTASection>
  </div>
</template>
