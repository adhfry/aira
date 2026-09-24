<script setup lang="ts">
/**
 * Logo AIRA (berwarna asli).
 * `variant` mengikuti ukuran di referensi: navbar (w-10), sidebar (w-8), footer (w-8, tanpa subjudul).
 */
withDefaults(
  defineProps<{ variant?: 'navbar' | 'sidebar' | 'footer'; dark?: boolean }>(),
  { variant: 'navbar', dark: false },
)
</script>

<template>
  <div v-if="variant === 'footer'" class="flex items-center justify-center gap-2">
    <img src="/aira-mark.png" alt="Logo AIRA" class="w-8 h-8 object-contain" width="32" height="32" />
    <span class="font-extrabold text-white tracking-tight">AIRA</span>
  </div>

  <div v-else-if="variant === 'sidebar'" class="flex items-center gap-2.5">
    <img src="/aira-mark.png" alt="Logo AIRA" class="w-9 h-9 object-contain flex-shrink-0" width="36" height="36" />
    <div class="leading-none">
      <span class="font-extrabold text-xl tracking-tight text-white block leading-none">AIRA</span>
      <span class="block mt-1 text-[9px] leading-[1.2] text-slate-400 font-medium tracking-wide">Artificial Intelligence<br />Respons Banjir</span>
    </div>
  </div>

  <div v-else class="flex items-center gap-2">
    <img src="/aira-mark.png" alt="Logo AIRA" class="w-10 h-10 object-contain flex-shrink-0" width="40" height="40" />
    <div class="leading-none">
      <span class="font-extrabold text-xl tracking-tight block leading-none" :class="dark ? 'text-white' : 'text-slate-900'">AIRA</span>
      <span class="block mt-1 text-[10px] leading-[1.2] font-medium tracking-wide" :class="dark ? 'text-slate-400' : 'text-slate-500'">
        Artificial Intelligence<br />Response Banjir
      </span>
    </div>
  </div>
</template>
