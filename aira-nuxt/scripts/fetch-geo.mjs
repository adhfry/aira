// Ambil geometri nyata dari OpenStreetMap (Overpass API) untuk jaringan/koridor penelitian banjir
// Kota Sumenep, lalu simpan ke scripts/data/geo-sumenep.json (dipakai oleh seed.mjs).
// Data © OpenStreetMap contributors, lisensi ODbL.
//
// Jalankan: node scripts/fetch-geo.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'scripts/data/geo-sumenep.json')
const BBOX = '-7.06,113.84,-6.99,113.93'

const ROADS = [
  'Jalan Diponegoro',
  'Jalan Panglima Besar Sudirman',
  'Jalan Jenderal Achmad Yani',
  'Jalan Imam Bonjol',
  'Jalan KH. Agus Salim',
  'Jalan Pahlawan',
  'Jalan Kyai Haji Sajad',
  'Jalan Dokter Wahidin Sudirohusodo',
  'Jalan Dokter Setiabudi',
  'Jalan Dokter Cipto Mangunkusumo',
  'Jalan KH. Mas Mansyur',
  'Jalan Raung',
  'Jalan Jenderal Urip Sumoharjo',
  'Jalan Kyai Haji Wahid Hasyim',
  'Jalan Trunojoyo',
  'Jalan Dewi Sartika',
  'Jalan Cendana IV',
  'Jalan Cempaka III',
  'Pesona Satelit',
  'Jalan Arya Wiraraja',
  'Jalan Yos Sudarso',
]

const SERVERS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']

async function overpass(query) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const url = SERVERS[attempt % SERVERS.length]
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'User-Agent': 'AIRA-prototype/1.0 (research mockup)', Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      })
      const text = await res.text()
      if (text.trim().startsWith('{')) return JSON.parse(text)
    } catch {
      /* coba lagi */
    }
    await new Promise((r) => setTimeout(r, 2500))
  }
  throw new Error('Overpass tidak dapat diakses')
}

const nameRegex = ROADS.map((r) => r.replace(/[.]/g, '\\.')).join('|')
const query = `[out:json][timeout:90];
(
  way["highway"]["name"~"^(${nameRegex})$"](${BBOX});
  way["waterway"="river"]["name"="Kali Marengan"](${BBOX});
  node["place"="village"](${BBOX});
  nwr["aeroway"="aerodrome"](${BBOX});
  nwr["amenity"~"^(hospital|townhall|marketplace)$"](${BBOX});
  nwr["office"="government"](${BBOX});
  nwr["name"~"BMKG|Meteorologi|BPBD|Pemerintah Kabupaten|Kantor Bupati|Pelabuhan|Warunk BSA|Paud Cendana",i](-7.07,113.84,-6.99,113.96);
);
out geom tags;`

const data = await overpass(query)

const round = (n) => Math.round(n * 1e6) / 1e6
const roads = {}
const rivers = {}
const places = []
for (const el of data.elements) {
  const t = el.tags ?? {}
  if (el.type === 'way' && t.highway && el.geometry) {
    ;(roads[t.name] ??= []).push({ id: el.id, highway: t.highway, geometry: el.geometry.map((g) => [round(g.lat), round(g.lon)]) })
  } else if (el.type === 'way' && t.waterway && el.geometry) {
    ;(rivers[t.name] ??= []).push({ id: el.id, geometry: el.geometry.map((g) => [round(g.lat), round(g.lon)]) })
  } else if (t.name) {
    let lat = el.lat
    let lon = el.lon
    if (lat === undefined && el.bounds) {
      lat = (el.bounds.minlat + el.bounds.maxlat) / 2
      lon = (el.bounds.minlon + el.bounds.maxlon) / 2
    }
    if (lat === undefined && el.geometry?.length) {
      lat = el.geometry.reduce((a, g) => a + g.lat, 0) / el.geometry.length
      lon = el.geometry.reduce((a, g) => a + g.lon, 0) / el.geometry.length
    }
    if (lat !== undefined) {
      places.push({
        osm: `${el.type}/${el.id}`,
        name: t.name,
        kind: t.place || t.aeroway || t.amenity || t.office || t.building || t.landuse || '',
        lat: round(lat),
        lng: round(lon),
      })
    }
  }
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(
  out,
  `${JSON.stringify({ source: 'OpenStreetMap contributors (ODbL) via Overpass API', fetchedAt: new Date().toISOString(), osmBase: data.osm3s?.timestamp_osm_base, roads, rivers, places }, null, 1)}\n`,
)
console.log(`Tersimpan ${out}`)
console.log('Jalan:', Object.entries(roads).map(([k, v]) => `${k}(${v.length})`).join(', '))
console.log('Sungai:', Object.keys(rivers).join(', '))
console.log('Tempat:', places.map((p) => `${p.name} [${p.kind}] ${p.lat},${p.lng}`).join('\n  '))
const missing = ROADS.filter((r) => !roads[r])
if (missing.length) console.log('TIDAK DITEMUKAN:', missing.join(', '))
