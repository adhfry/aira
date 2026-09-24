<script setup lang="ts" generic="T extends { id: string }">
import type { CrudColumn, CrudField, CrudFilter, FormModel } from '~/types/crud'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle: string
    icon: string
    entity: string
    items: T[]
    pending: boolean
    error: unknown
    columns: CrudColumn[]
    fields: CrudField[]
    filters?: CrudFilter[]
    /** Nilai default form tambah data */
    defaults: () => FormModel
    /** Item → model form (untuk edit) */
    toForm?: (item: T) => FormModel
    /** Model form → payload API */
    toPayload?: (form: FormModel, editing: T | null) => Record<string, unknown>
    itemLabel: (item: T) => string
    create: (payload: Partial<T>) => Promise<T>
    update: (id: string, payload: Partial<T>) => Promise<T>
    remove: (id: string) => Promise<void>
    refresh: () => Promise<void>
    searchPlaceholder?: string
    pageSize?: number
  }>(),
  {
    filters: () => [],
    toForm: undefined,
    toPayload: undefined,
    searchPlaceholder: 'Cari data…',
    pageSize: 10,
  },
)

const route = useRoute()
const toast = useToast()

// ---------- Pencarian, filter, urutan (sinkron dengan query URL) ----------
const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
const filterValues = reactive<Record<string, string>>(
  Object.fromEntries(props.filters.map((f) => [f.key, typeof route.query[f.key] === 'string' ? (route.query[f.key] as string) : ''])),
)
watch(
  () => route.query,
  (q) => {
    if (typeof q.q === 'string') search.value = q.q
    for (const f of props.filters) filterValues[f.key] = typeof q[f.key] === 'string' ? (q[f.key] as string) : ''
  },
)

const sortKey = ref<string | null>(null)
const sortDir = ref<'asc' | 'desc'>('asc')
function toggleSort(col: CrudColumn) {
  if (!col.sortable) return
  if (sortKey.value === col.key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = col.key
    sortDir.value = 'asc'
  }
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  let rows = props.items.filter((item) => {
    const rec = item as unknown as Record<string, unknown>
    if (q && !Object.values(rec).some((v) => typeof v !== 'object' && String(v).toLowerCase().includes(q))) return false
    return props.filters.every((f) => {
      const v = filterValues[f.key]
      if (!v) return true
      return f.match ? f.match(rec, v) : String(rec[f.key]) === v
    })
  })
  if (sortKey.value) {
    const col = props.columns.find((c) => c.key === sortKey.value)
    const val = (i: T) => {
      const rec = i as unknown as Record<string, unknown>
      return col?.sortValue ? col.sortValue(rec) : (rec[sortKey.value!] as string | number)
    }
    rows = [...rows].sort((a, b) => {
      const va = val(a)
      const vb = val(b)
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'id')
      return sortDir.value === 'asc' ? cmp : -cmp
    })
  }
  return rows
})

const activeFilterCount = computed(() => Object.values(filterValues).filter(Boolean).length + (search.value ? 1 : 0))
function resetFilters() {
  search.value = ''
  for (const k of Object.keys(filterValues)) filterValues[k] = ''
  if (Object.keys(route.query).length) navigateTo({ path: route.path, query: {} }, { replace: true })
}

// ---------- Paginasi ----------
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / props.pageSize)))
const paged = computed(() => filtered.value.slice((page.value - 1) * props.pageSize, page.value * props.pageSize))
watch([search, filterValues, () => props.items.length], () => (page.value = 1))
watch(totalPages, (n) => {
  if (page.value > n) page.value = n
})

// ---------- Form tambah / edit ----------
const formOpen = ref(false)
const editing = ref<T | null>(null) as Ref<T | null>
const form = ref<FormModel>({})
const errors = ref<Record<string, string>>({})
const serverError = ref('')
const saving = ref(false)

function openCreate() {
  editing.value = null
  form.value = props.defaults()
  errors.value = {}
  serverError.value = ''
  formOpen.value = true
}

function openEdit(item: T) {
  editing.value = item
  form.value = props.toForm ? props.toForm(item) : ({ ...(item as unknown as FormModel) } as FormModel)
  errors.value = {}
  serverError.value = ''
  formOpen.value = true
}

