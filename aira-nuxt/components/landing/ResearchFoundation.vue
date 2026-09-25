<script setup lang="ts">
const foundations = [
  {
    no: 'Fondasi 1',
    ref: REFERENCES[0]!,
    icon: 'fa-building-columns',
    box: 'bg-blue-50 text-primary',
    points: ['Mixed methods: hidrologi, evaluasi drainase, GIS, kebijakan, observasi lapangan', 'Mengidentifikasi 6 titik kritis banjir perkotaan'],
  },
  {
    no: 'Fondasi 2',
    ref: REFERENCES[1]!,
    icon: 'fa-diagram-project',
    box: 'bg-purple-50 text-purple-600',
    points: ['Pemodelan SWMM jaringan drainase Kota Sumenep', '6 dari 8 outlet tidak mampu menampung debit rencana kala ulang 5 tahun'],
  },
  {
    no: 'Fondasi 3',
    ref: REFERENCES[2]!,
    icon: 'fa-bridge-water',
    box: 'bg-sky-50 text-sky-600',
    points: ['Koordinat hulu–hilir Sungai Marengan', 'Dasar lapisan pemantauan sungai & deteksi backwater'],
  },
]
</script>

<template>
  <section id="landasan" class="py-20 bg-white scroll-mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandingSplitHeader badge="LANDASAN ILMIAH · STUDI KASUS SUMENEP">
        Dibangun di Atas Kajian<br />Banjir Kota Sumenep
        <template #description>
          AIRA tidak memasang titik pantau secara acak. Zona risiko, jaringan outlet drainase, dan pengaruh backwater Sungai Marengan diturunkan dari
          kajian daerah — lalu diperkaya data real-time CCTV dan sensor untuk menghasilkan risiko banjir dinamis.
        </template>
      </LandingSplitHeader>

      <!-- Tiga fondasi -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <a
          v-for="f in foundations"
          :key="f.no"
          :href="f.ref.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition flex flex-col"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" :class="f.box"><i class="fa-solid" :class="f.icon"></i></div>
            <div>
              <div class="text-[10px] font-bold text-primary tracking-wider uppercase">{{ f.no }}</div>
              <div class="text-sm font-bold text-slate-900">{{ f.ref.short }}</div>
            </div>
          </div>
          <h3 class="text-sm font-bold text-slate-800 mb-3 leading-snug">{{ f.ref.title }}</h3>
          <ul class="space-y-2 text-xs text-slate-600 flex-1">
            <li v-for="p in f.points" :key="p" class="flex gap-2"><i class="fa-solid fa-check-circle text-blue-500 mt-0.5"></i> {{ p }}</li>
          </ul>
          <span class="text-xs font-semibold text-primary mt-4 group-hover:underline">Buka sumber <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></span>
        </a>
      </div>

      <!-- Faktor penyebab -->
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-12">
        <div class="text-xs font-bold text-slate-800 mb-1">Faktor penyebab banjir perkotaan (BRIDA–ITS, 2026)</div>
        <p class="text-[11px] text-slate-500 mb-5">Banjir bukan akibat hujan semata, melainkan interaksi beberapa faktor berikut:</p>
        <div class="flex flex-wrap items-center gap-2">
          <template v-for="(f, i) in FLOOD_FACTORS" :key="f.label">
            <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-2 pr-3 py-1.5">
              <span class="w-6 h-6 rounded-full bg-blue-50 text-primary flex items-center justify-center text-[10px]"><i class="fa-solid" :class="f.icon"></i></span>
              <span class="text-[11px] font-semibold text-slate-700">{{ f.label }}</span>
            </div>
            <i v-if="i < FLOOD_FACTORS.length - 1" class="fa-solid fa-plus text-slate-300 text-[10px]"></i>
          </template>
          <i class="fa-solid fa-arrow-right text-slate-400 mx-1"></i>
          <div class="flex items-center gap-2 bg-red-500 text-white rounded-full px-4 py-1.5 text-[11px] font-bold shadow-md shadow-red-500/30">
            <i class="fa-solid fa-house-flood-water"></i> Banjir Perkotaan
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-5 gap-6">
        <!-- Titik kritis & DAS -->
        <div class="lg:col-span-2 space-y-6">
          <div class="border border-slate-200 rounded-2xl p-6">
            <div class="text-xs font-bold text-slate-800 mb-4"><i class="fa-solid fa-triangle-exclamation text-red-500 mr-1"></i> 6 Titik Kritis (BRIDA–ITS)</div>
            <ol class="space-y-2.5">
              <li v-for="(c, i) in CRITICAL_AREAS" :key="c" class="flex items-center gap-3 text-sm text-slate-700">
                <span class="w-6 h-6 rounded-full bg-red-50 text-red-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{{ i + 1 }}</span>
                {{ c }}
              </li>
            </ol>
          </div>
          <div class="border border-slate-200 rounded-2xl p-6">
            <div class="text-xs font-bold text-slate-800 mb-4"><i class="fa-solid fa-water text-primary mr-1"></i> 3 DAS Utama Perkotaan</div>
            <div class="space-y-3">
              <div v-for="d in DAS_LIST" :key="d.name">
                <div class="flex justify-between text-xs mb-1">
                  <span class="font-semibold text-slate-700">DAS {{ d.name }}</span>
                  <span class="font-bold text-slate-900">Q10 ±{{ d.q10 }} m³/s</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-primary h-1.5 rounded-full" :style="{ width: `${(d.q10 / 343) * 100}%` }"></div></div>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 mt-3">Debit rencana melampaui kapasitas drainase eksisting (pemberitaan hasil kajian BRIDA–ITS).</p>
          </div>
        </div>

        <!-- 8 Outlet -->
        <div class="lg:col-span-3 border border-slate-200 rounded-2xl p-6">
          <div class="text-xs font-bold text-slate-800 mb-1"><i class="fa-solid fa-diagram-project text-purple-600 mr-1"></i> 8 Outlet Drainase Kota Sumenep</div>
          <p class="text-[11px] text-slate-500 mb-4">Resmani dkk. (2017) — kapasitas &amp; status pada debit rencana kala ulang 5 tahun, serta panjang pengaruh backwater Sungai Marengan.</p>
          <div class="overflow-x-auto -mx-2">
            <table class="w-full text-xs min-w-[520px]">
              <thead>
                <tr class="text-left text-[10px] uppercase tracking-wider text-slate-400">
                  <th class="px-2 py-2 font-bold">Outlet</th>
                  <th class="px-2 py-2 font-bold">Jalur jaringan</th>
                  <th class="px-2 py-2 font-bold text-right">Kapasitas</th>
                  <th class="px-2 py-2 font-bold">Status</th>
                  <th class="px-2 py-2 font-bold text-right">Backwater</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="o in OUTLETS" :key="o.no">
                  <td class="px-2 py-2 font-bold text-slate-800">{{ o.no }}</td>
                  <td class="px-2 py-2 text-slate-600">{{ o.network }}</td>
                  <td class="px-2 py-2 text-right tabular-nums text-slate-700">{{ o.capacity.toLocaleString('id-ID') }} m³/s</td>
                  <td class="px-2 py-2">
                    <UiBadge :tone="o.flooded ? 'red' : 'green'">{{ o.flooded ? 'Tergenang' : 'Cukup' }}</UiBadge>
                  </td>
                  <td class="px-2 py-2 text-right tabular-nums" :class="o.backwater ? 'text-sky-600 font-semibold' : 'text-slate-300'">
                    {{ o.backwater ? `±${o.backwater.toLocaleString('id-ID')} m` : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p class="text-[11px] text-slate-400 mt-6 flex gap-2">
        <i class="fa-solid fa-circle-info mt-0.5"></i>
        Koridor zona AIRA mengikuti geometri jalan &amp; Kali Marengan dari OpenStreetMap sesuai nama jalan dalam penelitian; titik pantau ditempatkan
        pada lokasi bersumber (data resmi Kemendikdasmen, koordinat penelitian, objek OSM, dan alamat terdaftar).
      </p>
    </div>
  </section>
</template>
