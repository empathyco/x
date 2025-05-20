import { getDefaultHeaders } from '../utils'

describe('utils tests', () => {
  describe('getDefaultHeaders', () => {
    const globThis = globalThis as unknown as { window?: Window; location?: Location }
    // Store original properties
    let originalWindow: Window | undefined
    let originalLocation: Location | undefined

    beforeEach(() => {
      // Save original window and location objects before each test
      originalWindow = globThis.window
      originalLocation = globThis.location
    })

    afterEach(() => {
      // Restore original window and location after each test
      if (originalWindow === undefined) {
        delete globThis.window
      } else {
        globThis.window = originalWindow
      }

      if (originalLocation === undefined) {
        delete globThis.location
      } else {
        globThis.location = originalLocation
      }
    })

    it('should return headers with x-origin set to location.origin in browser environment', () => {
      // Mock browser environment
      globThis.window = {} as Window & typeof globalThis

      // Create a mock location object with a getter for origin
      Object.defineProperty(globThis, 'location', {
        value: { origin: 'https://test.example.com' },
        writable: true,
      })

      const headers = getDefaultHeaders()

      expect(headers).toEqual({
        'x-origin': 'https://test.example.com',
      })
    })

    it('should return headers with x-origin set to fallback string in non-browser environment', () => {
      // Mock non-browser environment
      delete globThis.window
      delete globThis.location

      const headers = getDefaultHeaders()

      expect(headers).toEqual({
        'x-origin': 'non-browser',
      })
    })
  })
})
