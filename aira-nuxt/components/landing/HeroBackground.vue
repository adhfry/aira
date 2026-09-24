<script setup lang="ts">
/**
 * Latar hero: slider foto drone Sumenep (cross-fade) + overlay navy & radial biru.
 * Filter/overlay hanya diterapkan pada lapisan latar, sehingga teks & tombol tetap berwarna penuh.
 */
const props = withDefaults(defineProps<{ intervalMs?: number; overlayOpacity?: number }>(), {
  intervalMs: 6000,
  overlayOpacity: 0.78,
})

const images = ['/images/hero/sumenep-drone.jpg', '/images/hero/sumenep-drone-1.jpg']
const current = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => (current.value = (current.value + 1) % images.length), props.intervalMs)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="absolute inset-0 z-0" aria-hidden="true">
    <div
      v-for="(src, i) in images"
      :key="src"
      class="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
      :class="i === current ? 'opacity-100' : 'opacity-0'"
      :style="{ backgroundImage: `url('${src}')` }"
    ></div>
    <!-- Overlay navy agar teks tetap terbaca -->
    <div class="absolute inset-0 bg-darkbg" :style="{ opacity: overlayOpacity }"></div>
    <div
      class="absolute inset-0"
      style="
        background-image: radial-gradient(circle at top right, rgba(15, 98, 254, 0.28), transparent 50%),
          radial-gradient(circle at bottom left, rgba(15, 98, 254, 0.16), transparent 50%);
      "
    ></div>
  </div>
</template>
