<script setup lang="ts">
const { toasts, dismiss } = useToast()

const styles = {
  success: { icon: 'fa-circle-check', box: 'bg-green-50 border-green-200 text-green-800', iconColor: 'text-green-500' },
  error: { icon: 'fa-circle-xmark', box: 'bg-red-50 border-red-200 text-red-800', iconColor: 'text-red-500' },
  info: { icon: 'fa-circle-info', box: 'bg-blue-50 border-blue-200 text-blue-800', iconColor: 'text-primary' },
} as const
</script>

<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-x-4"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        role="status"
        class="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg text-sm font-medium"
        :class="styles[t.type].box"
      >
        <i class="fa-solid mt-0.5" :class="[styles[t.type].icon, styles[t.type].iconColor]"></i>
        <span class="flex-1">{{ t.message }}</span>
        <button class="opacity-60 hover:opacity-100 transition" aria-label="Tutup" @click="dismiss(t.id)">
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
