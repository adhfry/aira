<script setup lang="ts">
/** Header section dua kolom (badge + judul kiri, deskripsi kanan) seperti di referensi. */
withDefaults(defineProps<{ badge: string; description: string; spacing?: 'mb-12' | 'mb-16' }>(), { spacing: 'mb-12' })
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6" :class="spacing">
    <div class="max-w-2xl">
      <div class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">{{ badge }}</div>
      <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
        <slot />
      </h2>
    </div>
    <p class="text-slate-600 max-w-md text-sm leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>
