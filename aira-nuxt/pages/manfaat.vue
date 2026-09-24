<script setup lang="ts">
useSeoMeta({
  title: 'Manfaat AIRA - Artificial Intelligence Response Banjir',
  description:
    'Matriks strategi 3x3, dampak, dan metrik manfaat AIRA bagi pemerintah daerah, petugas lapangan, dan masyarakat Kabupaten Surnenep.',
  ogTitle: 'Manfaat AIRA',
  ogImage: '/AiraLogo.png',
})

const { data: stats } = useStats()
const { items: districts } = useDistricts()

const phases = [
  { key: 'sebelum', title: 'Sebelum Banjir', subtitle: 'Mitigasi & Kesiapsiagaan', icon: 'fa-shield-halved', head: 'bg-blue-50 text-primary border-blue-100' },
  { key: 'saat', title: 'Saat Banjir', subtitle: 'Respons Cepat', icon: 'fa-bolt', head: 'bg-orange-50 text-orange-600 border-orange-100' },
  { key: 'setelah', title: 'Setelah Banjir', subtitle: 'Pemulihan & Evaluasi', icon: 'fa-rotate', head: 'bg-green-50 text-green-600 border-green-100' },
] as const

type PhaseKey = (typeof phases)[number]['key']

interface Actor {
  title: string
  icon: string
  box: string
  cells: Record<PhaseKey, { icon: string; title: string; text: string }>
}

const matrix: Actor[] = [
  {
    title: 'Pemerintah Daerah',
    icon: 'fa-building-columns',
    box: 'bg-blue-100 text-primary',
    cells: {
      sebelum: { icon: 'fa-map-location-dot', title: 'Pemetaan Risiko', text: 'Prioritas anggaran & infrastruktur berbasis peta risiko per kecamatan.' },
      saat: { icon: 'fa-sitemap', title: 'Komando Terpadu', text: 'Satu dashboard untuk koordinasi BPBD, dinas, dan kecamatan.' },
      setelah: { icon: 'fa-chart-pie', title: 'Kebijakan Berbasis Data', text: 'Evaluasi dampak & perencanaan tata ruang dari histori kejadian.' },
    },
  },
  {
    title: 'Petugas Lapangan',
    icon: 'fa-user-shield',
    box: 'bg-orange-100 text-orange-500',
    cells: {
      sebelum: { icon: 'fa-screwdriver-wrench', title: 'Pemeliharaan Terjadwal', text: 'Notifikasi perangkat offline & titik sumbatan saluran.' },
      saat: { icon: 'fa-location-crosshairs', title: 'Verifikasi Cepat', text: 'Lokasi prioritas & rute menuju titik kritis secara real-time.' },
      setelah: { icon: 'fa-clipboard-check', title: 'Laporan Digital', text: 'Pencatatan tindakan dan dokumentasi lapangan terstruktur.' },
    },
  },
  {
    title: 'Masyarakat',
    icon: 'fa-users',
    box: 'bg-green-100 text-green-600',
    cells: {
      sebelum: { icon: 'fa-graduation-cap', title: 'Edukasi & Kesiapan', text: 'Informasi status wilayah dan jalur evakuasi terdekat.' },
      saat: { icon: 'fa-bell', title: 'Peringatan Dini', text: 'Notifikasi WhatsApp, sirene, dan dashboard publik.' },
      setelah: { icon: 'fa-hand-holding-heart', title: 'Pemulihan Terarah', text: 'Informasi bantuan & status normalisasi wilayah.' },
    },
  },
]

const impacts = [
  { icon: 'fa-coins', box: 'bg-blue-100 text-primary', title: 'Ekonomi', text: 'Mengurangi kerugian aset, gangguan usaha, dan biaya pemulihan infrastruktur.' },
  { icon: 'fa-people-group', box: 'bg-green-100 text-green-600', title: 'Sosial', text: 'Melindungi keselamatan warga dan menjaga layanan publik tetap berjalan.' },
  { icon: 'fa-leaf', box: 'bg-purple-100 text-purple-600', title: 'Lingkungan', text: 'Data sungai & curah hujan mendukung pengelolaan DAS yang berkelanjutan.' },
  { icon: 'fa-scale-balanced', box: 'bg-orange-100 text-orange-500', title: 'Tata Kelola', text: 'Keputusan transparan dan akuntabel berbasis data terintegrasi.' },
]

const metrics = computed(() => [
  { icon: 'fa-video', value: String(stats.value?.cameras.total ?? 42), label: 'Titik CCTV Terpantau', note: 'Data real-time' },
  { icon: 'fa-wifi', value: String(stats.value?.sensors.total ?? 28), label: 'Sensor IoT Terpasang', note: 'Data real-time' },
  { icon: 'fa-map', value: String(districts.value.length || 11), label: 'Kecamatan Tercakup', note: 'Data real-time' },
  { icon: 'fa-clock', value: '24/7', label: 'Pemantauan Tanpa Henti', note: 'Layanan sistem' },
  { icon: 'fa-stopwatch', value: '< 5 mnt', label: 'Waktu Peringatan Dini', note: 'Target sistem' },
  { icon: 'fa-bullseye', value: '60%', label: 'Percepatan Respons', note: 'Target implementasi' },
])
</script>

