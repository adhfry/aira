# 🚀 PROMPT LENGKAP UNTUK CLAUDE AGENT - PROJECT AIRA

Berikut adalah prompt detail dan file `CLAUDE.md` yang bisa langsung Anda berikan ke Claude Agent (Claude Code / Cursor / Cline).

---

## 📋 FILE: `CLAUDE.md` (Letakkan di root project `D:\Project_Web\aira\`)

```markdown
# CLAUDE.md — AIRA Project Context

## 🎯 Project Overview
**AIRA (Artificial Intelligence Response Banjir)** adalah platform monitoring banjir berbasis AI, IoT, dan GIS untuk Kabupaten Surnenep. Project ini awalnya dibangun sebagai static HTML files, dan sekarang akan **di-migrasi ulang secara penuh** ke **Nuxt 4 + TailwindCSS** dengan fitur CRUD data.

## 🎨 Design Source of Truth (WAJIB DIBACA SEBELUM KODING)
Semua file HTML referensi ada di folder `_reference/`:
- `_reference/index-aira.html` → Landing page (Hero, About, Features, Dashboard preview, Workflow, Benefits, CTA)
- `_reference/tentang-aira.html` → Halaman Tentang (Hero, Visi Misi, Latar Belakang, Nilai Utama, Tech Stack, CTA)
- `_reference/fitur-aira.html` → Halaman Fitur (6 fitur dengan mockup: CCTV AI, IoT, Cuaca, Peta, Notifikasi, Manajemen)
- `_reference/teknologi-aira.html` → Halaman Teknologi (Multi-Modal Data Fusion, Arsitektur 5-layer, Tech Stack grid)
- `_reference/manfaat-aira.html` → Halaman Manfaat (Matriks Strategi 3x3, Dampak, Metrics)
- `_reference/dashboard-aira.html` → Dashboard utama (Sidebar, metric cards, map, CCTV live, sensor charts, risk table, prediction chart, recent events)
- `_reference/peta-monitor-aira.html` → Peta Monitoring (Full-screen map, filter bar, map pins, CCTV feed panel)
- `_reference/AiraLogo.png` → Logo AIRA (gunakan di Navbar & Sidebar)

## 🎨 DESIGN SYSTEM (TIDAK BOLEH BERUBAH)

### Color Palette (Tailwind Config)
```js
colors: {
  primary: '#0F62FE',        // Blue utama (button, link, active state)
  'primary-dark': '#0043CE',
  darkbg: '#0B1120',         // Background hero CTA gelap
  panel: '#111827',          // Sidebar / panel gelap
  borderdark: '#1E293B',     // Border untuk dark theme
  // Status colors
  normal: '#10B981',         // Green
  waspada: '#F59E0B',        // Yellow/Orange
  siaga: '#F97316',          // Orange
  bahaya: '#EF4444',         // Red
}
```

### Typography
- **Font:** `Plus Jakarta Sans` (Google Fonts) — weight 400, 500, 600, 700, 800
- Load via `@nuxtjs/google-fonts` atau inline di `app.vue`

### Icon Library
- **Font Awesome 6.4.0** — via CDN atau `@fortawesome/vue-fontawesome`
- Icon yang dipakai: `fa-water`, `fa-video`, `fa-wifi`, `fa-map-location-dot`, `fa-chart-line`, `fa-cloud-sun`, `fa-bell`, `fa-triangle-exclamation`, `fa-shield-halved`, `fa-users`, `fa-leaf`, `fa-database`, `fa-gear`, `fa-arrow-right`, `fa-arrow-up`, `fa-arrow-down`, dll.

### Image Rules (SATURASI 0)
- **SEMUA gambar placeholder WAJIB filter grayscale 100%** via class `image-grayscale` atau `filter: grayscale(100%)`.
- Hanya logo AIRA (`AiraLogo.png`) yang berwarna asli.
- Gunakan Unsplash URL atau simpan di `/public/images/`.

### Layout Rules (PRESISI PIXEL)
1. **Max container width:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
2. **Navbar height:** `h-20`, fixed top, backdrop blur
3. **Sidebar width (dashboard):** `w-64`
4. **Border radius standar:** `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-full` untuk pill
5. **Shadow:** `shadow-sm` untuk card, `shadow-2xl` untuk mockup, `shadow-lg` untuk floating card

## 🛠 TECH STACK
- **Framework:** Nuxt 4 (SSR/SPA mode)
- **Styling:** TailwindCSS 3.x + `@nuxtjs/tailwindcss`
- **State Management:** Pinia (`@pinia/nuxt`)
- **Data Persistence:** Nuxt Server Routes (Nitro) + SQLite via `better-sqlite3` ATAU JSON file store di `/server/data/`
- **Icon:** Font Awesome 6
- **Charts:** Chart.js + `vue-chartjs` (untuk grafik sensor, prediksi, statistik)
- **Maps:** Leaflet (`@vue-leaflet/vue-leaflet`) untuk halaman peta
- **Composables:** `useFetch`, `useAsyncData` untuk API

## 📁 STRUKTUR FOLDER YANG DIMINTA
```
aira-nuxt/
├── CLAUDE.md
├── nuxt.config.ts
├── tailwind.config.ts
├── package.json
├── tsconfig.json
├── public/
│   ├── AiraLogo.png
│   └── images/          # semua gambar placeholder (grayscale)
├── server/
│   ├── api/
│   │   ├── cameras.get.ts       # GET all cameras
│   │   ├── cameras.post.ts      # CREATE camera
│   │   ├── cameras/[id].get.ts  # GET by id
│   │   ├── cameras/[id].put.ts  # UPDATE
│   │   ├── cameras/[id].delete.ts # DELETE
│   │   ├── sensors.get.ts       # CRUD sensor
│   │   ├── sensors/[id].ts
│   │   ├── incidents.get.ts     # CRUD kejadian banjir
│   │   ├── incidents/[id].ts
│   │   ├── districts.get.ts     # CRUD kecamatan/risiko
│   │   ├── users.get.ts         # CRUD user/petugas
│   │   ├── notifications.get.ts # CRUD notifikasi
│   │   └── stats.get.ts         # Statistik dashboard (agregasi)
│   └── data/
│       └── db.json              # Seed data awal
├── composables/
│   ├── useCameras.ts
│   ├── useSensors.ts
│   ├── useIncidents.ts
│   ├── useDistricts.ts
│   └── useAuth.ts
├── stores/
│   ├── dashboard.ts
│   └── sidebar.ts
├── layouts/
│   ├── default.vue        # untuk landing pages (navbar + footer)
│   └── dashboard.vue      # untuk halaman dashboard/peta (sidebar)
├── components/
│   ├── layout/
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── Sidebar.vue
│   │   └── Topbar.vue
│   ├── ui/
│   │   ├── Button.vue
│   │   ├── Badge.vue
│   │   ├── Card.vue
│   │   └── StatusPill.vue
│   ├── landing/
│   │   ├── HeroSection.vue
│   │   ├── FeatureGrid.vue
│   │   ├── WorkflowSteps.vue
│   │   ├── BenefitGrid.vue
│   │   └── CTASection.vue
│   ├── dashboard/
│   │   ├── MetricCard.vue
│   │   ├── MapPanel.vue
│   │   ├── CCTVPanel.vue
│   │   ├── SensorChart.vue
│   │   ├── RiskTable.vue
│   │   ├── PredictionChart.vue
│   │   └── RecentEvents.vue
│   └── forms/
│       ├── CameraForm.vue
│       ├── SensorForm.vue
│       └── IncidentForm.vue
├── pages/
│   ├── index.vue                # dari index-aira.html
│   ├── tentang.vue              # dari tentang-aira.html
│   ├── fitur.vue                # dari fitur-aira.html
│   ├── teknologi.vue            # dari teknologi-aira.html
│   ├── manfaat.vue              # dari manfaat-aira.html
│   ├── dashboard/
│   │   ├── index.vue            # dari dashboard-aira.html
│   │   ├── cameras.vue          # CRUD CCTV
│   │   ├── sensors.vue          # CRUD Sensor IoT
│   │   ├── incidents.vue        # CRUD Kejadian
│   │   ├── districts.vue        # CRUD Kecamatan
│   │   ├── users.vue            # CRUD Petugas
│   │   └── notifications.vue    # CRUD Notifikasi
│   └── peta/
│       └── index.vue            # dari peta-monitor-aira.html
└── assets/
    └── css/
        └── main.css             # import font, base styles
