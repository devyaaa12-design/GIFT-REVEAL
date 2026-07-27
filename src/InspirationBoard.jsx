import React, { useEffect, useRef, useState } from 'react'

// Modal mood board: upload, browse, and enlarge inspiration images.
// `images` shape: [{ id, name, url }]
export default function InspirationBoard({ images, onAdd, onRemove, onClose, busy }) {
  const fileRef = useRef(null)
  const [lightbox, setLightbox] = useState(null) // index or null

  // Escape closes the lightbox first, then the board.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightbox !== null) setLightbox(null)
        else onClose()
      } else if (lightbox !== null && images.length) {
        if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % images.length)
        if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + images.length) % images.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, images, onClose])

  function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (files.length) onAdd(files)
    e.target.value = ''
  }

  const current = lightbox !== null ? images[lightbox] : null

  return (
    <>
      <div className="modal-backdrop" onMouseDown={onClose}>
        <div className="modal inspo-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">Inspiration board</div>
            <div className="modal-sub">
              {images.length} image{images.length === 1 ? '' : 's'} · reference photos for this project
            </div>
          </div>
          <div className="modal-head-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFiles}
            />
            <button className="btn primary" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? 'Adding…' : 'Add images'}
            </button>
            <button className="btn ghost" onClick={onClose} aria-label="Close">✕</button>
          </div>
        </div>

        <div className="inspo-body">
          {images.length === 0 ? (
            <div
              className="inspo-empty"
              onClick={() => fileRef.current?.click()}
            >
              <div className="empty-icon">🖼️</div>
              <div className="empty-title">Add inspiration pictures</div>
              <div className="empty-sub">
                Upload room photos, color palettes, or design references. They're saved with your
                project so you can look back at them while you arrange furniture.
              </div>
            </div>
          ) : (
            <div className="inspo-grid">
              {images.map((img, i) => (
                <figure className="inspo-tile" key={img.id}>
                  <button className="inspo-open" onClick={() => setLightbox(i)} title="View larger">
                    <img src={img.url} alt={img.name} loading="lazy" />
                  </button>
                  <figcaption title={img.name}>{img.name}</figcaption>
                  <button
                    className="inspo-remove"
                    onClick={() => onRemove(img.id)}
                    title="Remove"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </figure>
              ))}
              <button className="inspo-add-tile" onClick={() => fileRef.current?.click()} disabled={busy}>
                <span className="plus">+</span>
                <span>{busy ? 'Adding…' : 'Add more'}</span>
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {current && (
        <div className="lightbox" onMouseDown={() => setLightbox(null)}>
          {images.length > 1 && (
            <button
              className="lb-nav lb-prev"
              onMouseDown={(e) => {
                e.stopPropagation()
                setLightbox((i) => (i - 1 + images.length) % images.length)
              }}
              aria-label="Previous"
            >
              ‹
            </button>
          )}
          <figure className="lb-figure" onMouseDown={(e) => e.stopPropagation()}>
            <img src={current.url} alt={current.name} />
            <figcaption>
              {current.name} · {lightbox + 1} / {images.length}
            </figcaption>
          </figure>
          {images.length > 1 && (
            <button
              className="lb-nav lb-next"
              onMouseDown={(e) => {
                e.stopPropagation()
                setLightbox((i) => (i + 1) % images.length)
              }}
              aria-label="Next"
            >
              ›
            </button>
          )}
          <button className="lb-close" onMouseDown={() => setLightbox(null)} aria-label="Close">
            ✕
          </button>
        </div>
      )}
    </>
  )
}
