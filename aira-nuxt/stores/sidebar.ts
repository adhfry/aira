import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  /** Drawer sidebar pada layar < lg */
  const mobileOpen = ref(false)
  /** Grup menu manajemen yang sedang terbuka */
  const expanded = ref<string[]>([])

  function toggleMobile(value?: boolean) {
    mobileOpen.value = value ?? !mobileOpen.value
  }

  function toggleGroup(key: string) {
    expanded.value = expanded.value.includes(key) ? expanded.value.filter((k) => k !== key) : [...expanded.value, key]
  }

  function expand(key: string) {
    if (!expanded.value.includes(key)) expanded.value = [...expanded.value, key]
  }

  return { mobileOpen, expanded, toggleMobile, toggleGroup, expand }
})