```

## 📊 DATA MODEL (Skema untuk CRUD)

```ts
// Camera
{ id, name, location, district, status: 'normal'|'waspada'|'siaga'|'bahaya', 
  imageUrl, lat, lng, lastUpdate, isOnline }

// Sensor
{ id, type: 'water_level'|'rainfall'|'weather', name, location, district,
  value, unit, trend: 'up'|'down'|'stable', status, lastUpdate, history: [{time, value}] }

// Incident
{ id, title, type: 'peringatan'|'hujan_tinggi'|'verifikasi'|'offline'|'normal',
  district, location, description, severity, status, timestamp, reporter }

// District
{ id, name, riskLevel: 'normal'|'waspada'|'siaga'|'bahaya', 
  riskPercentage, population, coordinates }

// User
{ id, name, role, email, phone, avatarUrl, district, status }

// Notification
{ id, title, message, type, recipients, status, createdAt }
```

## 🎯 TASK BREAKDOWN (Urutan Pengerjaan)

### FASE 1: Setup & Foundation
1. Init Nuxt 4 project: `npx nuxi@latest init aira-nuxt`
2. Install deps: `@nuxtjs/tailwindcss pinia @pinia/nuxt @fortawesome/fontawesome-free chart.js vue-chartjs leaflet @vue-leaflet/vue-leaflet better-sqlite3`
3. Setup `tailwind.config.ts` dengan custom colors, font, container
4. Setup `main.css` untuk import Plus Jakarta Sans + base styles
5. Copy `AiraLogo.png` ke `public/`
6. Buat `layouts/default.vue` (Navbar + Footer) & `layouts/dashboard.vue` (Sidebar + Topbar)

### FASE 2: Layout Components
7. Bangun `Navbar.vue` — persis seperti di semua HTML (logo, menu, CTA "Akses Dashboard")
8. Bangun `Sidebar.vue` — dark panel dengan 11 menu + profile bawah
9. Bangun `Topbar.vue` — search bar, date/time, weather widget
10. Bangun `Footer.vue` — logo + copyright

### FASE 3: Landing Pages (STATIC)
11. `pages/index.vue` ← migrasi dari `index-aira.html` (7 sections)
12. `pages/tentang.vue` ← migrasi dari `tentang-aira.html`
13. `pages/fitur.vue` ← migrasi dari `fitur-aira.html` (6 fitur besar dengan mockup)
14. `pages/teknologi.vue` ← migrasi dari `teknologi-aira.html` (diagram 5-layer)
15. `pages/manfaat.vue` ← migrasi dari `manfaat-aira.html` (matriks 3x3)

### FASE 4: Dashboard & Monitoring
16. `pages/dashboard/index.vue` ← migrasi dari `dashboard-aira.html`
17. `pages/peta/index.vue` ← migrasi dari `peta-monitor-aira.html` (full-screen map + CCTV panel)

### FASE 5: API & Data
18. Buat seed data di `server/data/db.json` (minimal 42 cameras, 28 sensors, 20 incidents, 11 districts, 5 users)
19. Buat semua endpoint CRUD di `server/api/`
20. Buat composables untuk fetch data
21. Integrasikan dashboard dengan data real dari API (bukan hardcode)

### FASE 6: CRUD Pages
22. `pages/dashboard/cameras.vue` — tabel + form create/edit/delete + filter
23. `pages/dashboard/sensors.vue`
24. `pages/dashboard/incidents.vue`
25. `pages/dashboard/districts.vue`
26. `pages/dashboard/users.vue`
27. `pages/dashboard/notifications.vue`

### FASE 7: Polish
28. Responsive check (mobile, tablet, desktop)
29. Loading state, error state, empty state
30. Transisi antar halaman (`<NuxtPage>` transition)
31. SEO meta tags per halaman
32. Test semua CRUD, pastikan data tersimpan.

## ⚠️ ATURAN KETAT
1. **JANGAN MENGUBAH LAYOUT, SPACING, WARNA, ATAU FONT.** Layout harus 100% identik dengan HTML referensi. Jika ragu, buka file HTML referensi dan bandingkan.
2. **Gunakan Tailwind utility classes**, jangan buat custom CSS kecuali untuk yang tidak bisa di-Tailwind (misal filter grayscale, keyframes).
3. **Semua gambar WAJIB grayscale** (kecuali logo).
4. **Bahasa UI:** Bahasa Indonesia (semua teks, label, placeholder).
5. **Responsive:** Mobile-first, semua breakpoint (`sm:`, `md:`, `lg:`, `xl:`) harus berfungsi.
6. **Clean code:** Component kecil, reusable, props typed (TypeScript), no console.log.
7. **Commit per fase** dengan pesan: `feat(fase-1): setup nuxt project & tailwind config`.

## 🚦 CARA MULAI
```
1. Baca CLAUDE.md ini sampai habis
2. Buka semua file di _reference/ satu per satu
3. Mulai dari FASE 1, jangan skip
4. Setelah tiap fase, commit dan report progress
5. Jika ada ambiguitas, TANYA dulu sebelum eksekusi
```

## ✅ DEFINITION OF DONE
- [ ] Semua 7 halaman termigrasi ke Nuxt dengan layout IDENTIK
- [ ] Logo AIRA tampil di Navbar & Sidebar
- [ ] Semua gambar grayscale
- [ ] Dashboard menampilkan data dari API (bukan hardcode)
- [ ] CRUD berfungsi untuk 6 entitas (cameras, sensors, incidents, districts, users, notifications)
- [ ] Data tersimpan setelah refresh (persistence)
- [ ] Responsive di mobile/tablet/desktop
- [ ] Build sukses tanpa error: `npm run build`
```

