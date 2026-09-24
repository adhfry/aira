<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

withDefaults(
  defineProps<{ variant?: Variant; type?: 'button' | 'submit'; loading?: boolean; disabled?: boolean; icon?: string }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false, icon: undefined },
)

const variants: Record<Variant, string> = {
  primary: 'bg-primary hover:bg-blue-700 text-white shadow-md shadow-blue-500/30',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/30',
  ghost: 'text-slate-600 hover:bg-slate-100',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
    :class="variants[variant]"
  >
    <i v-if="loading" class="fa-solid fa-spinner fa-spin text-xs"></i>
    <i v-else-if="icon" class="fa-solid text-xs" :class="icon"></i>
    <slot />
  </button>
</template>
