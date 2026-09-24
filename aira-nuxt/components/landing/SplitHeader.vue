<script setup lang="ts">
/** Header section grid 2 kolom (lg:grid-cols-2 … items-end) seperti di halaman Tentang/Fitur/Teknologi. */
withDefaults(defineProps<{ badge: string; spacing?: string }>(), { spacing: 'mb-12' })
</script>

<template>
  <div class="grid lg:grid-cols-2 gap-6 lg:gap-12 items-end" :class="spacing">
    <div>
      <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">{{ badge }}</div>
      <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
        <slot />
      </h2>
    </div>
    <div>
      <p class="text-slate-600 leading-relaxed">
        <slot name="description" />
      </p>
    </div>
  </div>
</template>
