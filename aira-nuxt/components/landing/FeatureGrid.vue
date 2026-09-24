<script setup lang="ts">
const features = [
  { icon: 'fa-video', title: 'Pemantauan Real-time', text: 'Integrasi CCTV dan sensor IoT untuk memantau kondisi lapangan secara langsung.' },
  { icon: 'fa-brain', title: 'Deteksi Berbasis AI', text: 'Computer Vision untuk mendeteksi genangan dan perubahan kondisi air secara otomatis.' },
  { icon: 'fa-chart-bar', title: 'Analisis Risiko', text: 'Menggabungkan data multi-sumber untuk menghitung tingkat risiko banjir secara akurat.' },
  { icon: 'fa-bell', title: 'Peringatan Dini', text: 'Notifikasi otomatis kepada petugas dan masyarakat melalui berbagai kanal.' },
  { icon: 'fa-user-check', title: 'Verifikasi & Respon', text: 'Sistem verifikasi petugas dan pencatatan tindakan respon di lapangan.' },
  { icon: 'fa-database', title: 'Histori & Pembelajaran', text: 'Seluruh kejadian terdokumentasi untuk analisis dan peningkatan sistem.' },
]
</script>

<template>
  <section class="py-24 bg-slate-50 border-t border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandingSectionHeader
        badge="FITUR UTAMA"
        description="AIRA menyediakan alur kerja end-to-end untuk mendukung pemerintah dan masyarakat dalam menghadapi risiko banjir."
      >
        Solusi Lengkap dari Pemantauan hingga Respon
      </LandingSectionHeader>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="f in features" :key="f.title" class="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition duration-300">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center text-xl mb-4">
            <i class="fa-solid" :class="f.icon"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">{{ f.title }}</h3>
          <p class="text-slate-600 text-sm leading-relaxed">{{ f.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
