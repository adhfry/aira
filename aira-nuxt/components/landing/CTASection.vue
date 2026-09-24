<script setup lang="ts">
interface CtaAction {
  label: string
  to: string
  icon?: string
}

withDefaults(
  defineProps<{
    badge: string
    description: string
    primary: CtaAction
    secondary?: CtaAction
  }>(),
  { secondary: undefined },
)
</script>

<template>
  <section class="py-24 cta-bg text-white text-center">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="inline-block bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wider backdrop-blur-sm">
        {{ badge }}
      </div>
      <h2 class="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
        <slot />
      </h2>
      <p class="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
        {{ description }}
      </p>
      <div :class="secondary ? 'flex flex-wrap justify-center gap-4' : ''">
        <NuxtLink
          :to="primary.to"
          class="bg-primary hover:bg-blue-600 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition inline-flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          {{ primary.label }} <i class="fa-solid" :class="primary.icon ?? 'fa-arrow-right'"></i>
        </NuxtLink>
        <NuxtLink
          v-if="secondary"
          :to="secondary.to"
          class="bg-transparent hover:bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition"
        >
          {{ secondary.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
