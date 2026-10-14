<script setup lang="ts">
const { camera, close } = useCameraModal()
const closeBtn = ref<HTMLButtonElement>()
let returnFocus: HTMLElement | null = null

watch(camera, async (c, prev) => {
  if (c && !prev) {
    returnFocus = document.activeElement as HTMLElement | null
    await nextTick()
    closeBtn.value?.focus()
  } else if (!c && prev) {
    returnFocus?.focus?.()
  }
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && camera.value) close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-if="camera" class="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6">
        <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" @click="close"></div>
        <div
          role="dialog"
          aria-modal="true"
          :aria-label="`CCTV ${camera.code} ${camera.name}`"
          class="relative w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[94vh]"
        >
          <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800">
            <div class="min-w-0">
              <div class="text-[11px] font-bold text-slate-400">{{ camera.code }} · Titik pantau usulan</div>
              <h3 class="font-bold text-white truncate">{{ camera.name }}</h3>
            </div>
            <button
              ref="closeBtn"
              type="button"
              class="w-10 h-10 flex-shrink-0 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
              aria-label="Tutup"
              @click="close"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Rekaman berputar terus (bisu, berulang); kontrol tersedia untuk layar penuh. -->
          <div class="relative bg-black aspect-video">
            <video
              v-if="camera.videoUrl"
              :key="camera.id"
              :src="camera.videoUrl"
              :poster="camera.imageUrl"
              autoplay
              muted
              loop
              playsinline
              controls
              disablepictureinpicture
              class="w-full h-full object-contain"
            ></video>
            <img v-else :src="camera.imageUrl" :alt="camera.name" class="w-full h-full object-contain" />
          </div>

          <div class="px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300 overflow-y-auto">
            <UiStatusPill :status="camera.status" variant="solid" />
            <span v-if="camera.recordedAt" class="tabular-nums"><i class="fa-solid fa-video text-red-500 mr-1"></i>Rekaman {{ recordedLabel(camera.recordedAt) }}</span>
            <span><i class="fa-solid fa-location-dot text-slate-500 mr-1"></i>{{ camera.location }} · {{ camera.district }}</span>
            <span class="tabular-nums text-slate-400">{{ camera.lat.toFixed(6) }}, {{ camera.lng.toFixed(6) }}</span>
            <div v-if="camera.gallery?.length" class="flex gap-2 ml-auto">
              <a
                v-for="g in camera.gallery"
                :key="g.url"
                v-tippy="g.caption"
                :href="g.url"
                target="_blank"
                rel="noopener"
                class="block w-20 h-14 rounded overflow-hidden border border-slate-600 hover:border-white transition"
                :aria-label="g.caption"
              >
                <img :src="g.url" alt="" class="w-full h-full object-cover" loading="lazy" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
