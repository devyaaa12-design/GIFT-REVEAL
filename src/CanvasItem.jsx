import React, { useRef, useEffect } from 'react'
import { Group, Transformer } from 'react-konva'
import FurnitureShape from './FurnitureShape'
import { FURNITURE_BY_ID } from './furniture'

// A single placed furniture object on the canvas.
// `item` shape: { id, defId, x, y, w, h, rotation, color }
export default function CanvasItem({ item, isSelected, onSelect, onChange }) {
  const groupRef = useRef(null)
  const trRef = useRef(null)
  const def = FURNITURE_BY_ID[item.defId]

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  if (!def) return null

  return (
    <>
      <Group
        ref={groupRef}
        x={item.x}
        y={item.y}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ ...item, x: e.target.x(), y: e.target.y() })
        }}
        onTransformEnd={() => {
          const node = groupRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          // Bake scale into width/height so strokes stay crisp.
          node.scaleX(1)
          node.scaleY(1)
          onChange({
            ...item,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            w: Math.max(16, item.w * scaleX),
            h: Math.max(16, item.h * scaleY),
          })
        }}
      >
        <FurnitureShape def={def} w={item.w} h={item.h} color={item.color} />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          anchorStroke="#6366f1"
          anchorFill="#fff"
          anchorSize={9}
          borderStroke="#6366f1"
          borderDash={[4, 4]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 16 || newBox.height < 16) return oldBox
            return newBox
          }}
        />
      )}
    </>
  )
}
