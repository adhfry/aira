<script setup lang="ts">
/** Satu baris fitur (nomor, judul, deskripsi, checklist, tombol) + slot mockup. */
withDefaults(
  defineProps<{
    number: string
    title: string
    description: string
    points: string[]
    cta: { label: string; to: string }
    reverse?: boolean
    tinted?: boolean
  }>(),
  { reverse: false, tinted: false },
)
</script>

<template>
  <section class="py-12" :class="tinted ? 'bg-slate-50 border-t border-slate-200' : 'bg-white'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Text -->
        <div :class="{ 'lg:order-2': reverse }">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{{ number }}</div>
            <h3 class="text-2xl font-bold text-slate-900">{{ title }}</h3>
          </div>
          <p class="text-slate-600 text-sm mb-6 leading-relaxed">{{ description }}</p>
          <ul class="space-y-3 mb-8">
            <li v-for="p in points" :key="p" class="flex items-center gap-3 text-sm text-slate-700">
              <i class="fa-solid fa-check-circle text-blue-500"></i> {{ p }}
            </li>
          </ul>
          <NuxtLink :to="cta.to" class="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition">
            {{ cta.label }} <i class="fa-solid fa-plus text-xs"></i>
          </NuxtLink>
        </div>

        <!-- Mockup -->
        <div :class="{ 'lg:order-1': reverse }">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
