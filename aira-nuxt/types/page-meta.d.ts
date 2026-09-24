declare module '#app' {
  interface PageMeta {
    /** Varian navbar landing page */
    navbar?: 'light' | 'dark'
    /** Tema area dashboard (peta memakai tema gelap penuh) */
    theme?: 'light' | 'dark'
    /** Konten dashboard tanpa padding/scroll bawaan (untuk peta layar penuh) */
    fullBleed?: boolean
  }
}

export {}
