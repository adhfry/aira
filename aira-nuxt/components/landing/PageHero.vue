<script setup lang="ts">
/** Hero terang (hero-bg-light) untuk halaman Tentang, Fitur, dan Manfaat. */
defineProps<{ badge: string; description: string }>()
</script>

<template>
  <section class="pt-32 pb-16 lg:pt-40 lg:pb-24 hero-bg-light relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Content -->
        <div>
          <div class="inline-block bg-blue-100 text-primary text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wider">{{ badge }}</div>
          <h1 class="text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            <slot name="title" />
          </h1>
          <p class="text-slate-600 text-lg mb-8 max-w-lg leading-relaxed">
            {{ description }}
          </p>
          <slot name="actions" />
        </div>

        <!-- Right Visual -->
        <div class="relative">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
