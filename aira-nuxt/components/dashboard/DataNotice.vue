<script setup lang="ts">
/** Transparansi data: mana yang berbasis penelitian, mana yang simulasi. */
const open = ref(false)
</script>

<template>
  <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-slate-700">
    <div class="flex items-start gap-3">
      <i class="fa-solid fa-flask text-primary mt-0.5"></i>
      <div class="flex-1">
        <b>Studi kasus Kota Sumenep.</b>
        Zona titik kritis &amp; outlet drainase berbasis kajian <b>BRIDA Sumenep × ITS (2026)</b> dan <b>Resmani dkk. (2017)</b>. Titik CCTV/sensor adalah
        <i>usulan AIRA</i>; nilai sensor, status, dan kejadian adalah <b>skenario simulasi hujan lebat</b>.
        <button class="text-primary font-semibold hover:underline ml-1" :aria-expanded="open" @click="open = !open">
          {{ open ? 'Tutup' : 'Rincian sumber' }}
        </button>
        <ul v-if="open" class="mt-2 space-y-1.5">
          <li v-for="r in REFERENCES" :key="r.key" class="flex gap-2">
            <i class="fa-solid fa-book-open text-slate-400 mt-0.5 text-[10px]"></i>
            <span>
              <a :href="r.url" target="_blank" rel="noopener noreferrer" class="font-semibold text-slate-800 hover:text-primary hover:underline">{{ r.short }}</a>
              — {{ r.role }}.
            </span>
          </li>
          <li class="flex gap-2 text-slate-500">
            <i class="fa-solid fa-location-dot text-slate-400 mt-0.5 text-[10px]"></i>
            <span>Koordinat setiap titik bersumber jelas: data resmi Kemendikdasmen, koordinat penelitian Sungai Marengan, geometri jalan/sungai OpenStreetMap, atau alamat terdaftar. Koridor zona digambar mengikuti jalan OSM yang disebut penelitian.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
