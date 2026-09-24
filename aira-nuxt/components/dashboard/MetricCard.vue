<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    iconBox: string
    label: string
    value: number | string
    loading?: boolean
  }>(),
  { loading: false },
)
</script>

<template>
  <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="iconBox">
      <i class="fa-solid text-xl" :class="icon"></i>
    </div>
    <div class="min-w-0 flex-1">
      <div class="text-[10px] text-slate-500 font-semibold mb-0.5">{{ label }}</div>
      <template v-if="loading">
        <UiSkeleton class="h-7 w-12 my-0.5" />
        <UiSkeleton class="h-3 w-20 mt-1" />
      </template>
      <template v-else>
        <div class="text-2xl font-extrabold text-slate-900">{{ value }}</div>
        <div class="text-[10px] font-medium flex items-center gap-1 mt-0.5">
          <slot />
        </div>
      </template>
    </div>
  </div>
</template>
