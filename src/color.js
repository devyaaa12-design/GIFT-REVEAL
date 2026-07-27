// Lighten (positive amount) or darken (negative amount) a hex color.
// amount is a fraction from -1 to 1.
export function shade(hex, amount = 0) {
  const c = hex.replace('#', '')
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c
  let r = parseInt(full.slice(0, 2), 16)
  let g = parseInt(full.slice(2, 4), 16)
  let b = parseInt(full.slice(4, 6), 16)

  if (amount >= 0) {
    r = Math.round(r + (255 - r) * amount)
    g = Math.round(g + (255 - g) * amount)
    b = Math.round(b + (255 - b) * amount)
  } else {
    const f = 1 + amount
    r = Math.round(r * f)
    g = Math.round(g * f)
    b = Math.round(b * f)
  }

  const toHex = (v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
