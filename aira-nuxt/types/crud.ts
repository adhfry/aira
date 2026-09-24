export interface CrudColumn {
  key: string
  label: string
  sortable?: boolean
  class?: string
  /** Nilai untuk sorting bila berbeda dari item[key] */
  sortValue?: (item: Record<string, unknown>) => string | number
}

export interface SelectOption {
  value: string
  label: string
}

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'number' | 'select' | 'textarea' | 'checkbox' | 'datetime' | 'tags'

export interface CrudField {
  key: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: SelectOption[]
  min?: number
  max?: number
  step?: number
  /** Lebar kolom di grid form (default 1 dari 2) */
  full?: boolean
  help?: string
}

export interface CrudFilter {
  key: string
  label: string
  options: SelectOption[]
  /** Pencocokan kustom (default: item[key] === value) */
  match?: (item: Record<string, unknown>, value: string) => boolean
}

export type FormModel = Record<string, string | number | boolean | undefined>
