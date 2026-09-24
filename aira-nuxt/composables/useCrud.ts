import type { Camera, District, Incident, Notification, Sensor, User } from '~/types'

export type Resource = 'cameras' | 'sensors' | 'incidents' | 'districts' | 'users' | 'notifications'

interface ApiError {
  data?: { message?: string; statusMessage?: string; data?: { errors?: string[] } }
  statusMessage?: string
  message?: string
}

/** Ambil pesan error yang ramah pengguna dari respons $fetch. */
export function apiErrorMessage(err: unknown, fallback = 'Terjadi kesalahan. Silakan coba lagi.'): string {
  const e = err as ApiError
  const errors = e?.data?.data?.errors
  if (errors?.length) return errors.join(' ')
  return e?.data?.message || e?.data?.statusMessage || e?.statusMessage || fallback
}

/**
 * Composable CRUD generik untuk resource AIRA.
 * Data list di-cache dengan key `crud-<resource>` sehingga dapat dibagi antar komponen.
 */
export function useCrud<T extends { id: string }>(resource: Resource) {
  const endpoint = `/api/${resource}`
  const { data, status, error, refresh } = useFetch<T[]>(endpoint, {
    key: `crud-${resource}`,
    default: () => [],
  })

  const items = computed(() => data.value ?? [])
  const pending = computed(() => status.value === 'pending' || status.value === 'idle')

  async function afterMutation() {
    await Promise.all([refresh(), refreshNuxtData('stats')])
  }

  async function create(payload: Partial<T>): Promise<T> {
    const created = await $fetch<T>(endpoint, { method: 'POST', body: payload })
    await afterMutation()
    return created
  }

  async function update(id: string, payload: Partial<T>): Promise<T> {
    const updated = await $fetch<T>(`${endpoint}/${id}`, { method: 'PUT', body: payload })
    await afterMutation()
    return updated
  }

  async function remove(id: string): Promise<void> {
    await $fetch(`${endpoint}/${id}`, { method: 'DELETE' })
    await afterMutation()
  }

  return { items, data, pending, error, refresh, create, update, remove }
}

export const useCameras = () => useCrud<Camera>('cameras')
export const useSensors = () => useCrud<Sensor>('sensors')
export const useIncidents = () => useCrud<Incident>('incidents')
export const useDistricts = () => useCrud<District>('districts')
export const useUsers = () => useCrud<User>('users')
export const useNotifications = () => useCrud<Notification>('notifications')
