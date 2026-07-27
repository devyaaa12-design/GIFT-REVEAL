import React from 'react'
import { Rect, Circle, Line } from 'react-konva'
import { shade } from './color'

// Render the array of shape descriptors returned by a furniture item's draw().
// `def` is the catalog entry, `w`/`h` the current footprint, `color` the tint.
export default function FurnitureShape({ def, w, h, color }) {
  const shapes = def.draw(w, h, color)

  return (
    <>
      {shapes.map((s, i) => {
        const fill = s.fill
          ? s.brightness
            ? shade(s.fill, s.brightness)
            : s.fill
          : undefined
        const stroke = s.stroke
          ? s.strokeBrightness
            ? shade(s.stroke, s.strokeBrightness)
            : s.stroke
          : undefined

        if (s.type === 'rect') {
          return (
            <Rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              fill={fill}
              stroke={stroke}
              strokeWidth={s.strokeWidth}
              cornerRadius={s.cornerRadius}
              listening={false}
            />
          )
        }
        if (s.type === 'circle') {
          return (
            <Circle
              key={i}
              x={s.x}
              y={s.y}
              radius={s.r}
              fill={fill}
              stroke={stroke}
              strokeWidth={s.strokeWidth}
              listening={false}
            />
          )
        }
        if (s.type === 'line') {
          return (
            <Line
              key={i}
              points={s.points}
              stroke={stroke || fill}
              strokeWidth={s.strokeWidth || 2}
              lineCap="round"
              listening={false}
            />
          )
        }
        return null
      })}
    </>
  )
}
