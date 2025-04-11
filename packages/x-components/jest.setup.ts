import '@testing-library/jest-dom/extend-expect'

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Disable console warnings to reduce noise overwriting entirely modules in the store
console.warn = () => {}
