// Furniture catalog. Every item is drawn top-down (as seen on a floor plan).
// `w` / `h` are the default footprint in pixels at 1x scale.
// `draw` returns an array of Konva-friendly shape descriptors so the same
// definition powers both the palette thumbnail and the canvas object.

export const CATEGORIES = [
  { id: 'seating', label: 'Seating' },
  { id: 'tables', label: 'Tables' },
  { id: 'beds', label: 'Beds' },
  { id: 'storage', label: 'Storage' },
  { id: 'kitchen', label: 'Kitchen & Bath' },
  { id: 'decor', label: 'Decor' },
]

// Helpers to keep the shape descriptors terse.
const rect = (x, y, w, h, props = {}) => ({ type: 'rect', x, y, w, h, cornerRadius: 3, ...props })
const circle = (x, y, r, props = {}) => ({ type: 'circle', x, y, r, ...props })
const line = (points, props = {}) => ({ type: 'line', points, ...props })

// Each draw() receives (w, h, color) and returns shapes in local coords
// (origin at top-left of the footprint).
export const FURNITURE = [
  // ---------------- Seating ----------------
  {
    id: 'sofa',
    name: 'Sofa',
    category: 'seating',
    w: 160,
    h: 70,
    color: '#7c8aa5',
    draw: (w, h, c) => [
      rect(0, h * 0.15, w, h * 0.85, { fill: c }),
      rect(0, 0, w, h * 0.35, { fill: c, brightness: -0.15 }),
      rect(0, h * 0.15, w * 0.12, h * 0.85, { fill: c, brightness: -0.2 }),
      rect(w * 0.88, h * 0.15, w * 0.12, h * 0.85, { fill: c, brightness: -0.2 }),
      line([w * 0.5, h * 0.35, w * 0.5, h], { stroke: c, strokeBrightness: -0.25, strokeWidth: 2 }),
    ],
  },
  {
    id: 'loveseat',
    name: 'Loveseat',
    category: 'seating',
    w: 110,
    h: 70,
    color: '#8d7b9c',
    draw: (w, h, c) => [
      rect(0, h * 0.15, w, h * 0.85, { fill: c }),
      rect(0, 0, w, h * 0.35, { fill: c, brightness: -0.15 }),
      rect(0, h * 0.15, w * 0.14, h * 0.85, { fill: c, brightness: -0.2 }),
      rect(w * 0.86, h * 0.15, w * 0.14, h * 0.85, { fill: c, brightness: -0.2 }),
    ],
  },
  {
    id: 'armchair',
    name: 'Armchair',
    category: 'seating',
    w: 70,
    h: 70,
    color: '#a5846a',
    draw: (w, h, c) => [
      rect(0, h * 0.15, w, h * 0.85, { fill: c }),
      rect(0, 0, w, h * 0.35, { fill: c, brightness: -0.15 }),
      rect(0, h * 0.15, w * 0.18, h * 0.85, { fill: c, brightness: -0.2 }),
      rect(w * 0.82, h * 0.15, w * 0.18, h * 0.85, { fill: c, brightness: -0.2 }),
    ],
  },
  {
    id: 'diningchair',
    name: 'Dining Chair',
    category: 'seating',
    w: 42,
    h: 42,
    color: '#b98b5e',
    draw: (w, h, c) => [
      rect(w * 0.1, h * 0.1, w * 0.8, h * 0.8, { fill: c }),
      rect(w * 0.1, 0, w * 0.8, h * 0.22, { fill: c, brightness: -0.2 }),
    ],
  },
  {
    id: 'stool',
    name: 'Stool',
    category: 'seating',
    w: 40,
    h: 40,
    color: '#c19a6b',
    draw: (w, h, c) => [circle(w / 2, h / 2, Math.min(w, h) / 2, { fill: c })],
  },

  // ---------------- Tables ----------------
  {
    id: 'coffeetable',
    name: 'Coffee Table',
    category: 'tables',
    w: 110,
    h: 60,
    color: '#9c6f47',
    draw: (w, h, c) => [rect(0, 0, w, h, { fill: c, cornerRadius: 6 })],
  },
  {
    id: 'diningtable',
    name: 'Dining Table',
    category: 'tables',
    w: 160,
    h: 90,
    color: '#8a5a34',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 6 }),
      rect(w * 0.08, h * 0.12, w * 0.84, h * 0.76, { fill: c, brightness: 0.12, cornerRadius: 4 }),
    ],
  },
  {
    id: 'roundtable',
    name: 'Round Table',
    category: 'tables',
    w: 110,
    h: 110,
    color: '#8a5a34',
    draw: (w, h, c) => [
      circle(w / 2, h / 2, Math.min(w, h) / 2, { fill: c }),
      circle(w / 2, h / 2, Math.min(w, h) / 2.6, { fill: c, brightness: 0.12 }),
    ],
  },
  {
    id: 'desk',
    name: 'Desk',
    category: 'tables',
    w: 130,
    h: 60,
    color: '#6b7280',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 4 }),
      rect(w * 0.6, h * 0.15, w * 0.35, h * 0.7, { fill: c, brightness: 0.15, cornerRadius: 3 }),
    ],
  },
  {
    id: 'sidetable',
    name: 'Side Table',
    category: 'tables',
    w: 46,
    h: 46,
    color: '#9c6f47',
    draw: (w, h, c) => [rect(0, 0, w, h, { fill: c, cornerRadius: 4 })],
  },

  // ---------------- Beds ----------------
  {
    id: 'kingbed',
    name: 'King Bed',
    category: 'beds',
    w: 190,
    h: 200,
    color: '#8896b0',
    draw: (w, h, c) => [
      rect(0, 0, w, h * 0.12, { fill: c, brightness: -0.25 }),
      rect(0, h * 0.12, w, h * 0.88, { fill: '#eef1f7' }),
      rect(w * 0.08, h * 0.18, w * 0.38, h * 0.28, { fill: c, brightness: 0.2, cornerRadius: 4 }),
      rect(w * 0.54, h * 0.18, w * 0.38, h * 0.28, { fill: c, brightness: 0.2, cornerRadius: 4 }),
      rect(0, h * 0.5, w, h * 0.5, { fill: c, cornerRadius: 2 }),
    ],
  },
  {
    id: 'queenbed',
    name: 'Queen Bed',
    category: 'beds',
    w: 160,
    h: 200,
    color: '#8896b0',
    draw: (w, h, c) => [
      rect(0, 0, w, h * 0.12, { fill: c, brightness: -0.25 }),
      rect(0, h * 0.12, w, h * 0.88, { fill: '#eef1f7' }),
      rect(w * 0.28, h * 0.18, w * 0.44, h * 0.3, { fill: c, brightness: 0.2, cornerRadius: 4 }),
      rect(0, h * 0.52, w, h * 0.48, { fill: c, cornerRadius: 2 }),
    ],
  },
  {
    id: 'singlebed',
    name: 'Single Bed',
    category: 'beds',
    w: 100,
    h: 200,
    color: '#8896b0',
    draw: (w, h, c) => [
      rect(0, 0, w, h * 0.1, { fill: c, brightness: -0.25 }),
      rect(0, h * 0.1, w, h * 0.9, { fill: '#eef1f7' }),
      rect(w * 0.2, h * 0.15, w * 0.6, h * 0.22, { fill: c, brightness: 0.2, cornerRadius: 4 }),
      rect(0, h * 0.45, w, h * 0.55, { fill: c, cornerRadius: 2 }),
    ],
  },
  {
    id: 'crib',
    name: 'Crib',
    category: 'beds',
    w: 80,
    h: 130,
    color: '#c9a27a',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 6 }),
      rect(w * 0.12, h * 0.08, w * 0.76, h * 0.84, { fill: '#f4ede2', cornerRadius: 4 }),
    ],
  },

  // ---------------- Storage ----------------
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    category: 'storage',
    w: 120,
    h: 55,
    color: '#7a5c3e',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c }),
      line([w / 2, 0, w / 2, h], { stroke: c, strokeBrightness: -0.3, strokeWidth: 2 }),
    ],
  },
  {
    id: 'dresser',
    name: 'Dresser',
    category: 'storage',
    w: 100,
    h: 45,
    color: '#8a6a48',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c }),
      line([w / 3, 0, w / 3, h], { stroke: c, strokeBrightness: -0.3, strokeWidth: 1.5 }),
      line([(2 * w) / 3, 0, (2 * w) / 3, h], { stroke: c, strokeBrightness: -0.3, strokeWidth: 1.5 }),
    ],
  },
  {
    id: 'bookshelf',
    name: 'Bookshelf',
    category: 'storage',
    w: 100,
    h: 35,
    color: '#6d5138',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c }),
      rect(w * 0.05, h * 0.15, w * 0.9, h * 0.7, { fill: c, brightness: 0.25, cornerRadius: 2 }),
    ],
  },
  {
    id: 'tvunit',
    name: 'TV Unit',
    category: 'storage',
    w: 140,
    h: 40,
    color: '#3f4045',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c }),
      rect(w * 0.3, h * 0.2, w * 0.4, h * 0.6, { fill: '#1b1c1f', cornerRadius: 2 }),
    ],
  },

  // ---------------- Kitchen & Bath ----------------
  {
    id: 'fridge',
    name: 'Refrigerator',
    category: 'kitchen',
    w: 60,
    h: 60,
    color: '#d3d7de',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 4 }),
      line([w * 0.85, h * 0.1, w * 0.85, h * 0.9], { stroke: c, strokeBrightness: -0.25, strokeWidth: 2 }),
    ],
  },
  {
    id: 'stove',
    name: 'Stove',
    category: 'kitchen',
    w: 60,
    h: 60,
    color: '#c7ccd3',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 3 }),
      circle(w * 0.3, h * 0.3, w * 0.12, { fill: '#4b4d52' }),
      circle(w * 0.7, h * 0.3, w * 0.12, { fill: '#4b4d52' }),
      circle(w * 0.3, h * 0.7, w * 0.12, { fill: '#4b4d52' }),
      circle(w * 0.7, h * 0.7, w * 0.12, { fill: '#4b4d52' }),
    ],
  },
  {
    id: 'sink',
    name: 'Kitchen Sink',
    category: 'kitchen',
    w: 80,
    h: 55,
    color: '#cfd4db',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 3 }),
      rect(w * 0.12, h * 0.2, w * 0.76, h * 0.6, { fill: c, brightness: -0.18, cornerRadius: 4 }),
    ],
  },
  {
    id: 'counter',
    name: 'Counter',
    category: 'kitchen',
    w: 150,
    h: 55,
    color: '#b8926a',
    draw: (w, h, c) => [rect(0, 0, w, h, { fill: c, cornerRadius: 2 })],
  },
  {
    id: 'toilet',
    name: 'Toilet',
    category: 'kitchen',
    w: 45,
    h: 70,
    color: '#eef1f5',
    draw: (w, h, c) => [
      rect(w * 0.15, 0, w * 0.7, h * 0.35, { fill: c, cornerRadius: 3 }),
      circle(w / 2, h * 0.62, w * 0.42, { fill: c }),
    ],
  },
  {
    id: 'bathtub',
    name: 'Bathtub',
    category: 'kitchen',
    w: 140,
    h: 70,
    color: '#e6eaf0',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 10 }),
      rect(w * 0.1, h * 0.15, w * 0.8, h * 0.7, { fill: c, brightness: -0.1, cornerRadius: 14 }),
    ],
  },
  {
    id: 'shower',
    name: 'Shower',
    category: 'kitchen',
    w: 70,
    h: 70,
    color: '#d7e3ea',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 3 }),
      circle(w / 2, h / 2, w * 0.12, { fill: c, brightness: -0.2 }),
    ],
  },

  // ---------------- Decor ----------------
  {
    id: 'rugrect',
    name: 'Area Rug',
    category: 'decor',
    w: 180,
    h: 120,
    color: '#c98b6b',
    draw: (w, h, c) => [
      rect(0, 0, w, h, { fill: c, cornerRadius: 2 }),
      rect(w * 0.08, h * 0.1, w * 0.84, h * 0.8, { fill: c, brightness: 0.18, cornerRadius: 2 }),
    ],
  },
  {
    id: 'ruground',
    name: 'Round Rug',
    category: 'decor',
    w: 130,
    h: 130,
    color: '#8bab8b',
    draw: (w, h, c) => [
      circle(w / 2, h / 2, w / 2, { fill: c }),
      circle(w / 2, h / 2, w / 2.6, { fill: c, brightness: 0.18 }),
    ],
  },
  {
    id: 'plant',
    name: 'Plant',
    category: 'decor',
    w: 44,
    h: 44,
    color: '#4c8f52',
    draw: (w, h, c) => [
      circle(w / 2, h / 2, w / 2, { fill: c }),
      circle(w / 2, h / 2, w / 4, { fill: c, brightness: -0.2 }),
    ],
  },
  {
    id: 'lamp',
    name: 'Floor Lamp',
    category: 'decor',
    w: 34,
    h: 34,
    color: '#e9c46a',
    draw: (w, h, c) => [
      circle(w / 2, h / 2, w / 2, { fill: c }),
      circle(w / 2, h / 2, w / 5, { fill: c, brightness: 0.25 }),
    ],
  },
  {
    id: 'piano',
    name: 'Piano',
    category: 'decor',
    w: 120,
    h: 100,
    color: '#26262b',
    draw: (w, h, c) => [
      rect(0, 0, w * 0.55, h, { fill: c, cornerRadius: 3 }),
      rect(w * 0.55, h * 0.1, w * 0.45, h * 0.55, { fill: c, cornerRadius: 30 }),
      rect(0, 0, w * 0.55, h * 0.18, { fill: '#f5f5f5' }),
    ],
  },
]

export const FURNITURE_BY_ID = Object.fromEntries(FURNITURE.map((f) => [f.id, f]))
