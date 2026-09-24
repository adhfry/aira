// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  css: [
    '@fortawesome/fontawesome-free/css/all.min.css',
    'leaflet/dist/leaflet.css',
    '~/assets/css/main.css',
  ],

  tailwindcss: {
    cssPath: false,
    configPath: 'tailwind.config.ts',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'AIRA - Artificial Intelligence Response Banjir',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0F62FE' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/aira-mark.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },

  // Penyimpanan data CRUD (JSON file store). Seed awal: server/data/db.json
  nitro: {
    storage: {
      aira: { driver: 'fs', base: './.data/aira' },
    },
    devStorage: {
      aira: { driver: 'fs', base: './.data/aira' },
    },
  },

  typescript: {
    strict: true,
  },
})
