<script setup lang="ts">
defineProps<{ cards: { label: string; value: number | string; icon: string; box: string }[] }>()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div v-for="c in cards" :key="c.label" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="c.box">
        <i class="fa-solid" :class="c.icon"></i>
      </div>
      <div class="min-w-0">
        <div class="text-[10px] text-slate-500 font-semibold truncate">{{ c.label }}</div>
        <div class="text-xl font-extrabold text-slate-900">{{ c.value }}</div>
      </div>
    </div>
  </div>
</template>
