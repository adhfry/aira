<script setup lang="ts">
export type BadgeTone = 'slate' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple'

withDefaults(defineProps<{ tone?: BadgeTone }>(), { tone: 'slate' })

const tones: Record<BadgeTone, string> = {
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-blue-50 text-primary',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
}
</script>

<template>
  <span class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap" :class="tones[tone]">
    <slot />
  </span>
</template>
