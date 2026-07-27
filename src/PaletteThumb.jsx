import React from 'react'
import { Stage, Layer } from 'react-konva'
import FurnitureShape from './FurnitureShape'

const BOX = 52

// Small preview of a furniture definition, scaled to fit a BOX x BOX area.
export default function PaletteThumb({ def }) {
  const pad = 8
  const scale = Math.min((BOX - pad) / def.w, (BOX - pad) / def.h)
  const w = def.w * scale
  const h = def.h * scale
  return (
    <Stage width={BOX} height={BOX} listening={false}>
      <Layer x={(BOX - w) / 2} y={(BOX - h) / 2}>
        <FurnitureShape def={def} w={w} h={h} color={def.color} />
      </Layer>
    </Stage>
  )
}
