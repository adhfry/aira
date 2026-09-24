import { defineStore } from 'pinia'

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
const pad = (n: number) => String(n).padStart(2, '0')

/** Jam real-time (WIB) yang dipakai Topbar dashboard & peta. */
export const useDashboardStore = defineStore('dashboard', () => {
  const now = ref<Date | null>(null)
  let timer: ReturnType<typeof setInterval> | undefined
  let subscribers = 0

  const dateLabel = computed(() => {
    const d = now.value
    if (!d) return ' '
    return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`
  })

  const timeLabel = computed(() => {
    const d = now.value
    if (!d) return '--:--:-- WIB'
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} WIB`
  })

  function startClock() {
    subscribers++
    if (timer) return
    now.value = new Date()
    timer = setInterval(() => (now.value = new Date()), 1000)
  }

  function stopClock() {
    subscribers = Math.max(0, subscribers - 1)
    if (subscribers === 0 && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }

  return { now, dateLabel, timeLabel, startClock, stopClock }
})
