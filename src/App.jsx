import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react'
import DesignCanvas from './DesignCanvas'
import PaletteThumb from './PaletteThumb'
import InspirationBoard from './InspirationBoard'
import { CATEGORIES, FURNITURE, FURNITURE_BY_ID } from './furniture'
import { loadState, saveState, uid, normalizeState } from './storage'
import { downscaleImage } from './image'

const SWATCHES = [
  '#7c8aa5', '#8d7b9c', '#a5846a', '#9c6f47', '#8a5a34',
  '#6b7280', '#3f4045', '#4c8f52', '#c98b6b', '#e9c46a',
  '#d3d7de', '#eef1f5', '#26262b', '#c0392b', '#2980b9',
]

function makeDefaultState() {
  return {
    floorPlanUrl: null,
    floorPlanName: null,
    showGrid: false,
    activePlanId: 'plan_1',
    plans: [{ id: 'plan_1', name: 'Plan A', items: [] }],
    inspiration: [],
  }
}

export default function App() {
  const [state, setState] = useState(() => normalizeState(loadState()) || makeDefaultState())
  const [selectedId, setSelectedId] = useState(null)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 })
  const [savedFlash, setSavedFlash] = useState(false)
  const [inspoOpen, setInspoOpen] = useState(false)
  const [inspoBusy, setInspoBusy] = useState(false)

  const canvasWrapRef = useRef(null)
  const stageRef = useRef(null)
  const fileInputRef = useRef(null)

  const activePlan = useMemo(
    () => state.plans.find((p) => p.id === state.activePlanId) || state.plans[0],
    [state],
  )
  const items = activePlan?.items || []
  const selectedItem = items.find((i) => i.id === selectedId) || null

  // Persist on every change.
  useEffect(() => {
    const ok = saveState(state)
    if (ok) {
      setSavedFlash(true)
      const t = setTimeout(() => setSavedFlash(false), 1200)
      return () => clearTimeout(t)
    }
  }, [state])

  // Measure the canvas container so the Stage fills available space.
  useLayoutEffect(() => {
    const el = canvasWrapRef.current
    if (!el) return
    const measure = () => {
      const rect = el.getBoundingClientRect()
      setCanvasSize({ w: Math.max(320, rect.width - 4), h: Math.max(320, rect.height - 4) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Keyboard: delete / duplicate / deselect.
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault()
        deleteItem(selectedId)
      } else if (e.key === 'Escape') {
        setSelectedId(null)
      } else if ((e.key === 'd' || e.key === 'D') && (e.metaKey || e.ctrlKey) && selectedItem) {
        e.preventDefault()
        duplicateItem()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedItem])

  // ---- plan-level item mutations ----
  function updatePlan(planId, updater) {
    setState((s) => ({
      ...s,
      plans: s.plans.map((p) => (p.id === planId ? updater(p) : p)),
    }))
  }

  function updateItems(updater) {
    updatePlan(state.activePlanId, (p) => ({ ...p, items: updater(p.items) }))
  }

  function addFurniture(def) {
    const newItem = {
      id: uid('it'),
      defId: def.id,
      x: canvasSize.w / 2 - def.w / 2,
      y: canvasSize.h / 2 - def.h / 2,
      w: def.w,
      h: def.h,
      rotation: 0,
      color: def.color,
    }
    updateItems((list) => [...list, newItem])
    setSelectedId(newItem.id)
  }

  function changeItem(next) {
    updateItems((list) => list.map((i) => (i.id === next.id ? next : i)))
  }

  function patchSelected(patch) {
    if (!selectedItem) return
    changeItem({ ...selectedItem, ...patch })
  }

  function deleteItem(id) {
    updateItems((list) => list.filter((i) => i.id !== id))
    setSelectedId(null)
  }

  function duplicateItem() {
    if (!selectedItem) return
    const copy = { ...selectedItem, id: uid('it'), x: selectedItem.x + 24, y: selectedItem.y + 24 }
    updateItems((list) => [...list, copy])
    setSelectedId(copy.id)
  }

  function reorderSelected(dir) {
    if (!selectedItem) return
    updateItems((list) => {
      const idx = list.findIndex((i) => i.id === selectedItem.id)
      if (idx < 0) return list
      const next = [...list]
      const [it] = next.splice(idx, 1)
      if (dir === 'front') next.push(it)
      else if (dir === 'back') next.unshift(it)
      else if (dir === 'up') next.splice(Math.min(list.length - 1, idx + 1), 0, it)
      else if (dir === 'down') next.splice(Math.max(0, idx - 1), 0, it)
      return next
    })
  }

  // ---- floor plan upload ----
  function onUploadClick() {
    fileInputRef.current?.click()
  }

  function onFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, etc.).')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setState((s) => ({ ...s, floorPlanUrl: reader.result, floorPlanName: file.name }))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function clearFloorPlan() {
    if (!confirm('Remove the floor plan? Your furniture layout stays.')) return
    setState((s) => ({ ...s, floorPlanUrl: null, floorPlanName: null }))
  }

  // ---- inspiration images ----
  async function addInspiration(files) {
    setInspoBusy(true)
    const added = []
    for (const file of files) {
      try {
        const url = await downscaleImage(file)
        added.push({ id: uid('insp'), name: file.name.replace(/\.[^.]+$/, ''), url })
      } catch (err) {
        console.warn('Skipped an image:', file.name, err)
      }
    }
    if (added.length) {
      // Try to save; if the quota is exceeded, roll back and warn.
      let rejected = false
      setState((s) => {
        const next = { ...s, inspiration: [...s.inspiration, ...added] }
        if (!saveState(next)) {
          rejected = true
          return s
        }
        return next
      })
      if (rejected) {
        alert(
          'Not enough browser storage to save these images. Try removing some inspiration pictures or using smaller files.',
        )
      }
    }
    setInspoBusy(false)
  }

  function removeInspiration(id) {
    setState((s) => ({ ...s, inspiration: s.inspiration.filter((img) => img.id !== id) }))
  }

  // ---- plan management ----
  function addPlan(clone = false) {
    const letter = String.fromCharCode(65 + state.plans.length)
    const newPlan = {
      id: uid('plan'),
      name: clone ? `${activePlan.name} copy` : `Plan ${letter}`,
      items: clone ? activePlan.items.map((i) => ({ ...i, id: uid('it') })) : [],
    }
    setState((s) => ({ ...s, plans: [...s.plans, newPlan], activePlanId: newPlan.id }))
    setSelectedId(null)
  }

  function renamePlan(id, name) {
    updatePlan(id, (p) => ({ ...p, name }))
  }

  function deletePlan(id) {
    if (state.plans.length === 1) {
      alert('Keep at least one design plan.')
      return
    }
    if (!confirm('Delete this design plan? This cannot be undone.')) return
    setState((s) => {
      const plans = s.plans.filter((p) => p.id !== id)
      const activePlanId = s.activePlanId === id ? plans[0].id : s.activePlanId
      return { ...s, plans, activePlanId }
    })
    setSelectedId(null)
  }

  function switchPlan(id) {
    setSelectedId(null)
    setState((s) => ({ ...s, activePlanId: id }))
  }

  function clearPlan() {
    if (!items.length) return
    if (!confirm('Remove all furniture from this plan?')) return
    updateItems(() => [])
    setSelectedId(null)
  }

  // ---- export ----
  function exportPng() {
    const prev = selectedId
    setSelectedId(null)
    setTimeout(() => {
      const uri = stageRef.current?.toDataURL({ pixelRatio: 2 })
      if (!uri) return
      const link = document.createElement('a')
      link.download = `${activePlan.name.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = uri
      link.click()
      setSelectedId(prev)
    }, 60)
  }

  const paletteItems = FURNITURE.filter((f) => f.category === activeCategory)

  return (
    <div className="app">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />

      {inspoOpen && (
        <InspirationBoard
          images={state.inspiration}
          onAdd={addInspiration}
          onRemove={removeInspiration}
          onClose={() => setInspoOpen(false)}
          busy={inspoBusy}
        />
      )}

      {/* Top bar */}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">◱</span>
          <div>
            <div className="brand-title">Interior Design Studio</div>
            <div className="brand-sub">
              {state.floorPlanName ? state.floorPlanName : 'No floor plan loaded'}
            </div>
          </div>
        </div>

        <div className="plan-tabs">
          {state.plans.map((p) => (
            <button
              key={p.id}
              className={`plan-tab ${p.id === state.activePlanId ? 'active' : ''}`}
              onClick={() => switchPlan(p.id)}
              onDoubleClick={() => {
                const name = prompt('Rename plan:', p.name)
                if (name) renamePlan(p.id, name.trim())
              }}
              title="Click to switch · double-click to rename"
            >
              {p.name}
            </button>
          ))}
          <button className="plan-add" onClick={() => addPlan(false)} title="New empty plan">
            +
          </button>
        </div>

        <div className="topbar-actions">
          <span className={`save-flash ${savedFlash ? 'show' : ''}`}>Saved</span>
          <button
            className="btn"
            onClick={() => setInspoOpen(true)}
            title="Upload and browse inspiration pictures"
          >
            Inspiration
            {state.inspiration.length > 0 && (
              <span className="count-badge">{state.inspiration.length}</span>
            )}
          </button>
          <button className="btn" onClick={() => addPlan(true)} title="Duplicate current plan">
            Duplicate plan
          </button>
          <button
            className="btn danger-ghost"
            onClick={() => deletePlan(state.activePlanId)}
            title="Delete current plan"
          >
            Delete plan
          </button>
          <button className="btn primary" onClick={exportPng}>
            Export PNG
          </button>
        </div>
      </header>

      <div className="workspace">
        {/* Left: furniture palette */}
        <aside className="palette">
          <div className="panel-title">Furniture</div>
          <div className="cat-tabs">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`cat-tab ${c.id === activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="palette-grid">
            {paletteItems.map((def) => (
              <button
                key={def.id}
                className="palette-item"
                onClick={() => addFurniture(def)}
                title={`Add ${def.name}`}
              >
                <PaletteThumb def={def} />
                <span>{def.name}</span>
              </button>
            ))}
          </div>
          <div className="palette-hint">Click an item to drop it on the plan.</div>
        </aside>

        {/* Center: canvas */}
        <main className="canvas-area">
          <div className="canvas-toolbar">
            <button className="btn" onClick={onUploadClick}>
              {state.floorPlanUrl ? 'Replace floor plan' : 'Upload floor plan'}
            </button>
            {state.floorPlanUrl && (
              <button className="btn ghost" onClick={clearFloorPlan}>
                Remove plan
              </button>
            )}
            <label className="toggle">
              <input
                type="checkbox"
                checked={state.showGrid}
                onChange={(e) => setState((s) => ({ ...s, showGrid: e.target.checked }))}
              />
              Grid
            </label>
            <div className="spacer" />
            <span className="item-count">{items.length} item{items.length === 1 ? '' : 's'}</span>
            <button className="btn ghost" onClick={clearPlan} disabled={!items.length}>
              Clear
            </button>
          </div>

          <div className="canvas-wrap" ref={canvasWrapRef}>
            {!state.floorPlanUrl && items.length === 0 && (
              <div className="empty-overlay">
                <div className="empty-card" onClick={onUploadClick}>
                  <div className="empty-icon">⬆</div>
                  <div className="empty-title">Upload a floor plan to begin</div>
                  <div className="empty-sub">
                    PNG, JPG, or any image. You can still place furniture on the blank grid.
                  </div>
                </div>
              </div>
            )}
            <DesignCanvas
              ref={stageRef}
              size={canvasSize}
              floorPlanUrl={state.floorPlanUrl}
              items={items}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={changeItem}
              showGrid={state.showGrid || !state.floorPlanUrl}
            />
          </div>
        </main>

        {/* Right: properties */}
        <aside className="props">
          {!selectedItem ? (
            <div className="props-empty">
              <div className="panel-title">Properties</div>
              <p className="muted">
                Select a piece of furniture to change its color, size, and rotation.
              </p>
              <ul className="tips">
                <li>Drag items to move them.</li>
                <li>Use corner handles to resize, the top handle to rotate.</li>
                <li><kbd>Del</kbd> removes the selection.</li>
                <li>Create multiple <b>Plans</b> to compare layouts on the same floor plan.</li>
              </ul>
            </div>
          ) : (
            <div className="props-body">
              <div className="panel-title">{FURNITURE_BY_ID[selectedItem.defId]?.name}</div>

              <div className="field">
                <label>Color</label>
                <div className="swatches">
                  {SWATCHES.map((c) => (
                    <button
                      key={c}
                      className={`swatch ${selectedItem.color === c ? 'active' : ''}`}
                      style={{ background: c }}
                      onClick={() => patchSelected({ color: c })}
                    />
                  ))}
                  <label className="swatch custom" title="Custom color">
                    <input
                      type="color"
                      value={selectedItem.color}
                      onChange={(e) => patchSelected({ color: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Width</label>
                  <input
                    type="number"
                    min="16"
                    value={Math.round(selectedItem.w)}
                    onChange={(e) => patchSelected({ w: Math.max(16, Number(e.target.value) || 16) })}
                  />
                </div>
                <div className="field">
                  <label>Height</label>
                  <input
                    type="number"
                    min="16"
                    value={Math.round(selectedItem.h)}
                    onChange={(e) => patchSelected({ h: Math.max(16, Number(e.target.value) || 16) })}
                  />
                </div>
              </div>

              <div className="field">
                <label>Rotation · {Math.round(selectedItem.rotation)}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={Math.round(selectedItem.rotation) % 360}
                  onChange={(e) => patchSelected({ rotation: Number(e.target.value) })}
                />
              </div>

              <div className="btn-group">
                <button className="btn small" onClick={() => reorderSelected('front')}>Bring front</button>
                <button className="btn small" onClick={() => reorderSelected('back')}>Send back</button>
              </div>
              <div className="btn-group">
                <button className="btn small" onClick={duplicateItem}>Duplicate</button>
                <button className="btn small danger" onClick={() => deleteItem(selectedItem.id)}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
