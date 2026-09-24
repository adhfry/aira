import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

export default defineNuxtPlugin(() => {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend)
  Chart.defaults.font.family = '"Plus Jakarta Sans", sans-serif'
  Chart.defaults.color = '#94a3b8'
})
