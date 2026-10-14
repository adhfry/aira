import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

// Tooltip penjelas istilah teknis dan teks yang terpotong. Hanya di klien karena tippy butuh DOM;
// sisi server memakai directive kosong (tippy.server.ts) agar render SSR tidak gagal.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTippy, {
    directive: 'tippy',
    component: 'Tippy',
    defaultProps: { placement: 'top', maxWidth: 320, delay: [120, 0] },
  })
})
