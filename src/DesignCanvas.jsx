import React, { useEffect, useState, forwardRef } from 'react'
import { Stage, Layer, Rect, Image as KonvaImage, Line, Group } from 'react-konva'
import CanvasItem from './CanvasItem'

// Loads an image URL into an HTMLImageElement for Konva.
function useImage(url) {
  const [img, setImg] = useState(null)
  useEffect(() => {
    if (!url) {
      setImg(null)
      return
    }
    const image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.src = url
    image.onload = () => setImg(image)
    return () => {
      image.onload = null
    }
  }, [url])
  return img
}

// Fit an image into the stage while preserving aspect ratio.
function fitContain(imgW, imgH, boxW, boxH) {
  const scale = Math.min(boxW / imgW, boxH / imgH)
  const w = imgW * scale
  const h = imgH * scale
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h }
}

const GRID = 40

const DesignCanvas = forwardRef(function DesignCanvas(
  { size, floorPlanUrl, items, selectedId, onSelect, onChange, showGrid },
  stageRef,
) {
  const bg = useImage(floorPlanUrl)
  const placement = bg ? fitContain(bg.width, bg.height, size.w, size.h) : null

  const gridLines = []
  if (showGrid) {
    for (let x = 0; x <= size.w; x += GRID) {
      gridLines.push(
        <Line key={`v${x}`} points={[x, 0, x, size.h]} stroke="#e2e6ee" strokeWidth={1} listening={false} />,
      )
    }
    for (let y = 0; y <= size.h; y += GRID) {
      gridLines.push(
        <Line key={`h${y}`} points={[0, y, size.w, y]} stroke="#e2e6ee" strokeWidth={1} listening={false} />,
      )
    }
  }

  return (
    <Stage
      ref={stageRef}
      width={size.w}
      height={size.h}
      onMouseDown={(e) => {
        // Click on empty canvas clears selection.
        if (e.target === e.target.getStage()) onSelect(null)
      }}
      onTouchStart={(e) => {
        if (e.target === e.target.getStage()) onSelect(null)
      }}
    >
      <Layer listening={false}>
        <Rect x={0} y={0} width={size.w} height={size.h} fill="#f7f8fb" />
        {bg && placement && (
          <KonvaImage image={bg} x={placement.x} y={placement.y} width={placement.w} height={placement.h} />
        )}
        {!bg && <Group>{gridLines}</Group>}
        {bg && showGrid && <Group>{gridLines}</Group>}
      </Layer>
      <Layer>
        {items.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            isSelected={item.id === selectedId}
            onSelect={() => onSelect(item.id)}
            onChange={onChange}
          />
        ))}
      </Layer>
    </Stage>
  )
})

export default DesignCanvas
