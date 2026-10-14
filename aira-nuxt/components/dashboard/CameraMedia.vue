<script setup lang="ts">
import type { Camera } from '~/types'

/**
 * Tampilan kamera: rekaman titik pantau (video bisu, berulang) bila ada dan diminta diputar,
 * selain itu foto titik. Poster video = foto, jadi tidak ada layar kosong saat video dimuat.
 */
const props = withDefaults(defineProps<{ camera: Camera; play?: boolean; alt?: string }>(), { play: false, alt: '' })
const showVideo = computed(() => props.play && !!props.camera.videoUrl)
</script>

<template>
  <video
    v-if="showVideo"
    :key="camera.id"
    :src="camera.videoUrl"
    :poster="camera.imageUrl"
    autoplay
    muted
    loop
    playsinline
    preload="metadata"
    disablepictureinpicture
    :aria-label="alt || `Rekaman titik pantau ${camera.name}`"
  ></video>
  <img v-else :src="camera.imageUrl" :alt="alt || camera.name" loading="lazy" />
</template>
