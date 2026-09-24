<script setup lang="ts">
const route = useRoute()
const dark = computed(() => route.meta.theme === 'dark')
const fullBleed = computed(() => route.meta.fullBleed === true)
</script>

<template>
  <div
    class="font-sans antialiased overflow-hidden h-screen flex"
    :class="dark ? 'text-slate-300 bg-darkbg' : 'text-slate-800 bg-slate-100'"
  >
    <LayoutSidebar :dark="dark" />

    <!-- Konten peta layar penuh: halaman mengatur topbar & panelnya sendiri -->
    <div v-if="fullBleed" class="flex-1 flex h-full min-w-0 overflow-hidden relative">
      <slot />
    </div>

    <main v-else class="flex-1 flex flex-col h-full overflow-hidden min-w-0">
      <LayoutTopbar :dark="dark" />
      <div class="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
