<script setup lang="ts">
import type { Status } from '~/types'

const props = withDefaults(defineProps<{ status: Status; variant?: 'soft' | 'solid'; label?: string }>(), {
  variant: 'soft',
  label: undefined,
})

const meta = computed(() => statusMeta(props.status))
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
    :class="variant === 'solid' ? meta.solid : meta.soft"
  >
    <span v-if="variant === 'soft'" class="w-1.5 h-1.5 rounded-full" :class="meta.dot"></span>
    {{ label ?? meta.label }}
  </span>
</template>
