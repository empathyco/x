import { vi } from 'vitest'

window.ResizeObserver = class {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// Disable console warnings to reduce noise overwriting entirely modules in the store
console.warn = () => {}