<template>
  <div>
    <!-- Hero Section -->
    <LandingPageHero
      badge="MANFAAT AIRA"
      description="AIRA membantu pemerintah daerah, petugas, dan masyarakat Kabupaten Surnenep bergerak lebih cepat dan tepat — sebelum, saat, dan setelah banjir terjadi."
    >
      <template #title>Dampak Nyata untuk<br />Daerah yang<br /><span class="text-primary">Lebih Tangguh</span></template>
      <template #actions>
        <a href="#matriks" class="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition">
          Lihat Matriks Strategi <i class="fa-solid fa-arrow-down"></i>
        </a>
      </template>

      <img
        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"
        alt="Masyarakat dan banjir"
        class="rounded-2xl shadow-xl w-full h-[400px] object-cover image-grayscale"
      />
      <div class="absolute bottom-8 left-2 sm:-left-8 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 w-64 animate-float">
        <div class="text-[10px] text-slate-500 font-semibold mb-3">Ringkasan Manfaat</div>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-bolt text-xs"></i></div>
            <div class="text-xs font-bold text-slate-800">Respons lebih cepat</div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-shield-halved text-xs"></i></div>
            <div class="text-xs font-bold text-slate-800">Risiko lebih rendah</div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-users text-xs"></i></div>
            <div class="text-xs font-bold text-slate-800">Masyarakat lebih aman</div>
          </div>
        </div>
      </div>
    </LandingPageHero>

    <!-- Matriks Strategi 3x3 -->
    <section id="matriks" class="py-20 bg-white scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LandingSplitHeader badge="MATRIKS STRATEGI">
          Manfaat di Setiap Fase<br />untuk Setiap Pemangku Kepentingan
          <template #description>
            Matriks 3x3 berikut memetakan manfaat AIRA bagi tiga aktor utama — pemerintah daerah, petugas lapangan, dan masyarakat — pada
            tiga fase penanganan banjir.
          </template>
        </LandingSplitHeader>

        <!-- Header kolom (desktop) -->
        <div class="hidden lg:grid grid-cols-[200px_repeat(3,1fr)] gap-4 mb-4">
          <div></div>
          <div v-for="p in phases" :key="p.key" class="rounded-xl border px-4 py-3 flex items-center gap-3" :class="p.head">
            <i class="fa-solid" :class="p.icon"></i>
            <div>
              <div class="text-sm font-bold">{{ p.title }}</div>
              <div class="text-[10px] opacity-80 font-medium">{{ p.subtitle }}</div>
            </div>
          </div>
        </div>

        <div class="space-y-6 lg:space-y-4">
          <div v-for="a in matrix" :key="a.title" class="grid lg:grid-cols-[200px_repeat(3,1fr)] gap-4">
            <!-- Aktor -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 flex lg:flex-col items-center lg:items-start lg:justify-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="a.box">
                <i class="fa-solid" :class="a.icon"></i>
              </div>
              <div class="font-bold text-slate-900 text-sm">{{ a.title }}</div>
            </div>
            <!-- Sel -->
            <div
              v-for="p in phases"
              :key="p.key"
              class="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition"
            >
              <div class="lg:hidden text-[10px] font-bold uppercase tracking-wider mb-2" :class="p.head.split(' ')[1]">{{ p.title }}</div>
              <div class="flex items-center gap-2 mb-2">
                <i class="fa-solid text-primary text-sm w-4 text-center" :class="a.cells[p.key].icon"></i>
                <h4 class="font-bold text-slate-900 text-sm">{{ a.cells[p.key].title }}</h4>
              </div>
              <p class="text-xs text-slate-500 leading-relaxed">{{ a.cells[p.key].text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dampak -->
    <section class="py-20 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative">
            <img
              src="https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=800&auto=format&fit=crop"
              alt="Sungai"
              class="rounded-2xl shadow-xl w-full h-96 object-cover image-grayscale"
            />
            <div class="absolute bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-xs flex gap-3 items-start">
              <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                <i class="fa-solid fa-quote-left text-xs"></i>
              </div>
              <p class="text-[10px] text-slate-600 leading-relaxed font-medium">
                Setiap menit lebih awal dalam peringatan dini berarti lebih banyak warga yang terlindungi.
              </p>
            </div>
          </div>
          <div>
            <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">DAMPAK</div>
            <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">Dampak Berlapis bagi Daerah</h2>
            <p class="text-slate-600 leading-relaxed mb-8">
              Manfaat AIRA tidak berhenti pada peringatan dini. Data yang terintegrasi menghasilkan dampak ekonomi, sosial, lingkungan, dan tata
              kelola yang saling menguatkan.
            </p>
            <div class="grid sm:grid-cols-2 gap-4">
              <div v-for="d in impacts" :key="d.title" class="bg-white p-5 rounded-xl border border-slate-100 flex gap-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="d.box">
                  <i class="fa-solid" :class="d.icon"></i>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 text-sm mb-1">{{ d.title }}</h4>
                  <p class="text-xs text-slate-500 leading-relaxed">{{ d.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Metrics -->
    <section class="py-24 bg-darkbg text-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="inline-block bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider border border-blue-500/30">
            METRIK &amp; CAPAIAN
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold leading-tight mb-4">Terukur, Transparan, dan Berkelanjutan</h2>
          <p class="text-slate-400 leading-relaxed">Angka cakupan diambil langsung dari data sistem; target menunjukkan sasaran implementasi AIRA.</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div v-for="m in metrics" :key="m.label" class="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <i class="fa-solid text-blue-400 text-xl mb-3" :class="m.icon"></i>
            <div class="text-2xl font-extrabold">{{ m.value }}</div>
            <div class="text-[11px] text-slate-300 font-semibold mt-1">{{ m.label }}</div>
            <div class="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">{{ m.note }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <LandingCTASection
      badge="MANFAAT AIRA"
      description="Wujudkan sistem peringatan dini yang memberi manfaat nyata bagi seluruh pemangku kepentingan."
      :primary="{ label: 'Akses Dashboard', to: '/dashboard' }"
      :secondary="{ label: 'Hubungi Kami', to: '#kontak' }"
    >
      Satu Platform,<br />Manfaat untuk Semua
    </LandingCTASection>
  </div>
</template>