function validate(): boolean {
  const e: Record<string, string> = {}
  for (const f of props.fields) {
    const v = form.value[f.key]
    const empty = v === undefined || v === null || (typeof v === 'string' && v.trim() === '')
    if (f.required && empty) e[f.key] = `${f.label} wajib diisi.`
    else if (!empty && f.type === 'number') {
      const n = Number(v)
      if (!Number.isFinite(n)) e[f.key] = `${f.label} harus berupa angka.`
      else if (f.min !== undefined && n < f.min) e[f.key] = `${f.label} minimal ${f.min}.`
      else if (f.max !== undefined && n > f.max) e[f.key] = `${f.label} maksimal ${f.max}.`
    } else if (!empty && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) e[f.key] = 'Format email tidak valid.'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  serverError.value = ''
  if (!validate()) return
  saving.value = true
  try {
    const payload = (props.toPayload ? props.toPayload(form.value, editing.value) : { ...form.value }) as Partial<T>
    if (editing.value) {
      await props.update(editing.value.id, payload)
      toast.success(`${props.entity} berhasil diperbarui.`)
    } else {
      await props.create(payload)
      toast.success(`${props.entity} baru berhasil ditambahkan.`)
    }
    formOpen.value = false
  } catch (err) {
    serverError.value = apiErrorMessage(err)
    toast.error(`Gagal menyimpan ${props.entity.toLowerCase()}.`)
  } finally {
    saving.value = false
  }
}

// ---------- Hapus ----------
const deleting = ref<T | null>(null) as Ref<T | null>
const removing = ref(false)
async function confirmDelete() {
  if (!deleting.value) return
  removing.value = true
  try {
    await props.remove(deleting.value.id)
    toast.success(`${props.entity} "${props.itemLabel(deleting.value)}" berhasil dihapus.`)
    deleting.value = null
  } catch (err) {
    toast.error(apiErrorMessage(err, `Gagal menghapus ${props.entity.toLowerCase()}.`))
  } finally {
    removing.value = false
  }
}

const refreshing = ref(false)
async function doRefresh() {
  refreshing.value = true
  try {
    await props.refresh()
  } finally {
    refreshing.value = false
  }
}

const showSkeleton = computed(() => props.pending && props.items.length === 0)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0">
          <i class="fa-solid text-xl" :class="icon"></i>
        </div>
        <div>
          <h1 class="text-xl font-extrabold text-slate-900">{{ title }}</h1>
          <p class="text-xs text-slate-500">{{ subtitle }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <UiButton variant="secondary" :loading="refreshing" icon="fa-rotate-right" aria-label="Muat ulang" @click="doRefresh">
          <span class="hidden sm:inline">Muat Ulang</span>
        </UiButton>
        <UiButton icon="fa-plus" @click="openCreate">Tambah Data</UiButton>
      </div>
    </div>

    <!-- Ringkasan -->
    <slot name="summary" :items="items" />

    <!-- Tabel -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <!-- Toolbar -->
      <div class="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div class="relative flex-1 min-w-0">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            v-model="search"
            type="search"
            :placeholder="searchPlaceholder"
            aria-label="Cari"
            class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <select
            v-for="f in filters"
            :key="f.key"
            v-model="filterValues[f.key]"
            :aria-label="`Filter ${f.label}`"
            class="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Semua {{ f.label }}</option>
            <option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <button
            v-if="activeFilterCount"
            class="text-xs font-semibold text-slate-500 hover:text-red-500 px-3 py-2.5 rounded-lg hover:bg-red-50 transition"
            @click="resetFilters"
          >
            <i class="fa-solid fa-xmark mr-1"></i> Reset
          </button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error && !items.length" class="p-10 flex flex-col items-center text-center gap-3">
        <div class="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><i class="fa-solid fa-plug-circle-xmark text-2xl"></i></div>
        <div>
          <p class="font-bold text-slate-800">Gagal memuat data</p>
          <p class="text-xs text-slate-500">{{ apiErrorMessage(error) }}</p>
        </div>
        <UiButton variant="secondary" icon="fa-rotate-right" @click="doRefresh">Coba Lagi</UiButton>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm min-w-[720px]">
          <thead>
            <tr class="text-left text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/80">
              <th
                v-for="c in columns"
                :key="c.key"
                scope="col"
                class="px-4 py-3 font-bold whitespace-nowrap"
                :class="[c.class, c.sortable ? 'cursor-pointer select-none hover:text-primary' : '']"
                :aria-sort="sortKey === c.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined"
                @click="toggleSort(c)"
              >
                {{ c.label }}
                <i
                  v-if="c.sortable"
                  class="fa-solid text-[9px] ml-1"
                  :class="sortKey === c.key ? (sortDir === 'asc' ? 'fa-arrow-up text-primary' : 'fa-arrow-down text-primary') : 'fa-sort text-slate-300'"
                ></i>
              </th>
              <th scope="col" class="px-4 py-3 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <!-- Skeleton -->
            <template v-if="showSkeleton">
              <tr v-for="n in 6" :key="`sk-${n}`">
                <td v-for="c in columns" :key="c.key" class="px-4 py-4"><UiSkeleton class="h-4 w-full max-w-[160px]" /></td>
                <td class="px-4 py-4"><UiSkeleton class="h-7 w-16 ml-auto" /></td>
              </tr>
            </template>

            <!-- Empty -->
            <tr v-else-if="!paged.length">
              <td :colspan="columns.length + 1" class="px-4 py-14">
                <div class="flex flex-col items-center text-center gap-3">
                  <div class="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><i class="fa-solid fa-inbox text-2xl"></i></div>
                  <div>
                    <p class="font-bold text-slate-800">{{ items.length ? 'Tidak ada data yang cocok' : 'Belum ada data' }}</p>
                    <p class="text-xs text-slate-500">
                      {{ items.length ? 'Coba ubah kata kunci atau filter pencarian.' : `Tambahkan ${entity.toLowerCase()} pertama Anda.` }}
                    </p>
                  </div>
                  <UiButton v-if="items.length" variant="secondary" @click="resetFilters">Reset Filter</UiButton>
                  <UiButton v-else icon="fa-plus" @click="openCreate">Tambah Data</UiButton>
                </div>
              </td>
            </tr>

            <!-- Rows -->
            <template v-else>
            <tr v-for="item in paged" :key="item.id" class="hover:bg-slate-50/70 transition">
              <td v-for="c in columns" :key="c.key" class="px-4 py-3 align-middle" :class="c.class">
                <slot :name="`cell-${c.key}`" :item="item" :value="(item as Record<string, unknown>)[c.key]">
                  <span class="text-slate-700">{{ (item as Record<string, unknown>)[c.key] }}</span>
                </slot>
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <slot name="row-actions" :item="item" />
                <button
                  class="w-8 h-8 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-primary transition"
                  :aria-label="`Edit ${itemLabel(item)}`"
                  title="Edit"
                  @click="openEdit(item)"
                >
                  <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>
                <button
                  class="w-8 h-8 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition"
                  :aria-label="`Hapus ${itemLabel(item)}`"
                  title="Hapus"
                  @click="deleting = item"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Footer / paginasi -->
      <div v-if="filtered.length" class="px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Menampilkan <b class="text-slate-700">{{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, filtered.length) }}</b> dari
          <b class="text-slate-700">{{ filtered.length }}</b> data
        </span>
        <div class="flex items-center gap-1">
          <button class="w-8 h-8 rounded-lg hover:bg-slate-100 disabled:opacity-40" :disabled="page === 1" aria-label="Halaman sebelumnya" @click="page--">
            <i class="fa-solid fa-chevron-left text-[10px]"></i>
          </button>
          <button
            v-for="n in totalPages"
            :key="n"
            class="w-8 h-8 rounded-lg font-semibold transition"
            :class="n === page ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'"
            @click="page = n"
          >
            {{ n }}
          </button>
          <button class="w-8 h-8 rounded-lg hover:bg-slate-100 disabled:opacity-40" :disabled="page === totalPages" aria-label="Halaman berikutnya" @click="page++">
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal form -->
    <UiModal :open="formOpen" :title="editing ? `Edit ${entity}` : `Tambah ${entity}`" size="lg" @close="formOpen = false">
      <form id="crud-form" class="grid sm:grid-cols-2 gap-4" novalidate @submit.prevent="submit">
        <div v-if="serverError" class="sm:col-span-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2.5 flex gap-2">
          <i class="fa-solid fa-circle-exclamation mt-0.5"></i> {{ serverError }}
        </div>
        <CrudFormField v-for="f in fields" :key="f.key" v-model="form[f.key]" :field="f" :error="errors[f.key]" />
      </form>
      <template #footer>
        <UiButton variant="secondary" @click="formOpen = false">Batal</UiButton>
        <UiButton type="submit" form="crud-form" icon="fa-floppy-disk" :loading="saving">Simpan</UiButton>
      </template>
    </UiModal>

    <!-- Konfirmasi hapus -->
    <UiConfirmDialog
      :open="!!deleting"
      :message="deleting ? `Yakin ingin menghapus ${entity.toLowerCase()} “${itemLabel(deleting)}”? Tindakan ini tidak dapat dibatalkan.` : ''"
      :loading="removing"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
