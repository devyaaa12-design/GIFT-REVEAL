# Interior Design Studio

Upload a floor plan and test different interior design layouts right in your browser.
No sign-in, no backend — everything runs locally and is saved to your browser storage.

![Interior Design Studio](public/favicon.svg)

## Features

- **Upload a floor plan** — drop in any PNG/JPG image of your floor plan and it becomes the canvas background (scaled to fit).
- **Furniture library** — 30+ top-down furniture pieces across Seating, Tables, Beds, Storage, Kitchen & Bath, and Decor. Click to place.
- **Full editing** — drag to move, corner handles to resize, top handle to rotate (with 45° snapping). Recolor with swatches or a custom color picker, and enter exact width/height/rotation values.
- **Layering** — bring furniture to the front or send it to the back.
- **Multiple design plans** — create several named layouts (Plan A, Plan B, …) over the *same* floor plan and switch between them to compare. Duplicate a plan to iterate on a variation.
- **Inspiration board** — upload reference/mood-board photos (room shots, color palettes, design ideas), browse them in a gallery, and open any one full-screen in a lightbox with keyboard navigation. Images are downscaled automatically before saving so they don't blow the storage quota.
- **Auto-save** — your floor plan and every plan are persisted to `localStorage`, so your work is still there when you come back.
- **Export** — download the current plan as a high-resolution PNG.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to <http://localhost:5173>).

To build a production bundle:

```bash
npm run build
npm run preview
```

## How to use it

1. Click **Upload floor plan** (or the drop card in the center) and pick an image of your floor plan.
2. Pick a category on the left, then click furniture to drop it onto the plan.
3. Select any piece to move, resize, rotate, recolor, or delete it.
4. Use the **plan tabs** at the top to create and compare alternative layouts. Double-click a tab to rename it.
5. Click **Inspiration** in the top bar to upload reference pictures and browse them in a gallery / lightbox while you design.
6. Click **Export PNG** to save the design.

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Delete` / `Backspace` | Delete the selected item |
| `Ctrl/Cmd + D` | Duplicate the selected item |
| `Esc` | Deselect |

## Tech

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [react-konva](https://konvajs.org/docs/react/) for the interactive canvas (drag, resize, rotate)
- Furniture is drawn procedurally as top-down vector shapes, so it stays crisp at any size and any color.

## Notes

Because everything is stored in `localStorage`, very large floor plan images may exceed the browser's storage quota. If a save fails, try a smaller/compressed image.
