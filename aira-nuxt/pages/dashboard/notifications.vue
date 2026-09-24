<script setup lang="ts">
import type { Notification, NotificationStatus, NotificationType } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Notifikasi & Peringatan Dini - AIRA', description: 'Kelola notifikasi peringatan dini banjir.', robots: 'noindex' })

const crud = useNotifications()
const toast = useToast()

const TYPE_OPTIONS = (Object.keys(NOTIFICATION_TYPE_META) as NotificationType[]).map((v) => ({ value: v, label: NOTIFICATION_TYPE_META[v].label }))
const STATUS_OPTS = (Object.keys(NOTIFICATION_STATUS_META) as NotificationStatus[]).map((v) => ({ value: v, label: NOTIFICATION_STATUS_META[v].label }))

const columns: CrudColumn[] = [
  { key: 'title', label: 'Notifikasi', sortable: true },
  { key: 'type', label: 'Jenis', sortable: true },
  { key: 'recipients', label: 'Penerima' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Dibuat', sortable: true },
]

const fields: CrudField[] = [
  { key: 'title', label: 'Judul', type: 'text', required: true, full: true, placeholder: 'mis. Peringatan Dini Banjir - Kali Surnenep' },
  { key: 'type', label: 'Jenis', type: 'select', required: true, options: TYPE_OPTIONS },
  { key: 'status', label: 'Status', type: 'select', required: true, options: STATUS_OPTS },
  { key: 'recipients', label: 'Penerima', type: 'tags', required: true, full: true, placeholder: 'Petugas Lapangan, Masyarakat Kota Surnenep', help: 'Pisahkan beberapa penerima dengan koma.' },
  { key: 'message', label: 'Pesan', type: 'textarea', required: true, full: true },
]

const filters: CrudFilter[] = [
  { key: 'type', label: 'Jenis', options: TYPE_OPTIONS },
  { key: 'status', label: 'Status', options: STATUS_OPTS },
]

const defaults = (): FormModel => ({ title: '', type: 'peringatan', status: 'draft', recipients: '', message: '' })
const toForm = (n: Notification): FormModel => ({ title: n.title, type: n.type, status: n.status, recipients: n.recipients.join(', '), message: n.message })
const toPayload = (f: FormModel) => ({
  title: f.title,
  type: f.type,
  status: f.status,
  message: f.message,
  recipients: String(f.recipients ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
})

const sendingId = ref<string | null>(null)
async function send(n: Notification) {
  sendingId.value = n.id
  try {
    await crud.update(n.id, { status: 'terkirim' })
    toast.success(`Notifikasi “${n.title}” terkirim ke ${n.recipients.length} grup penerima.`)
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Gagal mengirim notifikasi.'))
  } finally {
    sendingId.value = null
  }
}

const summary = computed(() => {
  const items = crud.items.value
  const count = (s: NotificationStatus) => items.filter((n) => n.status === s).length
  return [
    { label: 'Total Notifikasi', value: items.length, icon: 'fa-bell', box: 'bg-blue-50 text-primary' },
    { label: 'Terkirim', value: count('terkirim'), icon: 'fa-paper-plane', box: 'bg-green-50 text-green-600' },
    { label: 'Draft', value: count('draft'), icon: 'fa-file-pen', box: 'bg-slate-100 text-slate-500' },
    { label: 'Gagal', value: count('gagal'), icon: 'fa-circle-xmark', box: 'bg-red-50 text-red-500' },
  ]
})
</script>

<template>
  <CrudPage
    title="Notifikasi & Peringatan Dini"
    subtitle="Susun dan kirim peringatan ke petugas dan masyarakat."
    icon="fa-bell"
    entity="Notifikasi"
    search-placeholder="Cari judul, pesan, atau penerima…"
    :items="crud.items.value"
    :pending="crud.pending.value"
    :error="crud.error.value"
    :columns="columns"
    :fields="fields"
    :filters="filters"
    :defaults="defaults"
    :to-form="toForm"
    :to-payload="toPayload"
    :item-label="(n) => n.title"
    :create="crud.create"
    :update="crud.update"
    :remove="crud.remove"
    :refresh="crud.refresh"
  >
    <template #summary><CrudSummaryCards :cards="summary" /></template>

    <template #cell-title="{ item }">
      <div class="min-w-[260px] max-w-md">
        <div class="font-bold text-slate-800">{{ item.title }}</div>
        <div class="text-[11px] text-slate-500 line-clamp-2">{{ item.message }}</div>
      </div>
    </template>
    <template #cell-type="{ item }">
      <UiBadge :tone="NOTIFICATION_TYPE_META[item.type].tone">{{ NOTIFICATION_TYPE_META[item.type].label }}</UiBadge>
    </template>
    <template #cell-recipients="{ item }">
      <div class="flex flex-wrap gap-1 max-w-[220px]">
        <span v-for="r in item.recipients" :key="r" class="tech-tag">{{ r }}</span>
      </div>
    </template>
    <template #cell-status="{ item }">
      <UiBadge :tone="NOTIFICATION_STATUS_META[item.status].tone">{{ NOTIFICATION_STATUS_META[item.status].label }}</UiBadge>
    </template>
    <template #cell-createdAt="{ item }"><span class="text-[11px] text-slate-500 whitespace-nowrap">{{ formatDateTime(item.createdAt) }}</span></template>

    <template #row-actions="{ item }">
      <button
        v-if="item.status !== 'terkirim'"
        class="w-8 h-8 rounded-lg text-slate-500 hover:bg-green-50 hover:text-green-600 transition disabled:opacity-50"
        :aria-label="`Kirim ${item.title}`"
        title="Kirim sekarang"
        :disabled="sendingId === item.id"
        @click="send(item)"
      >
        <i class="fa-solid text-xs" :class="sendingId === item.id ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
      </button>
    </template>
  </CrudPage>
</template>
