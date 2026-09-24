export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

let counter = 0

export function useToast() {
  const toasts = useState<Toast[]>('aira-toasts', () => [])

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function push(message: string, type: ToastType = 'success', duration = 3500) {
    const id = ++counter
    toasts.value = [...toasts.value, { id, type, message }]
    if (import.meta.client) setTimeout(() => dismiss(id), duration)
  }

  return {
    toasts,
    dismiss,
    success: (m: string) => push(m, 'success'),
    error: (m: string) => push(m, 'error', 5000),
    info: (m: string) => push(m, 'info'),
  }
}