---

## 💬 PROMPT UNTUK CLAUDE AGENT (Copy-paste ke chat Claude Code)

```
Halo Claude, saya ingin kamu membangun ulang project web bernama "AIRA" dari static HTML menjadi aplikasi Nuxt 4 + TailwindCSS dengan full CRUD.

## KONTEKS PENTING
1. Ada file `CLAUDE.md` di root project yang berisi semua konteks, design system, struktur folder, task breakdown, dan aturan ketat. **BACA FILE ITU DULU SAMPAI HABIS sebelum menulis kode apapun.**

2. Ada 7 file HTML referensi di folder `_reference/` yang merupakan source of truth untuk semua layout, warna, font, icon, dan komponen:
   - `_reference/index-aira.html` (landing page)
   - `_reference/tentang-aira.html` (about page)
   - `_reference/fitur-aira.html` (features page - 6 fitur besar)
   - `_reference/teknologi-aira.html` (tech page - arsitektur 5-layer)
   - `_reference/manfaat-aira.html` (benefits page - matriks 3x3)
   - `_reference/dashboard-aira.html` (dashboard utama dengan sidebar)
   - `_reference/peta-monitor-aira.html` (peta monitoring fullscreen)

3. Logo AIRA ada di `_reference/AiraLogo.png` — copy ke `public/AiraLogo.png` dan pakai di Navbar + Sidebar. Logo BERWARNA, gambar lain grayscale.

## YANG HARUS KAMU LAKUKAN

### STEP 1: BACA & ANALISIS (WAJIB DULU)
- Baca `CLAUDE.md` lengkap
- Buka dan baca SEMUA 7 file HTML di `_reference/` satu per satu
- Catat: struktur HTML, class Tailwind yang dipakai, warna hex, font-size, spacing, icon FontAwesome yang dipakai
- Buat ringkasan: apa saja section di tiap halaman

### STEP 2: SETUP PROJECT
- Init Nuxt 4: `npx nuxi@latest init aira-nuxt`
- Install: `@nuxtjs/tailwindcss pinia @pinia/nuxt @fortawesome/fontawesome-free chart.js vue-chartjs leaflet @vue-leaflet/vue-leaflet`
- Setup `tailwind.config.ts` dengan color palette dari CLAUDE.md
- Setup font Plus Jakarta Sans
- Setup Font Awesome (CDN atau package)

### STEP 3: BUILD LAYOUTS
- `layouts/default.vue` → Navbar + slot + Footer (untuk landing pages)
- `layouts/dashboard.vue` → Sidebar + Topbar + slot (untuk dashboard & peta)
- Komponen: `Navbar.vue`, `Footer.vue`, `Sidebar.vue`, `Topbar.vue` — PERSIS seperti HTML referensi

### STEP 4: MIGRASI HALAMAN (SATU PER SATU)
Migrasi dengan **PRESISI PIXEL**. Layout, spacing, warna, font, icon, posisi elemen — semua WAJIB IDENTIK 100% dengan HTML referensi.

Urutan:
1. `pages/index.vue` (dari index-aira.html)
2. `pages/tentang.vue`
3. `pages/fitur.vue`
4. `pages/teknologi.vue`
5. `pages/manfaat.vue`
6. `pages/dashboard/index.vue`
7. `pages/peta/index.vue`

Untuk mockup kompleks (dashboard, peta, chart, diagram arsitektur) — pecah menjadi komponen kecil di `components/dashboard/`.

### STEP 5: SETUP DATA & API
- Buat seed data di `server/data/db.json` (gunakan JSON file sebagai database, simpel & portable)
- Buat endpoint CRUD di `server/api/`:
  - `cameras` (GET, POST, GET/:id, PUT/:id, DELETE/:id)
  - `sensors`
  - `incidents`
  - `districts`
  - `users`
  - `notifications`
  - `stats` (untuk agregasi dashboard)
- Buat composables: `useCameras()`, `useSensors()`, dll

### STEP 6: INTEGRASI DASHBOARD DENGAN API
- Ganti semua hardcoded data di `pages/dashboard/index.vue` dan `pages/peta/index.vue` dengan `useFetch` / `useAsyncData`
- Metric cards, tabel risiko, recent events, chart — semua ambil dari API

### STEP 7: BUILD CRUD PAGES
Buat halaman CRUD dengan tabel + form modal/sidebar:
- `pages/dashboard/cameras.vue`
- `pages/dashboard/sensors.vue`
- `pages/dashboard/incidents.vue`
- `pages/dashboard/districts.vue`
- `pages/dashboard/users.vue`
- `pages/dashboard/notifications.vue`

Setiap halaman CRUD harus punya:
- Tabel dengan kolom yang relevan + status badge berwarna
- Search bar + filter
- Tombol "Tambah" (buka modal form)
- Aksi Edit & Hapus di tiap row
- Konfirmasi delete
- Empty state & loading state
- Konsisten dengan design system AIRA (dark theme panel, primary blue)

### STEP 8: POLISH
- Responsive check semua breakpoint
- Loading skeleton, error boundary
- Page transitions
- SEO meta per halaman (`useSeoMeta`)
- Test build: `npm run build`

## ATURAN KETAT (JANGAN DILANGGAR)
1. ❌ JANGAN ubah layout/spacing/warna/font dari HTML referensi. **PRESISI PIXEL.**
2. ✅ SEMUA gambar grayscale `filter: grayscale(100%)` — hanya logo AIRA yang berwarna
3. ✅ Font: Plus Jakarta Sans (weight 400-800)
4. ✅ Icon: Font Awesome 6.4.0
5. ✅ Bahasa UI: Indonesia
6. ✅ TypeScript untuk semua file .vue & .ts
7. ✅ Responsive mobile-first
8. ✅ Commit per fase dengan pesan conventional commits

## CARA KERJA
- Kerjakan **BERTAHAP & URUT**. Jangan loncat fase.
- Setelah selesai 1 fase, **lapor progress** dan tunggu konfirmasi saya sebelum lanjut.
- Jika ada ambiguitas atau HTML referensi tidak jelas, **TANYA** dulu.
- Sebelum mulai, konfirmasi kamu sudah baca CLAUDE.md dan semua HTML referensi.

## OUTPUT YANG DIHARAPKAN
1. Project Nuxt 4 lengkap di folder `aira-nuxt/`
2. Semua 7 halaman termigrasi dengan layout identik
3. CRUD berfungsi untuk 6 entitas
4. Data persistence via JSON store (atau SQLite opsional)
5. Build sukses tanpa error
6. README.md dengan cara menjalankan project

Mulai dari STEP 1 sekarang. Konfirmasi dulu sebelum eksekusi.
```

