// Utilitas geometri sederhana untuk seed (koordinat [lat, lng]).
import { readFileSync, existsSync } from 'node:fs'

export function loadJson(path, fallback = null) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback
}

const R = 6371000
const rad = (d) => (d * Math.PI) / 180

/** Jarak haversine (meter). */
export function dist(a, b) {
  const dLat = rad(b[0] - a[0])
  const dLng = rad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function lineLength(line) {
  let s = 0
  for (let i = 1; i < line.length; i++) s += dist(line[i - 1], line[i])
  return s
}

/** Titik pada fraksi panjang polyline (0..1), diinterpolasi linear. */
export function pointAt(line, fraction = 0.5) {
  const total = lineLength(line)
  let target = total * fraction
  for (let i = 1; i < line.length; i++) {
    const d = dist(line[i - 1], line[i])
    if (target <= d) {
      const t = d === 0 ? 0 : target / d
      return round6([line[i - 1][0] + (line[i][0] - line[i - 1][0]) * t, line[i - 1][1] + (line[i][1] - line[i - 1][1]) * t])
    }
    target -= d
  }
  return round6(line[line.length - 1])
}

export const round6 = (p) => [Math.round(p[0] * 1e6) / 1e6, Math.round(p[1] * 1e6) / 1e6]

/** Pertahankan hanya bagian polyline yang berada dalam radius (m) dari titik pusat. */
export function clipNear(lines, center, radius) {
  const outLines = []
  for (const line of lines) {
    let current = []
    for (const p of line) {
      if (dist(p, center) <= radius) current.push(p)
      else if (current.length) {
        if (current.length > 1) outLines.push(current)
        current = []
      }
    }
    if (current.length > 1) outLines.push(current)
  }
  return outLines
}

/** Titik (vertex) terdekat pada kumpulan polyline. */
export function nearestVertex(lines, pt) {
  let best = null
  let bestD = Infinity
  for (const line of lines) for (const p of line) {
    const d = dist(p, pt)
    if (d < bestD) {
      bestD = d
      best = p
    }
  }
  return { point: round6(best), distance: Math.round(bestD) }
}

export function longest(lines) {
  return [...lines].sort((a, b) => lineLength(b) - lineLength(a))[0]
}
