<script setup lang="ts">
withDefaults(
  defineProps<{ open: boolean; title?: string; message: string; confirmLabel?: string; loading?: boolean }>(),
  { title: 'Konfirmasi Hapus', confirmLabel: 'Ya, Hapus', loading: false },
)
const emit = defineEmits<{ close: []; confirm: [] }>()
</script>

<template>
  <UiModal :open="open" :title="title" size="sm" @close="emit('close')">
    <div class="flex flex-col items-center text-center gap-3">
      <div class="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
        <i class="fa-solid fa-triangle-exclamation text-2xl"></i>
      </div>
      <p class="text-sm text-slate-600 leading-relaxed">{{ message }}</p>
    </div>
    <template #footer>
      <UiButton variant="secondary" @click="emit('close')">Batal</UiButton>
      <UiButton variant="danger" icon="fa-trash" :loading="loading" @click="emit('confirm')">{{ confirmLabel }}</UiButton>
    </template>
  </UiModal>
</template>
