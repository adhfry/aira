// Ambil elevasi tanah (SRTM 30 m, OpenTopoData) untuk titik jangkar tiap zona → scripts/data/elevations.json
// Jalankan setelah seed pertama: node scripts/fetch-elevation.mjs && npm run seed
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const db = JSON.parse(readFileSync(resolve(root, 'server/data/db.json'), 'utf8'))
const locs = db.zones.map((z) => `${z.lat},${z.lng}`).join('|')
const res = await fetch(`https://api.opentopodata.org/v1/srtm30m?locations=${locs}`)
const json = await res.json()
const out = Object.fromEntries(db.zones.map((z, i) => [z.code, json.results[i].elevation]))
writeFileSync(resolve(root, 'scripts/data/elevations.json'), `${JSON.stringify(out, null, 2)}\n`)
console.log(out)
