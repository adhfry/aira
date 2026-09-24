# AIRA — Artificial Intelligence Response Banjir

Platform pemantauan, analisis risiko, dan peringatan dini banjir Kabupaten Surnenep.
Migrasi dari static HTML (`../_reference/`) ke **Nuxt 4 + TailwindCSS** dengan CRUD data.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Framework | Nuxt 4 (Vue 3, Nitro), TypeScript |
| Styling | TailwindCSS 3 (`@nuxtjs/tailwindcss`), Plus Jakarta Sans, Font Awesome 6.4.0 |
| State | Pinia (`stores/sidebar.ts`, `stores/dashboard.ts`) |
| Grafik | Chart.js + vue-chartjs |
| Peta | Leaflet (tile Esri World Imagery / CARTO) |
| Data | Nitro server routes + JSON file store |

## Menjalankan

Butuh Node.js 20+.

```bash
npm install
npm run dev          # http://localhost:3000
```

Build produksi:

```bash
npm run build
node .output/server/index.mjs   # jalankan dari folder aira-nuxt (PORT=3000 default)
```

Perintah lain:

```bash
npm run typecheck    # pemeriksaan TypeScript
npm run seed         # generate ulang server/data/db.json (deterministik)
```

> **Catatan dev:** bila menambah file `.vue` baru saat `npm run dev` berjalan dan class Tailwind-nya
> tidak muncul, restart dev server (Tailwind JIT kadang tidak mendeteksi file baru).

## Halaman

| URL | Keterangan | Sumber referensi |
| --- | --- | --- |
| `/` | Beranda | `index-aira.html` |
| `/tentang` | Tentang AIRA | `tentang-aira.html` |
| `/fitur` | 6 fitur utama | `fitur-aira.html` |
| `/teknologi` | Data fusion & arsitektur 5-layer | `teknologi-aira.html` |
| `/manfaat` | Matriks strategi 3x3, dampak, metrik | *(tidak ada referensi — dibuat dengan gaya yang sama)* |
| `/dashboard` | Dashboard utama (data API) | `dashboard-aira.html` |
| `/peta` | Peta monitoring + feed CCTV | `peta-monitor-aira.html` |
| `/dashboard/cameras` | CRUD CCTV | — |
| `/dashboard/sensors` | CRUD sensor IoT (`?type=weather` dst.) | — |
| `/dashboard/incidents` | CRUD laporan kejadian | — |
| `/dashboard/districts` | CRUD kecamatan & risiko | — |
| `/dashboard/users` | CRUD petugas | — |
| `/dashboard/notifications` | CRUD notifikasi + aksi kirim | — |

Semua halaman CRUD mendukung filter via query URL, mis. `/dashboard/incidents?status=aktif`,
`/dashboard/cameras?q=kalianget`.

## API

Enam entitas: `cameras`, `sensors`, `incidents`, `districts`, `users`, `notifications`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| GET | `/api/<entitas>` | Daftar; filter `?q=` (teks) & `?<field>=<nilai>` |
| POST | `/api/<entitas>` | Tambah (validasi → 422 dengan daftar error) |
| GET | `/api/<entitas>/:id` | Detail |
| PUT | `/api/<entitas>/:id` | Update parsial |
| DELETE | `/api/<entitas>/:id` | Hapus |
| GET | `/api/stats` | Agregasi dashboard (risiko, perangkat online, cuaca, prediksi 24 jam) |
| POST | `/api/reset` | Kembalikan data ke seed awal (menu *Pengaturan → Reset Data Demo*) |

Aturan turunan di server:
- **Sensor**: mengubah `value` menambah titik `history` (maks. 12) dan menghitung `trend` otomatis.
- **Kecamatan**: `riskLevel` otomatis dari `riskPercentage` bila tidak dikirim (≥70 bahaya, ≥50 siaga, ≥35 waspada).

## Data & persistensi

- Seed awal: `server/data/db.json` (42 CCTV, 28 sensor, 20 kejadian, 11 kecamatan, 5 petugas, 8 notifikasi),
  dihasilkan oleh `scripts/seed.mjs`.
- Saat pertama kali dijalankan, seed disalin ke `.data/aira/aira-db.json` dan seluruh timestamp digeser
  agar data terasa terkini. Semua perubahan CRUD disimpan di file tersebut (tetap ada setelah restart).
- Hapus folder `.data/` atau gunakan *Reset Data Demo* untuk kembali ke data awal.

## Struktur

```
aira-nuxt/
├── assets/css/main.css        # Tailwind, font, background section, style peta
├── components/
│   ├── layout/                # Navbar, Footer, Sidebar, Topbar, BrandLogo
│   ├── landing/               # HeroSection, HeroBackground, FeatureGrid, WorkflowSteps, BenefitGrid, CTASection, …
│   ├── dashboard/             # MetricCard, MapPanel, CCTVPanel, SensorChart, RiskTable, PredictionChart, RecentEvents, CCTVFeedPanel
│   ├── map/AiraMap.client.vue # Peta Leaflet bersama (dashboard & peta)
│   ├── crud/                  # CrudPage generik, FormField, SummaryCards
│   └── ui/                    # Button, Badge, StatusPill, Modal, ConfirmDialog, Toast, Skeleton, Card
├── composables/               # useCrud (+ useCameras, useSensors, …), useStats, useToast, useDistrictOptions
├── layouts/                   # default (navbar+footer), dashboard (sidebar+topbar)
├── pages/                     # lihat tabel halaman
├── server/
│   ├── api/                   # endpoint CRUD + stats + reset
│   ├── utils/                 # db (JSON store + antrean tulis), crud, schema (validasi)
│   └── data/db.json           # seed
├── stores/                    # Pinia
├── types/                     # tipe data bersama
└── utils/                     # status, label, format, escape HTML
```

## Catatan desain

- Warna status: normal `#10B981`, waspada `#F59E0B`, siaga `#F97316`, bahaya `#EF4444`; primary `#0F62FE`.
- Landing page: gambar konten memakai `.image-grayscale` (sesuai referensi); logo AIRA berwarna asli.
- Hero beranda & teknologi memakai slider foto drone Sumenep berwarna dengan overlay navy
  (overlay hanya di lapisan latar, sehingga teks & tombol tidak ikut pucat).
- **Area dashboard (dashboard, peta, halaman CRUD, sidebar) tidak memakai filter grayscale/hitam-putih sama sekali** —
  peta satelit, feed CCTV, dan foto petugas tampil berwarna penuh.
