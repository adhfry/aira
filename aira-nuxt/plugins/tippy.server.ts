export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tippy', { getSSRProps: () => ({}) })
})
