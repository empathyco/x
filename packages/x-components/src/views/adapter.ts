import type { PlatformAdapter } from '@empathyco/x-adapter-platform'
import { platformAdapter } from '@empathyco/x-adapter-platform'

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) => obj[prop],
})
