import type { Camera } from '~/types'

/** Satu modal video CCTV untuk seluruh aplikasi (dashboard, peta monitoring, daftar CCTV). */
export function useCameraModal() {
  const camera = useState<Camera | null>('camera-modal', () => null)
  return {
    camera,
    open: (c: Camera) => (camera.value = c),
    close: () => (camera.value = null),
  }
}
