<script setup lang="ts">
withDefaults(defineProps<{ title: string; subtitle?: string; linkTo?: string }>(), { subtitle: undefined, linkTo: undefined })
</script>

<template>
  <div class="flex justify-between items-center gap-3 mb-4">
    <div class="min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-slate-800 text-sm">{{ title }}</h3>
        <slot name="badge" />
      </div>
      <p v-if="subtitle" class="text-[10px] text-slate-500">{{ subtitle }}</p>
    </div>
    <div class="flex items-center gap-2 flex-shrink-0">
      <slot />
      <NuxtLink v-if="linkTo" :to="linkTo" class="text-[10px] text-primary font-semibold hover:underline whitespace-nowrap">
        Lihat Semua <i class="fa-solid fa-arrow-right text-[8px]"></i>
      </NuxtLink>
    </div>
  </div>
</template>
