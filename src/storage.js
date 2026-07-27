// LocalStorage-backed persistence for design projects.
// A project = one floor plan plus multiple named design "plans" (layouts).

const KEY = 'interior-design-studio:v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch (e) {
    // Most likely quota exceeded (large floor plan data URL).
    console.warn('Could not save state:', e)
    return false
  }
}

// Simple unique id without external deps.
export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${(performance.now() | 0).toString(36)}`
}