---

## 📝 CATATAN TAMBAHAN UNTUK ANDA

### Cara Pakai:
1. **Persiapan folder:**
   ```
   D:\Project_Web\aira\
   ├── CLAUDE.md                    ← paste file CLAUDE.md di atas
   ├── _reference\
   │   ├── AiraLogo.png
   │   ├── index-aira.html
   │   ├── tentang-aira.html
   │   ├── fitur-aira.html
   │   ├── teknologi-aira.html
   │   ├── manfaat-aira.html
   │   ├── dashboard-aira.html
   │   └── peta-monitor-aira.html
   └── (project aira-nuxt akan dibuat di sini)
   ```

2. **Nama file HTML Anda perlu dirapikan** — Anda punya typo:
   - `dashboard-aira.html.html` → rename jadi `dashboard-aira.html`
   - `index-aira.html.html` → rename jadi `index-aira.html`
   - `tentang-aira.html.html` → rename jadi `tentang-aira.html`

3. **Buka Claude Code / Cursor / Cline** di folder `D:\Project_Web\aira\`, lalu paste prompt di atas.

4. **Setelah tiap fase**, review hasilnya, bandingkan dengan HTML referensi (buka di browser side-by-side), lalu minta Claude lanjut ke fase berikutnya.

### Tips Sukses:
- **Jangan langsung minta semua fase sekaligus** — Claude bisa kehilangan konteks. Kerjakan bertahap.
- **Setelah Fase 3 (landing pages)**, screenshot hasilnya dan bandingkan pixel-by-pixel dengan HTML referensi.
- Untuk **Fase 5 (API)**, saya rekomendasikan pakai **Nitro storage** (`useStorage('data')`) alih-alih `better-sqlite3` karena lebih simpel di Nuxt 4. Kalau mau lebih robust, baru pakai SQLite.
- **Kalau budget token terbatas**, prioritaskan Fase 1-4 dulu (visual identik), baru Fase 5-6 (CRUD).