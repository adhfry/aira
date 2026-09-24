<script setup lang="ts">
const steps = [
  { icon: 'fa-download', color: 'bg-blue-500 shadow-blue-500/30', title: '1. Pengumpulan Data', text: 'CCTV, sensor, cuaca, GIS, laporan masyarakat' },
  { icon: 'fa-microchip', color: 'bg-purple-500 shadow-purple-500/30', title: '2. Analisis AI', text: 'Deteksi genangan, analisis risiko' },
  { icon: 'fa-bell', color: 'bg-red-500 shadow-red-500/30', title: '3. Peringatan Dini', text: 'Notifikasi ke petugas dan masyarakat' },
  { icon: 'fa-clipboard-check', color: 'bg-green-500 shadow-green-500/30', title: '4. Verifikasi Lapangan', text: 'Pengecekan dan konfirmasi kondisi' },
  { icon: 'fa-truck-medical', color: 'bg-orange-500 shadow-orange-500/30', title: '5. Respon', text: 'Tindakan penanganan di lapangan' },
  { icon: 'fa-file-invoice', color: 'bg-cyan-500 shadow-cyan-500/30', title: '6. Dokumentasi', text: 'Histori kejadian untuk pembelajaran sistem' },
]
</script>

<template>
  <section class="py-24 bg-slate-50 border-t border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandingSectionHeader
        badge="ALUR KERJA AIRA"
        spacing="mb-16"
        description="Proses terintegrasi untuk memastikan informasi banjir dapat ditindaklanjuti dengan cepat dan tepat."
      >
        Dari Data hingga Aksi Nyata
      </LandingSectionHeader>

      <!-- Steps -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-nowrap justify-between items-start gap-y-10 gap-4 relative">
        <template v-for="(s, i) in steps" :key="s.title">
          <div class="flex-1 flex flex-col items-center text-center relative z-10 w-full lg:w-auto">
            <div class="w-16 h-16 rounded-full text-white flex items-center justify-center text-xl shadow-lg mb-4" :class="s.color">
              <i class="fa-solid" :class="s.icon"></i>
            </div>
            <div class="text-xs font-bold text-slate-800 mb-1">{{ s.title }}</div>
            <div class="text-[10px] text-slate-500 max-w-[120px]">{{ s.text }}</div>
          </div>
          <!-- Arrow -->
          <div v-if="i < steps.length - 1" class="hidden lg:flex items-center justify-center pt-8 text-slate-300">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
