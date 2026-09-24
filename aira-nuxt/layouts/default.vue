<script setup lang="ts">
const route = useRoute()
const darkNav = computed(() => route.meta.navbar === 'dark')
const bodyBg = computed(() => (route.path === '/' ? 'bg-slate-50' : 'bg-white'))
</script>

<template>
  <div class="font-sans text-slate-800 antialiased overflow-x-hidden min-h-screen" :class="bodyBg">
    <LayoutNavbar :dark="darkNav" />
    <main>
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
