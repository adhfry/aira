<script setup lang="ts">
import type { CrudField } from '~/types/crud'

const props = defineProps<{ field: CrudField; error?: string }>()
const model = defineModel<string | number | boolean | undefined>()

const id = computed(() => `field-${props.field.key}`)
const base =
  'w-full bg-slate-50 border text-slate-800 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition placeholder-slate-400'
const border = computed(() => (props.error ? 'border-red-300 bg-red-50/50' : 'border-slate-200'))
</script>

<template>
  <div :class="field.full ? 'sm:col-span-2' : ''">
    <label v-if="field.type !== 'checkbox'" :for="id" class="block text-xs font-semibold text-slate-700 mb-1.5">
      {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
    </label>

    <select v-if="field.type === 'select'" :id="id" v-model="model" :class="[base, border]">
      <option value="" disabled>Pilih {{ field.label.toLowerCase() }}…</option>
      <option v-for="o in field.options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <textarea
      v-else-if="field.type === 'textarea'"
      :id="id"
      v-model="model as string"
      rows="3"
      :placeholder="field.placeholder"
      :class="[base, border]"
    ></textarea>

    <label v-else-if="field.type === 'checkbox'" :for="id" class="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 cursor-pointer mt-5">
      <span class="text-sm font-semibold text-slate-700">{{ field.label }}</span>
      <span class="relative inline-flex items-center">
        <input :id="id" v-model="model" type="checkbox" class="sr-only peer" />
        <span class="w-10 h-6 bg-slate-300 rounded-full peer-checked:bg-primary transition"></span>
        <span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition peer-checked:translate-x-4"></span>
      </span>
    </label>

    <input
      v-else-if="field.type === 'number'"
      :id="id"
      v-model.number="model"
      type="number"
      :min="field.min"
      :max="field.max"
      :step="field.step ?? 'any'"
      :placeholder="field.placeholder"
      :class="[base, border]"
    />

    <input
      v-else
      :id="id"
      v-model="model as string"
      :type="field.type === 'datetime' ? 'datetime-local' : field.type === 'tags' ? 'text' : field.type"
      :placeholder="field.placeholder"
      :class="[base, border]"
    />

    <p v-if="error" class="text-[11px] text-red-600 mt-1">{{ error }}</p>
    <p v-else-if="field.help" class="text-[11px] text-slate-400 mt-1">{{ field.help }}</p>
  </div>
</template>
