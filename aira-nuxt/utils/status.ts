import type { Status } from '~/types'

export interface StatusMeta {
  label: string
  /** Label tingkat risiko (dipakai di tabel risiko kecamatan) */
  risk: string
  dot: string
  solid: string
  soft: string
  text: string
  bar: string
  icon: string
}

export const STATUS_META: Record<Status, StatusMeta> = {
  normal: {
    label: 'Normal',
    risk: 'Rendah',
    dot: 'bg-green-500',
    solid: 'bg-green-500 text-white',
    soft: 'bg-green-100 text-green-700',
    text: 'text-green-600',
    bar: 'bg-green-500',
    icon: 'fa-check',
  },
  waspada: {
    label: 'Waspada',
    risk: 'Waspada',
    dot: 'bg-yellow-500',
    solid: 'bg-yellow-500 text-white',
    soft: 'bg-yellow-100 text-yellow-700',
    text: 'text-yellow-600',
    bar: 'bg-yellow-500',
    icon: 'fa-exclamation',
  },
  siaga: {
    label: 'Siaga',
    risk: 'Sedang',
    dot: 'bg-orange-500',
    solid: 'bg-orange-500 text-white',
    soft: 'bg-orange-100 text-orange-700',
    text: 'text-orange-500',
    bar: 'bg-orange-500',
    icon: 'fa-exclamation',
  },
  bahaya: {
    label: 'Bahaya',
    risk: 'Tinggi',
    dot: 'bg-red-500',
    solid: 'bg-red-500 text-white',
    soft: 'bg-red-100 text-red-700',
    text: 'text-red-500',
    bar: 'bg-red-500',
    icon: 'fa-triangle-exclamation',
  },
}

export const STATUS_LIST: Status[] = ['normal', 'waspada', 'siaga', 'bahaya']

export const STATUS_OPTIONS = STATUS_LIST.map((value) => ({ value, label: STATUS_META[value].label }))

export const STATUS_ORDER: Record<Status, number> = { bahaya: 3, siaga: 2, waspada: 1, normal: 0 }

export const STATUS_HEX: Record<Status, string> = {
  normal: '#10B981',
  waspada: '#F59E0B',
  siaga: '#F97316',
  bahaya: '#EF4444',
}

export function statusMeta(status: string): StatusMeta {
  return STATUS_META[status as Status] ?? STATUS_META.normal
}
