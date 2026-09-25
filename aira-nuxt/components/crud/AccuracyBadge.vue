<script setup lang="ts">
import type { CoordAccuracy } from '~/types'

const props = defineProps<{ value: CoordAccuracy }>()
const meta = computed(() => COORD_ACCURACY_META[props.value] ?? COORD_ACCURACY_META.osm)
</script>

<template>
  <span :title="meta.hint">
    <UiBadge :tone="meta.tone"><i class="fa-solid text-[8px]" :class="meta.icon"></i> {{ meta.label }}</UiBadge>
  </span>
</template>
