<script setup lang="ts">
import type { User } from '~/types'
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Manajemen Petugas - AIRA', description: 'Kelola akun petugas dan administrator AIRA.', robots: 'noindex' })

const crud = useUsers()
const { options: districtOptions } = useDistrictOptions()

const ROLES = ['Administrator', 'Operator', 'Petugas Lapangan', 'Analis Data'].map((r) => ({ value: r, label: r }))
const STATUS = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'nonaktif', label: 'Nonaktif' },
]

const columns: CrudColumn[] = [
  { key: 'name', label: 'Petugas', sortable: true },
  { key: 'role', label: 'Peran', sortable: true },
  { key: 'phone', label: 'Telepon' },
  { key: 'district', label: 'Wilayah Tugas', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const fields = computed<CrudField[]>(() => [
  { key: 'name', label: 'Nama Lengkap', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true, placeholder: 'nama@sumenepkab.go.id' },
  { key: 'phone', label: 'Telepon / WhatsApp', type: 'tel', placeholder: '08xx-xxxx-xxxx' },
  { key: 'role', label: 'Peran', type: 'select', required: true, options: ROLES },
  { key: 'district', label: 'Wilayah Tugas', type: 'select', required: true, options: districtOptions.value },
  { key: 'status', label: 'Status Akun', type: 'select', required: true, options: STATUS },
  { key: 'avatarUrl', label: 'URL Foto Profil', type: 'url', full: true, placeholder: 'https://…' },
])

const filters = computed<CrudFilter[]>(() => [
  { key: 'role', label: 'Peran', options: ROLES },
  { key: 'status', label: 'Status', options: STATUS },
  { key: 'district', label: 'Wilayah', options: districtOptions.value },
])

const defaults = (): FormModel => ({ name: '', email: '', phone: '', role: 'Petugas Lapangan', district: '', status: 'aktif', avatarUrl: '' })
const toForm = (u: User): FormModel => ({ ...u })
const toPayload = (f: FormModel) => ({
  name: f.name,
  email: f.email,
  phone: f.phone ?? '',
  role: f.role,
  district: f.district,
  status: f.status,
  avatarUrl: f.avatarUrl || undefined,
})

const summary = computed(() => {
  const items = crud.items.value
  return [
    { label: 'Total Petugas', value: items.length, icon: 'fa-users', box: 'bg-blue-50 text-primary' },
    { label: 'Aktif', value: items.filter((u) => u.status === 'aktif').length, icon: 'fa-user-check', box: 'bg-green-50 text-green-600' },
    { label: 'Petugas Lapangan', value: items.filter((u) => u.role === 'Petugas Lapangan').length, icon: 'fa-person-hiking', box: 'bg-orange-50 text-orange-500' },
    { label: 'Administrator', value: items.filter((u) => u.role === 'Administrator').length, icon: 'fa-user-shield', box: 'bg-purple-50 text-purple-600' },
  ]
})
</script>

<template>
  <CrudPage
    title="Manajemen Petugas"
    subtitle="Akun administrator, operator, petugas lapangan, dan analis data."
    icon="fa-users"
    entity="Petugas"
    search-placeholder="Cari nama, email, atau telepon…"
    :items="crud.items.value"
    :pending="crud.pending.value"
    :error="crud.error.value"
    :columns="columns"
    :fields="fields"
    :filters="filters"
    :defaults="defaults"
    :to-form="toForm"
    :to-payload="toPayload"
    :item-label="(u) => u.name"
    :create="crud.create"
    :update="crud.update"
    :remove="crud.remove"
    :refresh="crud.refresh"
  >
    <template #summary><CrudSummaryCards :cards="summary" /></template>

    <template #cell-name="{ item }">
      <div class="flex items-center gap-3 min-w-[220px]">
        <img :src="item.avatarUrl" :alt="item.name" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" loading="lazy" />
        <div class="min-w-0">
          <div class="font-bold text-slate-800 truncate">{{ item.name }}</div>
          <div class="text-[11px] text-slate-500 truncate">{{ item.email }}</div>
        </div>
      </div>
    </template>
    <template #cell-role="{ item }">
      <UiBadge :tone="item.role === 'Administrator' ? 'purple' : item.role === 'Petugas Lapangan' ? 'orange' : 'blue'">{{ item.role }}</UiBadge>
    </template>
    <template #cell-phone="{ item }"><span class="text-xs text-slate-600 tabular-nums whitespace-nowrap">{{ item.phone || '-' }}</span></template>
    <template #cell-district="{ item }"><span class="text-slate-600 whitespace-nowrap">Kec. {{ item.district }}</span></template>
    <template #cell-status="{ item }">
      <UiBadge :tone="item.status === 'aktif' ? 'green' : 'slate'">
        <i class="fa-solid fa-circle text-[6px]"></i> {{ item.status === 'aktif' ? 'Aktif' : 'Nonaktif' }}
      </UiBadge>
    </template>
  </CrudPage>
</template>
